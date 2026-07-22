// ServiceSchema.ts
import mongoose, { Schema, Document, Types } from "mongoose";

interface IService extends Document {
  _id: Types.ObjectId;
  vendorId: Types.ObjectId;
  name: string;
  price: number;
  advancePercentage: number;
  minimumBookingNoticeInDays: number;
  cancellationFullRefundBeforeDays: number;
  cancellationPartialRefundBeforeDays?: number;
  partialRefundPercentage?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  advancePercentage: {
    type: Number,
    required: true,
    default: 100,
    min: 1,
    max: 100
  },
  minimumBookingNoticeInDays: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  cancellationFullRefundBeforeDays: {
    type: Number,
    required: true,
    default: 7
  },
  cancellationPartialRefundBeforeDays: {
    type: Number,
    default: null
  },
  partialRefundPercentage: {
    type: Number,
    default: null,
    min: 0,
    max: 100
  }
}, { timestamps: true });

const ServiceModel = mongoose.model<IService>("Service", ServiceSchema);
export { ServiceModel, IService };