import { Types , Document } from 'mongoose';


interface Lock {
    date: string;
    isLocked: boolean;
}

export interface IVendorDocument extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    name:string;
    city:string;
    about:string;
    phone:number;
    logo:string;
    coverpic:string;
    isVerified:boolean;
    verificationRequest:boolean;
    totalBooking:number;
    vendor_type:Types.ObjectId;
    isActive:boolean;
    coverpicUrl:string;
    logoUrl:string;
    bookedDates:Array<string>;
    refreshToken:string;
    totalRating:number;  
}