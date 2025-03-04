import { useSelector } from 'react-redux';
import Breadcrumb from '../../../../components/vendor/Breadcrumbs/Breadcrumb';
import { useLocation } from 'react-router-dom';
import VendorRootState from '../../../../redux/rootstate/VendorState';
import { useEffect, useRef, useState } from 'react';
import { getVendor, verifyRequest } from '../../../../config/services/venderApi';
import { io, Socket } from 'socket.io-client';
import { Button } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import { VendorData } from '../../../../interfaces/vendorTypes';
import Layout from '../../../../layout/vendor/Layout';
import config from '../../../../config/envConfig';


const ViewProfile = () => {
  const vendorData = useSelector(
    (state: VendorRootState) => state.vendor.vendordata,
  );
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const [vendor, setVendor] = useState<VendorData>();
  const socket = useRef<Socket>();

  useEffect(() => {
    getVendor(vendorData?.id, { withCredentials: true })
      .then((response) => {
        setVendor((response.data.data));
        console.log(response.data);
      })
      .catch((error) => {
        console.log('here', error);
      });
  }, [id, vendorData]);

  useEffect(() => {
    const currentSocket = io(config.SOCKET_URL);
    socket.current = currentSocket;

    return () => {
      currentSocket.disconnect();
    };
  }, []);

  const handleVerification = async () => {

    socket.current?.emit("sendVerifyRequest", {
      vendorId: vendor?.id
    });

    verifyRequest(
        { vendorId: vendor?.id },
        { withCredentials: true },
      )
      .then((response) => {
        console.log(response.data);
        toast.success('Requested for Verification!');
        // Update the state to show "Pending" immediately
        setVendor((prevVendor) =>
          prevVendor
            ? { ...prevVendor, verificationRequest: !prevVendor.verificationRequest }
            : undefined
        );
      })
      .catch((error) => {
        console.log('here', error);
      });
  };

  return (
    <Layout>
      <Breadcrumb pageName="Profile" folderName="" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
       
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={vendor?.coverpicUrl?vendor?.coverpicUrl:"/imgs/vendor/default-cover.jpg"}
            alt="Cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
            {vendor?.isVerified?<svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className="absolute top-2 right-2 h-10 w-10"
        >
          <polygon
            fill="#fbc02d"
            points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
          ></polygon>
          <polygon
            fill="#6a0dad"
            points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
          ></polygon>
        </svg>:""}
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-16 h-40 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              <img
                src={vendor?.logoUrl?vendor?.logoUrl:"/imgs/vendor/logo-default.jpeg"}
                alt="Logo"
                className="rounded-full w-full h-30 object-cover"
              />
             
            </div>
          </div>
          <div className="relative z-30 mx-auto -mt-16  w-full mr-2 max-w-30 rounded-full  p-1 ">
            <div className="relative">
              {!vendor?.isVerified && !vendor?.verificationRequest ? (
                <Button
                  onClick={handleVerification}
                  color='blue'
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Request Verification
                </Button>
              ) : vendor?.verificationRequest ? (
                <Button
                  color="orange"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Pending
                </Button>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="mt-12">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {vendor?.name}
            </h3>
            <p className="font-medium">{vendor?.city}</p>
            <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-2 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  {vendor?.totalBooking}
                </span>
                <span className="text-sm">Bookings</span>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="font-semibold text-blue-400 dark:text-white">
                  {vendor?.isVerified?"Profile Verified":"Profile Not Verified"}
                </span>
                <span className="text-sm"></span>
              </div>
            </div>

            <div className="mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white">
                About
              </h4>
              <p className="mt-4.5">{vendor?.about}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewProfile;