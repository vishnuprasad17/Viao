import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler";
import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { MessageUseCase } from "../../domain/interfaces/application interfaces/MessageUseCase";
import { MessageController } from "../../domain/interfaces/adapter interfaces/MessageController";

@injectable()
export class MessageControllerImpl implements MessageController{
    constructor(@inject(TYPES.MessageUseCase) private messageUseCase: MessageUseCase) {}

    createMessage = asyncHandler("CreateMessage")(async (req: Request, res: Response): Promise<void> => {
        const { conversationId, senderId, text,imageName,imageUrl} = req.body;
        const response = await this.messageUseCase.createMessage(
         conversationId,
         senderId,
         text,
         imageName,
         imageUrl
        );
       
        res.status(200).json(response);
    })

    getMessages = asyncHandler("GetMessage")(async (req: Request, res: Response): Promise<void> => {
        const conversationId: string = req.query.conversationId as string;
        const messages = await this.messageUseCase.findMessages(conversationId);
        
        res.status(200).json(messages);
    })

    deleteMessage = asyncHandler("DeleteMessage")(async (req: Request, res: Response): Promise<void> => {
      const msgId = req.body.msgId;
      const messages = await this.messageUseCase.updateStatus(msgId);
      res.status(200).json({ messages });
  })

    changeViewMessage = asyncHandler("ChangeViewMessage")(async (req: Request, res: Response): Promise<any> => {
      const { msgId, id } = req.body;
      const messages = await this.messageUseCase.changeMessageView(msgId,id);
      res.status(200).json({ messages });
  })
  
    changeRead = asyncHandler("ChangeRead")(async (req: Request, res: Response): Promise<void> => {
    const { chatId, senderId } = req.body;
    const messages = await this.messageUseCase.changeReadStatus(chatId,senderId)
    res.status(200).json({ messages });
  })
}