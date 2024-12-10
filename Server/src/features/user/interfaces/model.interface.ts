import { Document } from 'mongoose';
export interface IUserDocument extends Document {
    email : string;
    password : string;
    name : string;
    phone : number;
    isActive : boolean;
    refreshToken : string;
}