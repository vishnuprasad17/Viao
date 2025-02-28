// ViewBooking.tsx
import {
  Card,
  CardBody,
  Typography,
  CardHeader,
} from "@material-tailwind/react";
import Breadcrumb from "../../../../components/vendor/Breadcrumbs/Breadcrumb";
import UpdateStatus from "./UpdateStatus";
import { useEffect, useState } from "react";
import { getSingleBooking } from "../../../../config/services/venderApi";
import { useLocation } from "react-router-dom";
import { Booking } from "../../../../interfaces/commonTypes";
import Layout from "../../../../layout/vendor/Layout";
import {
  CalendarIcon,
  MapPinIcon,
  UserCircleIcon,
  PhoneIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

const ViewBooking = () => {
  const [booking, setBooking] = useState<Booking>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    getSingleBooking(id)
      .then((response) => {
        setBooking(response.data.bookings[0]);
      })
      .catch(console.error);
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    setBooking((prev) => (prev ? { ...prev, status: newStatus } : undefined));
  };

  return (
    <Layout>
      <Breadcrumb pageName="Booking Details" folderName="Bookings" />

      <div className="mx-4 md:mx-8 mt-4 md:mt-8">
        <Card
          className="shadow-lg rounded-xl overflow-hidden"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <CardHeader
            floated={false}
            shadow={false}
            className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 md:p-8 text-white rounded-t-xl"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Typography
              variant="h2"
              className="mb-4 md:mb-6 text-xl md:text-3xl text-white"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {booking?.eventName}
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Date Section */}
              <div className="flex items-start gap-2 md:gap-3">
                <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                <div>
                  <Typography
                    variant="h6"
                    className="text-sm md:text-base"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Event Date
                  </Typography>
                  <Typography
                    variant="small"
                    className="text-xs md:text-sm font-light"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {booking?.date}
                  </Typography>
                </div>
              </div>

              {/* Location Section */}
              <div className="flex items-start gap-2 md:gap-3">
                <MapPinIcon className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                <div>
                  <Typography
                    variant="h6"
                    className="text-sm md:text-base"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Location
                  </Typography>
                  <Typography
                    variant="small"
                    className="text-xs md:text-sm font-light"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {booking?.city}
                  </Typography>
                </div>
              </div>

              {/* Status Section */}
              <div className="flex items-start gap-2 md:gap-3">
                <CheckCircleIcon className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                <div>
                  <Typography
                    variant="h6"
                    className="text-sm md:text-base"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Status
                  </Typography>
                  <Typography
                    variant="small"
                    className={clsx("text-xs md:text-sm font-semibold", {
                      "text-green-300": booking?.status === "Accepted",
                      "text-red-300": ["Rejected", "Cancelled"].includes(
                        booking?.status || ""
                      ),
                      "text-amber-300": booking?.status === "Pending",
                    })}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {booking?.status}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Status Update - Only show when pending */}
            {booking?.status === "Pending" && (
              <div className="mt-4 md:mt-6 w-full md:max-w-xs">
                <UpdateStatus
                  bookingId={booking?.id}
                  onStatusChange={handleStatusChange}
                />
              </div>
            )}
          </CardHeader>

          <CardBody
            className="p-4 md:p-8"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Customer Information */}
              <div className="space-y-3">
                <Typography
                  variant="h5"
                  className="text-lg md:text-xl mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Customer Details
                </Typography>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    <UserCircleIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-gray-500 flex-shrink-0" />
                    <div>
                      <Typography
                        variant="small"
                        className="text-xs md:text-sm"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {booking?.name}
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-xs md:text-sm text-gray-600"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Customer Name
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <PhoneIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-gray-500 flex-shrink-0" />
                    <div>
                      <Typography
                        variant="small"
                        className="text-xs md:text-sm"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {booking?.mobile}
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-xs md:text-sm text-gray-600"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Contact Number
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-3">
                <Typography
                  variant="h5"
                  className="text-lg md:text-xl mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Payment Details
                </Typography>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Typography
                      variant="small"
                      className="text-xs md:text-sm"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Total Amount:
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-xs md:text-sm font-bold text-blue-600"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      ₹{booking?.amount?.toLocaleString()}
                    </Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography
                      variant="small"
                      className="text-xs md:text-sm"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Payment Status:
                    </Typography>
                    <Typography
                      variant="small"
                      className={clsx("text-xs md:text-sm font-semibold", {
                        "text-green-600":
                          booking?.payment_status === "Completed",
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
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default ViewBooking;
