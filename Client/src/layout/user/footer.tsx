import { Typography } from "@material-tailwind/react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0c172f] text-white py-10 px-6">
      <div className="container mx-auto">
        {/* Top Section */}
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand Section */}
          <div className="w-full md:w-1/2">
            <Typography
              variant="h5"
              color="white"
              className="mb-4"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Viao
            </Typography>
            <Typography
              variant="paragraph"
              color="gray"
              className="text-gray-400"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Viao is a website that connects you with the top vendors, helping
              you discover the best services and products for your needs. We
              strive to provide a curated selection of reliable vendors to make
              your experience seamless and enjoyable.
            </Typography>
          </div>

          {/* Organizer Info */}
          <div className="w-full md:w-1/2">
            <Typography
              variant="h6"
              color="white"
              className="mb-4"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              FOR VENDORS
            </Typography>
            <Typography
              variant="paragraph"
              color="gray"
              className="text-gray-400"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Viao is created by a passionate team committed to delivering
              exceptional experiences. With our advanced technology, effective
              marketing strategies, and reliable customer support, we help you
              build lasting connections with attendees and foster ongoing
              engagement for your events.
            </Typography>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-700" />

        {/* Links and Social Icons */}
        <div className="flex flex-col items-center md:flex-row md:justify-between gap-6">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center space-x-6 text-sm">
            {[
              { name: "Home", url: "/" },
              { name: "Vendors", url: "/vendors" },
              { name: "About Us", url: "/about" },
              { name: "Privacy Policy", url: "/about" },
              { name: "Terms & Conditions", url: "/about" },
              { name: "Contact Us", url: "/contact" },
            ].map((link, index) => (
              <Typography
                key={index}
                variant="small"
                color="white"
                className="hover:text-blue-400"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Link to={link.url}>{link.name}</Link>
              </Typography>
            ))}
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400">
              <FaFacebookF size={18} />
            </a>
            <a href="#" className="hover:text-pink-400">
              <FaInstagram size={18} />
            </a>
            <a href="#" className="hover:text-gray-300">
              <svg
                width="18"
                height="18"
                viewBox="0 0 29 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_6462_798)">
                  <path
                    d="M17.3381 12.8116L27.7144 0.75H25.2556L16.2458 11.2229L9.04979 0.75H0.75L11.6318 16.5869L0.75 29.2354H3.20899L12.7235 18.1756L20.3231 29.2354H28.6229L17.3375 12.8116H17.3381ZM13.9702 16.7264L12.8677 15.1494L4.095 2.60109H7.87186L14.9515 12.728L16.0541 14.305L25.2567 27.4685H21.4799L13.9702 16.727V16.7264Z"
                    fill="#FCFCFD"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_6462_798">
                    <rect
                      width="27.8729"
                      height="28.5"
                      fill="white"
                      transform="translate(0.75 0.75)"
                    ></rect>
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <Typography
          variant="small"
          color="gray"
          className="text-center text-gray-400 mt-6"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          © {year} Viao. All rights reserved.
        </Typography>
      </div>
    </footer>
  );
};

export default Footer;
