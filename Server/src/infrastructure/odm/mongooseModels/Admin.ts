import mongoose, { Schema, Document, Types } from "mongoose";

interface IAdmin extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  wallet: number,
  createdAt: Date;
}

const AdminSchema: Schema = new Schema(
  {
  email: { type: String, required: true },
  password: { type: String, required: true },
  wallet: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema);
export { AdminModel, IAdmin };