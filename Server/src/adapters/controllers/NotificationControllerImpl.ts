import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../middlewares/async-handler";
import TYPES from "../../domain/constants/inversifyTypes";
import { NotificationUseCase } from "../../domain/interfaces/NotificationUseCase";
import { NotificationController } from "../../domain/interfaces/NotificationController";

@injectable()
export class NotificationControllerImpl implements NotificationController {
    constructor(@inject(TYPES.NotificationUseCase) private notificationUseCase: NotificationUseCase) {}
    
    getAllNotifications = asyncHandler("GetAllNotifications")(async (req: Request, res: Response): Promise<void> => {
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 8;
        const recipient:string=req.query.recipient as string
        const result = await this.notificationUseCase.getNotifications(recipient,page,pageSize);
        
        res.status(201).json(result);
    })
  
    toggleRead = asyncHandler("ToggleRead")(async (req: Request, res: Response): Promise<void> => {
        const id:string=req.body.id as string
        const recipient:string=req.body.recipient as string;
        const data=await this.notificationUseCase.changeReadStatus(id,recipient);

        res.status(201).json({notification:data});
    })
  
    deleteNotification = asyncHandler("DeleteNotification")(async (req: Request, res: Response): Promise<void> => {
        console.log(req.query)
        const {id:_id, recipient } = req.query as { id: string; recipient: string };
        const deleteData=await this.notificationUseCase.delete(_id);

        res.status(201).json({notification:deleteData});
    })
  
    getCount = asyncHandler("GetAllNotifications")(async (req: Request, res: Response): Promise<void> => {
        const {recipient } = req.query as { recipient: string };
        const data = await this.notificationUseCase.getUnreadNotifications(recipient)

        res.status(201).json({count:data});
    })
  
  };