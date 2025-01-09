import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  IconButton,
  Typography,
} from '@material-tailwind/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { sendData } from '../../../config/services/chatApi';
import { useNavigate } from 'react-router-dom';
import { USER } from '../../../config/routes/user.routes';
import { toast } from 'react-hot-toast';

interface ProfileButtonsProps {
  vendorId: string | undefined;
  bookedDates:Array<string> | undefined;
  userId: string | undefined;
}

const ProfileButtons: React.FC<ProfileButtonsProps> = ({ vendorId, bookedDates, userId }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();


  const handleOpen = () => setOpen((cur) => !cur);

  const handleChat =async()=>{
    if (!userId) {
      toast.error('Please log in.', {
        style: {
          background: 'red', // Red background
          color: '#FFFFFF', // White text
        },
        duration: 3000,
      });
      return;
    }
    const body ={
      senderId :userId,
      receiverId:vendorId
    }
    try {
      await sendData(body).then(()=>{
        navigate(`${USER.CHAT}`)
      })
    } catch(error) {
      console.log(error)
    }
  }

  const handleClick = () => {
    if (userId) {
      // If userId is defined, navigate to the desired route
      navigate(`/book-event?id=${vendorId}`);
    } else {
      // If userId is not defined, show an error toast
      toast.error('Please login before booking.', {
        style: {
          background: 'red', // Red background
          color: '#FFFFFF', // White text
        },
        duration: 3000,
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-center py-4 pt-8 lg:pt-4">
      <div className="mr-1 p-3 text-center">
          <Button
            className="w-fit bg-blue-900 rounded-full"
            onClick={handleOpen}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Check Availability
          </Button>
        </div>
        <div className="mr-1 p-3 text-center">
         
          <Button
            className="w-fit bg-blue-900 rounded-full"
            onClick={handleClick}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Book Now
          </Button>
          
        </div>
        <div className="mr-1 p-3 text-center">
          <Button
            className="w-fit bg-blue-900 rounded-full"
            onClick={handleChat}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Chat with us
          </Button>
        </div>
      </div>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <DialogHeader
          className="justify-between"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div>
            <Typography
              variant="h5"
              color="deep-purple"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Available Dates
            </Typography>
            
          </div>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={handleOpen}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody
          className="flex justify-center !px-5"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
         <DatePicker
            selected={null}
            onChange={() => {}}
            inline
            minDate={new Date()}
            excludeDates={bookedDates?.map(date => new Date(date))}
            dayClassName={(date) => {const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
              return bookedDates?.includes(utcDate.toISOString().split('T')[0]) ? 'bg-red-500' : '';}}
          />
        </DialogBody>
      </Dialog>
    </>
  );
};

export default ProfileButtons;