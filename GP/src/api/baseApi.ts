import axios from "axios";

const baseApi = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

baseApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

baseApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) { 
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
                    { refreshToken }
                );

                localStorage.setItem("accessToken", data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return baseApi(originalRequest);
            } catch (refreshError) {
                console.error("토큰 재발급 실패:", refreshError);
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default baseApi;
