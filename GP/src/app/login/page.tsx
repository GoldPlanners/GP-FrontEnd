"use client";

import Link from "next/link";
import { FC, FormEvent, useState } from "react";
import { login } from "@/api/auth/auth";
import { useRouter } from "next/navigation";

const LoginPage: FC = () => {
    const [loginId, setLoginId] = useState<string>("");
    const [loginPw, setLoginPw] = useState<string>("");
    const [error, setError] = useState<string>("");
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        try {
            const data = await login(loginId, loginPw);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            router.push("/calendar");
        } catch (err: any) {
            console.error("Login failed:", err);
            setError(
                "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요."
            );
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-realBackground">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <img src="/logo/logo.svg" alt="Logo" className="mb-2" />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 border rounded-round">
                        <label
                            htmlFor="loginId"
                            className="block text-sm font-medium text-gray-700 mb-1 ml-4 mt-2"
                        >
                            아이디
                        </label>
                        <input
                            id="loginId"
                            type="text"
                            value={loginId}
                            placeholder="아이디를 입력해주세요"
                            className="w-full px-4 py-2 border-none rounded-lg text-14px text-gray-700 focus:outline-none"
                            onChange={(e) => setLoginId(e.target.value)}
                        />
                    </div>

                    <div className="mb-6 border rounded-round">
                        <label
                            htmlFor="loginPw"
                            className="block text-sm font-medium text-gray-700 mb-1 ml-4 mt-2"
                        >
                            비밀번호
                        </label>
                        <input
                            id="loginPw"
                            type="password"
                            value={loginPw}
                            placeholder="비밀번호를 입력해주세요"
                            className="w-full px-4 py-2 border-none rounded-lg text-14px text-gray-700 focus:outline-none"
                            onChange={(e) => setLoginPw(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-auto bg-button1 hover:bg-button1Hover text-white py-2 px-8 rounded-round2 focus:outline-none focus:ring-2"
                        >
                            로그인
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        계정이 없으신가요?{" "}
                        <Link
                            href="/signup"
                            className="text-loginText hover:underline"
                        >
                            가입하기
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
