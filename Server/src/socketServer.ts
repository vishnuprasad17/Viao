import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "./utils/socketAuthHelper";

// Track online users: userId -> Set of socketIds
const onlineUsers = new Map<string, Set<string>>();

const broadcastActiveStatus = (io: Server) => {
  const activeList = Array.from(onlineUsers.entries()).map(([userId, sockets]) => ({
    userId,
    active: sockets.size > 0,
  }));
  io.emit("activeStatus", activeList);
};

const initializeSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5000",
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ["polling", "websocket"],
  });

  // ================= AUTH MIDDLEWARE =================
  socketAuthMiddleware(io);

  // ================= CONNECTION =================
  io.on("connection", (socket: Socket) => {
    const { userId, role } = socket.data.user;

    if (!userId) {
      socket.disconnect(true);
      return;
    }

    console.log(`✅ Connected: ${socket.id} | User: ${userId} | Role: ${role}`);

    // Join personal room
    socket.join(`user:${userId}`);
    socket.join(`role:${role}`);

    // Track online status
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId)!.add(socket.id);

    // Broadcast updated active status to everyone
    broadcastActiveStatus(io);

    // Acknowledge connection to client
    socket.emit("connected", { userId, role });

    // ================= SEND MESSAGE =================
    socket.on("sendMessage", async (data, callback) => {
      try {
        const { tempId, senderId, receiverId, text, imageUrl, conversationId } = data;

        if (!senderId || !receiverId) {
          if (callback) callback({ success: false, error: "Missing senderId or receiverId" });
          return;
        }

        const message = {
          id: tempId || `temp_${Date.now()}`,
          conversationId,
          senderId,
          text: text || "",
          imageUrl: imageUrl || "",
          createdAt: new Date(),
          isRead: false,
          isDeleted: false,
          deletedIds: [],
        };

        // Send to receiver's room (all their devices)
        io.to(`user:${receiverId}`).emit("getMessage", message);

        // Send to sender's OTHER devices (not this socket)
        socket.to(`user:${senderId}`).emit("getMessage", message);

        if (callback) {
          callback({ success: true, message });
        }
      } catch (error) {
        console.error("sendMessage error:", error);
        if (callback) {
          callback({ success: false, error: "Failed to send message" });
        }
      }
    });

    // ================= TYPING =================
    socket.on("typing", ({ senderId, receiverId, chatId, isTyping }) => {
      // Emit to receiver's room
      io.to(`user:${receiverId}`).emit("typing", {
        userId: senderId,
        chatId,
        isTyping,
      });
    });

    // ================= READ RECEIPT =================
    socket.on("messageRead", ({ messageId, senderId, userId: readerId }) => {
      // Notify the original sender that their message was read
      io.to(`user:${senderId}`).emit("messageRead", {
        messageId,
        userId: readerId,
      });
    });

    // ================= GET ACTIVE USERS =================
    socket.on("getActiveUsers", () => {
      const activeList = Array.from(onlineUsers.entries()).map(([uid, sockets]) => ({
        userId: uid,
        active: sockets.size > 0,
      }));
      socket.emit("activeStatus", activeList);
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", (reason) => {
      console.log(`❌ Disconnected: ${socket.id} | User: ${userId} | Reason: ${reason}`);

      // Remove this socket from online tracking
      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }

      // Broadcast updated status
      broadcastActiveStatus(io);
    });
  });

  console.log("✅ Socket.IO server initialized");
};

export default initializeSocket;