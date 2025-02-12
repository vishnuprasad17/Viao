import { Conversation } from "../../../domain/entities/Conversation";
import { IConversation } from "../mongooseModels/Conversation";


// Mapping from database model (MongoDB) to domain model
export const mapToDomain = (document: IConversation): Conversation => {
    return new Conversation(
      document._id.toString(),
      document.members,
      document.updatedAt,
      document.createdAt,
      document.recentMessage,
    );
  };
  
  // Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: Conversation): Partial<IConversation> => {
    return {
    members: domain.members
    };
  };