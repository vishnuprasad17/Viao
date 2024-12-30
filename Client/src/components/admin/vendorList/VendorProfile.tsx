import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  getVendorProfile,
  blockVendors,
  updateVerify,
} from "../../../config/services/adminApi";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/VendorSlice";
import { VendorData } from "../../../interfaces/vendorTypes";
import VendorRootState from "../../../redux/rootstate/VendorState";
import { useSelector } from "react-redux";
import { persistStore } from "redux-persist";
import { store } from "../../../redux/store";

const clearVendorState = () => {
  const persistor = persistStore(store);

  persistor.pause(); // Temporarily disable persistence
  localStorage.removeItem("persist:user"); // Remove the `user` slice from localStorage
  persistor.persist(); // Resume persistence
};

const VendorProfile = () => {
  const vendorData = useSelector(
    (state: VendorRootState) => state.vendor.vendordata
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState(''); // "Accept" or "Reject"
  const [rejectionNote, setRejectionNote] = useState('');
  const [error, setError] = useState(''); // Error message for rejection note
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const Id = queryParams.get("Id");
  const [vendor, setVendor] = useState<VendorData>();

  useEffect(() => {
    getVendorProfile(Id)
      .then((response) => {
        console.log(response.data.data);
        console.log("data", vendorData);
        setVendor(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [Id, vendor?.isActive]);

  const handleBlock = () => {
    blockVendors(Id)
      .then((response) => {
        console.log(response.data);
        if (response.data.process === "block") {
          dispatch(logout()); // Dispatch logout action if the vendor is blocked
          clearVendorState();
        }
        console.log("data", vendorData);
        setVendor((prevVendor) =>
          prevVendor
            ? { ...prevVendor, isActive: !prevVendor.isActive }
            : undefined
        );
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const handleOpenDialog = (type: string) => {
    setActionType(type);
    setError(''); // Reset error message
    setRejectionNote(''); // Reset rejection note
    setOpenDialog(true);
  };

  const handleConfirmAction = () => {
    if (actionType === 'Reject' && !rejectionNote.trim()) {
      setError('Please provide a note for rejection.');
      return;
    }

    const note = actionType === 'Reject' ? rejectionNote : '';
    const status = actionType === 'Reject' ? 'Rejected' : 'Accepted';
    updateVerifyStatus(status, note);

    // Reset state
    setError('');
    setRejectionNote('');
    setOpenDialog(false);
  };

  const updateVerifyStatus = async (status: string, note: string) => {
    try {
      const response = await updateVerify(
        { vendorId: vendor?._id, status: status, note: note },
        { withCredentials: true }
      );
      console.log(response);
      toast.success(response.data.message);
      setVendor((prevVendor) =>
        prevVendor
          ? { ...prevVendor, verificationRequest: !prevVendor.verificationRequest }
          : undefined
      );
    } catch (error) {
      console.error('Error updating verify status:', error);
      toast.error('Failed to update verification status.');
    }
  };

  return (
    <>
      {vendor?.verificationRequest ? (
        <div className="w-85 m-10 mx-10">
          <Card
            className="mt-6 bg-blue-100 text-center"
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
                variant="h5"
                color="blue-gray"
                className="mb-2"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Request for Profile Verification
              </Typography>
            </CardBody>
            <CardFooter
              className="pt-0"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Button
                onClick={() => handleOpenDialog('Accept')}
                className="mr-5"
                color="green"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Accept
              </Button>
              <Button
                onClick={() => handleOpenDialog('Reject')}
                color="red"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Reject
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        ""
      )}

      <div className="w-85 m-10 mx-10">
        <Card
          className="mt-6"
          placeholder={undefined}
          style={{
            backgroundColor: "#E7E3E0",
            backgroundImage: `url(${vendor?.coverpicUrl})`,
            backgroundSize: "cover",
          }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <CardBody
            placeholder={undefined}
            className="h-50"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            children={undefined}
          ></CardBody>
          {vendor?.isVerified ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              className="absolute top-2 right-2 h-10 w-10"
            >
              <polygon
                fill="#fbc02d"
                points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
              ></polygon>
              <polygon
                fill="#6a0dad"
                points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
              ></polygon>
            </svg>
          ) : (
            ""
          )}
        </Card>
        <Card
          className=""
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <CardHeader
            style={{
              backgroundImage: `url(${vendor?.logoUrl})`,
              backgroundSize: "cover",
            }}
            color="gray"
            className="mb-4 grid h-28 place-items-center w-40"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            children={undefined}
          ></CardHeader>

          <CardBody
            className="flex flex-col gap-4"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Typography
              variant="h4"
              style={{ marginTop: "-90px", marginLeft: "170px" }}
              color="blue-gray"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {vendor?.name}
            </Typography>
            <div
              className="mt-5"
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  VENDOR-TYPE
                </Typography>
                <Typography
                  textGradient
                  color="blue-gray"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {vendor?.name}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  CITY
                </Typography>
                <Typography
                  textGradient
                  color="blue-gray"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {vendor?.city}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="mb-2"
                  //   textGradient
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  TOTAL WORKS
                </Typography>
                <Typography
                  textGradient
                  color="blue-gray"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {vendor?.totalBooking}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="mb-2"
                  //   textGradient
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  CONTACTS
                </Typography>
                <Typography
                  textGradient
                  color="blue-gray"
                  className="mb-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  +91{vendor?.phone}
                </Typography>
              </div>
            </div>
            <div className="m-0">
              {vendor?.isActive ? (
                <Button
                  variant="gradient"
                  onClick={() => handleBlock()}
                  size="sm"
                  color="red"
                  className="hidden lg:inline-block"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <span>Block Vendor</span>
                </Button>
              ) : (
                <Button
                  variant="gradient"
                  onClick={() => handleBlock()}
                  size="sm"
                  className="hidden lg:inline-block"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <span>Unblock vendor</span>
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
      {/* Action Dialog */}
      <Dialog
        open={openDialog}
        handler={() => setOpenDialog(false)}
        className="fixed inset-0 flex items-center justify-center px-4 sm:px-0"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
          <DialogHeader className="text-lg font-semibold" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Confirm {actionType === 'Accept' ? 'Acceptance' : 'Rejection'}
          </DialogHeader>
          <DialogBody className="px-4 py-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Typography variant="small" color="gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {actionType === 'Accept'
                ? 'Are you sure you want to accept this vendor profile?'
                : 'Please provide a note for rejecting this vendor profile.'}
            </Typography>
            {actionType === 'Reject' && (
              <>
                <Textarea
                  value={rejectionNote}
                  onChange={(e) => {
                    setRejectionNote(e.target.value);
                    if (error) setError(''); // Clear error on input change
                  }}
                  placeholder="Enter your reason for rejection..."
                  className="mt-4"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                {error && (
                  <Typography
                    variant="small"
                    color="red"
                    className="mt-1"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {error}
                  </Typography>
                )}
              </>
            )}
          </DialogBody>
          <DialogFooter className="flex justify-end px-4 py-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Button
              color={actionType === 'Accept' ? 'green' : 'red'}
              onClick={handleConfirmAction}
              className="mr-2"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Confirm {actionType}
            </Button>
            <Button
              variant="outlined"
              color="gray"
              onClick={() => setOpenDialog(false)}
              className="ml-2"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Cancel
            </Button>
          </DialogFooter>
        </div>
      </Dialog>
    </>
  );
};

export default VendorProfile;