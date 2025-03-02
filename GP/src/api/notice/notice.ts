import baseApi from "../baseApi";

export interface File {
    id: number;
    name: string;
    url: string;
}

export interface NoticeDetail {
    id: number;
    title: string;
    content: string;
    author: string;
    pinned: boolean;
    categoryId: number;
    categoryName: string;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    files: File[];
}

export interface Notice {
    id: number;
    title: string;
    author: string;
    updatedAt: string;
}

export const fetchNotices = async (): Promise<Notice[]> => {
    try {
        const response = await baseApi.get("/board/list/1?page=0");
        return response.data.contents;
    } catch (error) {
        console.error("Error fetching notices:", error);
        return [];
    }
};

export const fetchNoticeDetail = async (id: number): Promise<NoticeDetail | null> => {
    try {
        const response = await baseApi.get(`/board/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching notice detail:", error);
        return null;
    }
};
