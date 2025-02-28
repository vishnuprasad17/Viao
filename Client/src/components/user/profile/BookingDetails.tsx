import { useEffect, useState } from "react";
import { getBooking } from "../../../config/services/userApi";
import { useSelector } from "react-redux";
import UserRootState from "../../../redux/rootstate/UserState";
import { Link } from "react-router-dom";
import Pagination from "../../common/Pagination";
import { USER } from "../../../config/routes/user.routes";
import { Booking } from "../../../interfaces/commonTypes";
import { Typography } from "@material-tailwind/react";

const BookingDetails = () => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const fetchBookings = async (page: number) => {
    try {
      const response = await getBooking(user?.id, page, {
        withCredentials: true,
      });
      setBookings(response.data.bookings);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {bookings?.length > 0 ? (
        <div className="w-full">
          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {bookings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-6 dark:bg-boxdark transition-all duration-200 hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {item.eventName}
                    </h3>
                    <Typography
                      className="text-sm text-purple-600 dark:text-purple-300 mt-1"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      <Link to={`${USER.VIEW_VENDOR}?id=${item?.vendorId.id}`}>
                        {item?.vendorId.name}
                      </Link>
                    </Typography>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        item.status === "Accepted"
                          ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                          : item.status === "Rejected" ||
                              item.status === "Cancelled"
                            ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        item.payment_status === "Completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                          : item.payment_status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
                      }`}
                    >
                      {item.payment_status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Date:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {item.date}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Place:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {item.city}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    to={`${USER.PROFILE}${USER.BOOKING}?id=${item.id}`}
                    className="flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    <span className="text-sm mr-2">View Details</span>
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 18 18"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z" />
                      <path d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block rounded-xl border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
                  <th className="py-5 px-6 text-left font-semibold text-sm first:rounded-tl-xl">
                    Vendor
                  </th>
                  <th className="py-5 px-6 text-left font-semibold text-sm">
                    Event
                  </th>
                  <th className="py-5 px-6 text-left font-semibold text-sm">
                    Date
                  </th>
                  <th className="py-5 px-6 text-left font-semibold text-sm">
                    Place
                  </th>
                  <th className="py-5 px-6 text-left font-semibold text-sm">
                    Status
                  </th>
                  <th className="py-5 px-6 text-left font-semibold text-sm">
                    Payment
                  </th>
                  <th className="py-5 px-6 text-left font-semibold text-sm last:rounded-tr-xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-boxdark/80 transition-colors"
                  >
                    <td className="py-5 px-6">
                      <Typography
                        className="font-medium text-purple-600 dark:text-purple-300"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        <Link
                          to={`${USER.VIEW_VENDOR}?id=${item?.vendorId.id}`}
                        >
                          {item?.vendorId.name}
                        </Link>
                      </Typography>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.eventName}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.date}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.city}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span
                        className={`inline-flex text-sm font-medium px-3 py-1 rounded-full ${
                          item.status === "Accepted"
                            ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                            : item.status === "Rejected" ||
                                item.status === "Cancelled"
                              ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span
                        className={`inline-flex text-sm font-medium px-3 py-1 rounded-full ${
                          item.payment_status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                            : item.payment_status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400"
                              : "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
                        }`}
                      >
                        {item.payment_status}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <Link
                        to={`${USER.PROFILE}${USER.BOOKING}?id=${item.id}`}
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          viewBox="0 0 18 18"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z" />
                          <path d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z" />
                        </svg>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bookings.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                isTable={true}
              />
            </div>
          )}
        </div>
      ) : (
        <Typography
          variant="h5"
          color="red"
          className="text-center mt-4"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          No bookings yet!
        </Typography>
      )}
    </>
  );
};

export default BookingDetails;