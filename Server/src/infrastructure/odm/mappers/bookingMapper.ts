import { Booking } from "../../../domain/entities/Booking";
import { User } from "../../../domain/entities/User";
import { Vendor } from "../../../domain/entities/Vendor";
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
  vendorId:Types.ObjectId | IVendor;
  userId:Types.ObjectId | IUser;
  status:string;
  payment_status:string;
  financials: {
    totalServicePrice: number;
    chargeAmount: number;
    walletDeducted: number;
    stripeAmount: number;
    adminCommissionPercent: number;
    adminCommissionAmount: number;
    vendorNetAmount: number;
    cancellationScenario?: "full_refund" | "partial_refund" | "no_refund" | null;
    refundToUser?: number;
    adminKeepsOnCancel?: number;
    vendorCompensationOnCancel?: number;
  };
  userNote?: string;
  adminRemark?: string;
  paymentFailedAt?: Date;
  retryDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Helper: build a Booking from a plain IBooking doc ───────────────────────
const buildBooking = (doc: IBookingDocument, vendorId: string | Vendor, userId: string | User): Booking => {
  return new Booking(
    doc._id.toString(),
    doc.name,
    doc.date,
    doc.eventName,
    doc.city,
    doc.pin,
    doc.mobile,
    vendorId,
    userId,
    doc.status,
    doc.payment_status,
    doc.financials,
    doc.createdAt,
    doc.userNote ?? null,
    doc.adminRemark ?? null,
    doc.paymentFailedAt ?? null,
    doc.retryDeadline ?? null,
  );
};

// Mapping from database model (MongoDB) to domain model

// ─── 1. Basic (no populate) ───────────────────────────────────────────────────
export const mapToDomain = (document: IBooking): Booking => {
  return buildBooking(
    document,
    document.vendorId.toString(),
    document.userId.toString()
  );
};

// ─── 2. Vendor populated ─────────────────────────────────────────────────────
export const mapToDomainByPopulatingVendor = (document: IBookingDocument): Booking => {
  return buildBooking(document, mapToVendorDomain(document.vendorId as unknown as IVendor), document.userId.toString());
};

// ─── 3. Both user and vendor populated ───────────────────────────────────────
export const mapToDomainPopulateBothUserAndVendor = (document: IBookingDocument): Booking => {
  return buildBooking(document, mapToVendorDomain(document.vendorId as unknown as IVendor), mapToUserDomain(document.userId as unknown as IUser));
};
  
// Mapping from domain model to database model (for saving to DB)
export const mapToDatabase = (domain: Booking): Partial<IBooking> => {
  const now = new Date();
  const retryDeadline = new Date(now.getTime() + 30 * 60 * 1000); // +30 minutes

  return {
    name: domain.name,
    date: domain.date,
    eventName: domain.eventName,
    city: domain.city,
    pin: domain.pin,
    mobile: domain.mobile,
    vendorId: new Types.ObjectId(domain.vendorId as string),
    userId: new Types.ObjectId(domain.userId as string),
    status: domain.status,
    payment_status: domain.payment_status,

    financials: {
      ...domain.financials,
    },
    
    userNote: domain.userNote ?? undefined,
    adminRemark: domain.adminRemark ?? undefined,
    paymentFailedAt: domain.paymentFailedAt ?? undefined,
    retryDeadline: retryDeadline,
    };
  };