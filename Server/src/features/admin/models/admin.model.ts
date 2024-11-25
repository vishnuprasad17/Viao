import { Schema, model } from 'mongoose';
import { IAdminDocument } from "../interfaces/model.interface";
const adminSchema = new Schema<IAdminDocument>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  isAdmin: { type: Boolean, required: true },
});

export default model<IAdminDocument>('Admin', adminSchema);