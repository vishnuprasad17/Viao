import { Request, Response, NextFunction } from "express";

export const asyncHandler = (context: string) => 
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => 
    fn(req, res, next).catch((error) => {
      error.context = context;
      next(error);
    });