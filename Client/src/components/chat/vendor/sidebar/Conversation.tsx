import { Link } from 'react-router-dom'
import { getUserForChat } from '../../../../config/services/userApi';
import { useEffect, useState } from 'react'
import { Chats } from '../../../../interfaces/commonTypes';
import { VendorData } from '../../../../interfaces/vendorTypes';
import { UserData } from '../../../../interfaces/userTypes';
import {  parseISO } from 'date-fns';


interface ConversationsProps {
  conversation: Chats;
  currentUser: Partial<VendorData | null>;
  currentchat:Chats | null
}

const formatMessageTime = (updatedAt:Date ) => {
  const createdAtDate = parseISO(updatedAt.toString());
  const now = new Date();
  const differenceInDays = Math.floor((now.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24));

  if (differenceInDays === 0) {
    return new Date(createdAtDate).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } else if (differenceInDays === 1) {
    return "yesterday";
  } else {
    return new Date(createdAtDate).toLocaleDateString();
  }
};


const Conversation:React.FC<ConversationsProps>=({conversation, currentUser, currentchat}) => {
  const [user , setUser] = useState<UserData>()
  const friendId = conversation.members.find((m) => m !== currentUser?.id);

  useEffect(()=>{

    const getUser = async ()=>{
      try {
        const res = await getUserForChat(friendId);
        console.log(res.data)
        setUser(res.data)
      
      } catch (error) {
        console.log(error)
      }
    }
    getUser();

  },[currentUser , conversation, currentchat])

  return (
    <div>
    <div className={`relative rounded-lg px-2 py-2 flex items-center space-x-3 mb-3 ${currentchat?.id === conversation.id ? 'bg-gray-100' : 'bg-gray-50'}`}>

        <div className="flex-shrink-0">
          <img
            className="w-12 h-12 rounded-full"
            src={ user?  user?.imageUrl : ""}
            alt=""
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link to="" className="focus:outline-none">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-700">{user?.name}</p>
              <div className="text-gray-400 text-xs">{formatMessageTime(conversation?.updatedAt)}</div>
            
            </div>
            <div className="flex items-center justify-start">
              <p className="text-sm text-gray-500 truncate">{conversation?.recentMessage?.slice(0,10)}</p>
              
            </div>
          </Link>
        </div>
      </div>

   
    </div>
  )
}

export default Conversation;