import { Types } from "mongoose";
import { Notification } from "../../../domain/entities/Notification";
import { INotification } from "../mongooseModels/Notification";

// Mapping from database model (MongoDB) to domain model
export const mapToDomain = (document: INotification): Notification => {
    return new Notification(
      document._id.toString(),
      document.recipient.toString(),
      document.message,
      document.read,
      document.type,
      document.createdAt
    );
  };
  
  // Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: Notification): Partial<INotification> => {
    return {
    recipient: new Types.ObjectId(domain.recipient),
    message: domain.message,
    type: domain.type
    };
  };