import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (role) {
        req.role = role;
      } else {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error setting role and repository", error });
    }
  };
};