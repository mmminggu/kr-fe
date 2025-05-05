'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    Plus,
    ChevronDown,
    MoreHorizontal,
    Calendar,
    AlertCircle,
    Users,
    CheckCircle2,
    Clock,
    Star
} from 'lucide-react';
import CampaignStatusBadge from './CampaignStatusBadge';

// 캠페인 상태 타입
type CampaignStatus = 'draft' | 'pending' | 'active' | 'completed' | 'rejected' | 'all';

// 캠페인 목록 필터 타입
type FilterOption = {
    id: string;
    name: string;
};

// 캠페인 데이터 타입
interface Campaign {
    id: string;
    title: string;
    status: Exclude<CampaignStatus, 'all'>;
    category: string;
    deadline: string;
    applicants: number;
    selectedReviewers: number;
    completedReviews: number;
    createdAt: string;
    budget: number;
    featured: boolean;
}

// 모의 데이터
const mockCampaigns: Campaign[] = [
    {
        id: 'camp-001',
        title: '여름 신상품 체험단 모집',
        status: 'active',
        category: '패션',
        deadline: '2025-05-15',
        applicants: 32,
        selectedReviewers: 10,
        completedReviews: 3,
        createdAt: '2025-04-01',
        budget: 300000,
        featured: true,
    },
    {
        id: 'camp-002',
        title: '헤어 케어 제품 리뷰어 모집',
        status: 'active',
        category: '뷰티',
        deadline: '2025-05-20',
        applicants: 45,
        selectedReviewers: 15,
        completedReviews: 8,
        createdAt: '2025-04-05',
        budget: 450000,
        featured: false,
    },
    {
        id: 'camp-003',
        title: '주방용품 체험단',
        status: 'active',
        category: '가전/주방',
        deadline: '2025-05-25',
        applicants: 28,
        selectedReviewers: 8,
        completedReviews: 5,
        createdAt: '2025-04-08',
        budget: 240000,
        featured: false,
    },
    {
        id: 'camp-004',
        title: '뷰티 디바이스 리뷰어 모집',
        status: 'pending',
        category: '뷰티',
        deadline: '2025-06-01',
        applicants: 0,
        selectedReviewers: 12,
        completedReviews: 0,
        createdAt: '2025-04-15',
        budget: 500000,
        featured: true,
    },
    {
        id: 'camp-005',
        title: '건강식품 체험단',
        status: 'pending',
        category: '식품',
        deadline: '2025-06-10',
        applicants: 0,
        selectedReviewers: 6,
        completedReviews: 0,
        createdAt: '2025-04-18',
        budget: 180000,
        featured: false,
    },
    {
        id: 'camp-006',
        title: '가정용 운동기구 체험단',
        status: 'completed',
        category: '스포츠/레저',
        deadline: '2025-04-10',
        applicants: 65,
        selectedReviewers: 20,
        completedReviews: 20,
        createdAt: '2025-03-01',
        budget: 600000,
        featured: false,
    },
    {
        id: 'camp-007',
        title: '프리미엄 마스크팩 리뷰어 모집',
        status: 'completed',
        category: '뷰티',
        deadline: '2025-04-05',
        applicants: 78,
        selectedReviewers: 25,
        completedReviews: 22,
        createdAt: '2025-03-05',
        budget: 375000,
        featured: true,
    },
    {
        id: 'camp-008',
        title: '스마트 홈 가전 체험단',
        status: 'rejected',
        category: '가전/주방',
        deadline: '2025-05-01',
        applicants: 0,
        selectedReviewers: 0,
        completedReviews: 0,
        createdAt: '2025-04-10',
        budget: 450000,
        featured: false,
    },
    {
        id: 'camp-009',
        title: '신상 슈즈 체험단',
        status: 'draft',
        category: '패션',
        deadline: '2025-06-15',
        applicants: 0,
        selectedReviewers: 15,
        completedReviews: 0,
        createdAt: '2025-04-20',
        budget: 450000,
        featured: false,
    },
    {
        id: 'camp-010',
        title: '유기농 스킨케어 체험단',
        status: 'draft',
        category: '뷰티',
        deadline: '2025-06-20',
        applicants: 0,
        selectedReviewers: 10,
        completedReviews: 0,
        createdAt: '2025-04-25',
        budget: 300000,
        featured: true,
    },
];

// 카테고리 필터 옵션
const categoryOptions: FilterOption[] = [
    { id: 'all', name: '전체 카테고리' },
    { id: 'beauty', name: '뷰티' },
    { id: 'fashion', name: '패션' },
    { id: 'food', name: '식품' },
    { id: 'home', name: '가전/주방' },
    { id: 'sports', name: '스포츠/레저' },
];

// 정렬 옵션
const sortOptions: FilterOption[] = [
    { id: 'newest', name: '최신순' },
    { id: 'deadline', name: '마감임박순' },
    { id: 'applicants', name: '신청자 많은순' },
    { id: 'budget', name: '금액 높은순' },
];

export default function CampaignList() {
    const [loading, setLoading] = useState(true);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<CampaignStatus>('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);

    // 데이터 로딩
    useEffect(() => {
        // API 호출 시뮬레이션
        const timer = setTimeout(() => {
            setCampaigns(mockCampaigns);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // 필터링 및 정렬 적용
    useEffect(() => {
        let result = [...campaigns];

        // 상태 필터링
        if (statusFilter !== 'all') {
            result = result.filter(campaign => campaign.status === statusFilter);
        }

        // 카테고리 필터링
        if (categoryFilter !== 'all') {
            // 실제로는 카테고리 ID와 매칭해야 함
            result = result.filter(campaign => {
                const lowercaseCategory = campaign.category.toLowerCase();
                // 카테고리 ID와 실제 카테고리명이 일치하지 않을 수 있으므로 부분 일치로 처리
                if (categoryFilter === 'beauty') return lowercaseCategory.includes('뷰티');
                if (categoryFilter === 'fashion') return lowercaseCategory.includes('패션');
                if (categoryFilter === 'food') return lowercaseCategory.includes('식품');
                if (categoryFilter === 'home') return lowercaseCategory.includes('가전');
                if (categoryFilter === 'sports') return lowercaseCategory.includes('스포츠');
                return true;
            });
        }

        // 검색어 필터링
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(campaign =>
                campaign.title.toLowerCase().includes(query) ||
                campaign.category.toLowerCase().includes(query)
            );
        }

        // 정렬
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'deadline':
                    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                case 'applicants':
                    return b.applicants - a.applicants;
                case 'budget':
                    return b.budget - a.budget;
                default:
                    return 0;
            }
        });

        setFilteredCampaigns(result);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋
    }, [campaigns, statusFilter, categoryFilter, searchQuery, sortBy]);

    // 드롭다운 토글 함수
    const toggleDropdown = (id: string) => {
        setDropdownOpen(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // 현재 페이지 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCampaigns.slice(indexOfFirstItem, indexOfLastItem);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

    // 페이지 변경 함수
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

    // 금액 포맷팅 함수
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // 상태별 카운트
    const getStatusCounts = () => {
        const counts = {
            all: campaigns.length,
            draft: 0,
            pending: 0,
            active: 0,
            completed: 0,
            rejected: 0,
        };

        campaigns.forEach(campaign => {
            counts[campaign.status]++;
        });

        return counts;
    };

    const statusCounts = getStatusCounts();

    // 로딩 중 UI
    if (loading) {
        return (
            <div className="w-full py-12 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">캠페인 목록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    캠페인 관리
                </h1>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href="/client/campaigns/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus size={16} className="mr-2" />
                        새 캠페인 등록
                    </Link>
                </div>
            </div>

            {/* 상태 필터 탭 */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'all'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setStatusFilter('all')}
                >
                    전체 ({statusCounts.all})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'draft'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setStatusFilter('draft')}
                >
                    임시저장 ({statusCounts.draft})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'pending'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setStatusFilter('pending')}
                >
                    검토중 ({statusCounts.pending})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'active'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setStatusFilter('active')}
                >
                    진행중 ({statusCounts.active})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'completed'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setStatusFilter('completed')}
                >
                    완료 ({statusCounts.completed})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'rejected'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setStatusFilter('rejected')}
                >
                    반려 ({statusCounts.rejected})
                </button>
            </div>

            {/* 필터 및 검색 영역 */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-64 relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                        placeholder="캠페인 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 md:ml-auto">
                    {/* 카테고리 필터 */}
                    <div className="relative w-full sm:w-40 md:w-48">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Filter size={18} className="text-gray-400" />
                        </div>
                        <select
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 appearance-none"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            {categoryOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown size={18} className="text-gray-400" />
                        </div>
                    </div>

                    {/* 정렬 필터 */}
                    <div className="relative w-full sm:w-40 md:w-48">
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
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 appearance-none"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            {sortOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown size={18} className="text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 캠페인 목록 테이블 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* 테이블 헤더 */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-100 dark:bg-gray-750 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <th className="px-6 py-3">캠페인</th>
                            <th className="px-6 py-3">상태</th>
                            <th className="px-6 py-3">카테고리</th>
                            <th className="px-6 py-3">리뷰어</th>
                            <th className="px-6 py-3">마감일</th>
                            <th className="px-6 py-3">예산</th>
                            <th className="px-6 py-3">작업</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentItems.length > 0 ? (
                            currentItems.map((campaign) => (
                                <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="flex items-center">
                                                    <Link
                                                        href={`/client/campaigns/${campaign.id}`}
                                                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                                    >
                                                        {campaign.title}
                                                    </Link>
                                                    {campaign.featured && (
                                                        <span className="ml-2">
                                <Star size={16} className="text-amber-500 fill-amber-500" />
                              </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    ID: {campaign.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <CampaignStatusBadge status={campaign.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {campaign.category}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                                                <Users size={14} className="mr-1 text-gray-500 dark:text-gray-400" />
                                                <span className="font-medium">{campaign.applicants}</span>
                                                <span className="text-gray-500 dark:text-gray-400 mx-1">명 신청</span>
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                    <div
                                                        className="bg-blue-600 h-1.5 rounded-full"
                                                        style={{
                                                            width: `${
                                                                campaign.selectedReviewers
                                                                    ? (campaign.completedReviews / campaign.selectedReviewers) * 100
                                                                    : 0
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {campaign.completedReviews}/{campaign.selectedReviewers}
                          </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                                                <Calendar size={14} className="mr-1 text-gray-500 dark:text-gray-400" />
                                                <span>{formatDate(campaign.deadline)}</span>
                                            </div>
                                            <div className="mt-1">
                                                {campaign.status !== 'completed' && campaign.status !== 'rejected' && (
                                                    <span
                                                        className={`text-xs ${
                                                            getDaysRemaining(campaign.deadline) < 3
                                                                ? 'text-red-500 dark:text-red-400'
                                                                : getDaysRemaining(campaign.deadline) < 7
                                                                    ? 'text-amber-500 dark:text-amber-400'
                                                                    : 'text-gray-500 dark:text-gray-400'
                                                        }`}
                                                    >
                              <Clock size={12} className="inline mr-1" />
                                                        {getDaysRemaining(campaign.deadline) > 0
                                                            ? `${getDaysRemaining(campaign.deadline)}일 남음`
                                                            : '마감됨'}
                            </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {formatCurrency(campaign.budget)}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="relative">
                                            <button
                                                onClick={() => toggleDropdown(campaign.id)}
                                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                            >
                                                <MoreHorizontal size={20} />
                                            </button>
                                            {dropdownOpen[campaign.id] && (
                                                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700">
                                                    <div className="py-1">
                                                        <Link
                                                            href={`/client/campaigns/${campaign.id}`}
                                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                                        >
                                                            상세 보기
                                                        </Link>
                                                        {(campaign.status === 'draft' || campaign.status === 'rejected') && (
                                                            <Link
                                                                href={`/client/campaigns/${campaign.id}/edit`}
                                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                                            >
                                                                수정하기
                                                            </Link>
                                                        )}
                                                        {campaign.status === 'active' && (
                                                            <Link
                                                                href={`/client/campaigns/${campaign.id}/reviewers`}
                                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                                            >
                                                                리뷰어 관리
                                                            </Link>
                                                        )}
                                                    </div>
                                                    <div className="py-1">
                                                        {campaign.status === 'draft' && (
                                                            <>
                                                                <button
                                                                    className="block w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-750"
                                                                >
                                                                    제출하기
                                                                </button>
                                                                <button
                                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-750"
                                                                >
                                                                    삭제하기
                                                                </button>
                                                            </>
                                                        )}
                                                        {campaign.status === 'pending' && (
                                                            <button
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                                            >
                                                                검토 요청
                                                            </button>
                                                        )}
                                                        {campaign.status === 'active' && (
                                                            <button
                                                                className="block w-full text-left px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-750"
                                                            >
                                                                마감하기
                                                            </button>
                                                        )}
                                                        {campaign.status === 'completed' && (
                                                            <button
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                                            >
                                                                보고서 다운로드
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <AlertCircle size={32} className="text-gray-400 mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                                            캠페인이 없습니다
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                                            {searchQuery
                                                ? '검색 조건에 맞는 캠페인이 없습니다. 다른 검색어를 입력해보세요.'
                                                : statusFilter !== 'all'
                                                    ? '해당 상태의 캠페인이 없습니다. 다른 상태를 선택해보세요.'
                                                    : '새 캠페인을 등록해보세요.'}
                                        </p>
                                        {(!searchQuery && statusFilter === 'all') && (
                                            <Link
                                                href="/client/campaigns/create"
                                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <Plus size={16} className="mr-2" />
                                                새 캠페인 등록
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                {filteredCampaigns.length > itemsPerPage && (
                    <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">{indexOfFirstItem + 1}</span>
                                    -
                                    <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredCampaigns.length)}
                  </span>
                                    {' / '}
                                    <span className="font-medium">{filteredCampaigns.length}</span> 개 캠페인
                                </p>
                            </div>
                            <nav className="flex items-center space-x-2">
                                <button
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-2 py-1 text-sm rounded-md ${
                                        currentPage === 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750'
                                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;

                                    // 현재 페이지 주변의 페이지만 표시
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => paginate(pageNumber)}
                                                className={`px-3 py-1 text-sm rounded-md ${
                                                    currentPage === pageNumber
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    }

                                    // 중간 생략 부분 표시
                                    if (
                                        (pageNumber === currentPage - 2 && currentPage > 3) ||
                                        (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                                    ) {
                                        return (
                                            <span
                                                key={index}
                                                className="px-2 py-1 text-sm text-gray-500 dark:text-gray-400"
                                            >
                        ...
                      </span>
                                        );
                                    }

                                    return null;
                                })}
                                <button
                                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`px-2 py-1 text-sm rounded-md ${
                                        currentPage === totalPages
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750'
                                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}