import {Schema,model} from "mongoose";
import { IBookingDocument } from "../interfaces/booking.interface";

const bookingSchema=new Schema<IBookingDocument>({
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
    }
},{timestamps:true})

export default model<IBookingDocument>('Booking',bookingSchema)