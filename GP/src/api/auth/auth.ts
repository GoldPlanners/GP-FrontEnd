import baseApi from "../baseApi";

export const login = async (loginId: string, loginPw: string) => {
    const response = await baseApi.post("auth/login", {
        loginId,
        loginPw,
    });
    return response.data;
};

export const signup = async (
    loginId: string,
    loginPw: string,
    name: string,
    phoneNumber: string,
    emergencyNumber: string,
    relationship: string
) => {
    const response = await baseApi.post("auth/signup", {
        loginId,
        loginPw,
        name,
        phoneNumber,
        emergencyNumber,
        relationship,
    });
    return response.data;
};

export const checkLoginIdExists = async (loginId: string) => {
    const response = await baseApi.get(`auth/exists/${loginId}`);
    return response.data;
};

export const logout = async () => {
    const response = await baseApi.post("auth/logout");
    return response.data;
};
