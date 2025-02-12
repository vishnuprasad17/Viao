import { Admin } from "../../../domain/entities/Admin";
import { IAdmin } from "../mongooseModels/Admin";


// Mapping from database model (MongoDB) to domain model
export const mapToDomain = (document: IAdmin): Admin => {
    return new Admin(
      document._id.toString(),
      document.email,
      document.wallet,
      document.createdAt,
    );
  };
  
  // Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: Admin, password?: string): Partial<IAdmin> => {
    return {
    email: domain.email,
    ...(password && { password }),
    wallet: domain.wallet,
    };
  };  