import { Request, Response, NextFunction } from "express";

export interface UserController {
    contactMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updatePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteFavoriteVendor(req: Request, res: Response, next: NextFunction): Promise<void>;
    allUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggleBlock(req: Request, res: Response, next: NextFunction): Promise<void>;
    addFavVendor(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}