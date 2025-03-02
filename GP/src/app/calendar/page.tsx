"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";
import Modal from "@/app/components/modal";
import EventModal from "@/app/components/eventModal";
import Sidebar from "@/app/components/sidebar";

import { getCalendarPlans } from "@/api/calendar/calendar";

import "@/styles/calendar.css";

interface Event {
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    createdBy: string;
    color?: string;
    description?: string;
    vacationType?: string;
    groupId?: string;
    startDate?: string;
    endDate?: string;
    id?: string;
}


const Calendar = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [eventPosition, setEventPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [myPlans, setMyPlans] = useState<Event[]>([]);
    const [teamPlans, setTeamPlans] = useState<Event[]>([]);
    const [myVacationHistories, setMyVacationHistories] = useState<Event[]>([]);
    const [teamVacationHistories, setTeamVacationHistories] = useState<Event[]>(
        []
    );
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
    const [selectedCalendars, setSelectedCalendars] = useState<string[]>([
        "mySchedule",
        "sharedSchedule",
        "myVacation",
        "sharedVacation",
    ]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await getCalendarPlans();

                const generateEventDates = (
                    start: string,
                    end: string,
                    title: string,
                    createdBy: string,
                    color: string,
                    description?: string,
                    vacationType?: string,
                    id?: string
                ) => {
                    const startDate = new Date(start);
                    const endDate = new Date(end);
                    const events = [];

                    const groupId = `${title}-${createdBy}-${start}-${end}`;

                    for (
                        let currentDate = startDate;
                        currentDate <= endDate;
                        currentDate.setDate(currentDate.getDate() + 1)
                    ) {
                        const eventTitle = `${createdBy} - ${title}`;

                        events.push({
                            title: eventTitle,
                            start: currentDate.toISOString(),
                            end: currentDate.toISOString(),
                            allDay: true,
                            color,
                            createdBy,
                            groupId,
                            extendedProps: {
                                description,
                                vacationType,
                                startDate: start,
                                endDate: end,
                                id,
                            },
                        });
                        
                    }

                    return events;
                };

                setMyPlans(
                    response.myPlans.flatMap((event: any) =>
                        generateEventDates(
                            event.startDate,
                            event.endDate,
                            event.title,
                            event.createdBy,
                            "#FFA500",
                            event.description,
                            event.vacationType,
                            event.id
                        )
                    )
                );
                setTeamPlans(
                    response.teamPlans.flatMap((event: any) =>
                        generateEventDates(
                            event.startDate,
                            event.endDate,
                            event.title,
                            event.createdBy,
                            "#FFA500",
                            event.description,
                            event.vacationType,
                            event.id
                        )
                    )
                );
                setMyVacationHistories(
                    response.myVacationHistories.flatMap((event: any) =>
                        generateEventDates(
                            event.startDate,
                            event.endDate,
                            event.title,
                            event.createdBy,
                            "#008000",
                            event.description,
                            event.vacationType,
                            event.id
                        )
                    )
                );
                setTeamVacationHistories(
                    response.teamVacationHistories.flatMap((event: any) =>
                        generateEventDates(
                            event.startDate,
                            event.endDate,
                            event.title,
                            event.createdBy,
                            "#008000",
                            event.description,
                            event.vacationType,
                            event.id
                        )
                    )
                );
            } catch (error) {
                console.error("캘린더 데이터를 불러오는 중 오류 발생:", error);
            }
        };

        fetchEvents();
    }, []);

    const getFilteredEvents = () => {
        let vacationEvents: Event[] = [];
        let otherEvents: Event[] = [];

        if (selectedCalendars.includes("myVacation")) {
            vacationEvents = [
                ...vacationEvents,
                ...myVacationHistories.map((event) => ({ ...event })),
            ];
        }
        if (selectedCalendars.includes("sharedVacation")) {
            vacationEvents = [
                ...vacationEvents,
                ...teamVacationHistories.map((event) => ({ ...event })),
            ];
        }

        if (selectedCalendars.includes("mySchedule")) {
            otherEvents = [
                ...otherEvents,
                ...myPlans.map((event) => ({ ...event })),
            ];
        }
        if (selectedCalendars.includes("sharedSchedule")) {
            otherEvents = [
                ...otherEvents,
                ...teamPlans.map((event) => ({ ...event })),
            ];
        }

        return [...vacationEvents, ...otherEvents];
    };

    const handleDateClick = (arg: DateClickArg): void => {
        setSelectedDate(arg.dateStr);
        setIsModalOpen(true);
    };

    const handleEventClick = (arg: EventClickArg): void => {

        console.log(arg.event);
    
        const startDate = arg.event.extendedProps.startDate || "";
        const endDate = arg.event.extendedProps.endDate || "";
    
        setEventPosition({ x: arg.jsEvent.clientX, y: arg.jsEvent.clientY });

        setSelectedEvent({
            title: arg.event.title,
            start: arg.event.start?.toISOString() || "",
            end: arg.event.end?.toISOString() || "",
            allDay: arg.event.allDay,
            color: arg.event.backgroundColor,
            description: arg.event.extendedProps.description || "",
            vacationType: arg.event.extendedProps.vacationType || "",
            createdBy: arg.event.extendedProps.createdBy || "",
            groupId: arg.event.extendedProps.groupId || "",
            startDate: startDate,
            endDate: endDate,
            id: arg.event.extendedProps.id || "",
        });
    
        setIsEventModalOpen(true);
    };
    
    
    

    const handleCloseModal = (): void => {
        setIsModalOpen(false);
        setSelectedDate(null);
    };

    const handleCloseEventModal = (): void => {
        setIsEventModalOpen(false);
        setSelectedEvent(null);
    };

    const handleAddEvent = (newEvent: Event): void => {
        const {
            title,
            start,
            end,
            allDay,
            createdBy = "Unknown",
            description = "",
            vacationType = "",
        } = newEvent;

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
            createdBy,
            description,
            vacationType,
        }));

        setMyPlans((prevPlans) => [...prevPlans, ...expandedEvents]);
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
                    onCalendarSelectionChange={setSelectedCalendars}
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
                        eventClick={handleEventClick}
                        events={getFilteredEvents()}
                        fixedWeekCount={false}
                        eventOrder="vacationType,start,groupId"
                        editable={true}
                    />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                selectedDate={selectedDate}
                onClose={handleCloseModal}
                onAddEvent={handleAddEvent}
            />

            <EventModal
                isOpen={isEventModalOpen}
                event={selectedEvent}
                onClose={handleCloseEventModal}
                position={eventPosition}
            />
        </div>
    );
};

export default Calendar;

