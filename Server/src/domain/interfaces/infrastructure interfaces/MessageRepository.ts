import { UpdateWriteOpResult } from "mongoose";
import { Message } from "../../entities/Message";

export interface MessageRepository {
  create(message: Message): Promise<Message>;
  countDocuments(condition?:Record<string,unknown>):Promise<number>;
  update(id: string, user: Partial<Message>): Promise<Message | null>;

  changeMessageView(msgId: string, id: string): Promise<Message | null>;
  updateReadStatus(chatId:string,viewerId:string): Promise<UpdateWriteOpResult>;
  findMessagesWithPagination(conversationId: string, page: number, limit: number): Promise<Message[]>;
  findLastVisibleMessage(conversationId: string, excludeUserId?: string): Promise<Message | null>;
}