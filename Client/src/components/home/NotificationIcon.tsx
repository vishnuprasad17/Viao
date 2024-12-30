import { Badge } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { USER } from "../../config/routes/user.routes";
import { useEffect, useState } from "react";
import { notificationCount } from "../../config/services/userApi";

const NotificationIcon = () => {
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    notificationCount()
    .then((res) => {
        setCount(res.data.count)
    })
    .catch((error)=>{
        console.error(error.message)
    });
  });
  return (
    <Link to={`${USER.PROFILE}${USER.NOTIFICATION}`}>
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