import { Server, Socket } from "socket.io";

// User type definition
interface User {
  userId: string;
  sockets: string[]; // Array of socket IDs
  lastSeen: number;
  active: boolean;
}

const initializeSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5000", "http://localhost:3000"],
    },
  });

  let users: User[] = [];

  // Add a user or update their status to active
  const addUser = (userId: string, socketId: string): void => {
    const user = users.find((u) => u.userId === userId);
    if (user) {
      // Add the socket ID if it doesn't already exist
      if (!user.sockets.includes(socketId)) {
        user.sockets.push(socketId);
      }
      user.active = true;
      user.lastSeen = Date.now();
    } else {
      // Add new user entry
      users.push({ userId, sockets: [socketId], lastSeen: Date.now(), active: true });
    }
    io.emit("activeStatus", users);
  };

  // Remove a socket ID from the user's sockets array
  const removeSocket = (socketId: string): void => {
    users.forEach((user) => {
      user.sockets = user.sockets.filter((id) => id !== socketId);
      if (user.sockets.length === 0) {
        // Mark the user as inactive if no sockets remain
        user.active = false;
        user.lastSeen = Date.now();
      }
    });
    io.emit("activeStatus", users);
  };

  const getUser = (userId: string): User | undefined => {
    return users.find((user) => user.userId === userId);
  };

  io.on("connection", (socket: Socket) => {
    console.log("server started");

    // Handle adding a new user
    socket.on("adduser", (userId: string) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    // Handle sending a message
    socket.on(
      "sendMessage",
      (message: {
        senderId: string;
        receiverId: string;
        text: string;
        imageName: string;
        imageUrl: string;
      }) => {
        const user = getUser(message.receiverId);
        if (user && user.active) {
          user.sockets.forEach((socketId) => {
            io.to(socketId).emit("getMessage", {
              senderId: message.senderId,
              text: message.text,
              imageName: message.imageName,
              imageUrl: message.imageUrl,
            });
          });
          console.log(message.receiverId, message.text);
        } else {
          console.error("User not found or inactive:", message.receiverId);
        }
      }
    );

    // Handle request for active users
    socket.on("getActiveUsers", () => {
      socket.emit("activeUsersList", users.filter((user) => user.active));
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      removeSocket(socket.id);
      io.emit("getUsers", users);
    });
  });
};

export default initializeSocket;