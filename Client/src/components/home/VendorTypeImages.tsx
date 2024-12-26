import { Button, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getVendorTypes } from "../../config/services/userApi";


const VendorTypeImages = () => {
  const [vendorTypeData, setVendorTypeData] = useState([]);

  useEffect(()=>{
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
    fetchVendorTypes()
  })
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {vendorTypeData.map(({ imageUrl, type }) => (
          <div key={type} className="text-center">
            <img
              className="h-32 w-32 lg:h-40 lg:w-40 rounded-full object-cover mx-auto"
              src={imageUrl}
              alt={type}
            />
            <Typography
              variant="h6"
              color="black"
              className="mt-2 text-center text-sm sm:text-base lg:text-lg"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {type}
            </Typography>
          </div>
        ))}
      </div>
      {vendorTypeData.length > 4 && (
        <div className="flex justify-center items-center mt-10">
          <Button
            variant="outlined"
            color="blue"
            size="lg"
            className="mr-3 mt-5 text-center"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            View More Images
          </Button>
        </div>
      )}
    </div>
  );
};

export default VendorTypeImages;