import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import config from "../envConfig";

type AuthRole = "admin" | "user" | "vendor";

interface ErrorResponse {
  error?: string;
  message?: string;
}

// ✅ Accept explicit role instead of guessing from localStorage
const detectActiveRole = (explicitRole?: AuthRole): AuthRole | null => {
  if (explicitRole) return explicitRole;
  // Fallback: check in priority order (vendor/admin before user to avoid misdetection)
  const roles: AuthRole[] = ["vendor", "admin", "user"];
  return roles.find((r) => localStorage.getItem(`persist:${r}`)) || null;
};

const refreshState: Record<
  AuthRole,
  {
    isRefreshing: boolean;
    refreshPromise: Promise<void> | null;
    failedQueue: Array<{
      resolve: (value?: unknown) => void;
      reject: (reason?: any) => void;
    }>;
  }
> = {
  user: { isRefreshing: false, refreshPromise: null, failedQueue: [] },
  vendor: { isRefreshing: false, refreshPromise: null, failedQueue: [] },
  admin: { isRefreshing: false, refreshPromise: null, failedQueue: [] },
};

const processQueue = (role: AuthRole, error?: any) => {
  refreshState[role].failedQueue.forEach((p) =>
    error ? p.reject(error) : p.resolve(),
  );
  refreshState[role].failedQueue = [];
};

const triggerLogout = (role: AuthRole) => {
  localStorage.removeItem(`persist:${role}`);
  window.dispatchEvent(new CustomEvent("auth:logout", { detail: { role } }));
};

export const createAxiosInstance = (endpoint: string, instanceRole?: AuthRole) => {
  const instance = axios.create({
    baseURL: `${config.BASE_URL}/${endpoint}`,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.response.use(
    (response) => response,

    async (error: AxiosError<ErrorResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (!originalRequest) return Promise.reject(error);

      // 🚫 Prevent refresh recursion
      if (originalRequest.url?.includes("/refresh")) {
        return Promise.reject(error);
      }

      // ✅ Use instanceRole if provided, fallback to detection
      const role = detectActiveRole(instanceRole);
      if (!role) return Promise.reject(error);

      const state = refreshState[role];

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // ✅ If already refreshing, queue this request
      if (state.isRefreshing && state.refreshPromise) {
        return new Promise((resolve, reject) => {
          state.failedQueue.push({ resolve, reject });
        })
          .then(() => instance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      state.isRefreshing = true;

      state.refreshPromise = axios
        .post(
          `${config.BASE_URL}/${role}/refresh`,
          {},
          { withCredentials: true },
        )
        .then(() => {
          processQueue(role);

          // ✅ Notify socket manager to reconnect with correct role
          window.dispatchEvent(
            new CustomEvent("auth:refreshed", { detail: { role } }),
          );
        })
        .catch((refreshError: AxiosError<ErrorResponse>) => {
          processQueue(role, refreshError);

          // ✅ Only logout on hard auth failures, not network errors
          const status = refreshError.response?.status;
          if (status === 401 || status === 403) {
            triggerLogout(role);
          }

          throw refreshError;
        })
        .finally(() => {
          state.isRefreshing = false;
          state.refreshPromise = null;
        });

      return state.refreshPromise.then(() => instance(originalRequest));
    },
  );

  return instance;
};

export const isAuthenticated = (): boolean => !!detectActiveRole();
export const getUserRole = (): AuthRole | null => detectActiveRole();