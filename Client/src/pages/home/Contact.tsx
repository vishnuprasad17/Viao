import { Typography } from "@material-tailwind/react";
import Footer from "../../layout/user/footer";
import ContactForm from "../../components/home/ContactForm";
import { useEffect } from "react";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-start lg:pt-16 pt-6 pb-20 mb-0">
        <div className="absolute top-0 h-100 w-full bg-blue-gray-500 bg-cover bg-center" />
        <div className="absolute top-0 h-100 w-full bg-black/60 bg-cover bg-center" />

        <div className="mt-4 lg:ml-20 ml-10 lg:justify-start z-1">
          <Typography
            variant="h2"
            color="white"
            style={{ fontFamily: "playfair display", fontSize: "40px" }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Contact Us
          </Typography>
        </div>
      </div>
      <section className="lg:-mt-20 -mt-40">
        <div className="flex flex-wrap justify-center md:mx-18 mx-10 lg:mx-0">
          <div className="w-full md:w-1/2 lg:w-1/4 p-4 cursor-pointer">
            <div className="rounded-lg shadow-md p-6 flex items-center bg-[#161f73] transform transition-transform duration-300 hover:scale-105">
              <div className="bg-[#d9ff1b] rounded-full h-12 w-12 flex items-center justify-center mr-4">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
                <p className="text-gray-300">+44-483-4955</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-4 cursor-pointer">
            <div className="bg-[#161f73] rounded-lg shadow-md p-6 flex items-center transform transition-transform duration-300 hover:scale-105">
              <div className="bg-[#d9ff1b] rounded-full h-12 w-12 flex items-center justify-center mr-4">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                <p className="text-gray-300">reactus@viao.com</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 p-4 cursor-pointer">
            <div className="bg-[#161f73] rounded-lg shadow-md p-6 flex items-center transform transition-transform duration-300 hover:scale-105">
              <div className="bg-[#d9ff1b] rounded-full h-12 w-12 flex items-center justify-center mr-4">
                <i className="fa-solid fa-address-book"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Address
                </h3>
                <p className="text-gray-300">Viao, Bengaluru 560001, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact */}
      <div className="flex flex-col md:flex-row justify-center items-center lg:mx-30 mx-15 lg:my-20 my-30 lg:px-4 px-2 md:w-5/6 lg:w-4/4">
        {/* Left Div */}
        <div className="md:w-1/2 lg:w-1/3 pr-4 -mt-20">
          <div className="mb-4">
            <h2
              className="text-2xl mb-4"
              style={{ fontFamily: "playfair display", fontSize: "30px" }}
            >
              Write Us a Message
            </h2>
            <p className="text-gray-600">
              "We Value Your Voice! Whether you're curious, have feedback, or
              want to share your thoughts, we're eager to listen. Your ideas
              matter, and we're dedicated to responding thoughtfully. Reach out
              anytime—we're ready to assist!"
            </p>
          </div>
        </div>
        {/* Right Div */}
        <ContactForm />
      </div>
      <Footer />
    </>
  );
};

export default Contact;
