import { createAxiosInstance } from "./axiosInstance";


//Profile

const getVendor = async (vendorId: any, config?: any) => {
    const authApi = createAxiosInstance("vendor");
    try {
      const response = config
        ? await authApi.get(`/getvendor?vendorid=${vendorId}`, config)
        : await authApi.get(`/getvendor?vendorid=${vendorId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };
  
const verifyRequest = async (data: any, config: any) => {
    const authApi = createAxiosInstance("vendor");
  try {
    const response = await authApi.post(`/verification-request`, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (vendorId: any, credential: any, config: any) => {
    const authApi = createAxiosInstance("vendor");
  try {
    const response = await authApi.put(`/update-profile?vendorid=${vendorId}`, credential, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const updatePassword = async (vendorId: any, credential: any, config: any) => {
    const authApi = createAxiosInstance("vendor");
  try {
    const response = await authApi.patch(`/update-password?vendorid=${vendorId}`, credential, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const getPost = async (vendorId: any, page: number, config: any) => {
    const authApi = createAxiosInstance("vendor");
  try {
    const response = await authApi.get(`/posts?vendorid=${vendorId}&page=${page}`, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const deletePost = async (id: string, config: any) => {
    const authApi = createAxiosInstance("vendor");
  try {
    const response = await authApi.delete(`/posts/${id}`, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const addPost = async (vendorId: any, credential: any, config: any) => {
    const authApi = createAxiosInstance("vendor");
  try {
    const response = await authApi.post(`/add-post?vendorid=${vendorId}`, credential, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const getDate = async (vendorId: any,  config: any) => {
    const authApi = createAxiosInstance("vendor");
  try {
    const response = await authApi.get(`/load-dates?vendorId=${vendorId}`, config);
    return response;
  } catch (error) {
    throw error;
  }
};

const addDate = async (credential: any, config: any) => {
    const authApi = createAxiosInstance("vendor");
  try {
    const response = await authApi.post(`/add-dates`, credential, config);
    return response;
  } catch (error) {
    throw error;
  }
};

//Chat
const deleteForEveryone = async (data: any, config: any) => {
  const authApi = createAxiosInstance("vendor");
  try {
    const response = await authApi.patch("/delete-for-everyone", data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteForMe = async (data: any, config: any) => {
  const authApi = createAxiosInstance("vendor");
  try {
    const response = await authApi.patch("/delete-for-me", data, config);
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
    deleteForEveryone,
    deleteForMe,
}