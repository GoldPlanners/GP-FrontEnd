import axios from "axios";

export const authApi = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const baseApi = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

baseApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

baseApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const { data } = await authApi.post("/auth/refresh", { refreshToken });

                localStorage.setItem("accessToken", data.accessToken);
                originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

                return baseApi(originalRequest);
            } catch (refreshError) {
                console.error("토큰 재발급 실패:", refreshError);
                // localStorage.removeItem("accessToken");
                // localStorage.removeItem("refreshToken");
                // window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default baseApi;
