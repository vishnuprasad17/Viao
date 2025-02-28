import React, { useState } from "react";
import {
  Typography,
  Select,
  Button,
  Option,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Alert,
} from "@material-tailwind/react";
import { updateBookingStatus } from "../../../../config/services/venderApi";
import { toast } from "react-toastify";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface UpdateStatusProps {
  bookingId: string | undefined;
  onStatusChange: (newStatus: string) => void;
}

const UpdateStatus: React.FC<UpdateStatusProps> = ({
  bookingId,
  onStatusChange,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>("");
  const [errorStatus, setErrorStatus] = useState<string>("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (!selectedStatus) {
      setErrorStatus("Please select a status");
      return;
    }
    setOpen(true);
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    updateBookingStatus(bookingId, selectedStatus)
      .then((response) => {
        console.log(response.data);
        setOpen(false);
        toast.success("Status Changed Successfully!");
        onStatusChange(selectedStatus || "");
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
      <Typography
        variant="h5"
        color="blue-gray"
        className="mb-4"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Update Booking Status
      </Typography>

      <div className="flex flex-col gap-4 max-w-md">
        <Select
          label="Select New Status"
          value={selectedStatus}
          onChange={(value) => {
            setSelectedStatus(value || "");
            setErrorStatus("");
          }}
          className="!border-t-blue-gray-200 focus:!border-t-gray-900"
          error={!!errorStatus}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Option
            value="Accepted"
            className="flex items-center gap-2 text-green-600"
          >
            <CheckCircleIcon className="h-5 w-5" />
            Accept Booking
          </Option>
          <Option
            value="Rejected"
            className="flex items-center gap-2 text-red-600"
          >
            <XCircleIcon className="h-5 w-5" />
            Reject Booking
          </Option>
        </Select>

        {errorStatus && (
          <Alert
            color="red"
            icon={<ExclamationTriangleIcon className="h-5 w-5" />}
          >
            {errorStatus}
          </Alert>
        )}

        <Button
          variant="gradient"
          color="blue"
          onClick={handleOpen}
          className="flex items-center gap-2"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <ArrowPathIcon className="h-5 w-5" />
          Update Status
        </Button>
      </div>

      <Dialog
        open={open}
        handler={() => setOpen(!open)}
        className="rounded-xl"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <DialogHeader
          className="border-b border-blue-gray-100"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />
            Confirm Status Change
          </div>
        </DialogHeader>
        <DialogBody
          className="py-6"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Typography
            variant="paragraph"
            className="text-center"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Are you sure you want to change the status to{" "}
            <strong className="text-blue-600">{selectedStatus}</strong>?
          </Typography>
        </DialogBody>
        <DialogFooter
          className="border-t border-blue-gray-100"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <form onSubmit={handleUpdate} className="flex gap-2">
            <Button
              variant="text"
              color="blue-gray"
              onClick={() => setOpen(false)}
              className="hover:shadow-none"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="green"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <CheckCircleIcon className="h-5 w-5" />
              Confirm Change
            </Button>
          </form>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default UpdateStatus;