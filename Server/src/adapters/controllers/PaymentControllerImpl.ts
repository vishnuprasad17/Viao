import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../middlewares/async-handler";
import { PaymentController } from "../../domain/interfaces/adapter interfaces/PaymentController";
import TYPES from "../../domain/constants/inversifyTypes";
import { PaymentUseCase } from "../../domain/interfaces/application interfaces/PaymentUseCase";

  
@injectable()
export class PaymentControllerImpl implements PaymentController {
    constructor(@inject(TYPES.PaymentUseCase) private paymentUseCase: PaymentUseCase) {}

    makePayment = asyncHandler("MakePayment")(async(req: Request, res: Response): Promise<void> => {
        const{ userId, vendorId, bookingId, name, logoUrl, useWallet} = req.body;
        if (!req.session) {
          throw new Error('Session not initialized');
        }
        const result = await this.paymentUseCase.pay(userId, vendorId, bookingId, name, logoUrl, useWallet);
        if (result === "completed") {
          res.send({ status: "completed"});
          return;
        }
    
        res.send({ url: result });
      })
    
    
    addPayment = asyncHandler("AddPayment")(async(req: Request, res: Response): Promise<void> => {
        const session_id = req.query.sessionId as string;
        const payment = await this.paymentUseCase.verifyAndAddNewPayment(session_id);
        
        res.status(200).json({ payment });
      })
    
    getAllPayments = asyncHandler("GeAllPayments")(async(req: Request, res: Response): Promise<void> => {
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 6;
        const { payment, totalPages } = await this.paymentUseCase.getPayments(page,pageSize)
        
        res.status(200).json({ payment, totalPages });
      })
}