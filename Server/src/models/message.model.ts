import { Schema,model } from "mongoose";
import { IMessageDocument } from "../interfaces/message.interface";


const messageSchema=new Schema<IMessageDocument>({
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
},{timestamps:true})


export default model<IMessageDocument>('Message',messageSchema)