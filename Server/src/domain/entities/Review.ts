import { User } from "./User";
import { Vendor } from "./Vendor";

export class Review {
    constructor(
        public readonly id: string,
        public userId: string | User,
        public vendorId: string | Vendor,
        public rating: number,
        public content: string,
        public reply: string[],
        public createdAt: Date,
        public replyAt: Date
    ) {}

    // Method to update specific fields
      updateFields(fields: Partial<Pick<Review, "content" | "rating">>) {
        if (fields.content !== undefined) {
          this.content = fields.content;
        }
        if (fields.rating !== undefined) {
          this.rating = fields.rating;
        }
      }
}