import {Navigate, Outlet} from 'react-router-dom'
import { useSelector } from 'react-redux'
import VendorRootState from '../../redux/rootstate/VendorState';
import { VENDOR } from '../../config/routes/vendor.routes';


const VendorPrivateRoute = () => {
    const vendor = useSelector((state : VendorRootState) => state.vendor.vendordata);
  return (
    vendor ?<Outlet/> :<Navigate to={`${VENDOR.LOGIN}`} replace/>
  )
}

export default VendorPrivateRoute