import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../../../../components/vendor/Breadcrumbs/Breadcrumb";
import { useSelector } from "react-redux";
import VendorRootState from "../../../../redux/rootstate/VendorState";
import { useEffect, useState } from "react";
import { deletePost, getPost } from "../../../../config/services/venderApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Pagination from "../../../../components/common/Pagination";
import { VENDOR } from "../../../../config/routes/vendor.routes";
import { Post } from "../../../../interfaces/postTypes";
import { Typography } from "@material-tailwind/react";
import Layout from "../../../../layout/vendor/Layout";

export default function Posts() {
  const vendorData = useSelector(
    (state: VendorRootState) => state.vendor.vendordata
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page: number) => {
    try {
      const response = await getPost(
       vendorData?._id, page,
        { withCredentials: true }
      );
      setPosts(response.data.posts);
      const totalPagesFromResponse = response.data.totalPages;
      setTotalPages(totalPagesFromResponse);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: string) => {
    deletePost(id, {withCredentials:true})
      .then((response) => {
        toast.success(response.data.message);
        setFetchTrigger(!fetchTrigger);
        navigate(`${VENDOR.VIEW_POSTS}`);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log("here", error);
      });
  };

  return (
    <>
      <Layout>
        <Breadcrumb pageName="Posts" folderName="" />
        {posts?.length == 0 ? (
          <Typography
            variant="h5"
            color="deep-purple"
            className="text-center mt-4"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            No post added!
          </Typography>
        ) : (
          ""
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 m-2">
          {posts.map(({ imageUrl, caption, _id }, index) => (
            <div key={index} className="card shadow-lg rounded-lg relative">
              <div className="card-body">
                <img
                  className="h-40 w-full max-w-full rounded-lg object-cover object-center"
                  src={imageUrl}
                  alt="gallery-photo"
                />
                <button
                  onClick={() => handleDelete(_id)}
                  className="absolute top-0 right-0 m-2 bg-danger hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <p className="mt-4 text-center p-2">{caption}</p>
              </div>
            </div>
          ))}
        </div>
        {posts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            isTable={false}
          />
        )}
      </Layout>
    </>
  );
}