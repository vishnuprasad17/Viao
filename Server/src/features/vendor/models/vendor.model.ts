import { Schema, model } from 'mongoose';
import { IVendorDocument } from '../interfaces/model.interface';

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
    verificationRequest:{type:Boolean},
    totalBooking:{type:Number},
    Vendor_type:{type:Schema.Types.ObjectId,required:true},
    isActive:{type:Boolean}

});

export default model<IVendorDocument>('Vendor', VendorSchema);