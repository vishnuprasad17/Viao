import {
  Card,
  Typography,
  Button,
  CardBody,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { CreditCardIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { loadWallet, makePayment } from "../../../config/services/userApi";
import { useEffect, useState } from "react";
import UserRootState from "../../../redux/rootstate/UserState";
import { useSelector } from "react-redux";
import { Booking } from "../../../interfaces/commonTypes";
import { toast } from "react-toastify";

interface PaymentCardProps {
  booking: Booking;
  fetchBooking: () => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ booking, fetchBooking }) => {
  const [open, setOpen] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const handleOpen = () => setOpen(!open);
  const user = useSelector((state: UserRootState) => state.user.userdata);
  
  useEffect(() => {
    loadWallet(user?.id)
    .then((response) => {
      setWalletBalance(response.data.walletBalance);
    })
    .catch((error) => {
      console.log("here", error);
    });
  }, [user?.id]);
  
  const maxDeductible = Math.min(walletBalance, booking?.amount);
  const remainingAmount = useWallet ? Math.max(booking?.amount - maxDeductible, 0) : booking?.amount;

  const handleClick = async () => {
    makePayment(
      user?.id,
      booking?.vendorId.id,
      booking?.id,
      booking?.name,
      booking?.vendorId?.logoUrl,
      useWallet
    )
      .then((response) => {
        if (response.data.status === "completed") {
          toast.success("Payment completed using wallet balance!");
          fetchBooking();
        } else if (response.data.url) {
          window.location.href = response.data.url;
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Payment failed");
      });
  };
  return (
    <Card
      className="mt-8 shadow-lg rounded-xl overflow-hidden"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <CardBody
        className="p-8"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="space-y-2">
            <Typography
              variant="h5"
              color="blue-gray"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Payment Summary
            </Typography>
            <div className="flex items-center gap-2">
              <Typography
                variant="lead"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Total Amount:
              </Typography>
              <Typography
                variant="h4"
                color="blue"
                className="font-bold"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                ₹{booking?.amount?.toLocaleString()}
              </Typography>
            </div>
            <Typography
              variant="small"
              className={clsx("font-medium", {
                "text-green-600": booking?.payment_status === "Completed",
                "text-amber-600": booking?.payment_status === "Pending",
                "text-red-600": booking?.payment_status === "Failed",
              })}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Payment Status: {booking?.payment_status}
            </Typography>
          </div>

          {booking?.status === "Accepted" &&
            booking?.payment_status === "Pending" && (
              <div className="space-y-4 w-full md:w-auto">
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <Typography variant="small" className="font-medium"placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}>
                      Use Wallet Balance (₹{walletBalance.toLocaleString()} available)
                    </Typography>
                  </label>
                  {useWallet && (
                    <Typography variant="small" className="ml-6"placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}>
                      Deducting ₹{Math.min(walletBalance, booking.amount).toLocaleString()}. 
                      Remaining: ₹{remainingAmount.toLocaleString()}
                    </Typography>
                  )}
                </div>
                <Button
                  onClick={handleOpen}
                  className="w-full md:w-auto flex items-center gap-2"
                  color="green"
                  placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                  disabled={useWallet && remainingAmount === 0}
                >
                  <CreditCardIcon className="h-5 w-5" />
                  {remainingAmount > 0 ? 'Proceed to Payment' : 'Confirm Wallet Payment'}
                </Button>
              </div>
            )}
        </div>
      </CardBody>

      {/* Payment Dialog */}
      <Dialog
        open={open}
        handler={handleOpen}
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
          Payment Confirmation
        </DialogHeader>
        <DialogBody
          className="py-8"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="text-center space-y-4">
            <CreditCardIcon className="h-16 w-16 text-blue-500 mx-auto" />
            <Typography
              variant="h5"
              color="blue-gray"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Confirm Payment Details
            </Typography>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Typography
                  variant="lead"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Total Amount:
                </Typography>
                <Typography
                  variant="lead"
                  className="font-bold"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  ₹{remainingAmount}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography
                  variant="lead"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Payment Method:
                </Typography>
                <Typography
                  variant="lead"
                  className="font-medium"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Credit/Debit Card
                </Typography>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter
          className="border-t border-blue-gray-100"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Button
            variant="text"
            color="blue-gray"
            onClick={handleOpen}
            className="mr-2"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleClick}
            className="flex items-center gap-2"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <LockClosedIcon className="h-5 w-5" />
            Secure Payment
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
};

export default PaymentCard;