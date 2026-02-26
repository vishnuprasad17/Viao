import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IconButton, Button, Spinner } from "@material-tailwind/react";
import { IoSendSharp, IoClose } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { RiMenu2Fill } from "react-icons/ri";
import { AiOutlineFileImage } from "react-icons/ai";
import { CiHome } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";

import UserRootState from "../../../redux/rootstate/UserState";
import { USER } from "../../../config/routes/user.routes";
import { useChat } from "../../../hooks/useChat";
import { getChat, changeReadStatus } from "../../../config/services/chatApi";
import { getVendorForChat } from "../../../config/services/userApi";
import { uploadImageToS3 } from "../../../config/services/uploadService";

import Conversation from "../../../components/chat/user/sidebar/Conversation";
import Message from "../../../components/chat/user/messages/Message";
import MessageSkeleton from "../../../components/chat/skeletons/MessageSkeleton";
import TypingIndicator from "../../../components/chat/common/TypingIndicator";
import ConnectionStatus from "../../../components/chat/common/ConnectionStatus";
import { Chats } from "../../../interfaces/commonTypes";
import { VendorData } from "../../../interfaces/vendorTypes";

const Chat = () => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Chats[]>([]);
  const [currentChat, setCurrentChat] = useState<Chats | null>(null);
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const {
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
  } = useChat({
    role: 'user',
    currentChat,
    userId: user?.id,
  });

  const receiverId = useMemo(() => {
    return currentChat?.members.find((m) => m !== user?.id) || null;
  }, [currentChat, user?.id]);

  const isReceiverOnline = useMemo(() => {
    return receiverId ? onlineStatus[receiverId] : false;
  }, [receiverId, onlineStatus]);

  // Load conversations
  useEffect(() => {
    if (!user?.id) return;

    const loadConversations = async () => {
      try {
        const res = await getChat(user.id, 'user');
        setConversations(res.data || []);
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error('Failed to load conversations');
      }
    };

    loadConversations();
  }, [user?.id]);

  // Load vendor data when chat changes
  useEffect(() => {
    if (!receiverId) {
      setVendor(null);
      return;
    }

    const loadVendor = async () => {
      try {
        const res = await getVendorForChat(receiverId);
        setVendor(res.data.data);
      } catch (error) {
        console.error('Error loading vendor:', error);
      }
    };

    loadVendor();
  }, [receiverId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    handleTypingStart();
  };

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    sendTextMessage(newMessage);
    setNewMessage('');
    handleTypingStop();
    
    // Refetch conversations to update recent message
    if (user?.id) {
      const res = await getChat(user.id, 'user');
      setConversations(res.data || []);
    }
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // Handle image upload
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG, GIF, and WebP images are supported');
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadImageToS3(file, 'user');
      sendImageMessage(imageUrl);
      
      // Refetch conversations
      if (user?.id) {
        const res = await getChat(user.id, 'user');
        setConversations(res.data || []);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle conversation selection
  const handleConversationSelect = async (chat: Chats) => {
    setCurrentChat(chat);
    setIsSidebarOpen(false);

    // Mark as read
    try {
      await changeReadStatus(
        'user',
        {
        chatId: chat.id,
        viewerId: user?.id,
      });
      
      // Update conversations list
      if (user?.id) {
        const res = await getChat(user.id, 'user');
        setConversations(res.data || []);
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMessageDeleted = async (msgId: string, type: 'everyone' | 'me') => {
    updateMessageLocally(msgId, type);

    try {
      const res = await getChat(user?.id, 'user');
      setConversations(res.data || []);
    } catch (err) {
      console.error('Failed to refresh conversations after delete:', err);
    }
  };

  // Handle Enter key for sending
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  // Infinite scroll for message pagination
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (container.scrollTop === 0 && hasMore && !isLoading) {
      const previousScrollHeight = container.scrollHeight;
      
      loadMoreMessages().then(() => {
        // Maintain scroll position
        requestAnimationFrame(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - previousScrollHeight;
          }
        });
      });
    }
  };

  if (conversations.length === 0 && !user?.id) {
    return <MessageSkeleton />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Connection Status Banner */}
      {!isConnected && <ConnectionStatus />}

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 absolute md:relative z-10 transition-transform duration-300 ease-in-out h-full`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Chats</h2>
            <Link to={USER.HOME}>
              <IconButton variant="text" className="p-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <CiHome className="w-5 h-5" />
              </IconButton>
            </Link>
            <Link to={USER.PROFILE}>
              <IconButton variant="text" className="p-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <CgProfile className="w-5 h-5" />
              </IconButton>
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-73px)]">
          {conversations.map((chat) => (
            <div key={chat.id} onClick={() => handleConversationSelect(chat)}>
              <Conversation
                conversation={chat}
                currentUser={user}
                currentchat={currentChat}
                onlineStatus={onlineStatus}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!currentChat ? (
          <div className="flex flex-col justify-center items-center h-full">
            <MessageSkeleton />
            {isMobile && (
              <Button onClick={() => setIsSidebarOpen(true)} className="mt-4" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Show Chats
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center">
                <button className="md:hidden mr-4" onClick={() => setIsSidebarOpen(true)}>
                  <RiMenu2Fill className="w-6 h-6" />
                </button>
                <img
                  src={vendor?.logoUrl || '/default-avatar.png'}
                  alt={vendor?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h2 className="font-semibold">{vendor?.name}</h2>
                  <div className="text-sm text-gray-500 flex items-center">
                    {isReceiverOnline ? (
                      <>Active now <span className="ml-1 w-2 h-2 bg-green-500 rounded-full" /></>
                    ) : (
                      <>Offline <span className="ml-1 w-2 h-2 bg-gray-400 rounded-full" /></>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col"
            >
              {isLoading && (
                <div className="flex justify-center py-4">
                  <Spinner className="h-8 w-8" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </div>
              )}

              {messages.map((msg, index) => (
                <Message
                  key={msg.id || msg.tempId || index}
                  message={msg}
                  own={msg.senderId === user?.id}
                  onRetry={() => msg.tempId && retryMessage(msg.tempId)}
                  onMessageDeleted={handleMessageDeleted}
                />
              ))}

              {isTyping && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="relative p-4 bg-white border-t">
              <div className="flex items-end space-x-2">
                {/* Emoji Picker */}
                <IconButton
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  variant="text"
                  className="p-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <BsEmojiSmile className="w-6 h-6" />
                </IconButton>

                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-0 z-50">
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.LIGHT} />
                  </div>
                )}

                {/* Image Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  variant="text"
                  disabled={uploadingImage}
                  className="p-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {uploadingImage ? (
                    <Spinner className="h-5 w-5" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                  ) : (
                    <AiOutlineFileImage className="w-6 h-6" />
                  )}
                </IconButton>

                {/* Message Input */}
                <textarea
                  ref={inputRef}
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  onBlur={handleTypingStop}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-lg resize-none max-h-32"
                  rows={1}
                />

                {/* Send Button */}
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                  className="p-2 bg-blue-500 text-white"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <IoSendSharp className="w-5 h-5" />
                </IconButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;