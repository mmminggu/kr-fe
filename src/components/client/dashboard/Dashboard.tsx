'use client';

import { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import ActivityChart from './ActivityChart';
import { Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// 대시보드에서 사용할 모의 데이터
const mockData = {
    stats: {
        activeCampaigns: 5,
        pendingReviews: 12,
        completedReviews: 45,
        approvalRate: 92.5,
        totalRevenue: 1250000,
    },
    recentCampaigns: [
        {
            id: 'c1',
            title: '여름 신상품 체험단 모집',
            status: 'active',
            applicants: 32,
            selectedReviewers: 10,
            completedReviews: 3,
            deadline: '2025-05-15',
        },
        {
            id: 'c2',
            title: '헤어 케어 제품 리뷰어 모집',
            status: 'active',
            applicants: 45,
            selectedReviewers: 15,
            completedReviews: 8,
            deadline: '2025-05-20',
        },
        {
            id: 'c3',
            title: '주방용품 체험단',
            status: 'active',
            applicants: 28,
            selectedReviewers: 8,
            completedReviews: 5,
            deadline: '2025-05-25',
        },
        {
            id: 'c4',
            title: '뷰티 디바이스 리뷰어 모집',
            status: 'active',
            applicants: 64,
            selectedReviewers: 12,
            completedReviews: 0,
            deadline: '2025-06-01',
        },
        {
            id: 'c5',
            title: '건강식품 체험단',
            status: 'active',
            applicants: 18,
            selectedReviewers: 6,
            completedReviews: 2,
            deadline: '2025-06-10',
        },
    ],
    recentReviews: [
        {
            id: 'r1',
            campaign: '여름 신상품 체험단 모집',
            reviewer: '김리뷰',
            rating: 4.5,
            platform: '네이버 블로그',
            date: '2025-05-01',
            status: 'approved',
        },
        {
            id: 'r2',
            campaign: '헤어 케어 제품 리뷰어 모집',
            reviewer: '박블로그',
            rating: 5.0,
            platform: '인스타그램',
            date: '2025-04-30',
            status: 'approved',
        },
        {
            id: 'r3',
            campaign: '주방용품 체험단',
            reviewer: '최리뷰어',
            rating: 4.0,
            platform: '유튜브',
            date: '2025-04-29',
            status: 'pending',
        },
        {
            id: 'r4',
            campaign: '헤어 케어 제품 리뷰어 모집',
            reviewer: '이블로거',
            rating: 4.8,
            platform: '네이버 블로그',
            date: '2025-04-28',
            status: 'approved',
        },
        {
            id: 'r5',
            campaign: '여름 신상품 체험단 모집',
            reviewer: '장체험',
            rating: 3.5,
            platform: '인스타그램',
            date: '2025-04-27',
            status: 'rejected',
        },
    ],
    notices: [
        {
            id: 'n1',
            title: '[공지] 2025년 상반기 정산 일정 안내',
            date: '2025-04-25',
        },
        {
            id: 'n2',
            title: '[안내] 리뷰어 체험단 서비스 이용 가이드 업데이트',
            date: '2025-04-20',
        },
        {
            id: 'n3',
            title: '[이벤트] 봄맞이 업체 프로모션 진행 안내',
            date: '2025-04-15',
        },
    ],
};

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(mockData);

    // 데이터 로딩 시뮬레이션
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // 캠페인 상태 표시 색상 함수
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'completed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    // 리뷰 상태 표시 색상 함수
    const getReviewStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    // 날짜 포맷 함수
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    // 남은 일수 계산 함수
    const getDaysRemaining = (deadline: string) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const timeDiff = deadlineDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysRemaining;
    };

    if (loading) {
        return (
            <div className="w-full h-96 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 페이지 제목 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    클라이언트 대시보드
                </h1>
                <div className="mt-2 md:mt-0 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={16} />
                    <span>
            {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            })}
          </span>
                </div>
            </div>

            {/* 주요 지표 카드 */}
            <StatsCards stats={data.stats} />

            {/* 활동 차트 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    캠페인 활동 추이
                </h2>
                <div className="h-80">
                    <ActivityChart />
                </div>
            </div>

            {/* 그리드 레이아웃 - 캠페인, 리뷰, 공지사항 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 진행 중인 캠페인 */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                            진행 중인 캠페인
                        </h2>
                        <Link
                            href="/client/campaigns"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            모두 보기
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="bg-gray-50 dark:bg-gray-750">
                                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    캠페인명
                                </th>
                                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    신청자 수
                                </th>
                                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    진행 상황
                                </th>
                                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    마감일
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {data.recentCampaigns.map((campaign) => (
                                <tr
                                    key={campaign.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-750"
                                >
                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                        <Link
                                            href={`/client/campaigns/${campaign.id}`}
                                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                        >
                                            {campaign.title}
                                        </Link>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="font-medium">{campaign.applicants}</span>
                                        <span className="text-gray-500 dark:text-gray-400">명</span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center">
                                            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                                <div
                                                    className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full"
                                                    style={{
                                                        width: `${(campaign.completedReviews / campaign.selectedReviewers) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="ml-2 text-xs">
                          {campaign.completedReviews}/{campaign.selectedReviewers}
                        </span>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex flex-col">
                                            <span>{formatDate(campaign.deadline)}</span>
                                            <span className={`text-xs ${
                                                getDaysRemaining(campaign.deadline) < 3
                                                    ? 'text-red-500 dark:text-red-400'
                                                    : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                          {getDaysRemaining(campaign.deadline)}일 남음
                        </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 공지사항 및 최신 리뷰 (모바일에서는 순서 변경) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* 공지사항 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                <span className="flex items-center">
                  <AlertCircle size={18} className="mr-2 text-amber-500" />
                  공지사항
                </span>
                            </h2>
                            <Link
                                href="/client/notices"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                모두 보기
                            </Link>
                        </div>
                        <div className="p-4 md:p-6">
                            <ul className="space-y-3">
                                {data.notices.map((notice) => (
                                    <li key={notice.id}>
                                        <Link
                                            href={`/client/notices/${notice.id}`}
                                            className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg transition-colors"
                                        >
                                            <p className="font-medium text-gray-900 dark:text-white mb-1">
                                                {notice.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(notice.date)}
                                            </p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* 최근 리뷰 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                최근 리뷰
                            </h2>
                            <Link
                                href="/client/reviews"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                모두 보기
                            </Link>
                        </div>
                        <div className="overflow-hidden">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {data.recentReviews.slice(0, 3).map((review) => (
                                    <li key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                        <Link
                                            href={`/client/reviews/${review.id}`}
                                            className="block p-4 md:p-6"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {review.reviewer}
                                                </p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getReviewStatusColor(review.status)}`}>
                          {review.status === 'approved' && '승인됨'}
                                                    {review.status === 'pending' && '검토중'}
                                                    {review.status === 'rejected' && '반려됨'}
                        </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                                {review.campaign}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center">
                                                    <div className="flex">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <svg
                                                                key={i}
                                                                className={`w-4 h-4 ${
                                                                    i < Math.floor(review.rating)
                                                                        ? 'text-yellow-400'
                                                                        : i < review.rating
                                                                            ? 'text-yellow-400'
                                                                            : 'text-gray-300 dark:text-gray-600'
                                                                }`}
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="currentColor"
                                                                viewBox="0 0 22 20"
                                                            >
                                                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                            {review.rating.toFixed(1)}
                          </span>
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(review.date)}
                        </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {review.platform}
                                            </p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}