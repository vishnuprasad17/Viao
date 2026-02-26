import { createAxiosInstance } from "./axiosInstance";

const chatInstances: Record<string, ReturnType<typeof createAxiosInstance>> = {};
const messageInstances: Record<string, ReturnType<typeof createAxiosInstance>> = {};

const getChatApi = (role: 'user' | 'vendor') => {
  if (!chatInstances[role]) {
    chatInstances[role] = createAxiosInstance("conversation", role);
  }
  return chatInstances[role];
};

const getMessageApi = (role: 'user' | 'vendor') => {
  if (!messageInstances[role]) {
    messageInstances[role] = createAxiosInstance("message", role);
  }
  return messageInstances[role];
};

const getChat = async (Id: string | undefined, role: 'user' | 'vendor') => {
  try {
    const response = await getChatApi(role).get(`/?userId=${Id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const sendData = async (role: 'user' | 'vendor', data: object) => {
  try {
    const response = await getChatApi(role).post('/', data);
    return response;
  } catch (error) {
    throw error;
  }
};

const getMessages = async (role: 'user' | 'vendor', chatId: string | undefined, page: number = 1, limit: number = 50) => {
  try {
    const response = await getMessageApi(role).get(`/?conversationId=${chatId}&page=${page}&limit=${limit}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const sendMessage = async (role: 'user' | 'vendor', message: object) => {
  try {
    const response = await getMessageApi(role).post('/', message);
    return response;
  } catch (error) {
    throw error;
  }
};

const changeReadStatus = async (role: 'user' | 'vendor', data: object) => {
  try {
    const response = await getMessageApi(role).patch("/changeIsRead", data);
    return response;
  } catch (error) {
    throw error;
  }
};

const deleteForEveryone = async (role: 'user' | 'vendor', data: object) => {
  try {
    const response = await getMessageApi(role).patch("/delete-for-everyone", data);
    return response;
  } catch (error) {
    throw error;
  }
};

const deleteForMe = async (role: 'user' | 'vendor', data: object) => {
  try {
    const response = await getMessageApi(role).patch("/delete-for-me", data);
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
  deleteForEveryone,
  deleteForMe,
};