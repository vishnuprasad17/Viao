import {Schema,model} from "mongoose";
import { IPostDocument } from "../interfaces/post.interface";

const postSchema=new Schema<IPostDocument>({
    caption:{
        type:String,
        required:true
    },
    vendor_id:{
        type:Schema.Types.ObjectId,
        ref: 'Vendor',
        required:true
    },
    image:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String
    }
},{timestamps:true})

export default model<IPostDocument>('Post',postSchema)