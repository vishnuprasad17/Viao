import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Checkbox,
} from "@material-tailwind/react";


interface IconProps {
  id: number;
  open: number;
}

interface VendorFiltersProps {
  setSelectLocation: React.Dispatch<React.SetStateAction<string[]>>; // Correct type for state setter
  vendorTypeData: { id: string; type: string }[]; // Correct type for vendor data
  locations: string[];
  setCategory: React.Dispatch<React.SetStateAction<string[]>>; // Correct type for state setter
}


function Icon({ id, open }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}



const VendorFilters:React.FC<VendorFiltersProps>=({
  setSelectLocation,
  vendorTypeData,
  locations,
  setCategory,
}) => {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value: React.SetStateAction<number>) =>
    setOpen(open === value ? 0 : value);

  const handleCategoryChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = e.target;
    if (checked) {
      setCategory((prevCategories) => [...prevCategories, value]);
    } else {
      setCategory((prevCategories) =>
        prevCategories.filter((category) => category !== value)
      );
    }
  };

  const handleLocationChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectLocation((prevLocation) => [...prevLocation, value]);
    } else {
      setSelectLocation((prevLocation) =>
        prevLocation.filter((location) => location !== value)
      );
    }
  };

  return (
    <>
      <Accordion
        open={open === 1}
        icon={<Icon id={1} open={open} />}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        className="w-60"
      >
        <AccordionHeader
          onClick={() => handleOpen(1)}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          className="text-md md:text-md"
        >
          Category
        </AccordionHeader>
        <AccordionBody>
          {vendorTypeData.map((category) => (
            <Checkbox
              key={category.id}
              label={category.type}
              onChange={handleCategoryChange}
              value={category.id}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
          ))}
        </AccordionBody>
      </Accordion>
      <Accordion
        open={open === 2}
        icon={<Icon id={2} open={open} />}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        className="w-60"
      >
        <AccordionHeader
          onClick={() => handleOpen(2)}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          className="text-md md:text-md"
        >
          Location
        </AccordionHeader>
        <AccordionBody>
          {locations?.map((location, index) => (
            <Checkbox
              key={index}
              label={location}
              value={location}
              onChange={handleLocationChange}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
          ))}
        </AccordionBody>
      </Accordion>
    </>
  );
};

export default VendorFilters;