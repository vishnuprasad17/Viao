import { Card, CardBody, Typography, CardHeader, Button } from "@material-tailwind/react";
import Breadcrumb from "../../../../components/vendor/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import { getSingleBooking, markBookingCompleted } from "../../../../config/services/venderApi";
import { useLocation } from "react-router-dom";
import { Booking } from "../../../../interfaces/commonTypes";
import Layout from "../../../../layout/vendor/Layout";
import { CalendarIcon, MapPinIcon, UserCircleIcon, PhoneIcon, CheckCircleIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { toast } from "react-toastify";

const ViewBooking = () => {
  const [booking, setBooking] = useState<Booking>();
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    getSingleBooking(id)
      .then((response) => setBooking(response.data.bookings[0]))
      .catch(console.error);
  }, [id]);

  const handleMarkCompleted = async () => {
    if (!booking) return;
    try {
      setIsMarkingComplete(true);
      await markBookingCompleted(booking.id);
      setBooking((prev) => prev ? { ...prev, status: "completed" } : undefined);
      toast.success("Booking marked as completed!");
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "payment_pending": return "Payment Pending";
      case "confirmed": return "Confirmed";
      case "completed": return "Completed";
      case "cancelled": return "Cancelled";
      case "failed": return "Failed";
      default: return status;
    }
  };

  return (
    <Layout>
      <Breadcrumb pageName="Booking Details" folderName="Bookings" />

      <div className="mx-4 md:mx-8 mt-4 md:mt-8">
        <Card className="shadow-lg rounded-xl overflow-hidden"
          placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>

          <CardHeader
            floated={false} shadow={false}
            className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 md:p-8 text-white rounded-t-xl"
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
          >
            <Typography variant="h2" className="mb-4 md:mb-6 text-xl md:text-3xl text-white"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {booking?.eventName}
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-start gap-2 md:gap-3">
                <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                <div>
                  <Typography variant="h6" className="text-sm md:text-base"
                    placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Event Date</Typography>
                  <Typography variant="small" className="text-xs md:text-sm font-light"
                    placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{booking?.date}</Typography>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <MapPinIcon className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                <div>
                  <Typography variant="h6" className="text-sm md:text-base"
                    placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Location</Typography>
                  <Typography variant="small" className="text-xs md:text-sm font-light"
                    placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{booking?.city}</Typography>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <CheckCircleIcon className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                <div>
                  <Typography variant="h6" className="text-sm md:text-base"
                    placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Status</Typography>
                  <Typography variant="small"
                    className={clsx("text-xs md:text-sm font-semibold", {
                      "text-green-300": booking?.status === "confirmed" || booking?.status === "completed",
                      "text-red-300": booking?.status === "cancelled" || booking?.status === "failed",
                      "text-amber-300": booking?.status === "payment_pending",
                    })}
                    placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    {statusLabel(booking?.status ?? "")}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Mark as completed button — only show for confirmed + paid bookings */}
            {booking?.status === "confirmed" && booking?.payment_status === "Completed" && (
              <div className="mt-4 md:mt-6">
                <Button
                  color="green"
                  variant="outlined"
                  className="border-white text-white hover:bg-white hover:text-green-700 flex items-center gap-2"
                  onClick={handleMarkCompleted}
                  disabled={isMarkingComplete}
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  {isMarkingComplete ? "Updating..." : "Mark as Completed"}
                </Button>
              </div>
            )}
          </CardHeader>

          <CardBody className="p-4 md:p-8"
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

              {/* Customer Info */}
              <div className="space-y-3">
                <Typography variant="h5" className="text-lg md:text-xl mb-2"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Customer Details
                </Typography>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    <UserCircleIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-gray-500 flex-shrink-0" />
                    <div>
                      <Typography variant="small" className="text-xs md:text-sm"
                        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        {booking?.name}
                      </Typography>
                      <Typography variant="small" className="text-xs md:text-sm text-gray-600"
                        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Customer Name
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <PhoneIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-gray-500 flex-shrink-0" />
                    <div>
                      <Typography variant="small" className="text-xs md:text-sm"
                        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        {booking?.mobile}
                      </Typography>
                      <Typography variant="small" className="text-xs md:text-sm text-gray-600"
                        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Contact Number
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-3">
                <Typography variant="h5" className="text-lg md:text-xl mb-2"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Payment Details
                </Typography>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Typography variant="small" className="text-xs md:text-sm"
                      placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Total Amount:</Typography>
                    <Typography variant="small" className="text-xs md:text-sm font-bold text-blue-600"
                      placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{booking?.totalServicePrice?.toLocaleString()}
                    </Typography>
                  </div>
                  {booking && booking?.chargeAmount > 0 && booking?.chargeAmount !== booking?.totalServicePrice && (
                    <div className="flex justify-between items-center">
                      <Typography variant="small" className="text-xs md:text-sm"
                        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Advance Collected:</Typography>
                      <Typography variant="small" className="text-xs md:text-sm font-bold text-purple-600"
                        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        ₹{booking?.chargeAmount?.toLocaleString()}
                      </Typography>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <Typography variant="small" className="text-xs md:text-sm"
                      placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Payment Status:</Typography>
                    <Typography variant="small"
                      className={clsx("text-xs md:text-sm font-semibold", {
                        "text-green-600": booking?.payment_status === "Completed",
                        "text-amber-600": booking?.payment_status === "Pending",
                        "text-red-600": booking?.payment_status === "Failed",
                      })}
                      placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      {booking?.payment_status}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* User Note — show if present */}
            {booking?.userNote && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-blue-600" />
                  <Typography variant="h6" color="blue-gray"
                    placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    Customer Notes
                  </Typography>
                </div>
                <Typography className="text-gray-700"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  {booking.userNote}
                </Typography>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default ViewBooking;