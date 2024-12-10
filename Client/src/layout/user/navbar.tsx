import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Avatar,
  ListItem,
  Accordion,
  AccordionBody,
  List,
  Tooltip,
} from "@material-tailwind/react";

import {
  Bars3Icon,
  ChevronDownIcon,
  PowerIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import UserState from "../../redux/rootstate/UserState";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../../config/api/axiosinstance";
import { logout } from "../../redux/slices/UserSlice";
import { useNavigate } from "react-router-dom";
import { USER } from "../../config/routes/user.routes";

const NavbarComponent = () => {
  const [openNav, setOpenNav] = useState<boolean>(false);
  const user = useSelector((state: UserState) => state.user.userdata);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const path = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);



  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axiosInstance
      .get("/logout")
      .then(() => {
        dispatch(logout());
        navigate(`${USER.LOGIN}`);
      })
      .catch((error) => {
        console.log("here", error);
      });
  };

  const navList = (
    <ul className="flex flex-col gap-2 text-inherit lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        key="Vendors"
        as="li"
        color={location.pathname === USER.VENDORS ? "yellow" : "inherit"}
        variant="small"
        className="capitalize"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Link
          to={USER.VENDORS}
          className="flex items-center gap-1 p-1 font-bold"
        >
          Vendors
        </Link>
      </Typography>
      <Typography
        key="About"
        as="li"
        variant="small"
        color={location.pathname === USER.ABOUT ? "yellow" : "inherit"}
        className="capitalize"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Link to={USER.ABOUT} className="flex items-center gap-1 p-1 font-bold">
          About
        </Link>
      </Typography>
      <Typography
        key="Contact"
        as="li"
        variant="small"
        color={location.pathname === USER.CONTACT ? "yellow" : "inherit"}
        className="capitalize"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Link to={USER.CONTACT} className="flex items-center gap-1 p-1 font-bold">
          Contact
        </Link>
      </Typography>
    </ul>
  );


  return (
    <Navbar
    style={{ borderRadius: '0' }}
    color="transparent"
    className={`${path.pathname.includes('/profile') || isScrolled? 'bg-black ' : 'bg-transparent shadow-none'
    } max-w-screen w-full z-0 px-4 py-3 lg:px-8 lg:py-3 rounded-none border-none shadow-none h-18`}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <div className="container mx-auto flex items-center justify-between pt-2 pb-1 bg-transparent">
        <Link to={USER.HOME}>
          <Typography
            className="ml-4 mr-2 cursor-pointer py-1 font-bold"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            variant="h6"
          >
            Viao
          </Typography>
        </Link>
        <div className="hidden lg:block">{navList}</div>
        <div className="hidden gap-2 lg:flex">
          {user ? (
            <>
            

              <Link to={`/`}>
              <Tooltip content="Profile" color="white">
                <Avatar
                  size="xs"
                  variant="circular"
                  alt={user?.name}
                  className="cursor-pointer bg-white mt-2"
                  src={
                    user?.imageUrl ? user.imageUrl : "/imgs/user/user-avatar.jpeg"
                  }
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                </Tooltip>
              </Link>
              <Tooltip content="Logout" color="white">
              <Button
              color="white"
              size="sm"
                variant="text"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onClick={handleLogout}
              >
                <PowerIcon className="h-5 w-5" />
              </Button>
              </Tooltip>
            </>
          ) : (
            <>
              <Link to={USER.LOGIN}>
                <Button
                  variant="text"
                  size="sm"
                  color="white"
                  fullWidth
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Login
                </Button>
              </Link>

              <Link to={USER.SIGNUP}>
                <Button
                  variant="gradient"
                  size="sm"
                  fullWidth
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Signup
                </Button>
              </Link>
            </>
          )}
        </div>
        <IconButton
          variant="text"
          size="sm"
          color="white"
          className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {openNav ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <MobileNav
        className="rounded-xl bg-white px-4 pt-2 pb-4 text-blue-gray-900"
        open={openNav}
      >
        <div className="container mx-auto">
          {navList}
          {user ? (
            <Accordion
              open
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform "rotate-180" : ""}`}
                />
              }
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <AccordionBody className="py-1">
                <List
                  className="p-0"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <ListItem
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <Button
                      variant="text"
                      size="sm"
                      className="hidden lg:inline-block"
                      placeholder={undefined}
                      onClick={handleLogout}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Logout
                    </Button>
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion>
          ) : (
            <Link to={USER.LOGIN}>
              <Button
                variant="gradient"
                size="sm"
                fullWidth
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Login
              </Button>
            </Link>
            
          )}
        </div>
      </MobileNav>
    </Navbar>
  );
};

NavbarComponent.defaultProps = {
  brandName: "Viao",
  action: (
    <a
      href="https://www.creative-tim.com/product/material-tailwind-kit-react"
      target="_blank"
    ></a>
  ),
};

export default NavbarComponent;
