import Message from "../models/message.model";
import { IMessageDocument } from "../interfaces/message.interface"
import { BaseRepository } from "../shared/data-access/base.repo";

class MessageRepository extends BaseRepository<IMessageDocument>{
    constructor(){
        super(Message)
    }

    async updateReadStatus(chatId:string,senderId:string){
        return Message.updateMany({conversationId:chatId,senderId:senderId},{$set:{isRead:true}})
    }
}

export default new MessageRepository()