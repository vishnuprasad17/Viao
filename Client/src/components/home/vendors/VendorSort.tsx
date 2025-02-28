import { Select, Option } from "@material-tailwind/react";

interface VendorSortProps {
  setSort: (sortOrder: number) => void;
}

const VendorSort: React.FC<VendorSortProps> = ({ setSort }) => {
  return (
    <Select
      label="Sort by" // Use the `label` prop instead of `placeholder`
      className="!border-gray-200 w-full"
      onChange={(value) => {
        if (value === "rating") setSort(-1);
        else if (value === "-rating") setSort(1);
      }}
      menuProps={{ className: "shadow-lg" }}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <Option value="rating" className="hover:bg-purple-50">
        High Rating
      </Option>
      <Option value="-rating" className="hover:bg-purple-50">
        Low Rating
      </Option>
    </Select>
  );
};

export default VendorSort;