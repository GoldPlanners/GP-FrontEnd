"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useState, ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formatPhoneNumber = (value: string): string => {
    let formattedValue = value.replace(/\D/g, "");
    if (formattedValue.length > 3 && formattedValue.length <= 7) {
        formattedValue = formattedValue.replace(/(\d{3})(\d{1,4})/, "$1-$2");
    } else if (formattedValue.length > 7) {
        formattedValue = formattedValue.replace(
            /(\d{3})(\d{4})(\d{1,4})/,
            "$1-$2-$3"
        );
    }

    if (formattedValue.replace(/-/g, "").length > 10) {
        formattedValue = formattedValue.slice(0, 13);
    }

    return formattedValue;
};

type newUserType = {
    userId: string;
    password: string;
    confirmPassword: string;
    phone: string;
    emergencyPhone: string;
    relationship: string;
};

const schema = z
    .object({
        userId: z.string().min(1, "아이디(이름)를 입력해주세요"),
        password: z
            .string()
            .min(4, "비밀번호는 4자 이상이어야 합니다")
            .max(20, "비밀번호는 20자 이내로 입력해주세요"),
        confirmPassword: z.string(),
        phone: z
            .string()
            .refine((value) => value.startsWith("010"), {
                message: "010으로 시작하는 11자리 숫자를 입력해주세요.",
            })
            .refine((value) => value.length >= 11, {
                message: "연락처는 11자리여야 합니다.",
            }),
        emergencyPhone: z
            .string()
            .refine((value) => value.startsWith("010"), {
                message: "010으로 시작하는 11자리 숫자를 입력해주세요.",
            })
            .refine((value) => value.length >= 11, {
                message: "긴급 연락처는 11자리여야 합니다.",
            }),
        relationship: z.string().min(1, "관계를 선택해주세요"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["confirmPassword"],
    });

export default function SignupPage() {
    const [phone, setPhone] = useState<string>("");
    const [emergencyPhone, setEmergencyPhone] = useState<string>("");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            userId: "",
            password: "",
            confirmPassword: "",
            phone: "",
            emergencyPhone: "",
            relationship: "가족",
        },
    });

    const handleDuplicateCheck = () => {};

    const onSubmit = (data: newUserType) => {
        const phoneWithoutHyphen = data.phone.replace(/-/g, "");
        const emergencyPhoneWithoutHyphen = data.emergencyPhone.replace(
            /-/g,
            ""
        );

        console.log("onSubmit called", {
            ...data,
            phone: phoneWithoutHyphen,
            emergencyPhone: emergencyPhoneWithoutHyphen,
        });

    };

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;
        setPhone(formatPhoneNumber(value));
    };

    const handleEmergencyPhoneChange = (
        e: ChangeEvent<HTMLInputElement>
    ): void => {
        const { value } = e.target;
        setEmergencyPhone(formatPhoneNumber(value));
    };
    return (
        <div className="flex items-center justify-center h-screen bg-realBackground">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <div className="self-start mb-4">
                        <Link href="/login">
                            <div className="flex items-center hover:underline cursor-pointer">
                                <FiArrowLeft className="w-5 h-5 mr-1" />
                            </div>
                        </Link>
                    </div>
                    <img src="/logo/logo2.svg" alt="Logo" className="mb-2" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="border rounded-round">
                        <label
                            htmlFor="userId"
                            className="block text-sm font-medium text-gray-700 mb-1 ml-4 mt-2"
                        >
                            아이디(이름)
                        </label>
                        <div className="flex items-center">
                            <input
                                id="userId"
                                type="text"
                                placeholder="아이디(이름)를 입력해주세요"
                                className="flex-grow px-4 py-2 border-none rounded-l-lg text-14px text-gray-700 focus:outline-none"
                                {...register("userId")}
                            />

                            <button
                                type="button"
                                className="mb-1 mr-1 bg-button1 hover:bg-button1Hover text-white text-sm py-2 px-4 rounded-lg focus:outline-none"
                                onClick={handleDuplicateCheck}
                            >
                                중복검사
                            </button>
                        </div>
                    </div>
                    {errors.userId && (
                        <p className="text-red-500 text-xs mt-1 ml-4">
                            {errors.userId.message}
                        </p>
                    )}

                    <div className="mt-4 border rounded-round">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1 ml-4 mt-2"
                        >
                            비밀번호
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="비밀번호를 입력해주세요"
                            className="w-full px-4 py-2 border-none rounded-lg text-14px text-gray-700 focus:outline-none "
                            {...register("password")}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1 ml-4">
                            {errors.password.message}
                        </p>
                    )}

                    <div className="mt-4 border rounded-round">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1 ml-4 mt-2"
                        >
                            비밀번호 확인
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="한번 더 입력해주세요"
                            className="w-full px-4 py-2 border-none rounded-lg text-14px text-gray-700 focus:outline-none"
                            {...register("confirmPassword")}
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1 ml-4">
                            {errors.confirmPassword.message}
                        </p>
                    )}

                    <Controller
                        name="phone"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <div className="mt-4 border rounded-round">
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700 mb-1 ml-4 mt-2"
                                >
                                    휴대 전화번호
                                </label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={field.value}
                                    onChange={(e) => {
                                        const formattedValue =
                                            formatPhoneNumber(e.target.value);
                                        field.onChange(formattedValue);
                                    }}
                                    placeholder="휴대 전화번호를 입력해주세요"
                                    className="w-full px-4 py-2 border-none rounded-lg text-14px text-gray-700 focus:outline-none "
                                />
                            </div>
                        )}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-xs mt-1 ml-4">
                            {errors.phone.message}
                        </p>
                    )}

                    <div className="flex">
                        <div className="flex-grow mt-4 border rounded-round">
                            <Controller
                                name="emergencyPhone"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <>
                                        <label
                                            htmlFor="emergencyPhone"
                                            className="block text-sm font-medium text-gray-700 mb-1 ml-4 mt-2"
                                        >
                                            긴급 휴대 전화번호
                                        </label>
                                        <input
                                            id="emergencyPhone"
                                            type="text"
                                            value={field.value}
                                            onChange={(e) => {
                                                const formattedValue =
                                                    formatPhoneNumber(
                                                        e.target.value
                                                    );
                                                field.onChange(formattedValue);
                                            }}
                                            placeholder="긴급 휴대 전화번호를 입력해주세요"
                                            className="w-full px-4 py-2 border-none rounded-lg text-14px text-gray-700 focus:outline-none "
                                        />
                                    </>
                                )}
                            />
                        </div>

                        <div className="ml-2 mt-4 border rounded-round">
                            <label
                                htmlFor="relationship"
                                className="block text-sm font-medium text-gray-700 mb-1 ml-4 mt-2"
                            >
                                관계
                            </label>
                            <div className="ml-2 mr-3">
                                <select
                                    id="relationship"
                                    {...register("relationship")}
                                    className="w-full pl-1 pr-3 py-2 border-none rounded-lg text-14px text-gray-700 focus:outline-none"
                                >
                                    <option value="가족">가족</option>
                                    <option value="친구">친구</option>
                                    <option value="동료">동료</option>
                                    <option value="연인">연인</option>
                                    <option value="기타">기타</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {errors.emergencyPhone && (
                        <p className="text-red-500 text-xs mt-1 ml-4">
                            {errors.emergencyPhone.message}
                        </p>
                    )}
                    {errors.relationship && (
                        <p className="text-red-500 text-xs mt-1 ml-4">
                            {errors.relationship.message}
                        </p>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="mt-4 w-auto bg-button1 hover:bg-button1Hover text-white py-2 px-8 rounded-round2 focus:outline-none focus:ring-2"
                        >
                            회원가입
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
