import { Schema, model } from 'mongoose';
import { IVendorType } from '../interfaces/vendortype.interface';



const VendorTypeSchema: Schema = new Schema({
    type :{type:String , required:true}
},{timestamps:true});

export default model<IVendorType>('vendortype', VendorTypeSchema);