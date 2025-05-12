'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
    Search,
    Filter,
    ChevronDown,
    Calendar,
    AlertCircle,
    FileDown,
    Eye,
    Clock,
    MessageSquare,
    CheckCircle,
    XCircle,
    Loader2,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/src/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';

// 견적 상태별 배지 스타일
const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
};

// 정렬 옵션
const sortOptions = [
    { id: 'newest', name: '최신순' },
    { id: 'oldest', name: '오래된순' },
    { id: 'companyAsc', name: '업체명 오름차순' },
    { id: 'companyDesc', name: '업체명 내림차순' },
    { id: 'priceAsc', name: '견적금액 오름차순' },
    { id: 'priceDesc', name: '견적금액 내림차순' },
];

// 임시 데이터
const mockQuotations = Array.from({ length: 5 }).map((_, i) => ({
    id: `QT-${(1000 + i).toString()}`,
    companyId: i + 1,
    companyName: `업체 ${i + 1}`,
    adType: i % 3 === 0 ? 'banner' : i % 3 === 1 ? 'video' : 'popup',
    adPeriod: `${Math.floor(i / 2) + 1}개월`,
    estimatedBudget: (Math.floor(Math.random() * 10) + 1) * 1000000,
    requestDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    status: i % 5 === 0 ? 'pending' : 'approved',
    description: `${i + 1}번 업체의 광고 견적 요청입니다. 특별한 요구사항: ${i % 3 === 0 ? '프리미엄 위치 배너 원함' : i % 3 === 1 ? '모바일 최적화 중요' : '높은 클릭률 기대'}`,
    responseDate: i % 5 === 2 || i % 5 === 3 ? new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString().split('T')[0] : null,
    responsePrice: i % 5 === 2 ? (Math.floor(Math.random() * 10) + 1) * 1000000 : null,
    responseMessage: i % 5 === 2 ? `견적 승인 메시지입니다. ${i + 1}번 업체에 맞춘 제안.` : i % 5 === 3 ? '요청하신 견적은 현재 저희 정책과 맞지 않아 승인이 어렵습니다.' : null,
}));

export default function AdQuotationManagement() {
    const [loading, setLoading] = useState(false);
    const [quotations, setQuotations] = useState([]);
    const [filteredQuotations, setFilteredQuotations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // 상세 견적 및 응답 상태
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [responseData, setResponseData] = useState({
        status: '',
        price: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 필터 및 검색 상태
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [adTypeFilter, setAdTypeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // 데이터 로딩
    useEffect(() => {
        setLoading(true);
        // API 호출 시뮬레이션
        const timer = setTimeout(() => {
            setQuotations(mockQuotations);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // 필터링 및 정렬 적용
    useEffect(() => {
        let result = [...quotations];

        // 상태 필터링
        if (statusFilter !== 'all') {
            result = result.filter(quotation => quotation.status === statusFilter);
        }

        // 광고 타입 필터링
        if (adTypeFilter !== 'all') {
            result = result.filter(quotation => quotation.adType === adTypeFilter);
        }

        // 검색어 필터링
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(quotation =>
                quotation.companyName.toLowerCase().includes(query) ||
                quotation.id.toLowerCase().includes(query)
            );
        }

        // 정렬
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
                case 'oldest':
                    return new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime();
                case 'companyAsc':
                    return a.companyName.localeCompare(b.companyName);
                case 'companyDesc':
                    return b.companyName.localeCompare(a.companyName);
                case 'priceAsc':
                    return a.estimatedBudget - b.estimatedBudget;
                case 'priceDesc':
                    return b.estimatedBudget - a.estimatedBudget;
                default:
                    return 0;
            }
        });

        setFilteredQuotations(result);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋
    }, [quotations, statusFilter, adTypeFilter, searchQuery, sortBy]);

    // 현재 페이지 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentQuotations = filteredQuotations.slice(indexOfFirstItem, indexOfLastItem);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);

    // 견적 상세 보기
    const openDetailModal = (quotation) => {
        setSelectedQuotation(quotation);
        setResponseData({
            status: quotation.status,
            price: quotation.responsePrice || quotation.estimatedBudget,
            message: quotation.responseMessage || ''
        });
        setIsDetailModalOpen(true);
    };

    // 견적 응답 제출
    const handleSubmitResponse = () => {
        if (!responseData.message) {
            alert('응답 메시지를 입력해주세요.');
            return;
        }

        setIsSubmitting(true);

        // API 호출 시뮬레이션
        setTimeout(() => {
            // 견적 데이터 업데이트
            const updatedQuotations = quotations.map(q =>
                q.id === selectedQuotation.id
                    ? {
                        ...q,
                        status: responseData.status,
                        responseDate: new Date().toISOString().split('T')[0],
                        responsePrice: responseData.status === 'approved' ? parseFloat(responseData.price) : null,
                        responseMessage: responseData.message
                    }
                    : q
            );

            setQuotations(updatedQuotations);
            setIsSubmitting(false);
            setIsDetailModalOpen(false);

            // 성공 메시지
            alert('견적 응답이 성공적으로 등록되었습니다.');
        }, 1000);
    };

    // 견적 상태 한글 변환
    const getStatusName = (status) => {
        switch(status) {
            case 'pending': return '접수됨';
            case 'approved': return '답변완료';
            default: return status;
        }
    };

    // 광고 유형 한글 변환
    const getAdTypeName = (type) => {
        switch(type) {
            case 'banner': return '포토리뷰';
            case 'video': return '별점리뷰';
            case 'popup': return '동영상광고';
            default: return type;
        }
    };

    // 가격 포맷 함수
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
    };

    // 날짜 포맷 함수
    const formatDate = (dateString) => {
        if (!dateString) return '-';

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    // 상태별 카운트
    const getStatusCounts = () => {
        const counts = {
            all: quotations.length,
            pending: 0,
            approved: 0,
        };

        quotations.forEach(quotation => {
            counts[quotation.status]++;
        });

        return counts;
    };

    const statusCounts = getStatusCounts();

    // 엑셀 다운로드 함수
    const handleExcelDownload = () => {
        alert('견적 목록 엑셀 다운로드');
        // 실제 구현 시 API 호출 필요
    };

    // 로딩 중 UI
    if (loading) {
        return (
            <div className="w-full py-12 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <p className="mt-4 text-gray-600">견적 목록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    광고 견적 관리
                </h1>
            </div>

            {/* 상태 필터 탭 */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200">
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'all'
                            ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-indigo-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setStatusFilter('all')}
                >
                    전체 ({statusCounts.all})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'pending'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setStatusFilter('pending')}
                >
                    접수됨 ({statusCounts.pending})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'approved'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setStatusFilter('approved')}
                >
                    답변완료 ({statusCounts.approved})
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
                            placeholder="업체명 또는 견적번호 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* 광고 타입 필터 */}
                <div className="relative w-full md:w-48">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Filter size={18} className="text-gray-400" />
                    </div>
                    <select
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 appearance-none"
                        value={adTypeFilter}
                        onChange={(e) => setAdTypeFilter(e.target.value)}
                    >
                        <option value="all">모든 광고 유형</option>
                        <option value="banner">배너광고</option>
                        <option value="video">동영상광고</option>
                        <option value="popup">팝업광고</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown size={18} className="text-gray-400" />
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

            {/* 견적 목록 테이블 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* 테이블 헤더 */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-3">견적번호</th>
                            <th className="px-6 py-3">업체</th>
                            <th className="px-6 py-3">광고유형</th>
                            <th className="px-6 py-3">광고기간</th>
                            <th className="px-6 py-3">견적금액</th>
                            <th className="px-6 py-3">요청일</th>
                            <th className="px-6 py-3">상태</th>
                            <th className="px-6 py-3">상세</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {currentQuotations.length > 0 ? (
                            currentQuotations.map((quotation) => (
                                <tr key={quotation.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {quotation.id}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-indigo-600">
                                            {quotation.companyName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">
                                            {getAdTypeName(quotation.adType)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">
                                            {quotation.adPeriod}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatPrice(quotation.estimatedBudget)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-700">
                                            <Calendar size={14} className="mr-1 text-gray-500" />
                                            <span>{formatDate(quotation.requestDate)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className={statusStyles[quotation.status]}>
                                            {getStatusName(quotation.status)}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => openDetailModal(quotation)}
                                            className="inline-flex items-center px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                                        >
                                            <Eye size={14} className="mr-1" />
                                            상세보기
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <AlertCircle size={32} className="text-gray-400 mb-4" />
                                        <p className="text-gray-500 text-lg font-medium">
                                            견적 요청이 없습니다
                                        </p>
                                        <p className="text-gray-500 mt-1">
                                            {searchQuery
                                                ? '검색 조건에 맞는 견적이 없습니다. 다른 검색어를 입력해보세요.'
                                                : statusFilter !== 'all' || adTypeFilter !== 'all'
                                                    ? '해당 조건의 견적이 없습니다. 다른 필터를 선택해보세요.'
                                                    : '아직 견적 요청이 없습니다.'}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                {filteredQuotations.length > itemsPerPage && (
                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">{indexOfFirstItem + 1}</span>
                                    -
                                    <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredQuotations.length)}
                  </span>
                                    {' / '}
                                    <span className="font-medium">{filteredQuotations.length}</span> 개
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

                                    // 중간 생략 부분 표시
                                    if (
                                        (pageNumber === currentPage - 2 && currentPage > 3) ||
                                        (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                                    ) {
                                        return (
                                            <span
                                                key={index}
                                                className="px-2 py-1 text-sm text-gray-500"
                                            >
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

            {/* 견적 상세 모달 */}
            {selectedQuotation && (
                <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl flex items-center">
                                <span>견적 상세 정보</span>
                                <Badge className={`ml-3 ${statusStyles[selectedQuotation.status]}`}>
                                    {getStatusName(selectedQuotation.status)}
                                </Badge>
                            </DialogTitle>
                            <DialogDescription>
                                견적번호: {selectedQuotation.id}
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="details">견적 정보</TabsTrigger>
                                <TabsTrigger value="response">견적 응답</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="mt-4">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-gray-500 text-xs">업체명</Label>
                                            <p className="text-base font-medium mt-1">{selectedQuotation.companyName}</p>
                                        </div>
                                        <div>
                                            <Label className="text-gray-500 text-xs">견적 요청일</Label>
                                            <p className="text-base mt-1">{formatDate(selectedQuotation.requestDate)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-gray-500 text-xs">광고 유형</Label>
                                            <p className="text-base mt-1">{getAdTypeName(selectedQuotation.adType)}</p>
                                        </div>
                                        <div>
                                            <Label className="text-gray-500 text-xs">광고 기간</Label>
                                            <p className="text-base mt-1">{selectedQuotation.adPeriod}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-gray-500 text-xs">견적 요청 금액</Label>
                                        <p className="text-lg font-bold text-indigo-600 mt-1">
                                            {formatPrice(selectedQuotation.estimatedBudget)}
                                        </p>
                                    </div>

                                    <div>
                                        <Label className="text-gray-500 text-xs">견적 요청 상세 내용</Label>
                                        <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-700 min-h-[120px]">
                                            {selectedQuotation.description || '상세 내용이 없습니다.'}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="response" className="mt-4">
                                <div className="space-y-6">
                                    {selectedQuotation.status === 'approved' || selectedQuotation.status === 'rejected' ? (
                                        <div className="mb-6">
                                            <div className="bg-blue-50 p-4 rounded-md mb-4">
                                                <h3 className="font-medium text-blue-800">견적 응답 정보</h3>
                                                <div className="mt-3 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-gray-500 text-xs">응답일</Label>
                                                        <p className="text-sm mt-1">{formatDate(selectedQuotation.responseDate)}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-gray-500 text-xs">응답 상태</Label>
                                                        <Badge className={`mt-1 ${statusStyles[selectedQuotation.status]}`}>
                                                            {getStatusName(selectedQuotation.status)}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {selectedQuotation.status === 'approved' && (
                                                    <div className="mt-3">
                                                        <Label className="text-gray-500 text-xs">승인된 견적 금액</Label>
                                                        <p className="text-lg font-bold text-green-600 mt-1">
                                                            {formatPrice(selectedQuotation.responsePrice)}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="mt-3">
                                                    <Label className="text-gray-500 text-xs">응답 메시지</Label>
                                                    <p className="text-sm mt-1 p-2 bg-white rounded border border-gray-200">
                                                        {selectedQuotation.responseMessage}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    variant="outline"
                                                    className="mr-2"
                                                    onClick={() => setIsDetailModalOpen(false)}
                                                >
                                                    닫기
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <Label htmlFor="response-status">견적 상태 변경</Label>
                                                    <Select
                                                        value={responseData.status}
                                                        onValueChange={(value) => setResponseData({...responseData, status: value})}
                                                    >
                                                        <SelectTrigger className="mt-1">
                                                            <SelectValue placeholder="상태 선택" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="approved">답변완료</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {responseData.status === 'approved' && (
                                                <div>
                                                    <Label htmlFor="response-price">승인 가격</Label>
                                                    <Input
                                                        id="response-price"
                                                        type="number"
                                                        value={responseData.price}
                                                        onChange={(e) => setResponseData({...responseData, price: e.target.value})}
                                                        className="mt-1"
                                                        placeholder="견적 가격을 입력하세요"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        *요청 금액: {formatPrice(selectedQuotation.estimatedBudget)}
                                                    </p>
                                                </div>
                                            )}

                                            <div>
                                                <Label htmlFor="response-message">응답 메시지</Label>
                                                <Textarea
                                                    id="response-message"
                                                    value={responseData.message}
                                                    onChange={(e) => setResponseData({...responseData, message: e.target.value})}
                                                    className="mt-1 min-h-[150px]"
                                                    placeholder={
                                                        responseData.status === 'approved'
                                                            ? "승인 메시지를 입력하세요. 가격, 계약 조건 등의 상세 내용을 포함할 수 있습니다."
                                                            : responseData.status === 'rejected'
                                                                ? "거절 사유를 상세히 입력해주세요."
                                                                : "검토중인 상태에 대한 안내 메시지를 입력하세요."
                                                    }
                                                />
                                            </div>

                                            <div className="flex justify-end mt-6">
                                                <Button
                                                    variant="outline"
                                                    className="mr-2"
                                                    onClick={() => setIsDetailModalOpen(false)}
                                                >
                                                    취소
                                                </Button>
                                                <Button
                                                    onClick={handleSubmitResponse}
                                                    disabled={isSubmitting || !responseData.message}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 size={16} className="mr-2 animate-spin" />
                                                            처리중...
                                                        </>
                                                    ) : (
                                                        '응답 제출'
                                                    )}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}