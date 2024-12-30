import { Document, Types } from "mongoose";
export interface IAdminDocument extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    createdAt: Date;
    isAdmin: boolean;
    refreshToken?: string;
  }