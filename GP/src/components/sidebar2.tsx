"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Sidebar: React.FC = () => {
    const [isClient, setIsClient] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <aside className="w-[300px] p-[20px] transition-all bg-realBackground">
            <div className="flex items-center mb-[40px]">
                <div>
                    <img
                        src="/logo/logo2.svg"
                        alt="logo2"
                        className="w-[115px] h-auto cursor-pointer"
                        onClick={() => router.push('/calendar')}
                    />
                </div>
            </div>

            <div className="mb-10">
                {isClient && (
                    <div className="bg-white p-2 rounded shadow-md">
                        <Calendar className="text-xs mt-2" />
                    </div>
                )}
            </div>

            <div className="space-y-2 mt-2 font-semibold">
                <Link href="/calendar">
                    <div className="w-full py-2 mb-4 bg-realBackground ">
                        캘린더
                    </div>
                </Link>
                <Link href="/vacation">
                    <div className="w-full py-2 mb-4 bg-realBackground ">
                        휴가 페이지
                    </div>
                </Link>
                <Link href="/notice">
                    <div className="w-full py-2 mb-4 bg-realBackground">
                        공지사항
                    </div>
                </Link>
            </div>

            <div className="mt-8 bg-gray-600 text-white p-4 rounded">
                <h3 className="text-sm font-semibold">나의 휴가 잔여일</h3>
                <p className="text-xl font-bold">10일</p>
            </div>
        </aside>
    );
};

export default Sidebar;
