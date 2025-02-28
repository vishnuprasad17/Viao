// ServiceSchema.ts
import mongoose, { Schema, Document, Types } from "mongoose";

interface IService extends Document {
  _id: Types.ObjectId;
  vendorId: Types.ObjectId;
  name: string;
  price: number;
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
  }
}, { timestamps: true });

const ServiceModel = mongoose.model<IService>("Service", ServiceSchema);
export { ServiceModel, IService };