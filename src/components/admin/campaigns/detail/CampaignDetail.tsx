'use client';
import { useState } from 'react';
import { Progress } from '@/src/components/ui/progress';
import CampaignInfoCard from '@/src/components/admin/campaigns/detail/CampaignInfo';
import { OptionItem } from '@/src/components/admin/campaigns/detail/OptionTable';
import { RecruitmentDay } from '@/src/components/admin/campaigns/detail/RecruitmentTable';


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
    Star, TrendingUp, CircleX, AlertCircle, Users, Gift, UserPlus,
    Clock, ReceiptText, Sparkles, PieChart, MessageCircle,
    CalendarDays, Bell, FileCheck, Briefcase, ChevronRight,
    Check, X, Pause, Play, Download, Filter, Pencil, Trash2, Settings, Save, Package
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 pt-[90px]">
            <StatCard
                title="총 진행률"
                value="62%"
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
                <div className="flex border-b border-gray-200">
                    <button
                        className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'receipt' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('receipt')}>
                        구매 영수증 증빙
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'review' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('review')}>
                        리뷰 증빙
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {activeTab === 'receipt' ? '구매 영수증 증빙 목록' : '리뷰 증빙 목록'}
                        </h3>

                        <div className="flex items-center space-x-2">
                            <button
                                className="text-sm text-gray-600 flex items-center bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded-lg">
                                <Filter className="w-4 h-4 mr-1"/> 필터
                            </button>
                            <span className="text-sm text-gray-500">
                {activeTab === 'receipt'
                    ? `대기: ${campaign.receiptProofs.waiting}건`
                    : `대기: ${campaign.reviewProofs.waiting}건`}
              </span>
                        </div>
                    </div>

                    {/* 증빙 목록 테이블 */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {activeTab === 'receipt' ? '이미지' : '플랫폼'}
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {activeTab === 'receipt' ? (
                                receiptProofs.map((proof) => (
                                    <tr key={proof.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{proof.user}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{proof.date}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                        <span
                            className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-amber-100 text-amber-800">
                          {proof.status}
                        </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 hover:underline">
                                            이미지 보기
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-green-600 hover:text-green-900 mr-3">승인</button>
                                            <button className="text-red-600 hover:text-red-900">반려</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                reviewProofs.map((proof) => (
                                    <tr key={proof.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{proof.user}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{proof.date}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                        <span
                            className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-amber-100 text-amber-800">
                          {proof.status}
                        </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{proof.platform}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-green-600 hover:text-green-900 mr-3">승인</button>
                                            <button className="text-red-600 hover:text-red-900">반려</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 예약자 리스트 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-indigo-600"/>
                            예약자 리스트
                        </h2>

                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="검색"
                                    className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                </div>
                            </div>

                            <button
                                className="text-sm text-gray-600 flex items-center bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-lg">
                                <Filter className="w-4 h-4 mr-1"/> 필터
                            </button>
                        </div>
                    </div>

                    {/* 예약자 테이블 */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연락처</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">옵션</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">예약일</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {reservations.map((reservation) => (
                                <tr key={reservation.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{reservation.name}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{reservation.email}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{reservation.phone}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{reservation.option}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{reservation.date}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900">상세보기</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이지네이션 */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
                            총 <span className="font-medium">{reservations.length}</span>명
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">이전
                            </button>
                            <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">1</button>
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">2
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">3
                            </button>
                            <button
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">다음
                            </button>
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