import mongoose, { Schema, Document, Types } from "mongoose";

interface IVendorType extends Document {
  _id: Types.ObjectId;
  type:string;
  status:boolean;
  image:string;
  imageUrl:string;
}

const VendorTypeSchema: Schema = new Schema(
  {
    type :{type:String , required:true} ,
    status :{type:Boolean , required:true,default:true},
    image:{type:String,required:true,default:""},
    imageUrl:{type:String,default:""},
  },
  { timestamps: true }
);

const VendorTypeModel = mongoose.model<IVendorType>("VendorType", VendorTypeSchema);
export { VendorTypeModel, IVendorType };