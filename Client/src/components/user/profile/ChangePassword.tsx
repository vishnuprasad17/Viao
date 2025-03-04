import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { validate } from "../../../validations/common/changePwdValidation";
import { changePwd } from "../../../config/services/userApi";
import { useState } from "react";
import { USER } from "../../../config/routes/user.routes";
import UserRootState from "../../../redux/rootstate/UserState";
import { useSelector } from "react-redux";

interface FormValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const initialValues: FormValues = {
  current_password:"",
  new_password: "",
  confirm_password: "",
 
};



const ChangePassword = () => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState<FormValues>(initialValues);
  
  const navigate = useNavigate();

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
      changePwd(user?.id, formValues,{withCredentials:true})
        .then((response) => {
          console.log(response);
          toast.success("Password updated Successfully!")
          setFormValues(initialValues);
          setFormErrors(initialValues);
          navigate(`${USER.PROFILE}`);
        })
        .catch((error) => {
          // localStorage.removeItem("userToken");
          toast.error(error.response.data.message)
          console.log("here", error);
        });
    }
  };

  return (
    <Card
      className="w-96 mx-auto m-auto"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}

    >
      <form onSubmit={submitHandler}>
      <CardBody
        className="flex flex-col gap-4"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
         <Typography variant="h4" className="text-center" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Change Password
        </Typography>
        <Input
        type="password"
         color="black"
        variant="standard"
          label="Current Password"
          size="md"
          name="current_password"
          onChange={handleChange}
          value={formValues.current_password}
          crossOrigin={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
         {formErrors.current_password ? <p className="text-sm" style={{color:"red",marginBottom:-10,marginTop:-10}}>{formErrors.current_password}</p> : null}
        <Input
        type="password"
        color="black"
        variant="standard"
         label="New Password"
         size="md"
         name="new_password"
         onChange={handleChange}
          value={formValues.new_password}
          crossOrigin={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
         {formErrors.new_password ? <p className="text-sm" style={{color:"red",marginBottom:-10,marginTop:-10}}>{formErrors.new_password}</p> : null}
        <Input
        type="password"
         color="black"
        variant="standard"
         label="Confirm Password"
         size="md"
         name="confirm_password"
         onChange={handleChange}
          value={formValues.confirm_password}
          crossOrigin={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
         {formErrors.confirm_password ? <p className="text-sm" style={{color:"red",marginBottom:-10,marginTop:-10}}>{formErrors.confirm_password}</p> : null}
         <Button
        
        variant="gradient"
        color="blue"
        className="justify-center"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        type="submit"
      >
        Update Password
      </Button>
      
      </CardBody>
    
      </form>
     
    </Card>
  );
};


export default ChangePassword