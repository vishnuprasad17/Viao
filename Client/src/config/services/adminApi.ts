import { createAxiosInstance } from "./axiosInstance";

const adminAxios = createAxiosInstance("admin", "admin");

//Profile

const getUsers = async (page : string | number, search: string) => {
    const response = await adminAxios.get(`/users?page=${page}&search=${search}`);
    return response;
  };

  const blockUsers = async (userId: string) => {
    const response = await adminAxios.patch(`/block-unblock?userId=${userId}`);
    return response;
  };

  const getVendors = async (page: number, config: object) => {
    const response = await adminAxios.get(`/getvendors?page=${page}`, config);
    return response;
  };

  const getVendorProfile = async (Id: string | null) => {
    const response = await adminAxios.get(`/getvendor?vendorid=${Id}`);
    return response;
  };

  const blockVendors = async (Id: string | null) => {
    const response = await adminAxios.patch(`/vendorblock-unblock?VendorId=${Id}`);
    return response;
  };

  const updateVerify = async (data: object, config: object) => {
    const response = await adminAxios.put(`/update-verify-status`, data, config);
    return response;
  };

  //Vendor Types
  const getVendorTypes = async () => {
    const response = await adminAxios.get('/vendor-types');
    return response;
  };

  const deleteVendorTypes = async (vendorTypeId: string, config: object) => {
    const response = await adminAxios.delete(`/delete-vendortype?id=${vendorTypeId}`, config);
    return response;
  };

  const addVendorTypes = async (formData: FormData, config: object) => {
    const response = await adminAxios.post('/add-type', formData, config);
    return response;
  };

  const getSingleVendorTypes = async (vendorTypeId: string) => {
    const response = await adminAxios.get(`/single-type?id=${vendorTypeId}`);
    return response;
  };

  const updateVendorTypes = async (vendorTypeId: string, formData: FormData, config: object) => {
    const response = await adminAxios.put(`/update-type?id=${vendorTypeId}`, formData, config);
    return response;
  };

  // Wallet

  const getPaymentDetails = async (page: number) => {
    const response = await adminAxios.get(`/all-payment-details?page=${page}`);
    return response;
  }

  const getAdminData = async (adminId: string | undefined) => {
    const response = await adminAxios.get(`/load-admin-data?adminId=${adminId}`);
    return response;
  }

  const getAdminWalletLedger = async (adminId: string | undefined, page: number) => {
      const response = await adminAxios.get(`/wallet-ledger?adminId=${adminId}&page=${page}&pageSize=10`);
      return response;
  }

  //Bookings

  const updateBookingRemark = async (bookingId: string, remark: string) => {
    return await adminAxios.patch(`/booking-remark?bookingId=${bookingId}`, { remark });
  };

  //Dashboard
  const getAnalytics = async (date: string) => {
    const response = await adminAxios.get(`/analytics?date=${date}`);
    return response;
  }


  export {
    getUsers,
    blockUsers,
    getVendors,
    getVendorProfile,
    blockVendors,
    updateVerify,
    getVendorTypes,
    deleteVendorTypes,
    addVendorTypes,
    getSingleVendorTypes,
    updateVendorTypes,
    getPaymentDetails,
    getAdminData,
    getAdminWalletLedger,
    updateBookingRemark,
    getAnalytics,
  }