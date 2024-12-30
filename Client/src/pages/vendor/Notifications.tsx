
import Breadcrumb from '../../components/vendor/Breadcrumbs/Breadcrumb'
import NotifyCard from '../../components/vendor/Notification/NotifyCard'
import Layout from '../../layout/vendor/Layout'

const Notifications = () => {
  return (
    <Layout>
    <Breadcrumb pageName="Notifications" folderName="" />
        <NotifyCard/>
    </Layout>
  )
}

export default Notifications