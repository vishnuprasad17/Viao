import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../middlewares/async-handler";
import TYPES from "../../domain/constants/inversifyTypes";
import { PostUseCase } from "../../domain/interfaces/PostUseCase";
import { PostController } from "../../domain/interfaces/PostController";

@injectable()
export class PostControllerImpl implements PostController  {
    constructor(@inject(TYPES.PostUseCase) private postUseCase: PostUseCase) {}

    getPosts = asyncHandler("GetPost")(async (req: Request, res: Response): Promise<void> => {
        const vendor_id:string=req.query.vendorid as string;
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 8;
        const result =await this.postUseCase.getAllPostsByVendor(vendor_id,page,pageSize);

        res.status(201).json(result);
    })
  
    addNewPost = asyncHandler("AddPost")(async (req: Request, res: Response): Promise<void> => {
        const caption = req.body.caption;
        const vendor_id: string = req.query.vendorid as string;
        const file = req.file;
        const post = await this.postUseCase.createPost(caption, vendor_id, file);

        res.status(201).json(post);
    })
  
    deletePost = asyncHandler("DeletePost")(async (req: Request, res: Response): Promise<void> => {
        const id=req.params.id;
        const result = await this.postUseCase.deletePost(id);

        res.status(200).json(result);
    })
}