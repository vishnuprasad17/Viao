import mongoose, { Schema, Document, Types } from "mongoose";

interface IBooking extends Document {
  _id: Types.ObjectId;
  date:string;
  name:string;
  eventName:string;
  city:string;
  pin:number;
  mobile:number;
  vendorId:Types.ObjectId;
  userId:Types.ObjectId;
  status:string;
  payment_status:string;
  amount:number;
  refundAmount:number;
  deductedFromWallet:number;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    name:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    eventName:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    pin:{
        type:Number,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    vendorId:{
        type:Schema.Types.ObjectId,
        ref: 'Vendor',
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    status:{
        type:String,
        default:"Pending"
    },
    payment_status:{
        type:String,
        default:"Pending"
    },
    amount:{
        type:Number,
        default:0
    },
    refundAmount:{
        type:Number,
        default:0
    },
    deductedFromWallet:{
        type:Number,
        default:0
    }
  },
  { timestamps: true }
);

const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
export { BookingModel, IBooking };