import mongoose, { Schema, Document, Types } from "mongoose";
import { Types as NotificationTypes } from "../../../domain/constants/notificationTypes";

interface INotification extends Document {
  _id: Types.ObjectId;
  recipient: Types.ObjectId;
  message: string;
  read: boolean;
  type: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
  recipient: { type: Schema.Types.ObjectId, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { type: String, required: true, enum: Object.values(NotificationTypes) },
  createdAt: { type: Date }
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);
export { NotificationModel, INotification };