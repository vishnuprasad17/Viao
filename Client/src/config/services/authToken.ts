
  // authToken.ts
type AuthRole = 'admin' | 'user' | 'vendor';

export const setTokens = (role: AuthRole, accessToken: string, refreshToken: string) => {
  localStorage.setItem(`${role}_access_token`, accessToken);
  localStorage.setItem(`${role}_refresh_token`, refreshToken);
};

export const clearTokens = (role: AuthRole) => {
  localStorage.removeItem(`${role}_access_token`);
  localStorage.removeItem(`${role}_refresh_token`);
};

export const getToken = (role: AuthRole) => {
  return localStorage.getItem(`${role}_access_token`);
};

export const getRefreshToken = (role: AuthRole) => {
  return localStorage.getItem(`${role}_refresh_token`);
};