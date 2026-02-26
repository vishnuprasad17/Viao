import {
    Card, CardHeader, CardBody, Typography, Input, Button,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { validateEmailValue, validateOTP } from "../../validations/common/forgotPassword";
import { forgotPwdOtp, pwdOtpResend, verifyForgotPwdOtp } from "../../config/services/authApi";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { USER }   from "../../config/routes/user.routes";
import { VENDOR } from "../../config/routes/vendor.routes";
import { useOtpTimer } from "../../hooks/useOtpTimer";

interface EmailValue { email: string; }
interface OTPValue   { otp: string;   }

const ForgotPassword = () => {
    const navigate   = useNavigate();
    const location   = useLocation();
    const [otpSent, setOtpSent] = useState(false);

    const isVendor = location.pathname === VENDOR.FORGOT_PWD;
    const role     = isVendor ? "vendor" : "user";

    const { timeRemaining, canResend, isExpired, startTimer, formatTime } = useOtpTimer();

    // ── Email form ────────────────────────────────────────────────────────────
    const emailFormik = useFormik<EmailValue>({
        initialValues: { email: "" },
        validate: validateEmailValue,
        onSubmit: (values) => {
            forgotPwdOtp(role, values, { withCredentials: true })
                .then((data) => {
                    startTimer(data.otpExpiresAt);
                    setOtpSent(true);
                    toast.success(data.message || "OTP sent to your email");
                })
                .catch((error) => {
                    toast.error(error.response?.data?.error || "Failed to send OTP");
                });
        },
    });

    // ── OTP form ─────────────────────────────────────────────────────────────
    const otpFormik = useFormik<OTPValue>({
        initialValues: { otp: "" },
        validate: validateOTP,
        onSubmit: (values) => {
            if (isExpired) {
                toast.error("OTP has expired. Please request a new one.");
                return;
            }
            verifyForgotPwdOtp(role, values, { withCredentials: true })
                .then((data) => {
                    toast.success(data.message || "OTP verified");
                    navigate(isVendor ? VENDOR.RESET_PWD : USER.RESET_PWD);
                })
                .catch((error) => {
                    toast.error(
                        error.response?.data?.error ||
                        error.response?.data?.message ||
                        "OTP verification failed"
                    );
                });
        },
    });

    // ── Resend ────────────────────────────────────────────────────────────────
    const handleResendOtp = async () => {
        try {
            const response = await pwdOtpResend(role, { withCredentials: true });
            // ── FIX: use server expiry timestamp ──
            startTimer(response.otpExpiresAt);
            toast.success(response.message || "New OTP sent to email");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to resend OTP"
            );
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

            <div className="w-full md:w-1/2 mt-10 md:mt-20 mb-20">
                <Card
                    className="w-96 m-auto bg-dark"
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
                            Forgot Password
                        </Typography>
                        <Typography variant="small" color="gray" className="mt-2"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        >
                            Enter your email to receive an OTP
                        </Typography>
                    </CardHeader>

                    <CardBody className="flex flex-col gap-4"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                    >
                        {/* ── Email + Send OTP ── */}
                        <form onSubmit={emailFormik.handleSubmit}>
                            <div className="flex items-center gap-2">
                                <Input
                                    label="Email" size="md" name="email"
                                    onChange={emailFormik.handleChange}
                                    value={emailFormik.values.email}
                                    crossOrigin={undefined} color="pink"
                                    className="bg-white bg-opacity-50"
                                    disabled={otpSent && !canResend}
                                    onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                />
                                <Button
                                    variant="gradient" color="blue" size="md" type="submit"
                                    disabled={otpSent && !canResend}
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                >
                                    {otpSent && !canResend ? "Sent" : "Send OTP"}
                                </Button>
                            </div>
                            {emailFormik.errors.email && (
                                <p className="text-sm text-red-600 mt-1">{emailFormik.errors.email}</p>
                            )}
                        </form>

                        {/* ── Timer / Resend ── */}
                        {otpSent && (
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
                        )}

                        {/* ── OTP verify ── */}
                        <form onSubmit={otpFormik.handleSubmit}>
                            <Input
                                label="Enter OTP" size="md" name="otp"
                                onChange={otpFormik.handleChange}
                                value={otpFormik.values.otp}
                                crossOrigin={undefined} color="pink"
                                className="bg-white bg-opacity-50"
                                disabled={!otpSent}
                                maxLength={6}
                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                            />
                            {otpFormik.errors.otp && (
                                <p className="text-sm text-red-600 mt-1">{otpFormik.errors.otp}</p>
                            )}

                            <Button
                                variant="gradient" color="blue" fullWidth type="submit"
                                className="mt-4"
                                disabled={!otpSent || isExpired}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                            >
                                {isExpired ? "OTP Expired — Resend first" : "Verify OTP"}
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;