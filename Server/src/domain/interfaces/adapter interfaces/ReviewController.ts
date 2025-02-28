import { Request, Response, NextFunction } from 'express';

export interface ReviewController {
  addReview(req: Request, res: Response, next: NextFunction): Promise<void>;
  addReviewReply(req: Request, res: Response, next: NextFunction): Promise<void>;
  getReviews(req: Request, res: Response, next: NextFunction): Promise<void>;
  checkIfUserReviewed(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateReview(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteReview(req: Request, res: Response, next: NextFunction): Promise<void>;
  getReviewStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
}