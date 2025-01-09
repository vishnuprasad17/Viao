import { Document, Types } from "mongoose";

export interface IBookingDocument extends Document{
    date:string;
    name:string;
    eventName:string;
    city:string;
    pin:number;
    mobile:number;
    createdAt:Date;
    vendorId:Types.ObjectId;
    userId:Types.ObjectId;
    status:string;
    payment_status:string;
    amount:number;
    refundAmount:number;
}