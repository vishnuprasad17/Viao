import { ConversationRepository } from "../../../domain/interfaces/infrastructure interfaces/ConversationRepository";
import { BaseRepository } from "./BaseRepository";
import { ConversationModel, IConversation } from "../mongooseModels/Conversation";
import { mapToDomain, mapToDatabase } from "../mappers/conversationMapper";
import { Conversation } from "../../../domain/entities/Conversation";
import { injectable } from "inversify";

@injectable()
export class ConversationRepositoryImpl extends BaseRepository<IConversation, Conversation> implements ConversationRepository {
  constructor(){
    super(ConversationModel)
  }

  // Implement mapping methods
  protected toDomain(document: IConversation): Conversation {
    return mapToDomain(document);
  }

  protected toDatabase(domain: Conversation): Partial<IConversation> {
    return mapToDatabase(domain);
  }

  async findByIdAndUpdate(id:string,text:string){
    const document = await ConversationModel.findOneAndUpdate({_id:id},{$set:{recentMessage:text}});

    return document ? this.toDomain(document) : null;
  }
  
  async findConversations(userId:string){
    const conversations = await ConversationModel.find({ members: { $in: [userId] } }).sort({updatedAt:-1});
    return conversations.map(conversation => this.toDomain(conversation));
  }

}