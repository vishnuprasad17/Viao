import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../../../../components/vendor/Breadcrumbs/Breadcrumb";
import { useSelector } from "react-redux";
import VendorRootState from "../../../../redux/rootstate/VendorState";
import { useEffect, useState } from "react";
import { deletePost, getPost } from "../../../../config/services/venderApi";
import { toast } from "react-hot-toast";
import Pagination from "../../../../components/common/Pagination";
import { Post } from "../../../../interfaces/postTypes";
import { Typography } from "@material-tailwind/react";
import Layout from "../../../../layout/vendor/Layout";

export default function Posts() {
  const vendorData = useSelector(
    (state: VendorRootState) => state.vendor.vendordata
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page: number) => {
    try {
      const response = await getPost(
        vendorData?.id, 
        page,
        { withCredentials: true }
      );
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id, { withCredentials: true });
      // Optimistic UI update
      setPosts(prev => prev.filter(post => post.id !== id));
      toast.success("Post deleted successfully");
      
      // Re-fetch posts if on last page and items count changes
      if (posts.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        fetchPosts(currentPage);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  return (
    <Layout>
      <Breadcrumb pageName="Posts" folderName="" />
      
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {posts.length === 0 ? (
          <div className="mt-12 text-center">
            <Typography
              variant="h4"
              color="blue-gray"
              className="mb-4"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              📷 No Posts Found
            </Typography>
            <Typography
              variant="paragraph"
              className="text-gray-600"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Get started by creating your first post!
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map(({ imageUrl, caption, id }) => (
              <div 
                key={id}
                className="relative group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-square">
                  <img
                    className="w-full h-full object-cover"
                    src={imageUrl}
                    alt="Post content"
                    loading="lazy"
                  />
                  <button
                    onClick={() => handleDelete(id)}
                    className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  </button>
                </div>
                
                {caption && (
                  <div className="p-4 border-t border-gray-100">
                    <Typography
                      variant="small"
                      className="text-gray-700 line-clamp-3"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {caption}
                    </Typography>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              isTable={false}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}