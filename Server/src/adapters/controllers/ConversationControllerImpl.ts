import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler";
import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { ConversationUseCase } from "../../domain/interfaces/application interfaces/ConversationUseCase";
import { ConversationController } from "../../domain/interfaces/adapter interfaces/ConversationController";

@injectable()
export class ConversationControllerImpl implements ConversationController {
    constructor(@inject(TYPES.ConversationUseCase) private conversationUseCase: ConversationUseCase) {}

    createChat = asyncHandler("CreateChat")( async (req: Request, res: Response): Promise<void> => {
      const { senderId, receiverId } = req.body;
      const chat=await this.conversationUseCase.createConversation(senderId,receiverId)
      res.status(200).json(chat);
    })

    findUserchats = asyncHandler("FindUserChats")( async (req: Request, res: Response): Promise<void> => {
      let userId:string= req.query.userId as string;
      const chats = await this.conversationUseCase.findChat(userId);
      res.status(200).json(chats); 
    })
}