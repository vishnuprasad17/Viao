import { inject, injectable } from "inversify";
import { ReviewUseCase } from "../../domain/interfaces/application interfaces/ReviewUseCase";
import { ReviewRepository } from "../../domain/interfaces/infrastructure interfaces/ReviewRepository";
import TYPES from "../../domain/constants/inversifyTypes";
import { VendorRepository } from "../../domain/interfaces/infrastructure interfaces/VendorRepository";
import { BaseError } from "../../domain/errors/BaseError";
import { Review } from "../../domain/entities/Review";
import { Types } from "../../domain/constants/notificationTypes";
import { NotificationService } from "../../domain/interfaces/application interfaces/NotificationService";
import { NotificationRepository } from "../../domain/interfaces/infrastructure interfaces/NotificationRepository";
import { ReviewDTO } from "../../domain/dtos/ReviewDTO";

const calculateOverallRating = (ratings: number[]): number => {
    const validRatings = ratings.filter(
      (rating) => typeof rating === "number" && !isNaN(rating)
    );
    if (validRatings.length === 0) {
      return 0;
    }
  
    const totalRating = validRatings.reduce((acc, rating) => acc + rating, 0);
    const averageRating = totalRating / validRatings.length;
    return Math.round(averageRating * 10) / 10;
  };
  
@injectable()
export class ReviewUseCaseImpl implements ReviewUseCase {
    constructor(@inject(TYPES.ReviewRepository) private reviewRepository: ReviewRepository,
                @inject(TYPES.VendorRepository) private vendorRepository: VendorRepository,
                @inject(TYPES.NotificationRepository) private notificationRepository: NotificationRepository,
                @inject(TYPES.NotificationService) private notificationService: NotificationService) {}

        async add(content: string, rating: number, userId: string, vendorId: string): Promise<boolean> {
              const vendorData = await this.vendorRepository.getById(vendorId);
              if (!vendorData) {
                throw new BaseError("Vendor not found.", 404);
              }
              const review = new Review(
                "",
                userId,
                vendorId,
                rating,
                content,
                [],
                new Date(),
                new Date() 
              )
              await this.reviewRepository.create(review);
              //Update total rating
              const vendorReview = await this.reviewRepository.findByCondition({
                vendorId: vendorId,
              });
              const vendorRatings = vendorReview.map((review) => review.rating);
              const totalRating = calculateOverallRating(vendorRatings);
              await this.vendorRepository.updateRating(vendorData.id, totalRating);

              //Notification
              const message = "New review added!";
              const type = Types.REVIEW;
              const newNotification = await this.notificationService.createNotification(vendorId, message, type);
              await this.notificationRepository.create(newNotification);
              return true;
          }

          async addReply(content: string, reviewId: string): Promise<ReviewDTO> {
              const review = await this.reviewRepository.getById(reviewId);
              if (!review) {
                throw new BaseError("Review not found.", 404);
              }
              const updateReply = await this.reviewRepository.addReply(content, reviewId);
              if (!updateReply) {
                throw new BaseError("Failed to add reply to review.", 500);
              }

              return ReviewDTO.fromDomain(updateReply);
          }
        
          async getReviewsForVendor(vendorId: string,page: number, pageSize: number): Promise<{ reviews: ReviewDTO[], totalPages: number }> {
              const { reviews, count } = await this.reviewRepository.getReviewsByVendorId(vendorId, page, pageSize);
              const totalPages = Math.ceil(count / pageSize);
              const reviewDtos = ReviewDTO.fromDomainList(reviews);

              return { reviews: reviewDtos, totalPages: totalPages };
          }

          async checkReviewsByUser(vendorId: string, userId: string): Promise<Review | null> {
              return await this.reviewRepository.findOne({ userId, vendorId });
          }
        
          async updateReviewContent(reviewId: string, content: string, rating: number): Promise<ReviewDTO | null> {
              const existing = await this.reviewRepository.getById(reviewId);
              if (!existing) {
                return null;
              }
              const vendorData = await this.vendorRepository.getById(existing.vendorId as string);
              if (!vendorData) {
                throw new BaseError("Vendor not found.", 404);
              }
              const update = {
                content: content || existing.content,
                rating: rating || existing.rating,
              };
        
              existing.updateFields(update);
              const reviewData = await this.reviewRepository.update(reviewId, existing);
              if (!reviewData) {
                throw new BaseError("Review not found.", 404);
              }

              //Update total rating
              const vendorId = vendorData.id;
              const vendorReview = await this.reviewRepository.findByCondition({
                vendorId: vendorId,
              });
              const vendorRatings = vendorReview.map((review) => review.rating);
              const totalRating = calculateOverallRating(vendorRatings);
              await this.vendorRepository.updateRating(vendorData.id, totalRating);
              

              return ReviewDTO.fromDomain(reviewData);
          }

          async delete(reviewId: string): Promise<boolean> {
              const deletedReview = await this.reviewRepository.delete(reviewId);
              if (!deletedReview) {
                return false;
              }
              
              return true;
          };
        
          async getReviewStatisticsByVendorId(vendorId: string): Promise<number[]> {
              const {reviews}= await this.reviewRepository.getReviewsByVendorId(vendorId,1,1);
              console.log(reviews);
              const ratingCounts = [0, 0, 0, 0, 0];
              reviews?.forEach((review: Review) => {
                if (review.rating >= 1 && review.rating <= 5) {
                  ratingCounts[review.rating - 1] += 1;
                }
              });
              const totalReviews = reviews?.length;
              const ratingPercentages = ratingCounts.map((count) =>
                totalReviews! > 0 ? (count / totalReviews!) * 100 : 0
              );
        
              return ratingPercentages;
          }
}
