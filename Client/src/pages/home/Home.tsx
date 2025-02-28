import {
  Button,
  Card,
  CardBody,
  Typography,
  CardHeader,
} from "@material-tailwind/react";
import Autosuggest from "react-autosuggest";
import Footer from "../../layout/user/footer";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import SubsribeCard from "../../components/home/SubsribeCard";
import { Link } from "react-router-dom";
import { USER } from "../../config/routes/user.routes";
import { VendorData } from "../../interfaces/vendorTypes";
import { useEffect, useState } from "react";
import {
  getVendors,
  getSuggestions,
  getVendorTypes,
} from "../../config/services/userApi";
import VendorTypeImages from "../../components/home/VendorTypeImages";

function Home() {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<VendorData[]>([]);
  const [vendorTypeData, setVendorTypeData] = useState([]);

  useEffect(() => {
    fetchVendors();
    window.scrollTo(0, 0);
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await getVendors({
        withCredentials: true,
      });

      const activeVendors = response.data.vendorData.filter(
        (vendor: VendorData) => vendor.isActive
      );

      console.log(response.data.vendorData);
      setVendors(activeVendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  useEffect(() => {
    const fetchVendorTypes = async () => {
      try {
        const response = await getVendorTypes();
        setVendorTypeData(response.data);
      } catch (error) {
        console.error("Error fetching vendor types:", error);
      }
    };
    fetchVendorTypes();
  }, []);

  // Autosuggest functions
  const fetchSuggestions = async (value: string) => {
    try {
      const response = await getSuggestions(value);
      setSuggestions(response.data.suggestions);
      console.log(response, value);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    fetchSuggestions(value);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative flex h-[60vh] md:h-screen items-center justify-center pt-16 pb-16 md:pb-32">
        <div className="absolute inset-0 bg-blue-900/90" />
        <div className="max-w-6xl container relative mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full text-center">
              <Typography
                variant="h1"
                color="white"
                className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Plan. Connect. Celebrate – Make Every Moment Remarkable with
                Viao
              </Typography>
              <Typography
                variant="lead"
                color="white"
                className="text-amber-500 text-sm md:text-lg lg:text-xl opacity-90"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Transform your vision into reality with Viao – where every
                detail paints the story of unforgettable memories.
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
                className="flex flex-col lg:flex-row justify-between items-center p-6"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <div className="flex flex-col lg:flex-row w-full lg:space-x-4">
                  {/* Input field with suggestions */}
                  <div className="w-full lg:w-4/5 relative">
                    <Autosuggest
                      suggestions={suggestions}
                      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                      onSuggestionsClearRequested={onSuggestionsClearRequested}
                      getSuggestionValue={(suggestion) => suggestion.name}
                      renderSuggestion={(suggestion) => (
                        <Link to={`${USER.VIEW_VENDOR}?id=${suggestion.id}`}>
                          <div className="p-2 hover:bg-gray-100 cursor-pointer flex items-center">
                            <img
                              src={suggestion.logoUrl}
                              className="w-8 h-8 mr-2"
                            />
                            <div>
                              <div className="font-medium">
                                {suggestion.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {suggestion.city}
                              </div>
                            </div>
                          </div>
                        </Link>
                      )}
                      inputProps={{
                        value: searchValue,
                        onChange: (_, { newValue }) => setSearchValue(newValue),
                        placeholder: "Search vendors...",
                        className:
                          "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                      }}
                    />
                  </div>

                  {/* Find Vendors button */}
                  <div className="w-full lg:w-1/5 mt-4 lg:mt-0">
                    <Link
                      to={
                        searchValue
                          ? `${USER.VENDORS}?search=${searchValue}`
                          : USER.VENDORS
                      }
                    >
                      <Button
                        className="w-full bg-orange-900 text-white p-4 rounded-lg hover:bg-orange-800 transition-colors"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Find Vendors
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <Typography
          variant="h2"
          className="text-center mb-8 text-2xl md:text-3xl font-bold"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Popular Vendor Categories
        </Typography>
        <VendorTypeImages vendorTypeData={vendorTypeData} />
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
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Comprehensive Solutions
                    </Typography>
                    <Typography
                      className="font-normal text-blue-gray-500"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Discover personalized services designed to bring your
                      unique vision to life. From vendor coordination to
                      seamless logistics, our experts ensure every detail is
                      managed, so you can enjoy a stress-free experience.
                    </Typography>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Vendors */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <h2 className="text-center mb-6 md:mb-10 text-2xl font-bold">
          Top Rated Vendors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {vendors?.slice(0, 6).map((vendor, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Link to={`${USER.VIEW_VENDOR}?id=${vendor?.id}`}>
                <CardHeader
                  floated={false}
                  className="h-40 md:h-48"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <img
                    src={vendor.coverpicUrl || "/imgs/vendor/default-cover.jpg"}
                    className="w-full h-full object-cover"
                    alt={vendor.name}
                  />
                </CardHeader>
              </Link>
              <CardBody
                className="p-4 md:p-6"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Typography
                  variant="h5"
                  className="mb-2 text-lg md:text-xl"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {vendor.name}
                </Typography>
                <Typography
                  className="text-gray-600 text-sm md:text-base"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {vendor.city}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link to={USER.VENDORS}>
            <Button
              variant="text"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              View More
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <Typography
            variant="h2"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            How It Works
          </Typography>
          <Typography
            variant="lead"
            className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Simple steps to turn your vision into reality. From discovery to
            celebration, we’ve got you covered.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Step 1: Discover */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 md:p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Discover
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Explore a curated list of vendors and services tailored to your
                needs. Filter by location, budget, and category to find the
                perfect match.
              </p>
            </div>
          </div>

          {/* Step 2: Collaborate */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 md:p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
            <div className="relative">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Collaborate
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Connect directly with vendors to discuss your needs, finalize
                details, and ensure everything aligns with your expectations.
              </p>
            </div>
          </div>

          {/* Step 3: Organize */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 md:p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-orange-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
            <div className="relative">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Organize
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Keep your planning on track with tools to manage bookings,
                schedules, and budgets effortlessly. Turn your dream event into
                reality with ease.
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