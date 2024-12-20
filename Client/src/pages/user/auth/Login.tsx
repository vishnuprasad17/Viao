import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gLogin, login } from "../../../config/services/authApi";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../../../redux/slices/UserSlice";
import UserRootState from "../../../redux/rootstate/UserState";
import { validate } from "../../../validations/common/loginVal";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { USER } from "../../../config/routes/userRoutes";
import { VENDOR } from "../../../config/routes/vendorRoutes";

const client_id = import.meta.env.VITE_CLIENT_ID || "";

interface FormValues {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: "",
  password: "",
};

const UserLogin = () => {
  const user = useSelector((state: UserRootState) => state.user.userdata);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = "user";

  useEffect(() => {
    if (user) {
      navigate(USER.HOME);
    }
  }, []);

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      login(role, values)
        .then((data) => {
          console.log(data);


          console.log(data.userData);

          dispatch(setUserInfo(data.userData));
          toast.success(data.message);
          navigate(`${USER.HOME}`);
        })
        .catch((error) => {
          toast.error(error.response?.data?.message);
          console.log(error);
        });
    },
  });

  return (
    <div className="w-full h-screen flex flex-col md:flex-row items-start">
      <div className="w-full md:w-1/2 h-full object-cover bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
        <h1 className="text-4xl md:text-4xl text-white font-bold mt-20 mx-4">
        Transform Your Vision Into Reality
        </h1>
        <p className="text-xl md:text-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-transparent bg-clip-text font-normal mt-5 mx-4">
        Easily Connect, Plan, and Execute Your Ideas
        </p>
      </div>
      <div className="w-full md:w-1/2 mt-10 md:mt-0">
        <GoogleOAuthProvider clientId={client_id}>
          <Card
            className="w-full md:w-96 m-auto bg-dark"
            shadow={false}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="mt-20 rounded-none text-center"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Typography
                variant="h4"
                color="blue-gray"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Sign in
              </Typography>
            </CardHeader>
            <form onSubmit={formik.handleSubmit}>
              <CardBody
                className="flex flex-col gap-4"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Input
                  label="Email"
                  size="md"
                  crossOrigin={undefined}
                  color="gray"
                  className="bg-gray-200 bg-opacity-50"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  name="email"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                {formik.errors.email ? (
                  <p
                    className="text-sm"
                    style={{ color: "red", marginBottom: -10, marginTop: -10 }}
                  >
                    {formik.errors.email}
                  </p>
                ) : null}
                <Input
                  label="Password"
                  size="md"
                  crossOrigin={undefined}
                  color="gray"
                  className="bg-gray-200 bg-opacity-50"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  name="password"
                  type="password"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                {formik.errors.password ? (
                  <p
                    className="text-sm"
                    style={{ color: "red", padding: 0, marginTop: -10 }}
                  >
                    {formik.errors.password}
                  </p>
                ) : null}
                <div className="ml-2.5">
                  <Link to={USER.FORGOT_PWD}>
                    <Typography
                      variant="small"
                      color="blue"
                      placeholder={undefined}
                      className="text-left"
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Forgot password?
                    </Typography>
                  </Link>
                </div>
                <Button
                  variant="gradient"
                  color="blue"
                  fullWidth
                  className="hover:shadow-lg transition-shadow duration-300"
                  placeholder={undefined}
                  type="submit"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Sign In
                </Button>
              </CardBody>
            </form>
            <div id="signInButton" className="flex justify-center mt-4">
              <GoogleLogin
                type="standard"
                theme="outline"
                shape="circle"
                size="large"
                onSuccess={(response) => {
                  gLogin("login", role, response)
                    .then((data) => {
                      console.log(data, "google @");
                      if (data) {
                        //console.log(data);
                        dispatch(setUserInfo(data.userData));
                        toast.success("Successfully logged in...!");
                        navigate(`${USER.HOME}`);
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      toast.error(error.response.data.error);
                    });
                }}
              />
            </div>

            <CardFooter
              className="pt-0"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Typography
                variant="small"
                color="black"
                className="mt-6 flex justify-center "
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Don&apos;t have an account?
                <Link to={USER.SIGNUP}>
                  <Typography
                    as="a"
                    href="#signup"
                    variant="small"
                    color="blue"
                    className="ml-1 font-bold"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Sign up
                  </Typography>
                </Link>
              </Typography>
              <Typography
                variant="small"
                color="black"
                className="mt-3 flex justify-center"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Are you a vendor?
                <Link to={VENDOR.LOGIN}>
                  <Typography
                    as="a"
                    href="#signup"
                    variant="small"
                    color="blue"
                    className="ml-1 font-bold"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Login here
                  </Typography>
                </Link>
              </Typography>
            </CardFooter>
          </Card>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default UserLogin;