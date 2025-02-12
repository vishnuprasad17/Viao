import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { ConversationRepository } from "../../domain/interfaces/ConversationRepository";
import { BaseError } from "../../domain/errors/BaseError";
import { ConversationUseCase } from "../../domain/interfaces/ConversationUseCase";
import { Conversation } from "../../domain/entities/Conversation";
import { ConversationDTO } from "../../domain/dtos/ConversationDTO";

@injectable()
export class ConversationUseCaseImpl implements ConversationUseCase {
    constructor(@inject(TYPES.ConversationRepository) private conversationRepository: ConversationRepository) {}

    async createConversation(senderId: string, receiverId: string): Promise<ConversationDTO> {
        let chat = await this.conversationRepository.findOne({
          members: [senderId, receiverId],
        });
    
        if (!chat) {
          const conversation = new Conversation(
            "",
            [senderId, receiverId]
          );
          const newChat = await this.conversationRepository.create(conversation);
          const conversationDtos = ConversationDTO.fromDomain(newChat);
          return conversationDtos;
        }
        const conversationDtos = ConversationDTO.fromDomain(chat);

        return conversationDtos;
      }
    
      async findChat(userId:string): Promise<ConversationDTO[]> {
        const chats = await this.conversationRepository.findConversations(userId);
        return ConversationDTO.fromDomainList(chats);
      }
}