import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRefreshToken {
    sessionId: string;
    token: string;
    tokenFamily: string;
    createdAt: Date;
}

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
    refreshTokens: IRefreshToken[];
    createdAt: Date;
    updatedAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true
    },
    tokenFamily: {
        type: String,
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800 // TTL index: automatically delete after 7 days (in seconds)
    }
});

const VendorSchema: Schema = new Schema({
    email :{type:String , required:true, unique:true, lowercase: true, trim: true, index: true},
    password:{type:String, required:true}, 
    name :{type:String , required:true, trim: true},
    phone :{type:Number , required:true , unique:true, index: true},
    city:{type:String , required:true, trim: true},
    about:{type:String, default:"", maxlength: 1000},
    logo:{type:String,default:""},
    coverpic:{type:String,default:""},
    isVerified:{type:Boolean, default: false, index: true},
    verificationRequest:{type:Boolean, default: false, index: true},
    totalBooking:{type:Number, default:0},
    vendor_type:{type:Schema.Types.ObjectId},
    isActive:{type:Boolean, default: true, index: true},
    coverpicUrl:{type:String,default:""},
    logoUrl:{type:String,default:""},
    bookedDates:{type:Array<String>},
    totalRating:{type:Number,default:0, min:0, max:5},
    locks: [{
      date: {
        type: String,
        required: true
      },
      isLocked: {
        type: Boolean,
        default: false
      }
    }],
    refreshTokens: [refreshTokenSchema]

}, { timestamps: true }
);

// Export the Mongoose model
const VendorModel = mongoose.model<IVendor>("Vendor", VendorSchema);
export { VendorModel, IVendor };