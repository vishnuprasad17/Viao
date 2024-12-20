import { Request, Response, NextFunction } from "express";
import userRepository from "../../data-access/user.repository";
import vendorRepository from "../../data-access/vendor.repository";
import adminRepository from "../../data-access/admin.repository";

export const setRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (role) {
        req.role = role;

        if (role === "user") {
          req.repository = userRepository;
        } else if (role === "vendor") {
          req.repository = vendorRepository;
        } else if (role === "admin") {
            req.repository = adminRepository;
        } else {
          return res.status(400).json({ message: "Invalid role provided" });
        }
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error setting role and repository", error });
    }
  };
};