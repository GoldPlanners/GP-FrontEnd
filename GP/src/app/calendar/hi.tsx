// "use client";

// import { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
// import { EventClickArg } from "@fullcalendar/core";
// import koLocale from "@fullcalendar/core/locales/ko";
// import Modal from "@/app/components/modal";
// import EventModal from "@/app/components/eventModal"; // ✅ 추가
// import Sidebar from "@/app/components/sidebar";

// import { getCalendarPlans } from "@/api/calendar/calendar";

// import "@/styles/calendar.css";

// interface Event {
//     title: string;
//     start: string;
//     end: string;
//     allDay: boolean;
//     color?: string;
// }

// const Calendar = () => {
//     const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//     const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false); // ✅ 추가
//     const [selectedDate, setSelectedDate] = useState<string | null>(null);
//     const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // ✅ 추가
//     const [myPlans, setMyPlans] = useState<Event[]>([]);
//     const [teamPlans, setTeamPlans] = useState<Event[]>([]);
//     const [myVacationHistories, setMyVacationHistories] = useState<Event[]>([]);
//     const [teamVacationHistories, setTeamVacationHistories] = useState<Event[]>([]);
//     const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
//     const [selectedCalendars, setSelectedCalendars] = useState<string[]>([
//         "mySchedule",
//         "sharedSchedule",
//         "myVacation",
//         "sharedVacation",
//     ]);

//     useEffect(() => {
//         const fetchEvents = async () => {
//             try {
//                 const response = await getCalendarPlans();

//                 const generateEventDates = (
//                     start: string,
//                     end: string,
//                     title: string,
//                     createdBy: string,
//                     color: string
//                 ) => {
//                     const startDate = new Date(start);
//                     const endDate = new Date(end);
//                     const events = [];

//                     for (
//                         let currentDate = startDate;
//                         currentDate <= endDate;
//                         currentDate.setDate(currentDate.getDate() + 1)
//                     ) {
//                         const eventTitle = `${createdBy} - ${title}`;

//                         events.push({
//                             title: eventTitle,
//                             start: currentDate.toISOString(),
//                             end: currentDate.toISOString(),
//                             allDay: true,
//                             color,
//                         });
//                     }

//                     return events;
//                 };

//                 setMyPlans(
//                     response.myPlans.flatMap((event: any) =>
//                         generateEventDates(event.startDate, event.endDate, event.title, event.createdBy, "#FFA500")
//                     )
//                 );
//                 setTeamPlans(
//                     response.teamPlans.flatMap((event: any) =>
//                         generateEventDates(event.startDate, event.endDate, event.title, event.createdBy, "#FFA500")
//                     )
//                 );
//                 setMyVacationHistories(
//                     response.myVacationHistories.flatMap((event: any) =>
//                         generateEventDates(event.startDate, event.endDate, event.title, event.createdBy, "#008000")
//                     )
//                 );
//                 setTeamVacationHistories(
//                     response.teamVacationHistories.flatMap((event: any) =>
//                         generateEventDates(event.startDate, event.endDate, event.title, event.createdBy, "#008000")
//                     )
//                 );
//             } catch (error) {
//                 console.error("캘린더 데이터를 불러오는 중 오류 발생:", error);
//             }
//         };

//         fetchEvents();
//     }, []);

//     const getFilteredEvents = () => {
//         let vacationEvents: Event[] = [];
//         let otherEvents: Event[] = [];

//         if (selectedCalendars.includes("myVacation")) {
//             vacationEvents = [...vacationEvents, ...myVacationHistories.map((event) => ({ ...event, groupId: 1 }))];
//         }
//         if (selectedCalendars.includes("sharedVacation")) {
//             vacationEvents = [...vacationEvents, ...teamVacationHistories.map((event) => ({ ...event, groupId: 1 }))];
//         }

//         if (selectedCalendars.includes("mySchedule")) {
//             otherEvents = [...otherEvents, ...myPlans.map((event) => ({ ...event, groupId: 2 }))];
//         }
//         if (selectedCalendars.includes("sharedSchedule")) {
//             otherEvents = [...otherEvents, ...teamPlans.map((event) => ({ ...event, groupId: 2 }))];
//         }

//         return [...vacationEvents, ...otherEvents];
//     };

//     const handleDateClick = (arg: DateClickArg): void => {
//         setSelectedDate(arg.dateStr);
//         setIsModalOpen(true);
//     };

//     // ✅ 이벤트 클릭 시 모달 띄우기
//     const handleEventClick = (arg: EventClickArg): void => {
//         setSelectedEvent({
//             title: arg.event.title,
//             start: arg.event.start?.toISOString() || "",
//             end: arg.event.end?.toISOString() || "",
//             allDay: arg.event.allDay,
//             color: arg.event.backgroundColor,
//         });
//         setIsEventModalOpen(true);
//     };

//     const handleCloseModal = (): void => {
//         setIsModalOpen(false);
//         setSelectedDate(null);
//     };

//     // ✅ 이벤트 모달 닫기
//     const handleCloseEventModal = (): void => {
//         setIsEventModalOpen(false);
//         setSelectedEvent(null);
//     };

//     const handleAddEvent = (newEvent: Event): void => {
//         const { title, start, end, allDay } = newEvent;

//         const startDate = new Date(start);
//         const endDate = new Date(end);

//         const dates = [];
//         let currentDate = startDate;

//         while (currentDate <= endDate) {
//             dates.push(new Date(currentDate));
//             currentDate.setDate(currentDate.getDate() + 1);
//         }

//         const expandedEvents: Event[] = dates.map((date) => ({
//             title,
//             start: date.toISOString().split("T")[0],
//             end: date.toISOString().split("T")[0],
//             allDay,
//         }));

//         setMyPlans((prevPlans) => [...prevPlans, ...expandedEvents]);
//     };

//     const handleSidebarToggle = (): void => {
//         setIsSidebarVisible(!isSidebarVisible);
//     };

//     return (
//         <div className="flex h-screen">
//             {isSidebarVisible && <Sidebar onAddEvent={handleAddEvent} onClose={handleSidebarToggle} onCalendarSelectionChange={setSelectedCalendars} />}
//             <div className="flex flex-col flex-1">
//                 <div className="flex-1 p-4 overflow-auto bg-realBackground">
//                     <FullCalendar
//                         plugins={[dayGridPlugin, interactionPlugin]}
//                         initialView="dayGridMonth"
//                         locale={koLocale}
//                         headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
//                         height="100%"
//                         dateClick={handleDateClick}
//                         eventClick={handleEventClick} // ✅ 추가
//                         events={getFilteredEvents()}
//                         fixedWeekCount={false}
//                         eventOrder="groupId,start"
//                     />
//                 </div>
//             </div>

//             <Modal isOpen={isModalOpen} selectedDate={selectedDate} onClose={handleCloseModal} onAddEvent={handleAddEvent} />

//             {/* ✅ 이벤트 모달 추가 */}
//             <EventModal isOpen={isEventModalOpen} event={selectedEvent} onClose={handleCloseEventModal} />
//         </div>
//     );
// };

// export default Calendar;
