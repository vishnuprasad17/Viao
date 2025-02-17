import { inject, injectable } from "inversify";
import { PostUseCase } from "../../domain/interfaces/application interfaces/PostUseCase";
import TYPES from "../../domain/constants/inversifyTypes";
import { PostRepository } from "../../domain/interfaces/infrastructure interfaces/PostRepository";
import { Post } from "../../domain/entities/Post";
import { BaseError } from "../../domain/errors/BaseError";
import { UploadService } from "../../domain/interfaces/application interfaces/UploadService";
import { PostDTO } from "../../domain/dtos/PostDTO";

@injectable()
export class PostUseCaseImpl implements PostUseCase {
    constructor(@inject(TYPES.PostRepository) private postRepository: PostRepository,
                @inject(TYPES.UploadService) private uploadService: UploadService) {}

    async getAllPostsByVendor(vendor_id: string, page: number, pageSize: number): Promise<{ posts: PostDTO[], totalPages: number}> {
          const skip = (page - 1) * pageSize;
          const posts = await this.postRepository.findPostsByVendorId(vendor_id, skip, pageSize);
          const totalPosts = await this.postRepository.countDocuments({
            vendor_id: vendor_id,
          });
          const totalPages = Math.ceil(totalPosts / pageSize);
          const postDtos = PostDTO.fromDomainList(posts);

          return { posts: postDtos, totalPages};
      }
    
    async createPost(caption: string, vendor_id: string, file: Express.Multer.File | undefined): Promise<{ post: PostDTO}> {
        let image;
        let imageUrl;
        if (file) {
            const data = await this.uploadService.uploadPost(file);
            image = data.image;
            imageUrl = data.imageUrl;
        } else {
            throw new BaseError("No file provided for post creation.", 404);
        }
        const post = new Post (
            "",
            caption,
            vendor_id,
            image,
            imageUrl
        )
        const newPost = await this.postRepository.create(post);
        const postDtos = PostDTO.fromDomain(newPost);
          return { post: postDtos };
      }
    
    async deletePost(id: string): Promise<{ message: string }> {
        const post=await this.postRepository.getById(id);
        if(!post){
          throw new BaseError('Post not found!',404)
        }
        const deletedPost = await this.postRepository.delete(id);
        if (!deletedPost) {
          throw new BaseError(`Post with ID ${id} not found.`, 404)
        }
        
        return {message:"Post deleted successfully"};
      }
}