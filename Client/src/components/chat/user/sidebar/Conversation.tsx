import { Link } from "react-router-dom";
import { getVendorForChat } from "../../../../config/services/userApi";
import { useEffect, useState } from "react";
import { Chats } from "../../../../interfaces/commonTypes";
import { UserData } from "../../../../interfaces/userTypes";
import { VendorData } from "../../../../interfaces/vendorTypes";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface ConversationsProps {
    conversation: Chats;
    currentUser: Partial<UserData | null>;
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
    const [vendor, setVendor] = useState<VendorData>();
    const friendId = conversation.members.find((m) => m !== currentUser?.id);
    const isOnline = friendId ? onlineStatus[friendId] : false;
    const isActive = currentchat?.id === conversation.id;

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await getVendorForChat(friendId);
                setVendor(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getUser();
    }, [friendId]);

    return (
        <div
            className={`relative rounded-lg px-3 py-3 flex items-center space-x-3 mb-2 cursor-pointer transition-all duration-200 hover:bg-gray-100 ${
                isActive ? "bg-blue-50 border-l-4 border-blue-500" : "bg-white"
            }`}
        >
            {/* Avatar with online indicator */}
            <div className="flex-shrink-0 relative">
                <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={vendor?.logoUrl || "/default-avatar.png"}
                    alt={vendor?.name || "Vendor"}
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
                            isActive ? "text-blue-600" : "text-gray-900"
                        }`}>
                            {vendor?.name || "Loading..."}
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
                            <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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