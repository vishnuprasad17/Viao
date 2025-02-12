import mongoose, { Schema, Document, Types } from "mongoose";

interface IMessage extends Document {
  _id: Types.ObjectId;
  conversationId:string;
  senderId:string;
  text:string;
  imageName:string;
  imageUrl:string;
  isRead:boolean;
  isDeleted:boolean;
  deletedIds:string[];
  createdAt:Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    conversationId:{
        type:String,
        required:true
    },
    senderId:{
        type:String,
        required:true
    },
    text:{
        type:String
    },
    imageName:{
        type:String
    },
    imageUrl:{
        type:String
    },
    isRead:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedIds:[{
        type:String
    }]
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);
export { MessageModel, IMessage };