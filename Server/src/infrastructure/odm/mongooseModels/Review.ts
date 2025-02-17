import mongoose, { Schema, Document, Types } from "mongoose";

interface IReview extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  vendorId: Types.ObjectId;
  rating: number;
  content: string;
  reply: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    rating: { type: Number, required: true },
    content: { type: String, required: true },
    reply: [{ type: String }]
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
export { ReviewModel, IReview };