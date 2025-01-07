import { Button, Typography } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import { USER } from "../../../config/routes/user.routes";

const MessageSkeleton = () => {
  const path = useLocation();

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 ${
        path.pathname === USER.CHAT ? "pt-16 md:pt-20" : "pt-12 md:pt-16"
      }`}
    >
      {/* Left Section - Illustration */}
      <div className="flex justify-center items-center w-full md:w-1/2 px-4">
        <img
          src="/imgs/chat-default.svg"
          alt="Default Chat Illustration"
          className="w-60 h-auto md:w-80 lg:w-96 drop-shadow-lg"
        />
      </div>

      {/* Right Section - Text & Button */}
      <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-6 w-full md:w-1/2 px-6">
        <Typography
          className="text-gray-700 font-semibold text-xl md:text-2xl lg:text-3xl"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {path.pathname === USER.CHAT
            ? "Connect with vendors and start chatting effortlessly!"
            : "You don't have any conversations yet!"}
        </Typography>
        {path.pathname === USER.CHAT && (
          <Link to={USER.VENDORS} className="mt-4">
            <Button
              color="light-blue"
              size="lg"
              className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 ease-in-out animate-pulse"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Explore Vendors
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MessageSkeleton;