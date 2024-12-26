import {Navigate,Outlet} from 'react-router-dom'
import { useSelector } from 'react-redux'
import AdminRootState from '../../redux/rootstate/AdminState';
import { ADMIN } from '../../config/routes/admin.routes';

const AdminPrivateRoute = () => {
    const admin = useSelector((state : AdminRootState) => state.admin.isAdminSignedIn);
  return (
    admin ? <Outlet/> :<Navigate to={`${ADMIN.LOGIN}`} replace/>
  )
}

export default AdminPrivateRoute