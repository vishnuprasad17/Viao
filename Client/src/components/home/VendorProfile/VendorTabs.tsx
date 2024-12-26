import { SetStateAction, useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import VendorPosts from "./VendorsPosts";

const VendorTabs = () => {
  const [activeTab, setActiveTab] = useState("images");

  const handleTabChange = (value: SetStateAction<string>) => {
    setActiveTab(value);
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
            
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
};

export default VendorTabs;