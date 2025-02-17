import { UserData } from './../../interfaces/userTypes';
import { createAxiosInstance } from "./axiosInstance";

const userApi = createAxiosInstance("user");

//Vendor Types
  const getVendorTypes = async (config: object) => {
    try {
      const response = await userApi.get('/vendor-types', config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getVendors = async (config: object) => {
    try {
      const response = await userApi.get(`/getvendors?page=${""}&search=${""}&category=${""}&location=${""}&sort=${""}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getVendorPosts = async (id: string | null, config: object) => {
    try {
      const response = await userApi.get(`/posts?vendorid=${id}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getVendor = async (id: string, config: object) => {
    try {
      const response = await userApi.get(`/getvendor?vendorid=${id}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const addToFavourite = async (id: string, userId: string, config: object) => {
    try {
      const response = await userApi.post(`/add-favorite-vendor?vendorId=${id}&userId=${userId}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getLocations = async (config: object) => {
    try {
      const response = await userApi.get('/get-locations', config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getAllVendors = async (search: string, page: number, category: string[], location: string[], sort: number | undefined, config: object) => {
    try {
      const response = await userApi.get(`/getvendors?search=${search}&page=${page}&category=${category.join(",")}&location=${location.join(",")}&sort=${sort}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

//Contact
const contact = async (formValues: object, config: object) => {
  try {
    const response = await userApi.post('/send-message', formValues, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Profile
const updateProfile = async (user: UserData | null, formValues: object, config: object) => {
  try {
    const response = await userApi.put(`/update-profile?userid=${user?.id}`, formValues, config);
    return response;
  } catch (error) {
    throw error;
  }
};

//Change Password
const changePwd = async (userId: string | undefined, formValues: object, config: object) => {
    try {
      const response = await userApi.post(`/update-password?userid=${userId}`, formValues, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  //Favourites
  const getFavourites = async (userId: string | undefined, page: number, config: object) => {
    try {
      const response = await userApi.get(`/get-favorite-vendor?userid=${userId}&page=${page}`, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  //Delete Favorites
  const deleteFavourite = async (userId: string | undefined, id: string, config: object) => {
    try {
      const response = await userApi.delete(`/delete-favorite-vendor?vendorId=${id}&userId=${userId}`, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const notificationCount = async () => {
    try {
      const response = await userApi.get('/notification-count');
      return response;
    } catch (error) {
      throw error;
    }
  };

  //Booking

  const bookEvent = async (vendorId: string | null, userId: string | undefined, data: object, config: object) => {
    try {
      const response = await userApi.post(`/book-vendor?vendorId=${vendorId}&userId=${userId}`, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getBooking = async (userId: string | undefined, page: number, config: object) => {
    try {
      const response = await userApi.get(`/get-bookings?userId=${userId}&page=${page}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  //Chat

  const getVendorForChat = async (id: string | undefined) => {
    try {
      const response = await userApi.get(`/getvendor?vendorid=${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getUserForChat = async (id: string | undefined) => {
    try {
      const response = await userApi.get(`/getuser?userId=${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteForEveryone = async (data: object, config: object) => {
    try {
      const response = await userApi.patch("/delete-for-everyone", data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteForMe = async (data: object, config: object) => {
    try {
      const response = await userApi.patch("/delete-for-me", data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  //Review

  const addReview = async (vendorId: string | undefined, userId: string, rating: number, content: string) => {
    try {
      const response = await userApi.post(`/addVendorReview`, { vendorId, userId, rating, content });
      return response;
    } catch (error) {
      throw error;
    }
  }

  const getReviews = async (vendorId: string, page: number, pageSize: number) => {
    try {
      const response = await userApi.get(
        `/getReviews?vendorId=${vendorId}&page=${page}&pageSize=${pageSize}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const checkIfUserReviewed = async (userId: string, vendorId: string) => {
    try {
      const response = await userApi.get(`/checkReviews?userId=${userId}&vendorId=${vendorId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateReview = async(reviewId: string, content: string, rating: number) => {
    try {
      const response = await userApi.patch(`/update-review?reviewId=${reviewId}`, { content, rating });
      return response;
    } catch (error) {
      throw error;
    }
  }

  const deleteReview = async(reviewId: string) => {
    try {
      const response = await userApi.delete(`/delete-review?reviewId=${reviewId}`);
      return response;
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
    addReview,
    getReviews,
    checkIfUserReviewed,
    updateReview,
    deleteReview,
  }

