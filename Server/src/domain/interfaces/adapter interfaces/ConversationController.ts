import { Request, Response, NextFunction } from "express";

export interface ConversationController {
    createChat(req: Request, res: Response, next: NextFunction): Promise<void>;
    findUserchats(req: Request, res: Response, next: NextFunction): Promise<void>;
}