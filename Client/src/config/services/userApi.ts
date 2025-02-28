import { UserData } from './../../interfaces/userTypes';
import { createAxiosInstance } from "./axiosInstance";

const userApi = createAxiosInstance("user");

//Vendor Types
  const getVendorTypes = async () => {
    try {
      const response = await userApi.get('/vendor-types');
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

  const getSuggestions = async (value: string) => {
    try {
      const response = await userApi.get(`/suggestions?term=${value}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getVendorPosts = async (id: string | null, page: number, pageSize: number) => {
    try {
      const response = await userApi.get(`/posts?vendorid=${id}&page=${page}&pageSize=${pageSize}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getVendor = async (id: string) => {
    try {
      const response = await userApi.get(`/getvendor?vendorid=${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getVendorServices = async (id: string) => {
    try {
      const response = await userApi.get(`/getservices?vendorId=${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  const addToFavourite = async (id: string, userId: string, config: object) => {
    try {
      const response = await userApi.post(`/add-favorite-vendor?vendorId=${id}&userId=${userId}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getLocations = async () => {
    try {
      const response = await userApi.get('/get-locations');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getAllVendors = async (search: string, page: number, category: string[], location: string[], sort: number | undefined) => {
    try {
      const response = await userApi.get(`/getvendors?search=${search}&page=${page}&category=${category.join(",")}&location=${location.join(",")}&sort=${sort}`);
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

  const getSingleBooking = async (bookingId: string | null) => {
    try {
      const response = await userApi.get(`/single-booking?bookingId=${bookingId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  const cancelBooking = async (bookingId: string | null) => {
    try {
      const response = await userApi.put(`/cancel-booking?bookingId=${bookingId}`);
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

  //Wallet

  const loadWallet = async(userId: string | undefined) => {
    try {
      const response = await userApi.get(`/load-wallet?userId=${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  const getTransactionDetails = async(userId: string | undefined, page: number) => {
    try {
      const response = await userApi.get(`/all-transaction-details?userId=${userId}&page=${page}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  //Payment

  const makePayment = async (userId: string | undefined, vendorId: string, bookingId: string, name: string, logoUrl: string, useWallet: boolean) => {
    try {
      const response = await userApi.post(`/create-checkout-session`, { userId, vendorId, bookingId, name, logoUrl, useWallet});
      return response;
    } catch (error) {
      throw error;
    }
  }

  const addPayment = async (session_id: string) => {
    try {
      const response = await userApi.get(`/add-payment?sessionId=${session_id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }



  export {
    getVendorTypes,
    getVendors,
    getSuggestions,
    getVendorPosts,
    getVendor,
    getVendorServices,
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
    getSingleBooking,
    cancelBooking,
    getVendorForChat,
    getUserForChat,
    deleteForEveryone,
    deleteForMe,
    addReview,
    getReviews,
    checkIfUserReviewed,
    updateReview,
    deleteReview,
    loadWallet,
    getTransactionDetails,
    makePayment,
    addPayment,
  }