import { Vendor } from "../entities/Vendor";

export class VendorDTO {
    id:string;
    email : string;
    name:string;
    city:string;
    about:string;
    phone:number;
    isVerified:boolean;
    verificationRequest:boolean;
    totalBooking:number;
    vendor_type:string;
    isActive:boolean;
    coverpicUrl:string;
    logoUrl:string;
    bookedDates:Array<string>;
    totalRating:number;
  
    constructor(vendor: Vendor) {
      this.id = vendor.id;
      this.email = vendor.email;
      this.name = vendor.name;
      this.city = vendor.city;
      this.about = vendor.about;
      this.phone = vendor.phone;
      this.isVerified = vendor.isVerified;
      this.verificationRequest = vendor.verificationRequest;
      this.totalBooking = vendor.totalBooking;
      this.vendor_type = vendor.vendorType;
      this.isActive = vendor.isActive;
      this.coverpicUrl = vendor.coverpicUrl;
      this.logoUrl = vendor.logoUrl;
      this.bookedDates = vendor.bookedDates;
      this.totalRating = vendor.totalRating;
    }
  
    static fromDomain(vendor: Vendor): VendorDTO {
      return new VendorDTO(vendor);
    }
  
    static fromDomainList(vendors: Vendor[]): VendorDTO[] {
      return vendors.map(vendor => new VendorDTO(vendor));
    }
  }  