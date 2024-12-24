import { Schema, model, Types } from 'mongoose';
import { IVendorDocument } from '../interfaces/vendor.interface';

const VendorSchema: Schema = new Schema({
    email :{type:String , required:true, unique:true},
    password:{type:String, required:true} , 
    name :{type:String , required:true} ,
    phone :{type:Number , required:true , unique:true},
    city:{type:String , required:true},
    about:{type:String},
    logo:{type:String,default:""},
    coverpic:{type:String,default:""},
    isVerified:{type:Boolean},
    verificationRequest:{type:Boolean},
    totalBooking:{type:Number},
    vendor_type:{type:Schema.Types.ObjectId},
    isActive:{type:Boolean},
    coverpicUrl:{type:String,default:""},
    logoUrl:{type:String,default:""},
    bookedDates:{type:Array<String>},
    refreshToken:{type:String},
    totalRating:{type:Number,default:0},
    locks: [{
        date: {
          type: String,
          required: true
        },
        isLocked: {
          type: Boolean,
          default: false
        }
      }]

});

export default model<IVendorDocument>('Vendor', VendorSchema);