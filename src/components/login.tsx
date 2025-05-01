"use client"
import Image from 'next/image';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            {/* 로고와 헤더 */}
            <div className="flex flex-col items-center mb-12 mt-10">
                <Image src="/logos/login_logo.png" alt="로고" width={200} height={60} />
                <p className="text-sm mt-3 text-gray-500">계정 정보를 입력하여 로그인하세요</p>
            </div>

            {/* 로그인 폼 */}
            <form className="space-y-4">
                {/* 이메일 입력 */}
                <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Mail className="w-4 h-4 text-gray-400" />
                        </div>
                        <Input
                            id="email"
                            type="email"
                            placeholder="이메일을 입력하세요"
                            className="pl-9 w-full h-10"
                        />
                    </div>
                </div>

                {/* 비밀번호 입력 */}
                <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            className="pl-9 w-full h-10"
                        />
                    </div>
                </div>

                {/* 아이디/비밀번호 찾기 */}
                <div className="flex justify-end text-xs">
                    <a href="/findUserInfo" className="text-gray-600 hover:text-gray-800">아이디 찾기</a>
                    <span className="mx-2 text-gray-300">|</span>
                    <a href="/findUserInfo" className="text-gray-600 hover:text-gray-800">비밀번호 찾기</a>
                </div>

                {/* 로그인 버튼 */}
                <Button
                    type="submit"
                    className="w-full h-11 mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-md shadow-md transition-all"
                >
                    로그인
                </Button>

                {/* 회원가입 안내 */}
                <div className="text-center text-sm text-gray-500">
                    아직 회원이 아니신가요?{" "}
                    <a href="/signup" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        회원가입
                    </a>
                </div>

                {/* 구분선 */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white text-gray-500">간편 로그인</span>
                    </div>
                </div>

                {/* 소셜 로그인 버튼 */}
                <div className="flex justify-center gap-4 pb-5">
                    <Button
                        variant="ghost"
                        className="w-12 h-12 p-0 hover:bg-transparent"
                    >
                        <Image src="/img/login_naver.png" alt="네이버 로그인" width={50} height={50} />
                        <span className="sr-only">네이버 로그인</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-12 h-12 p-0 hover:bg-transparent"
                    >
                        <Image src="/img/login_kakao.png" alt="카카오톡 로그인" width={50} height={50} />
                        <span className="sr-only">카카오 로그인</span>
                    </Button>
                </div>
            </form>
        </div>
    </div>
    );
}