import { UpdateWriteOpResult } from "mongoose";
import { Message } from "../entities/Message";

export interface MessageRepository {
  create(message: Message): Promise<Message>;
  findByCondition(condition: Record<string, unknown>): Promise<Message[]>;
  update(id: string, user: Partial<Message>): Promise<Message | null>;

  changeMessageView(msgId: string, id: string): Promise<Message | null>;
  updateReadStatus(chatId:string,senderId:string): Promise<UpdateWriteOpResult>;
}