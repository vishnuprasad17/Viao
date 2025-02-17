import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../middlewares/async-handler";
import { ReviewController } from "../../domain/interfaces/adapter interfaces/ReviewController";
import TYPES from "../../domain/constants/inversifyTypes";
import { ReviewUseCase } from "../../domain/interfaces/application interfaces/ReviewUseCase";

@injectable()
export class ReviewControllerImpl implements ReviewController {
    constructor(@inject(TYPES.ReviewUseCase) private reviewUseCase: ReviewUseCase) {}

    addReview = asyncHandler("AddReview")(async(req: Request, res: Response): Promise<void> => {
        const content = req.body.content;
        const rating: number = req.body.rating as number;
        const userId: string = req.body.userId as string;
        const vendorId: string = req.body.vendorId as string;
    
        const status = await this.reviewUseCase.add(
          content,
          rating,
          userId,
          vendorId
        );
          if (!status) {
            res
              .status(400)
              .json({ error: `couldn't add reviews, some error occured` });
            return;
          }
          res.status(200).json({ message: "review added for vendor.." });
     });

    addReviewReply = asyncHandler("AddReply")(async(req: Request, res: Response): Promise<void> => {
        const reviewId: string = req.query.reviewId as string;
        const content = req.body.content;
        const result = await this.reviewUseCase.addReply(
          content,
          reviewId
        );

        res.status(200).json({ vendorData: result });
     });

    getReviews = asyncHandler("GetReviews")(async(req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.query.vendorId as string;
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 6;
        const { reviews, totalPages } = await this.reviewUseCase.getReviewsForVendor(vendorId,page,pageSize);

        res.status(200).json({reviews,totalPages});
     });

    checkIfUserReviewed = asyncHandler("CheckReviews")(async(req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.query.vendorId as string;
        const userId: string = req.query.userId as string;
        const review = await this.reviewUseCase.checkReviewsByUser(vendorId, userId);

        if (review) {
          console.log(review);
          res.status(200).json({ hasReviewed: true });
          return;
        }
    
        res.status(200).json({ hasReviewed: false });
     });

    updateReview = asyncHandler("UpdateReview")(async(req: Request, res: Response): Promise<void> => {
        const reviewId = req.query.reviewId as string;
        const { content, rating } = req.body;
        const updateReview = await this.reviewUseCase.updateReviewContent(reviewId,content, rating);

        if (!updateReview) {
        res.status(404).json({ message: "Review not found" });
        return;
        }

        res.status(200).json({updateReview});
     });

    deleteReview = asyncHandler("DeleteReview")(async(req: Request, res: Response): Promise<void> => {
        const reviewId = req.query.reviewId as string;
        const deletedReview = await this.reviewUseCase.delete(reviewId);

        if (!deletedReview) {
          res.status(404).json({ message: "Review not found." });
          return;
        }
        res.status(200).json({ message: "Review deleted successfully!" });
    })

    getReviewStatistics = asyncHandler("GetReviewStatistics")(async(req: Request, res: Response): Promise<void> => {
        const { vendorId } = req.query as {vendorId:string};
        const percentages = await this.reviewUseCase.getReviewStatisticsByVendorId(
          vendorId
        );
        res.status(200).json({ percentages });
     });
}