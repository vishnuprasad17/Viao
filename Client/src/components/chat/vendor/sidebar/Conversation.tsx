import { Link } from 'react-router-dom';
import { getUserForChat } from '../../../../config/services/venderApi';
import { useEffect, useState } from 'react';
import { Chats } from '../../../../interfaces/commonTypes';
import { VendorData } from '../../../../interfaces/vendorTypes';
import { UserData } from '../../../../interfaces/userTypes';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface ConversationsProps {
    conversation: Chats;
    currentUser: Partial<VendorData | null>;
    currentchat: Chats | null;
    onlineStatus: Record<string, boolean>;
}

const formatMessageTime = (updatedAt: Date) => {
    const now = dayjs();
    const messageTime = dayjs(updatedAt);
    const diffInHours = now.diff(messageTime, 'hour');
    const diffInDays = now.diff(messageTime, 'day');

    if (diffInHours < 1) {
        return messageTime.format('h:mm A');
    } else if (diffInDays === 0) {
        return messageTime.format('h:mm A');
    } else if (diffInDays === 1) {
        return "Yesterday";
    } else if (diffInDays < 7) {
        return messageTime.format('ddd');
    } else {
        return messageTime.format('MMM D');
    }
};

const Conversation: React.FC<ConversationsProps> = ({ 
    conversation, 
    currentUser, 
    currentchat,
    onlineStatus 
}) => {
    const [user, setUser] = useState<UserData>();
    const friendId = conversation.members.find((m) => m !== currentUser?.id);
    const isOnline = friendId ? onlineStatus[friendId] : false;
    const isActive = currentchat?.id === conversation.id;

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await getUserForChat(friendId);
                console.log("Fetched user for chat:", res);
                setUser(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getUser();
    }, [friendId]);

    return (
        <div
            className={`relative rounded-lg px-3 py-3 flex items-center space-x-3 mb-2 cursor-pointer transition-all duration-200 hover:bg-gray-100 ${
                isActive ? "bg-green-50 border-l-4 border-green-500" : "bg-white"
            }`}
        >
            {/* Avatar with online indicator */}
            <div className="flex-shrink-0 relative">
                <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={user?.imageUrl || "/default-avatar.png"}
                    alt={user?.name || "User"}
                />
                {/* Online status indicator */}
                {isOnline && (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <Link to="" className="focus:outline-none">
                    <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-semibold truncate ${
                            isActive ? "text-green-600" : "text-gray-900"
                        }`}>
                            {user?.name || "Loading..."}
                        </p>
                        <div className="text-xs text-gray-500">
                            {formatMessageTime(conversation?.updatedAt)}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate max-w-[180px]">
                            {conversation?.recentMessage?.slice(0, 30) || "No messages yet"}
                            {conversation?.recentMessage && conversation.recentMessage.length > 30 && '...'}
                        </p>
                        
                        {/* Unread count badge (if you have unread count) */}
                        {/* {conversation.unreadCount > 0 && (
                            <span className="ml-2 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {conversation.unreadCount}
                            </span>
                        )} */}
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Conversation;