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
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  getSingleBooking,
  cancelBooking,
} from "../../../config/services/userApi";
import { useLocation } from "react-router-dom";
import PaymentCard from "./PaymentCard";
import { toast } from "react-toastify";
import { Booking } from "../../../interfaces/commonTypes";

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

const SingleBooking = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [booking, setBooking] = useState<Booking>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const fetchBooking = async () => {
    try {
      const response = await getSingleBooking(id);
      setBooking(response.data.bookings[0]);
      console.log(response.data.bookings[0]);
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const calculateRefund = (amount: number): number => {
    if (amount <= 10000) {
      return amount - 500;
    } else if (amount <= 100000) {
      return amount - 1000;
    } else {
      return amount - 2000;
    }
  }

  const confirmCancel = async () => {
    cancelBooking(id)
      .then((response) => {
        // setBooking(response.data.bookings[0]);
        handleOpen();
        fetchBooking();
        toast.success("Booking cancelled Successfully!");
        console.log(response.data.bookings[0]);
      })
      .catch((error) => {
        console.log("here", error);
      });
  };

  return (
    <div className="mx-4 md:mx-20 mt-8">
      {/* Status Alert */}
      {booking?.payment_status === "Pending" &&
        booking?.status === "Accepted" && (
          <Alert
            icon={<Icon />}
            color="amber"
            className="mb-8 rounded-lg border-l-4 border-amber-500"
          >
            <Typography
              variant="h6"
              color="white"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Payment Required
            </Typography>
            <Typography
              color="white"
              className="mt-2"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Please complete your payment to confirm your booking.
            </Typography>
          </Alert>
        )}

      {/* Cancel Button */}
      {booking?.status !== "Cancelled" && (
        <div className="flex justify-end mb-8">
          <Button
            color="red"
            variant="outlined"
            className="flex items-center gap-2"
            onClick={handleOpen}
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
                  "text-green-300": booking?.status === "Accepted",
                  "text-red-300":
                    booking?.status === "Rejected" ||
                    booking?.status === "Cancelled",
                  "text-blue-300": booking?.status === "Pending",
                })}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {booking?.status}
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
            {/* Vendor Details */}
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

            {/* Service Details */}
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
                {booking?.status !== "Cancelled" && booking?.payment_status !== "Completed" &&<div className="flex justify-between">
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
                </div>}
                {booking?.status === "Cancelled" && booking?.payment_status === "Completed" &&
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
              </div>}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <PaymentCard booking={booking!} fetchBooking={fetchBooking} />

      {/* Cancellation Dialog */}
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
              Are you sure you want to cancel this booking?
            </Typography>
            <Typography
              color="blue-gray"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {booking?.status === "Accepted" && booking?.payment_status === "Completed" ? `This action cannot be undone. ₹${calculateRefund(booking?.amount)} will be refunded to your wallet.` : `This action cannot be undone. Any advance payments may be subject
              to cancellation fees.`}
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
            onClick={handleOpen}
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
    </div>
  );
};

export default SingleBooking;
