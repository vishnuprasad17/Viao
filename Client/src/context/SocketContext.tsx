import React, { createContext, useContext, useEffect, useState } from "react";
import socketManager from "../config/socket/socketConfig";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useGlobalSocket = () => useContext(SocketContext);

type AuthRole = "admin" | "user" | "vendor";

interface Props {
  userId?: string;
  role?: AuthRole;
  children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ userId, role, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId || !role) {
      socketManager.disconnect();
      setSocket(null);
      setIsConnected(false);
      return;
    }

    // Connect (or reuse existing connection)
    const socketInstance = socketManager.connect(userId, role);
    setSocket(socketInstance);

    // Subscribe to connection state changes
    const unsubscribe = socketManager.onConnectionChange((connected) => {
      setIsConnected(connected);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};