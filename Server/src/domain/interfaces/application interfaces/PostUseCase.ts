import { PostDTO } from "../../dtos/PostDTO";
import { Post } from "../../entities/Post";

export interface PostUseCase {
    getAllPostsByVendor(vendor_id: string, page: number, pageSize: number): Promise<{ posts: PostDTO[], totalPages: number}>;
    createPost(caption: string, vendor_id: string, file: Express.Multer.File | undefined): Promise<{ post: PostDTO}>;
    deletePost(id: string): Promise<{ message: string }>;
}