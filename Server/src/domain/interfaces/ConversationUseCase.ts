import { ConversationDTO } from "../dtos/ConversationDTO";

export interface ConversationUseCase {
    createConversation(senderId: string, receiverId: string): Promise<ConversationDTO>;
    findChat(userId:string): Promise<ConversationDTO[]>;
}