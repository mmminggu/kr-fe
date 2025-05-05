'use client';

import { useState } from 'react';
import { Progress } from '@/src/components/ui/progress';
import {
    BadgeCheck, AlertCircle, Users, Gift,
    Clock, Star, Sparkles, PieChart, MessageCircle,
    CalendarDays, Bell, FileCheck, Briefcase, ChevronRight,
    Check, X, Pause, Play, Download, Filter
} from 'lucide-react';

export default function CampaignDashboard() {
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
        options: ['블랙', '화이트', '블루'],
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

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 상단 헤더 */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
                        <div className="flex items-center mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${campaign.status === '진행 중' ? 'bg-green-100 text-green-800' :
                  campaign.status === '예정' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                {campaign.status === '진행 중' && <Clock className="w-4 h-4 mr-1"/>}
                  {campaign.status === '예정' && <CalendarDays className="w-4 h-4 mr-1"/>}
                  {campaign.status === '종료' && <BadgeCheck className="w-4 h-4 mr-1"/>}
                  {campaign.status}
              </span>
                            <span className="ml-4 text-sm text-gray-500">
                {formatDate(campaign.startDate)} ~ {formatDate(campaign.endDate)}
              </span>
                        </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex space-x-2">
                        {campaign.status === '예정' && (
                            <>
                                <button
                                    onClick={() => handleCampaignAction('approve')}
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-colors">
                                    <Check className="w-4 h-4 inline mr-1"/>
                                    승인
                                </button>
                                <button
                                    onClick={() => handleCampaignAction('reject')}
                                    className="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors">
                                    <X className="w-4 h-4 inline mr-1"/>
                                    반려
                                </button>
                            </>
                        )}

                        {campaign.status === '진행 중' && (
                            <button
                                onClick={() => handleCampaignAction('pause')}
                                className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors">
                                <Pause className="w-4 h-4 inline mr-1"/>
                                중단
                            </button>
                        )}

                        {campaign.status === '종료' && (
                            <button
                                onClick={() => handleCampaignAction('restart')}
                                className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
                                <Play className="w-4 h-4 inline mr-1"/>
                                재개
                            </button>
                        )}

                        <button
                            onClick={() => handleCampaignAction('export')}
                            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors">
                            <Download className="w-4 h-4 inline mr-1"/>
                            내보내기
                        </button>
                    </div>
                </div>
            </div>

            {/* 캠페인 기본 정보 카드 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-indigo-600"/>
                    캠페인 기본 정보
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* 진행률 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-500">진행률</span>
                            <span className="text-sm font-semibold text-gray-900">{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2 bg-gray-200"
                                  indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-600"/>
                    </div>

                    {/* 제품 정보 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">제품 금액</h3>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-700">제품가격</span>
                            <span className="text-sm font-medium">{campaign.productPrice.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-sm text-gray-700">배송비</span>
                            <span className="text-sm font-medium">{campaign.shippingFee.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between mt-1 pt-1 border-t border-gray-200">
                            <span className="text-sm font-medium text-gray-900">총 금액</span>
                            <span
                                className="text-sm font-medium text-gray-900">{(campaign.productPrice + campaign.shippingFee).toLocaleString()}원</span>
                        </div>
                    </div>

                    {/* 지급 포인트 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                            <Gift className="w-4 h-4 text-purple-500 mr-1"/>
                            <h3 className="text-sm font-medium text-gray-500">지급 포인트</h3>
                        </div>
                        <p className="text-xl font-semibold text-indigo-600">{campaign.rewardPoints.toLocaleString()} P</p>
                    </div>

                    {/* 옵션 정보 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">옵션</h3>
                        <div className="flex flex-wrap gap-1">
                            {campaign.options.map((option, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                  {option}
                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 대시보드 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* 모집 현황 카드 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-indigo-600"/>
                        모집 현황
                    </h2>

                    <div className="relative">
                        {/* 모집 현황 도넛 차트 (시각적으로만 표현) */}
                        <div
                            className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                                <div>
                                    <p className="text-xs text-gray-500 text-center">모집률</p>
                                    <p className="text-xl font-bold text-gray-900 text-center">{campaign.progress}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">총 모집 인원</p>
                                <p className="text-xl font-semibold text-gray-900">{campaign.currentRecruits}/{campaign.totalRecruits}명</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">오늘 모집</p>
                                <p className="text-xl font-semibold text-gray-900">{campaign.todayRecruits}명</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CS 현황 카드 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <MessageCircle className="w-5 h-5 mr-2 text-indigo-600"/>
                            CS 현황
                        </h2>
                        <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                            모두보기 <ChevronRight className="w-4 h-4 ml-1"/>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-sm text-gray-500">답변 대기</p>
                            <p className="text-xl font-semibold text-amber-600">{campaign.csWaiting}건</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-sm text-gray-500">답변 완료</p>
                            <p className="text-xl font-semibold text-green-600">{campaign.csCompleted}건</p>
                        </div>
                    </div>

                    {/* CS 목록 */}
                    <div className="space-y-3">
                        {csItems.map((item) => (
                            <div key={item.id} className="border-b border-gray-100 pb-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">{item.user}</span>
                                    <span className="text-xs text-gray-500">{item.date}</span>
                                </div>
                                <p className="text-sm text-gray-700 truncate">{item.question}</p>
                                <span
                                    className="text-xs inline-block px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full mt-1">
                  {item.status}
                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 증빙 현황 통계 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileCheck className="w-5 h-5 mr-2 text-indigo-600"/>
                        증빙 현황
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <h3 className="text-sm font-medium text-gray-700">구매 영수증</h3>
                        <h3 className="text-sm font-medium text-gray-700">리뷰 증빙</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center">
                                <span className="text-xs text-gray-500">대기</span>
                                <span
                                    className="text-sm font-medium text-amber-600">{campaign.receiptProofs.waiting}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center">
                                <span className="text-xs text-gray-500">승인</span>
                                <span
                                    className="text-sm font-medium text-green-600">{campaign.receiptProofs.approved}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center">
                                <span className="text-xs text-gray-500">반려</span>
                                <span
                                    className="text-sm font-medium text-red-600">{campaign.receiptProofs.rejected}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center">
                                <span className="text-xs text-gray-500">대기</span>
                                <span
                                    className="text-sm font-medium text-amber-600">{campaign.reviewProofs.waiting}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center">
                                <span className="text-xs text-gray-500">승인</span>
                                <span
                                    className="text-sm font-medium text-green-600">{campaign.reviewProofs.approved}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center">
                                <span className="text-xs text-gray-500">반려</span>
                                <span
                                    className="text-sm font-medium text-red-600">{campaign.reviewProofs.rejected}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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