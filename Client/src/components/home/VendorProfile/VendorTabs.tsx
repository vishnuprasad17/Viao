import { SetStateAction, useEffect, useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
  Typography,
} from "@material-tailwind/react";
import VendorPosts from "./VendorsPosts";
import { Review } from "../../../interfaces/commonTypes";
import ReviewCard from "./ReviewCard";
import { getReviews } from "../../../config/services/userApi";
import Pagination from "../../common/Pagination"; // Import your Pagination component

interface VendorTabsProps {
  refreshKey: number;
  onRefresh: () => void;
}

const VendorTabs: React.FC<VendorTabsProps> = ({ refreshKey, onRefresh }) => {
  const [activeTab, setActiveTab] = useState("images");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Initial page size
  const [totalPages, setTotalPages] = useState(0);
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id") || "";
  const [reviews, setReviews] = useState<Review[]>([]);

  // Fetch reviews when page or pageSize changes
  useEffect(() => {
    getReviews(id, currentPage, pageSize)
      .then((response) => {
        setReviews(response.data.reviews);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, [id, currentPage, pageSize, refreshKey]);

  // Handle tab change
  const handleTabChange = (value: SetStateAction<string>) => {
    setActiveTab(value);
  };

  // Handle "View More Reviews" click
  const handleViewMore = () => {
    setPageSize(12); // Switch to 12 items per page
    setCurrentPage(1); // Reset to first page
  };

  // Handle page change in pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const data = [
    {
      label: "Images",
      value: "images",
    },
    {
      label: "Reviews",
      value: "reviews",
    },
  ];

  return (
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      className="mx-5 sm:mx-10 md:mx-10 lg:mx-20 mb-10"
    >
      <TabsHeader
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        className="z-0 bg-red-100"
      >
        {data.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {data.map(({ value }) => (
          <TabPanel key={value} value={value}>
            {value === "images" && <VendorPosts />}
            {value === "reviews" && (
              <>
                {reviews?.length === 0 && (
                  <Typography
                    variant="h5"
                    color="pink"
                    className="mt-4"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    No reviews added!
                  </Typography>
                )}
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  {reviews?.map((review, index) => (
                    <ReviewCard key={index} {...review} onUpdate={onRefresh} />
                  ))}
                </div>
                {reviews?.length > 0 && (
                  <div className="flex flex-col items-center mt-10 gap-4">
                    {pageSize === 6 && totalPages > 1 && (
                      <Button
                        variant="text"
                        size="lg"
                        className="text-gray-500"
                        onClick={handleViewMore}
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        View More Reviews
                      </Button>
                    )}
                    {pageSize === 12 && totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageChange={handlePageChange}
                        isTable={false} // Set to true if you want the table-style pagination
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
};

export default VendorTabs;