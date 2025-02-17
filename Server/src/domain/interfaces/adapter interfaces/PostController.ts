import { Request, Response, NextFunction } from "express";

export interface PostController {
    getPosts(req: Request, res: Response, next: NextFunction): Promise<void>;
    addNewPost(req: Request, res: Response, next: NextFunction): Promise<void>;
    deletePost(req: Request, res: Response, next: NextFunction): Promise<void>;
}