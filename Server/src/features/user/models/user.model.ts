import { Schema ,model } from 'mongoose';
import { IUserDocument } from '../interfaces/model.interface';

const UserSchema: Schema = new Schema({
    email :{type:String , required:true, unique:true},
    password:{type:String, required:true} , 
    name :{type:String , required:true} ,
    phone :{type:Number , required:true , unique:true},
    isActive :{type:Boolean , required:true}

});

export default model<IUserDocument>('User', UserSchema);