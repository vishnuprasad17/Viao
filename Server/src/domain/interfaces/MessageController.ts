import { Request, Response, NextFunction } from "express";

export interface MessageController {
    createMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMessages(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
    changeViewMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
    changeRead(req: Request, res: Response, next: NextFunction): Promise<void>;
}