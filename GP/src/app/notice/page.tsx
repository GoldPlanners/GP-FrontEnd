"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/sidebar2";

interface Notice {
    id: number;
    title: string;
    createdAt: string;
    description: string;
}

const NoticeListPage = () => {
    const [notices, setNotices] = useState<Notice[]>([]);

    useEffect(() => {
        const fetchedNotices = [
            {
                id: 1,
                title: "공지사항 제목 1",
                createdAt: "2025-01-22",
                description: "공지사항 내용 1",
            },
            {
                id: 2,
                title: "공지사항 제목 2",
                createdAt: "2025-01-21",
                description: "공지사항 내용 2",
            },
        ];
        setNotices(fetchedNotices);
    }, []);

    return (
        <div className="flex">
            <Sidebar />
            <div className="p-6 flex-1">
                <h1 className="text-2xl font-bold mb-4">공지사항</h1>
                <div className="space-y-4">
                    {notices.map((notice) => (
                        <div key={notice.id} className="border p-4 rounded-lg bg-white">
                            <h2 className="font-semibold text-lg">
                                <Link href={`/notice/${notice.id}`}>
                                    {notice.title}
                                </Link>
                            </h2>
                            <p className="text-sm text-gray-600">
                                {notice.createdAt}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NoticeListPage;
