import { Schema ,model } from 'mongoose';
import { IUserDocument } from '../interfaces/user.interface';

const UserSchema: Schema = new Schema({
    email :{type:String , required:true, unique:true},
    password:{type:String, required:true} , 
    name :{type:String , required:true} ,
    phone :{type:Number },
    isActive :{type:Boolean , required:true},
    imageUrl:{type:String},
    favourite:{type:Array},
    wallet:{type:Number,default:0},
    refreshToken: { type: String }

},{timestamps:true});

export default model<IUserDocument>('User', UserSchema);