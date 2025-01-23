"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar2";

interface Vacation {
    date: string;
    type: string;
    days: number;
    reason: string;
}

const VacationPage = () => {
    const [remainingVacation, setRemainingVacation] = useState(10);
    const [usedVacation, setUsedVacation] = useState(2);
    const [vacationHistory, setVacationHistory] = useState<Vacation[]>([]); 

    useEffect(() => {
        const fetchedHistory: Vacation[] = [
            { date: "2025-01-15", type: "연차", days: 1, reason: "개인 사유" },
            {
                date: "2025-01-10",
                type: "반차",
                days: 0.5,
                reason: "병원 방문",
            },
        ];
        setVacationHistory(fetchedHistory);
    }, []);

    return (
        <div className="flex">
            <Sidebar />

            <div className="p-6 flex-1">
                <h1 className="text-2xl font-bold mb-6">휴가 관리</h1>

                <section className="mb-6 p-4 bg-white shadow rounded-lg">
                    <h2 className="text-lg font-semibold">남은 휴가</h2>
                    <div className="flex items-center space-x-6 mt-4">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-500">
                                {remainingVacation}
                            </p>
                            <p className="text-sm text-gray-600">
                                총 남은 휴가(일)
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-500">
                                {usedVacation}
                            </p>
                            <p className="text-sm text-gray-600">
                                올해 사용(일)
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-6 p-4 bg-white shadow rounded-lg">
                    <h2 className="text-lg font-semibold">휴가 사용 내역</h2>
                    <table className="w-full mt-4 border-collapse border">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="text-left p-2 border">날짜</th>
                                <th className="text-left p-2 border">
                                    휴가 종류
                                </th>
                                <th className="text-left p-2 border">
                                    사용 일수
                                </th>
                                <th className="text-left p-2 border">사유</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vacationHistory.map((vacation, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-2 border">
                                        {vacation.date}
                                    </td>
                                    <td className="p-2 border">
                                        {vacation.type}
                                    </td>
                                    <td className="p-2 border">
                                        {vacation.days}
                                    </td>
                                    <td className="p-2 border">
                                        {vacation.reason}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="mb-6 p-4 bg-white shadow rounded-lg">
                    <h2 className="text-lg font-semibold">팀원 휴가 현황</h2>
                    <table className="w-full mt-4 border-collapse border">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="text-left p-2 border">이름</th>
                                <th className="text-left p-2 border">
                                    휴가 기간
                                </th>
                                <th className="text-left p-2 border">상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-2 border">김철수</td>
                                <td className="p-2 border">
                                    2025-01-20 ~ 2025-01-22
                                </td>
                                <td className="p-2 border text-green-500">
                                    휴가 중
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2 border">박영희</td>
                                <td className="p-2 border">
                                    2025-02-01 ~ 2025-02-03
                                </td>
                                <td className="p-2 border text-blue-500">
                                    예정
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
};

export default VacationPage;
