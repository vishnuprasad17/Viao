import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../config/services/authApi";
import { useSelector, useDispatch } from "react-redux";
import { setAdminInfo } from "../../../redux/slices/AdminSlice";
import AdminRootState from "../../../redux/rootstate/AdminState";
import { validate } from "../../../validations/common/loginVal";
import { ADMIN } from "../../../config/routes/admin.routes";
import { useFormik } from "formik";
import { toast } from "react-toastify";

interface FormValues {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: "",
  password: "",
};

const AdminLogin = () => {
  const admin = useSelector(
    (state: AdminRootState) => state.admin.isAdminSignedIn
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = "admin";

  useEffect(() => {
    if (admin) {
      navigate(`${ADMIN.DASHBOARD}`);
    }
  }, []);

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      login(role, values)
        .then((data) => {
          console.log(data);


          console.log(data.adminData);

          dispatch(setAdminInfo(data.adminData));
          toast.success(data.message);
          navigate(`${ADMIN.DASHBOARD}`);
        })
        .catch((error) => {
          toast.error(error.response?.data?.message);
          console.log("here", error);
        });
    },
  });

  return (
    <>
      <img
        src="/imgs/wave.png"
        className="fixed hidden lg:block inset-0 h-full"
        style={{ zIndex: -1 }}
      />
      <div className="h-screen flex flex-col justify-center items-center lg:grid lg:grid-cols-2">
      <img
          src="/imgs/login-side-image.svg"
          className="hidden lg:block w-1/2 hover:scale-150 transition-all duration-500 transform mx-300"
        />
        <Card
          className="bg-gradient-to-br from-purple-100 via-blue-50 to-teal-100 flex flex-col justify-center items-center lg:w-1/2 lg:ml-0 -ml-50"
          placeholder={undefined}
          shadow={false}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="mt-10 rounded-none text-center"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
              <img
          src="/imgs/login-avatar.jpeg"
          className="w-25 rounded-full mx-auto"
          alt="Login Avatar"
        />
            <Typography
              variant="h4"
              color="black"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >

              Admin - Login
            </Typography>
          </CardHeader>
          <form onSubmit={formik.handleSubmit} className="flex flex-col justify-center items-center">
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
                color="black"
                className="bg-white bg-opacity-50"
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
                color="black"
                className="bg-white bg-opacity-50"
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
                  style={{ color: "red", marginBottom: -10, marginTop: -10 }}
                >
                  {formik.errors.password}
                </p>
              ) : null}
              <Button
                fullWidth
                placeholder={undefined}
                type="submit"
                className="bg-gray-900"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Login
              </Button>
            </CardBody>
          </form>
        </Card>
      </div>

    
    </>
  );
};

export default AdminLogin;