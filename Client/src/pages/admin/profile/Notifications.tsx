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
    getNotification("admin", admin?._id, page, {
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
        { id, recipient: admin?._id },
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
    deleteNotification("admin", id, admin?._id, {
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
    <div>
      {notifications?.length > 0 ? (
        <div className="col-span-6 xl:col-span-4 mx-10 lg:mx-20">
          <Typography
            variant="h4"
            color="black"
            className="mt-4 mb-3"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Notifications
          </Typography>
          {notifications?.map((data, key) => (
            <div
              className="block rounded-sm border border-warning border-stroke bg-white mb-4 shadow-default dark:border-strokedark dark:bg-boxdark hover:shadow-lg"
              key={key}
            >
              <div
                className={`${!data.read ? "bg-blue-gray-100 p-4  bg-opacity-30" : "bg-gray-100 p-4  bg-opacity-30"}`}
              >
                <div className="flex items-center gap-5">
                  <div className="relative flex flex-1 items-center justify-between">
                    <div>
                      {!data.read ? (
                        <h5 className="font-semibold text-purple-700 dark:text-white">
                        {data?.message}
                      </h5>
                      ) : (
                        <h5 className="font-medium text-gray-600 dark:text-white">
                        {data?.message}
                      </h5>
                      )}
                      {!data.read ? (
                        <p>
                        <span className="font-semibold text-xs">
                          {" "}
                          {format(data.createdAt)}
                        </span>
                      </p>
                      ) : (
                        <p>
                        <span className="text-gray-600 text-xs">
                          {" "}
                          {format(data.createdAt)}
                        </span>
                      </p>
                      )}
                      {!data?.read ? (
                        <button
                          className="absolute top-6 right-1 bg-blue-900 text-white text-xs px-2 py-1 rounded-full"
                          onClick={(e) => handleRead(e, data?._id)}
                        >
                          Mark as read
                        </button>
                      ) : (
                        <button
                          className="absolute top-6 right-1 bg-gray-500 text-white text-xs px-2 py-1 rounded-full"
                          onClick={(e) => handleRead(e, data?._id)}
                        >
                          Mark as unread
                        </button>
                      )}
                      <button
                        className="absolute -top-2 right-0"
                        onClick={(e) => handleDelete(e, data?._id)}
                      >
                        <i className="fa-solid fa-x text-xs"></i>
                      </button>
                      <Link
                        to={`${data.type == "NEW_USER" ? ADMIN.USERS : data.type == "NEW_VENDOR" ? ADMIN.VENDORS : data.type == "VERIFY"? ADMIN.VENDORS : ADMIN.WALLET}`}
                      >
                       <button className={`absolute top-6  text-xs text-blue-gray-700 px-2 py-1 rounded-full ${!data?.read? 'right-24':'right-28'}`}>
                            View
                          </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
           {notifications.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          isTable={false}
        />
      )}
        </div>
      ) : (
        <Typography
          variant="h6"
          color="gray"
          className="text-center mt-4"
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