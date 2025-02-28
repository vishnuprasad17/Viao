import { Booking } from "../../../domain/entities/Booking";
import { IBooking } from "../mongooseModels/Booking";
import { IUser } from "../mongooseModels/User";
import { IVendor } from "../mongooseModels/Vendor";
import { mapToDomain as mapToUserDomain } from "./userMapper";
import { mapToDomain as mapToVendorDomain } from "./vendorMapper";
import { Types } from "mongoose";

interface IBookingDocument {
  _id: Types.ObjectId;
  date:string;
  name:string;
  eventName:string;
  city:string;
  pin:number;
  mobile:number;
  userId: Types.ObjectId | IUser;
  vendorId: Types.ObjectId | IVendor;
  status:string;
  payment_status:string;
  amount:number;
  refundAmount:number;
  deductedFromWallet: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mapping from database model (MongoDB) to domain model
  export const mapToDomain = (document: IBooking): Booking => {
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
      document.deductedFromWallet,
      document.createdAt,
    );
  };

  export const mapToDomainPopulateBothUserAndVendor = (document: IBookingDocument): Booking => {
      const populatedUserDoc = document.userId as unknown as IUser;
      const userId = mapToUserDomain(populatedUserDoc);
      const populatedVendorDoc = document.vendorId as unknown as IVendor;
      const vendorId = mapToVendorDomain(populatedVendorDoc);
  
      return new Booking(
        document._id.toString(),
        document.name,
        document.date,
        document.eventName,
        document.city,
        document.pin,
        document.mobile,
        vendorId,
        userId,
        document.status,
        document.payment_status,
        document.amount,
        document.refundAmount,
        document.deductedFromWallet,
        document.createdAt,
      );
  }

  export const mapToDomainByPopulatingVendor = (document: IBookingDocument): Booking => {
    const populatedVendorDoc = document.vendorId as unknown as IVendor;
    const vendorId = mapToVendorDomain(populatedVendorDoc);

    return new Booking(
      document._id.toString(),
      document.name,
      document.date,
      document.eventName,
      document.city,
      document.pin,
      document.mobile,
      vendorId,
      document.userId.toString(),
      document.status,
      document.payment_status,
      document.amount,
      document.refundAmount,
      document.deductedFromWallet,
      document.createdAt,
    );
}
  
  // Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: Booking): Partial<IBooking> => {
    return {
    name: domain.name,
    date: domain.date,
    eventName: domain.eventName,
    amount: domain.amount,
    city: domain.city,
    pin: domain.pin,
    mobile: domain.mobile,
    vendorId: new Types.ObjectId(domain.vendorId as string),
    userId: new Types.ObjectId(domain.userId as string),
    };
  };