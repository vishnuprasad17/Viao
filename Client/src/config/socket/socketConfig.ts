import { io, Socket } from "socket.io-client";
import config from "../envConfig";

type AuthRole = "admin" | "user" | "vendor";

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private connectionListeners: Set<(connected: boolean) => void> = new Set();
  private currentUserId: string | null = null;
  private currentRole: AuthRole | null = null;
  private windowListenersAttached: boolean = false;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(userId: string, role: AuthRole): Socket {
    if (this.socket && this.currentUserId !== userId) {
      console.log("🔄 User changed. Destroying old socket...");
      this.destroySocket();
    }

    this.currentUserId = userId;
    this.currentRole = role;

    if (this.socket) {
      console.log("♻️ Reusing existing socket");
      return this.socket;
    }

    console.log(`🔌 Creating new socket | userId=${userId} | role=${role}`);

    this.socket = io(config.SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ["websocket"],
      withCredentials: true,
      auth: { role },
    });

    this.setupListeners();
    this.setupWindowListeners();
    this.socket.connect();

    return this.socket;
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
      this.notifyConnectionListeners(true);
    });

    this.socket.on("connected", (data) => {
      console.log("✅ Server acknowledged connection:", data);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      this.notifyConnectionListeners(false);

      if (reason === "io server disconnect") {
        console.warn("🚫 Server forcibly disconnected — waiting for token refresh");
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error.message);
      this.notifyConnectionListeners(false);

      if (
        error.message === "AUTH_REQUIRED" ||
        error.message === "TOKEN_EXPIRED" ||
        error.message === "INVALID_TOKEN"
      ) {
        console.warn("🔐 Auth error on socket — pausing reconnection");
        this.socket?.io.reconnection(false);
      }
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
      this.notifyConnectionListeners(true);
    });

    this.socket.on("reconnect_attempt", () => {
      if (this.socket && this.currentRole) {
        (this.socket.auth as any).role = this.currentRole;
      }
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("❌ Reconnection error:", error.message);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("❌ Reconnection failed after max attempts");
      this.notifyConnectionListeners(false);
    });

    this.socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });
  }

  private setupWindowListeners(): void {
    if (this.windowListenersAttached) return;
    this.windowListenersAttached = true;

    window.addEventListener("auth:refreshed", (e: Event) => {
      const { role } = (e as CustomEvent).detail;
      if (this.currentRole !== role) return;

      console.log("🔄 Token refreshed — reconnecting socket...");
      this.socket?.io.reconnection(true);

      if (!this.socket?.connected) {
        this.socket?.connect();
      }
    });

    window.addEventListener("auth:logout", (e: Event) => {
      const { role } = (e as CustomEvent).detail;
      if (this.currentRole !== role) return;

      console.log("🔌 Logged out — disconnecting socket...");
      this.disconnect();
    });
  }

  private destroySocket(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  reconnect(): void {
    if (this.currentUserId && this.currentRole) {
      console.log("🔄 Manual reconnection triggered");
      this.destroySocket();
      this.connect(this.currentUserId, this.currentRole);
    }
  }

  disconnect(): void {
    this.destroySocket();
    this.currentUserId = null;
    this.currentRole = null;
  }

  emit(event: string, data: any, callback?: (response: any) => void): void {
    if (this.socket?.connected) {
      if (callback) {
        this.socket.emit(event, data, callback);
      } else {
        this.socket.emit(event, data);
      }
    } else {
      console.warn("⚠️ Socket not connected. Event not emitted:", event);
    }
  }

  on(event: string, callback: Function): void {
    if (!this.socket) return;
    this.socket.on(event, callback as any);
  }

  off(event: string, callback?: Function): void {
    if (!this.socket) return;
    if (callback) {
      this.socket.off(event, callback as any);
    } else {
      this.socket.off(event);
    }
  }

  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.add(callback);
    callback(this.socket?.connected || false);
    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((cb) => cb(connected));
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

const socketManager = SocketManager.getInstance();
export default socketManager;

export const isSocketConnected = (): boolean => socketManager.isConnected();
export const reconnectSocket = () => socketManager.reconnect();