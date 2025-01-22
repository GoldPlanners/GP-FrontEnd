import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Modal from "./modal";

interface SidebarProps {
    onAddEvent: (event: { title: string; start: string; end: string; allDay: boolean }) => void;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddEvent, onClose }) => {
    const [isClient, setIsClient] = useState<boolean>(false);
    const [isCalendarMenuOpen, setIsCalendarMenuOpen] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const toggleCalendarMenu = (): void => {
        setIsCalendarMenuOpen(!isCalendarMenuOpen);
    };

    const toggleModal = (): void => {
        setIsModalOpen(!isModalOpen);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <aside className="w-[300px] p-[20px] transition-all bg-realBackground">
            <div className="flex items-center mb-[40px]">
                <button onClick={onClose}>
                    <img src="icon/list.svg" alt="Icon" className="w-6 h-6" />
                </button>

                <div>
                    <img
                        src="logo/logo2.svg"
                        alt="logo2"
                        className="w-[115px] h-auto ml-5"
                    />
                </div>
            </div>

            <div className="relative">
                <button
                    className="w-[134px] h-[50px] mb-[40px] bg-realBackground border py-2 rounded-round2 flex items-center justify-center space-x-2"
                    onClick={toggleModal}
                >
                    <div>일정 추가</div>
                </button>
            </div>

            <div className="mb-10">
                {isClient && (
                    <div className="bg-white p-2 rounded shadow-md">
                        <Calendar className="text-xs mt-2" />
                    </div>
                )}
            </div>

            <div className="mb-10">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold mb-2">캘린더 항목</h3>
                    <button
                        onClick={toggleCalendarMenu}
                        className="flex items-center"
                    >
                        <img
                            src={
                                isCalendarMenuOpen
                                    ? "icon/upArrow.svg"
                                    : "icon/downArrow.svg"
                            }
                            alt={isCalendarMenuOpen ? "up arrow" : "down arrow"}
                            className="w-4 h-4"
                        />
                    </button>
                </div>

                <AnimatePresence>
                    {isCalendarMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 mt-2"
                        >
                            {[{ id: "mySchedule", label: "나의 일정" }, { id: "sharedSchedule", label: "공유 일정" }, { id: "myVacation", label: "나의 휴가" }, { id: "sharedVacation", label: "공유 휴가" }].map(({ id, label }) => (
                                <div key={id} className="mt-4 flex items-center">
                                    <input
                                        type="checkbox"
                                        id={id}
                                        name={id}
                                        className="mr-2"
                                    />
                                    <label htmlFor={id}>{label}</label>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-2 mt-2">
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

            <Modal isOpen={isModalOpen} selectedDate="null" onClose={toggleModal} onAddEvent={onAddEvent} />
        </aside>
    );
};

export default Sidebar;
