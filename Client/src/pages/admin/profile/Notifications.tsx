import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "timeago.js";
import AdminRootState from "../../../redux/rootstate/AdminState";
import { getNotification, toggleRead, deleteNotification } from "../../../config/services/notificationApi";
import { Notification } from "../../../interfaces/commonTypes";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { ADMIN } from "../../../config/routes/admin.routes";
import Pagination from "../../../components/common/Pagination";

const Notifications = () => {
  const [notifications, setNotification] = useState<Notification[]>([]);
  const admin = useSelector((state: AdminRootState) => state.admin.admindata);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchNotification(currentPage);
  }, [currentPage]);


  const fetchNotification = async (page: number) => {
    getNotification("admin", admin?.id, page, {
        withCredentials: true,
      })
      .then((response) => {
        setNotification(response.data.notification);
        console.log(response.data.notification);
        const totalPagesFromResponse = response.data.totalPages;
        setTotalPages(totalPagesFromResponse);
      })
      .catch((error) => {
        console.log("here", error);
      });
  }

  const handleRead = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();
    toggleRead("admin",
        { id, recipient: admin?.id },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        fetchNotification(currentPage)
        toast.success("Status changed Successfully!");
        console.log(response.data.notification);
      })
      .catch((error) => {
        console.log("here", error);
      });
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();
    deleteNotification("admin", id, admin?.id, {
        withCredentials: true,
      })
      .then((response) => {
        fetchNotification(currentPage)
        toast.success("Deleted Successfully!");
        console.log(response.data.notification);
      })
      .catch((error) => {
        console.log("here", error);
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 md:p-8">
      {notifications?.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((data, key) => (
            <div
              key={key}
              className={`rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                !data.read
                  ? "bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold ${
                        !data.read
                          ? "text-purple-800 dark:text-purple-300"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {data.message}
                    </h3>
                    <p
                      className={`text-sm ${
                        !data.read
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {format(data.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleRead(e, data.id)}
                      className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                        !data.read
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                      }`}
                    >
                      {!data.read ? "Mark as Read" : "Mark as Unread"}
                    </button>
                    <Link
                      to={`${
                        data.type == "NEW_USER" ? ADMIN.USERS : data.type == "NEW_VENDOR" ? ADMIN.VENDORS : data.type == "VERIFY"? ADMIN.VENDORS : ADMIN.WALLET
                      }`}
                    >
                      <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        View
                      </button>
                    </Link>
                    <button
                      onClick={(e) => handleDelete(e, data.id)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {notifications.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                isTable={false}
              />
            </div>
          )}
        </div>
      ) : (
        <Typography
          variant="h6"
          color="gray"
          className="text-center mt-8"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          No notifications yet
        </Typography>
      )}
    </div>
  );
};

export default Notifications;