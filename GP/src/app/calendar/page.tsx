"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import Modal from "@/app/components/modal";
import Sidebar from "@/app/components/sidebar";

import "@/styles/calendar.css";

interface Event {
    title: string;
    start: string;
    end: string;
    allDay: boolean;
}

const Calendar = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);

    const handleDateClick = (arg: DateClickArg): void => {
        setSelectedDate(arg.dateStr);
        setIsModalOpen(true);
    };

    const handleCloseModal = (): void => {
        setIsModalOpen(false);
        setSelectedDate(null);
    };

    const handleAddEvent = (newEvent: Event): void => {
        const { title, start, end, allDay } = newEvent;

        const startDate = new Date(start);
        const endDate = new Date(end);

        const dates = [];
        let currentDate = startDate;

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const expandedEvents: Event[] = dates.map((date) => ({
            title,
            start: date.toISOString().split("T")[0],
            end: date.toISOString().split("T")[0],
            allDay,
        }));

        setEvents((prevEvents) => [...prevEvents, ...expandedEvents]);
    };

    const handleSidebarToggle = (): void => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <div className="flex h-screen">
            {isSidebarVisible && (
                <Sidebar
                    onAddEvent={handleAddEvent}
                    onClose={handleSidebarToggle}
                />
            )}
            <div className="flex flex-col flex-1">
                <div className="flex-1 p-4 overflow-auto bg-realBackground">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale={koLocale}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "",
                        }}
                        height="100%"
                        dateClick={handleDateClick}
                        events={events}
                        fixedWeekCount={false}
                    />
                </div>
            </div>

            {!isSidebarVisible && (
                <img
                    onClick={handleSidebarToggle}
                    src="icon/list.svg"
                    className="fixed top-2.5 left-1 z-50 px-4 py-2 rounded text-18px border-none cursor-pointer"
                    alt="Sidebar toggle"
                />
            )}

            <Modal
                isOpen={isModalOpen}
                selectedDate={selectedDate}
                onClose={handleCloseModal}
                onAddEvent={handleAddEvent}
            />
        </div>
    );
};

export default Calendar;
