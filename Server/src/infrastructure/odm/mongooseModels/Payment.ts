import mongoose, { Schema, Document, Types } from "mongoose";

interface IPayment extends Document {
  _id: Types.ObjectId;
  amount: number;
  vendorId: Types.ObjectId;
  userId: Types.ObjectId;
  bookingId: Types.ObjectId;
  modeOfPayment: string;
  transactionRef: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, default: 0},
    modeOfPayment: { type: String, required: true},
    transactionRef: { type: String, required: true }
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
export { PaymentModel, IPayment };