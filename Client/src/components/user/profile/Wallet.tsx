import { useSelector } from "react-redux";
import UserRootState from "../../../redux/rootstate/UserState";
import { useEffect, useState } from "react";
import { getTransactionDetails } from "../../../config/services/userApi";
import Pagination from "../../common/Pagination";
import { Booking } from "../../../interfaces/commonTypes";
import { Typography } from "@material-tailwind/react";
import clsx from "clsx";

const Wallet = () => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [transactions, setTransactions] = useState<Booking[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const fetchTransactions = async (page: number) => {
      try {
        const response = await getTransactionDetails(user?.id, page);
        setTransactions(response.data.transaction);
        setTotalPages(response.data.totalPages);
        setTotalBalance(response.data.wallet);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions(currentPage);
  }, [currentPage, user?.id]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
                ₹{totalBalance.toLocaleString()}
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

      {/* Transactions */}
      {transactions.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg dark:bg-gray-800 overflow-hidden">
          {/* Mobile View */}
          <div className="md:hidden space-y-4 p-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
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
                      {transaction.eventName}
                    </Typography>
                    <Typography
                      className="text-sm text-gray-600 dark:text-gray-300"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {transaction.vendorId?.name}
                    </Typography>
                  </div>
                  <Typography
                    variant="h6"
                    className="text-purple-600 dark:text-purple-400"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    ₹{transaction.refundAmount?.toLocaleString()}
                  </Typography>
                </div>
                <Typography
                  className="text-sm text-gray-500 dark:text-gray-400"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {transaction.date}
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
                    Date
                  </th>
                  <th className="py-4 px-6 text-left text-gray-600 dark:text-gray-300 font-medium">
                    Amount Deducted
                  </th>
                  <th className="py-4 px-6 text-left text-gray-600 dark:text-gray-300 font-medium">
                    Refund Credited
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-900 dark:text-white">
                      {transaction.eventName}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                      {transaction.vendorId?.name}
                    </td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                      {transaction.date}
                    </td>
                    <td
                      className={clsx("py-4 px-6 font-medium", {
                        "text-red-600 dark:text-red-400":
                          transaction.deductedFromWallet > 0,
                        "text-gray-500 dark:text-gray-400":
                          transaction.deductedFromWallet <= 0,
                      })}
                    >
                      {transaction.deductedFromWallet > 0
                        ? `- ₹${transaction.deductedFromWallet?.toLocaleString()}`
                        : `N/A`}
                    </td>
                    <td
                      className={clsx("py-4 px-6 font-medium", {
                        "text-green-600 dark:text-green-400":
                          transaction.refundAmount > 0,
                        "text-gray-500 dark:text-gray-400":
                          transaction.deductedFromWallet <= 0,
                      })}
                    >
                      {transaction.refundAmount > 0
                        ? `+ ₹${transaction.refundAmount?.toLocaleString()}`
                        : `N/A`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {transactions.length > 0 && (
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
            No transactions found
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Wallet;