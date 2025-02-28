import mongoose, { Schema, Document, Types } from "mongoose";

// Define the user-specific interface
interface Lock {
    date: string;
    isLocked: boolean;
}

interface IVendor extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    name:string;
    city:string;
    about:string;
    phone:number;
    logo:string;
    coverpic:string;
    isVerified:boolean;
    verificationRequest:boolean;
    totalBooking:number;
    vendor_type:Types.ObjectId;
    isActive:boolean;
    coverpicUrl:string;
    logoUrl:string;
    bookedDates:Array<string>;
    totalRating:number;
    locks:Lock[];  
}

// Define the User schema
const VendorSchema: Schema = new Schema({
    email :{type:String , required:true, unique:true},
    password:{type:String, required:true}, 
    name :{type:String , required:true},
    phone :{type:Number , required:true , unique:true},
    city:{type:String , required:true},
    about:{type:String, default:""},
    logo:{type:String,default:""},
    coverpic:{type:String,default:""},
    isVerified:{type:Boolean, default: false},
    verificationRequest:{type:Boolean, default: false},
    totalBooking:{type:Number, default:0},
    vendor_type:{type:Schema.Types.ObjectId},
    isActive:{type:Boolean, default: true},
    coverpicUrl:{type:String,default:""},
    logoUrl:{type:String,default:""},
    bookedDates:{type:Array<String>},
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

}, { timestamps: true }
);

// Export the Mongoose model
const VendorModel = mongoose.model<IVendor>("Vendor", VendorSchema);
export { VendorModel, IVendor };