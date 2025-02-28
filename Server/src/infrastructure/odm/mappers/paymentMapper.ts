import { Types } from "mongoose";
import { Payment } from "../../../domain/entities/Payment";
import { IPayment } from "../mongooseModels/Payment";
import { Booking } from "../../../domain/entities/Booking";
import { mapToDomain as mapToUserDomain } from "./userMapper";
import { mapToDomain as mapToVendorDomain } from "./vendorMapper";
import { mapToDomain as mapToBookingDomain } from "./bookingMapper";
import { IUser } from "../mongooseModels/User";
import { IVendor } from "../mongooseModels/Vendor";
import { IBooking } from "../mongooseModels/Booking";

interface IPaymentDocument {
  _id: Types.ObjectId;
  amount: number;
  vendorId: Types.ObjectId | IVendor;
  userId: Types.ObjectId | IUser;
  bookingId: Types.ObjectId | IBooking;
  transactionRef: string;
  modeOfPayment: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mapping from database model (MongoDB) to domain model
  export const mapToDomain = (document: IPayment): Payment => {
    return new Payment(
        document._id.toString(),
        document.amount,
        document.vendorId.toString(),
        document.userId.toString(),
        document.bookingId.toString(),
        document.modeOfPayment,
        document.transactionRef,
        document.createdAt
    );
}

export const mapToDomainPopulate = (document: IPaymentDocument): Payment => {
      const populatedUserDoc = document.userId as unknown as IUser;
      const userId = mapToUserDomain(populatedUserDoc);
      const populatedVendorDoc = document.vendorId as unknown as IVendor;
      const vendorId = mapToVendorDomain(populatedVendorDoc);
      const populatedBookingDoc = document.bookingId as unknown as IBooking;
      const bookingId = mapToBookingDomain(populatedBookingDoc);
  
      return new Payment(
        document._id.toString(),
        document.amount,
        vendorId,
        userId,
        bookingId,
        document.modeOfPayment,
        document.transactionRef,
        document.createdAt
    );
  }

// Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: Payment): Partial<IPayment> => {
    return {
    amount: domain.amount,
    vendorId: new Types.ObjectId(domain.vendorId as string),
    userId: new Types.ObjectId(domain.userId as string),
    bookingId: new Types.ObjectId(domain.bookingId as string),
    modeOfPayment: domain.modeOfPayment,
    transactionRef: domain.transactionRef
    };
  };