import { UpdateWriteOpResult } from "mongoose";
import { MessageDTO, PaginatedMessages } from "../../dtos/MessageDTO";

export interface MessageUseCase {
    createMessage(conversationId: string, senderId: string, text: string,imageName:string,imageUrl:string): Promise<MessageDTO>;
    findMessages(conversationId: string, page: number, limit: number): Promise<PaginatedMessages>;
    updateStatus(msgId: string): Promise<MessageDTO>;
    changeMessageView(msgId: string, id: string): Promise<MessageDTO>;
    changeReadStatus(chatId:string,viewerId:string): Promise<UpdateWriteOpResult>;
}