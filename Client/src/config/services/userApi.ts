import { UserData } from './../../interfaces/userTypes';
import { createAxiosInstance } from "./axiosInstance";

const userAxios = createAxiosInstance("user", "user");

//Vendor
  const getVendorTypes = async () => {
    const response = await userAxios.get('/vendor-types');
    return response;
  };

  const getVendors = async (config: object) => {
    const response = await userAxios.get(`/getvendors?page=${""}&search=${""}&category=${""}&location=${""}&sort=${""}`, config);
    return response;
  };

  const getSuggestions = async (value: string) => {
    const response = await userAxios.get(`/suggestions?term=${value}`);
    return response;
  };

  const getVendorPosts = async (id: string | null, page: number, pageSize: number) => {
    const response = await userAxios.get(`/posts?vendorid=${id}&page=${page}&pageSize=${pageSize}`);
    return response;
  };

  const getVendor = async (id: string) => {
    const response = await userAxios.get(`/getvendor?vendorid=${id}`);
    return response;
  };

  const getVendorServices = async (id: string) => {
    const response = await userAxios.get(`/getservices?vendorId=${id}`);
    return response;
  }

  const getDate = async (vendorId: string | undefined,  config: object) => {
    const response = await userAxios.get(`/load-dates?vendorId=${vendorId}`, config);
    return response;
  };

  const addToFavourite = async (id: string, userId: string, config: object) => {
    const response = await userAxios.post(`/add-favorite-vendor?vendorId=${id}&userId=${userId}`, config);
    return response;
  };

  const getLocations = async () => {
    const response = await userAxios.get('/get-locations');
    return response;
  };

  const getAllVendors = async (search: string, page: number, category: string[], location: string[], sort: number | undefined) => {
    const response = await userAxios.get(`/getvendors?search=${search}&page=${page}&category=${category.join(",")}&location=${location.join(",")}&sort=${sort}`);
    return response;
  };

//Contact
const contact = async (formValues: object, config: object) => {
  const response = await userAxios.post('/send-message', formValues, config);
  return response.data;
};

// Profile
const updateProfile = async (user: UserData | null, formValues: object, config: object) => {
  const response = await userAxios.put(`/update-profile?userid=${user?.id}`, formValues, config);
  return response;
};

const changePwd = async (userId: string | undefined, formValues: object, config: object) => {
    const response = await userAxios.post(`/update-password?userid=${userId}`, formValues, config);
    return response.data;
  };

  const getFavourites = async (userId: string | undefined, page: number, config: object) => {
    const response = await userAxios.get(`/get-favorite-vendor?userid=${userId}&page=${page}`, config);
    return response.data;
  };

  const deleteFavourite = async (userId: string | undefined, id: string, config: object) => {
    const response = await userAxios.delete(`/delete-favorite-vendor?vendorId=${id}&userId=${userId}`, config);
    return response.data;
  };

  const notificationCount = async () => {
    const response = await userAxios.get('/notification-count');
    return response;
  };

  //Booking

  const bookEvent = async (vendorId: string | null, userId: string | undefined, data: object, config: object) => {
    const response = await userAxios.post(`/book-vendor?vendorId=${vendorId}&userId=${userId}`, data, config);
    return response;
  };

  const getBooking = async (userId: string | undefined, page: number, config: object) => {
    const response = await userAxios.get(`/get-bookings?userId=${userId}&page=${page}`, config);
    return response;
  }

  const getSingleBooking = async (bookingId: string | null) => {
    const response = await userAxios.get(`/single-booking?bookingId=${bookingId}`);
    return response;
  }

  const cancelBooking = async (bookingId: string | null) => {
    const response = await userAxios.put(`/cancel-booking?bookingId=${bookingId}`);
    return response;
  }

  const markPaymentFailed = async (bookingId: string) => {
    return await userAxios.patch(`/mark-payment-failed?bookingId=${bookingId}`);
  };

  //Chat

  const getVendorForChat = async (id: string | undefined) => {
    const response = await userAxios.get(`/getvendor?vendorid=${id}`);
    return response;
  };

  //Reviews

  const addReview = async (vendorId: string | undefined, userId: string, rating: number, content: string) => {
    const response = await userAxios.post(`/addVendorReview`, { vendorId, userId, rating, content });
    return response;
  }

  const getReviews = async (vendorId: string, page: number, pageSize: number) => {
    const response = await userAxios.get(
      `/getReviews?vendorId=${vendorId}&page=${page}&pageSize=${pageSize}`
    );
    return response;
  };

  const checkIfUserReviewed = async (userId: string, vendorId: string) => {
    const response = await userAxios.get(`/checkReviews?userId=${userId}&vendorId=${vendorId}`);
    return response;
  };

  const updateReview = async(reviewId: string, content: string, rating: number) => {
    const response = await userAxios.patch(`/update-review?reviewId=${reviewId}`, { content, rating });
    return response;
  }

  const deleteReview = async(reviewId: string) => {
    const response = await userAxios.delete(`/delete-review?reviewId=${reviewId}`);
    return response;
  };

  //Wallet

  const loadWallet = async(userId: string | undefined) => {
    const response = await userAxios.get(`/load-wallet?userId=${userId}`);
    return response;
  }

  const getTransactionDetails = async(userId: string | undefined, page: number) => {
    const response = await userAxios.get(`/wallet-ledger?userId=${userId}&page=${page}&pageSize=10`);
    return response;
  }

  //Payment

  const makePayment = async (userId: string | undefined, vendorId: string, bookingId: string, name: string, logoUrl: string, useWallet: boolean) => {
    const response = await userAxios.post(`/create-checkout-session`, { userId, vendorId, bookingId, name, logoUrl, useWallet});
    return response;
  }

  const addPayment = async (session_id: string) => {
    const response = await userAxios.get(`/add-payment?sessionId=${session_id}`);
    return response;
  }



  export {
    getVendorTypes,
    getVendors,
    getSuggestions,
    getVendorPosts,
    getVendor,
    getVendorServices,
    getDate,
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
    markPaymentFailed,
    getVendorForChat,
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