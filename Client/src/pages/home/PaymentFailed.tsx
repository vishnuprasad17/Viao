import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { markPaymentFailed } from "../../config/services/userApi";
import { USER } from "../../config/routes/user.routes";

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("booking_id");
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      navigate(USER.HOME);
      return;
    }

    const notify = async () => {
      try {
        await markPaymentFailed(bookingId);
      } catch (err) {
        console.warn("markPaymentFailed:", err);
      } finally {
        setIsProcessing(false);
      }
    };

    notify();
  }, [bookingId]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Processing...
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <CardBody className="p-8 text-center space-y-6" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto" />

          <Typography variant="h4" className="text-red-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Payment Cancelled
          </Typography>

          <Typography className="text-gray-600" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Your payment was not completed. You have <strong>30 minutes</strong> to
            retry the payment from your booking details page before the booking
            is automatically cancelled.
          </Typography>

          <div className="flex flex-col gap-3">
            <Button
              color="purple"
              className="w-full"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Link
                to={`${USER.PROFILE}${USER.BOOKING}?id=${bookingId}`}
                className="block w-full"
              >
                Go to Booking & Retry
              </Link>
            </Button>

            <Button
              variant="outlined"
              color="blue-gray"
              className="w-full"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Link to={USER.HOME} className="block w-full">
                Return Home
              </Link>
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PaymentFailed;