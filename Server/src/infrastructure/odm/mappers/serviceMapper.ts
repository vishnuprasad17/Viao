import { Types } from "mongoose";
import { Service } from "../../../domain/entities/Service";
import { IService } from "../mongooseModels/Service";

// Mapping from database model (MongoDB) to domain model
  export const mapToDomain = (document: IService): Service => {
    return new Service(
        document._id.toString(),
        document.vendorId.toString(),
        document.name,
        document.price,
        document.advancePercentage ?? 100,
        document.minimumBookingNoticeInDays ?? 1,
        document.cancellationFullRefundBeforeDays ?? 7,
        document.cancellationPartialRefundBeforeDays ?? null,
        document.partialRefundPercentage ?? null,
        document.createdAt,
        document.updatedAt
    );
}

// Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: Service): Partial<IService> => {
    return {
    name: domain.name,
    price: domain.price,
    vendorId: new Types.ObjectId(domain.vendorId as string),
    advancePercentage: domain.advancePercentage,
    minimumBookingNoticeInDays: domain.minimumBookingNoticeInDays,
    cancellationFullRefundBeforeDays: domain.cancellationFullRefundBeforeDays,
    cancellationPartialRefundBeforeDays: domain.cancellationPartialRefundBeforeDays ?? undefined,
    partialRefundPercentage: domain.partialRefundPercentage ?? undefined,
    };
  };