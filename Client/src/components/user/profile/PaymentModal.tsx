import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Button, Typography,
} from "@material-tailwind/react";
import { CreditCardIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserRootState from "../../../redux/rootstate/UserState";
import { loadWallet, makePayment } from "../../../config/services/userApi";
import { USER } from "../../../config/routes/user.routes";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  vendorId: string;
  vendorName: string;
  vendorLogoUrl?: string;
  advanceAmount: number;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  bookingId,
  vendorId,
  vendorName,
  vendorLogoUrl = "",
  advanceAmount,
  onSuccess,
}) => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  // Fetch live wallet balance every time modal opens
  useEffect(() => {
    if (!open || !user?.id) return;
    loadWallet(user.id)
      .then((res) => setWalletBalance(res.data.walletBalance ?? 0))
      .catch(console.error);
  }, [open, user?.id]);

  // Reset toggle when modal closes
  useEffect(() => {
    if (!open) setUseWallet(false);
  }, [open]);

  const maxDeductible = Math.min(walletBalance, advanceAmount);
  const remainingAfterWallet = useWallet
    ? Math.max(advanceAmount - maxDeductible, 0)
    : advanceAmount;
  const isFullyFromWallet = useWallet && remainingAfterWallet === 0 && maxDeductible > 0;

  const handlePay = async () => {
    if (!user) return;
    try {
      setIsProcessing(true);
      const response = await makePayment(
        user.id,
        vendorId,
        bookingId,
        vendorName,
        vendorLogoUrl,
        useWallet
      );

      if (response.data.status === "completed") {
        // Wallet covered full amount — booking confirmed, no Stripe redirect
        toast.success("Payment completed using wallet balance!");
        onClose();
        onSuccess();

        navigate(`${USER.BOOKING_DETAILS}`)
      } else if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      className="rounded-xl"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <DialogHeader
        className="border-b border-blue-gray-100"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="flex items-center gap-2">
          <CreditCardIcon className="h-6 w-6 text-blue-500" />
          Complete Payment
        </div>
      </DialogHeader>

      <DialogBody
        className="py-6 space-y-5"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {/* Amount summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <Typography variant="small" className="text-gray-600"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Amount Due:
            </Typography>
            <Typography variant="small" className="font-bold text-blue-600 text-base"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Rs.{advanceAmount.toLocaleString()}
            </Typography>
          </div>

          {useWallet && maxDeductible > 0 && (
            <>
              <div className="flex justify-between">
                <Typography variant="small" className="text-gray-600"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Wallet Deduction:
                </Typography>
                <Typography variant="small" className="font-medium text-green-600"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  - Rs.{maxDeductible.toLocaleString()}
                </Typography>
              </div>

              <div className="border-t pt-2 flex justify-between">
                <Typography variant="small" className="font-semibold text-gray-700"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  {remainingAfterWallet > 0 ? "Pay via Card:" : "Total (Wallet Only):"}
                </Typography>
                <Typography variant="small" className="font-bold text-blue-600 text-base"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Rs.{remainingAfterWallet.toLocaleString()}
                </Typography>
              </div>
            </>
          )}
        </div>

        {/* Wallet toggle */}
        <div className="border rounded-lg p-4 space-y-2">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useWallet}
              onChange={(e) => setUseWallet(e.target.checked)}
              className="form-checkbox h-5 w-5 text-purple-600 rounded"
            />
            <div>
              <Typography variant="small" className="font-medium text-gray-800"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Use Wallet Balance
              </Typography>
              <Typography variant="small" className="text-gray-500"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Available: Rs.{walletBalance.toLocaleString()}
              </Typography>
            </div>
          </label>

          {useWallet && walletBalance === 0 && (
            <Typography variant="small" className="text-amber-600 ml-8"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              No wallet balance available.
            </Typography>
          )}
          {isFullyFromWallet && (
            <Typography variant="small" className="text-green-600 ml-8"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Full payment covered by wallet — no card needed!
            </Typography>
          )}
          {useWallet && maxDeductible > 0 && remainingAfterWallet > 0 && (
            <Typography variant="small" className="text-blue-600 ml-8"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Rs.{maxDeductible.toLocaleString()} from wallet + Rs.{remainingAfterWallet.toLocaleString()} via card.
            </Typography>
          )}
        </div>
      </DialogBody>

      <DialogFooter
        className="border-t border-blue-gray-100 gap-2"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Button variant="text" color="blue-gray" onClick={onClose} disabled={isProcessing}
          placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Cancel
        </Button>
        <Button color="green" onClick={handlePay} disabled={isProcessing}
          className="flex items-center gap-2"
          placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <LockClosedIcon className="h-5 w-5" />
          {isProcessing
            ? "Processing..."
            : isFullyFromWallet
            ? "Confirm Wallet Payment"
            : `Pay Rs.${remainingAfterWallet.toLocaleString()} via Card`}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default PaymentModal;