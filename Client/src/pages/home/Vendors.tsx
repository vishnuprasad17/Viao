import { useEffect, useState } from "react";
import { Card, Typography, CardBody } from "@material-tailwind/react";
import { debounce } from "lodash";
import { useLocation } from "react-router-dom";
import {
  getAllVendors,
  getLocations,
  getVendorTypes,
} from "../../config/services/userApi";
import VendorFilters from "../../components/home/vendors/VendorFilter";
import VendorCard from "../../components/home/vendors/VendorCard";
import Pagination from "../../components/common/Pagination";
import Footer from "../../layout/user/footer";
import { VendorData } from "../../interfaces/vendorTypes";
import VendorSort from "../../components/home/vendors/VendorSort";

const VendorsList = () => {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [vendorTypeData, setVendorTypeData] = useState([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState<string[]>([]);
  const [selectLocation, setSelectLocation] = useState<string[]>([]);
  const [sort, setSort] = useState<number>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Debounced search function
  const debouncedSearch = debounce(async (searchValue: string) => {
    try {
      const response = await getAllVendors(
        searchValue,
        currentPage,
        category,
        selectLocation,
        sort
      );
      setVendors(response.data.vendorData);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error searching vendors:", error);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(search);
    return () => debouncedSearch.cancel();
  }, [search, currentPage, category, selectLocation, sort]);

  useEffect(() => {
    fetchLocations();
    fetchVendorTypes();
  }, [category, selectLocation]);

  const fetchLocations = async () => {
    try {
      const response = await getLocations();
      setLocations(response.data.locations);
    } catch (error) {
      console.error("Error fetching vendor types:", error);
    }
  };

  const fetchVendorTypes = async () => {
    try {
      const response = await getVendorTypes();
      setVendorTypeData(response.data);
    } catch (error) {
      console.error("Error fetching vendor types:", error);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative flex h-96 items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-800">
        <div className="absolute inset-0 bg-black/30" />
        <Card
          className="w-full max-w-2xl mx-4 shadow-lg"
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
              variant="h2"
              className="text-2xl md:text-3xl font-bold text-center text-blue-900"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Curate your perfect day with exceptional vendors.
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
  {/* Search and Filters */}
  <div className="flex flex-col md:flex-row gap-6 mb-6">
    {/* Filters Section (Left Sidebar) */}
    <div className="w-full md:w-64 lg:w-72">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Filter By</h3>
      <VendorFilters
        vendorTypeData={vendorTypeData}
        locations={locations}
        setSelectLocation={setSelectLocation}
        setCategory={setCategory}
      />
    </div>

    {/* Main Content Area */}
    <div className="flex-1">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
  {/* Search Input */}
  <div className="flex-1">
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search vendors..."
      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
    />
  </div>

  {/* Sort Dropdown */}
  <div className="w-full sm:w-48">
    <VendorSort setSort={setSort} />
  </div>
</div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((vendor, index) => (
          <VendorCard key={index} {...vendor} />
        ))}
      </div>

      {/* Pagination */}
      {vendors.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            isTable={false}
          />
        </div>
      )}
    </div>
  </div>
</section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default VendorsList;