import AddVendorType from '../../../components/admin/vendorTypes/AddVendorType'
import VendorTypeList from '../../../components/admin/vendorTypes/VendorTypeList'

function VendorTypes() {



  return (
    <div className="m-10">
        <AddVendorType/>
        <div className="mt-8">
        <VendorTypeList/>
        </div>
    </div>
  )
}

export default VendorTypes