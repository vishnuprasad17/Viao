import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import {
  getSingleBooking,
  cancelBooking,
} from "../../../config/services/userApi";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Booking } from "../../../interfaces/commonTypes";
import PaymentModal from "./PaymentModal";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}

const RetryCountdown: React.FC<{
  secondsRemaining: number;
  onExpire: () => void;
}> = ({ secondsRemaining, onExpire }) => {
  const [seconds, setSeconds] = useState(secondsRemaining);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSeconds(secondsRemaining);
  }, [secondsRemaining]);

  useEffect(() => {
    if (seconds <= 0) {
      onExpire();
      return;
    }
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          onExpire();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [secondsRemaining]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <span className="font-mono text-amber-700 font-bold">
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </span>
  );
};

const SingleBooking = () => {
  const [open, setOpen] = useState(false);
  const [booking, setBooking] = useState<Booking>();
  const [retryExpired, setRetryExpired] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const fetchBooking = async () => {
    try {
      const response = await getSingleBooking(id);
      setBooking(response.data.bookings[0]);
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
  };

  useEffect(() => {
    if (id) fetchBooking();
  }, [id]);

  // Cancel
  const confirmCancel = async () => {
    cancelBooking(id)
      .then(() => {
        setOpen(false);
        fetchBooking();
        toast.success("Booking cancelled successfully!");
      })
      .catch((error) => console.log(error));
  };

  // Cancellation refund message
  const getCancellationMessage = (): string => {
    if (!booking) return "";
    if (booking.payment_status !== "Completed") {
      return "This action cannot be undone.";
    }
    const advance = booking.advanceAmount || booking.amount;
    return `Cancellation policy applies. Up to ₹${advance.toLocaleString()} may be refunded based on timing. Check the service policy for details.`;
  };

  // Derived flags
  const showRetry =
    booking?.status === "payment_pending" &&
    booking?.retryAllowed === true &&
    !retryExpired;

  const retrySeconds = booking?.retrySecondsRemaining ?? 0;

  // Show cancel button when booking is active (not already terminal) and either:
  //   a) payment is not yet completed (pending/failed), or
  //   b) booking is confirmed and payment is completed (pre-event cancellation)
  const isTerminal =
    booking?.status === "cancelled" ||
    booking?.status === "failed" ||
    booking?.status === "completed";

  const showCancelButton = !isTerminal;

  return (
    <div className="mx-4 md:mx-20 mt-8">
      {/* Payment failed alert with retry */}
      {booking?.payment_status === "Failed" && (
        <Alert
          icon={<Icon />}
          color="red"
          className="mb-8 rounded-lg border-l-4 border-red-500"
        >
          <Typography
            variant="h6"
            color="white"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Payment Failed
          </Typography>
          <Typography
            color="white"
            className="mt-1"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {showRetry ? (
              <>
                Retry payment within{" "}
                <RetryCountdown
                  secondsRemaining={retrySeconds}
                  onExpire={() => setRetryExpired(true)}
                />{" "}
                or your booking will be automatically cancelled.
              </>
            ) : (
              "Retry window has expired. This booking has been cancelled."
            )}
          </Typography>
        </Alert>
      )}

      {/* Action buttons row */}
      {(showRetry || showCancelButton) && (
        <div className="flex justify-end gap-3 mb-8">
          {showRetry && (
            <Button
              color="amber"
              className="flex items-center gap-2"
              onClick={() => setPaymentModalOpen(true)}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <ArrowPathIcon className="h-5 w-5" />
              Retry Payment
            </Button>
          )}

          {showCancelButton && (
            <Button
              color="red"
              variant="outlined"
              className="flex items-center gap-2"
              onClick={() => setOpen(true)}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel Booking
            </Button>
          )}
        </div>
      )}

      {/* Booking Details Card */}
      <Card
        className="shadow-lg rounded-xl overflow-hidden"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <CardHeader
          floated={false}
          shadow={false}
          className="bg-gradient-to-r from-purple-600 to-blue-500 p-8 text-white rounded-t-xl"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Typography
            variant="h3"
            className="mb-2"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {booking?.eventName}
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Typography
                variant="h6"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Event Date
              </Typography>
              <Typography
                variant="lead"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {booking?.date}
              </Typography>
            </div>
            <div>
              <Typography
                variant="h6"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Location
              </Typography>
              <Typography
                variant="lead"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {booking?.city}
              </Typography>
            </div>
            <div>
              <Typography
                variant="h6"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Booking Status
              </Typography>
              <Typography
                variant="lead"
                className={clsx({
                  "text-green-300":
                    booking?.status === "confirmed" ||
                    booking?.status === "completed",
                  "text-red-300":
                    booking?.status === "cancelled" ||
                    booking?.status === "failed",
                  "text-amber-300": booking?.status === "payment_pending",
                })}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {booking?.status === "payment_pending"
                  ? "Payment Pending"
                  : booking?.status === "confirmed"
                    ? "Confirmed"
                    : booking?.status === "completed"
                      ? "Completed"
                      : booking?.status === "cancelled"
                        ? "Cancelled"
                        : booking?.status === "failed"
                          ? "Failed"
                          : booking?.status}
              </Typography>
            </div>
          </div>
        </CardHeader>

        <CardBody
          className="p-8"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vendor Info */}
            <div className="space-y-4">
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-4"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Vendor Information
              </Typography>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <UserCircleIcon className="h-6 w-6 text-blue-gray-500" />
                  <Typography
                    variant="lead"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {booking?.vendorId?.name}
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-6 w-6 text-blue-gray-500" />
                  <Typography
                    variant="lead"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {booking?.vendorId?.phone}
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="h-6 w-6 text-blue-gray-500" />
                  <Typography
                    variant="lead"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {booking?.vendorId?.email}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Service & Payment */}
            <div className="space-y-4">
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-4"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Service Details
              </Typography>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography
                    variant="lead"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Service Type:
                  </Typography>
                  <Typography
                    variant="lead"
                    className="font-medium"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {booking?.eventName}
                  </Typography>
                </div>
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
                    className="font-bold text-blue-600"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    ₹{booking?.amount?.toLocaleString()}
                  </Typography>
                </div>
                {booking &&
                  booking?.advanceAmount > 0 &&
                  booking?.advanceAmount !== booking?.amount && (
                    <div className="flex justify-between">
                      <Typography
                        variant="lead"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Advance Paid:
                      </Typography>
                      <Typography
                        variant="lead"
                        className="font-medium text-purple-600"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        ₹{booking?.advanceAmount?.toLocaleString()}
                      </Typography>
                    </div>
                  )}
                <div className="flex justify-between">
                  <Typography
                    variant="lead"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Payment Status:
                  </Typography>
                  <Typography
                    variant="lead"
                    className={clsx("font-medium", {
                      "text-green-600": booking?.payment_status === "Completed",
                      "text-amber-600": booking?.payment_status === "Pending",
                      "text-red-600": booking?.payment_status === "Failed",
                    })}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {booking?.payment_status}
                  </Typography>
                </div>

                {/* Refund info if cancelled */}
                {booking?.status === "cancelled" &&
                  booking?.refundAmount > 0 && (
                    <div className="flex justify-between">
                      <Typography
                        variant="lead"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Refund Credited:
                      </Typography>
                      <Typography
                        variant="lead"
                        className="font-bold text-green-600"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        ₹{booking?.refundAmount?.toLocaleString()}
                      </Typography>
                    </div>
                  )}
                {booking?.status === "cancelled" &&
                  booking?.refundAmount === 0 &&
                  booking?.payment_status === "Completed" && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                      No refund applicable based on cancellation policy.
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* User Note */}
          {booking?.userNote && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-1"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Your Notes
              </Typography>
              <Typography
                className="text-gray-700"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {booking.userNote}
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Cancellation Dialog */}
      <Dialog
        open={open}
        handler={() => setOpen(!open)}
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
          Confirm Cancellation
        </DialogHeader>
        <DialogBody
          className="py-8"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="text-center">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <Typography
              variant="h5"
              color="red"
              className="mb-2"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Are you sure you want to cancel?
            </Typography>
            <Typography
              color="blue-gray"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {getCancellationMessage()}
            </Typography>
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
            onClick={() => setOpen(false)}
            className="mr-2"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Go Back
          </Button>
          <Button
            color="red"
            onClick={confirmCancel}
            className="flex items-center gap-2"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <CheckCircleIcon className="h-5 w-5" />
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Payment Modal — for retry payment */}
      {booking && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          bookingId={booking.id}
          vendorId={booking.vendorId.id}
          vendorName={booking.vendorId.name}
          vendorLogoUrl={booking.vendorId.logoUrl ?? ""}
          advanceAmount={booking.advanceAmount || booking.amount}
          onSuccess={() => {
            setPaymentModalOpen(false);
            fetchBooking();
          }}
        />
      )}
    </div>
  );
};

export default SingleBooking;