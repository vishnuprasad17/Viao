import { createAxiosInstance } from "./axiosInstance";

type AuthRole = 'admin' | 'user' | 'vendor';

const getChat = async (Id: string | undefined, role: string) => {
    const chatApi = createAxiosInstance("conversation", role as AuthRole );
    try {
      const response = await chatApi.get(`/?userId=${Id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const sendData = async (role: string, data: object) => {
    const chatApi = createAxiosInstance("conversation", role as AuthRole);
    try {
      const response = await chatApi.post('/' , data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getMessages = async (chatId: string | undefined, role: string) => {
    const chatApi = createAxiosInstance("message", role as AuthRole);
    try {
      const response = await chatApi.get(`/?conversationId=${chatId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const sendMessage = async (role: string, message: object) => {
    const chatApi = createAxiosInstance("message", role as AuthRole);
    try {
      const response = await chatApi.post('/', message);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const changeReadStatus = async (role: string, data: object, config: object) => {
    const chatApi = createAxiosInstance("message", role as AuthRole);
    try {
      const response = await chatApi.patch("/changeIsRead", data, config);
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