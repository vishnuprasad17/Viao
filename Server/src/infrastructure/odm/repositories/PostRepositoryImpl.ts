import { PostRepository } from "../../../domain/interfaces/infrastructure interfaces/PostRepository";
import { BaseRepository } from "./BaseRepository";
import { PostModel, IPost } from "../mongooseModels/Post";
import { mapToDomain, mapToDatabase } from "../mappers/postMapper";
import { Post } from "../../../domain/entities/Post";
import { injectable } from "inversify";

@injectable()
export class PostRepositoryImpl extends BaseRepository<IPost, Post> implements PostRepository {
  constructor(){
    super(PostModel)
  }

  // Implement mapping methods
  protected toDomain(document: IPost): Post {
    return mapToDomain(document);
  }

  protected toDatabase(domain: Post): Partial<IPost> {
    return mapToDatabase(domain);
  }

  async findPostsByVendorId(vendor_id: string, skip: number, pageSize: number) {
      const posts = await PostModel.find({ vendor_id }).skip(skip)
      .limit(pageSize);;
      return posts.map(post => this.toDomain(post));
  }

}