"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    AlertCircle,
    Search,
    Filter,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    Clock,
    Calendar,
    FileDown,
    ChevronDown,
    X
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export default function InquiryList() {
    // 상태 관리
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterCampaign, setFilterCampaign] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    // 캠페인 목록 (예시)
    const campaigns = [
        { id: "all", name: "모든 캠페인" },
        { id: "organic_skincare", name: "유기농 스킨케어 체험단" },
        { id: "summer_collection", name: "여름 신상품 체험단 모집" },
        { id: "smart_home", name: "스마트 홈 가전 체험단" },
        { id: "eco_friendly", name: "친환경 생활용품 체험단" },
        { id: "food_review", name: "건강식품 리뷰 체험단" }
    ];

    // 카테고리 목록
    const categories = [
        { id: "all", name: "모든 카테고리" },
        { id: "product", name: "상품 관련" },
        { id: "delivery", name: "배송 관련" },
        { id: "review", name: "리뷰체험단" },
        { id: "account", name: "계정 관련" },
        { id: "point", name: "포인트" },
        { id: "etc", name: "기타" }
    ];

    // 페이지 로드 시 데이터 가져오기
    useEffect(() => {
        // 실제 구현 시 API 호출로 대체
        const fetchInquiries = async () => {
            setLoading(true);
            try {
                // API 호출 대신 더미 데이터 사용
                const dummyData = Array.from({ length: 30 }, (_, i) => ({
                    id: i + 1,
                    title: `문의 제목 ${i + 1}`,
                    content: `문의 내용 ${i + 1}입니다. 여기에 고객이 문의한 내용이 표시됩니다.`,
                    status: getRandomStatus(),
                    category: getRandomCategory(),
                    campaign: i % 3 === 0 ? null : getRandomCampaign(),
                    createdAt: getRandomDate(30),
                    updatedAt: getRandomDate(15),
                    username: `사용자${i + 1}`,
                    email: `user${i + 1}@example.com`,
                    answer: i % 3 === 0 ? null : `답변 내용 ${i + 1}입니다. 여기에 관리자가 답변한 내용이 표시됩니다.`,
                    answerDate: i % 3 === 0 ? null : getRandomDate(10),
                }));

                // 필터링 및 정렬 적용
                let filteredData = dummyData;

                // 상태 필터링
                if (filterStatus === "unanswered") {
                    filteredData = filteredData.filter(inquiry => inquiry.answer === null);
                } else if (filterStatus === "today") {
                    filteredData = filteredData.filter(inquiry => isToday(inquiry.createdAt));
                }

                // 카테고리 필터링
                if (filterCategory !== "all") {
                    filteredData = filteredData.filter(inquiry =>
                        inquiry.category.toLowerCase().includes(filterCategory.toLowerCase())
                    );
                }

                // 캠페인 필터링
                if (filterCampaign !== "all") {
                    filteredData = filteredData.filter(inquiry =>
                        inquiry.campaign && inquiry.campaign.id === filterCampaign
                    );
                }

                // 검색어 필터링
                if (searchTerm) {
                    filteredData = filteredData.filter(inquiry =>
                        inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inquiry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inquiry.username.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                // 정렬
                switch(sortBy) {
                    case "newest":
                        filteredData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                        break;
                    case "oldest":
                        filteredData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
                        break;
                    case "answeredFirst":
                        filteredData.sort((a, b) => (a.answer === null) ? 1 : (b.answer === null) ? -1 : 0);
                        break;
                    case "unansweredFirst":
                        filteredData.sort((a, b) => (a.answer === null) ? -1 : (b.answer === null) ? 1 : 0);
                        break;
                }

                setInquiries(filteredData);
                setTotalPages(Math.ceil(filteredData.length / 10));
            } catch (error) {
                console.error("문의 데이터를 불러오는 중 오류가 발생했습니다", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, [searchTerm, filterStatus, filterCategory, filterCampaign, sortBy]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // 검색 기능은 이미 useEffect에서 처리됨
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterCategory(e.target.value);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
    };

    const handleCampaignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterCampaign(e.target.value);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
    };

    // 데이터 페이징 적용
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const currentInquiries = inquiries.slice(startIndex, endIndex);

    // 통계 데이터 계산
    const totalInquiries = inquiries.length;
    const unansweredInquiries = inquiries.filter(i => i.answer === null).length;
    const todayInquiries = inquiries.filter(i => isToday(i.createdAt)).length;

    // 엑셀 다운로드 처리
    const handleExcelDownload = () => {
        alert('문의 내역 목록을 엑셀로 다운로드합니다.');
        // 실제 구현 시 API 호출 필요
    };

    // 필터 토글
    const toggleFilter = () => {
        setIsFilterExpanded(!isFilterExpanded);
    };

    // 필터 초기화
    const resetFilters = () => {
        setSearchTerm("");
        setFilterStatus("all");
        setFilterCategory("all");
        setFilterCampaign("all");
        setSortBy("newest");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">문의 관리</h1>
                <div className="flex space-x-2">
                    <Button
                        onClick={handleExcelDownload}
                        variant="outline"
                        className="flex items-center text-gray-700"
                    >
                        <FileDown size={16} className="mr-2" />
                        엑셀 다운로드
                    </Button>
                </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                    className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:border-indigo-300 cursor-pointer transition-all"
                    onClick={() => setFilterStatus("all")}
                >
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">전체 문의</p>
                            <p className="text-2xl font-bold">{totalInquiries}</p>
                        </div>
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            filterStatus === "all" ? "bg-indigo-100" : "bg-blue-100"
                        }`}>
                            <MessageSquare className={`h-6 w-6 ${
                                filterStatus === "all" ? "text-indigo-600" : "text-blue-600"
                            }`} />
                        </div>
                    </div>
                </div>
                <div
                    className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:border-red-300 cursor-pointer transition-all"
                    onClick={() => setFilterStatus("unanswered")}
                >
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">미답변 문의</p>
                            <p className="text-2xl font-bold">{unansweredInquiries}</p>
                        </div>
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            filterStatus === "unanswered" ? "bg-red-200" : "bg-red-100"
                        }`}>
                            <MessageCircle className={`h-6 w-6 ${
                                filterStatus === "unanswered" ? "text-red-700" : "text-red-600"
                            }`} />
                        </div>
                    </div>
                </div>
                <div
                    className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:border-green-300 cursor-pointer transition-all"
                    onClick={() => setFilterStatus("today")}
                >
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">오늘 접수</p>
                            <p className="text-2xl font-bold">{todayInquiries}</p>
                        </div>
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            filterStatus === "today" ? "bg-green-200" : "bg-green-100"
                        }`}>
                            <Calendar className={`h-6 w-6 ${
                                filterStatus === "today" ? "text-green-700" : "text-green-600"
                            }`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
                    <div className="relative w-full md:w-96">
                        <form onSubmit={handleSearch} className="flex items-center">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="제목, 내용 또는 작성자 검색"
                                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                                        onClick={() => setSearchTerm("")}
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white"
                            >
                                검색
                            </Button>
                        </form>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center text-gray-700"
                            onClick={toggleFilter}
                        >
                            <Filter size={16} className="mr-2" />
                            {isFilterExpanded ? "필터 접기" : "필터 옵션"}
                            <ChevronDown size={16} className={`ml-2 transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`} />
                        </Button>

                        {(filterCategory !== "all" || filterCampaign !== "all" || sortBy !== "newest") && (
                            <Button
                                type="button"
                                variant="ghost"
                                className="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50"
                                onClick={resetFilters}
                            >
                                <X size={16} className="mr-1" />
                                초기화
                            </Button>
                        )}
                    </div>
                </div>

                {isFilterExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                        {/* 카테고리 필터 */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                카테고리
                            </label>
                            <select
                                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={filterCategory}
                                onChange={handleCategoryChange}
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 캠페인 필터 */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                캠페인
                            </label>
                            <select
                                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={filterCampaign}
                                onChange={handleCampaignChange}
                            >
                                {campaigns.map(campaign => (
                                    <option key={campaign.id} value={campaign.id}>
                                        {campaign.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 정렬 옵션 */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                정렬
                            </label>
                            <select
                                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={sortBy}
                                onChange={handleSortChange}
                            >
                                <option value="newest">최신순</option>
                                <option value="oldest">오래된순</option>
                                <option value="unansweredFirst">미답변 우선</option>
                                <option value="answeredFirst">답변 우선</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* 현재 적용된 필터 표시 */}
                {(filterStatus !== "all" || filterCategory !== "all" || filterCampaign !== "all") && (
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                        <span className="text-sm text-gray-600">적용된 필터:</span>

                        {filterStatus !== "all" && (
                            <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1 px-3 py-1">
                                {filterStatus === "unanswered" ? "미답변" :
                                    filterStatus === "today" ? "오늘 접수" : filterStatus}
                                <button
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                    onClick={() => setFilterStatus("all")}
                                >
                                    <X size={14} />
                                </button>
                            </Badge>
                        )}

                        {filterCategory !== "all" && (
                            <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1 px-3 py-1">
                                {categories.find(c => c.id === filterCategory)?.name || filterCategory}
                                <button
                                    className="ml-1 text-purple-600 hover:text-purple-800"
                                    onClick={() => setFilterCategory("all")}
                                >
                                    <X size={14} />
                                </button>
                            </Badge>
                        )}

                        {filterCampaign !== "all" && (
                            <Badge className="bg-green-100 text-green-800 flex items-center gap-1 px-3 py-1">
                                {campaigns.find(c => c.id === filterCampaign)?.name || filterCampaign}
                                <button
                                    className="ml-1 text-green-600 hover:text-green-800"
                                    onClick={() => setFilterCampaign("all")}
                                >
                                    <X size={14} />
                                </button>
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            {/* 문의 목록 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                상태
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                카테고리
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                캠페인
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                제목
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                작성자
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                작성일
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                관리
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                    <div className="flex justify-center items-center space-x-2">
                                        <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                                        <span>로딩 중...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : currentInquiries.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <AlertCircle size={32} className="text-gray-400 mb-4" />
                                        <p className="text-gray-500 text-lg font-medium">
                                            문의 내역이 없습니다
                                        </p>
                                        <p className="text-gray-500 mt-1">
                                            검색 조건이나 필터를 변경해보세요.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            currentInquiries.map((inquiry) => (
                                <tr key={inquiry.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            inquiry.answer === null
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {inquiry.answer === null ? '미답변' : '답변완료'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className={
                                            inquiry.category.includes("제품") ? "bg-blue-100 text-blue-800" :
                                                inquiry.category.includes("배송") ? "bg-yellow-100 text-yellow-800" :
                                                    inquiry.category.includes("리뷰") ? "bg-green-100 text-green-800" :
                                                        inquiry.category.includes("계정") ? "bg-purple-100 text-purple-800" :
                                                            inquiry.category.includes("포인트") ? "bg-orange-100 text-orange-800" :
                                                                "bg-gray-100 text-gray-800"
                                        }>
                                            {inquiry.category}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {inquiry.campaign ? (
                                            <span className="inline-flex text-xs leading-5 font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                                                {inquiry.campaign.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                            {inquiry.title}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate max-w-xs mt-1">
                                            {inquiry.content}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{inquiry.username}</div>
                                        <div className="text-xs text-gray-500">{inquiry.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar size={14} className="mr-1 text-gray-400" />
                                            {formatDate(inquiry.createdAt)}
                                        </div>
                                        {isToday(inquiry.createdAt) && (
                                            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                New
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/customer-service/inquiries/${inquiry.id}`}
                                            className={`px-3 py-1 rounded-md inline-flex items-center ${
                                                inquiry.answer === null
                                                    ? 'text-white bg-red-500 hover:bg-red-600'
                                                    : 'text-white bg-indigo-500 hover:bg-indigo-600'
                                            }`}
                                        >
                                            {inquiry.answer === null ? '답변하기' : '상세보기'}
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                {!loading && currentInquiries.length > 0 && (
                    <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                    currentPage === 1 ? 'text-gray-300 bg-gray-50' : 'text-gray-700 bg-white hover:bg-gray-50'
                                }`}
                            >
                                이전
                            </button>
                            <button
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                    currentPage === totalPages ? 'text-gray-300 bg-gray-50' : 'text-gray-700 bg-white hover:bg-gray-50'
                                }`}
                            >
                                다음
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    전체 <span className="font-medium">{inquiries.length}</span>개 문의 중{' '}
                                    <span className="font-medium">{startIndex + 1}</span>-
                                    <span className="font-medium">{Math.min(endIndex, inquiries.length)}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">이전</span>
                                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                page === currentPage
                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">다음</span>
                                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// 타입 정의
interface Inquiry {
    id: number;
    title: string;
    content: string;
    status: string;
    category: string;
    campaign: {
        id: string;
        name: string;
    } | null;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    email: string;
    answer: string | null;
    answerDate: Date | null;
}

// 헬퍼 함수
function formatDate(date: Date): string {
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

// 더미 데이터 생성용 함수
function getRandomStatus(): string {
    const statuses = ["미답변", "답변완료"];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

function getRandomCategory(): string {
    const categories = ["제품 관련", "배송 관련", "리뷰체험단", "계정 관련", "포인트", "기타"];
    return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomCampaign(): {id: string, name: string} {
    const campaigns = [
        { id: "organic_skincare", name: "유기농 스킨케어 체험단" },
        { id: "summer_collection", name: "여름 신상품 체험단 모집" },
        { id: "smart_home", name: "스마트 홈 가전 체험단" },
        { id: "eco_friendly", name: "친환경 생활용품 체험단" },
        { id: "food_review", name: "건강식품 리뷰 체험단" }
    ];
    return campaigns[Math.floor(Math.random() * campaigns.length)];
}

function getRandomDate(maxDaysAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * maxDaysAgo));
    return date;
}