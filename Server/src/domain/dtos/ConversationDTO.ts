import { Conversation } from "../entities/Conversation";

export class ConversationDTO {
    id:string;
    members: string[];
    recentMessage?: string;
    updatedAt?:Date;
    createdAt?:Date;
  
    constructor(conversation: Conversation) {
      this.id = conversation.id;
      this.members = conversation.members;
      this.recentMessage = conversation.recentMessage;
      this.updatedAt = conversation.updatedAt;
      this.createdAt = conversation.createdAt;
    }
  
    static fromDomain(conversation: Conversation): ConversationDTO {
      return new ConversationDTO(conversation);
    }
    
    static fromDomainList(conversations: Conversation[]): ConversationDTO[] {
      return conversations.map(conversation => new ConversationDTO(conversation));
    }
  }