import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { Toaster } from 'react-hot-toast';
import VendorSignupForm from './auth/Signup';
import VendorLoginForm from './auth/Login';
import VendorPrivateRoute from './VendorPrivateRoute';
import Dashboard from './Dashboard';
import VerifyEmail from '../common/VerifyEmail';
import ResetPassword from '../common/ResetPassword';
import ForgotPassword from '../common/ForgotPassword';
import { ToastContainer } from 'react-toastify';




function VendorApp() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <ToastContainer />
      <Toaster />
      <Routes>
      <Route
          path="/signup"
          element={
            <>
              <VendorSignupForm />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              
              <VendorLoginForm />
            </>
          }
        />
         <Route
          path="/verify"
          element={
            <>
              
              <VerifyEmail/>
            </>
          }
        />
          <Route
          path="/reset-password"
          element={
            <>
              
              <ResetPassword/>
            </>
          }
        />
          <Route
          path="/forgot-password"
          element={
            <>
              
              <ForgotPassword/>
            </>
          }
        />
            <Route path="" element={<VendorPrivateRoute />}>
            <Route
          
          path="/dashboard"
          element={
            <>

              <Dashboard />
            </>
          }
        />
        
     
     </Route>
      </Routes>
    </>
  );
}

export default VendorApp;
