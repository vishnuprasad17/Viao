import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <hr className="my-6 border-gray-300 mx-10" />

      <footer className="relative px-4 pt-8 pb-6 ml-10 mr-10">
        <div className="container mx-auto">
          <div className="flex flex-wrap pt-6 text-center lg:text-left">
            {/* Left Section */}
            <div className="w-full px-4 lg:w-6/12">
              <Typography
                variant="h4"
                className="mb-4"
                color="blue-gray"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Viao
              </Typography>
              <Link to="/">
                <Typography
                  className="font-normal text-blue-gray-500 lg:w-2/5"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Home
                </Typography>
              </Link>
              <Link to="/vendors">
                <Typography
                  className="font-normal text-blue-gray-500 lg:w-2/5"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Vendors
                </Typography>
              </Link>
              <Link to="/about">
                <Typography
                  className="font-normal text-blue-gray-500 lg:w-2/5"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  About
                </Typography>
              </Link>
            </div>

            {/* Right Section */}
            <div className="mx-auto mt-12 grid w-max grid-cols-2 gap-24 lg:mt-0">
              {/* Menu Section */}
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 block font-bold uppercase"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Start Planning
                </Typography>
                <ul className="mt-3">
                  <li>
                    <Link to="/vendors">
                      <Typography
                        as="a"
                        target="_blank"
                        rel="noreferrer"
                        variant="small"
                        className="mb-2 block font-normal text-blue-gray-500 hover:text-blue-gray-700"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Search by Vendor
                      </Typography>
                    </Link>
                  </li>
                  <li>
                    <Link to="/vendors">
                      <Typography
                        as="a"
                        target="_blank"
                        rel="noreferrer"
                        variant="small"
                        className="mb-2 block font-normal text-blue-gray-500 hover:text-blue-gray-700"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Search by City
                      </Typography>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Additional Section */}
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 block font-bold uppercase"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Services
                </Typography>
                <ul className="mt-3">
                  <li>
                    <Typography
                      as="a"
                      target="_blank"
                      rel="noreferrer"
                      variant="small"
                      className="mb-2 block font-normal text-blue-gray-500 hover:text-blue-gray-700"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Service 1
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      as="a"
                      target="_blank"
                      rel="noreferrer"
                      variant="small"
                      className="mb-2 block font-normal text-blue-gray-500 hover:text-blue-gray-700"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Service 2
                    </Typography>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-300" />
          <div className="flex flex-wrap items-center justify-center md:justify-between">
            <div className="mx-auto w-full px-4 text-center">
              <Typography
                variant="small"
                className="font-normal text-blue-gray-500"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Copyright © {year} Viao.
              </Typography>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;