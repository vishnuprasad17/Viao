import {Post } from "../entities/Post";

export interface PostRepository {
  create(post: Post): Promise<Post>;
  getById(id: string): Promise<Post | null>;
  delete(id:string):Promise<Post | null>;
  findPostsByVendorId(vendor_id: string, skip: number, pageSize: number): Promise<Post[]>;
  countDocuments(condition?:Record<string,unknown>):Promise<number>
}