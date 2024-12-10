
import { Card, CardBody, Typography } from "@material-tailwind/react";

import Footer from "../../layout/user/footer";

const VendorsList = () => {

  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-start lg:pt-16 pt-6 pb-20 mb-0">
      <div className="absolute top-0 h-100 w-full bg-orange-300 bg-cover bg-top transform scale-x-[-1]" />

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
              Vendors Page - Vendors search, filter, sort etc.
            </Typography>
          </CardBody>
        </Card>
      </div>
        <Footer />
    </>
  );
};

export default VendorsList;
