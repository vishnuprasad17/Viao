import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRefreshToken {
    sessionId: string;
    token: string;
    tokenFamily: string;
    createdAt: Date;
}

interface IAdmin extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  wallet: number,
  refreshTokens: IRefreshToken[];
  createdAt: Date;
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

const AdminSchema: Schema = new Schema(
  {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wallet: { type: Number, default: 0, min: 0 },
  refreshTokens: [refreshTokenSchema]
  },
  { timestamps: true }
);

const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema);
export { AdminModel, IAdmin };