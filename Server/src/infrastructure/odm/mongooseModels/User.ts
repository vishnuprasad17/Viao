import mongoose, { Schema, Document, Types } from "mongoose";

interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: number;
  isActive: boolean;
  imageUrl: string;
  favourite: string[];
  wallet: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number },
    isActive: { type: Boolean, default: true },
    imageUrl: { type: String },
    favourite: { type: [String], default: [] },
    wallet: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);
export { UserModel, IUser };