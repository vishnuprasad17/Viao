export interface VendorData{
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
}