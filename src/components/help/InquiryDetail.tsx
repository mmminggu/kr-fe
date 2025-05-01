"use client";

import { Inquiry } from "./InquiryTab";
import { formatDate } from "./dateFormatter";
import { Clock, CheckCircle, ChevronLeft, ChevronRight, PaperclipIcon, FileIcon, FileTextIcon, ImageIcon, DownloadIcon, MessageSquare, Calendar, Paperclip  } from "lucide-react";
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"

interface InquiryDetailProps {
    inquiry: Inquiry;
    onBack: () => void;
    onNewInquiry: () => void;
}

export default function InquiryDetail({ inquiry, onBack, onNewInquiry }: InquiryDetailProps) {
    // 문의 상태에 따른 정보 및 스타일
    const getStatusInfo = (status: Inquiry["status"]) => {
        switch (status) {
            case "pending":
                return {
                    icon: <Clock className="h-4 w-4" />,
                    text: "접수완료",
                    color: "text-yellow-600 bg-yellow-50 border-yellow-200"
                };
            case "answered":
                return {
                    icon: <CheckCircle className="h-4 w-4" />,
                    text: "답변완료",
                    color: "text-green-600 bg-green-50 border-green-200"
                };
            case "completed":
                return {
                    icon: <CheckCircle className="h-4 w-4" />,
                    text: "처리완료",
                    color: "text-blue-600 bg-blue-50 border-blue-200"
                };
            default:
                return {
                    icon: <Clock className="h-4 w-4" />,
                    text: "처리중",
                    color: "text-gray-600 bg-gray-50 border-gray-200"
                };
        }
    };

    const statusInfo = getStatusInfo(inquiry.status);

    // 임시 첨부파일 데이터 (실제로는 문의 데이터에서 가져옴)
    const attachments = [
        { id: "1", name: "screenshot.jpg", size: 1024 * 1024 * 2.5 }, // 2.5MB
        { id: "2", name: "product_info.pdf", size: 1024 * 512 } // 512KB
    ];

    // 파일 크기 포맷팅
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + " bytes";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    {/* 헤더 영역 - 제목 왼쪽에 Q 아이콘 추가 */}
                    <div className="">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-start">
                                {/* Q 아이콘 추가 */}
                                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                    Q
                                </div>
                                <h3 className="text-lg sm:text-xl ml-3 font-medium text-gray-800">{inquiry.title}</h3>
                            </div>

                            {/* 상태 표시 */}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                {statusInfo.icon}
                                <span className="ml-1">{statusInfo.text}</span>
                            </span>
                        </div>

                        <div className="flex justify-between items-center mt-2 ml-2">
                            {/* ml-11을 추가하여 Q 아이콘과 정렬 */}
                            {/*<div className="flex items-center mt-2 space-x-3 text-sm text-gray-500">
                                <span>{inquiry.category}</span>
                                <span>|</span>
                                <span>{inquiry.campaign}</span>
                            </div>*/}
                            <div className="flex flex-wrap gap-2">
                                <div className="flex items-center text-xs bg-yellow-100 px-2 py-1 rounded-md">
                                    {/*<span className="text-gray-500 mr-1">카테고리:</span>*/}
                                    <span className="text-yellow-700">{inquiry.category}</span>
                                </div>

                                {inquiry.campaign && (
                                    <div className="flex items-center text-xs bg-green-100 px-2 py-1 rounded-md">
                                        {/*<span className="text-green-500 mr-1">캠페인:</span>*/}
                                        <span className="text-green-700">{inquiry.campaign}</span>
                                    </div>
                                )}
                            </div>

                            {/* 시간 우측 정렬 */}
                            <span className="text-sm text-gray-500">{formatDate(inquiry.createdAt)}</span>
                        </div>
                    </div>

                    {/* 문의 내용 영역 */}
                    <div className="p-3 sm:p-4 bg-gray-100 rounded-lg border border-gray-100 ml-2">
                        {/* ml-11을 추가하여 Q 아이콘과 정렬 */}
                        <p className="whitespace-pre-line text-sm">{inquiry.content}</p>
                    </div>

                    {/* 첨부파일 */}
                    {attachments && attachments.length > 0 && (
                        <div className="space-y-2 ml-2">
                            <p className="text-xs sm:text-sm font-medium text-gray-700">첨부파일</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {attachments.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center p-2 bg-white border border-gray-200 rounded-md"
                                    >
                                        <div className="h-8 w-8 flex items-center justify-center bg-gray-100 rounded-md mr-2">
                                            <ImageIcon className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                                            <p className="text-xs text-gray-500">{file.size}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-1 h-auto"
                                        >
                                            <DownloadIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 답변 영역 */}
                    {inquiry.answer && (
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-sky-500 to-teal-400 flex items-center justify-center text-white font-medium">
                                        A
                                    </div>
                                    <h4 className="ml-3 font-medium">고객센터</h4>
                                </div>
                                <p className="text-sm text-gray-500">{formatDate(inquiry.answer.createdAt)}</p>
                            </div>

                            <div className="p-4 bg-gray-100 rounded-lg ml-2 text-sm">
                                <p className="whitespace-pre-line">{inquiry.answer.content}</p>
                            </div>
                        </div>
                    )}

                    {/* 버튼 영역 */}
                    <div className="flex justify-between pt-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => {onBack()}}
                            className="border-gray-200 text-gray-700"
                            size="sm"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            목록으로
                        </Button>

                        <Button
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                            size="sm"
                            onClick={onNewInquiry}
                        >
                            추가 문의하기
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

