import {
    Card, CardHeader, CardBody, Typography, Input, Button,
} from "@material-tailwind/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { otpResend, verifyEmail } from "../../config/services/authApi";
import { setUserInfo }   from "../../redux/slices/UserSlice";
import { setVendorInfo } from "../../redux/slices/VendorSlice";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { validate } from "../../validations/common/otpValidation";
import { USER }   from "../../config/routes/user.routes";
import { VENDOR } from "../../config/routes/vendor.routes";
import { useOtpTimer } from "../../hooks/useOtpTimer";

interface FormValues { otp: string; }
const initialValues: FormValues = { otp: "" };

const VerifyEmail = () => {
    const location   = useLocation();
    const navigate   = useNavigate();
    const dispatch   = useDispatch();
    const isVendor   = location.pathname === VENDOR.VERIFY;

    const { timeRemaining, canResend, isExpired, startTimer, formatTime } = useOtpTimer();

    useEffect(() => {
        const stored = sessionStorage.getItem('otpExpiresAt');
        if (stored) {
            startTimer(parseInt(stored, 10));
        } else {
            startTimer(Date.now() + 120_000);
        }
    }, [startTimer]);

    const formik = useFormik({
        initialValues,
        validate,
        onSubmit: (values) => {
            const role = isVendor ? "vendor" : "user";

            verifyEmail(role, values, { withCredentials: true })
                .then((data) => {
                    sessionStorage.removeItem('otpExpiresAt'); // clean up
                    if (isVendor) {
                        dispatch(setVendorInfo(data.vendor));
                    } else {
                        dispatch(setUserInfo(data.user));
                    }
                    toast.success("Successfully registered!");
                    navigate(isVendor ? VENDOR.DASHBOARD : USER.HOME);
                })
                .catch((error) => {
                    const msg = error.response?.data?.message || error.response?.data?.error;
                    toast.error(msg || "Verification failed");
                });
        },
    });

    const handleResendOtp = async () => {
        const role = isVendor ? "vendor" : "user";
        try {
            const response = await otpResend(role, { withCredentials: true });
            // ── FIX: use server expiry timestamp, not a fresh 120 s ──
            sessionStorage.setItem('otpExpiresAt', String(response.otpExpiresAt));
            startTimer(response.otpExpiresAt);
            toast.success(response.message || "New OTP sent to email");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to resend OTP");
        }
    };

    const gradient = isVendor
        ? "bg-gradient-to-br from-green-900 via-green-700 to-green-500"
        : "bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500";

    return (
        <div className="w-full h-screen flex flex-col md:flex-row items-start">
            <div className={`w-full md:w-1/2 h-full object-cover ${gradient}`}>
                {isVendor ? (
                    <>
                        <h1 className="text-4xl text-white font-bold mt-20 mx-4">Grow With Viao</h1>
                        <p className="text-xl text-white font-normal mt-5 mx-4">"Your vision, our canvas."</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-4xl text-white font-bold mt-20 mx-4">Transform Your Vision Into Reality</h1>
                        <p className="text-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text font-normal mt-5 mx-4">
                            Easily Connect, Plan, and Execute Your Ideas
                        </p>
                    </>
                )}
            </div>

            <div className="w-full md:w-1/2 mt-10 md:mt-20 md:mb-20 mb-20">
                <Card
                    className="w-full md:w-96 m-auto"
                    placeholder={undefined} shadow={false}
                    onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                >
                    <CardHeader
                        floated={false} shadow={false} color="transparent"
                        className="mt-10 rounded-none text-center"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                    >
                        <Typography variant="h4" color="black"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        >
                            Verify OTP
                        </Typography>
                        <Typography variant="small" color="gray" className="mt-2"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        >
                            Enter the 6-digit code sent to your email
                        </Typography>
                    </CardHeader>

                    <form onSubmit={formik.handleSubmit}>
                        <CardBody className="flex flex-col gap-4"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        >
                            <Input
                                label="Enter OTP" size="md" name="otp"
                                value={formik.values.otp}
                                onChange={formik.handleChange}
                                crossOrigin={undefined}
                                color="black"
                                className="bg-white bg-opacity-50"
                                maxLength={6}
                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                            />
                            {formik.errors.otp && (
                                <p className="text-sm text-red-600 -mt-2">{formik.errors.otp}</p>
                            )}

                            {/* ── Timer or Resend ── */}
                            <div className="text-center min-h-[28px]">
                                {!canResend ? (
                                    <p className="text-sm text-gray-600">
                                        Resend OTP in{" "}
                                        <span className="font-semibold text-blue-600">
                                            {formatTime(timeRemaining)}
                                        </span>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            <Button
                                variant="gradient" color="blue" fullWidth type="submit"
                                className="hover:shadow-lg transition-shadow duration-300"
                                disabled={isExpired}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                            >
                                {isExpired ? "OTP Expired — Resend first" : "Verify and Login"}
                            </Button>
                        </CardBody>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default VerifyEmail;