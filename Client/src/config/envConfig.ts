
const config = {
    BASE_URL: import.meta.env.VITE_BASE_URL || "",
    CLIENTid: import.meta.env.VITE_CLIENTid || "",
    ACCESS_KEY: import.meta.env.VITE_ACCESS_KEY || "",
    BUCKET_REGION: import.meta.env.VITE_BUCKET_REGION || "",
    BUCKET_NAME: import.meta.env.VITE_BUCKET_NAME || "",
    SECRET_ACCESS_KEY: import.meta.env.VITE_SECRET_ACCESS_KEY || "",
    SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "",
  };
  
  export default config;