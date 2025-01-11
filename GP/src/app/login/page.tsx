"use client";

import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center h-screen bg-realBackground">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <img src="/logo/logo.svg" alt="Logo" className="mb-2" />
                </div>
                <form>
                    <div className="mb-4 border rounded-round">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1 ml-4 mt-2"
                        >
                            아이디
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="아이디를 입력해주세요"
                            className="w-full px-4 py-2 border-none rounded-lg text-14px text-gray-700 focus:outline-none "
                        />
                    </div>

                    <div className="mb-6 border rounded-round">
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
}
