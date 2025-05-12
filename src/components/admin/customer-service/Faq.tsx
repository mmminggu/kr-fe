'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
    Search,
    Filter,
    Plus,
    ChevronDown,
    Calendar,
    AlertCircle,
    FileDown,
    Eye,
    Edit,
    Trash,
    Check,
    ChevronsUpDown,
    GripVertical
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

// FAQ 항목 타입 정의
interface FaqItem {
    id: number;
    question: string;
    answer: string;
    category: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    sortOrder: number;
}

// 임시 FAQ 데이터
const DUMMY_FAQS: FaqItem[] = [
    {
        id: 1,
        question: "리뷰어 등급은 어떻게 올릴 수 있나요?",
        answer: "리뷰어 등급은 작성한 리뷰의 품질과 수량, 그리고 지속적인 활동에 따라 자동으로 조정됩니다. 상세한 리뷰와 사진이 포함된 리뷰를 작성할수록 등급 상승에 유리합니다. 또한, 다른 사용자들의 '도움이 됐어요' 평가도 중요한 요소입니다.",
        category: "리뷰작성",
        isPublished: true,
        createdAt: "2024-01-15",
        updatedAt: "2024-02-10",
        sortOrder: 10
    },
    {
        id: 2,
        question: "포인트는 어떻게 사용할 수 있나요?",
        answer: "포인트는 리뷰체험단 내에서 프리미엄 상품 신청 시 우선권으로 사용하거나, 제휴된 온라인 쇼핑몰에서 현금처럼 사용할 수 있습니다. 포인트 사용 가능한 제휴 쇼핑몰 목록은 마이페이지 > 포인트 메뉴에서 확인 가능합니다.",
        category: "포인트",
        isPublished: true,
        createdAt: "2024-01-20",
        updatedAt: "2024-01-20",
        sortOrder: 20
    },
    {
        id: 3,
        question: "회원 탈퇴 후 재가입이 가능한가요?",
        answer: "회원 탈퇴 후 30일이 지나면 재가입이 가능합니다. 단, 이전 계정의 활동 내역과 포인트는 복구되지 않으며, 새로운 회원으로 활동하게 됩니다. 탈퇴 전 보유 포인트를 모두 사용하시는 것이 좋습니다.",
        category: "가입/탈퇴",
        isPublished: true,
        createdAt: "2024-01-25",
        updatedAt: "2024-01-25",
        sortOrder: 30
    },
    {
        id: 4,
        question: "리뷰 작성 기한은 어떻게 되나요?",
        answer: "상품 수령 후 10일 이내에 리뷰를 작성해야 합니다. 기한 내 리뷰를 작성하지 않을 경우, 서비스 이용에 제한이 있을 수 있으니 주의해 주세요. 특별한 사유로 기한 연장이 필요한 경우 고객센터로 문의해 주시기 바랍니다.",
        category: "리뷰작성",
        isPublished: true,
        createdAt: "2024-01-30",
        updatedAt: "2024-03-05",
        sortOrder: 40
    },
    {
        id: 5,
        question: "상품 신청은 어떻게 하나요?",
        answer: "상품 신청은 메인 페이지 또는 상품 카테고리 페이지에서 원하는 상품을 선택한 후 '체험 신청' 버튼을 클릭하여 진행할 수 있습니다. 리뷰어 등급에 따라 신청 가능한 상품이 다를 수 있으며, 신청 후 선정 여부는 마이페이지에서 확인 가능합니다.",
        category: "상품신청",
        isPublished: true,
        createdAt: "2024-02-05",
        updatedAt: "2024-02-05",
        sortOrder: 50
    },
    {
        id: 6,
        question: "포인트는 어떻게 적립되나요?",
        answer: "포인트는 리뷰 작성 완료, 이벤트 참여, 출석 체크 등 다양한 활동을 통해 적립됩니다. 특히, 리뷰 작성 시 리뷰 품질에 따라 차등 지급되며, 다른 사용자들의 '도움이 됐어요' 평가를 많이 받을수록 추가 포인트가 적립됩니다.",
        category: "포인트",
        isPublished: false,
        createdAt: "2024-02-10",
        updatedAt: "2024-02-10",
        sortOrder: 60
    },
    {
        id: 7,
        question: "리뷰가 반려되는 경우는 어떤 경우인가요?",
        answer: "상품과 무관한 내용, 단순 감상만 작성된 경우, 부적절한 언어 사용, 광고성 내용 포함, 타인의 리뷰를 복사한 경우 등에 리뷰가 반려될 수 있습니다. 반려된 리뷰는 수정 후 재제출이 가능하며, 반려 사유는 마이페이지에서 확인 가능합니다.",
        category: "리뷰작성",
        isPublished: true,
        createdAt: "2024-02-15",
        updatedAt: "2024-03-20",
        sortOrder: 70
    },
    {
        id: 8,
        question: "비밀번호를 분실했어요. 어떻게 해야 하나요?",
        answer: "로그인 페이지에서 '비밀번호 찾기'를 클릭하여 가입 시 등록한 이메일로 인증 링크를 받을 수 있습니다. 이메일 접근이 불가능한 경우, 고객센터로 문의해 주시기 바랍니다. 본인 확인 후 비밀번호 재설정을 도와드립니다.",
        category: "가입/탈퇴",
        isPublished: false,
        createdAt: "2024-02-20",
        updatedAt: "2024-02-20",
        sortOrder: 80
    },
    {
        id: 9,
        question: "체험단 선정 기준은 무엇인가요?",
        answer: "체험단 선정은 리뷰어 등급, 이전 리뷰 품질, 활동 빈도, 특정 카테고리 전문성 등을 종합적으로 고려하여 이루어집니다. 상품별로 브랜드가 원하는 타겟층과 리뷰 방향성에 따라 선정 기준이 달라질 수 있습니다.",
        category: "상품신청",
        isPublished: true,
        createdAt: "2024-02-25",
        updatedAt: "2024-02-25",
        sortOrder: 90
    },
    {
        id: 10,
        question: "상품 수령 후 불량/파손이 발견된 경우 어떻게 해야 하나요?",
        answer: "상품 수령 후 24시간 이내에 불량/파손 사항을 사진과 함께 고객센터로 신고해 주시기 바랍니다. 확인 후 브랜드사와 협의하여 교환 또는 대체 상품 발송을 진행해 드립니다. 리뷰 작성 기한은 대체 상품 수령일로부터 재산정됩니다.",
        category: "서비스이용",
        isPublished: true,
        createdAt: "2024-03-01",
        updatedAt: "2024-03-01",
        sortOrder: 100
    }
];

// 카테고리 배지 스타일
const categoryStyles = {
    "가입/탈퇴": 'bg-blue-100 text-blue-800',
    "리뷰작성": 'bg-green-100 text-green-800',
    "포인트": 'bg-purple-100 text-purple-800',
    "상품신청": 'bg-yellow-100 text-yellow-800',
    "서비스이용": 'bg-orange-100 text-orange-800',
};

// 정렬 옵션
const sortOptions = [
    { id: 'sortOrder', name: '정렬 순서' },
    { id: 'newest', name: '최신 등록순' },
    { id: 'updated', name: '최근 수정순' },
    { id: 'category', name: '카테고리순' },
];

export default function FaqAdminPage() {
    const [loading, setLoading] = useState(false);
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [filteredFaqs, setFilteredFaqs] = useState<FaqItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // 필터 및 검색 상태
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<Category>("전체");
    const [publishedFilter, setPublishedFilter] = useState('all'); // 'all', 'published', 'unpublished'
    const [sortBy, setSortBy] = useState('sortOrder');

    // 모달 상태
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null);
    const [newFaq, setNewFaq] = useState({
        question: '',
        answer: '',
        category: '가입/탈퇴',
        isPublished: true,
        sortOrder: 10
    });

    // 데이터 로딩
    useEffect(() => {
        setLoading(true);
        // API 호출 시뮬레이션
        const timer = setTimeout(() => {
            setFaqs(DUMMY_FAQS);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // 필터링 및 정렬 적용
    useEffect(() => {
        let result = [...faqs];

        // 카테고리 필터링
        if (categoryFilter !== "전체") {
            result = result.filter(faq => faq.category === categoryFilter);
        }

        // 공개 상태 필터링
        if (publishedFilter === 'published') {
            result = result.filter(faq => faq.isPublished);
        } else if (publishedFilter === 'unpublished') {
            result = result.filter(faq => !faq.isPublished);
        }

        // 검색어 필터링
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(faq =>
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query)
            );
        }

        // 정렬
        result.sort((a, b) => {
            switch (sortBy) {
                case 'sortOrder':
                    return a.sortOrder - b.sortOrder;
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'updated':
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });

        setFilteredFaqs(result);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋
    }, [faqs, categoryFilter, publishedFilter, searchQuery, sortBy]);

    // 현재 페이지 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFaqs = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);

    // FAQ 생성 모달 열기
    const openCreateModal = () => {
        // 기본 정렬 순서는 현재 가장 큰 값 + 10으로 설정
        const defaultSortOrder = faqs.length > 0
            ? Math.max(...faqs.map(faq => faq.sortOrder)) + 10
            : 10;

        setNewFaq({
            question: '',
            answer: '',
            category: '가입/탈퇴',
            isPublished: true,
            sortOrder: defaultSortOrder
        });
        setIsCreateModalOpen(true);
    };

    // FAQ 수정 모달 열기
    const openEditModal = (faq: FaqItem) => {
        setSelectedFaq(faq);
        setIsEditModalOpen(true);
    };

    // FAQ 삭제 다이얼로그 열기
    const openDeleteDialog = (faq: FaqItem) => {
        setSelectedFaq(faq);
        setIsDeleteDialogOpen(true);
    };

    // FAQ 생성 처리
    const handleCreateFaq = () => {
        if (!newFaq.question || !newFaq.answer) {
            alert('질문과 답변을 모두 입력해주세요.');
            return;
        }

        // 새 FAQ 객체 생성
        const newFaqItem: FaqItem = {
            id: faqs.length > 0 ? Math.max(...faqs.map(faq => faq.id)) + 1 : 1,
            question: newFaq.question,
            answer: newFaq.answer,
            category: newFaq.category,
            isPublished: newFaq.isPublished,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            sortOrder: newFaq.sortOrder
        };

        // FAQ 배열에 추가
        setFaqs([...faqs, newFaqItem]);
        setIsCreateModalOpen(false);

        // 성공 메시지
        alert('FAQ가 성공적으로 등록되었습니다.');
    };

    // FAQ 수정 처리
    const handleUpdateFaq = () => {
        if (!selectedFaq) return;

        if (!selectedFaq.question || !selectedFaq.answer) {
            alert('질문과 답변을 모두 입력해주세요.');
            return;
        }

        // FAQ 배열 업데이트
        const updatedFaqs = faqs.map(faq =>
            faq.id === selectedFaq.id
                ? {
                    ...selectedFaq,
                    updatedAt: new Date().toISOString().split('T')[0]
                }
                : faq
        );

        setFaqs(updatedFaqs);
        setIsEditModalOpen(false);

        // 성공 메시지
        alert('FAQ가 성공적으로 수정되었습니다.');
    };

    // FAQ 삭제 처리
    const handleDeleteFaq = () => {
        if (!selectedFaq) return;

        // FAQ 배열에서 삭제
        const updatedFaqs = faqs.filter(faq => faq.id !== selectedFaq.id);
        setFaqs(updatedFaqs);
        setIsDeleteDialogOpen(false);

        // 성공 메시지
        alert('FAQ가 성공적으로 삭제되었습니다.');
    };

    // 공개 상태 토글
    const togglePublish = (faq: FaqItem) => {
        const updatedFaqs = faqs.map(item =>
            item.id === faq.id
                ? {
                    ...item,
                    isPublished: !item.isPublished,
                    updatedAt: new Date().toISOString().split('T')[0]
                }
                : item
        );

        setFaqs(updatedFaqs);
    };

    // 카테고리별 FAQ 개수
    const getCategoryCounts = () => {
        const counts = {
            "전체": faqs.length,
        };

        CATEGORIES.slice(1).forEach(category => {
            counts[category] = faqs.filter(faq => faq.category === category).length;
        });

        return counts;
    };

    const categoryCounts = getCategoryCounts();

    // 날짜 포맷 함수
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    // 엑셀 다운로드 함수
    const handleExcelDownload = () => {
        alert('FAQ 목록 엑셀 다운로드');
        // 실제 구현 시 API 호출 필요
    };

    // 로딩 중 UI
    if (loading) {
        return (
            <div className="w-full py-12 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <p className="mt-4 text-gray-600">FAQ 목록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    FAQ 관리
                </h1>
                <div className="mt-4 sm:mt-0 flex gap-2">
                    <Button
                        onClick={openCreateModal}
                        className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600"
                    >
                        <Plus size={16} className="mr-2" />
                        FAQ 등록
                    </Button>
                </div>
            </div>

            {/* 카테고리 필터 탭 */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                            categoryFilter === category
                                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setCategoryFilter(category)}
                    >
                        {category} ({categoryCounts[category] || 0})
                    </button>
                ))}
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
                            placeholder="질문 또는 답변 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* 공개 상태 필터 */}
                <div className="relative w-full md:w-48">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Eye size={18} className="text-gray-400" />
                    </div>
                    <select
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 appearance-none"
                        value={publishedFilter}
                        onChange={(e) => setPublishedFilter(e.target.value)}
                    >
                        <option value="all">모든 상태</option>
                        <option value="published">공개</option>
                        <option value="unpublished">비공개</option>
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

            {/* FAQ 목록 테이블 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* 테이블 헤더 */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-3">정렬순서</th>
                            <th className="px-6 py-3">질문</th>
                            <th className="px-6 py-3">카테고리</th>
                            <th className="px-6 py-3">공개여부</th>
                            <th className="px-6 py-3">등록일</th>
                            <th className="px-6 py-3">수정일</th>
                            <th className="px-6 py-3">관리</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {currentFaqs.length > 0 ? (
                            currentFaqs.map((faq) => (
                                <tr key={faq.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-gray-900 font-medium text-center">
                                            {faq.sortOrder}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                            {faq.question}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                            {faq.answer}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className={categoryStyles[faq.category]}>
                                            {faq.category}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="relative inline-block w-12 align-middle select-none">
                                            <input
                                                type="checkbox"
                                                id={`toggle-${faq.id}`}
                                                className="sr-only"
                                                checked={faq.isPublished}
                                                onChange={() => togglePublish(faq)}
                                            />
                                            <label
                                                htmlFor={`toggle-${faq.id}`}
                                                className={`block h-6 rounded-full cursor-pointer transition-colors ${
                                                    faq.isPublished ? 'bg-indigo-500' : 'bg-gray-300'
                                                }`}
                                            >
                          <span
                              className={`block h-6 w-6 rounded-full bg-white border border-gray-300 transform transition-transform ${
                                  faq.isPublished ? 'translate-x-6' : 'translate-x-0'
                              }`}
                          ></span>
                                            </label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-700">
                                            <Calendar size={14} className="mr-1 text-gray-500" />
                                            <span>{formatDate(faq.createdAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-700">
                                            <Calendar size={14} className="mr-1 text-gray-500" />
                                            <span>{formatDate(faq.updatedAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openEditModal(faq)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteDialog(faq)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <AlertCircle size={32} className="text-gray-400 mb-4" />
                                        <p className="text-gray-500 text-lg font-medium">
                                            FAQ가 없습니다
                                        </p>
                                        <p className="text-gray-500 mt-1">
                                            {searchQuery
                                                ? '검색 조건에 맞는 FAQ가 없습니다. 다른 검색어를 입력해보세요.'
                                                : categoryFilter !== "전체" || publishedFilter !== 'all'
                                                    ? '해당 조건의 FAQ가 없습니다. 다른 필터를 선택해보세요.'
                                                    : '새 FAQ를 등록해보세요.'}
                                        </p>
                                        {(!searchQuery && categoryFilter === "전체" && publishedFilter === 'all') && (
                                            <Button
                                                onClick={openCreateModal}
                                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <Plus size={16} className="mr-2" />
                                                FAQ 등록
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                {filteredFaqs.length > itemsPerPage && (
                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">{indexOfFirstItem + 1}</span>
                                    -
                                    <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredFaqs.length)}
                  </span>
                                    {' / '}
                                    <span className="font-medium">{filteredFaqs.length}</span> 개
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

            {/* FAQ 생성 모달 */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>FAQ 등록</DialogTitle>
                        <DialogDescription>
                            자주 묻는 질문과 답변을 등록해주세요.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="new-faq-category" className="text-right">
                                카테고리
                            </Label>
                            <Select
                                value={newFaq.category}
                                onValueChange={(value) => setNewFaq({...newFaq, category: value})}
                            >
                                <SelectTrigger id="new-faq-category" className="col-span-3">
                                    <SelectValue placeholder="카테고리 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.slice(1).map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="new-faq-question" className="text-right pt-2">
                                질문 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="new-faq-question"
                                placeholder="자주 묻는 질문을 입력하세요"
                                value={newFaq.question}
                                onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="new-faq-answer" className="text-right pt-2">
                                답변 <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="new-faq-answer"
                                placeholder="질문에 대한 답변을 입력하세요"
                                value={newFaq.answer}
                                onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                                className="col-span-3 h-40"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="new-faq-sortOrder" className="text-right">
                                정렬 순서
                            </Label>
                            <Input
                                id="new-faq-sortOrder"
                                type="number"
                                placeholder="정렬 순서 (숫자가 작을수록 먼저 표시됨)"
                                value={newFaq.sortOrder}
                                onChange={(e) => setNewFaq({...newFaq, sortOrder: parseInt(e.target.value) || 0})}
                                className="col-span-3"
                            />
                            <div className="col-span-3 col-start-2 text-xs text-gray-500">
                                * 숫자가 작을수록 목록에서 먼저 표시됩니다. 기본값: 10단위
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="new-faq-isPublished" className="text-right">
                                공개 설정
                            </Label>
                            <div className="flex items-center col-span-3">
                                <input
                                    type="checkbox"
                                    id="new-faq-isPublished"
                                    checked={newFaq.isPublished}
                                    onChange={(e) => setNewFaq({...newFaq, isPublished: e.target.checked})}
                                    className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                                />
                                <Label htmlFor="new-faq-isPublished" className="text-sm">
                                    이 FAQ를 즉시 공개합니다
                                </Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
                        <div className="text-sm text-gray-500">
                            <span className="text-red-500">*</span> 표시는 필수 입력 항목입니다
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                취소
                            </Button>
                            <Button onClick={handleCreateFaq}>등록</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* FAQ 수정 모달 */}
            {selectedFaq && (
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>FAQ 수정</DialogTitle>
                            <DialogDescription>
                                FAQ ID: {selectedFaq.id}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-faq-category" className="text-right">
                                    카테고리
                                </Label>
                                <Select
                                    value={selectedFaq.category}
                                    onValueChange={(value) => setSelectedFaq({...selectedFaq, category: value})}
                                >
                                    <SelectTrigger id="edit-faq-category" className="col-span-3">
                                        <SelectValue placeholder="카테고리 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.slice(1).map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="edit-faq-question" className="text-right pt-2">
                                    질문 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-faq-question"
                                    value={selectedFaq.question}
                                    onChange={(e) => setSelectedFaq({...selectedFaq, question: e.target.value})}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="edit-faq-answer" className="text-right pt-2">
                                    답변 <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="edit-faq-answer"
                                    value={selectedFaq.answer}
                                    onChange={(e) => setSelectedFaq({...selectedFaq, answer: e.target.value})}
                                    className="col-span-3 h-40"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-faq-sortOrder" className="text-right">
                                    정렬 순서
                                </Label>
                                <Input
                                    id="edit-faq-sortOrder"
                                    type="number"
                                    value={selectedFaq.sortOrder}
                                    onChange={(e) => setSelectedFaq({...selectedFaq, sortOrder: parseInt(e.target.value) || 0})}
                                    className="col-span-3"
                                />
                                <div className="col-span-3 col-start-2 text-xs text-gray-500">
                                    * 숫자가 작을수록 목록에서 먼저 표시됩니다.
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-faq-isPublished" className="text-right">
                                    공개 설정
                                </Label>
                                <div className="flex items-center col-span-3">
                                    <input
                                        type="checkbox"
                                        id="edit-faq-isPublished"
                                        checked={selectedFaq.isPublished}
                                        onChange={(e) => setSelectedFaq({...selectedFaq, isPublished: e.target.checked})}
                                        className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                                    />
                                    <Label htmlFor="edit-faq-isPublished" className="text-sm">
                                        이 FAQ를 공개합니다
                                    </Label>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">등록일</Label>
                                <div className="col-span-3 text-sm text-gray-700">
                                    {formatDate(selectedFaq.createdAt)}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">최종 수정일</Label>
                                <div className="col-span-3 text-sm text-gray-700">
                                    {formatDate(selectedFaq.updatedAt)}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                취소
                            </Button>
                            <Button onClick={handleUpdateFaq}>저장</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* FAQ 삭제 확인 다이얼로그 */}
            {selectedFaq && (
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>FAQ 삭제</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-center text-gray-700">
                                다음 FAQ를 정말 삭제하시겠습니까?
                            </p>
                            <p className="text-center font-medium mt-2 px-4 py-2 bg-gray-50 rounded-md">
                                "{selectedFaq.question}"
                            </p>
                            <p className="text-center text-gray-500 text-sm mt-4">
                                이 작업은 되돌릴 수 없습니다.
                            </p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                취소
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteFaq}>
                                삭제
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}