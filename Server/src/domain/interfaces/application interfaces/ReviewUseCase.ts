import { ReviewDTO } from "../../dtos/ReviewDTO";
import { Review } from "../../entities/Review";

export interface ReviewUseCase {
    add(content: string, rating: number, userId: string, vendorId: string): Promise<boolean>;
    addReply(content: string, reviewId: string): Promise<ReviewDTO>;
    getReviewsForVendor(vendorId: string,page: number, pageSize: number): Promise<{ reviews: ReviewDTO[], totalPages: number }>;
    checkReviewsByUser(vendorId: string, userId: string): Promise<Review | null>;
    updateReviewContent(reviewId: string, content: string, rating: number): Promise<ReviewDTO | null>;
    delete(reviewId: string): Promise<boolean>;
    getReviewStatisticsByVendorId(vendorId: string): Promise<number[]>;
}