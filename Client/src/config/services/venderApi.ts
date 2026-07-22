import { ServiceFormData } from "../../interfaces/commonTypes";
import { createAxiosInstance } from "./axiosInstance";

const vendorAxios = createAxiosInstance("vendor", "vendor");


//Profile

const getVendor = async (vendorId: string | undefined, config?: object) => {
  const response = config
      ? await vendorAxios.get(`/getvendor?vendorid=${vendorId}`, config)
      : await vendorAxios.get(`/getvendor?vendorid=${vendorId}`);
    return response;
  };
  
const verifyRequest = async (data: object, config: object) => {
  const response = await vendorAxios.post(`/verification-request`, data, config);
  return response;
};

const updateProfile = async (vendorId: string | undefined, credential: object, config: object) => {
  const response = await vendorAxios.put(`/update-profile?vendorid=${vendorId}`, credential, config);
  return response;
};

const updatePassword = async (vendorId: string | undefined, credential: object, config: object) => {
  const response = await vendorAxios.patch(`/update-password?vendorid=${vendorId}`, credential, config);
  return response;
};

const getPost = async (vendorId: string | undefined, page: number, config: object) => {
  const response = await vendorAxios.get(`/posts?vendorid=${vendorId}&page=${page}`, config);
  return response;
};

const deletePost = async (id: string, config: object) => {
  const response = await vendorAxios.delete(`/posts/${id}`, config);
  return response;
};

const addPost = async (vendorId: any, credential: object, config: object) => {
  const response = await vendorAxios.post(`/add-post?vendorid=${vendorId}`, credential, config);
  return response;
};

const getDate = async (vendorId: string | undefined,  config: object) => {
  const response = await vendorAxios.get(`/load-dates?vendorId=${vendorId}`, config);
  return response;
};

const bulkBlockDates = async (vendorId: string, dates: string[]) => {
  const response = await vendorAxios.post('/bulk-block-dates', { vendorId, dates });
  return response;
};

// Services

const createService = async (vendorId: string | undefined, data: ServiceFormData) => {
  return await vendorAxios.post(`add-service`, { vendorId, ...data });
};

const updateService = async (serviceId: string, data: ServiceFormData) => {
  return await vendorAxios.patch(`update-service?serviceId=${serviceId}`, data);
};

const getServices = async (vendorId: string | undefined, page: number) => {
  const response = await vendorAxios.get(`/services?vendorId=${vendorId}&page=${page}`);
  return response;
}

const deleteService = async (serviceId: string) => {
  const response = await vendorAxios.delete(`/delete-service?serviceId=${serviceId}`);
  return response;
}

//Booking

const getBooking = async (vendorId: string | undefined, page: number, pageSize: number, search: string, paymentStatus: string) => {
  const response = await vendorAxios.get(`/booking-details?vendorId=${vendorId}&page=${page}&pageSize=${pageSize}&search=${search}&paymentStatus=${paymentStatus}`);
  return response;
}

const getSingleBooking = async (bookingId: string | null) => {
  const response = await vendorAxios.get(`/single-booking-details?bookingId=${bookingId}`);
  return response;
}

const markBookingCompleted = async (bookingId: string) => {
  const response = await vendorAxios.patch(`/mark-booking-completed?bookingId=${bookingId}`);
  return response;
}

//Chat
const getUserForChat = async (id: string | undefined) => {
    const response = await vendorAxios.get(`/getuser?userId=${id}`);
    return response;
};

//Review
const getReviews = async (vendorId: string | undefined, page: number) => {
  const response = await vendorAxios.get(`/getReviews?vendorId=${vendorId}&page=${page}`);
  return response;
}

const getReviewStatistics = async (vendorId: string | undefined) => {
  const response = await vendorAxios.get(`/reviews/statistics?vendorId=${vendorId}`);
  return response;
}

const addReply = async (reviewId: string, content: string) => {
  const response = await vendorAxios.put(`/add-review-reply?&reviewId=${reviewId}`, { content });
  return response;
}

//Dashboard
const getAnalytics = async (vendorId: string | undefined, date: string) => {
  const response = await vendorAxios.get(`/analytics?vendorId=${vendorId}&date=${date}`);
  return response;
}

export {
    getVendor,
    verifyRequest,
    updateProfile,
    updatePassword,
    getPost,
    deletePost,
    addPost,
    getDate,
    bulkBlockDates,
    createService,
    updateService,
    getServices,
    deleteService,
    getBooking,
    getSingleBooking,
    markBookingCompleted,
    getUserForChat,
    getReviews,
    getReviewStatistics,
    addReply,
    getAnalytics,
}