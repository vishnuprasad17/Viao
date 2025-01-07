import Conversation from "../models/conversation.model";
import { IConversationDocument } from "../interfaces/conversation.interface"
import { BaseRepository } from "../shared/data-access/base.repo";

class ConversationRepository extends BaseRepository<IConversationDocument>{
    constructor(){
        super(Conversation)
    }

    findByIdAndUpdate(id:string,text:string){
       return Conversation.findOneAndUpdate({_id:id},{$set:{recentMessage:text}})
    }

    findConversations(userId:string){
        return Conversation.find({ members: { $in: [userId] } }).sort({updatedAt:-1})
    }
}

export default new ConversationRepository();