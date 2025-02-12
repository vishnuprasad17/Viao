import { Conversation } from "../entities/Conversation";

export interface ConversationRepository {
  create(conversation: Conversation): Promise<Conversation>;
  findByCondition(condition: Record<string, unknown>): Promise<Conversation[]>;
  findOne(condition: Record<string, unknown>): Promise<Conversation | null>;
  findByIdAndUpdate(id:string,text:string): Promise<Conversation | null>;
  findConversations(userId: string): Promise<Conversation[]>;
}