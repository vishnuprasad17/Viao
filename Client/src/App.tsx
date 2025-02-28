import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarComponent from "./layout/user/navbar";
import UserLogin from "./pages/user/auth/Login";
import UserSignup from "./pages/user/auth/Signup";
import Home from "./pages/home/Home";
import VendorProfile from "./pages/home/SingleVendor";
import UserPrivateRoute from "./pages/user/UserPrivateRoute";
import VendorsList from "./pages/home/Vendors";
import Profile from "./pages/user/profile/Profile";
import BookingForm from "./pages/home/BookingForm";
import PaymentSuccess from "./pages/home/PaymentSuccess";
import VerifyEmail from "./pages/common/VerifyEmail";
import ForgotPassword from "./pages/common/ForgotPassword";
import ResetPassword from "./pages/common/ResetPassword";
import Chat from "./pages/user/profile/Chat";
import { USER } from "./config/routes/user.routes";
import { VENDOR } from "./config/routes/vendor.routes";
import { Toaster } from "react-hot-toast";
import About from "./pages/home/About";
import Contact from "./pages/home/Contact";
import Loader from "./components/common/Loader";
import ScrollToTopButton from "./components/home/ScrollToTopBtn";


const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) :(
    <>
      <Toaster />
      <ToastContainer />
      {!(
        pathname == USER.LOGIN ||
        pathname == USER.SIGNUP ||
        pathname == USER.VERIFY ||
        pathname == VENDOR.VERIFY ||
        pathname.includes(USER.FORGOT_PWD) ||
        pathname.includes(USER.RESET_PWD)||
        pathname.includes(USER.PROFILE)
      ) && (
        <div className="fixed top-0 left-0 w-full z-10">
          <NavbarComponent />
        </div>
      )}
     
        <Routes>
        
          <Route path={USER.HOME} element={<Home />} />
          <Route path={USER.LOGIN} element={<UserLogin />} />
          <Route path={USER.VERIFY} element={<VerifyEmail />} />
          <Route path={USER.FORGOT_PWD} element={<ForgotPassword />} />
          <Route path={USER.RESET_PWD} element={<ResetPassword />} />
          <Route path={USER.SIGNUP} element={<UserSignup />} />
          <Route path={USER.VENDORS} element={<VendorsList />} />
          <Route path={USER.ABOUT} element={<About/>} />
          <Route path={USER.CONTACT} element={<Contact/>} />
          <Route path="" element={<UserPrivateRoute />}>
            <Route path={USER.VIEW_VENDOR} element={<VendorProfile />} />
            <Route path={`${USER.PROFILE}/*`} element={<Profile />} />
            <Route path={USER.BOOK_EVENT} element={<BookingForm />} />
            <Route path={USER.PAYMENT_SUCCESS} element={<PaymentSuccess />} />
            <Route path={USER.CHAT} element={<Chat />} />
          </Route>
         
        </Routes>
        
        
    <ScrollToTopButton/>
        
   
    </>
  );
};

export default App;