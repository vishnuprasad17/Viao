import { Routes, Route, Navigate } from "react-router-dom";
import ChangePassword from "../../../components/user/profile/ChangePassword";
import Favourites from "../../../components/user/profile/Favourites";
import ProfileCard from "../../../components/user/profile/ProfileCard";
import Notifications from "../../../components/user/profile/Notifications";
import { USER } from "../../../config/routes/user.routes";
import Layout from "../../../layout/user/Layout";
import { useSelector } from "react-redux";
import UserRootState from "../../../redux/rootstate/UserState";


const Profile: React.FC = () => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  return (
    <>
      {!user?<Navigate to={`${USER.LOGIN}`} replace />:<Layout>
        <div className="flex-1 bg-white mt-10">
          <div
            // className="overflow-y-scroll"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            <Routes>
              <Route path="/" element={<ProfileCard />} />
              <Route path={USER.CHANGE_PWD} element={<ChangePassword />} />
              <Route path={USER.FAV} element={<Favourites />} />
              <Route path={USER.NOTIFICATION} element={<Notifications />} />
            </Routes>
          </div>
        </div>
        </Layout>}
        
  
    </>
  );
};

export default Profile;