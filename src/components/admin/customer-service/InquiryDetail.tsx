"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, Clock, Tag, Send } from "lucide-react";

interface InquiryDetailProps {
    id: number;
}

export default function InquiryDetail({ id }: InquiryDetailProps) {
    const [inquiry, setInquiry] = useState<InquiryDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // 실제 구현 시 API 호출로 대체
        const fetchInquiryDetail = async () => {
            setLoading(true);
            try {
                // API 호출 대신 더미 데이터 사용
                const dummyData: InquiryDetailType = {
                    id,
                    title: `문의 제목 ${id}`,
                    content: `안녕하세요, 관리자님.\n\n저는 리뷰어 체험단 서비스를 이용 중인 고객입니다. 최근에 캠페인에 참여하면서 몇 가지 문제가 있어 문의드립니다.\n\n1. 제품을 받은 후 리뷰를 작성했는데, 리뷰가 승인되지 않았습니다.\n2. 포인트가 정상적으로 지급되지 않은 것 같습니다.\n\n확인 부탁드립니다. 감사합니다.`,
                    category: "포인트/리뷰",
                    createdAt: new Date(2025, 4, 15, 14, 30),
                    username: `사용자${id}`,
                    email: `user${id}@example.com`,
                    phone: "010-1234-5678",
                    answer: id % 2 === 0 ? null : `안녕하세요, 사용자${id}님.\n\n문의 주셔서 감사합니다. 해당 내용 확인해보았습니다.\n\n1. 리뷰 승인 지연 문제는 시스템 오류로 인한 것으로, 현재 수정 완료되었습니다.\n2. 포인트는 승인 후 24시간 이내에 지급될 예정입니다.\n\n추가 문의사항 있으시면 언제든지 연락주세요. 감사합니다.`,
                    answerDate: id % 2 === 0 ? null : new Date(2025, 4, 15, 16, 45),
                    adminName: id % 2 === 0 ? null : "관리자A",
                    images: [
                        { url: "https://via.placeholder.com/300x200?text=Image1", caption: "첨부 이미지 1" },
                        { url: "https://via.placeholder.com/300x200?text=Image2", caption: "첨부 이미지 2" },
                    ],
                    related: [
                        { id: 101, title: "이전 문의 제목 1", date: new Date(2025, 3, 20) },
                        { id: 102, title: "이전 문의 제목 2", date: new Date(2025, 2, 15) },
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
                    adminName: "현재 관리자", // 실제 구현에서는 로그인한 관리자 정보 사용
                });
            }

            // 폼 초기화
            setAnswer("");

            alert("답변이 등록되었습니다.");
        } catch (error) {
            console.error("답변 등록 중 오류가 발생했습니다", error);
            alert("답변 등록에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-10">로딩 중...</div>;
    }

    if (!inquiry) {
        return <div className="text-center py-10">문의 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Link href="/admin/customer-service/inquiries" className="mr-4 text-gray-500 hover:text-gray-700">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">문의 상세</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* 문의 헤더 */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{inquiry.title}</h2>
                            <div className="flex flex-wrap items-center mt-1 space-x-4">
                                <div className="flex items-center text-sm text-gray-500">
                                    <User size={16} className="mr-1" />
                                    {inquiry.username} ({inquiry.email})
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Clock size={16} className="mr-1" />
                                    {formatDateTime(inquiry.createdAt)}
                                </div>
                                <div className="flex items-center text-sm">
                                    <Tag size={16} className="mr-1 text-gray-500" />
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {inquiry.category}
                  </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 md:mt-0">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  inquiry.answer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {inquiry.answer ? '답변완료' : '미답변'}
              </span>
                        </div>
                    </div>
                </div>

                {/* 문의 내용 */}
                <div className="px-6 py-4">
                    <div className="prose max-w-none">
                        <p className="whitespace-pre-line">{inquiry.content}</p>
                    </div>

                    {/* 첨부 이미지 */}
                    {inquiry.images && inquiry.images.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">첨부 이미지</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {inquiry.images.map((image, index) => (
                                    <div key={index} className="group relative">
                                        <img
                                            src={image.url}
                                            alt={image.caption || `첨부 이미지 ${index + 1}`}
                                            className="h-48 w-full object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                                            <a
                                                href={image.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 bg-white text-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                크게 보기
                                            </a>
                                        </div>
                                        {image.caption && (
                                            <p className="mt-1 text-sm text-gray-500">{image.caption}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 답변 영역 */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {inquiry.answer ? '답변 내용' : '답변 작성'}
                    </h3>

                    {inquiry.answer ? (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <User size={16} className="mr-1" />
                                    <span className="font-medium">{inquiry.adminName}</span>
                                    <span className="mx-2">·</span>
                                    <Clock size={16} className="mr-1" />
                                    <span>{formatDateTime(inquiry.answerDate!)}</span>
                                </div>
                            </div>
                            <div className="prose max-w-none mt-2">
                                <p className="whitespace-pre-line">{inquiry.answer}</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitAnswer}>
                            <div className="mb-4">
                <textarea
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="답변 내용을 입력해주세요..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                ></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !answer.trim()}
                                    className={`
                    flex items-center px-4 py-2 rounded-md text-sm font-medium text-white
                    ${
                                        isSubmitting || !answer.trim()
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                    }
                  `}
                                >
                                    <Send size={16} className="mr-2" />
                                    {isSubmitting ? '처리 중...' : '답변 등록하기'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* 연관 문의 */}
                {inquiry.related && inquiry.related.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">이 사용자의 다른 문의</h3>
                        <ul className="space-y-1">
                            {inquiry.related.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={`/admin/customer-service/inquiries/${item.id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        {item.title} ({formatDate(item.date)})
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

// 타입 정의
interface InquiryDetailType {
    id: number;
    title: string;
    content: string;
    category: string;
    createdAt: Date;
    username: string;
    email: string;
    phone: string;
    answer: string | null;
    answerDate: Date | null;
    adminName: string | null;
    images?: {
        url: string;
        caption?: string;
    }[];
    related?: {
        id: number;
        title: string;
        date: Date;
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