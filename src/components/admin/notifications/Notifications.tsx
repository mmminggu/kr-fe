'use client';

import { useState } from 'react';
import {
    Bell,
    Eye ,
    CheckCircle,
    ChevronDown,
    EyeOff ,
    Search,
    Mail,
    Calendar,
    AlertCircle,
    Clock,
    MoreVertical,
    Trash2,
    FileDown,
} from 'lucide-react';

export default function Notifications(){
    const [activeTab, setActiveTab] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('전체 기간');
    const [selectedType, setSelectedType] = useState('전체 유형');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 페이지 당 알림 수

    // 알림 데이터 상태 (실제로는 API에서 가져옴)
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: '시스템',
            icon: <Mail size={16} className="text-gray-500" />,
            message: '[캠페인1] 고객 CS가 접수되었습니다.',
            timestamp: '2025-05-12T10:30:00',
            read: false,
        },
        {
            id: 2,
            type: '캠페인',
            icon: <Mail size={16} className="text-gray-500" />,
            message: '[캠페인2] 업체 CS가 접수되었습니다.',
            timestamp: '2025-05-12T09:15:00',
            read: false,
        },
        {
            id: 3,
            type: '마감',
            icon: <Mail size={16} className="text-gray-500" />,
            message: '"화장품 테스터" 캠페인 마감이 2일 남았습니다.',
            timestamp: '2025-05-12T07:45:00',
            read: false,
        },
        {
            id: 4,
            type: '시스템',
            icon: <Mail size={16} className="text-gray-500" />,
            message: '"헬스케어 제품" 캠페인이 예산 초과로 자동 중단되었습니다.',
            timestamp: '2025-05-11T17:22:00',
            read: true,
        },
        {
            id: 5,
            type: '캠페인',
            icon: <Mail size={16} className="text-gray-500" />,
            message: '"헬스케어 제품" 캠페인이 시작되었습니다.',
            timestamp: '2025-05-11T14:10:00',
            read: false,
        },
        {
            id: 6,
            type: '마감',
            icon: <Mail size={16} className="text-gray-500" />,
            message: '"여름 의류" 캠페인 모집이 마감되었습니다.',
            timestamp: '2025-05-10T10:30:00',
            read: true,
        },
    ]);

    // 알림 읽음 처리 함수
    const markAsRead = (id) => {
        setNotifications(
            notifications.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const toggleRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, read: !n.read } : n
            )
        );
    };

    // 모든 알림 읽음 처리 함수
    const markAllAsRead = () => {
        setNotifications(
            notifications.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    };

    // 탭 필터링 함수
    const filteredNotifications = notifications.filter((notification) => {
        // 탭 필터링
        if (activeTab === 'all') return true;
        if (activeTab === 'unread') return !notification.read;
        return notification.type === activeTab;
    }).filter((notification) => {
        // 검색어 필터링
        if (!searchQuery) return true;
        return notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const pagedNotifications = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);


    // 읽지 않은 알림 개수
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    // 알림 삭제 함수
    const deleteNotification = (id) => {
        setNotifications(notifications.filter((notification) => notification.id !== id));
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const MM = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        return `${yyyy}.${MM}.${dd} ${hh}:${mm}`;
    };


    // 엑셀 다운로드 함수
    const handleExcelDownload = () => {
        alert('알림 목록 엑셀 다운로드');
        // 실제 구현 시 API 호출 필요
    };

    // 알림 유형별 카운트
    const getTypeCounts = () => {
        const counts = {
            all: notifications.length,
            unread: unreadCount,
            시스템: notifications.filter(n => n.type === '시스템').length,
            캠페인: notifications.filter(n => n.type === '캠페인').length,
            마감: notifications.filter(n => n.type === '마감').length,
        };
        return counts;
    };

    const typeCounts = getTypeCounts();

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    알림 관리
                </h1>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                    <button
                        onClick={markAllAsRead}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                    >
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        모두 읽음 표시
                    </button>
                </div>
            </div>

            {/* 상태 필터 탭 */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200">
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        activeTab === 'all'
                            ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-indigo-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('all')}
                >
                    전체 ({typeCounts.all})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        activeTab === 'unread'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('unread')}
                >
                    읽지 않음 ({typeCounts.unread})
                </button>
            </div>

            {/* 필터 및 검색 영역 */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* 검색 입력 */}
                <div className="flex w-full md:w-auto">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-[400px] pl-10 p-2.5"
                            placeholder="알림 내용 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* 정렬 필터 */}
                <div className="relative w-full md:w-48 md:ml-auto">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                            />
                        </svg>
                    </div>
                    <select
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 appearance-none"
                        defaultValue="newest"
                    >
                        <option value="newest">최신순</option>
                        <option value="oldest">오래된순</option>
                        <option value="typeAsc">유형 오름차순</option>
                        <option value="typeDesc">유형 내림차순</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown size={18} className="text-gray-400" />
                    </div>
                </div>
            </div>

            {/* 알림 목록 */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                {filteredNotifications.length > 0 ? (
                    pagedNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`border-b last:border-b-0 border-gray-200 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                        >
                            <div className="px-6 py-4 flex justify-between">
                                <div
                                    className="flex cursor-pointer flex-1"
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex-shrink-0 pt-1">
                                        {notification.icon}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="text-sm flex items-center">
                                          <span className={notification.read ? "text-gray-700" : "font-medium"}>
                                            {notification.message}
                                          </span>
                                            {!notification.read && (
                                                <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                            )}
                                        </div>

                                        <div className="flex items-center mt-1">
                                          <span className="text-xs text-gray-500">
                                            {formatDate(notification.timestamp)}
                                          </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start ml-4 space-x-1">
                                    <button
                                        onClick={() => toggleRead(notification.id)} // ✅ 여기 변경
                                        className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                        title={notification.read ? '읽지 않음으로 표시' : '읽음으로 표시'}
                                    >
                                        {notification.read ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                        title="삭제"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="px-6 py-12 text-center">
                        <Bell size={48} className="mx-auto text-gray-300" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">알림이 없습니다</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchQuery
                                ? '검색 조건에 맞는 알림이 없습니다. 다른 검색어를 입력해보세요.'
                                : activeTab !== 'all'
                                    ? '해당 조건의 알림이 없습니다. 다른 필터를 선택해보세요.'
                                    : '아직 알림이 없습니다.'}
                        </p>
                    </div>
                )}
            </div>

            {/* 페이지네이션 (간단한 버전) */}
            {filteredNotifications.length > itemsPerPage && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">{indexOfFirstItem + 1}</span>
                                -
                                <span className="font-medium">
          {Math.min(indexOfLastItem, filteredNotifications.length)}
        </span>
                                {' / '}
                                <span className="font-medium">{filteredNotifications.length}</span> 건
                            </p>
                        </div>
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`px-2 py-1 text-sm rounded-md ${
                                    currentPage === 1
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
                                </svg>
                            </button>

                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                currentPage === pageNumber
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                }
                                if (
                                    (pageNumber === currentPage - 2 && currentPage > 3) ||
                                    (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                                ) {
                                    return (
                                        <span key={index} className="px-2 py-1 text-sm text-gray-500">
                                          ...
                                        </span>
                                    );
                                }
                                return null;
                            })}

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-2 py-1 text-sm rounded-md ${
                                    currentPage === totalPages
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>

            )}

        </div>
    );
};

