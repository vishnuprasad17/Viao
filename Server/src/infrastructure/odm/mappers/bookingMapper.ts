import { Booking } from "../../../domain/entities/Booking";
import { IBooking } from "../mongooseModels/Booking";
import { Types } from "mongoose";


// Mapping from database model (MongoDB) to domain model
export const mapToDomain = (document: IBooking, vendorName?: string): Booking => {
  if (vendorName) {
    return new Booking(
      document._id.toString(),
      document.name,
      document.date,
      document.eventName,
      document.city,
      document.pin,
      document.mobile,
      document.vendorId.toString(),
      document.userId.toString(),
      document.status,
      document.payment_status,
      document.amount,
      document.refundAmount,
      document.createdAt,
      vendorName,
    );
  } else {
    return new Booking(
      document._id.toString(),
      document.name,
      document.date,
      document.eventName,
      document.city,
      document.pin,
      document.mobile,
      document.vendorId.toString(),
      document.userId.toString(),
      document.status,
      document.payment_status,
      document.amount,
      document.refundAmount,
      document.createdAt,
    );
  }
  };
  
  // Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: Booking): Partial<IBooking> => {
    return {
    name: domain.name,
    date: domain.date,
    eventName: domain.eventName,
    city: domain.city,
    pin: domain.pin,
    mobile: domain.mobile,
    vendorId: new Types.ObjectId(domain.vendorId),
    userId: new Types.ObjectId(domain.userId),
    };
  };