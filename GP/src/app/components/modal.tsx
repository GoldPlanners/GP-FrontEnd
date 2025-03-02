"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { addCalendarPlan, addVacation } from "@/api/calendar/calendar";

interface ModalProps {
    isOpen: boolean;
    selectedDate: string | null;
    onClose: () => void;
    onAddEvent: (event: {
        title: string;
        start: string;
        end: string;
        description: string;
        allDay: boolean;
        type: "event" | "vacation";
        isHalfDay?: boolean;
        halfDayType?: "morning" | "afternoon";
        createdBy: string; // createdBy 필드 추가
    }) => void;
}

const Modal = ({ isOpen, selectedDate, onClose, onAddEvent }: ModalProps) => {
    const [selectedTab, setSelectedTab] = useState<"event" | "vacation">(
        "event"
    );
    const [eventTitle, setEventTitle] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [halfDayType, setHalfDayType] = useState<
        "morning" | "afternoon" | null
    >(null);

    useEffect(() => {
        if (selectedDate) {
            setStartDate(selectedDate);
            setEndDate(selectedDate);
        }
    }, [selectedDate]);

    const handleHalfDayChange = (type: "morning" | "afternoon") => {
        setHalfDayType((prev) => {
            const newType = prev === type ? null : type;
            if (newType) setEndDate(startDate);
            return newType;
        });
        console.log(halfDayType);
    };

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === "eventTitle") setEventTitle(value);
        if (name === "startDate") {
            setStartDate(value);
            if (halfDayType) setEndDate(value);
        }
        if (name === "endDate") setEndDate(value);
        if (name === "description") setDescription(value);
    };

    const handleTabChange = (tab: "event" | "vacation") => {
        setSelectedTab(tab);
        setEventTitle("");
        setEndDate("");
        setDescription("");
        setHalfDayType(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!eventTitle.trim() || !startDate || !endDate) {
            alert("필수 항목(제목, 날짜)을 입력해주세요.");
            return;
        }

        onAddEvent({
            title: eventTitle,
            start: startDate,
            end: endDate,
            description,
            allDay: true,
            type: selectedTab,
            isHalfDay:
                selectedTab === "vacation"
                    ? halfDayType
                        ? true
                        : undefined
                    : undefined,
            halfDayType:
                selectedTab === "vacation"
                    ? halfDayType ?? undefined
                    : undefined,
            createdBy: "사용자ID",
        });

        const toISOStringWithTimezone = (dateStr: string) => {
            const date = new Date(dateStr);

            if (halfDayType === "morning") {
                date.setHours(9, 0, 0, 0);
            } else if (halfDayType === "afternoon") {
                date.setHours(13, 0, 0, 0);
            } else {
                date.setHours(0, 0, 0, 0);
            }

            console.log(`원본 date: ${date}`);
            console.log(`halfDayType: ${halfDayType}`);

            const offset = date.getTimezoneOffset() * 60000;
            console.log(`타임존 오프셋: ${offset}`);

            const isoString = new Date(date.getTime() - offset).toISOString();
            console.log(`변환된 ISO 문자열: ${isoString}`);

            return isoString;
        };

        try {
            if (selectedTab === "event") {
                await addCalendarPlan({
                    title: eventTitle,
                    startDate: toISOStringWithTimezone(startDate),
                    endDate: toISOStringWithTimezone(endDate),
                    description,
                });
            } else {
                await addVacation({
                    title: eventTitle,
                    startDate: toISOStringWithTimezone(startDate),
                    endDate: toISOStringWithTimezone(endDate),
                    description,
                    half: halfDayType ? true : false,
                });
            }

            onClose();
            setEventTitle("");
            setStartDate("");
            setEndDate("");
            setDescription("");
            setHalfDayType(null);
        } catch (error) {
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md w-[450px] h-[550px] z-60 flex flex-col">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-grow"
                >
                    <div className="mt-4 mb-4 text-24px">
                        <input
                            type="text"
                            id="eventTitle"
                            name="eventTitle"
                            value={eventTitle}
                            placeholder="제목을 입력해주세요"
                            onChange={handleInputChange}
                            className="mt-2 p-2 w-full border-b-2 border-gray-300 focus:outline-none focus:border-b-4 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex mb-8">
                        <div
                            onClick={() => handleTabChange("event")}
                            className={`px-4 py-2 text-center cursor-pointer ${
                                selectedTab === "event"
                                    ? "border-b-2 border-closeButton text-black text-14px font-semibold"
                                    : "text-gray-400 text-14px"
                            }`}
                        >
                            일정
                        </div>
                        <div
                            onClick={() => handleTabChange("vacation")}
                            className={`ml-4 px-4 py-2 text-center cursor-pointer ${
                                selectedTab === "vacation"
                                    ? "border-b-2 border-closeButton text-black text-14px font-semibold"
                                    : "text-gray-400 text-14px"
                            }`}
                        >
                            휴가
                        </div>
                    </div>

                    <div className="text-14px">
                        <label>기간</label>
                        <div className="flex items-center">
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={startDate}
                                onChange={handleInputChange}
                                className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                            />
                            <div className="ml-2 mr-2">~</div>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={endDate}
                                onChange={handleInputChange}
                                className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                                disabled={halfDayType !== null}
                            />
                        </div>
                        {selectedTab === "vacation" && (
                            <div className="mt-2 flex items-center">
                                <input
                                    type="checkbox"
                                    id="halfMorningDay"
                                    checked={halfDayType === "morning"}
                                    onChange={() =>
                                        handleHalfDayChange("morning")
                                    }
                                    className="mr-1"
                                />
                                <label
                                    htmlFor="halfMorningDay"
                                    className="text-14px text-gray-600"
                                >
                                    오전 반차
                                </label>

                                <input
                                    type="checkbox"
                                    id="halfAfternoonDay"
                                    checked={halfDayType === "afternoon"}
                                    onChange={() =>
                                        handleHalfDayChange("afternoon")
                                    }
                                    className="ml-4 mr-1"
                                />
                                <label
                                    htmlFor="halfAfternoonDay"
                                    className="text-14px text-gray-600"
                                >
                                    오후 반차
                                </label>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 text-14px">
                        <label
                            htmlFor={
                                selectedTab === "event"
                                    ? "description"
                                    : "reason"
                            }
                            className="block"
                        >
                            {selectedTab === "event" ? "설명" : "사유"}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={handleInputChange}
                            className="mt-2 p-2 w-full h-[130px] border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mt-auto flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-6 py-2 bg-gray-500 text-white rounded-round2"
                        >
                            닫기
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-closeButton text-white rounded-round2"
                        >
                            추가
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
