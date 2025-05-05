'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, MessageSquare, Moon, Sun, User, Menu, Settings, LogOut } from 'lucide-react';

export default function ClientHeader() {
    const [darkMode, setDarkMode] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // 다크모드 토글 함수
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    // 모바일 메뉴 토글 - 사이드바 컨트롤을 위한 커스텀 이벤트
    const toggleMobileMenu = () => {
        const event = new CustomEvent('toggle-sidebar', {
            detail: { open: !mobileMenuOpen }
        });
        document.dispatchEvent(event);
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="px-4 md:px-6 py-3 flex items-center justify-between">
                {/* 헤더 좌측: 모바일에서 햄버거 메뉴 */}
                <div className="flex items-center md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        aria-label="메뉴 열기"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* 헤더 중앙: 검색바 (데스크톱) */}
                <div className="hidden md:flex flex-1 max-w-md mx-4">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="검색..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 헤더 우측: 기능 버튼 */}
                <div className="flex items-center space-x-1 md:space-x-4">
                    {/* 다크모드 토글 */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
                    >
                        {darkMode ? (
                            <Sun size={20} className="text-gray-600 dark:text-gray-300" />
                        ) : (
                            <Moon size={20} className="text-gray-600 dark:text-gray-300" />
                        )}
                    </button>

                    {/* 메시지 */}
                    <Link
                        href="/client/messages"
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
                    >
                        <MessageSquare size={20} className="text-gray-600 dark:text-gray-300" />
                        <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center rounded-full bg-red-500 text-white">
              3
            </span>
                    </Link>

                    {/* 알림 */}
                    <div className="relative">
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="p-2 rounded-md transition-colors relative hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                            aria-label="알림"
                        >
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800">
      5
    </span>
                        </button>

                        {notificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 z-50 border max-h-96 overflow-y-auto bg-white border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                                {/* 헤더 */}
                                <div className="px-4 py-2 border-b flex justify-between items-center border-gray-100 dark:border-gray-700">
                                    <p className="text-sm font-medium">알림</p>
                                    <button className="text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                                        모두 읽음 표시
                                    </button>
                                </div>

                                {/* 알림 리스트 */}
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {/* 샘플 알림 항목들 */}
                                    <div className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <div className="flex">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2" />
                                            <div>
                                                <p className="text-sm">새로운 리뷰어 신청이 3건 있습니다.</p>
                                                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">10분 전</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <div className="flex">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2" />
                                            <div>
                                                <p className="text-sm">"여름 신상품" 캠페인 리뷰 2건이 제출되었습니다.</p>
                                                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">1시간 전</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <div className="flex">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-2" />
                                            <div>
                                                <p className="text-sm">"화장품 테스터" 캠페인 마감이 2일 남았습니다.</p>
                                                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">5시간 전</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 하단 전체 보기 */}
                                <div className="px-4 py-2 border-t text-center border-gray-100 dark:border-gray-700">
                                    <Link
                                        href="/client/notifications"
                                        className="text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                                    >
                                        모든 알림 보기
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>


                    {/* 프로필 */}
                    <div className="relative ml-2">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                                <User size={15} />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">홍길동</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">관리자</p>
                            </div>
                        </button>
                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 z-50 border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">플로우몰</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">flow@example.com</p>
                                    <div className="mt-2 flex gap-1">
                                        <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full dark:bg-purple-900 dark:text-purple-200">
                                          관리자
                                        </span>
                                                <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                                          슈퍼 관리자
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href="/client/profile"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    <User size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                                    프로필 설정
                                </Link>
                                <Link
                                    href="/client/settings"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    <Settings size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                                    계정 설정
                                </Link>
                                <button
                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    <LogOut size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                                    로그아웃
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 모바일용 검색바 */}
            <div className="md:hidden px-4 pb-3">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="검색..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </header>
    );
}