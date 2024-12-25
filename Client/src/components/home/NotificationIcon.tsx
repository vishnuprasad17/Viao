import { Badge } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { USER } from "../../config/routes/userRoutes";
import { useState } from "react";

const NotificationIcon = () => {
  const [count, setCount] = useState<number>(0);
  return (
    <Link to={`${USER.PROFILE}${USER.INBOX}`}>
  <div className="pr-1">
    {count! > 0 && (
      <Badge content={count}>
        <button
          className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-100 transition-all hover:bg-gray-100/10 active:bg-gray-100/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          data-ripple-dark="true"
          data-popover-target="notifications-menu"
        >
          <i className="text-lg leading-none fas fa-bell"></i>
        </button>
      </Badge>
    )}
    {count === 0 && (
      <button
        className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-100 transition-all hover:bg-gray-100/10 active:bg-gray-100/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        data-ripple-dark="true"
        data-popover-target="notifications-menu"
      >
        <i className="text-lg leading-none fas fa-bell"></i>
      </button>
    )}
  </div>
</Link>

  );
};

export default NotificationIcon;