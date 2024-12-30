import { createAxiosInstance} from './axiosInstance';

const getNotification = async (role: string, roleId: any, page: number, config: any) => {
    const authApi = createAxiosInstance(role);
    try {  
      let endpoint = "";
      if (role === "admin") {
         endpoint = `/admin-notifications?recipient=${roleId}&page=${page}`;
      } else if (role === "user") {
           endpoint = `/user-notifications?recipient=${roleId}&page=${page}`;
      } else if (role === "vendor") {
           endpoint = `/vendor-notifications?recipient=${roleId}&page=${page}`;
      } else {
           throw new Error("Invalid role");
      }
      const response = await authApi.get(endpoint, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const toggleRead = async (role: string, data: any, config: any) => {
    const authApi = createAxiosInstance(role);
    try {
      const response = await authApi.patch(`/toggle-read`, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteNotification = async (role: string, id: string, roleId: any, config: any) => {
    const authApi = createAxiosInstance(role);
    try {
      const response = await authApi.delete(`/notification?id=${id}&recipient=${roleId}`, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  export {
    getNotification,
    toggleRead,
    deleteNotification,
  }