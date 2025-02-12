import { Message } from "../entities/Message";

export class MessageDTO {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    imageName: string;
    imageUrl: string;
    isRead: boolean;
    isDeleted: boolean;
    deletedIds: string[];
    createdAt:Date;
  
    constructor(message: Message) {
      this.id = message.id;
      this.conversationId = message.conversationId;
      this.senderId = message.senderId;
      this.text = message.text;
      this.imageName = message.imageName;
      this.imageUrl = message.imageUrl;
      this.isRead = message.isRead;
      this.isDeleted = message.isDeleted;
      this.deletedIds = message.deletedIds;
      this.createdAt = message.createdAt;
    }
  
    static fromDomain(message: Message): MessageDTO {
      return new MessageDTO(message);
    }
  
    static fromDomainList(messages: Message[]): MessageDTO[] {
      return messages.map(message => new MessageDTO(message));
    }
  }