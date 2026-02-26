import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler";
import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { MessageUseCase } from "../../domain/interfaces/application interfaces/MessageUseCase";
import { MessageController } from "../../domain/interfaces/adapter interfaces/MessageController";
import { UploadService } from "../../domain/interfaces/application interfaces/UploadService";

@injectable()
export class MessageControllerImpl implements MessageController{
    constructor(@inject(TYPES.MessageUseCase) private messageUseCase: MessageUseCase,
                @inject(TYPES.UploadService) private uploadService: UploadService
                ) {}

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
        const page: number = parseInt(req.query.page as string) || 1;
        const limit: number = parseInt(req.query.limit as string) || 50;

        if (!conversationId) {
            res.status(400).json({ error: 'conversationId is required' });
            return;
        }

        if (page < 1) {
            res.status(400).json({ error: 'page must be >= 1' });
            return;
        }

        if (limit < 1 || limit > 100) {
            res.status(400).json({ error: 'limit must be between 1 and 100' });
            return;
        }
        
        const messages = await this.messageUseCase.findMessages(conversationId, page, limit);
        
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
    const { chatId, viewerId } = req.body;
    const messages = await this.messageUseCase.changeReadStatus(chatId, viewerId);
    res.status(200).json({ messages });
  })

  getPresignedUrl = asyncHandler("GetPresignedUrl")(async (req: Request, res: Response): Promise<void> => {
    const { fileName, fileType } = req.body;
    if (!fileName || !fileType) {
        res.status(400).json({ error: 'fileName and fileType are required' });
        return;
      }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      res.status(400).json({ error: 'Invalid file type. Only images are allowed.' });
      return;
    }
    const { uploadUrl, imageUrl } = await this.uploadService.getPresignedUploadUrl(fileName, fileType);
    res.status(200).json({ uploadUrl, imageUrl });
  })
}