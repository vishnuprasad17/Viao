import { useEffect, useState } from "react";
import { getBooking } from "../../../config/services/venderApi";
import { useSelector } from "react-redux";
import VendorRootState from "../../../redux/rootstate/VendorState";
import { Link } from "react-router-dom";
import Pagination from "../../common/Pagination";
import { VENDOR } from "../../../config/routes/vendor.routes";
import { Typography, Input, Select, Option, Button } from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Booking } from "../../../interfaces/commonTypes";
import clsx from "clsx";
import debounce from "lodash/debounce";

const BookingTable = () => {
  const vendorData = useSelector((state: VendorRootState) => state.vendor.vendordata);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const DEBOUNCE_DELAY = 300;
  const PAGE_SIZE = 6;

  const debouncedFetch = debounce(fetchBookings, DEBOUNCE_DELAY);

  useEffect(() => {
    debouncedFetch(currentPage, searchTerm, paymentStatus);
    return () => debouncedFetch.cancel();
  }, [currentPage, searchTerm, paymentStatus]);

  async function fetchBookings(page: number, search: string, status: string) {
    try {
      setIsLoading(true);
      setError("");
      const response = await getBooking(vendorData?.id, page,
        PAGE_SIZE,
        search,
        status,
      );
      setBookings(response.data.bookings);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to load bookings. Please try again later.");
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string | undefined) => {
    if (value) {
    setPaymentStatus(value);
    setCurrentPage(1);
    }
  };

  const statusBadgeClass = (status: string) => clsx(
    "inline-flex text-xs font-medium px-2 py-1 rounded-full",
    {
      "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400":
        status === "Completed",
      "bg-amber-100 text-amber-600 dark:bg-amber-800/30 dark:text-amber-400":
        status === "Pending",
      "bg-red-100 text-red-600 dark:bg-red-800/30 dark:text-red-400":
        status === "Failed",
    }
  );

  if (error) {
    return (
      <div className="text-center py-8">
        <Typography variant="h5" color="red" className="mb-4"placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}>
          {error}
        </Typography>
        <Button 
          color="blue"
          onClick={() => fetchBookings(1, "", "all")}
          placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="flex-1 relative">
          <Input
            label="Search bookings..."
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={searchTerm}
            onChange={handleSearchChange}
            crossOrigin={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select
            label="Payment Status"
            value={paymentStatus}
            onChange={handleStatusChange}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Option value="all">All Statuses</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Failed">Failed</Option>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <Typography variant="h5" color="blue-gray"placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}>
            <svg className="animate-spin h-8 w-8 mx-auto text-blue-500" 
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading bookings...
          </Typography>
        </div>
      )}

      {/* Content Section */}
      {!isLoading && (bookings.length > 0 ? (
        <div className="w-full">
          {/* Mobile View */}
          <div className="grid gap-4 md:hidden">
            {bookings.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 dark:bg-boxdark transition-shadow hover:shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Typography variant="h6" className="text-gray-800 dark:text-gray-100"placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}>
                      {item.eventName}
                    </Typography>
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400"placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}>
                      {item.name}
                    </Typography>
                  </div>
                  <span className={statusBadgeClass(item.payment_status)}>
                    {item.payment_status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Place:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      ₹{item.amount?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className={clsx(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    {
                      "bg-green-100 text-green-800": item.status === "Accepted",
                      "bg-red-100 text-red-800": ["Rejected", "Cancelled"].includes(item.status),
                      "bg-blue-100 text-blue-800": item.status === "Pending"
                    }
                  )}>
                    {item.status}
                  </span>
                  <ViewButton bookingId={item.id} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block rounded-xl border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-500 text-white">
                <tr>
                  {["Event", "Client", "Place", "Date", "Amount", "Status", "Payment", "Actions"].map((header) => (
                    <th key={header} className="py-4 px-6 text-left font-semibold text-sm">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((item) => (
                  <tr key={item.id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-boxdark/80">
                    <td className="py-4 px-6">{item.eventName}</td>
                    <td className="py-4 px-6">{item.name}</td>
                    <td className="py-4 px-6">{item.city}</td>
                    <td className="py-4 px-6">{item.date}</td>
                    <td className="py-4 px-6">₹{item.amount?.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={clsx(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        {
                          "bg-green-100 text-green-800": item.status === "Accepted",
                          "bg-red-100 text-red-800": ["Rejected", "Cancelled"].includes(item.status),
                          "bg-blue-100 text-blue-800": item.status === "Pending"
                        }
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={statusBadgeClass(item.payment_status)}>
                        {item.payment_status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <ViewButton bookingId={item.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={setCurrentPage}
                isTable={true}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Typography variant="h5" color="blue-gray" className="mb-2"placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}>
            No bookings found
          </Typography>
          <Typography color="gray" className="dark:text-gray-400"placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}>
            {searchTerm ? "Try adjusting your search filters" : "You have no bookings yet"}
          </Typography>
        </div>
      ))}
    </div>
  );
};

const ViewButton = ({ bookingId }: { bookingId: string }) => (
  <Link
    to={`${VENDOR.VIEW_BOOKING}?id=${bookingId}`}
    className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
  >
    View
    <svg
      className="w-4 h-4 ml-2"
      viewBox="0 0 18 18"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z" />
      <path d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z" />
    </svg>
  </Link>
);

export default BookingTable;