import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { MessageUseCase } from "../../domain/interfaces/application interfaces/MessageUseCase";
import { MessageRepository } from "../../domain/interfaces/infrastructure interfaces/MessageRepository";
import { ConversationRepository } from "../../domain/interfaces/infrastructure interfaces/ConversationRepository";
import { Message } from "../../domain/entities/Message";
import { MessageDTO, PaginatedMessages } from "../../domain/dtos/MessageDTO";
import { BaseError } from "../../domain/errors/BaseError";
import { UpdateWriteOpResult } from "mongoose";

@injectable()
export class MessageUseCaseImpl implements MessageUseCase {
    constructor(@inject(TYPES.MessageRepository) private messageRepository: MessageRepository,
                @inject(TYPES.ConversationRepository) private conversationRepository: ConversationRepository) {}

    async createMessage(conversationId: string, senderId: string, text: string,imageName:string,imageUrl:string): Promise<MessageDTO> {
        const message = new Message(
            "",
            conversationId,
            senderId,
            text,
            imageName,
            imageUrl,
            false,
            false,
            [],
            new Date()
        )
        const newMessage = await this.messageRepository.create(message);
        //Update recent message
        await this.conversationRepository.findByIdAndUpdate(conversationId,text)
        const messageDto = MessageDTO.fromDomain(newMessage);

        return messageDto;
      }
    
      async findMessages(conversationId: string, page: number = 1, limit: number = 50): Promise<PaginatedMessages> {
        const total = await this.messageRepository.countDocuments({ conversationId });
        const messages = await this.messageRepository.findMessagesWithPagination(
            conversationId,
            page,
            limit
        );

        const messageDtos = MessageDTO.fromDomainList(messages);

        return {
            data: messageDtos,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            },
        };
      }
    
      async updateStatus(msgId: string): Promise<MessageDTO> {
        const document = await this.messageRepository.update(msgId, { isDeleted: true });
        if (!document) {
          throw new BaseError("Failed to delete message", 404);
        }
        
        await this.recalculateRecentMessage(document.conversationId);

        return MessageDTO.fromDomain(document);
      }
    
      async changeMessageView(msgId: string, id: string): Promise<MessageDTO> {
        const updatedMessage = await this.messageRepository.changeMessageView(msgId, id);
        if (!updatedMessage) {
          throw new BaseError("Failed to update message view", 404);
        }
        
        await this.recalculateRecentMessage(updatedMessage.conversationId, id);

        return MessageDTO.fromDomain(updatedMessage);
      }
    
      async changeReadStatus(chatId:string,viewerId:string): Promise<UpdateWriteOpResult> {
        return await this.messageRepository.updateReadStatus(chatId,viewerId);
      }

      private async recalculateRecentMessage(
        conversationId: string,
        excludeUserId?: string
      ): Promise<void> {
        const lastMessage = await this.messageRepository.findLastVisibleMessage(
          conversationId,
          excludeUserId
        );

        const recentText = lastMessage
          ? lastMessage.imageUrl
            ? "📷 Photo"
            : lastMessage.text || ""
          : "";

        await this.conversationRepository.findByIdAndUpdate(conversationId, recentText);
      }
}