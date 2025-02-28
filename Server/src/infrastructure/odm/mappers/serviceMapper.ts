import { Types } from "mongoose";
import { Service } from "../../../domain/entities/Service";
import { IService } from "../mongooseModels/Service";

// Mapping from database model (MongoDB) to domain model
  export const mapToDomain = (document: IService): Service => {
    return new Service(
        document._id.toString(),
        document.vendorId.toString(),
        document.name,
        document.price
    );
}

// Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: Service): Partial<IService> => {
    return {
    name: domain.name,
    price: domain.price,
    vendorId: new Types.ObjectId(domain.vendorId as string)
    };
  };