import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { VendorData } from "../../../interfaces/vendorTypes";

const VendorCard: React.FC<VendorData> = ({
  name,
  city,
  id,
  coverpicUrl,
  totalRating,
}) => {
  return (
    <Card
      className="w-full h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <CardHeader
        floated={false}
        className="h-48 overflow-hidden rounded-t-xl"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <img
          src={coverpicUrl || "/imgs/vendor/default-cover.jpg"}
          alt="vendor cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/60" />
      </CardHeader>

      <CardBody
        className="flex-1"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="mb-2 flex items-center justify-between">
          <Typography
            variant="h5"
            className="font-medium truncate max-w-[70%]"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {name}
          </Typography>
          <div className="flex items-center gap-1.5 text-orange-900 font-semibold">
            <span>{totalRating || 0}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <Typography
          color="gray"
          className="truncate"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {city}
        </Typography>
      </CardBody>

      <CardFooter
        className="pt-3"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Link to={`/view-vendor?id=${id}`}>
          <Button
            size="sm"
            fullWidth={true}
            className="bg-blue-800 hover:bg-blue-900"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VendorCard;