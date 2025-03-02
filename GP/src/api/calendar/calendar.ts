import baseApi from "../baseApi";

export const getCalendarPlans = async () => {
    try {
        const response = await baseApi.get("/calendar");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("캘린더 데이터 불러오기 실패:", error);
        throw error;
    }
};

export const addCalendarPlan = async (plan: {
    title: string;
    startDate: string;
    endDate: string;
    description: string;
}) => {
    try {
        const response = await baseApi.post("/plans", plan);
        return response.data;
    } catch (error) {
        console.error("일정 등록 실패:", error);
        throw error;
    }
};

export const addVacation = async (vacation: {
    title: string;
    startDate: string;
    endDate: string;
    description: string;
    half: boolean;
}) => {
    try {
        const response = await baseApi.post("/vacations", vacation);
        return response.data;
    } catch (error) {
        console.error("휴가 등록 실패:", error);
        throw error;
    }
};

export const updateCalendarPlan = async (
    id: string,
    plan: {
        title: string;
        startDate: string;
        endDate: string;
        description: string;
    }
) => {
    try {
        const response = await baseApi.put(`/plans/${id}`, plan);
        return response.data;
    } catch (error) {
        console.error("일정 수정 실패:", error);
        throw error;
    }
};

export const updateVacation = async (
    id: string,
    vacation: {
        title: string;
        startDate: string;
        endDate: string;
        description: string;
        half: boolean;
    }
) => {
    try {
        const response = await baseApi.put(`/vacations/${id}`, vacation);
        return response.data;
    } catch (error) {
        console.error("일정 수정 실패:", error);
        throw error;
    }
};
