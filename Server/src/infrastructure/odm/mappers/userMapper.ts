import { User } from "../../../domain/entities/User";
import { IUser } from "../mongooseModels/User";

// Mapping from database model (MongoDB) to domain model
export const mapToDomain = (document: IUser): User => {
    return new User(
      document._id.toString(),
      document.name,
      document.email,
      document.phone,
      document.isActive,
      document.imageUrl,
      document.favourite,
      document.wallet,
    );
  };
  
  // Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: User, password?: string): Partial<IUser> => {
    return {
    name: domain.name,
    email: domain.email,
    ...(password && { password }),
    phone: domain.phone,
    isActive: domain.isActive,
    imageUrl: domain.imageUrl,
    };
  };