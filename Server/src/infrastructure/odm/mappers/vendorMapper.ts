import { Types } from 'mongoose';
import { Vendor } from "../../../domain/entities/Vendor";
import { IVendor } from "../mongooseModels/Vendor";

// Mapping from database model (MongoDB) to domain model
export const mapToDomain = (document: IVendor): Vendor => {
    return new Vendor(
      document._id.toString(), // Convert ObjectId to string
      document.email,
      document.name,
      document.phone,
      document.city,
      document.about,
      document.logo,
      document.coverpic,
      document.isVerified,
      document.verificationRequest,
      document.totalBooking,
      document.vendor_type.toString(),
      document.isActive,
      document.coverpicUrl,
      document.logoUrl,
      document.bookedDates,
      document.totalRating
    );
  };
  
  // Mapping from domain model to database model (for saving to DB)
  export const mapToDatabase = (domain: Vendor, password?: string): Partial<IVendor> => {
    return {
      email: domain.email,
      ...(password && { password }),
      name: domain.name,
      phone: domain.phone,
      city: domain.city,
      about: domain.about,
      logo: domain.logo,
      coverpic: domain.coverpic,
      vendor_type: new Types.ObjectId(domain.vendorType),
      coverpicUrl: domain.coverpicUrl,
      logoUrl: domain.logoUrl
    };
  };