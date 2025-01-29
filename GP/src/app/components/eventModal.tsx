import React, { useState, ChangeEvent, FormEvent } from "react";

interface EventModalProps {
    isOpen: boolean;
    event: any;
    onClose: () => void;
    onUpdateEvent: (event: any) => void;
    onDeleteEvent: (eventId: string) => void;
}

const EventModal = ({ isOpen, event, onClose, onUpdateEvent, onDeleteEvent }: EventModalProps) => {
    const [eventTitle, setEventTitle] = useState<string>(event.title);
    const [startDate, setStartDate] = useState<string>(event.start);
    const [endDate, setEndDate] = useState<string>(event.end);
    const [description, setDescription] = useState<string>(event.description);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "eventTitle") setEventTitle(value);
        if (name === "startDate") setStartDate(value);
        if (name === "endDate") setEndDate(value);
        if (name === "description") setDescription(value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!eventTitle.trim() || !startDate || !endDate) {
            alert("필수 항목(제목, 날짜)을 입력해주세요.");
            return;
        }

        onUpdateEvent({
            id: event.id,
            title: eventTitle,
            start: startDate,
            end: endDate,
            description,
            allDay: true,
        });

        onClose();
    };

    const handleDelete = () => {
        if (window.confirm("정말로 이 이벤트를 삭제하시겠습니까?")) {
            onDeleteEvent(event.id);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md w-[450px] h-[550px] z-60 flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                    <div className="mt-4 mb-4 text-24px">
                        <input
                            type="text"
                            id="eventTitle"
                            name="eventTitle"
                            value={eventTitle}
                            onChange={handleInputChange}
                            className="mt-2 p-2 w-full border-b-2 border-gray-300 focus:outline-none focus:border-b-4 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4 text-14px">
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
                            />
                        </div>
                    </div>

                    <div className="mt-4 text-14px">
                        <label htmlFor="description" className="block">
                            설명
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
                            수정
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="ml-2 px-6 py-2 bg-red-500 text-white rounded-round2"
                        >
                            삭제
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;
