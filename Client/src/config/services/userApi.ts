import { UserData } from './../../interfaces/userTypes';
import { createAxiosInstance } from "./axiosInstance";


//Vendor Types
  const getVendorTypes = async (config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.get('/vendor-types', config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getVendors = async (config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.get(`/getvendors?page=${""}&search=${""}&category=${""}&location=${""}&sort=${""}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getVendorPosts = async (id: string | null, config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.get(`/posts?vendorid=${id}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

//Contact
const contact = async (formValues: any, config: any) => {
  const authApi = createAxiosInstance("user");
  try {
    const response = await authApi.post('/send-message', formValues, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Profile
const updateProfile = async (user: UserData | null, formValues: any, config: any) => {
  const authApi = createAxiosInstance("user");
  try {
    const response = await authApi.put(`/update-profile?userid=${user?._id}`, formValues, config);
    return response;
  } catch (error) {
    throw error;
  }
};

//Change Password
const changePwd = async (userId: any, formValues: any, config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.post(`/update-password?userid=${userId}`, formValues, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  //Favourites
  const getFavourites = async (userId: any, page: number, config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.get(`/get-favorite-vendor?userid=${userId}&page=${page}`, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  //Delete Favorites
  const deleteFavourite = async (userId: any, id: string, config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.delete(`/delete-favorite-vendor?vendorId=${id}&userId=${userId}`, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };






  export {
    getVendorTypes,
    getVendors,
    getVendorPosts,
    getVendor,
    addToFavourite,
    contact,
    updateProfile,
    changePwd,
    getFavourites,
    deleteFavourite,
  }

