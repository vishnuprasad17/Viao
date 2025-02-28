import { Types } from "mongoose";
import { Review } from "../../../domain/entities/Review";
import { IReview } from "../mongooseModels/Review";
import { mapToDomain as mapToUserDomain } from "./userMapper";
import { mapToDomain as mapToVendorDomain } from "./vendorMapper";
import { IUser } from "../mongooseModels/User";
import { IVendor } from "../mongooseModels/Vendor";

interface IReviewDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId | IUser;
  vendorId: Types.ObjectId | IVendor;
  rating: number;
  content: string;
  reply: Array<string>;
  createdAt: Date;
  updatedAt: Date;
  replyAt: Date;
}
// Mapping from database model (MongoDB) to domain model
  export const mapToDomain = (document: IReview): Review => {
    return new Review(
        document._id.toString(),
        document.userId.toString(),
        document.vendorId.toString(),
        document.rating,
        document.content,
        document.reply,
        document.createdAt,
        document.replyAt
    );
}

export const mapToDomainPopulate = (document: IReviewDocument): Review => {
    const populatedUserDoc = document.userId as unknown as IUser;
    const userId = mapToUserDomain(populatedUserDoc);
    const populatedVendorDoc = document.vendorId as unknown as IVendor;
    const vendorId = mapToVendorDomain(populatedVendorDoc);

    return new Review(
        document._id.toString(),
        userId,
        vendorId,
        document.rating,
        document.content,
        document.reply,
        document.createdAt,
        document.replyAt
    );
}

// Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: Review): Partial<IReview> => {
    return {
    content: domain.content,
    rating: domain.rating,
    userId: new Types.ObjectId(domain.userId as string),
    vendorId: new Types.ObjectId(domain.vendorId as string)
    };
  };