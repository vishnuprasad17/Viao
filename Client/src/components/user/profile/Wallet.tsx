import { useSelector } from "react-redux";
import UserRootState from "../../../redux/rootstate/UserState";
import { useEffect, useState } from "react";
import { getTransactionDetails } from "../../../config/services/userApi";
import Pagination from "../../common/Pagination";
import { Typography } from "@material-tailwind/react";
import clsx from "clsx";
import { WalletTransaction, WalletTxType } from "../../../interfaces/commonTypes";

// Label / colour helpers
 
const TYPE_LABELS: Record<WalletTxType, string> = {
  wallet_used_for_booking:    "Booking Payment",
  stripe_payment_received:    "Stripe Payment",
  wallet_payment_received:    "Wallet Payment",
  refund_to_user:             "Refund Received",
  refund_from_cancellation:   "Cancellation Refund",
  cancellation_admin_fee:     "Admin Fee",
  vendor_compensation_held:   "Vendor Compensation",
  vendor_compensation_paid:   "Vendor Compensation Paid",
};
 
const TYPE_BADGE_CLASSES: Record<WalletTxType, string> = {
  wallet_used_for_booking:    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  stripe_payment_received:    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  wallet_payment_received:    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  refund_to_user:             "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  refund_from_cancellation:   "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  cancellation_admin_fee:     "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  vendor_compensation_held:   "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  vendor_compensation_paid:   "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};
 
const formatDate = (date: string | Date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const Wallet = () => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const [currentPage, setCurrentPage]       = useState<number>(1);
  const [totalPages, setTotalPages]         = useState<number>(1);
  const [transactions, setTransactions]     = useState<WalletTransaction[]>([]);
  const [totalBalance, setTotalBalance]     = useState(0);
 
  useEffect(() => {
    const fetchTransactions = async (page: number) => {
      try {
        const response = await getTransactionDetails(user?.id, page);
        // API returns { wallet, transaction: WalletTransaction[], totalPages }
        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages);
        setTotalBalance(response.data.wallet);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions(currentPage);
  }, [currentPage, user?.id]);
 
  return (
    <div className="p-4 md:p-8">
      {/* ── Wallet Balance Card ───────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-white">
            <div>
              <Typography variant="h6" className="font-normal opacity-80"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Available Balance
              </Typography>
              <Typography variant="h3" className="font-bold"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                ₹{totalBalance.toLocaleString("en-IN")}
              </Typography>
            </div>
            <div className="bg-yellow-500 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="white"
                viewBox="0 0 24 24" stroke="black" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
 
      {/* ── Transaction List ─────────────────────────────────────────────── */}
      {transactions?.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg dark:bg-gray-800 overflow-hidden">
 
          {/* Mobile */}
          <div className="md:hidden space-y-3 p-4">
            {transactions.map((tx) => (
              <div key={tx.id}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 pr-3">
                    <span className={clsx(
                      "inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1",
                      TYPE_BADGE_CLASSES[tx.type]
                    )}>
                      {TYPE_LABELS[tx.type]}
                    </span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {tx.eventName ?? "—"}
                    </p>
                    {tx.vendorName && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {tx.vendorName}
                      </p>
                    )}
                    {tx.modeOfPayment && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        via {tx.modeOfPayment}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className={clsx(
                      "font-bold text-base",
                      tx.direction === "credit"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    )}>
                      {tx.direction === "credit" ? "+" : "−"}₹{tx.amount.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Bal: ₹{tx.balanceAfter.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDate(tx.createdAt)}
                </p>
              </div>
            ))}
          </div>
 
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {["Type", "Event", "Vendor", "Mode", "Date", "Amount", "Balance After"].map((h) => (
                    <th key={h}
                      className="py-4 px-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {transactions.map((tx) => (
                  <tr key={tx.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-5">
                      <span className={clsx(
                        "inline-block text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap",
                        TYPE_BADGE_CLASSES[tx.type]
                      )}>
                        {TYPE_LABELS[tx.type]}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-sm text-gray-900 dark:text-white">
                      {tx.eventName ?? "—"}
                    </td>
                    <td className="py-3 px-5 text-sm text-gray-600 dark:text-gray-300">
                      {tx.vendorName ?? "—"}
                    </td>
                    <td className="py-3 px-5 text-xs font-medium text-blue-600 dark:text-blue-400">
                      {tx.modeOfPayment ?? "—"}
                    </td>
                    <td className="py-3 px-5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className={clsx(
                      "py-3 px-5 font-semibold text-sm whitespace-nowrap",
                      tx.direction === "credit"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    )}>
                      {tx.direction === "credit" ? "+" : "−"}₹{tx.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-5 text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                      ₹{tx.balanceAfter.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
 
          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={setCurrentPage}
              isTable={false}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <svg className="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <Typography variant="h5" color="gray" className="mt-4 dark:text-gray-400"
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            No wallet activity yet
          </Typography>
          <p className="text-sm text-gray-400 mt-1">
            Transactions will appear here after your first booking or refund.
          </p>
        </div>
      )}
    </div>
  );
};
 
export default Wallet;