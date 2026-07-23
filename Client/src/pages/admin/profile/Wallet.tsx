import { useSelector } from "react-redux";
import clsx from "clsx";
import AdminRootState from "../../../redux/rootstate/AdminState";
import { getAdminWalletLedger, getPaymentDetails, getAdminData } from "../../../config/services/adminApi";
import { useEffect, useState } from "react";
import { AdminData } from "../../../interfaces/adminTypes";
import Pagination from "../../../components/common/Pagination";
import { Typography } from "@material-tailwind/react";
import { Payment, WalletTransaction, WalletTxType } from "../../../interfaces/commonTypes";

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
 
const TYPE_BADGE: Record<WalletTxType, string> = {
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
 
type Tab = "ledger" | "payments";

function Wallet() {
  const admin = useSelector((state: AdminRootState) => state.admin.admindata);
  const [activeTab, setActiveTab]   = useState<Tab>("ledger");
 
  // Ledger state
  const [ledger, setLedger]             = useState<WalletTransaction[]>([]);
  const [ledgerPage, setLedgerPage]     = useState(1);
  const [ledgerPages, setLedgerPages]   = useState(1);
 
  // Payments state
  const [payments, setPayments]         = useState<Payment[]>([]);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentsPages, setPaymentsPages] = useState(1);
 
  const [adminData, setAdminData]       = useState<AdminData>();
 
  // Fetch admin wallet balance
  useEffect(() => {
    if (!admin?.id) return;
    getAdminData(admin.id)
      .then((res) => setAdminData(res.data.adminData))
      .catch(console.error);
  }, [admin?.id]);
 
  // Fetch ledger
  useEffect(() => {
    if (!admin?.id) return;
    getAdminWalletLedger(admin.id, ledgerPage)
      .then((res) => {
        setLedger(res.data.transactions);
        setLedgerPages(res.data.totalPages);
      })
      .catch(console.error);
  }, [ledgerPage, admin?.id]);
 
  // Fetch payments (existing)
  useEffect(() => {
    getPaymentDetails(paymentsPage)
      .then((res) => {
        setPayments(res.data.payment);
        setPaymentsPages(res.data.totalPages);
      })
      .catch(console.error);
  }, [paymentsPage]);
 
  const formatCurrency = (n?: number) =>
    n !== undefined ? `₹${n.toLocaleString("en-IN")}` : "—";
 
  return (
    <div className="p-4 md:p-8">
      {/* ── Balance Card ──────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-white">
            <div>
              <Typography variant="h6" className="font-normal opacity-80"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Platform Wallet Balance
              </Typography>
              <Typography variant="h3" className="font-bold"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {formatCurrency(adminData?.wallet)}
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
 
      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-6">
        {(["ledger", "payments"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
              activeTab === tab
                ? "bg-purple-600 text-white shadow"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
          >
            {tab === "ledger" ? "Wallet Ledger" : "Payment Records"}
          </button>
        ))}
      </div>
 
      {/* ── LEDGER TAB ───────────────────────────────────────────────────── */}
      {activeTab === "ledger" && (
        ledger.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg dark:bg-gray-800 overflow-hidden">
            {/* Mobile */}
            <div className="md:hidden space-y-3 p-4">
              {ledger.map((tx) => (
                <div key={tx.id}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0 pr-3">
                      <span className={clsx(
                        "inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1",
                        TYPE_BADGE[tx.type]
                      )}>
                        {TYPE_LABELS[tx.type]}
                      </span>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {tx.eventName ?? "—"}
                      </p>
                      {tx.userName && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">User: {tx.userName}</p>
                      )}
                      {tx.vendorName && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Vendor: {tx.vendorName}</p>
                      )}
                      {tx.cancellationScenario && (
                        <p className="text-xs text-orange-500 font-medium capitalize">
                          {tx.cancellationScenario.replace(/_/g, " ")}
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
                      <p className="text-xs text-gray-400 mt-0.5">
                        Bal: ₹{tx.balanceAfter.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{formatDate(tx.createdAt)}</p>
                </div>
              ))}
            </div>
 
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {["Type", "Event", "User", "Vendor", "Mode", "Date", "Amount", "Balance After"].map((h) => (
                      <th key={h}
                        className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {ledger.map((tx) => (
                    <tr key={tx.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className={clsx(
                          "inline-block text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap",
                          TYPE_BADGE[tx.type]
                        )}>
                          {TYPE_LABELS[tx.type]}
                        </span>
                        {tx.cancellationScenario && (
                          <p className="text-xs text-orange-500 mt-0.5 capitalize">
                            {tx.cancellationScenario.replace(/_/g, " ")}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {tx.eventName ?? "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                        {tx.userName ?? "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                        {tx.vendorName ?? "—"}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-blue-600 dark:text-blue-400">
                        {tx.modeOfPayment ?? "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className={clsx(
                        "py-3 px-4 font-semibold text-sm whitespace-nowrap",
                        tx.direction === "credit"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      )}>
                        {tx.direction === "credit" ? "+" : "−"}₹{tx.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        ₹{tx.balanceAfter.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
 
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <Pagination currentPage={ledgerPage} totalPages={ledgerPages}
                handlePageChange={setLedgerPage} isTable={false} />
            </div>
          </div>
        ) : (
          <EmptyState message="No ledger entries yet" />
        )
      )}
 
      {/* ── PAYMENTS TAB ─────────────────────────────────────────────────── */}
      {activeTab === "payments" && (
        payments.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg dark:bg-gray-800 overflow-hidden">
            {/* Mobile */}
            <div className="md:hidden space-y-3 p-4">
              {payments.map((payment) => (
                <div key={payment.id}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {payment.bookingId.eventName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{payment.vendorId.name}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {payment.modeOfPayment}
                      </p>
                    </div>
                    <p className="font-bold text-green-600 dark:text-green-400 text-sm">
                      +₹{payment.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  {payment.bookingId?.refundToUser > 0 && (
                    <p className="text-xs text-red-500">
                      Refunded: ₹{payment.bookingId.refundToUser.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              ))}
            </div>
 
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {["Event", "User", "Vendor", "Mode", "Date", "Amount Received", "Refund Paid"].map((h) => (
                      <th key={h}
                        className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-3 px-5 text-sm text-gray-900 dark:text-white">
                        {payment.bookingId.eventName}
                      </td>
                      <td className="py-3 px-5 text-sm text-gray-600 dark:text-gray-300">
                        {payment.userId?.name ?? "—"}
                      </td>
                      <td className="py-3 px-5 text-sm text-gray-600 dark:text-gray-300">
                        {payment.vendorId.name}
                      </td>
                      <td className="py-3 px-5 text-xs font-bold text-blue-600 dark:text-blue-300">
                        {payment.modeOfPayment}
                      </td>
                      <td className="py-3 px-5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-5 text-sm text-green-600 dark:text-green-400 font-semibold whitespace-nowrap">
                        +₹{payment.amount.toLocaleString("en-IN")}
                      </td>
                      <td className={clsx(
                        "py-3 px-5 text-sm font-medium whitespace-nowrap",
                        payment.bookingId?.refundToUser > 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-400 dark:text-gray-500"
                      )}>
                        {payment.bookingId?.refundToUser > 0
                          ? `−₹${payment.bookingId.refundToUser.toLocaleString("en-IN")}`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
 
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <Pagination currentPage={paymentsPage} totalPages={paymentsPages}
                handlePageChange={setPaymentsPage} isTable={false} />
            </div>
          </div>
        ) : (
          <EmptyState message="No payments found" />
        )
      )}
    </div>
  );
}
 
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16">
      <svg className="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600" fill="none"
        stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <Typography variant="h5" color="gray" className="mt-4 dark:text-gray-400"
        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        {message}
      </Typography>
    </div>
  );
}
 
export default Wallet;