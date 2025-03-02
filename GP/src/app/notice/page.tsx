"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/app/components/sidebar2";
import { fetchNotices, Notice } from "@/api/notice/notice";

const NoticeListPage = () => {
    const [notices, setNotices] = useState<Notice[]>([]);

    useEffect(() => {
        const loadNotices = async () => {
            const data = await fetchNotices();
            setNotices(data);
        };

        loadNotices();
    }, []);

    return (
        <div className="flex">
            <Sidebar />
            <div className="p-6 flex-1">
                <h1 className="text-2xl font-bold mb-4">공지사항</h1>
                <div className="space-y-4">
                    {notices.length > 0 ? (
                        notices.map((notice) => (
                            <div
                                key={notice.id}
                                className="border p-4 rounded-lg bg-white"
                            >
                                <h2 className="font-semibold text-lg">
                                    <Link href={`/notice/${notice.id}`}>
                                        {notice.title}
                                    </Link>
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {new Date(
                                        notice.updatedAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>공지사항이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoticeListPage;
