import { Post } from "../entities/Post";

export class PostDTO {
  id: string;
  caption: string;
  imageUrl: string;

  constructor(post: Post) {
    this.id = post.id;
    this.caption = post.caption;
    this.imageUrl = post.imageUrl;
  }

  static fromDomain(post: Post): PostDTO {
    return new PostDTO(post);
  }

  static fromDomainList(posts: Post[]): PostDTO[] {
    return posts.map(post => new PostDTO(post));
  }
}