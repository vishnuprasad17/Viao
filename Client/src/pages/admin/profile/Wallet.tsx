import { useSelector } from "react-redux";
import clsx from "clsx";
import AdminRootState from "../../../redux/rootstate/AdminState";
import {
  getPaymentDetails,
  getAdminData,
} from "../../../config/services/adminApi";
import { useEffect, useState } from "react";
import { AdminData } from "../../../interfaces/adminTypes";
import { Payment } from "../../../interfaces/commonTypes";
import Pagination from "../../../components/common/Pagination";
import { Typography } from "@material-tailwind/react";

function Wallet() {
  const admin = useSelector((state: AdminRootState) => state.admin.admindata);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [adminData, setAdminData] = useState<AdminData>();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchPayments(currentPage);
  }, [currentPage]);

  const formatDate = (createdAt: Date) => {
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchPayments = async (page: number) => {
    getPaymentDetails(page)
      .then((response) => {
        setPayments(response.data.payment);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.log("Error fetching payments:", error);
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getAdminData(admin?.id)
      .then((response) => {
        setAdminData(response.data.adminData);
      })
      .catch((error) => {
        console.log("Error fetching admin data:", error);
      });
  }, [admin?.id]);

  return (
    <div className="p-4 md:p-8">
      {/* Wallet Card */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-white">
            <div>
              <Typography
                variant="h6"
                className="font-normal opacity-80"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Available Balance
              </Typography>
              <Typography
                variant="h3"
                className="font-bold"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                ₹{adminData?.wallet?.toLocaleString()}
              </Typography>
            </div>
            <div className="bg-white/10 p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      {payments.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg dark:bg-gray-800 overflow-hidden">
          {/* Mobile View */}
          <div className="md:hidden space-y-4 p-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Typography
                      variant="h6"
                      className="text-gray-900 dark:text-white"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {payment.bookingId.eventName}
                    </Typography>
                    <Typography
                      className="text-sm text-gray-600 dark:text-gray-300"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {payment.vendorId.name}
                    </Typography>
                    <Typography
                      className="font-bold text-xs text-blue-600 dark:text-gray-300"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Paid via {payment.modeOfPayment}
                    </Typography>
                  </div>
                  <Typography
                    variant="h6"
                    className="text-green-600 dark:text-green-400"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    ₹{payment.amount.toLocaleString()}
                  </Typography>
                </div>
                {payment.bookingId.refundAmount > 0 && (
                    <Typography
                      variant="small"
                      className="text-blue-600 dark:text-blue-400"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Refunded-(₹
                      {payment.bookingId.refundAmount.toLocaleString()})
                    </Typography>
                  )}
                <Typography
                  className="text-sm text-gray-500 dark:text-gray-400"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {formatDate(payment.createdAt)}
                </Typography>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-4 px-6 text-left text-gray-600 dark:text-gray-300 font-medium">
                    Event
                  </th>
                  <th className="py-4 px-6 text-left text-gray-600 dark:text-gray-300 font-medium">
                    Vendor
                  </th>
                  <th className="py-4 px-6 text-left text-gray-600 dark:text-gray-300 font-medium">
                    Payment Mode
                  </th>
                  <th className="py-4 px-6 text-left text-gray-600 dark:text-gray-300 font-medium">
                    Date
                  </th>
                  <th className="py-4 px-6 text-left text-gray-600 dark:text-gray-300 font-medium">
                    Amount
                  </th>
                  <th className="py-4 px-6 text-left text-gray-600 dark:text-gray-300 font-medium">
                    Refund
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-900 dark:text-white">
                      {payment.bookingId.eventName}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                      {payment.vendorId.name}
                    </td>
                    <td className="py-4 px-6 font-bold text-blue-600 dark:text-blue-300">
                      {payment.modeOfPayment}
                    </td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-green-600 dark:text-green-400 font-medium">
                      + ₹{payment.amount.toLocaleString()}
                    </td>
                    <td
                      className={clsx(
                        "py-4 px-6 font-medium",
                        payment.bookingId.refundAmount > 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-600 dark:text-gray-400"
                      )}
                    >
                      {payment.bookingId.refundAmount > 0
                        ? `- ₹${payment.bookingId.refundAmount.toLocaleString()}`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {payments.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
        <div className="text-center py-12">
          <svg
            className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <Typography
            variant="h5"
            color="gray"
            className="mt-4 dark:text-gray-400"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            No payments found
          </Typography>
        </div>
      )}
    </div>
  );
}

export default Wallet;