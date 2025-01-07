import { Document } from "mongoose";

export interface IConversationDocument extends Document{
    members:String[];
    recentMessage: String;
}