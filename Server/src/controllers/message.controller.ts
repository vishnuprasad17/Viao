import { Request, Response } from "express";
import Message from "../models/message.model";
import { messageService } from "../services";
import { conversationService } from "../services";
import { asyncHandler } from "../shared/middlewares/async-handler";

class MessageController {
  createMessage = asyncHandler("CreateMessage")(async (req: Request, res: Response): Promise<any> => {
      const { conversationId, senderId, text,imageName,imageUrl} = req.body;
      const response = await messageService.createMessage(
        conversationId,
        senderId,
        text,
        imageName,
        imageUrl
      );
      await conversationService.updateConversation(conversationId,text);
      res.status(200).json(response);
  })

  getMessages = asyncHandler("GetMessage")(async (req: Request, res: Response): Promise<any> => {
    const conversationId: string = req.query.conversationId as string;
      const messages = await messageService.findMessages(conversationId);
      res.status(200).json(messages);
  })

  deleteAMessage = asyncHandler("DeleteMessage")(async (req: Request, res: Response): Promise<any> => {
      const msgId = req.body.msgId;
      const messages = await messageService.updateStatus(msgId);
      res.status(200).json({ messages });
  })

  changeViewMessage = asyncHandler("ChangeViewMessage")(async (req: Request, res: Response): Promise<any> => {
      const { msgId, id } = req.body;
      const messages = await messageService.changeMessageView(msgId,id);
      res.status(200).json({ messages });
  })
  
  changeRead = asyncHandler("ChangeRead")(async (req: Request, res: Response): Promise<any> => {
    const { chatId, senderId } = req.body;
    const messages = await messageService.changeReadStatus(chatId,senderId)
    res.status(200).json({ messages });
  })
}

export default new MessageController();