import { Schema , Document } from 'mongoose';


export interface IVendorDocument extends Document {
    email : string;
    password : string;
    name:string;
    city:string;
    about:string;
    phone:number;
    logo:string;
    coverpic:string;
    reviews:object;
    isVerified:boolean;
    verificationRequest:boolean;
    totalBooking:number;
    vendor_type:Schema.Types.ObjectId;
    isActive:boolean;
    refreshToken :string;
}