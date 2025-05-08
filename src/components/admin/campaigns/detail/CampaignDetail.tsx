'use client';
import { useState } from 'react';
import { Progress } from '@/src/components/ui/progress';
import CampaignInfoCard from '@/src/components/admin/campaigns/detail/CampaignInfo';
import { OptionItem } from '@/src/components/admin/campaigns/detail/OptionTable';
import { RecruitmentDay } from '@/src/components/admin/campaigns/detail/RecruitmentTable';
import clsx from 'clsx';

interface Campaign {
    id: number;
    progress: number;
    productPrice: number;
    shippingFee: number;
    rewardPoints: number;
    options: OptionItem[];
    recruit: RecruitmentDay[];
}

import {
    Star, TrendingUp, PlusCircle, Users, FilePlus2, UserPlus,
    Clock, ReceiptText, Sparkles, PieChart, MessageCircle,
    CalendarDays, Bell, Search, RefreshCw, ChevronRight,
    Calendar, BadgeCheck, Pause, Play, Download, Filter, Pencil, Trash2, Settings, Save, Package
} from 'lucide-react';

export default function CampaignDetailPage() {
    const [activeTab, setActiveTab] = useState('receipt');
    const [campaign, setCampaign] = useState({
        id: 'CAM-2023-05-001',
        title: '신제품 스마트워치 체험단 모집',
        status: '진행 중', // '예정', '종료'
        startDate: '2025-05-01',
        endDate: '2025-05-30',
        progress: 62,
        productPrice: 159000,
        shippingFee: 3000,
        rewardPoints: 15000,
        options: [
            {
                name: '블랙',
                isWished: true,                 // 찜 여부
                isPhotoRequired: true,         // 포토 증빙 여부
                reviewType: '포토리뷰',         // '포토리뷰' | '텍스트리뷰'
                deliveryType: '실배송',         // '실배송' | '빈박스'
                recruitCount: 30,               // 모집 인원
                point: 1000
            },
            {
                name: '화이트',
                isWished: false,
                isPhotoRequired: false,
                reviewType: '텍스트리뷰',
                deliveryType: '빈박스',
                recruitCount: 50,
                point: 500
            }
        ],
        recruit:[
            {
                date: '2025-05-01',
                quota: 5,
            },
            {
                date: '2025-05-02',
                quota: 3,
            }
        ],
        totalRecruits: 100,
        currentRecruits: 62,
        csWaiting: 8,
        csCompleted: 24,
        todayRecruits: 5,
        receiptProofs: {
            waiting: 18,
            approved: 34,
            rejected: 2
        },
        reviewProofs: {
            waiting: 12,
            approved: 22,
            rejected: 0
        }
    });

    const [activePeriod, setActivePeriod] = useState('1m');  // 활성화된 기간 ('1m', '3m', '6m', 'custom')
    const [dateRange, setDateRange] = useState([new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()]); // [시작일, 종료일]
    const [statusFilter, setStatusFilter] = useState('');  // 상태 필터
    const [searchText, setSearchText] = useState('');  // 검색어

    // 날짜 포맷 헬퍼 함수
    const formatDateYYYY_MM_DD = (date) => {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
    };

    // 검색 핸들러
    const handleSearch = () => {
        // 검색 로직 구현
        console.log('검색:', {
            기간: activePeriod,
            시작일: formatDate(dateRange[0]),
            종료일: formatDate(dateRange[1]),
            상태: statusFilter,
            검색어: searchText
        });
    };

    const handleStatusChange = (newStatus) => {
        setCampaign({...campaign, status: newStatus});
    };

    const handleCampaignAction = (action) => {
        // 캠페인 승인, 반려, 중단, 재개 등의 액션 처리
        console.log(`Campaign ${action} action triggered`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    // 샘플 데이터
    const csItems = [
        {id: 'CS001', user: '김고객', question: '제품 배송일이 언제인가요?', date: '2025-05-03', status: '대기중'},
        {id: 'CS002', user: '이용자', question: '옵션 변경이 가능한가요?', date: '2025-05-04', status: '대기중'},
        {id: 'CS003', user: '박체험', question: '리뷰 작성 기한이 어떻게 되나요?', date: '2025-05-04', status: '대기중'},
    ];

    const receiptProofs = [
        {id: 'RP001', user: '김구매', date: '2025-05-02', status: '대기중', imageUrl: '/images/receipt1.jpg'},
        {id: 'RP002', user: '이증빙', date: '2025-05-03', status: '대기중', imageUrl: '/images/receipt2.jpg'},
    ];

    const reviewProofs = [
        {
            id: 'RV001',
            user: '박리뷰',
            date: '2025-05-03',
            status: '대기중',
            platform: '네이버',
            linkUrl: 'https://example.com/review1'
        },
        {
            id: 'RV002',
            user: '최체험',
            date: '2025-05-04',
            status: '대기중',
            platform: '인스타그램',
            linkUrl: 'https://example.com/review2'
        },
    ];

    const reservations = [
        {id: '1', name: '김예약', email: 'kim@example.com', phone: '010-1234-5678', option: '블랙', date: '2025-05-01'},
        {id: '2', name: '이신청', email: 'lee@example.com', phone: '010-2345-6789', option: '화이트', date: '2025-05-01'},
        {id: '3', name: '박참여', email: 'park@example.com', phone: '010-3456-7890', option: '블루', date: '2025-05-02'},
    ];

    const toggleStatus = () => {
        setCampaignStatus((prev) =>
            prev === '진행 중' ? '중단' : '진행 중'
        );
    };

    return (
        <div className="container mx-auto  ">
            {/* 고정 상단 캠페인 요약 헤더 */}
            <div className="fixed top-0 left-64 right-0 z-30 bg-white border-b border-gray-200 shadow-sm px-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* 왼쪽: 타이틀 + 상태 + 날짜 */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                            <h1 className="text-xl font-bold text-gray-900">{campaign.title}</h1>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            {/* 상태 뱃지 */}
                            <span className={`
                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${campaign.status === '진행 중' ? 'bg-emerald-100 text-emerald-800' :
                                campaign.status === '예정' ? 'bg-blue-100 text-blue-800' :
                                    campaign.status === '중단' ? 'bg-rose-100 text-rose-800' :
                                        'bg-gray-100 text-gray-800'}
                                      `}>
                                        {campaign.status === '진행 중' && <Clock className="w-4 h-4 mr-1" />}
                                                                    {campaign.status === '예정' && <CalendarDays className="w-4 h-4 mr-1" />}
                                                                    {campaign.status === '종료' && <BadgeCheck className="w-4 h-4 mr-1" />}
                                                                    {campaign.status === '중단' && <Pause className="w-4 h-4 mr-1" />}
                                                                    {campaign.status}
                                      </span>

                                                                {/* 날짜 */}
                                                                <span className="text-gray-500">
                                        {campaign.startDate} ~ {campaign.endDate}
                                      </span>
                        </div>
                    </div>

                    {/* 오른쪽: 캠페인 상태 토글 버튼 */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleStatus}
                            className={`text-sm px-4 py-2 rounded-md text-white flex items-center gap-1.5
                            ${campaign.status === '진행 중'
                                                        ? 'bg-rose-500 hover:bg-rose-600'
                                                        : 'bg-emerald-500 hover:bg-emerald-600'}
                          `}
                                                >
                            {campaign.status === '진행 중' ? <Pause size={16} /> : <Play size={16} />}
                            {campaign.status === '진행 중' ? '캠페인 중단' : '캠페인 실행'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 대시보드 요약 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-6 pt-[90px]">
            <StatCard
                title="오늘 신청 수"
                value="5건"
                icon={<FilePlus2 size={20} />}
                color="orange"
            />
            <StatCard
                title="오늘 모집률"
                value="50%"
                icon={<TrendingUp size={20} />}
                color="blue"
            />
            <StatCard
                title="CS 답변 대기"
                value="24건"
                icon={<MessageCircle size={20} />}
                color="red"
            />
            <StatCard
                title="구매 승인 대기"
                value="30건"
                icon={<ReceiptText size={20} />}
                color="yellow"
            />
            <StatCard
                title="리뷰 승인 대기"
                value="15건"
                icon={<Clock size={20} />}
                color="purple"
            />
            </div>

            {/* 캠페인 기본 정보 카드 */}
            <CampaignInfoCard campaign={campaign} />

            {/* 증빙 목록 탭 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="px-6 pt-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                        <ReceiptText className="w-5 h-5 mr-2 text-indigo-600" />
                        증빙 목록
                    </h2>
                </div>
                <div className="flex bg-white rounded-t-lg overflow-hidden px-6">
                    <button
                        className={clsx(
                            'flex items-center px-4 py-3 bg-gray-100 text-sm rounded-t-lg font-medium transition-colors',
                            activeTab === 'receipt'
                                ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        )}
                        onClick={() => setActiveTab('receipt')}
                    >
                        구매 영수증 증빙
                    </button>
                    <button
                        className={clsx(
                            'flex items-center px-4 py-3 bg-gray-100 text-sm rounded-t-lg font-medium transition-colors',
                            activeTab === 'review'
                                ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        )}
                        onClick={() => setActiveTab('review')}
                    >
                        리뷰 증빙
                    </button>
                </div>

                <div className="px-6 pb-6 border rounded-xl mx-6 mb-6">
                    {/* 필터 영역 */}
                    <div className="py-4">
                        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1">
                            {/* 상태 필터 */}
                            <div className="flex items-center whitespace-nowrap">
                                <select
                                    className="h-9 bg-white border border-gray-300 text-gray-700 text-sm rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-24"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">전체</option>
                                    <option value="pending">대기중</option>
                                    <option value="approved">승인됨</option>
                                    <option value="rejected">반려됨</option>
                                </select>
                            </div>

                            {/* 검색 필드 */}
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="회원명 검색"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        className="h-9 w-[500px] px-2 pl-7 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                                </div>
                                {/* 검색 버튼 */}
                                <button
                                    className="h-9 px-3 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap flex items-center"
                                    onClick={handleSearch}
                                >
                                    검색
                                </button>
                                {/* 초기화 버튼 */}
                                <button
                                    className="h-9 px-3 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors flex items-center whitespace-nowrap"
                                    onClick={() => {
                                        setActivePeriod('1m');
                                        const endDate = new Date();
                                        const startDate = new Date();
                                        startDate.setMonth(startDate.getMonth() - 1);
                                        setDateRange([startDate, endDate]);
                                        setStatusFilter('');
                                        setSearchText('');
                                    }}
                                >
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                    초기화
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 테이블 구조 - OptionTable과 동일한 스타일 적용 */}
                    <div className="rounded-xl overflow-hidden border border-gray-200">
                        <table className="w-full table-fixed text-sm text-gray-900 border-collapse">
                            <thead className="bg-gray-100 text-xs font-semibold text-gray-600 sticky top-0 z-10">
                            <tr className="border-b">
                                <th className="px-4 py-2 text-left w-[30%]">회원</th>
                                <th className="px-4 py-2 text-left w-[20%]">날짜</th>
                                <th className="px-4 py-2 text-left w-[15%]">상태</th>
                                <th className="px-4 py-2 text-left w-[20%]">
                                    {activeTab === 'receipt' ? '이미지' : '플랫폼'}
                                </th>
                                <th className="px-4 py-2 text-right w-[15%]">액션</th>
                            </tr>
                            </thead>
                            <tbody>
                            {(activeTab === 'receipt' ? receiptProofs : reviewProofs).map((proof) => (
                                <tr key={proof.id} className="hover:bg-gray-50 border-b">
                                    <td className="px-4 py-3 text-left">{proof.user}</td>
                                    <td className="px-4 py-3 text-left">{proof.date}</td>
                                    <td className="px-4 py-3 text-left">
                                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-amber-100 text-amber-800">
                                        {proof.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-left text-blue-600 hover:underline">
                                        {activeTab === 'receipt' ? '이미지 보기' : proof.platform}
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button className="text-green-600 hover:text-green-900 mr-3">승인</button>
                                        <button className="text-red-600 hover:text-red-900">반려</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이지네이션*/}
                    <div className="flex items-center justify-center mt-4">
                        <div className="flex space-x-1">
                            <button className="px-3 py-2 border border-gray-300 bg-indigo-600 text-sm font-medium rounded-md text-white hover:bg-indigo-700">
                                1
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 예약자 리스트 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div className="p-5">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-blue-600"/>
                            예약자 리스트
                        </h2>
                    </div>

                    {/* 필터 영역 */}
                    <div className="mb-6 border border-gray-100 rounded-lg p-4 bg-gray-50">
                        <div className="flex flex-wrap items-center gap-3">
                            {/* 상태 필터 */}
                            <div className="flex items-center whitespace-nowrap">
                                <select
                                    className="h-10 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-28 shadow-sm"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="name">이름</option>
                                    <option value="pending">이메일</option>
                                </select>
                            </div>

                            {/* 검색 필드 */}
                            <div className="flex-1 flex items-center gap-2">
                                <div className="relative flex-1 max-w-2xl">
                                    <input
                                        type="text"
                                        placeholder="검색어를 입력하세요"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        className="h-10 w-full px-3 pl-9 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                    />
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                </div>

                                {/* 검색 버튼 */}
                                <button
                                    className="h-10 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm whitespace-nowrap flex items-center"
                                    onClick={handleSearch}
                                >
                                    검색
                                </button>

                                {/* 초기화 버튼 */}
                                <button
                                    className="h-10 px-4 border border-gray-200 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center whitespace-nowrap shadow-sm"
                                    onClick={() => {
                                        setActivePeriod('1m');
                                        const endDate = new Date();
                                        const startDate = new Date();
                                        startDate.setMonth(startDate.getMonth() - 1);
                                        setDateRange([startDate, endDate]);
                                        setStatusFilter('');
                                        setSearchText('');
                                    }}
                                >
                                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                                    초기화
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 예약자 테이블 */}
                    <div className="overflow-hidden rounded-lg border border-gray-100 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto text-sm text-gray-800 border-collapse">
                                <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-4 py-3.5 text-left border-b border-gray-200">이름</th>
                                    <th className="px-4 py-3.5 text-left border-b border-gray-200">이메일</th>
                                    <th className="px-4 py-3.5 text-left border-b border-gray-200">연락처</th>
                                    <th className="px-4 py-3.5 text-left border-b border-gray-200">옵션</th>
                                    <th className="px-4 py-3.5 text-left border-b border-gray-200">예약일</th>
                                    <th className="px-4 py-3.5 text-right border-b border-gray-200">액션</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {reservations.map((reservation) => (
                                    <tr key={reservation.id} className="hover:bg-blue-50 transition-colors duration-150">
                                        <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-gray-800">{reservation.name}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-600">{reservation.email}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-600">{reservation.phone}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-600">{reservation.option}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-600">{reservation.date}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-800 transition-colors px-3 py-1.5 rounded-md hover:bg-blue-50">상세보기</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 페이지네이션 */}
                        <div className="flex items-center justify-center p-4 border-t border-gray-100 bg-gray-50">
                            <div className="flex space-x-1">
                                <button className="px-3 py-1.5 border border-gray-200 bg-white text-sm font-medium rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
                                    이전
                                </button>
                                <button className="px-3 py-1.5 border border-transparent bg-blue-600 text-sm font-medium rounded-md text-white hover:bg-blue-700 transition-colors">
                                    1
                                </button>
                                <button className="px-3 py-1.5 border border-gray-200 bg-white text-sm font-medium rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
                                    2
                                </button>
                                <button className="px-3 py-1.5 border border-gray-200 bg-white text-sm font-medium rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
                                    3
                                </button>
                                <button className="px-3 py-1.5 border border-gray-200 bg-white text-sm font-medium rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
                                    다음
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
);
}


// 통계 카드 컴포넌트
function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
    const colorVariants = {
        blue: "bg-blue-100 text-blue-700",
        green: "bg-green-100 text-green-700",
        orange: "bg-orange-100 text-orange-700",
        yellow: "bg-yellow-100 text-yellow-700",
        purple: "bg-purple-100 text-purple-700",
        red: "bg-red-100 text-red-700",
    };

    return (
        <div className="bg-white rounded-lg shadow-sm px-8 py-4 border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorVariants[color as keyof typeof colorVariants]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}