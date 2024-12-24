import Post from "../models/post.model";
import { IPostDocument } from "../interfaces/post.interface";
import { BaseRepository } from './../shared/data-access/base.repo';


class PostRepository extends BaseRepository<IPostDocument>{
  constructor(){
    super(Post)
  }

  findPostsByVendorId(vendor_id: string) {
    return Post.find({ vendor_id });
  }
}


export default new PostRepository();