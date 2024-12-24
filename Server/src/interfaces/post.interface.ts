import {Document,Schema} from "mongoose";


export interface IPostDocument extends Document{
    imageUrl: string;
    caption:string;
    image:string;
    createdAt:Date;
    vendor_id:Schema.Types.ObjectId;
}