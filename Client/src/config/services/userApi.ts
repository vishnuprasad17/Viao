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

  const getVendor = async (id: string, config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.get(`/getvendor?vendorid=${id}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const addToFavourite = async (id: string, userId: any, config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.post(`/add-favorite-vendor?vendorId=${id}&userId=${userId}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getLocations = async (config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.get('/get-locations', config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getAllVendors = async (search: string, page: number, category: string[], location: string[], sort: number | undefined, config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.get(`/getvendors?search=${search}&page=${page}&category=${category.join(",")}&location=${location.join(",")}&sort=${sort}`, config);
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

  const notificationCount = async () => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.get('/notification-count');
      return response;
    } catch (error) {
      throw error;
    }
  };

  //Booking

  const bookEvent = async (vendorId: string | null, userId: string | undefined, data: any, config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.post(`/book-vendor?vendorId=${vendorId}&userId=${userId}`, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getBooking = async (userId: string | undefined, page: number, config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.get(`/get-bookings?userId=${userId}&page=${page}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  //Chat

  const getVendorForChat = async (id: string | undefined) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.get(`/getvendor?vendorid=${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getUserForChat = async (id: string | undefined) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.get(`/getuser?userId=${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteForEveryone = async (data: any, config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.patch("/delete-for-everyone", data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteForMe = async (data: any, config: any) => {
    const authApi = createAxiosInstance("user");
    try {
      const response = await authApi.patch("/delete-for-me", data, config);
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
    getLocations,
    getAllVendors,
    contact,
    updateProfile,
    changePwd,
    getFavourites,
    deleteFavourite,
    notificationCount,
    bookEvent,
    getBooking,
    getVendorForChat,
    getUserForChat,
    deleteForEveryone,
    deleteForMe,
  }

