"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    User,
    Clock,
    Calendar,
    Send,
    Paperclip,
    Image,
    File,
    Download,
    X,
    CheckCircle,
    MessageSquare,
    FileImage,
    FileText
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/src/components/ui/dialog";

interface InquiryDetailProps {
    id: number;
}

export default function InquiryDetail({ id }: InquiryDetailProps) {
    const [inquiry, setInquiry] = useState<InquiryDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // 실제 구현 시 API 호출로 대체
        const fetchInquiryDetail = async () => {
            setLoading(true);
            try {
                // API 호출 대신 더미 데이터 사용
                const dummyData: InquiryDetailType = {
                    id,
                    title: `상품 배송 문의`,
                    content: `주문한 상품이 언제 배송되나요?`,
                    category: "배송",
                    campaign: {
                        id: "organic_skincare",
                        name: "[포토리뷰] 필라테스 양말 세트"
                    },
                    createdAt: new Date(2025, 4, 15, 14, 30),
                    username: `사용자${id}`,
                    email: `user${id}@example.com`,
                    phone: "010-1234-5678",
                    answer: id % 2 === 0 ? null : `안녕하세요.\n주문하신 상품은 내일 발송 예정입니다.\n배송은 1-2일 소요됩니다.\n감사합니다.`,
                    answerDate: id % 2 === 0 ? null : new Date(2025, 4, 15, 16, 45),
                    adminName: id % 2 === 0 ? null : "고객센터",
                    images: [
                        { url: "https://via.placeholder.com/800x600?text=Image1", name: "screenshot.jpg", size: 2621440 }
                    ],
                    files: [
                        { url: "/sample.pdf", name: "product_info.pdf", size: 524288 }
                    ],
                };

                setInquiry(dummyData);
            } catch (error) {
                console.error("문의 상세 정보를 불러오는 중 오류가 발생했습니다", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiryDetail();
    }, [id]);

    const handleSubmitAnswer = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!answer.trim()) return;

        setIsSubmitting(true);

        try {
            // 실제 구현 시 API 호출로 대체
            // 여기서는 setTimeout으로 API 호출 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 1000));

            const now = new Date();

            // 상태 업데이트
            if (inquiry) {
                setInquiry({
                    ...inquiry,
                    answer,
                    answerDate: now,
                    adminName: "고객센터", // 실제 구현에서는 로그인한 관리자 정보 사용
                });
            }

            // 폼 초기화
            setAnswer("");
            setAttachments([]);

            // 확인 다이얼로그 표시
            setIsConfirmDialogOpen(true);
        } catch (error) {
            console.error("답변 등록 중 오류가 발생했습니다", error);
            alert("답변 등록에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const showImageViewer = (url: string) => {
        setViewingImage(url);
        setIsImageViewerOpen(true);
    };

    // 파일 선택 핸들러
    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    // 파일 변경 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // 최대 2개까지만 허용
            if (attachments.length + e.target.files.length > 2) {
                alert("첨부파일은 최대 2개까지 가능합니다.");
                return;
            }

            setAttachments([...attachments, ...Array.from(e.target.files)]);

            // 파일 입력 초기화
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // 첨부 파일 제거
    const handleRemoveFile = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    // 파일 크기 포맷팅
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                    <p className="mt-2 text-gray-500">문의 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!inquiry) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white p-8 rounded-lg border border-gray-200">
                <X className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">문의 정보를 찾을 수 없습니다</h2>
                <p className="text-gray-600 mb-4">요청하신 문의 정보가 존재하지 않거나 삭제되었을 수 있습니다.</p>
                <Link href="/admin/customer-service/inquiries">
                    <Button
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        문의 목록으로 돌아가기
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Link href="/admin/customer-service/inquiries" className="mr-4 text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">문의 상세</h1>
                </div>
                <Badge
                    className={`px-3 py-1 text-sm font-medium ${
                        inquiry.answer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                    {inquiry.answer ? '답변완료' : '미답변'}
                </Badge>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                {/* 문의 내용 영역 */}
                <div className="border-b border-gray-200">
                    <div className="p-6">
                        {/* 문의 헤더 - 질문 영역 */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    Q
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-xl font-bold text-gray-900">{inquiry.title}</h2>
                                    <div className="flex flex-wrap gap-3 mt-2">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <User size={14} className="mr-1" />
                                            {inquiry.username}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock size={14} className="mr-1" />
                                            {formatDateTime(inquiry.createdAt)}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <Badge className="bg-yellow-100 text-yellow-800">
                                            {inquiry.category}
                                        </Badge>

                                        {inquiry.campaign && (
                                            <Badge className="bg-green-100 text-green-800">
                                                {inquiry.campaign.name}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 문의 내용 */}
                        <div className="mt-5 p-4 bg-gray-50 rounded-lg">
                            <p className="whitespace-pre-line text-gray-700">{inquiry.content}</p>
                        </div>

                        {/* 첨부 파일 (이미지 + 문서) */}
                        {(inquiry.images && inquiry.images.length > 0) || (inquiry.files && inquiry.files.length > 0) ? (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">첨부파일</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* 이미지 파일 */}
                                    {inquiry.images && inquiry.images.map((image, index) => (
                                        <div
                                            key={`image-${index}`}
                                            className="flex border border-gray-200 rounded-lg overflow-hidden"
                                        >
                                            <div
                                                className="w-16 h-16 bg-gray-100 flex-shrink-0 flex items-center justify-center cursor-pointer"
                                                onClick={() => showImageViewer(image.url)}
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={image.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 p-3 flex flex-col justify-center">
                                                <p className="text-sm font-medium text-gray-800 truncate">{image.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                                            </div>
                                            <div className="flex items-center pr-3">
                                                <a
                                                href={image.url}
                                                download={image.name}
                                                className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full"
                                                title="다운로드"
                                                >
                                                <Download size={16} />
                                                </a>
                                            </div>
                                        </div>
                                        ))}

                                    {/* 문서 파일 */}
                                    {inquiry.files && inquiry.files.map((file, index) => (
                                        <div
                                            key={`file-${index}`}
                                            className="flex border border-gray-200 rounded-lg overflow-hidden"
                                        >
                                            <div className="w-16 h-16 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                                <FileText className="h-7 w-7 text-gray-500" />
                                            </div>
                                            <div className="flex-1 p-3 flex flex-col justify-center">
                                                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                            </div>
                                            <div className="flex items-center pr-3">
                                                <a
                                                    href={file.url}
                                                    download={file.name}
                                                    className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full"
                                                    title="다운로드"
                                                    >
                                                    <Download size={16} />
                                                </a>
                                            </div>
                                        </div>
                                        ))}
                                </div>
                            </div>
                            ) : null}
                    </div>
                </div>

                {/* 답변 영역 */}
                <div className="p-6">
                    {inquiry.answer ? (
                        <div>
                            {/* 답변 헤더 */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold">
                                        A
                                    </div>
                                    <div className="ml-4">
                                        <div className="flex items-center">
                                            <h3 className="text-lg font-medium text-gray-900">{inquiry.adminName}</h3>
                                            <span className="ml-3 text-sm text-gray-500">{formatDateTime(inquiry.answerDate!)}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAnswer(inquiry.answer || "")}
                                    className="text-indigo-600 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
                                >
                                    답변 수정
                                </Button>
                            </div>

                            {/* 답변 내용 */}
                            <div className="ml-14 p-4 bg-gray-50 rounded-lg">
                                <p className="whitespace-pre-line text-gray-700">{inquiry.answer}</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitAnswer}>
                            <div className="flex items-start mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold">
                                    A
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">답변 작성</h3>

                                    {/* 답변 입력 영역 */}
                                    <div className="mb-4">
                                        <textarea
                                            rows={6}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="답변 내용을 입력해주세요..."
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            required
                                        ></textarea>
                                        <p className="mt-1 text-xs text-gray-500">
                                            줄바꿈은 그대로 유지됩니다. 문단을 구분하려면 빈 줄을 추가하세요.
                                        </p>
                                    </div>

                                    {/* 첨부파일 영역 */}
                                    <div className="mb-4">
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleFileSelect}
                                                className="flex items-center"
                                            >
                                                <Paperclip size={16} className="mr-1" />
                                                파일 첨부
                                            </Button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                                multiple
                                            />
                                            <span className="text-xs text-gray-500">
                                                최대 2개 / 5MB 이하
                                            </span>
                                        </div>

                                        {/* 첨부파일 목록 */}
                                        {attachments.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {attachments.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-md"
                                                    >
                                                        <div className="flex items-center space-x-2 text-sm text-gray-700 truncate">
                                                            {file.type.includes('image')
                                                                ? <Image className="h-4 w-4 text-indigo-500" />
                                                                : <File className="h-4 w-4 text-indigo-500" />
                                                            }
                                                            <span className="truncate max-w-[180px] sm:max-w-xs">{file.name}</span>
                                                            <span className="text-xs text-gray-500">
                                                                ({formatFileSize(file.size)})
                                                            </span>
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

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || !answer.trim()}
                                            className={`
                                            flex items-center px-4 py-2 rounded-md text-sm font-medium text-white
                                            ${
                                                isSubmitting || !answer.trim()
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                                            }
                                            `}
                                        >
                                            <Send size={16} className="mr-2" />
                                            {isSubmitting ? '처리 중...' : '답변 등록하기'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* 이미지 뷰어 모달 */}
            <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>첨부 이미지</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center">
                        {viewingImage && (
                            <img
                                src={viewingImage}
                                alt="첨부 이미지"
                                className="max-h-[70vh] object-contain"
                            />
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsImageViewerOpen(false)}>닫기</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 답변 등록 확인 다이얼로그 */}
            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">답변이 등록되었습니다</h2>
                        <p className="text-gray-600 text-center mb-4">
                            고객에게 답변이 성공적으로 전달되었습니다. 고객에게 알림이 발송됩니다.
                        </p>
                        <Button
                            onClick={() => setIsConfirmDialogOpen(false)}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                        >
                            확인
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// 타입 정의
interface InquiryDetailType {
    id: number;
    title: string;
    content: string;
    category: string;
    campaign?: {
        id: string;
        name: string;
    } | null;
    createdAt: Date;
    username: string;
    email: string;
    phone: string;
    answer: string | null;
    answerDate: Date | null;
    adminName: string | null;
    images?: {
        url: string;
        name: string;
        size: number;
    }[];
    files?: {
        url: string;
        name: string;
        size: number;
    }[];
}

// 헬퍼 함수
function formatDate(date: Date): string {
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function formatDateTime(date: Date): string {
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}