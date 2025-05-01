"use client";

import { useState, useEffect } from "react";
import { Inquiry } from "./InquiryTab";
import { formatDate } from "./dateFormatter";
import { AlertCircle, CheckCircle, Clock, Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface InquiryListProps {
    inquiries: Inquiry[];
    onViewDetail: (id: string) => void;
}

export default function InquiryList({ inquiries, onViewDetail }: InquiryListProps) {
    // 검색어 상태
    const [searchQuery, setSearchQuery] = useState("");
    // 현재 페이지 상태
    const [currentPage, setCurrentPage] = useState(1);
    // 페이지당 표시할 항목 수
    const itemsPerPage = 10;

    // 검색어 변경 처리
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    // 검색 필터링된 문의 목록
    const filteredInquiries = inquiries.filter(inquiry =>
        inquiry.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 페이징 처리를 위한 계산
    const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInquiries = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // 상태별 아이콘과 스타일
    const getStatusInfo = (status: Inquiry["status"]) => {
        switch (status) {
            case "pending":
                return {
                    icon: <Clock className="h-5 w-5 text-yellow-500" />,
                    text: "접수완료",
                    textColor: "text-yellow-600",
                    bgColor: "bg-yellow-50"
                };
            case "answered":
                return {
                    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
                    text: "답변완료",
                    textColor: "text-green-600",
                    bgColor: "bg-green-50"
                };
            case "completed":
                return {
                    icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
                    text: "처리완료",
                    textColor: "text-blue-600",
                    bgColor: "bg-blue-50"
                };
            default:
                return {
                    icon: <Clock className="h-5 w-5 text-gray-500" />,
                    text: "처리중",
                    textColor: "text-gray-600",
                    bgColor: "bg-gray-50"
                };
        }
    };

    // 페이지 번호 배열 생성
    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div>
            <p className="text-sm text-gray-500 mb-4">접수하신 문의와 답변 내역을 확인하실 수 있습니다.</p>

            {/* 검색 영역 */}
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="문의 제목 검색"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full p-3 pl-10 border text-sm border-gray-200 rounded-lg bg-gray-50"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400" />
                </div>
            </div>

            {/* 문의가 없는 경우 표시할 컴포넌트 */}
            {filteredInquiries.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    {searchQuery ? (
                        <>
                            <h3 className="mt-2 text-xl font-medium text-gray-900">검색 결과가 없습니다</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                다른 검색어로 다시 시도해보세요.
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="mt-2 text-xl font-medium text-gray-900">문의 내역이 없습니다</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                새로운 문의를 등록하시려면 '문의 접수' 탭으로 이동하세요.
                            </p>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg  border border-gray-200 overflow-hidden">
                        {/* 목록 헤더 */}
                        <div className="grid grid-cols-12 bg-gray-100 py-3 px-4 text-sm font-medium text-gray-700 border-b">
                            <div className="col-span-2 md:col-span-2 text-center">분류</div>
                            <div className="col-span-6 md:col-span-5">제목</div>
                            <div className="col-span-4 md:col-span-3 text-center">날짜</div>
                            <div className="hidden md:block md:col-span-2 text-center">상태</div>
                        </div>

                        {/* 목록 내용 */}
                        <div className="divide-y text-sm">
                            {currentInquiries.map((inquiry) => {
                                const statusInfo = getStatusInfo(inquiry.status);

                                return (
                                    <button
                                        key={inquiry.id}
                                        className="w-full text-left hover:bg-gradient-to-r hover:from-indigo-50/100 hover:to-purple-100/50 transition py-4 px-4 grid grid-cols-12 items-center"
                                        onClick={() => onViewDetail(inquiry.id)}
                                    >
                                        <div className="col-span-2 md:col-span-2 text-center text-sm text-gray-700">
                                            {inquiry.category}
                                        </div>
                                        <div className="col-span-6 md:col-span-5 truncate">
                                            {inquiry.title}
                                        </div>
                                        <div className="col-span-4 md:col-span-3 text-sm text-gray-500 text-center">
                                            {formatDate(inquiry.createdAt).split(' ')[0]}
                                        </div>
                                        <div className="hidden md:flex md:col-span-2 text-sm justify-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.textColor} ${statusInfo.bgColor}`}>
                        {statusInfo.icon}
                          <span className="ml-1">{statusInfo.text}</span>
                      </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 페이지네이션 */}
                    {totalPages > 0 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-1">
                                {totalPages > 10 && currentPage > 1 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-9 h-9 p-0 flex items-center justify-center border-gray-300 text-gray-700"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        &lt;
                                    </Button>
                                )}

                                {renderPageNumbers().map(number => (
                                    <Button
                                        key={number}
                                        variant="outline"
                                        size="sm"
                                        className={`w-9 h-9 p-0 ${
                                            number === currentPage
                                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-500"
                                                : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                        }`}
                                        onClick={() => handlePageChange(number)}
                                    >
                                        {number}
                                    </Button>
                                ))}

                                {totalPages > 10 && currentPage < totalPages && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-9 h-9 p-0 flex items-center justify-center border-gray-300 text-gray-700"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        &gt;
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}