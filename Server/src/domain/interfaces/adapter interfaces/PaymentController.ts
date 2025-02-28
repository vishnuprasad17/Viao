
import { Request, Response, NextFunction } from "express";

export interface PaymentController {
    makePayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    addPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllPayments(req: Request, res: Response, next: NextFunction): Promise<void>;
}