import { Request, Response } from "express";
import { conversationService } from "../services";
import { asyncHandler } from "../shared/middlewares/async-handler";


class ConversationController{
  createChat = asyncHandler("CreateChat")( async (req: Request, res: Response): Promise<void> => {
      const { senderId, receiverId } = req.body;
      const chat=await conversationService.createConversation(senderId,receiverId)
      res.status(200).json(chat);
  })

  findUserchats = asyncHandler("FindUserChats")( async (req: Request, res: Response): Promise<any> => {
      let userId:string= req.query.userId as string;
      const chats = await conversationService.findChat(userId);
      res.status(200).json(chats); 
  })
}


export default new ConversationController()