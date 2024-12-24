import { Document } from "mongoose";
export interface IVendorType extends Document {
    type:string;
    status:boolean;
    image:string;
    imageUrl:string;
}