import { Document, Types } from "mongoose";

export interface INotificationDocument extends Document {
    recipient: Types.ObjectId;
    message: string;
    read: boolean;
    type: string;
    createdAt: Date;
}