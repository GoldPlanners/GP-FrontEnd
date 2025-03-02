import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { updateCalendarPlan, updateVacation } from "@/api/calendar/calendar";

import {
    MdPerson,
    MdDateRange,
    MdDescription,
    MdBeachAccess,
    MdDelete,
    MdClose,
    MdEdit,
} from "react-icons/md";

interface Event {
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    createdBy?: string;
    description?: string;
    vacationType?: string;
    startDate?: string;
    endDate?: string;
    color?: string;
    id?: string;
}

interface EventModalProps {
    isOpen: boolean;
    event: Event | null;
    onClose: () => void;
    position: { x: number; y: number };
}

const EventModal = ({ isOpen, event, onClose, position }: EventModalProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [createdBy, setCreatedBy] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [vacationType, setVacationType] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [realId, setrealId] = useState<string>("");
    const [color, setColor] = useState<string>("");

    const [isMorningHalfDay, setIsMorningHalfDay] = useState<boolean>(false);
    const [isAfternoonHalfDay, setIsAfternoonHalfDay] =
        useState<boolean>(false);

    useEffect(() => {
        if (event) {
            const eventTitle = event.title.split(" - ")[1] || event.title;
            setTitle(eventTitle);
            setCreatedBy(event.createdBy || "");
            setDescription(event.description || "");
            setVacationType(event.vacationType || "");
            setStartDate(event.startDate || "");
            setEndDate(event.endDate || "");
            setColor(event.color || "");
            setrealId(event.id || "");

            if (event.vacationType === "HALF_DAY_MORING") {
                setIsMorningHalfDay(true);
                setIsAfternoonHalfDay(false);
            } else if (event.vacationType === "HALF_DAY_AFTERNOON") {
                setIsMorningHalfDay(false);
                setIsAfternoonHalfDay(true);
            } else {
                setIsMorningHalfDay(false);
                setIsAfternoonHalfDay(false);
            }
        }
        setIsEditing(false);
    }, [event]);

    const getVacationTypeLabel = (vacationType: string): string => {
        switch (vacationType) {
            case "FULL_DAY":
                return "연차";
            case "HALF_DAY_MORING":
                return "오전반차";
            case "HALF_DAY_AFTERNOON":
                return "오후반차";
            default:
                return vacationType || "없음";
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR");
    };

    if (!isOpen || !event) return null;

    const handleDelete = () => {
        console.log("이벤트 삭제:", event);
        onClose();
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        const updatedVacation = {
            title,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            description,
        };

        try {
            const response = await updateCalendarPlan(realId, updatedVacation);
            alert("휴가가 성공적으로 수정되었습니다.");

            setIsEditing(false);
            onClose();
        } catch (error) {
            console.error("휴가 수정 실패:", error);
        }
    };

    const handleClose = () => {
        setIsEditing(false);
        onClose();
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
    };

    const handleMorningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setIsMorningHalfDay(true);
            setIsAfternoonHalfDay(false);
        } else {
            setIsMorningHalfDay(false);
        }
    };

    const handleAfternoonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setIsAfternoonHalfDay(true);
            setIsMorningHalfDay(false);
        } else {
            setIsAfternoonHalfDay(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleClose}
        >
            <motion.div
                className="relative"
                style={{
                    top: position.y,
                    left: position.x,
                    transform: "translate(-50%, -50%)",
                    position: "absolute",
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={modalVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white p-6 rounded-round2 shadow-lg w-96 relative">
                    <div className="mt-6 mb-2 flex items-center">
                        <div
                            className="w-4 h-4 rounded-full mr-2 justify-center"
                            style={{ backgroundColor: color }}
                        ></div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="p-2 rounded border w-full"
                            />
                        ) : (
                            <p className="p-2 rounded text-20px">{title}</p>
                        )}
                    </div>

                    <div className="mb-2 flex items-center">
                        <MdPerson className="text-xl mr-2" />
                        <p className="p-2 rounded">{createdBy}</p>
                    </div>

                    <div className="mb-2 flex items-center space-x-2">
                        <div className="flex items-center">
                            <MdDateRange className="text-xl mr-2" />
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="p-2 rounded border text-14px"
                                />
                            ) : (
                                <p className="p-2 rounded">
                                    {formatDate(startDate)}
                                </p>
                            )}
                        </div>

                        <span className="text-14px">~</span>

                        <div className="flex items-center">
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="p-2 rounded border text-14px"
                                />
                            ) : (
                                <p className="p-2 rounded">
                                    {formatDate(endDate)}
                                </p>
                            )}
                        </div>
                    </div>

                    {event.vacationType && (
                        <div className="mb-2 flex items-center">
                            <MdBeachAccess className="text-xl mr-2" />
                            {isEditing ? (
                                <div className="flex text-14px">
                                    <label className="mr-2 flex">
                                        <input
                                            type="checkbox"
                                            checked={isMorningHalfDay}
                                            onChange={handleMorningChange}
                                            className="mr-2"
                                        />
                                        <div>오전반차</div>
                                    </label>
                                    <label className="flex">
                                        <input
                                            type="checkbox"
                                            checked={isAfternoonHalfDay}
                                            onChange={handleAfternoonChange}
                                            className="mr-2"
                                        />
                                        <div>오후반차</div>
                                    </label>
                                </div>
                            ) : (
                                <p className="p-2 rounded">
                                    {getVacationTypeLabel(vacationType)}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="mb-2 flex items-center">
                        <MdDescription className="text-xl mr-2" />
                        {isEditing ? (
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="p-2 rounded border w-full text-14px"
                            />
                        ) : (
                            <p className="p-2 rounded">{description}</p>
                        )}
                    </div>

                    <div className="absolute top-2 right-2 flex space-x-2">
                        {isEditing ? (
                            <button
                                onClick={handleSave}
                                className="p-2 rounded text-16px"
                            >
                                저장
                            </button>
                        ) : (
                            <button
                                onClick={handleEdit}
                                className="p-2 rounded text-20px"
                            >
                                <MdEdit />
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            className="p-2 rounded text-20px"
                        >
                            <MdDelete />
                        </button>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded text-20px"
                        >
                            <MdClose />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EventModal;
