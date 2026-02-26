import { useState, useRef, useEffect } from 'react';
import MessageStatus from '../../common/MessageStatus';
import { Messages } from '../../../../interfaces/commonTypes';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import UserRootState from '../../../../redux/rootstate/UserState';
import { deleteForEveryone, deleteForMe } from '../../../../config/services/chatApi';
import { HiDotsVertical } from 'react-icons/hi';

interface Props {
  message: Partial<Messages>;
  own: boolean;
  onRetry?: () => void;
  onMessageDeleted?: (msgId: string, type: 'everyone' | 'me') => void;
}

const Message = ({ message, own, onRetry, onMessageDeleted }: Props) => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const formatTime = (timestamp: number | Date | undefined) => {
    if (!timestamp) return '';
    return dayjs(timestamp).format('h:mm A');
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteForEveryone = async () => {
    if (!message.id) return;
    try {
      await deleteForEveryone('user', { msgId: message.id });
      onMessageDeleted?.(message.id, 'everyone');
    } catch (err) {
      console.error('Delete for everyone failed:', err);
    }
    setShowMenu(false);
  };

  const handleDeleteForMe = async () => {
    if (!message.id || !user?.id) return;
    try {
      await deleteForMe('user', { msgId: message.id, id: user.id });
      onMessageDeleted?.(message.id, 'me');
    } catch (err) {
      console.error('Delete for me failed:', err);
    }
    setShowMenu(false);
  };

  if (message.isDeleted) {
    return (
      <div className={`flex ${own ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className="italic text-gray-400 text-sm px-3 py-1 bg-gray-100 rounded-lg">
          {own ? 'You deleted this message' : 'This message was deleted'}
        </div>
      </div>
    );
  }

  if (message.deletedIds?.includes(user?.id!)) {
    return null;
  }

  return (
    <div className={`flex ${own ? 'justify-end' : 'justify-start'} mb-3 group`}>
      <div className={`max-w-[70%] ${own ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className="flex items-end gap-1">
          {/* ✅ Delete menu — shown on hover */}
          <div className="relative opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
            >
              <HiDotsVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className={`absolute bottom-6 ${own ? 'right-0' : 'left-0'} bg-white rounded-lg shadow-lg border z-50 min-w-[160px]`}>
                {/* Delete for me — always available */}
                <button
                  onClick={handleDeleteForMe}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Delete for me
                </button>
                {/* Delete for everyone — only for own messages */}
                {own && (
                  <button
                    onClick={handleDeleteForEveryone}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete for everyone
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={`px-4 py-2 rounded-lg break-words ${
              own
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
            } ${message.status === 'failed' ? 'opacity-50' : ''}`}
          >
            {message.imageUrl ? (
              <img
                src={message.imageUrl}
                alt="Attachment"
                className="max-w-xs rounded-lg cursor-pointer hover:opacity-90"
                onClick={() => window.open(message.imageUrl, '_blank')}
              />
            ) : (
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            )}
          </div>
        </div>

        {/* Timestamp & Status */}
        <div className={`flex items-center mt-1 ${own ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
          {own && (
            <MessageStatus
              status={message.status}
              isRead={message.isRead}
              onRetry={onRetry}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;