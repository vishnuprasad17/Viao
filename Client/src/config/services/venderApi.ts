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

//Booking

const getBooking = async (vendorId: string | undefined, page: number, config: object) => {
  try {
    const response = await vendorApi.get(`/booking-details?vendorId=${vendorId}&page=${page}`, config);
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
    getBooking,
    deleteForEveryone,
    deleteForMe,
}