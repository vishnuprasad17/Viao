import { model, Schema } from "mongoose";
import { INotificationDocument } from "../interfaces/notification.interface";


export const Types = {
    NEW_USER : "NEW_USER",
    NEW_VENDOR : "NEW_VENDOR",
    WELCOME : "WELCOME",
    BOOKING : "BOOKING",
    STATUS : "STATUS",
    VERIFY : "VERIFY",
    VERIFIED : "VERIFIED",
    REJECTED : "REJECTED",
    PAYMENT : "PAYMENT",
    WALLET : "WALLET",
    REVIEW : "REVIEW"
}

const notificationSchema = new Schema<INotificationDocument>(
    {
        recipient: { type: Schema.Types.ObjectId, required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        type: { type: String, required: true, enum: Object.values(Types) },
        createdAt: { type: Date }
    },
    { timestamps: true }
);

export default model<INotificationDocument>("Notification", notificationSchema);