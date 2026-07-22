import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { CustomJwtPayload } from "../types/jwt";

const VALID_ROLES = ["user", "vendor", "admin"];

export const socketAuthMiddleware = (io: Server) => {
  io.use(async (socket: Socket, next) => {
    try {
      const role = socket.handshake.auth?.role;

      if (!role || !VALID_ROLES.includes(role)) {
        return next(new Error("ROLE_REQUIRED"));
      }

      const cookies = socket.request.headers.cookie;

      if (!cookies) {
        return next(new Error("AUTH_REQUIRED"));
      }

      const parsed = cookie.parse(cookies);
      const token = parsed[`accessToken_${role}`];

      if (!token) {
        console.warn(`⚠️ No token found for cookie=accessToken_${role}`);
        return next(new Error("AUTH_REQUIRED"));
      }

      let decoded: CustomJwtPayload;
      try {
        decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!, {
          issuer: "viao-auth",
        }) as CustomJwtPayload;
      } catch (err: any) {
        if (err.name === "TokenExpiredError") {
          return next(new Error("TOKEN_EXPIRED"));
        }
        return next(new Error("INVALID_TOKEN"));
      }

      if (decoded.role !== role) {
        return next(new Error("ROLE_MISMATCH"));
      }

      if (decoded.type !== "access") {
        return next(new Error("INVALID_TOKEN_TYPE"));
      }

      socket.data.user = {
        userId: decoded.userId,
        role: decoded.role,
        sessionId: decoded.sessionId,
      };

      return next();
    } catch (error) {
      console.error("Socket Auth Error:", error);
      return next(new Error("AUTH_FAILED"));
    }
  });
};