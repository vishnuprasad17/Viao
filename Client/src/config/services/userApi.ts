import { UserData } from './../../interfaces/userTypes';
import { createAxiosInstance } from "./axiosInstance";


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
    contact,
    updateProfile,
    changePwd,
    getFavourites,
    deleteFavourite,
  }

