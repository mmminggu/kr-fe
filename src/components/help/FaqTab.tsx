"use client";

import {useState} from "react";
import {ChevronDown, Search, Filter} from "lucide-react";
import {Button} from "@/src/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion"

// FAQ 항목 타입 정의
interface FaqItem {
    id: number;
    question: string;
    answer: string;
    category: string;
}

// FAQ 카테고리 정의
const CATEGORIES = [
    "전체",
    "가입/탈퇴",
    "리뷰작성",
    "포인트",
    "상품신청",
    "서비스이용",
] as const;

type Category = typeof CATEGORIES[number];

// 임시 FAQ 데이터
const DUMMY_FAQS: FaqItem[] = [
    {
        id: 1,
        question: "리뷰어 등급은 어떻게 올릴 수 있나요?",
        answer: "리뷰어 등급은 작성한 리뷰의 품질과 수량, 그리고 지속적인 활동에 따라 자동으로 조정됩니다. 상세한 리뷰와 사진이 포함된 리뷰를 작성할수록 등급 상승에 유리합니다. 또한, 다른 사용자들의 '도움이 됐어요' 평가도 중요한 요소입니다.",
        category: "리뷰작성"
    },
    {
        id: 2,
        question: "포인트는 어떻게 사용할 수 있나요?",
        answer: "포인트는 리뷰체험단 내에서 프리미엄 상품 신청 시 우선권으로 사용하거나, 제휴된 온라인 쇼핑몰에서 현금처럼 사용할 수 있습니다. 포인트 사용 가능한 제휴 쇼핑몰 목록은 마이페이지 > 포인트 메뉴에서 확인 가능합니다.",
        category: "포인트"
    },
    {
        id: 3,
        question: "회원 탈퇴 후 재가입이 가능한가요?",
        answer: "회원 탈퇴 후 30일이 지나면 재가입이 가능합니다. 단, 이전 계정의 활동 내역과 포인트는 복구되지 않으며, 새로운 회원으로 활동하게 됩니다. 탈퇴 전 보유 포인트를 모두 사용하시는 것이 좋습니다.",
        category: "가입/탈퇴"
    },
    {
        id: 4,
        question: "리뷰 작성 기한은 어떻게 되나요?",
        answer: "상품 수령 후 10일 이내에 리뷰를 작성해야 합니다. 기한 내 리뷰를 작성하지 않을 경우, 서비스 이용에 제한이 있을 수 있으니 주의해 주세요. 특별한 사유로 기한 연장이 필요한 경우 고객센터로 문의해 주시기 바랍니다.",
        category: "리뷰작성"
    },
    {
        id: 5,
        question: "상품 신청은 어떻게 하나요?",
        answer: "상품 신청은 메인 페이지 또는 상품 카테고리 페이지에서 원하는 상품을 선택한 후 '체험 신청' 버튼을 클릭하여 진행할 수 있습니다. 리뷰어 등급에 따라 신청 가능한 상품이 다를 수 있으며, 신청 후 선정 여부는 마이페이지에서 확인 가능합니다.",
        category: "상품신청"
    },
    {
        id: 6,
        question: "포인트는 어떻게 적립되나요?",
        answer: "포인트는 리뷰 작성 완료, 이벤트 참여, 출석 체크 등 다양한 활동을 통해 적립됩니다. 특히, 리뷰 작성 시 리뷰 품질에 따라 차등 지급되며, 다른 사용자들의 '도움이 됐어요' 평가를 많이 받을수록 추가 포인트가 적립됩니다.",
        category: "포인트"
    },
    {
        id: 7,
        question: "리뷰가 반려되는 경우는 어떤 경우인가요?",
        answer: "상품과 무관한 내용, 단순 감상만 작성된 경우, 부적절한 언어 사용, 광고성 내용 포함, 타인의 리뷰를 복사한 경우 등에 리뷰가 반려될 수 있습니다. 반려된 리뷰는 수정 후 재제출이 가능하며, 반려 사유는 마이페이지에서 확인 가능합니다.",
        category: "리뷰작성"
    },
    {
        id: 8,
        question: "비밀번호를 분실했어요. 어떻게 해야 하나요?",
        answer: "로그인 페이지에서 '비밀번호 찾기'를 클릭하여 가입 시 등록한 이메일로 인증 링크를 받을 수 있습니다. 이메일 접근이 불가능한 경우, 고객센터로 문의해 주시기 바랍니다. 본인 확인 후 비밀번호 재설정을 도와드립니다.",
        category: "가입/탈퇴"
    },
    {
        id: 9,
        question: "체험단 선정 기준은 무엇인가요?",
        answer: "체험단 선정은 리뷰어 등급, 이전 리뷰 품질, 활동 빈도, 특정 카테고리 전문성 등을 종합적으로 고려하여 이루어집니다. 상품별로 브랜드가 원하는 타겟층과 리뷰 방향성에 따라 선정 기준이 달라질 수 있습니다.",
        category: "상품신청"
    },
    {
        id: 10,
        question: "상품 수령 후 불량/파손이 발견된 경우 어떻게 해야 하나요?",
        answer: "상품 수령 후 24시간 이내에 불량/파손 사항을 사진과 함께 고객센터로 신고해 주시기 바랍니다. 확인 후 브랜드사와 협의하여 교환 또는 대체 상품 발송을 진행해 드립니다. 리뷰 작성 기한은 대체 상품 수령일로부터 재산정됩니다.",
        category: "서비스이용"
    }
];

interface FaqTabProps {
    moveToInquiry: () => void; // 1:1 문의 탭으로 이동하는 함수
}

export default function FaqTab({ moveToInquiry }: FaqTabProps) {
    const [activeItem, setActiveItem] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<Category>("전체");

    // 검색 및 카테고리 필터링된 FAQ 목록
    const filteredFaqs = DUMMY_FAQS.filter(faq => {
        // 카테고리 필터링
        if (selectedCategory !== "전체" && faq.category !== selectedCategory) {
            return false;
        }

        // 검색어 필터링
        if (searchQuery.trim() !== "") {
            return faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        }

        return true;
    });

    // 아코디언 토글 핸들러
    const toggleItem = (id: number) => {
        setActiveItem(activeItem === id ? null : id);
    };

    // 검색어 변경 핸들러
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // 카테고리 변경 핸들러
    const handleCategoryChange = (category: Category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="space-y-6">
            {/* 검색 및 필터 영역 */}
            <div className="space-y-4">
                {/* 검색 입력 */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="질문 또는 답변 검색"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full p-3 pl-10 border text-sm border-gray-200 rounded-lg bg-gray-50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400"/>
                </div>

                {/* 카테고리 필터 */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`px-4 py-2 text-sm rounded-full transition-colors ${
                                selectedCategory === category
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* FAQ 아코디언 목록 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                        <div key={faq.id} className="bg-white">
                            {/* 질문 */}
                            <button
                                onClick={() => toggleItem(faq.id)}
                                className="w-full flex justify-between items-center p-4 text-left hover:bg-indigo-50 transition-colors focus:outline-none"
                            >
                                <div className="flex items-center">
                                    <span
                                        className="inline-block w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs flex items-center justify-center mr-3">
                                        Q
                                    </span>
                                                <span className="text-gray-800 font-medium">
                                        {faq.question}
                                    </span>
                                </div>
                                <ChevronDown
                                    className={`h-5 w-5 text-gray-400 transition-transform ${
                                        activeItem === faq.id ? 'transform rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {/* 답변 */}
                            {activeItem === faq.id && (
                                <div className="pl-8 pr-4 pb-4 pt-4 bg-gray-50">
                                    <div className="text-sm text-gray-600 leading-relaxed">
                                        <span className="text-purple-600 font-medium mr-2">A.</span>
                                        {faq.answer}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>


            {/* 더 많은 질문 메시지 */}
            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-gray-600 mb-2">원하는 답변을 찾지 못하셨나요?</p>
                <Button
                    onClick={moveToInquiry}
                    variant="default"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                    1:1 문의하기
                </Button>
            </div>
        </div>
    );
}