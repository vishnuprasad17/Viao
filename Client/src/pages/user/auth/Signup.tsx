import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Link,useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserRootState from "../../../redux/rootstate/UserState";
import { gLogin, signup } from "../../../config/services/authApi";
import { toast } from "react-toastify";
import { validate } from "../../../validations/user/userRegisterVal";
import { GoogleOAuthProvider , GoogleLogin } from "@react-oauth/google";
import { USER } from "../../../config/routes/user.routes";
import { VENDOR } from "../../../config/routes/vendor.routes";
import config from "../../../config/envConfig";

const clientid = config.CLIENTid;


interface UserFormValues {
  email: string;
  password: string;
  name: string;
  phone: string;
  confirm_password: string;
}

const initialValues: UserFormValues = {
  email: "",
  password: "",
  name: "",
  phone: "",
  confirm_password: "",
};

const UserSignup= () => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState<UserFormValues>(initialValues);

  const role = "user";

  const navigate=useNavigate()

  useEffect(() => {
    if (user) {
      navigate(USER.HOME);
    }
  }, []);

  const handleChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    const errors = validate({ ...formValues, [name]: value });
    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
  };

  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors)
    console.log(Object.values(errors))
    if (Object.values(errors).every((error) => error === "")) {
      signup(role, formValues, { withCredentials: true })
        .then((data) => {
          console.log(data);
          if (data.email) {
            toast.success(data.message);
            navigate(`${USER.VERIFY}`);
          }
        })
        .catch((error) => {
          console.log("signup error", error.data.message);
          toast.error(error.response.data.message)
        });
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row items-start">
    <div className="w-full md:w-1/2 h-full object-cover bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
      <h1 className="text-4xl md:text-4xl text-white font-bold mt-20 mx-4">Transform Your Vision Into Reality</h1>
      <p className="text-xl md:text-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-transparent bg-clip-text font-normal mt-5 mx-4">Easily Connect, Plan, and Execute Your Ideas</p>
    </div>
    <div className="w-full md:w-1/2 mt-10 md:mt-0">
      <GoogleOAuthProvider clientId={clientid}>
        <Card className="w-full md:w-96 m-auto bg-dark" shadow={false}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="mt-10 rounded-none text-center"
          placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        <Typography variant="h4" color="black" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          User - Sign Up
        </Typography>
      </CardHeader>
      <form onSubmit={submitHandler}>
        <CardBody className="flex flex-col gap-4" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <Input
              label="Name"
              onChange={handleChange}
              value={formValues.name}
              name="name"
              size="md"
              crossOrigin={undefined}
              color="gray"
              className="bg-gray-200 bg-opacity-50" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          />
          {formErrors.name ? (
            <p
              className="text-sm"
              style={{ color: "red", marginBottom: -10, marginTop: -10 }}
            >
              {formErrors.name}
            </p>
          ) : null}
          <Input
              label="Email"
              size="md"
              onChange={handleChange}
              value={formValues.email}
              name="email"
              crossOrigin={undefined}
              color="gray"
              className="bg-gray-200 bg-opacity-50" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          />
          {formErrors.email ? (
            <p
              className="text-sm"
              style={{ color: "red", marginBottom: -10, marginTop: -10 }}
            >
              {formErrors.email}
            </p>
          ) : null}
          <Input
              label="Phone"
              onChange={handleChange}
              value={formValues.phone}
              name="phone"
              size="md"
              crossOrigin={undefined}
              color="gray"
              className="bg-gray-200 bg-opacity-50" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          />
          {formErrors.phone ? (
            <p
              className="text-sm"
              style={{ color: "red", marginBottom: -10, marginTop: -10 }}
            >
              {formErrors.phone}
            </p>
          ) : null}
          <Input
              label="Password"
              type="password"
              onChange={handleChange}
              value={formValues.password}
              name="password"
              size="md"
              crossOrigin={undefined}
              color="gray"
              className="bg-gray-200 bg-opacity-50" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          />
          {formErrors.password ? (
            <p
              className="text-sm"
              style={{ color: "red", marginBottom: -10, marginTop: -10 }}
            >
              {formErrors.password}
            </p>
          ) : null}
          <Input
              label="Confirm Password"
              type="password"
              size="md"
              crossOrigin={undefined}
              color="gray"
              onChange={handleChange}
              value={formValues.confirm_password}
              name="confirm_password"
              className="bg-gray-200 bg-opacity-50" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          />
          {formErrors.confirm_password ? (
            <p
              className="text-sm"
              style={{ color: "red", marginBottom: -10, marginTop: -10 }}
            >
              {formErrors.confirm_password}
            </p>
          ) : null}
          <Button
              variant="gradient"
              color="blue"
              fullWidth
              className="hover:shadow-lg transition-shadow duration-300"
              placeholder={undefined}
              type="submit"  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            Sign Up
          </Button>
        </CardBody>
      </form>
      {/* //GOOGLE Authentication */}
      <div id="signUpButton" className="flex justify-center mt-4">
              <GoogleLogin
              type="standard"
              theme="outline"
              shape="circle"
              size="large"
              text="signup_with"
              onSuccess={response => {
                gLogin("signup", response).then((data) => {
                  console.log(data)
                  if(data.message) {
                    toast.success(data.message);
                    navigate(`${USER.LOGIN}`);
                  }
                })
                .catch((error) => {
                  console.log("error", error)
                  toast.error("User already exists. Please signin")
                })
              }}
              />
            </div>
      <CardFooter className="pt-0" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Typography
            variant="small"
            className="mt-6 flex justify-center"
            color="black"
            placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          Already have an account?
          <Link to={USER.LOGIN}>
            <Typography
                as="a"
                href="#"
                variant="small"
                color="blue"
                className="ml-1 font-bold"
                placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
              Login
            </Typography>
          </Link>
        </Typography>
        <Typography
            variant="small"
            className="mt-3 flex justify-center"
            color="black"
            placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          Are you a vendor?
          <Link to={VENDOR.SIGNUP}>
            <Typography
                as="a"
                href="#signup"
                variant="small"
                color="blue"
                className="ml-1 font-bold"
                placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
              Signup here
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

export default UserSignup;
