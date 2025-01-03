
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { validateEmailValue, validateOTP } from "../../validations/common/forgotPassword";
import { forgotPwdOtp, pwdOtpResend, verifyForgotPwdOtp } from "../../config/services/authApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { USER } from "../../config/routes/user.routes";
import { VENDOR } from "../../config/routes/vendor.routes";

interface EmailValue {
  email: string;
}

const emailInitialValues: EmailValue = {
  email: "",
};

interface OTPValue {
  otp: string;
}

const otpInitialValues: OTPValue = {
  otp: "",
};

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [otpTimer, setOtpTimer] = useState(0);

  const [otpButtonClicked, setOtpButtonClicked] = useState(false);

  const startOtpTimer = () => {
    setOtpTimer(120);

    const countdown = setInterval(() => {
      setOtpTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    setTimeout(() => {
      clearInterval(countdown);
      setOtpTimer(0);
    }, 120000);
  };

  const formik = useFormik({
    initialValues: emailInitialValues,
    validate: validateEmailValue,
    onSubmit: (values) => {
      {
        location.pathname === VENDOR.FORGOT_PWD
          ? forgotPwdOtp("vendor", values, { withCredentials: true })
              .then((data) => {
                startOtpTimer();
                setOtpButtonClicked(true);
                console.log(data);
                toast.success(data.message);
              })
              .catch((error) => {
                toast.error(error.response?.data?.error);
                console.log("here", error);
              })
          : forgotPwdOtp("user", values, { withCredentials: true })
              .then((data) => {
                console.log(data);
                startOtpTimer();
                setOtpButtonClicked(true);
                toast.success(data.message);
              })
              .catch((error) => {
                toast.error(error.response?.data?.error);
                console.log("here", error);
              });
      }
    },
  });

  const otpFormik = useFormik({
    initialValues: otpInitialValues,
    validate: validateOTP,
    onSubmit: (values) => {
      {
        location.pathname === VENDOR.FORGOT_PWD
          ? verifyForgotPwdOtp("vendor", values, { withCredentials: true })
              .then((data) => {
                console.log(data);
                toast.success(data.message);
                navigate(`${VENDOR.RESET_PWD}`);
              })
              .catch((error) => {
                toast.error(error.response.data.error);
                console.log("here", error);
              })
          : verifyForgotPwdOtp("user", values, { withCredentials: true })
              .then((data) => {
                console.log(data);
                toast.success(data.message);
                navigate(`${USER.RESET_PWD}`);
              })
              .catch((error) => {
                toast.error(error.response.data.message);
                console.log("here", error);
              });
      }
    },
  });


  const handleResendOtp = async () => {
    console.log("Current pathname:", location.pathname);
    const userType = location.pathname === VENDOR.VERIFY ? "vendor" : "user";
    console.log("User type:", userType);
  
    pwdOtpResend(userType, { withCredentials: true })
      .then((data) => {
        console.log("API Success Response:", data);
        startOtpTimer();
        toast.success(data.message);
      })
      .catch((error) => {
        console.error("API Error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Something went wrong! please refresh the page");
      });
  } 

  return (
    <div className="w-full h-screen flex flex-col md:flex-row items-start">
    <div className={`w-full md:w-1/2 h-full object-cover ${location.pathname === "/forgot-password" ? "bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500" :location.pathname === "/vendor/forgot-password"?"bg-gradient-to-br from-green-900 via-green-700 to-green-500": ""}`}>
        {location.pathname === "/forgot-password"?(<><h1 className="text-4xl md:text-4xl text-white font-bold mt-20 mx-4">Transform Your Vision Into Reality</h1>
          <p className="text-xl md:text-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-transparent bg-clip-text font-normal mt-5 mx-4">Easily Connect, Plan, and Execute Your Ideas</p></>):(<>  <h1 className="text-4xl md:text-4xl text-white font-bold mt-20 mx-4">
            Grow With Viao
            </h1>
            <p className="text-xl md:text-2xl text-white font-normal mt-5 mx-4">
              {" "}
              "Your vision, our canvas. Let's paint the future."
            </p></>)}
          
        </div>
        <div className="w-full md:w-1/2 mt-10 md:mt-20 md:mb-20 mb-20">
    <Card
      className="w-96 mt-50 m-auto bg-dark"
      placeholder={undefined}
      shadow={false}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}    >
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="mt-10 rounded-none text-center"
        placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        <Typography variant="h4" color="black" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Forgot Password
        </Typography>
      </CardHeader>

      <CardBody className="flex flex-col gap-4" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex items-center gap-2">
            <Input
              label="Email"
              size="md"
              onChange={formik.handleChange}
              name="email"
              crossOrigin={undefined}
              color="pink"
              className="bg-white bg-opacity-50" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            />
            <Button
              variant="gradient"
              color="blue"
              placeholder={undefined}
              size="md"
              type="submit"
              disabled={!!(otpButtonClicked && !otpTimer)}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
              OTP
            </Button>
          </div>
          {formik.errors.email ? (
            <p className="text-sm" style={{ color: "red", marginBottom: -10 }}>
              {formik.errors.email}
            </p>
          ) : null}
          {otpButtonClicked && otpTimer > 0 ? (
            <p className="text-sm" style={{ color: "red" }}>
              Resend OTP in {otpTimer}s
            </p>
          ) : null}
          {otpButtonClicked && otpTimer === 0 && (
            <Button
              variant="text"
              className="text-center"
              placeholder={undefined}
              type="button"
              size="sm"
              onClick={handleResendOtp}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
              Resend OTP
            </Button>
          )}
        </form>
        <form onSubmit={otpFormik.handleSubmit}>
          <Input
            label="Enter OTP"
            size="md"
            crossOrigin={undefined}
            color="pink"
            className="bg-white bg-opacity-50"
            onChange={otpFormik.handleChange}
            name="otp" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          />
          {otpFormik.errors.otp ? (
            <p className="text-sm" style={{ color: "red", marginBottom: -10 }}>
              {otpFormik.errors.otp}
            </p>
          ) : null}

          <Button
            variant="gradient"
            color="blue"
            fullWidth
            placeholder={undefined}
            type="submit"
            className="mt-3"  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            Verify OTP
          </Button>
        </form>
      </CardBody>
    </Card>
    </div>
    </div>
  );
};

export default ForgotPassword;
