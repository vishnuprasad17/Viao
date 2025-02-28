import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getVendorPosts } from "../../../config/services/userApi";
import { Post } from "../../../interfaces/postTypes";
import { Button, Dialog, DialogBody, DialogHeader, Typography } from "@material-tailwind/react";
import Pagination from "../../common/Pagination";

const VendorPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Partial<Post>>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    getVendorPosts(id, currentPage, pageSize)
      .then((response) => {
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
      })
      .catch(console.error);
  }, [id, currentPage, pageSize]);

  const handleViewMore = () => {
    setPageSize(12);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleOpen = () => setOpen(!open);

  const handleClose = () => setOpen(false);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {posts.length === 0 ? (
        <Typography
          variant="h5"
          color="gray"
          className="mt-4 text-center text-gray-500"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          No posts added yet!
        </Typography>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
            {posts.map(({ imageUrl, id, caption }, index) => (
              <div
                key={index}
                className="group relative cursor-zoom-in transition-transform duration-200 hover:scale-95"
                onClick={() => {
                  setSelectedPost({ imageUrl, id, caption });
                  handleOpen();
                }}
              >
                <div className="aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                  <img
                    className="h-full w-full object-cover"
                    src={imageUrl}
                    alt="Post image"
                  />
                  {caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
                      <Typography
                        variant="paragraph"
                        color="white"
                        className="line-clamp-2 text-sm font-medium md:text-base"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {caption}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {posts.length > 0 && (
            <div className="mt-12 flex flex-col items-center gap-4">
              {pageSize === 6 && totalPages > 1 && (
                <Button
                  variant="outlined"
                  size="lg"
                  className="rounded-full border-gray-400 text-gray-600 hover:bg-gray-50"
                  onClick={handleViewMore}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  View More Images
                </Button>
              )}
              {pageSize === 12 && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                  isTable={false}
                />
              )}
            </div>
          )}
        </>
      )}

      {selectedPost && (
        <Dialog
        open={open}
        handler={handleClose}
        size="md"
        className="relative"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <DialogHeader
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {selectedPost.caption || ""}
        </DialogHeader>
        <DialogBody
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <img
            src={selectedPost.imageUrl || ""}
            alt="Post image"
            className="h-full w-full rounded-lg object-contain"
          />
        </DialogBody>
      </Dialog>
      )}
    </div>
  );
};

export default VendorPosts;