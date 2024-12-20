import { Document } from 'mongoose';
export interface IUserDocument extends Document {
    email : string;
    password : string;
    name : string;
    phone : number;
    isActive : boolean;
    refreshToken : string;
}

export interface DecodedData {
    _id: string;
    name: string;
    email: string;
    picture: string;
    jti: string;
  }