import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";
import { BaseError } from "../error/base.error";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof BaseError ? err.statusCode : 500;
  const message = err instanceof BaseError ? err.message : "Internal Server Error";

  logger.error(`Error Context: ${err.context || "Unknown"} - ${message}`, { stack: err.stack });
  console.log(`Error Context: ${err.context || "Unknown"} - ${message}`, { stack: err.stack });
  
  res.status(statusCode).json({ message });
};