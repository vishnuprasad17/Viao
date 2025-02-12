import mongoose, { Schema, Document, Types } from "mongoose";

interface IConversation extends Document {
  _id: Types.ObjectId;
  members:string[];
  recentMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    members:[{
        type:String,
    }],
    recentMessage:{
        type:String
    }
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model<IConversation>("Conversation", ConversationSchema);
export { ConversationModel, IConversation };