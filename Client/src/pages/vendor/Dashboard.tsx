import React from "react";
import { useSelector } from "react-redux";
import VendorRootState from "../../redux/rootstate/VendorState";
import Layout from "../../layout/vendor/Layout";


const Dashboard: React.FC = () => {
  const vendor = useSelector(
    (state: VendorRootState) => state.vendor.vendordata
  );

  return (
    <Layout>
      <div className="text-black">
        Welcome {vendor?.name}
      </div>
      
    </Layout>
  );
};

export default Dashboard;
