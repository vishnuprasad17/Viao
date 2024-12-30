import { Request, Response } from "express";
import { asyncHandler } from "../shared/middlewares/async-handler";
import { notificationService } from "../services";


class NotificationController {
  getAllNotifications = asyncHandler("GetAllNotifications")(async (req: Request, res: Response) => {
      const page: number = parseInt(req.query.page as string) || 1;
      const pageSize: number = parseInt(req.query.pageSize as string) || 8;
      const recipient:string=req.query.recipient as string
      const {notifications,count}=await notificationService.getNotifications(recipient,page,pageSize)
      const totalPages = Math.ceil(count / pageSize);
      res.status(201).json({notification:notifications,totalPages: totalPages})  
  })

  toggleRead = asyncHandler("ToggleRead")(async (req: Request, res: Response) => {
      const id:string=req.body.id as string
      const recipient:string=req.body.recipient as string;
      const data=await notificationService.changeReadStatus(id,recipient)
      res.status(201).json({notification:data})
  })

  deleteNotification = asyncHandler("DeleteNotification")(async (req: Request, res: Response) => {
      console.log(req.query)
      const {id:_id, recipient } = req.query as { id: string; recipient: string };
       
      const deleteData=await notificationService.delete(_id)
      res.status(201).json({notification:deleteData})
  })

  getCount = asyncHandler("GetAllNotifications")(async (req: Request, res: Response) => {
      const {recipient } = req.query as { recipient: string };
      const data=await notificationService.getUnreadNotifications(recipient)
      res.status(201).json({count:data?.length})
  })

};

export default new NotificationController()