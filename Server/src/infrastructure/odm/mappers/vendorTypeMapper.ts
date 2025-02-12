import { Types } from 'mongoose';
import { VendorType } from "../../../domain/entities/VendorType";
import { IVendorType } from "../mongooseModels/VendorType";

// Mapping from database model (MongoDB) to domain model
export const mapToDomain = (document: IVendorType): VendorType => {
    return new VendorType(
      document._id.toString(), // Convert ObjectId to string
      document.type,
      document.status,
      document.image,
      document.imageUrl
    );
  };
  
  // Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: VendorType): Partial<IVendorType> => {
    return {
      type: domain.type,
      status: domain.status,
      image: domain.image,
      imageUrl: domain.imageUrl
    };
  };