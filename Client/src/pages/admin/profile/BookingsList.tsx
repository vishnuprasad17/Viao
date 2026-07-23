import { useEffect, useState } from "react";
import { getBooking, payVendorCommission, getVerifiedVendors } from "../../../config/services/adminApi";
import Pagination from "../../../components/common/Pagination";
import { Typography, Input, Select, Option, Button } from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Booking } from "../../../interfaces/commonTypes";
import clsx from "clsx";
import debounce from "lodash/debounce";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const BookingsList = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // New vendor/year/month filter
  const [verifiedVendors, setVerifiedVendors] = useState<{ id: string; name: string }[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Track which booking is mid-payout to disable its button
  const [payingId, setPayingId] = useState<string | null>(null);

  const DEBOUNCE_DELAY = 300;
  const PAGE_SIZE = 6;

  const debouncedFetch = debounce(fetchBookings, DEBOUNCE_DELAY);

  useEffect(() => {
    getVerifiedVendors()
      .then((res) => setVerifiedVendors(res.data.vendors))
      .catch((err) => console.error("Failed to load verified vendors:", err));
  }, []);

  useEffect(() => {
    debouncedFetch(
      currentPage,
      searchTerm,
      paymentStatus,
      selectedVendorId,
      selectedYear,
      selectedMonth
    );
    return () => debouncedFetch.cancel();
  }, [currentPage, searchTerm, paymentStatus, selectedVendorId, selectedYear, selectedMonth]);

  async function fetchBookings(
    page: number,
    search: string,
    status: string,
    vendorId: string,
    year: string,
    month: string
  ) {
    try {
      setIsLoading(true);
      setError("");
      const response = await getBooking(
        page,
        PAGE_SIZE,
        search,
        status,
        vendorId || undefined,
        year ? Number(year) : undefined,
        month ? Number(month) : undefined
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

  const handleVendorChange = (value: string | undefined) => {
    setSelectedVendorId(value || "");
    setSelectedYear(""); // reset year when vendor changes
    setSelectedMonth(""); // reset month when vendor changes
    setCurrentPage(1);
  };

  const handleYearChange = (value: string | undefined) => {
    setSelectedYear(value || "");
    setSelectedMonth(""); // reset month when year changes
    setCurrentPage(1);
  };

  const handleMonthChange = (value: string | undefined) => {
    setSelectedMonth(value || "");
    setCurrentPage(1);
  };

  const handlePayCommission = async (bookingId: string) => {
    try {
      setPayingId(bookingId);
      await payVendorCommission(bookingId);
      // Refresh current page so the paid state reflects immediately
      await fetchBookings(currentPage, searchTerm, paymentStatus, selectedVendorId, selectedYear, selectedMonth);
    } catch (err) {
      console.error("Failed to pay vendor commission:", err);
      setError("Failed to process payout. Please try again.");
    } finally {
      setPayingId(null);
    }
  };

  const statusBadgeClass = (status: string) => clsx(
    "inline-flex text-xs font-medium px-2 py-1 rounded-full",
    {
      "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400": status === "Completed",
      "bg-amber-100 text-amber-600 dark:bg-amber-800/30 dark:text-amber-400": status === "Pending",
      "bg-red-100 text-red-600 dark:bg-red-800/30 dark:text-red-400": status === "Failed",
    }
  );

  if (error) {
    return (
      <div className="text-center py-8">
        <Typography variant="h5" color="red" className="mb-4" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {error}
        </Typography>
        <Button color="blue" onClick={() => fetchBookings(1, "", "all", "", "", "")} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-stretch">
  <div className="lg:col-span-2">
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

  <Select
  key={`payment-status-${paymentStatus}`}
  label="Payment Status"
  value={paymentStatus}
  onChange={handleStatusChange}
  selected={() =>
    paymentStatus === "all" ? "All Statuses" : paymentStatus
  }
  placeholder={undefined}
  onPointerEnterCapture={undefined}
  onPointerLeaveCapture={undefined}
>
  <Option value="all">All Statuses</Option>
  <Option value="Completed">Completed</Option>
  <Option value="Pending">Pending</Option>
  <Option value="Failed">Failed</Option>
</Select>

<Select
  key={`vendor-${selectedVendorId}`}
  label="Vendor"
  value={selectedVendorId}
  onChange={handleVendorChange}
  selected={() =>
    selectedVendorId
      ? verifiedVendors.find((v) => v.id === selectedVendorId)?.name ?? "Vendor"
      : "All Vendors"
  }
  placeholder={undefined}
  onPointerEnterCapture={undefined}
  onPointerLeaveCapture={undefined}
>
  <Option value="">All Vendors</Option>
  {verifiedVendors.map((v) => (
    <Option key={v.id} value={v.id}>{v.name}</Option>
  ))}
</Select>

<Select
  key={`year-${selectedYear}`}
  label="Year"
  value={selectedYear}
  onChange={handleYearChange}
  disabled={!selectedVendorId}
  selected={() => (selectedYear ? selectedYear : "All Years")}
  placeholder={undefined}
  onPointerEnterCapture={undefined}
  onPointerLeaveCapture={undefined}
>
  <Option value="">All Years</Option>
  {YEAR_OPTIONS.map((y) => (
    <Option key={y} value={String(y)}>{y}</Option>
  ))}
</Select>

<Select
  key={`month-${selectedMonth}`}
  label="Month"
  value={selectedMonth}
  onChange={handleMonthChange}
  disabled={!selectedYear}
  selected={() =>
    selectedMonth ? MONTHS[Number(selectedMonth) - 1] : "All Months"
  }
  placeholder={undefined}
  onPointerEnterCapture={undefined}
  onPointerLeaveCapture={undefined}
>
  <Option value="">All Months</Option>
  {MONTHS.map((m, idx) => (
    <Option key={m} value={String(idx + 1)}>{m}</Option>
  ))}
</Select>
</div>

      {isLoading && (
        <div className="text-center py-8">
          <Typography variant="h5" color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Loading bookings...
          </Typography>
        </div>
      )}

      {!isLoading && (bookings.length > 0 ? (
        <div className="w-full">
          {/* Desktop View */}
          <div className="hidden md:block rounded-xl border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <tr>
                  {["Event", "Client Name", "User Name", "Place", "Date", "Amount", "Status", "Payment", "Vendor Commission", "Payout"].map((header) => (
                    <th key={header} className="py-4 px-6 text-left font-semibold text-sm whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((item: any) => (
                  <tr key={item.id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-boxdark/80">
                    <td className="py-4 px-6">{item.eventName}</td>
                    <td className="py-4 px-6">{item.name}</td>
                    <td className="py-4 px-6">{typeof item.userId === "object" ? item.userId?.name : "-"}</td>
                    <td className="py-4 px-6">{item.city}</td>
                    <td className="py-4 px-6">{item.date}</td>
                    <td className="py-4 px-6">₹{item.totalServicePrice?.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={clsx(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        {
                          "bg-green-100 text-green-800": item.status === "completed",
                          "bg-red-100 text-red-800": ["failed", "cancelled"].includes(item.status),
                          "bg-blue-100 text-blue-800": ["confirmed", "payment_pending"].includes(item.status),
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
                      {item.vendorCommission > 0 ? `₹${item.vendorCommission.toLocaleString()}` : "-"}
                    </td>
                    <td className="py-4 px-6">
                      {!item.commissionPayable ? (
                        <span className="text-xs text-gray-400">Not applicable</span>
                      ) : item.commissionPaid ? (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                          Payout Done
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          color="blue"
                          disabled={payingId === item.id}
                          onClick={() => handlePayCommission(item.id)}
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {payingId === item.id ? "Processing..." : "Pay Commission"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
          <Typography variant="h5" color="blue-gray" className="mb-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            No bookings found
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default BookingsList;