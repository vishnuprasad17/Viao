import { useState, useEffect, useCallback, useRef } from 'react';
import { useGlobalSocket } from '../context/SocketContext';
import { getMessages, sendMessage as sendMessageAPI, changeReadStatus } from '../config/services/chatApi';
import { Messages, Chats } from '../interfaces/commonTypes';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

interface UseChatProps {
  role: 'user' | 'vendor';
  currentChat: Chats | null;
  userId: string | undefined;
}

interface MessageWithStatus extends Partial<Messages> {
  tempId?: string;
  status?: 'sending' | 'sent' | 'failed';
  retryCount?: number;
}

export const useChat = ({ role, currentChat, userId }: UseChatProps) => {
  const [messages, setMessages] = useState<MessageWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState<Record<string, boolean>>({});

  const { socket, isConnected } = useGlobalSocket();
  const messageQueueRef = useRef<MessageWithStatus[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const pendingTempIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!currentChat?.id || !userId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const response = await getMessages(role, currentChat.id);
        setMessages(response.data.data || []);
        setPage(1);
        setHasMore((response.data?.data?.length ?? 0) >= 50);

        // Mark messages as read when opening chat (bulk read for all received messages)
        await changeReadStatus(role, {
          chatId: currentChat.id,
          viewerId: userId,
        });
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [currentChat?.id, userId]);

  // ── Request current active status whenever socket connects ───────────────
  useEffect(() => {
    if (!socket || !isConnected) return;
    socket.emit('getActiveUsers');
  }, [socket, isConnected]);

  // ── Socket event listeners ────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !currentChat) return;

    const handleMessage = (data: Partial<Messages>) => {
      if (!currentChat.members.includes(data.senderId!)) return;

      setMessages((prev) => {
        if (data.id && prev.some((m) => m.id === data.id)) return prev;

        if (data.conversationId) {
          const matchIndex = prev.findIndex(
            (m) => m.tempId && m.senderId === data.senderId && m.text === data.text && m.status === 'sending'
          );
          if (matchIndex !== -1) {
            const updated = [...prev];
            updated[matchIndex] = { ...data, status: 'sent' };
            return updated;
          }
        }

        return [...prev, { ...data, status: 'sent' }];
      });

      // Emit socket read receipt only for incoming messages
      if (data.senderId !== userId && data.id) {
        socket.emit('messageRead', {
          messageId: data.id,
          senderId: data.senderId,
          userId,
        });
      }
    };

    const handleMessageFailed = (data: { tempId: string; error: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === data.tempId ? { ...msg, status: 'failed' } : msg
        )
      );
      pendingTempIds.current.delete(data.tempId);
      toast.error('Message failed to send');
    };

    const handleTyping = (data: { userId: string; chatId: string; isTyping: boolean }) => {
      if (data.chatId === currentChat.id && data.userId !== userId) {
        setIsTyping(data.isTyping);
        if (data.isTyping) {
          setTimeout(() => setIsTyping(false), 4000);
        }
      }
    };

    const handleOnlineStatus = (users: { userId: string; active: boolean }[]) => {
      const statusMap: Record<string, boolean> = {};
      users.forEach((user) => {
        statusMap[user.userId] = user.active;
      });
      setOnlineStatus(statusMap);
    };

    // Mark all messages from sender as read (bulk)
    const handleMessageRead = (data: { messageId: string; userId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId || msg.senderId === userId
            ? { ...msg, isRead: true }
            : msg
        )
      );
    };

    socket.on('getMessage', handleMessage);
    socket.on('messageFailed', handleMessageFailed);
    socket.on('typing', handleTyping);
    socket.on('activeStatus', handleOnlineStatus);
    socket.on('messageRead', handleMessageRead);

    return () => {
      socket.off('getMessage', handleMessage);
      socket.off('messageFailed', handleMessageFailed);
      socket.off('typing', handleTyping);
      socket.off('activeStatus', handleOnlineStatus);
      socket.off('messageRead', handleMessageRead);
    };
  }, [socket, currentChat, userId]);

  // ── Flush queued messages when connection restores ────────────────────────
  useEffect(() => {
    if (isConnected && messageQueueRef.current.length > 0) {
      const queue = [...messageQueueRef.current];
      messageQueueRef.current = [];
      queue.forEach((message) => sendMessageInternal(message));
    }
  }, [isConnected]);

  // ── Cleanup typing timeout on unmount ─────────────────────────────────────
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // ── Internal send — socket for real-time, REST for persistence ────────────
  const sendMessageInternal = useCallback(
    async (message: MessageWithStatus) => {
      if (!currentChat || !userId) return;

      const receiverId = currentChat.members.find((m) => m !== userId);
      if (!receiverId) return;

      // Guard: don't double-send if already in-flight
      if (message.tempId && pendingTempIds.current.has(message.tempId)) return;
      if (message.tempId) pendingTempIds.current.add(message.tempId);

      // Persist to DB via REST (single source of truth)
      try {
        const response = await sendMessageAPI(role, {
          senderId: userId,
          text: message.text || '',
          conversationId: currentChat.id,
          imageUrl: message.imageUrl || '',
        });

        const savedMessage = response.data;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.tempId === message.tempId
              ? { ...savedMessage, status: 'sent' }
              : msg
          )
        );

        // Notify receiver via socket (real-time delivery only, not persistence)
        socket?.emit('sendMessage', {
          tempId: message.tempId,
          senderId: userId,
          receiverId,
          text: message.text || '',
          imageUrl: message.imageUrl || '',
          conversationId: currentChat.id,
          id: savedMessage.id,
        });
      } catch (error) {
        console.error('REST persist error:', error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.tempId === message.tempId ? { ...msg, status: 'failed' } : msg
          )
        );
      } finally {
        if (message.tempId) pendingTempIds.current.delete(message.tempId);
      }
    },
    [currentChat, userId, socket, role]
  );

  // ── Public API ────────────────────────────────────────────────────────────
  const sendTextMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !currentChat || !userId) return;

      const tempId = uuidv4();
      const optimisticMessage: MessageWithStatus = {
        tempId,
        senderId: userId,
        text: text.trim(),
        createdAt: Date.now(),
        status: 'sending',
        isRead: false,
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      if (isConnected) {
        sendMessageInternal(optimisticMessage);
      } else {
        messageQueueRef.current.push(optimisticMessage);
        toast.info('Message queued. Will send when connection is restored.');
      }
    },
    [currentChat, userId, isConnected, sendMessageInternal]
  );

  const sendImageMessage = useCallback(
    (imageUrl: string) => {
      if (!imageUrl || !currentChat || !userId) return;

      const tempId = uuidv4();
      const optimisticMessage: MessageWithStatus = {
        tempId,
        senderId: userId,
        text: '',
        imageUrl,
        createdAt: Date.now(),
        status: 'sending',
        isRead: false,
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      if (isConnected) {
        sendMessageInternal(optimisticMessage);
      } else {
        messageQueueRef.current.push(optimisticMessage);
        toast.info('Image queued. Will send when connection is restored.');
      }
    },
    [currentChat, userId, isConnected, sendMessageInternal]
  );

  const retryMessage = useCallback(
    (tempId: string) => {
      const message = messages.find((m) => m.tempId === tempId);
      if (message) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.tempId === tempId ? { ...msg, status: 'sending' } : msg
          )
        );
        sendMessageInternal(message);
      }
    },
    [messages, sendMessageInternal]
  );

  const updateMessageLocally = useCallback(
    (msgId: string, type: 'everyone' | 'me') => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== msgId) return msg;
          if (type === 'everyone') return { ...msg, isDeleted: true };
          if (type === 'me') return { ...msg, deletedIds: [...(msg.deletedIds || []), userId!] };
          return msg;
        })
      );
    },
    [userId]
  );

  const emitTyping = useCallback(
    (typing: boolean) => {
      if (!currentChat || !userId || !socket) return;
      const receiverId = currentChat.members.find((m) => m !== userId);
      if (!receiverId) return;
      socket.emit('typing', {
        senderId: userId,
        receiverId,
        chatId: currentChat.id,
        isTyping: typing,
      });
    },
    [currentChat, userId, socket]
  );

  const handleTypingStart = useCallback(() => {
    emitTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => emitTyping(false), 3000);
  }, [emitTyping]);

  const handleTypingStop = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    emitTyping(false);
  }, [emitTyping]);

  const loadMoreMessages = useCallback(async () => {
    if (!currentChat?.id || isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const response = await getMessages(role, currentChat.id, nextPage);
      const newMessages = response.data?.data || [];
      if (newMessages.length > 0) {
        setMessages((prev) => [...newMessages, ...prev]);
        setPage(nextPage);
        setHasMore(newMessages.length >= 50);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentChat?.id, page, isLoading, hasMore, role]);

  return {
    messages,
    isLoading,
    hasMore,
    isTyping,
    onlineStatus,
    isConnected,
    sendTextMessage,
    sendImageMessage,
    retryMessage,
    handleTypingStart,
    handleTypingStop,
    loadMoreMessages,
    updateMessageLocally,
  };
};