import mongoose, { Schema, Document, Types } from "mongoose";

interface IPost extends Document {
  _id: Types.ObjectId;
  imageUrl: string;
  caption:string;
  image:string;
  vendor_id:Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

const PostModel = mongoose.model<IPost>("Post", PostSchema);
export { PostModel, IPost };