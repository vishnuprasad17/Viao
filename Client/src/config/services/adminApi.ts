import { createAxiosInstance } from "./axiosInstance";


//Profile

const getUsers = async (page : string | number, search: string) => {
    const authApi = createAxiosInstance("admin");
    try {
      const response = await authApi.get(`/users?page=${page}&search=${search}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const blockUsers = async (userId: string) => {
    const authApi = createAxiosInstance("admin");
    try {
      const response = await authApi.patch(`/block-unblock?userId=${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getVendors = async (page: number, config: object) => {
    const authApi = createAxiosInstance("admin");
    try {
      const response = await authApi.get(`/getvendors?page=${page}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getVendorProfile = async (Id: string | null) => {
    const authApi = createAxiosInstance("admin");
    try {
      const response = await authApi.get(`/getvendor?vendorid=${Id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const blockVendors = async (Id: string | null) => {
    const authApi = createAxiosInstance("admin");
    try {
      const response = await authApi.patch(`/vendorblock-unblock?VendorId=${Id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateVerify = async (data: object, config: object) => {
    const authApi = createAxiosInstance("admin");
    try {
      const response = await authApi.put(`/update-verify-status`, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  //Vendor Types
  const getVendorTypes = async () => {
    const authApi = createAxiosInstance("admin");
    try {
      const response = await authApi.get('/vendor-types');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteVendorTypes = async (vendorTypeId: string, config: object) => {
    const authApi = createAxiosInstance("admin");
    try {
      const response = await authApi.delete(`/delete-vendortype?id=${vendorTypeId}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const addVendorTypes = async (formData: FormData, config: object) => {
    const authApi = createAxiosInstance("admin");
    try {
      const response = await authApi.post('/add-type', formData, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getSingleVendorTypes = async (vendorTypeId: string) => {
    const authApi = createAxiosInstance("admin");
    try {
      const response = await authApi.get(`/single-type?id=${vendorTypeId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateVendorTypes = async (vendorTypeId: string, formData: FormData, config: object) => {
    const authApi = createAxiosInstance("admin");
    try {
      const response = await authApi.put(`/update-type?id=${vendorTypeId}`, formData, config);
      return response;
    } catch (error) {
      throw error;
    }
  };


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
  }