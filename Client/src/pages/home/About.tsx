import { Typography } from "@material-tailwind/react";
import Footer from "../../layout/user/footer";

const About = () => {
  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-start lg:pt-16 pt-6 pb-20 mb-0">
        <div className="absolute top-0 h-100 w-full bg-[#1d33b0] bg-cover bg-center" />
        <div className="absolute top-0 h-100 w-full bg-black/40 bg-cover bg-center" />
        <div className="mt-4 lg:ml-20 ml-10 lg:justify-start z-1">
          <Typography
            variant="h2"
            color="white"
            style={{ fontFamily: "playfair display", fontSize: "40px" }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            About Viao
          </Typography>
        </div>
      </div>
      {/* Section 2 */}
      <div className="flex flex-wrap items-center mb-20 mx-10 lg:-mt-10 md:-mt-40 -mt-40">
        <div className="mx-auto  w-full px-4 md:w-5/12">
          <Typography
            variant="h2"
            className="mb-4 font-bold lg:mt-0 mt-10"
            color="blue-gray"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            style={{ fontFamily: "playfair display", fontSize: "30px" }}
          >
            Welcome to Viao – Your Ultimate Event Planning Companion
          </Typography>
          <Typography
            className="font-normal text-blue-gray-500"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            At Viao, we believe in transforming every event into an
            unforgettable experience. Whether you're planning an intimate
            gathering or a grand celebration, Viao brings together the best
            vendors and services to craft moments that will last a lifetime.
            <br />
            <br />
            Our platform is designed to streamline your event planning journey,
            connecting you with top-tier vendors, simplifying bookings, and
            giving you all the tools you need to make your vision a reality.
            From selecting the perfect venue to finalizing every detail, Viao
            makes planning effortless and enjoyable.
          </Typography>
        </div>
        <div className="mx-auto mt-24 flex justify-center px-4 md:w-5/12 w-12/12 lg:mt-0">
          <div className="grid grid-cols-4 gap-4 md:grid-cols-4"></div>
        </div>
      </div>
      {/* Section3 */}
      <div className="flex flex-wrap items-center mx-10 my-40">
        <div className="mx-auto mt-24 lg:flex hidden w-full justify-center px-4 md:w-5/12 lg:mt-0">
          <img
            alt="Card Image"
            src="https://images.shiksha.com/mediadata/shikshaOnline/mailers/2022/naukri-learning/what-is/event-management.jpg"
            className="h-full w-full"
          />
        </div>
        <div className="mx-auto lg:-mt-8 -mt-15 w-full px-4 md:w-5/12">
          <Typography
            variant="h3"
            className="mb-3 font-bold"
            color="blue-gray"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            style={{ fontFamily: "playfair display", fontSize: "30px" }}
          >
            Why Viao?
          </Typography>
          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <span className="h-2 w-2 bg-[#287eff] rounded-full mr-2"></span>
              <Typography
                className="font-normal text-blue-gray-500"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Effortless Vendor Search: Find top vendors tailored to your
                needs.
              </Typography>
            </div>
            <div className="flex items-center mb-1">
              <span className="h-2 w-2 bg-[#287eff] rounded-full mr-2"></span>
              <Typography
                className="font-normal text-blue-gray-500"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Intuitive Experience: Plan events with ease and confidence.
              </Typography>
            </div>
            <div className="flex items-center mb-1">
              <span className="h-2 w-2 bg-[#287eff] rounded-full mr-2"></span>
              <Typography
                className="font-normal text-blue-gray-500"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Personalized Solutions: Get resources aligned with your style
                and budget.
              </Typography>
            </div>
            <div className="flex items-center mb-1">
              <span className="h-2 w-2 bg-[#287eff] rounded-full mr-2"></span>
              <Typography
                className="font-normal text-blue-gray-500"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Unforgettable Events: Create moments that leave lasting
                impressions.
              </Typography>
            </div>
          </div>
        </div>
      </div>
      {/* Section4 */}
      <section className="lg:my-20 -mt-20">
        <div className="lg:text-center lg:mb-8 mb-4 ml-20">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "playfair display", fontSize: "30px" }}
          >
            How Viao Works
          </h2>
        </div>
        <div className="flex flex-wrap justify-center md:mx-18 mx-10 lg:mx-0">
          <div className="w-full md:w-1/2 lg:w-1/4 p-4 cursor-pointer">
            <div className="rounded-lg shadow-md p-6 flex items-center bg-[#1c2aaa] transform transition-transform duration-300 hover:scale-105">
              <div className="bg-[#fbfb2a] rounded-full h-12 w-16 flex items-center justify-center mr-4">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#d1ff1b] mb-2">
                  Discover
                </h3>
                <p className="text-gray-300">
                  Explore top vendors for your needs.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 p-4 cursor-pointer">
            <div className="bg-[#1c2aaa] rounded-lg shadow-md p-6 flex items-center transform transition-transform duration-300 hover:scale-105">
              <div className="bg-[#fbfb2a] rounded-full h-12 w-18 flex items-center justify-center mr-4">
                <i className="fa-solid fa-handshake-simple"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#d1ff1b] mb-2">
                  Connect
                </h3>
                <p className="text-gray-300">
                  Communicate seamlessly on the platform.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 p-4 cursor-pointer">
            <div className="bg-[#1c2aaa] rounded-lg shadow-md p-6 flex items-center transform transition-transform duration-300 hover:scale-105">
              <div className="bg-[#fbfb2a] rounded-full h-12 w-14 flex items-center justify-center mr-4">
                <i className="fa-solid fa-pen-to-square"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#d1ff1b] mb-2">
                  Organize
                </h3>
                <p className="text-gray-300">
                  Plan effortlessly with smart tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:my-40 my-20">
        <div className="relative h-100 w-full bg-[#1d33b0]">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative flex items-center justify-end h-full w-full p-8">
            <div className="bg-[#f1fb84] bg-opacity-70 p-8 rounded-lg max-w-lg">
              <h2
                className="lg:text-3xl text-xl font-bold mb-4"
                style={{ fontFamily: "playfair display", fontSize: "30px" }}
              >
                Let’s Get Started
              </h2>
              <Typography
                className="font-normal text-blue-gray-600 mb-4"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Effortless planning, unforgettable moments. Viao is your partner
                in crafting exceptional experiences. Begin your journey to
                something extraordinary today!
              </Typography>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
