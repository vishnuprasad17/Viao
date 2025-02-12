import { Message } from "../../../domain/entities/Message";
import { IMessage } from "../mongooseModels/Message";


// Mapping from database model (MongoDB) to domain model
export const mapToDomain = (document: IMessage): Message => {
    return new Message(
      document._id.toString(),
      document.conversationId,
      document.senderId,
      document.text,
      document.imageName,
      document.imageUrl,
      document.isRead,
      document.isDeleted,
      document.deletedIds,
      document.createdAt
    );
  };
  
  // Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: Message): Partial<IMessage> => {
    return {
    conversationId: domain.conversationId,
    senderId: domain.senderId,
    text: domain.text,
    imageName: domain.imageName,
    imageUrl: domain.imageUrl,
    isRead: domain.isRead,
    isDeleted: domain.isDeleted
    };
  };