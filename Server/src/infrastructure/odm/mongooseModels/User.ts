import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRefreshToken {
    sessionId: string;
    token: string;
    tokenFamily: string;
    createdAt: Date;
}

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

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    phone: { type: Number },
    isActive: { type: Boolean, default: true, index: true },
    imageUrl: { type: String },
    favourite: { type: [String], default: [] },
    wallet: { type: Number, default: 0, min: 0 },
    refreshTokens: [refreshTokenSchema]
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);
export { UserModel, IUser };