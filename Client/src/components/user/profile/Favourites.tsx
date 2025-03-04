import { useSelector } from 'react-redux';
import { deleteFavourite, getFavourites } from '../../../config/services/userApi';
import UserRootState from '../../../redux/rootstate/UserState';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../common/Pagination';
import { USER } from '../../../config/routes/user.routes';
import { useDispatch } from 'react-redux';
import { setUserInfo } from "../../../redux/slices/UserSlice";
interface Favourite {
  id: string;
  coverpicUrl:string;
  name:string
}

const Favourites = () => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(""); // State to hold the selected id
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleOpen = (id:string) => {
    setSelectedId(id); // Set the selected id when opening the dialog
    setOpen(true);
  };
  
  const handleClose = () => setOpen(false); // Close the dialog
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchFav(currentPage);
  }, [currentPage]);

  const fetchFav = async (page: number) => {
    try {
      const response = await getFavourites(user?.id, page, {
        withCredentials: true,
      })
      setFavourites(response.data);
      const totalPagesFromResponse = response.totalPages;
      setTotalPages(totalPagesFromResponse);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const handleDelete = async (id:string) => {
    deleteFavourite(user?.id, id, {
        withCredentials: true,
      })
      .then((data) => {
        console.log(data);
        handleClose();
        if(data.userData){
          toast.success("Vendor Profile Removed from Favourites!")
          setFavourites(favourites?.filter((fav) => fav.id !== id));
        }
        dispatch(setUserInfo(data.userData));
        
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log('here', error);
      });
  };

  return (
    <>
      {favourites.length==0?<Typography
            variant="h5"
            color="deep-purple"
            className="text-center mt-4"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Your favourites list is empty!
          </Typography>:  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 m-10">
      
      {favourites.map(({ coverpicUrl, name, id }, index) => (
        <div key={index}>
          <Card
            className="mt-2 w-70"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <CardHeader
            
              className="relative h-40"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Link to={`${USER.VIEW_VENDOR}?id=${id}`}>
              <img src={coverpicUrl?coverpicUrl:"/imgs/vendor/default-cover.jpg.jpg"} alt={name} />
              </Link>
              <button
                onClick={() => handleOpen(id)} // Pass id to handleOpen
                className="absolute top-0 right-0 m-2 bg-danger hover:bg-red-700 hover:text-white text-red-500 font-bold py-1 px-3 rounded"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </CardHeader>
            <CardBody
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Link to={`${USER.VIEW_VENDOR}?id=${id}`}>
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-2 text-center"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {name}
                </Typography>
              </Link>
            </CardBody>
          </Card>
        </div>
      ))}
    </div>}
    
      {favourites.length > 0 && (
       <Pagination
       currentPage={currentPage}
       totalPages={totalPages}
       handlePageChange={handlePageChange}
       isTable={false}
     />
      )}
      <Dialog size="xs" open={open} handler={handleClose} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Confirmation</DialogHeader>
        <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Are you sure you want to delete this item?
        </DialogBody>
        <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <Button variant="text" color="red" onClick={handleClose} className="mr-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={() => handleDelete(selectedId)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Favourites;