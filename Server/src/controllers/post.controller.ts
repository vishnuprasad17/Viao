import { Request, Response } from "express";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import crypto from "crypto";
import sharp from "sharp";
import { postService } from "../services";
import { asyncHandler } from "../shared/middlewares/async-handler";
import { BaseError } from "../shared/error/base.error";



dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: process.env.BUCKET_REGION!,
});

const randomImage = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

class PostController  {
  getPosts = asyncHandler("GetPost")(async (req: Request, res: Response): Promise<void> => {
      const vendor_id:string=req.query.vendorid as string;
      const page: number = parseInt(req.query.page as string) || 1;
      const pageSize: number = parseInt(req.query.pageSize as string) || 8;
      const {posts,totalPosts}=await postService.getAllPostsByVendor(vendor_id,page,pageSize)
      const totalPages = Math.ceil(totalPosts / pageSize);
      res.status(201).json({posts,totalPages: totalPages});
  })

  addNewPost = asyncHandler("AddPost")(async (req: Request, res: Response): Promise<void> => {
      const caption = req.body.caption;
      const vendor_id: string = req.query.vendorid as string;

      console.log("req file.........")
      console.log(req.file)
  

      const buffer = await sharp(req.file?.buffer)
      .resize({ height: 1920, width: 1080, fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .toBuffer();
  

      const imageName = randomImage();

      const params = {
        Bucket: process.env.BUCKET_NAME!,
        Key: imageName,
        Body: buffer,
        ContentType: req.file?.mimetype,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      
      let imageUrl=`${process.env.IMAGE_URL}/${imageName}`;

      const post = await postService.createPost(caption, imageName, vendor_id,imageUrl);
      res.status(201).json(post);
    
  })

  deletePost = asyncHandler("DeletePost")(async (req: Request, res: Response): Promise<void> => {
      const id=req.params.id;
      const post=await postService.getPostById(id);

      if(!post){
        throw new BaseError('Post not found!',404)
      }
      const params={
        Bucket: process.env.BUCKET_NAME!,
        Key: post?.image,
      }
      
      const command=new DeleteObjectCommand(params);
      await s3.send(command);
      
      await postService.deletePostService(id);
      res.status(200).json({message:"Post deleted successfully"});
  })
};


export default new PostController();