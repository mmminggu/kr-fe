"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Search, Filter, MessageSquare, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

export default function InquiryList() {
    // 상태 관리
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

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
                    createdAt: getRandomDate(30),
                    updatedAt: getRandomDate(15),
                    username: `사용자${i + 1}`,
                    email: `user${i + 1}@example.com`,
                    answer: i % 3 === 0 ? null : `답변 내용 ${i + 1}입니다. 여기에 관리자가 답변한 내용이 표시됩니다.`,
                    answerDate: i % 3 === 0 ? null : getRandomDate(10),
                }));

                // 필터링 적용
                let filteredData = dummyData;
                if (filterStatus !== "all") {
                    filteredData = dummyData.filter(inquiry =>
                        filterStatus === "answered" ? inquiry.answer !== null : inquiry.answer === null
                    );
                }

                // 검색어 적용
                if (searchTerm) {
                    filteredData = filteredData.filter(inquiry =>
                        inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inquiry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inquiry.username.toLowerCase().includes(searchTerm.toLowerCase())
                    );
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
    }, [searchTerm, filterStatus]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // 검색 기능은 이미 useEffect에서 처리됨
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
    };

    // 데이터 페이징 적용
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const currentInquiries = inquiries.slice(startIndex, endIndex);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">문의 관리</h1>
                <div className="flex space-x-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        엑셀 다운로드
                    </button>
                </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">전체 문의</p>
                            <p className="text-2xl font-bold">{inquiries.length}</p>
                        </div>
                        <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">미답변 문의</p>
                            <p className="text-2xl font-bold">{inquiries.filter(i => i.answer === null).length}</p>
                        </div>
                        <div className="bg-red-100 h-12 w-12 rounded-full flex items-center justify-center">
                            <MessageCircle className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">금일 문의</p>
                            <p className="text-2xl font-bold">{inquiries.filter(i => isToday(i.createdAt)).length}</p>
                        </div>
                        <div className="bg-green-100 h-12 w-12 rounded-full flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">평균 응답 시간</p>
                            <p className="text-2xl font-bold">5.2시간</p>
                        </div>
                        <div className="bg-purple-100 h-12 w-12 rounded-full flex items-center justify-center">
                            <Clock className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="제목, 내용 또는 작성자 검색"
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </form>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filterStatus}
                        onChange={handleFilterChange}
                    >
                        <option value="all">모든 상태</option>
                        <option value="unanswered">미답변</option>
                        <option value="answered">답변 완료</option>
                    </select>
                    <select
                        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">모든 카테고리</option>
                        <option value="product">제품 관련</option>
                        <option value="delivery">배송 관련</option>
                        <option value="account">계정 관련</option>
                        <option value="other">기타</option>
                    </select>
                </div>
            </div>

            {/* 문의 목록 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                    로딩 중...
                                </td>
                            </tr>
                        ) : currentInquiries.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                    검색 결과가 없습니다.
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {inquiry.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                            {inquiry.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{inquiry.username}</div>
                                        <div className="text-xs text-gray-500">{inquiry.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(inquiry.createdAt)}
                                        {isToday(inquiry.createdAt) && (
                                            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                          New
                        </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/customer-service/inquiries/${inquiry.id}`}
                                            className={`${
                                                inquiry.answer === null
                                                    ? 'text-red-600 hover:text-red-900'
                                                    : 'text-blue-600 hover:text-blue-900'
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
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
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
    const categories = ["제품 관련", "배송 관련", "계정 관련", "기타"];
    return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomDate(maxDaysAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * maxDaysAgo));
    return date;
}