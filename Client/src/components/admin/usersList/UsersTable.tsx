import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
} from "@material-tailwind/react";

const TABLE_HEAD = ["User", "Phone", "Status", "Action"];

import { useState, useEffect } from "react";
import { blockUsers, getUsers } from "../../../config/services/adminApi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/UserSlice";
import { ADMIN } from "../../../config/routes/admin.routes";
import { UserData } from "../../../interfaces/userTypes";
import { useSelector } from "react-redux";
import UserRootState from "../../../redux/rootstate/UserState";
import { persistStore } from "redux-persist";
import { store } from "../../../redux/store";

const clearUserState = () => {
  const persistor = persistStore(store);

  persistor.pause(); // Temporarily disable persistence
  localStorage.removeItem('persist:user'); // Remove the `user` slice from localStorage
  persistor.persist(); // Resume persistence
};
const UsersTable = () => {
  const user = useSelector((state : UserRootState) => state.user.userdata);
  const dispatch = useDispatch();

  const [users, setUsers] = useState<UserData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageParam = queryParams.get("page");
    const searchParam = queryParams.get("search");
    setPage(pageParam ? parseInt(pageParam, 10) : 1);
    setSearch(searchParam ? searchParam : "");
    fetchData(pageParam, searchParam);
  }, [location.search]);

  const fetchData = (
    pageParam?: string | null,
    searchParam?: string | null
  ) => {
    getUsers(pageParam || page, searchParam || search)
      .then((response) => {
        console.log(response);
        setUsers(response.data.users);
        setTotalPages(() => {
          return Math.ceil(response.data.totalUsers / 6);
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const handleBlock = (userId: string) => {
    blockUsers(userId)
      .then((response) => {
        console.log(response);
        if (response.data.process === "block") {
          dispatch(logout()); // Dispatch logout action if the user is blocked
          clearUserState();
        }
        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        );
        setUsers(updatedUsers);
        console.log("UserData", user)
        toast.success(response.data.message);
        navigate(`${ADMIN.USERS}`);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const handleSearch = () => {
    navigate(`${ADMIN.USERS}?page=${page}&search=${search}`);
  };

  return (
    <Card
      className="h-full w-full"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="mb-2 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Adjusted for smaller screens */}
          <div>
            <Typography
              variant="h5"
              color="blue-gray"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Users list
            </Typography>
            <Typography
              color="gray"
              className="mt-1 font-normal"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              See information about all members
            </Typography>
          </div>
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              name="search"
              value={search}
              color="black"
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={handleSearch}
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody
        className="overflow-x-scroll px-0"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user, index) => {
                const classes = "p-4";

                return (
                  <tr key={index}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={
                            user.imageUrl
                              ? user.imageUrl
                              : "/imgs/user-default.svg"
                          }
                          size="sm"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {user.name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {user.email}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {user.phone}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={user.isActive ? "active" : "Blocked"}
                          color={user.isActive ? "green" : "red"}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Button
                        color={user.isActive ? "red" : "green"}
                        variant="gradient"
                        onClick={() => handleBlock(user.id)}
                        size="sm"
                        className="hidden lg:inline-block w-30"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        <span>{user.isActive ? "Block" : "Unblock"}</span>
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={TABLE_HEAD.length} className="p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>

      <CardFooter
        className="flex flex-col md:flex-row items-center justify-between border-t border-blue-gray-50 p-4"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Page {page} of {totalPages}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            color="blue"
            onClick={() => {
              const nextPage = page - 1 > 0 ? page - 1 : 1;
              navigate(`${ADMIN.USERS}?page=${nextPage}&search=${search}`);
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            color="deep-purple"
            onClick={() => {
              const nextPage = page + 1 <= totalPages! ? page + 1 : totalPages;
              navigate(`${ADMIN.USERS}?page=${nextPage}&search=${search}`);
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UsersTable;
