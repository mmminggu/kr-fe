"use client";

import { useState, useRef } from "react";
import { Inquiry } from "./InquiryTab";
import { Paperclip, Image, X } from "lucide-react";
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { ChevronLeft, ChevronRight, PaperclipIcon, FileIcon, FileTextIcon, ImageIcon, DownloadIcon, MessageSquare } from "lucide-react"

interface InquiryFormProps {
    onSubmit: (inquiry: Omit<Inquiry, "id" | "createdAt" | "status">) => void;
}

// 문의 카테고리 목록
const INQUIRY_CATEGORIES = [
    { id: "선택해주세요", name: "유형을 선택해주세요" },
    { id: "상품", name: "상품" },
    { id: "배송", name: "배송" },
    { id: "리뷰체험단", name: "리뷰체험단" },
    { id: "계정", name: "계정" },
    { id: "기타", name: "기타" }
];

// 캠페인 목록 (예시 데이터)
const CAMPAIGNS = [
    { id: "", name: "캠페인 선택 (선택사항)" },
    { id: "campaign1", name: "봄맞이 뷰티 체험단" },
    { id: "campaign2", name: "홈케어 리빙 제품 체험단" },
    { id: "campaign3", name: "유기농 식품 체험단" },
    { id: "campaign4", name: "스마트 가전 체험단" },
    { id: "campaign5", name: "패션 액세서리 체험단" }
];

export default function InquiryForm({ onSubmit }: InquiryFormProps) {
    const [formData, setFormData] = useState({
        category: "",
        campaign: "",
        title: "",
        content: "",
        email: "",
        phone: ""
    });

    const [smsAgree, setSmsAgree] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 입력값 변경 처리
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // SMS 수신 동의 변경
    const handleSmsAgreeChange = () => {
        setSmsAgree(!smsAgree);
    };

    // 파일 선택 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        // 최대 2개까지만 허용
        if (files.length + selectedFiles.length > 2) {
            alert("첨부파일은 최대 2개까지 가능합니다.");
            return;
        }

        // 파일 추가
        setFiles(prev => [...prev, ...Array.from(selectedFiles)]);

        // 파일 입력 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // 파일 삭제
    const handleRemoveFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // 폼 제출 처리
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 유효성 검사
        if (!formData.category || formData.category === "선택해주세요") {
            alert("문의 유형을 선택해주세요.");
            return;
        }

        if (!formData.title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (!formData.content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        if (!formData.email.trim()) {
            alert("이메일을 입력해주세요.");
            return;
        }

        // 폼 제출
        onSubmit({
            category: formData.category,
            title: formData.title,
            content: formData.content,
            // 실제로는 여기에 캠페인, 이메일, 전화번호 등 추가 정보를 포함
        });
    };

    return (
        <div className="bg-white rounded-lg">
            <div className="bg-gray-100 p-5 rounded-lg mb-6 flex items-start gap-4">
                <MessageSquare className="text-indigo-500 w-6 h-6 mt-1" />
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800 mb-1">
                        문의사항이 있으신가요?
                    </h3>
                    <p className="text-sm text-gray-500">
                        궁금한 점이나 불편한 점을 남겨주시면 빠르게 답변드리겠습니다.
                    </p>
                </div>
            </div>

            <form className="space-y-4">
                {/* 문의 유형과 관련 캠페인을 한 줄에 배치 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="inquiry-type" className="text-sm">문의 유형</Label>
                        <Select>
                            <SelectTrigger className="h-10 bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                <SelectValue placeholder="문의 유형을 선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="account">계정</SelectItem>
                                <SelectItem value="payment">결제</SelectItem>
                                <SelectItem value="refund">환불</SelectItem>
                                <SelectItem value="event">이벤트</SelectItem>
                                <SelectItem value="service">서비스</SelectItem>
                                <SelectItem value="etc">기타</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="campaign" className="text-sm">관련 캠페인</Label>
                        <Select>
                            <SelectTrigger className="h-10 bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                <SelectValue placeholder="관련 캠페인을 선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">해당 없음</SelectItem>
                                <SelectItem value="spring">봄 시즌 이벤트</SelectItem>
                                <SelectItem value="summer">여름 할인 프로모션</SelectItem>
                                <SelectItem value="special">특별 기획전</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* 제목 필드 - 패딩 줄이기 */}
                <div className="space-y-1">
                    <Label htmlFor="title" className="text-sm">제목</Label>
                    <Input
                        id="title"
                        placeholder="제목을 입력해주세요"
                        className="h-10 bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>

                {/* 내용 필드 - 높이 최적화 */}
                <div className="space-y-1">
                    <Label htmlFor="content" className="text-sm">내용</Label>
                    <Textarea
                        id="content"
                        placeholder="문의 내용을 입력해주세요"
                        className="min-h-[120px] bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="file">첨부파일</Label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="border-gray-200 text-gray-700 w-full sm:w-auto"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <PaperclipIcon className="mr-2 h-4 w-4" />
                            파일 첨부
                        </Button>
                        <span className="text-xs sm:text-sm text-gray-500">최대 2개 / 5MB 이하</span>
                    </div>

                    {/* 첨부된 파일 목록 UI 개선 */}
                    {files.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-md"
                                >
                                    <div className="flex items-center space-x-2 text-sm text-gray-700 truncate">
                                        {file.name.match(/\.(jpg|jpeg|png|gif)$/i)
                                            ? <ImageIcon className="h-4 w-4 text-indigo-500" />
                                            : <FileTextIcon className="h-4 w-4 text-indigo-500" />
                                        }
                                        <span className="truncate max-w-[180px] sm:max-w-xs">{file.name}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveFile(index)}
                                        className="text-gray-500 hover:text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-sm sm:text-base"
                >
                    문의 등록
                </Button>
            </form>
        </div>
    );
}

/*<div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 p-5 rounded mb-6 flex items-start">
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800 mb-1">
                        이용 중에 생긴 불편한 점이나 문의사항을 보내주세요.
                    </h3>
                    <p className="text-sm text-gray-500">확인 후 답변드리겠습니다.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/!* 유형 선택 *!/}
                <div>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-indigo-500"
                    >
                        {INQUIRY_CATEGORIES.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/!* 캠페인 선택 (숨겨진 조건부 필드) *!/}
                {formData.category === "리뷰체험단" && (
                    <div>
                        <select
                            name="campaign"
                            value={formData.campaign}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-indigo-500"
                        >
                            {CAMPAIGNS.map(campaign => (
                                <option key={campaign.id} value={campaign.id}>
                                    {campaign.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/!* 제목 입력 *!/}
                <div>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="제목을 입력해주세요"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-indigo-500"
                    />
                </div>

                {/!* 내용 입력 *!/}
                <div className="relative">
          <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="내용을 작성해주세요"
              rows={8}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-indigo-500"
          ></textarea>

                    {/!* 파일 첨부 버튼 *!/}
                    <div className="absolute left-3 bottom-3 flex space-x-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-gray-500 hover:text-indigo-600 focus:outline-none"
                            title="파일 첨부"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            multiple
                            accept="image/!*,.pdf,.doc,.docx"
                        />
                    </div>

                    {/!* 파일 크기 안내 *!/}
                    <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                        이미지 5MB이하 / 최대 2장 첨부 가능
                    </div>
                </div>

                {/!* 첨부된 파일 목록 *!/}
                {files.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center bg-gray-100 rounded-md p-2 text-sm">
                                <Image className="w-4 h-4 text-gray-500 mr-1" />
                                <span className="truncate max-w-xs">{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(index)}
                                    className="ml-2 text-gray-400 hover:text-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/!* 연락처 정보 *!/}
                <div className="pt-3 border-t border-gray-200">
                    <div className="mb-3">
                        <div className="flex">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 text-gray-700 focus:outline-none focus:border-indigo-500"
                            />
                            <button
                                type="button"
                                className="bg-gray-100 text-gray-700 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                            >
                                변경하기
                            </button>
                        </div>
                    </div>

                    {/!* SMS 수신 동의 *!/}
                    <div className="flex items-center mb-3">
                        <label className="flex items-center cursor-pointer">
                            <div className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 ${smsAgree ? 'bg-red-500' : 'border border-gray-300'}`}>
                                {smsAgree && <span className="text-white text-xs">✓</span>}
                            </div>
                            <input
                                type="checkbox"
                                checked={smsAgree}
                                onChange={handleSmsAgreeChange}
                                className="hidden"
                            />
                            <span className="text-sm text-gray-700">답변에 대한 알림을 SMS로 받기</span>
                        </label>
                    </div>

                    {/!* 전화번호 입력 (SMS 동의시에만 표시) *!/}
                    {smsAgree && (
                        <div className="flex mb-3">
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="010-0000-0000"
                                className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 text-gray-700 focus:outline-none focus:border-indigo-500"
                            />
                            <button
                                type="button"
                                className="bg-gray-100 text-gray-700 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                            >
                                변경하기
                            </button>
                        </div>
                    )}
                </div>

                {/!* 제출 버튼 *!/}
                <button
                    type="submit"
                    className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 focus:outline-none"
                >
                    보내기
                </button>
            </form>
        </div>*/