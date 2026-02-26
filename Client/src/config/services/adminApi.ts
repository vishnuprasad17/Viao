import { createAxiosInstance } from "./axiosInstance";

const adminAxios = createAxiosInstance("admin", "admin");

//Profile

const getUsers = async (page : string | number, search: string) => {
    try {
      const response = await adminAxios.get(`/users?page=${page}&search=${search}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const blockUsers = async (userId: string) => {
    try {
      const response = await adminAxios.patch(`/block-unblock?userId=${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getVendors = async (page: number, config: object) => {
    try {
      const response = await adminAxios.get(`/getvendors?page=${page}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getVendorProfile = async (Id: string | null) => {
    try {
      const response = await adminAxios.get(`/getvendor?vendorid=${Id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const blockVendors = async (Id: string | null) => {
    try {
      const response = await adminAxios.patch(`/vendorblock-unblock?VendorId=${Id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateVerify = async (data: object, config: object) => {
    try {
      const response = await adminAxios.put(`/update-verify-status`, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  //Vendor Types
  const getVendorTypes = async () => {
    try {
      const response = await adminAxios.get('/vendor-types');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteVendorTypes = async (vendorTypeId: string, config: object) => {
    try {
      const response = await adminAxios.delete(`/delete-vendortype?id=${vendorTypeId}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const addVendorTypes = async (formData: FormData, config: object) => {
    try {
      const response = await adminAxios.post('/add-type', formData, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getSingleVendorTypes = async (vendorTypeId: string) => {
    try {
      const response = await adminAxios.get(`/single-type?id=${vendorTypeId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateVendorTypes = async (vendorTypeId: string, formData: FormData, config: object) => {
    try {
      const response = await adminAxios.put(`/update-type?id=${vendorTypeId}`, formData, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Wallet

  const getPaymentDetails = async (page: number) => {
    try {
      const response = await adminAxios.get(`/all-payment-details?page=${page}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  const getAdminData = async (adminId: string | undefined) => {
    try {
      const response = await adminAxios.get(`/load-admin-data?adminId=${adminId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  //Dashboard
  const getAnalytics = async (date: string) => {
    try {
      const response = await adminAxios.get(`/analytics?date=${date}`);
      return response;
    } catch (error) {
      throw error;
    }
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
    getAnalytics,
  }