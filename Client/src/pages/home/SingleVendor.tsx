import { Avatar, Typography, Button } from "@material-tailwind/react";
import Footer from "../../layout/user/footer";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getVendor,
  getVendorServices,
  checkIfUserReviewed,
} from "../../config/services/userApi";
import VendorTabs from "../../components/home/VendorProfile/VendorTabs";
import UserRootState from "../../redux/rootstate/UserState";
import { useSelector } from "react-redux";
import ProfileButtons from "../../components/home/VendorProfile/ProfileButtons";
import AddReview from "../../components/home/VendorProfile/AddReview";
import { VendorData } from "../../interfaces/vendorTypes";
import { Service } from "../../interfaces/commonTypes";

export function VendorProfile() {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id") || "";
  const [vendor, setVendor] = useState<VendorData>();
  const [services, setServices] = useState<Service[]>([]);
  const [favourite, setFavourite] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getVendor(id);
        setVendor(response.data.data);

        const res = await getVendorServices(id);
        setServices(res.data.services);

        // Check if user has already reviewed this vendor
        if (user?.id && id) {
          const response = await checkIfUserReviewed(user.id, id);
          setHasReviewed(response.data.hasReviewed);
        }

        if (user?.favourite?.includes(id)) {
          setFavourite(true);
        } else {
          setFavourite(false);
        }

        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user, id, hasReviewed]);

  const handleFavouriteToggle = () => {
    setFavourite((prev) => !prev);
  };

  return (
    <>
      <section className="relative block h-[80vh] lg:h-[100vh] overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full scale-105"
          style={{
            backgroundImage: `url(${vendor?.coverpicUrl || "/imgs/vendor/default-cover.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute top-0 h-full w-full bg-black/30 bg-cover" />
      </section>
      <section className="relative bg-white">
        <div className="relative -mt-40 flex w-full min-w-0 flex-col break-words bg-white px-5">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="relative flex gap-6 items-start">
                <div className="flex justify-center lg:justify-start lg:ml-20 lg:-mt-20 xsm:ml-10 ml-5 -mt-10">
                  <Avatar
                    src={vendor?.logoUrl || "/imgs/vendor/logo-default.jpeg"}
                    alt="logo"
                    variant="circular"
                    className="h-26 w-26 sm:h-20 sm:w-30 lg:h-40 lg:w-40"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <div className="flex items-center gap-2 mt-2">
                    <Typography
                      variant="h4"
                      color="blue-gray"
                      className="flex-1"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {vendor?.name}
                    </Typography>
                    {vendor?.isVerified && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        className="h-7 w-7"
                      >
                        <polygon
                          fill="#fbc02d"
                          points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
                        ></polygon>
                        <polygon
                          fill="#6a0dad"
                          points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
                        ></polygon>
                      </svg>
                    )}
                  </div>

                  <Typography
                    variant="paragraph"
                    color="gray"
                    className="!mt-0 font-normal"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {vendor?.email}
                  </Typography>
                </div>
              </div>

              <div className="mt-10 mb-10 flex lg:flex-col md:flex-row flex-col justify-between items-center lg:justify-end lg:mb-0 lg:px-4 flex-wrap lg:-mt-5">
                {/* Rating Button */}
                <div className="flex gap-2">
                  <Button
                    className="w-fit rounded-full"
                    color="deep-purple"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <i className="fa-solid fa-star mr-1 text-yellow-700"></i>
                    {vendor?.totalRating}
                  </Button>
                </div>

                {/* Profile Buttons */}
                <ProfileButtons
                  vendorId={vendor?.id}
                  userId={user?.id}
                  isNotVerified={vendor && !vendor?.isVerified}
                  isFavourite={favourite}
                  onFavouriteToggle={handleFavouriteToggle}
                />
              </div>
            </div>
            <div className="-mt-4 lg:pl-20 container space-y-2">
              {vendor && !vendor.isVerified && (
                <div className="mx-5 my-4 mb-6 p-4 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <Typography
                        variant="h6"
                        className="text-red-700 font-semibold mb-1"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Verification Required
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-red-600/90 leading-relaxed"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        This vendor is not yet verified. Bookings cannot be made
                        at this time. Please check back later or contact support
                        for assistance.
                      </Typography>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 mx-5">
                <i className="fa-solid fa-map-location text-red-500" />
                <Typography
                  className="font-medium text-blue-gray-800"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {vendor?.city}
                </Typography>
              </div>
            </div>
            <div className="mb-2 py-6 lg:pl-20 mx-5">
              <div className="flex w-full flex-col items-start lg:w-1/2">
                <Typography
                  className="mb-6 font-normal text-blue-gray-500"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {vendor?.about}
                </Typography>
              </div>
            </div>
            <div className="mx-5 sm:mx-10 md:mx-10 lg:mx-24 mb-15">
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-4"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Offered Services
              </Typography>
              {services.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="px-2 py-1 bg-gray-50 rounded-full hover:bg-purple-50 transition-colors duration-200 border border-gray-200 hover:border-purple-200"
                    >
                      <div className="flex items-center justify-between gap-1 truncate">
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-medium truncate text-sm"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {service.name}
                        </Typography>
                        <Typography
                          variant="small"
                          color="deep-purple"
                          className="font-semibold shrink-0 text-sm"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          ₹{service.price}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Typography
                  variant="small"
                  color="gray"
                  className="font-normal"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  No services currently available
                </Typography>
              )}
            </div>
          </div>
        </div>
      </section>
      <section>
        <VendorTabs
          refreshKey={refreshKey}
          onRefresh={() => setRefreshKey((prev) => prev + 1)}
        />
      </section>
      {/* Conditionally render AddReview */}
      {vendor && vendor.isVerified && !hasReviewed && (
        <section className="mb-20">
          <AddReview
            id={vendor?.id}
            hasReviewed={hasReviewed}
            onSuccess={() => {
              setHasReviewed(true);
              setRefreshKey((prev) => prev + 1);
            }}
          />
        </section>
      )}
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
}

export default VendorProfile;