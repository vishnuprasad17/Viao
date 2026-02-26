import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { SocketProvider } from "./SocketContext";
import UserRootState from "../redux/rootstate/UserState";
import VendorRootState from "../redux/rootstate/VendorState";
import socketManager from "../config/socket/socketConfig";

interface Props {
  children: React.ReactNode;
}

const GlobalSocketWrapper: React.FC<Props> = ({ children }) => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const vendor = useSelector((state: VendorRootState) => state.vendor.vendordata);

  const loggedInId = user?.id || vendor?.id || undefined;

  useEffect(() => {
    const handleRefresh = () => {
      console.log("🔐 Auth refreshed — reconnecting socket...");
      socketManager.reconnect();
    };

    window.addEventListener("auth:refreshed", handleRefresh);

    return () => {
      window.removeEventListener("auth:refreshed", handleRefresh);
    };
  }, []);

  return (
    <SocketProvider userId={loggedInId} role={user ? "user" : vendor ? "vendor" : undefined}>
      {children}
    </SocketProvider>
  );
};

export default GlobalSocketWrapper;