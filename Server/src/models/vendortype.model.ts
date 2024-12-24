import { Schema, model } from 'mongoose';
import { IVendorType } from '../interfaces/vendortype.interface';


export interface VendorType {
    type:string;
    status:boolean;
    image:string;
    imageUrl:string;
}

const VendorTypeSchema: Schema = new Schema({
    type :{type:String , required:true} ,
    status :{type:Boolean , required:true,default:true},
    image:{type:String,required:true,default:""},
    imageUrl:{type:String,default:""},
    isEditing:{type:Boolean,default:false}
},{timestamps:true});

export default model<IVendorType>('vendortype', VendorTypeSchema);