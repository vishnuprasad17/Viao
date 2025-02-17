import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { MessageUseCase } from "../../domain/interfaces/application interfaces/MessageUseCase";
import { MessageRepository } from "../../domain/interfaces/infrastructure interfaces/MessageRepository";
import { ConversationRepository } from "../../domain/interfaces/infrastructure interfaces/ConversationRepository";
import { Message } from "../../domain/entities/Message";
import { MessageDTO } from "../../domain/dtos/MessageDTO";
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
    
      async findMessages(conversationId: string): Promise<MessageDTO[]> {
        const messages = await this.messageRepository.findByCondition({ conversationId });
        const messageDtos = MessageDTO.fromDomainList(messages);

        return messageDtos;
      }
    
      async updateStatus(msgId: string): Promise<MessageDTO> {
        const document = await this.messageRepository.update(msgId, { isDeleted: true });
        if (!document) {
          throw new BaseError("Failed to delete message", 404);
        }
        const messageDto = MessageDTO.fromDomain(document);

        return messageDto;
      }
    
      async changeMessageView(msgId: string, id: string): Promise<MessageDTO> {
        const updatedMessage = await this.messageRepository.changeMessageView(msgId, id);
        if (!updatedMessage) {
          throw new BaseError("Failed to update message view", 404);
        }
        const messageDto = MessageDTO.fromDomain(updatedMessage);

        return messageDto;
      }
    
      async changeReadStatus(chatId:string,senderId:string): Promise<UpdateWriteOpResult> {
        return await this.messageRepository.updateReadStatus(chatId,senderId);
      }
}