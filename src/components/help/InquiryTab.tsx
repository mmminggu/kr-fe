"use client";

import { useState } from "react";
import InquiryList from "./InquiryList";
import InquiryForm from "./InquiryForm";
import InquiryDetail from "./InquiryDetail";

// 화면 상태를 정의하는 타입
type ViewState = "list" | "detail";
type TabState = "new" | "history";

// 문의 데이터 타입 정의
export interface Inquiry {
    id: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    campaign: string;
    status: "pending" | "answered" | "completed";
    answer?: {
        content: string;
        createdAt: string;
    };
}

export default function InquiryTab() {
    // 현재 화면 상태
    const [viewState, setViewState] = useState<ViewState>("list");
    // 현재 선택된 탭
    const [activeTab, setActiveTab] = useState<TabState>("new");
    // 선택된 문의 ID (상세 페이지용)
    const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

    // 임시 문의 데이터 (실제로는 API에서 불러옴)
    const [inquiries, setInquiries] = useState<Inquiry[]>([
        {
            id: "1",
            title: "상품 배송 문의",
            content: "주문한 상품이 언제 배송되나요?",
            category: "배송",
            createdAt: "2025-04-25T14:30:00",
            campaign: "[포토리뷰] 필라테스 양말 세트",
            status: "completed",
            answer: {
                content: "안녕하세요.\n주문하신 상품은 내일 발송 예정입니다.\n배송은 1-2일 소요됩니다.\n감사합니다.",
                createdAt: "2025-04-26T09:15:00"
            }
        },
        {
            id: "2",
            title: "리뷰 작성 기간",
            content: "리뷰는 언제까지 작성해야 하나요?",
            category: "리뷰체험단",
            createdAt: "2025-04-27T10:45:00",
            campaign: "[별점] 아디다스 겨울 롱패딩",
            status: "pending"
        },
        {
            id: "3",
            title: "계정 정보 변경 방법",
            content: "이메일 주소를 변경하고 싶은데 어떻게 해야 하나요?",
            category: "계정",
            createdAt: "2025-04-22T09:15:00",
            status: "completed",
            campaign: "[포토리뷰/별점] 고급 마우스 장패드",
            answer: {
                content: "안녕하세요.\n계정 정보 변경은 마이페이지 > 계정 설정에서 가능합니다.\n감사합니다.",
                createdAt: "2025-04-22T11:30:00"
            }
        },
        {
            id: "4",
            title: "리뷰 수정 가능 여부",
            content: "이미 작성한 리뷰를 수정할 수 있나요?",
            category: "리뷰체험단",
            createdAt: "2025-04-20T16:45:00",
            campaign: "[별점] 초음파 탁상용 미니 가습기",
            status: "completed",
            answer: {
                content: "네, 작성 후 7일 이내에는 리뷰 수정이 가능합니다. 리뷰 상세 페이지에서 수정 버튼을 통해 진행하실 수 있습니다.",
                createdAt: "2025-04-21T10:15:00"
            }
        },
        {
            id: "5",
            title: "상품 교환 문의",
            content: "받은 상품이 불량입니다. 교환은 어떻게 신청하나요?",
            category: "상품",
            createdAt: "2025-04-18T11:20:00",
            campaign: "[별점] 초음파 탁상용 미니 가습기",
            status: "completed",
            answer: {
                content: "안녕하세요. 불편을 드려 죄송합니다. 상품 상세 페이지 > 교환/반품 신청 메뉴를 통해 신청해주세요.",
                createdAt: "2025-04-18T14:45:00"
            }
        },
        {
            id: "6",
            title: "리뷰 작성 방법",
            content: "사진과 함께 리뷰를 작성하고 싶은데 어떻게 하나요?",
            category: "리뷰체험단",
            createdAt: "2025-04-15T13:10:00",
            campaign: "[별점] 초음파 탁상용 미니 가습기",
            status: "completed",
            answer: {
                content: "리뷰 작성 페이지에서 '사진 추가' 버튼을 클릭하시면 이미지를 업로드하실 수 있습니다. 최대 5장까지 가능합니다.",
                createdAt: "2025-04-15T15:25:00"
            }
        },
        {
            id: "7",
            title: "결제 수단 변경",
            content: "주문 후 결제 수단을 변경할 수 있나요?",
            category: "기타",
            createdAt: "2025-04-12T09:30:00",
            campaign: "[별점] 초음파 탁상용 미니 가습기",
            status: "pending"
        },
        {
            id: "8",
            title: "배송지 변경 문의",
            content: "이미 주문한 상품의 배송지를 변경하고 싶습니다.",
            category: "배송",
            createdAt: "2025-04-10T10:45:00",
            campaign: "[별점] 초음파 탁상용 미니 가습기",
            status: "completed",
            answer: {
                content: "안녕하세요. 배송 준비 단계 이전이라면 마이페이지 > 주문내역에서 변경 가능합니다. 이미 배송 중이라면 고객센터로 문의해주세요.",
                createdAt: "2025-04-10T11:30:00"
            }
        },
        {
            id: "9",
            title: "적립금 사용 방법",
            content: "적립금은 어떻게 사용하나요?",
            category: "기타",
            createdAt: "2025-04-05T14:20:00",
            campaign: "[별점] 초음파 탁상용 미니 가습기",
            status: "completed",
            answer: {
                content: "결제 페이지에서 보유 적립금 사용 체크박스를 선택하시면 사용 가능합니다. 최소 1,000원부터 사용 가능합니다.",
                createdAt: "2025-04-05T16:40:00"
            }
        },
        {
            id: "10",
            title: "체험단 선정 기준",
            content: "리뷰체험단은 어떤 기준으로 선정되나요?",
            category: "리뷰체험단",
            createdAt: "2025-04-02T11:15:00",
            campaign: "[별점] 초음파 탁상용 미니 가습기",
            status: "completed",
            answer: {
                content: "리뷰체험단은 이전 리뷰 품질, 구매 이력, 활동성 등을 종합적으로 고려하여 선정됩니다.",
                createdAt: "2025-04-02T14:30:00"
            }
        },
        {
            id: "11",
            title: "상품 재입고 문의",
            content: "품절된 상품은 언제 재입고 되나요?",
            category: "상품",
            createdAt: "2025-03-28T13:40:00",
            campaign: "[별점] 초음파 탁상용 미니 가습기",
            status: "pending"
        },
        {
            id: "12",
            title: "리뷰 삭제 요청",
            content: "작성한 리뷰를 삭제하고 싶습니다.",
            category: "리뷰체험단",
            createdAt: "2025-03-25T10:10:00",
            campaign: "[별점] 초음파 탁상용 미니 가습기",
            status: "completed",
            answer: {
                content: "마이페이지 > 나의 리뷰 메뉴에서 해당 리뷰 삭제가 가능합니다. 단, 리뷰 보상이 지급된 경우 삭제가 제한될 수 있습니다.",
                createdAt: "2025-03-25T11:45:00"
            }
        }
    ]);

    // 새 문의 추가 함수
    const handleAddInquiry = (newInquiry: Omit<Inquiry, "id" | "createdAt" | "status">) => {
        const inquiry: Inquiry = {
            ...newInquiry,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            status: "pending"
        };

        setInquiries([inquiry, ...inquiries]);
        setActiveTab("history"); // 문의 제출 후 문의 내역 탭으로 이동
    };

    // 문의 상세 보기 함수
    const handleViewDetail = (id: string) => {
        setSelectedInquiryId(id);
        setViewState("detail");
    };

    // 목록으로 돌아가기 함수
    const handleBackToList = () => {
        setViewState("list");
        setSelectedInquiryId(null);
    };

    // 선택된 문의 조회
    const selectedInquiry = inquiries.find(inquiry => inquiry.id === selectedInquiryId);

    const getTabClasses = (tab: TabState) => {
        const baseClasses = "px-6 py-3 text-center font-medium text-sm rounded-t-lg focus:outline-none transition-all duration-200";

        // 선택된 탭 강조: 색상을 조금 더 짙게 조정
        const selectedClasses = tab === activeTab
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            : "bg-gray-100 text-indigo-600 hover:text-indigo-800 hover:bg-gray-100 border-t-2 border-transparent";

        return `${baseClasses} ${selectedClasses}`;
    };


    return (
        <div className="w-full">
            {/* 중첩 탭 네비게이션 - 항상 표시 */}
            <div className="flex">
                <button
                    className={getTabClasses("new")}
                    onClick={() => {
                        setActiveTab("new");
                        if (viewState === "detail") {
                            setViewState("list");
                        }
                    }}
                >
                    문의 접수
                </button>
                <button
                    className={getTabClasses("history")}
                    onClick={() => {
                        setActiveTab("history");
                        if (viewState === "detail") {
                            setViewState("list");
                        }
                    }}
                >
                    나의 문의 내역
                </button>
                <div className="flex-grow"></div>
            </div>

            {viewState === "list" ? (
                <div>
                    {/* 컨텐츠 영역 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        {activeTab === "history" ? (
                            <InquiryList inquiries={inquiries} onViewDetail={handleViewDetail}/>
                        ) : (
                            <InquiryForm onSubmit={handleAddInquiry} />
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <div className="">
                        {selectedInquiry && (
                            <InquiryDetail
                                inquiry={selectedInquiry}
                                onBack={handleBackToList}
                                onNewInquiry={() => {
                                    setActiveTab("new");      // 문의 접수 탭으로
                                    setViewState("list");     // 상세 보기 종료
                                    setSelectedInquiryId(null);
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}