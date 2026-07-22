import mongoose, { Schema, Document, Types } from "mongoose";

/** Immutable financial snapshot — written once, never mutated after payment */
interface IBookingFinancials {
  totalServicePrice: number;
  chargeAmount: number; // Amount charged at booking time (advance or full)
  walletDeducted: number; // Portion paid from user's wallet
  stripeAmount: number; // Portion paid via Stripe
  adminCommissionPercent: number; // Admin commission % applied
  adminCommissionAmount: number; // Admin's share of the payment (in ₹)
  vendorNetAmount: number; // Vendor's share of the payment (in ₹)
 
  // ── Filled on cancellation ───────────────────────────────────────────
  cancellationScenario?: "full_refund" | "partial_refund" | "no_refund" | null;
  refundToUser?: number;
  adminKeepsOnCancel?: number;
  vendorCompensationOnCancel?: number;
}

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

  /** Immutable financial snapshot — written once, never mutated after payment */
  financials: IBookingFinancials;

  userNote?: string;
  adminRemark?: string;
  paymentFailedAt?: Date;
  retryDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingFinancialsSchema = new Schema<IBookingFinancials>(
  {
    totalServicePrice:      { type: Number, default: 0 },
    chargeAmount:           { type: Number, default: 0 },
    walletDeducted:         { type: Number, default: 0 },
    stripeAmount:           { type: Number, default: 0 },
    adminCommissionPercent: { type: Number, default: 0 },
    adminCommissionAmount:  { type: Number, default: 0 },
    vendorNetAmount:        { type: Number, default: 0 },
    cancellationScenario:   { type: String, default: null },
    refundToUser:           { type: Number, default: 0 },
    adminKeepsOnCancel:     { type: Number, default: 0 },
    vendorCompensationOnCancel: { type: Number, default: 0 },
  },
  { _id: false }
);

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
    status: {
      type: String,
      default: "payment_pending",
      enum: ["payment_pending", "confirmed", "completed", "cancelled", "failed"]
    },
    payment_status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed", "Failed"]
    },
    financials: { 
      type: BookingFinancialsSchema,
      default: () => ({})
    },
    userNote: {
      type: String,
      default: null,
      maxlength: 500
    },
    adminRemark: {
      type: String,
      default: null,
      maxlength: 1000
    },
    paymentFailedAt: {
      type: Date,
      default: null
    },
    retryDeadline: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

BookingSchema.index({ status: 1, payment_status: 1, retryDeadline: 1 });

const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
export { BookingModel, IBooking };