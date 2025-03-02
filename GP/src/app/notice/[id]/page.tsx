"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/app/components/sidebar2";
import { fetchNoticeDetail, NoticeDetail } from "@/api/notice/notice";

const NoticeDetailPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [notice, setNotice] = useState<NoticeDetail | null>(null);

    useEffect(() => {
        const regex = /\/notice\/(\d+)/;
        const match = pathname?.match(regex);
        if (match) {
            const noticeId = parseInt(match[1]);

            const loadNotice = async () => {
                const data = await fetchNoticeDetail(noticeId);
                if (!data) {
                    alert("공지사항을 불러오는 데 실패했습니다.");
                    router.push("/notice");
                    return;
                }
                setNotice(data);
            };

            loadNotice();
        }
    }, [pathname, router]);

    if (!notice) return <div className="p-6">로딩 중...</div>;

    const getFileType = (fileName: string) => {
        const extension = fileName.split(".").pop()?.toLowerCase();
        if (!extension) return "unknown";

        if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) return "image";
        if (["pdf"].includes(extension)) return "pdf";
        if (["txt", "csv", "json"].includes(extension)) return "text";
        return "other";
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="p-6 flex-1">
                <h1 className="text-2xl font-bold mb-4">{notice.title}</h1>
                <p className="text-sm text-gray-600">
                    {new Date(notice.createdAt).toLocaleDateString()} | 작성자: {notice.author} | 조회수: {notice.viewCount}
                </p>
                <div className="mt-4 whitespace-pre-line">{notice.content}</div>

                {notice.files.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold">첨부 파일</h2>
                        <div className="mt-2 space-y-4">
                            {notice.files.map((file) => {
                                const fileType = getFileType(file.name);

                                return (
                                    <div key={file.id} className="border p-2 rounded shadow-sm">
                                        {fileType === "image" ? (
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                className="max-w-full h-auto rounded"
                                            />
                                        ) : fileType === "pdf" ? (
                                            <iframe
                                                src={file.url}
                                                className="w-full h-96 border rounded"
                                            ></iframe>
                                        ) : fileType === "text" ? (
                                            <iframe
                                                src={file.url}
                                                className="w-full h-40 border rounded"
                                            ></iframe>
                                        ) : (
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline"
                                            >
                                                {file.name} (다운로드)
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => router.push("/notice")}
                    className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    목록으로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default NoticeDetailPage;
