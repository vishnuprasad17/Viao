import { Document } from "mongoose";

export interface IMessageDocument extends Document{
    conversationId:String;
    senderId:String;
    text:string;
    imageName:string;
    imageUrl:string;
    isRead:boolean;
    isDeleted:boolean;
    deletedIds:String[];
}