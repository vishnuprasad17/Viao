import {Navigate, Outlet} from 'react-router-dom'
import { useSelector } from 'react-redux'
import VendorRootState from '../../redux/rootstate/VendorState';
import { VENDOR } from '../../config/routes/vendorRoutes';


const VendorPrivateRoute = () => {
    const vendor = useSelector((state : VendorRootState) => state.vendor.vendordata);
  
    if(!vendor) {
      return <Navigate to={`${VENDOR.LOGIN}`} replace/>
    }

    return <Outlet />
}

export default VendorPrivateRoute