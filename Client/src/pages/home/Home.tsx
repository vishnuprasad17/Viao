import {
  Button,
  Card,
  CardBody,
  Typography,
  CardHeader,
  Input,
} from "@material-tailwind/react";
import Footer from "../../layout/user/footer";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import SubsribeCard from "../../components/home/SubsribeCard";
import { Link } from "react-router-dom";
import { USER } from "../../config/routes/user.routes";
import { VendorData } from "../../interfaces/vendorTypes";
import { useEffect, useState } from "react";
import { getVendors } from "../../config/services/userApi";
import VendorTypeImages from "../../components/home/VendorTypeImages";


function Home() {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchVendors();
    window.scrollTo(0, 0);
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await getVendors(
        {
          withCredentials: true,
        }
      );

      const activeVendors = response.data.vendorData.filter(
        (vendor: VendorData) => vendor.isActive
      );

      console.log(response.data.vendorData);
      setVendors(activeVendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };
 

  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32 m-0">
        <div className="absolute top-0 h-full w-full bg-blue-700 bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography
                variant="h1"
                color="white"
                className="mb-6 font-black text-4xl lg:text-5xl" // Adjust font size for different screen sizes
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Plan. Connect. Celebrate – Make Every Moment Remarkable with Viao
              </Typography>
              <Typography
                variant="lead"
                color="white"
                className="opacity-80 text-sm text-amber-500 lg:text-2xl"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Transform your vision into reality with Viao – where every detail paints the story of unforgettable memories.
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <section className="-mt-20 bg-white px-4 pb-20 pt-4">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1 lg:mx-30">
      <Card
        className="mt-6 w-full"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <CardBody
          className="flex flex-col lg:flex-row justify-between items-center"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="flex flex-col lg:flex-row w-full lg:space-x-4">
            {/* Input field covers 100% in small screens and 80% in large screens */}
            <div className="w-full lg:w-4/5">
              <Input
                label="Search"
                size="lg"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                crossOrigin={undefined}
              />
            </div>

            {/* "Find Vendors" button covers 100% in small screens and 20% in large screens */}
            <div className="w-full lg:w-1/5 mt-4 lg:mt-0">
            <Link
                to={
                  search?.length > 0
                    ? `${USER.VENDORS}?search=${search}`
                    : `${USER.VENDORS}`
                }
              >
                <Button
                  className="w-full bg-black"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Get Vendors
                </Button>
                </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  </div>
</section>


     <section className="mt-10 mx-20 text-center">
        <h1
          style={{ fontFamily: "playfair display", fontSize: "30px" }}
          className="text-center mb-20"
        >
          VENDOR &nbsp;TYPES &nbsp;
        </h1>
      <VendorTypeImages/>
      </section>

     <section>
     <div className="flex flex-wrap items-start w-full h-full bg-blue-900 bg-cover bg-center mt-32 mb-20">
    {/* This div is centered for smaller screens and remains at the same location for larger screens */}
    <div className="w-full lg:w-8/12 md:w-5/12 px-4 md:px-20 lg:px-20 md:mt-8 lg:mt-0 p-20">
      <div className="flex justify-center">
        {/* Ensure the card is centered on smaller screens */}
        <div className="w-full md:w-auto lg:w-[600px]">
          <Card
            className="shadow-lg border shadow-gray-500/10 rounded-lg mx-auto lg:mx-0"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <CardBody
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Services
              </Typography>
              <Typography
                      variant="h5"
                      color="blue-gray"
                      className="mb-3 mt-2 font-bold"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}  onPointerLeaveCapture={undefined}              >
                Comprehensive Solutions
              </Typography>
              <Typography
                className="font-normal text-blue-gray-500"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Discover personalized services designed to bring your unique vision to life. From vendor coordination to seamless logistics, our experts ensure every detail is managed, so you can enjoy a stress-free experience.
              </Typography>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="mt-30 mx-10 items-center">
        <h1
          style={{ fontFamily: "playfair display", fontSize: "30px" }}
          className="text-center mb-10"
        >
          TOP &nbsp;RATED &nbsp;VENDORS
        </h1>
        <div className="flex flex-wrap items-center w-full">
          <div className="mx-auto md:m-10 sm:m-5 px-4 sm:grid sm:grid-cols-2 grid-cols-4 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {vendors?.slice(0,9).map((vendor, index) =>(
              
              <Card
                key={index}
                className="shadow-lg  shadow-gray-500/10 rounded-lg w-full mb-2"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Link to={`${USER.VIEW_VENDOR}?id=${vendor?._id}`}>
                  <CardHeader
                    floated={false}
                    className="relative h-56"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <img
                      alt="Card Image"
                      src={vendor.coverpicUrl?vendor.coverpicUrl:"/imgs/vendor/default-cover.jpg.jpg"}
                      className="h-full w-full"
                    />
                  </CardHeader>
                </Link>
                <CardBody
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
             
                    {vendor.city}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-3 mt-2 font-bold"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                      <Link to={`${USER.VIEW_VENDOR}?id=${vendor?._id}`}>
                           {vendor.name}
                           </Link>
                  </Typography>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="flex items-end justify-end mr-25 mt-10">
      <Link to={USER.VENDORS}>
          <Button
            variant="text"
            size="lg"
            className="flex items-end bg-gray text-blue-900 justify-end gap-2 mb-10 mt-4"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <ArrowRightIcon className="h-5 w-5 font-bold text-light-blue-900" />
            VIEW MORE
          </Button>
        </Link>
      </div>

      <section className="mt-12 md:mt-20">
        <div className="flex flex-wrap items-start justify-center w-full h-80 bg-blue-900 bg-cover bg-center md:px-5">
          {/* Content goes here */}
        </div>
      </section>

      <section className="-mt-20 mb-20 mx-4 md:mx-30 md:-mt-40">
        <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-2xl">
          <h1
            style={{ fontFamily: "playfair display", fontSize: "30px" }}
            className="mt-10 text-center sm:p-4"
          >
            HOW &nbsp;IT &nbsp;WORKS
          </h1>
          <div className="flex flex-wrap justify-center m-10 gap-8">
            <div className="w-full md:w-1/4">
              <h2
                style={{ fontFamily: "playfair display", fontSize: "20px" }}
                className="text-center mb-4 text-brown"
              >
                Discover
              </h2>
              <p style={{ fontSize: "14px" }}>
              Explore a curated list of vendors and services designed to bring your vision to life. Filter by location, budget, and category to find the perfect match.
              </p>
            </div>
            <div className="w-full md:w-1/4">
              <h2
                style={{ fontFamily: "playfair display", fontSize: "20px" }}
                className="text-center mb-4 text-brown"
              >
                Collaborate
              </h2>
              <p style={{ fontSize: "14px" }}>
              Connect directly with vendors to discuss your needs, finalize details, and ensure everything aligns with your expectations.
              </p>
            </div>
            <div className="w-full md:w-1/4">
              <h2
                style={{ fontFamily: "playfair display", fontSize: "20px" }}
                className="text-center mb-4 text-brown"
              >
                Organize
              </h2>
              <p style={{ fontSize: "14px" }}>
               Keep your planning on track with tools to manage bookings, schedules, and budgets effortlessly. Turn your dream event into reality with ease.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-40">
        <SubsribeCard />
      </section>
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
}

export default Home;
