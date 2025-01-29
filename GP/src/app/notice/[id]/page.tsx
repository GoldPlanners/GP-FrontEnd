"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/app/components/sidebar2";

interface Notice {
    id: number;
    title: string;
    createdAt: string;
    description: string;
}

const NoticeDetailPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [notice, setNotice] = useState<Notice | null>(null);

    useEffect(() => {
        const regex = /\/notice\/(\d+)/;
        const match = pathname?.match(regex);
        if (match) {
            const noticeId = parseInt(match[1]); // 경로에서 id 추출
            const fetchedNotice: Notice = {
                id: noticeId,
                title: `공지사항 제목 ${noticeId}`,
                createdAt: "2025-01-22",
                description: `공지사항 내용 ${noticeId}`,
            };
            setNotice(fetchedNotice); // id에 맞는 공지사항 설정
        }
    }, [pathname]);

    if (!notice) return <div>로딩 중...</div>;

    return (
        <div className="flex">
            <Sidebar />
            <div className="p-6 flex-1">
                <h1 className="text-2xl font-bold mb-4">{notice.title}</h1>
                <p className="text-sm text-gray-600">{notice.createdAt}</p>
                <div className="mt-4">{notice.description}</div>
            </div>
        </div>
    );
};

export default NoticeDetailPage;
