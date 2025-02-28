import { Button, IconButton, Tooltip } from '@material-tailwind/react';
import 'react-datepicker/dist/react-datepicker.css';
import { sendData } from '../../../config/services/chatApi';
import { useNavigate } from 'react-router-dom';
import { USER } from '../../../config/routes/user.routes';
import { toast } from 'react-hot-toast';
import { addToFavourite } from '../../../config/services/userApi';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../../redux/slices/UserSlice';

interface ProfileButtonsProps {
  vendorId: string | undefined;
  userId: string | undefined;
  isNotVerified: boolean | undefined;
  isFavourite: boolean;
  onFavouriteToggle: () => void;
}

const ProfileButtons: React.FC<ProfileButtonsProps> = ({
  vendorId,
  userId,
  isNotVerified,
  isFavourite,
  onFavouriteToggle,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChat = async () => {
    if (!userId) {
      toast.error('Please log in.', {
        style: {
          background: 'red',
          color: '#FFFFFF',
        },
        duration: 3000,
      });
      return;
    }
    const body = {
      senderId: userId,
      receiverId: vendorId,
    };
    try {
      await sendData('user', body).then(() => {
        navigate(`${USER.CHAT}`);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    if (userId) {
      navigate(`/book-event?id=${vendorId}`);
    } else {
      toast.error('Please login before booking.', {
        style: {
          background: 'red',
          color: '#FFFFFF',
        },
        duration: 3000,
      });
    }
  };

  const handleFavourite = async () => {
    if (!userId || !vendorId) {
      toast.error('Please log in to add to favourites.', {
        style: {
          background: 'red',
          color: '#FFFFFF',
        },
        duration: 3000,
      });
      return;
    }
    try {
      const response = await addToFavourite(vendorId, userId, {
        withCredentials: true,
      });
      onFavouriteToggle();
      dispatch(setUserInfo(response.data.userData));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error('Failed to update favourites.');
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-center py-4 pt-8 lg:pt-4 gap-2">
        {/* Add to Favourite Button */}
        <div className="p-1 text-center">
          <Tooltip content={isFavourite ? "Remove from Favourites" : "Add to Favourites"}
            className = " text-red-300 text-xs bg-transparent"
          >
          <IconButton
            className={`rounded-full ${isFavourite ? 'bg-red-500' : 'bg-blue-900'}`}
            onClick={handleFavourite}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <i className="fas fa-heart" />
          </IconButton>
          </Tooltip>
        </div>

        {/* Book Now Button */}
        <div className="p-1 text-center">
          <Button
            className="w-fit bg-blue-900 rounded-full"
            onClick={handleClick}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            disabled={isNotVerified}
          >
            Book Now
          </Button>
        </div>

        {/* Chat with Us Button */}
        <div className="p-1 text-center">
          <Button
            className="w-fit bg-blue-900 rounded-full"
            onClick={handleChat}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Chat with Us
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfileButtons;