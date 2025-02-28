import { Review } from "../entities/Review";
import { UserDTO } from "./UserDTO";
import { VendorDTO } from "./VendorDTO";

export class ReviewDTO {
    id: string;
    vendorId: string | VendorDTO
    userId: string | UserDTO;
    rating: number;
    content: string;
    reply: string[];
    createdAt: Date;
    replyAt: Date;
  
    constructor(review: Review) {
        this.id = review.id;
        if (typeof review.vendorId === "string") {
          this.vendorId = review.vendorId;
      } else {
          this.vendorId = VendorDTO.fromDomain(review.vendorId);
      }
        if (typeof review.userId === "string") {
            this.userId = review.userId;
        } else {
            this.userId = UserDTO.fromDomain(review.userId);
        }
        this.rating = review.rating;
        this.content = review.content;
        this.reply = review.reply;
        this.createdAt = review.createdAt;
        this.replyAt = review.replyAt;
    }
  
    static fromDomain(review: Review): ReviewDTO {
      return new ReviewDTO(review);
    }
  
    static fromDomainList(reviews: Review[]): ReviewDTO[] {
      return reviews.map(review => new ReviewDTO(review));
    }
  }