import { Review } from "../entities/Review";
import { UserDTO } from "./UserDTO";

export class ReviewDTO {
    id: string;
    userId: string | UserDTO;
    rating: number;
    content: string;
    reply: string[];
    createdAt: Date;
  
    constructor(review: Review) {
        this.id = review.id;
        if (typeof review.userId === "string") {
            this.userId = review.userId;
        } else {
            this.userId = UserDTO.fromDomain(review.userId);
        }
        this.rating = review.rating;
        this.content = review.content;
        this.reply = review.reply;
        this.createdAt = review.createdAt;
    }
  
    static fromDomain(review: Review): ReviewDTO {
      return new ReviewDTO(review);
    }
  
    static fromDomainList(reviews: Review[]): ReviewDTO[] {
      return reviews.map(review => new ReviewDTO(review));
    }
  }