import React, {useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { VENDOR } from "../../config/routes/vendor.routes";
import { axiosInstanceVendor } from "../../config/api/axiosinstance";
import { logout } from "../../redux/slices/VendorSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import VendorRootState from "../../redux/rootstate/VendorState";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const vendorData = useSelector(
    (state: VendorRootState) => state.vendor.vendordata
  );
 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { pathname } = location;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axiosInstanceVendor
      .get("/logout")
      .then(() => {
        dispatch(logout()); // Assuming you want to clear admin info on logout
        navigate(`${VENDOR.LOGIN}`);
      })
      .catch((error) => {
        console.log("here", error);
      });
  };

  return (
    <div className={`flex h-screen overflow-hidden`}>
      {/* Sidebar */}
      {pathname!=="/vendor/chat" &&<aside
        className={`fixed bg-white text-black w-64 p-4 h-full transition-transform border-r border-gray-300 ${
          isSidebarOpen ? "translate-x-0 z-999" : "-translate-x-64 pt-20"
        } sm:translate-x-0`}
      >
        {isSidebarOpen ? (
          <button className="ml-50" onClick={toggleSidebar}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        ) : (
          ""
        )}
        <nav>
          {isSidebarOpen && (
            <NavLink to={VENDOR.DASHBOARD}>
              <Typography
                variant="h5"
                className="font-bold mb-5 ml-2"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {vendorData?.name}
              </Typography>
            </NavLink>
          )}
          <List
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <NavLink to={VENDOR.DASHBOARD}>
              <ListItem
                className={`group relative ${pathname.includes(VENDOR.DASHBOARD) ? "bg-gray-300 border-1 rounded-lg" : ""}`}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <ListItemPrefix
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                      fill=""
                    />
                    <path
                      d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                      fill=""
                    />
                    <path
                      d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                      fill=""
                    />
                    <path
                      d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                      fill=""
                    />
                  </svg>
                </ListItemPrefix>
                Dashboard
              </ListItem>
            </NavLink>

            <hr className="my-2 border-blue-gray-50" />
            <Button
              onClick={handleLogout}
              className={`group relative flex rounded-lg items-center gap-2.5  py-2 w-30 font-medium  duration-300 ease-in-out  bg-pink-400 dark:bg-meta-4`}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <svg
                className="white"
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_130_9814)">
                  <path
                    d="M12.7127 0.55835H9.53457C8.80332 0.55835 8.18457 1.1771 8.18457 1.90835V3.84897C8.18457 4.18647 8.46582 4.46772 8.80332 4.46772C9.14082 4.46772 9.45019 4.18647 9.45019 3.84897V1.88022C9.45019 1.82397 9.47832 1.79585 9.53457 1.79585H12.7127C13.3877 1.79585 13.9221 2.33022 13.9221 3.00522V15.0709C13.9221 15.7459 13.3877 16.2802 12.7127 16.2802H9.53457C9.47832 16.2802 9.45019 16.2521 9.45019 16.1959V14.2552C9.45019 13.9177 9.16894 13.6365 8.80332 13.6365C8.43769 13.6365 8.18457 13.9177 8.18457 14.2552V16.1959C8.18457 16.9271 8.80332 17.5459 9.53457 17.5459H12.7127C14.0908 17.5459 15.1877 16.4209 15.1877 15.0709V3.03335C15.1877 1.65522 14.0627 0.55835 12.7127 0.55835Z"
                    fill=""
                  />
                  <path
                    d="M10.4346 8.60205L7.62207 5.7333C7.36895 5.48018 6.97519 5.48018 6.72207 5.7333C6.46895 5.98643 6.46895 6.38018 6.72207 6.6333L8.46582 8.40518H3.45957C3.12207 8.40518 2.84082 8.68643 2.84082 9.02393C2.84082 9.36143 3.12207 9.64268 3.45957 9.64268H8.49395L6.72207 11.4427C6.46895 11.6958 6.46895 12.0896 6.72207 12.3427C6.83457 12.4552 7.00332 12.5114 7.17207 12.5114C7.34082 12.5114 7.50957 12.4552 7.62207 12.3145L10.4346 9.4458C10.6877 9.24893 10.6877 8.85518 10.4346 8.60205Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_130_9814">
                    <rect
                      width="18"
                      height="18"
                      fill="white"
                      transform="translate(0 0.052124)"
                    />
                  </clipPath>
                </defs>
              </svg>
              Logout
            </Button>
          </List>
        </nav>
      </aside>}
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="fixed w-full bg-black h-16 text-white p-4 flex justify-between items-center z-10">
          {/* Left-aligned logo/text */}

          <Typography
            className="font-bold"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            variant="h5"
          >
            Viao
          </Typography>

          {/* Right-aligned icon */}
          <div className="r-2 lg:flex hidden">
            <NavLink to={VENDOR.DASHBOARD}>
              <i className="fa-solid fa-message mt-2 mr-2"></i>
            </NavLink>
            <NavLink to={VENDOR.DASHBOARD}>
            <Avatar
              src={vendorData?.logoUrl?vendorData?.logoUrl:"/imgs/vendor/vendor-avatar.jpeg"}
              className="ml-2 text-sm"
              size="sm"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
            </NavLink>
          </div>

          <button onClick={toggleSidebar} className="sm:hidden">
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </header>

        {/* Content Area */}
        <main className={`${pathname === VENDOR.DASHBOARD ? "" : "sm:ml-64"} flex-1 overflow-auto p-4 bg-white mt-16`}>

          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
