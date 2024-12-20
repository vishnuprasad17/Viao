import { Schema, model, Types } from 'mongoose';
import { IVendorDocument } from '../interfaces/vendor.interface';

const VendorSchema: Schema = new Schema({
    email :{type:String , required:true, unique:true},
    password:{type:String, required:true} , 
    name :{type:String , required:true} ,
    phone :{type:Number , required:true , unique:true},
    city:{type:String , required:true},
    about:{type:String},
    logo:{type:String},
    coverpic:{type:String},
    reviews:{type:Object},
    isVerified:{type:Boolean},
    totalBooking:{type:Number},
    vendor_type:{type:Types.ObjectId},
    isActive:{type:Boolean}

});

export default model<IVendorDocument>('Vendor', VendorSchema);