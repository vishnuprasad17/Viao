import { createAxiosInstance } from './axiosInstance';

export const uploadImageToS3 = async (file: File, context: "vendor" | "user"): Promise<string> => {
  const api = createAxiosInstance('message', context);
  
  const { data } = await api.post('/upload/presigned-url', {
    fileName: file.name,
    fileType: file.type,
  });

  await fetch(data.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  return data.imageUrl;
};