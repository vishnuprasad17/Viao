import { Document, Schema } from "mongoose";
export interface IVendorType extends Document {
    _id:Schema.Types.ObjectId;
    type:string;
}