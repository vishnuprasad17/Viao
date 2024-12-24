import { IPostDocument } from "../interfaces/post.interface";
import mongoose from "mongoose";
import PostRepository from "../data-access/post.repository";
import { BaseError } from "../shared/error/base.error";
import postRepository from "../data-access/post.repository";


class PostService {
  async createPost(
    caption: string,
    imageName: string,
    vendor_id: string,
    imageUrl: string
  ): Promise<object> {
    try {
      const vendorIdObjectId = new mongoose.Types.ObjectId(
        vendor_id
      ) as unknown as mongoose.Schema.Types.ObjectId;
      const add = await PostRepository.create({
        caption,
        image: imageName,
        vendor_id: vendorIdObjectId,
        imageUrl,
      });
      return { post: add };
    } catch (error) {
      console.error("Error in createPost:", error)
      throw new BaseError("Failed to create post.", 500); 
    }
  }

  async getAllPostsByVendor(vendor_id: string, page: number, pageSize: number) {
    try {
      const skip = (page - 1) * pageSize;
      const posts = await PostRepository.findPostsByVendorId(vendor_id)
        .skip(skip)
        .limit(pageSize);
      const totalPosts = await postRepository.countDocuments({
        vendor_id: vendor_id,
      });
      return { posts, totalPosts };
    } catch (error) {
      console.error("Error in getAllPostsByVendor:", error)
      throw new BaseError("Failed to get posts by vendor.", 500); 
    }
  }

  async getPostById(_id: string): Promise<IPostDocument | null> {
    try {
      const post = await PostRepository.getById(_id);
      if (!post) {
        throw new BaseError(`Post with ID ${_id} not found.`, 404)
      }
      return post;
    } catch (error) {
      console.error("Error in getPostById:", error)
      throw new BaseError("Failed to get post by ID.", 500);
    }
  }

  async deletePostService(_id: string): Promise<IPostDocument | null> {
    try {
      const post = await PostRepository.delete(_id);
      if (!post) {
        throw new BaseError(`Post with ID ${_id} not found.`, 404)
      }
      return post;
    } catch (error) {
      console.error("Error in deletePostService:", error)
      throw new BaseError("Failed to delete post.", 500);
    }
  }
}

export default new PostService();