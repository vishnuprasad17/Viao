import { Types } from 'mongoose';
import { Post } from "../../../domain/entities/Post";
import { IPost } from '../mongooseModels/Post';

// Mapping from database model (MongoDB) to domain model
export const mapToDomain = (document: IPost): Post => {
    return new Post(
      document._id.toString(), // Convert ObjectId to string
      document.caption,
      document.vendor_id.toString(),
      document.image,
      document.imageUrl
    );
  };
  
  // Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: Post): Partial<IPost> => {
    return {
      caption: domain.caption,
      vendor_id: new Types.ObjectId(domain.vendor_id),
      image: domain.image,
      imageUrl: domain.imageUrl
    };
  };