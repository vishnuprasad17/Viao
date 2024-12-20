
  export const setToken = (token: string, refreshToken: string, role: string) => {
    localStorage.setItem(`${role}Token`, token);
    localStorage.setItem(`${role}Refresh`, refreshToken);
  };
  
  export const getToken = (role: string) => {
    return localStorage.getItem(`${role}Token`);
  };
  
  export const getRefreshToken = (role: string) => {
    return localStorage.getItem(`${role}Refresh`);
  };
  
  export const refreshAuthToken = async (instance: any, refreshToken: string, role: string) => {
    try {
      const refreshResponse = await instance.post('/refresh-token', { refreshToken });
      const newToken = refreshResponse.data.token;
      setToken(newToken, refreshResponse.data.refreshToken, role);
      return newToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };
  export const clearTokens = (role: string) => {
    localStorage.removeItem(`${role}Token`);
    localStorage.removeItem(`${role}Refresh`);
  };