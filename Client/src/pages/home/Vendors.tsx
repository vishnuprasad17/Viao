
import { Card, CardBody, Typography } from "@material-tailwind/react";
import VendorFilters from "../../components/home/vendors/VendorFilter";
import VendorCard from "../../components/home/vendors/VendorCard";
import Footer from "../../layout/user/footer";
import { useEffect, useState } from "react";
import { getAllVendors, getLocations, getVendorTypes } from "../../config/services/userApi";
import { VendorData } from "../../interfaces/vendorTypes";
import Pagination from "../../components/common/Pagination";

const VendorsList = () => {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [vendorTypeData, setVendorTypeData] = useState([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string[]>([]);
  const [selectLocation, setSelectLocation] = useState<string[]>([]);
  const [sort, setSort] = useState<number>();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get("search");
    const pageParam = queryParams.get("page");
    setPage(pageParam ? parseInt(pageParam, 10) : 1);
    fetchVendors();
    fetchVendorTypes();
    if (searchParam) {
      setSearch(searchParam); // Update search state if a search parameter is found
    }
  }, [location.search]);

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])

  useEffect(() => {
    fetchVendors();
  }, [category, search, selectLocation, sort, page]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getLocations({
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.locations);
        setLocations(res.data.locations);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await getAllVendors(
        search, currentPage, category, selectLocation, sort,
        {
          withCredentials: true,
        }
      );

      console.log(response.data.vendorData);
      setVendors(response.data.vendorData);
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const fetchVendorTypes = async () => {
    try {
      const response = await getVendorTypes({
        withCredentials: true,
      });
      setVendorTypeData(response.data);
    } catch (error) {
      console.error("Error fetching vendor types:", error);
    }
  };


  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-start lg:pt-16 pt-6 pb-20 mb-0">
      <div className="absolute top-0 h-100 w-full bg-cover bg-top transform scale-x-[-1]"
      style={{ background: 'linear-gradient(90deg, rgb(196, 70, 255) -14.33%, rgb(120, 1, 251) 38.59%, rgb(62, 0, 130) 98.88%)' }} />

        <div className="absolute top-0 h-100 w-full bg-black/30 bg-cover bg-center" />
        <Card
          className="mt-6 m-6 lg:justify-start"
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
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              "Curate your perfect day with exceptional vendors. Your journey
              starts here!"
            </Typography>
          </CardBody>
        </Card>
      </div>
      <section className="mx-20 -mt-15 mb-20">
        <div className="flex justify-end gap-6 md:flex-row flex-col mb-10 mr-5">
          <div className="flex items-center text-blue-500 font-bold gap-2">
            <h3>Found {vendors.length} Vendors</h3>
          </div>

          <div className="relative flex w-full gap-2 md:w-max">
            <input
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors..."
              className="px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          {/* <h3>Sort By:</h3>
          <div>
            <VendorSort setSort={setSort} />
          </div> */}
        </div>
        <div className="flex md:flex-row flex-col">
          <div>
            <h3 className="-mt-10 mb-5">Filter By</h3>
            <VendorFilters
              vendorTypeData={vendorTypeData}
              locations={locations}
              setSelectLocation={setSelectLocation}
              setCategory={setCategory}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5 md:ml-10">
            {vendors.map((vendor, index) => (
              <div key={index} className="w-full">
                <VendorCard {...vendor} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* pagination */}
      {vendors.length > 0 && (
         <Pagination
         currentPage={currentPage}
         totalPages={totalPages!}
         handlePageChange={handlePageChange}
         isTable={false}
       />
      )}
 
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
};

export default VendorsList;
