import { Schema,model } from "mongoose";
import { IConversationDocument} from "../interfaces/conversation.interface"



const conversationSchema=new Schema({
    members:[{
        type:String,
    }],
    recentMessage: String
},{timestamps:true})


export default model<IConversationDocument>("Conversation",conversationSchema)