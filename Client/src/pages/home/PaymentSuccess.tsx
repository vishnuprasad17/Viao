import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardBody,
  Typography,
  CardFooter,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addPayment } from "../../config/services/userApi";
import { USER } from "../../config/routes/user.routes";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const session_id = queryParams.get("session_id");
  const id = queryParams.get("booking_id");
  const [isProcessing, setIsProcessing] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [transactionRef, setTransactionRef] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!session_id || !id) {
      navigate(USER.BOOKING_DETAILS);
      return;
    }

    const processPayment = async () => {
      try {
        setIsProcessing(true);
        const response = await addPayment(session_id);
        setTransactionRef(response.data.payment.transactionRef);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (error) {
        setHasError(true);
        console.error("Payment processing error:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [session_id, id, navigate]);

  const handleCopy = () => {
    if (transactionRef) {
      navigator.clipboard
        .writeText(transactionRef)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(() => {
          alert("Failed to copy reference. Please try again.");
        });
    }
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <Card
          className="w-full max-w-md rounded-2xl shadow-xl border border-red-100"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <CardBody
            className="p-8 text-center"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <div className="mb-6 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <Typography
              variant="h4"
              className="mb-2 text-red-700"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Payment Processing Failed
            </Typography>
            <Typography
              className="text-gray-600 mb-6"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              We encountered an issue processing your payment. Please try again
              or contact support.
            </Typography>
            <Button
              color="red"
              ripple={false}
              className="rounded-lg hover:shadow-md transition-all duration-300"
              onClick={() => window.location.reload()}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Retry Payment
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card
          className="rounded-2xl shadow-xl overflow-hidden border border-blue-gray-50"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <CardBody
            className="p-8 md:p-12"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="inline-block bg-green-50 rounded-full p-4"
              >
                <CheckCircleIcon className="h-20 w-20 text-green-600" />
              </motion.div>

              <Typography
                variant="h2"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Payment Successful!
              </Typography>

              <Typography
                className="text-lg text-gray-600 mb-8"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Your payment has been processed successfully. A confirmation
                email has been sent to your registered address.
              </Typography>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button
                  color="indigo"
                  size="lg"
                  className="rounded-lg hover:shadow-md transition-transform duration-300 hover:-translate-y-1"
                  ripple={false}
                  disabled={isProcessing}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <Link
                      to={`${USER.PROFILE}${USER.BOOKING}?id=${id}`}
                      className="flex items-center gap-2"
                    >
                      View Booking Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  )}
                </Button>

                <Button
                  variant="outlined"
                  color="indigo"
                  size="lg"
                  className="rounded-lg border-2 hover:border-indigo-700 hover:bg-indigo-50 transition-colors duration-300"
                  ripple={false}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <Link to={USER.HOME} className="flex items-center gap-2">
                    Return to Home
                  </Link>
                </Button>
              </div>
            </div>
          </CardBody>

          <CardFooter
            className="bg-indigo-50 p-6"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <div className="text-center text-sm text-gray-600">
              Need help?{" "}
              <a
                href="mailto:support@viao.com"
                className="text-indigo-600 hover:text-indigo-800 underline transition-colors duration-200"
              >
                Contact our support team
              </a>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center relative">
          <Tooltip content="click to copy">
            <Typography
              variant="small"
              className="text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors duration-200"
              onClick={handleCopy}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Transaction Reference: {transactionRef || "Loading..."}
            </Typography>
          </Tooltip>

          <AnimatePresence>
            {isCopied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 z-50"
              >
                <CheckCircleIcon className="h-4 w-4" />
                <span className="text-sm">Copied to clipboard!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}