import { Response } from "express";
import { BaseError } from '../error/base.error';

export function errorHandler(res: Response, error: any, contextMessage: string): void {
  if (error instanceof BaseError) {
    res.status(error.statusCode).json({ message: error.message });
  } else {
    console.error(`Unexpected error in ${contextMessage}:`, error);
    res.status(500).json({ message: "Internal Server Error. Please try again later." });
  }
}