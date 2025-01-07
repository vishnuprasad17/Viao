import { createAxiosInstance } from "./axiosInstance";

const getChat = async (Id: any) => {
    const authApi = createAxiosInstance("conversation");
    try {
      const response = await authApi.get(`/?userId=${Id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const sendData = async (data: any) => {
    const authApi = createAxiosInstance("conversation");
    try {
      const response = await authApi.post('/' , data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getMessages = async (chatId: any) => {
    const authApi = createAxiosInstance("message");
    try {
      const response = await authApi.get(`/?conversationId=${chatId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const sendMessage = async (message: any) => {
    const authApi = createAxiosInstance("message");
    try {
      const response = await authApi.post('/', message);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const changeReadStatus = async (data: any, config: any) => {
    const authApi = createAxiosInstance("message");
    try {
      const response = await authApi.patch("/changeIsRead", data, config);
      return response;
    } catch (error) {
      throw error;
    }
  };

  export {
    getChat,
    sendData,
    getMessages,
    sendMessage,
    changeReadStatus,
  }