import React, { useState } from 'react';
import {
  Button,
} from '@material-tailwind/react';
import 'react-datepicker/dist/react-datepicker.css';
import { sendData } from '../../../config/services/chatApi';
import { useNavigate } from 'react-router-dom';
import { USER } from '../../../config/routes/user.routes';
import { toast } from 'react-hot-toast';

interface ProfileButtonsProps {
  vendorId: string | undefined;
  userId: string | undefined;
}

const ProfileButtons: React.FC<ProfileButtonsProps> = ({ vendorId, userId }) => {
  const navigate = useNavigate();

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
      await sendData("user", body).then(()=>{
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
    </>
  );
};

export default ProfileButtons;