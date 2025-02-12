import { UpdateWriteOpResult } from "mongoose";
import { MessageDTO } from "../dtos/MessageDTO";

export interface MessageUseCase {
    createMessage(conversationId: string, senderId: string, text: string,imageName:string,imageUrl:string): Promise<MessageDTO>;
    findMessages(conversationId: string): Promise<MessageDTO[]>;
    updateStatus(msgId: string): Promise<MessageDTO>;
    changeMessageView(msgId: string, id: string): Promise<MessageDTO>;
    changeReadStatus(chatId:string,senderId:string): Promise<UpdateWriteOpResult>;
}