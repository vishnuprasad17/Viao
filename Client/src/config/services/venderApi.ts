import { createAxiosInstance } from "./axiosInstance";

const vendorApi = createAxiosInstance("vendor");


//Profile

const getVendor = async (vendorId: string | undefined, config?: object) => {
    try {
      const response = config
        ? await vendorApi.get(`/getvendor?vendorid=${vendorId}`, config)
        : await vendorApi.get(`/getvendor?vendorid=${vendorId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };
  
const verifyRequest = async (data: object, config: object) => {
  try {
    const response = await vendorApi.post(`/verification-request`, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (vendorId: string | undefined, credential: object, config: object) => {
  try {
    const response = await vendorApi.put(`/update-profile?vendorid=${vendorId}`, credential, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const updatePassword = async (vendorId: string | undefined, credential: object, config: object) => {
  try {
    const response = await vendorApi.patch(`/update-password?vendorid=${vendorId}`, credential, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const getPost = async (vendorId: string | undefined, page: number, config: object) => {
  try {
    const response = await vendorApi.get(`/posts?vendorid=${vendorId}&page=${page}`, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const deletePost = async (id: string, config: object) => {
  try {
    const response = await vendorApi.delete(`/posts/${id}`, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const addPost = async (vendorId: any, credential: object, config: object) => {
  try {
    const response = await vendorApi.post(`/add-post?vendorid=${vendorId}`, credential, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const getDate = async (vendorId: string | undefined,  config: object) => {
  try {
    const response = await vendorApi.get(`/load-dates?vendorId=${vendorId}`, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const addDate = async (credential: object, config: object) => {
  try {
    const response = await vendorApi.post(`/add-dates`, credential, config);
    return response;
  } catch (error) {
    throw error;
  }
};

// Services

const createService = async (vendorId: string | undefined, data: { name: string; price: number }) => {
  try {
    const response = await vendorApi.post(`add-service`, { vendorId, name: data.name, price: data.price });
    return response;
  } catch (error) {
    throw error;
  }
}

const updateService = async (serviceId: string, data: { name: string; price: number }) => {
  try {
    const response = await vendorApi.patch(`update-service?serviceId=${serviceId}`, { name: data.name, price: data.price });
    return response;
  } catch (error) {
    throw error;
  }
}

const getServices = async (vendorId: string | undefined, page: number) => {
  try {
    const response = await vendorApi.get(`/services?vendorId=${vendorId}&page=${page}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const getServicesForPage = async (vendorId: string | undefined) => {
  try {
    const response = await vendorApi.get(`/getservices?vendorId=${vendorId}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const deleteService = async (serviceId: string) => {
  try {
    const response = await vendorApi.delete(`/delete-service?serviceId=${serviceId}`);
    return response;
  } catch (error) {
    throw error;
  }
}

//Booking

const getBooking = async (vendorId: string | undefined, page: number, pageSize: number, search: string, paymentStatus: string) => {
  try {
    const response = await vendorApi.get(`/booking-details?vendorId=${vendorId}&page=${page}&pageSize=${pageSize}&search=${search}&paymentStatus=${paymentStatus}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const getSingleBooking = async (bookingId: string | null) => {
  try {
    const response = await vendorApi.get(`/single-booking-details?bookingId=${bookingId}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const updateBookingStatus = async (bookingId: string | undefined, status: string | undefined) => {
  try {
    const response = await vendorApi.put(`/update-booking-status?bookingId=${bookingId}`, { status });
    return response;
  } catch (error) {
    throw error;
  }
}

//Chat
const deleteForEveryone = async (data: object, config: object) => {
  try {
    const response = await vendorApi.patch("/delete-for-everyone", data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteForMe = async (data: object, config: object) => {
  try {
    const response = await vendorApi.patch("/delete-for-me", data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Review
const getReviews = async (vendorId: string | undefined, page: number) => {
  try {
    const response = await vendorApi.get(`/getReviews?vendorId=${vendorId}&page=${page}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const getReviewStatistics = async (vendorId: string | undefined) => {
  try {
    const response = await vendorApi.get(`/reviews/statistics?vendorId=${vendorId}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const addReply = async (reviewId: string, content: string) => {
  try {
    const response = await vendorApi.put(`/add-review-reply?&reviewId=${reviewId}`, { content });
    return response;
  } catch (error) {
    throw error;
  }
}

//Dashboard
const getAnalytics = async (vendorId: string | undefined, date: string) => {
  try {
    const response = await vendorApi.get(`/analytics?vendorId=${vendorId}&date=${date}`);
    return response;
  } catch (error) {
    throw error;
  }
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
    addDate,
    createService,
    updateService,
    getServices,
    getServicesForPage,
    deleteService,
    getBooking,
    getSingleBooking,
    updateBookingStatus,
    deleteForEveryone,
    deleteForMe,
    getReviews,
    getReviewStatistics,
    addReply,
    getAnalytics,
}