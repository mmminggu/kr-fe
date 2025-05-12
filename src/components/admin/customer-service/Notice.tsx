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
    PinIcon,
    Check,
    Bell
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

// 공지사항 타입 정의
interface Notice {
    id: number;
    title: string;
    content: string;
    date: string;
    views: number;
    isImportant: boolean;
    isPublished: boolean;
    sortOrder: number;
}

// 임시 공지사항 데이터
const DUMMY_NOTICES: Notice[] = [
    {
        id: 1,
        title: "[중요] 리뷰체험단 서비스 이용약관 변경 안내",
        content: "안녕하세요. 리뷰체험단 서비스 이용약관이 변경되었습니다. 주요 변경사항은 다음과 같습니다...\n\n1. 리뷰 작성 기한 변경: 기존 7일에서 10일로 연장\n2. 리뷰 품질 평가 기준 강화: 더 상세한 리뷰 작성 가이드라인 추가\n3. 개인정보 처리방침 관련 조항 업데이트\n\n변경된 이용약관은 2025년 5월 1일부터 적용됩니다. 서비스를 계속 이용하시는 경우 변경된 약관에 동의하시는 것으로 간주됩니다. 자세한 내용은 이용약관 페이지를 참고해 주세요.",
        date: "2025-04-25",
        views: 1250,
        isImportant: true,
        isPublished: true,
        sortOrder: 10
    },
    {
        id: 2,
        title: "리뷰체험단 서비스 개선 안내",
        content: "더 나은 서비스 제공을 위해 다음과 같은 개선사항이 적용되었습니다...\n\n- 리뷰어 등급 시스템 개편\n- 모바일 앱 UI/UX 개선\n- 포인트 적립 시스템 변경\n- 상품 카테고리 세분화\n\n회원님들의 소중한 피드백을 바탕으로 계속해서 서비스를 발전시켜 나가겠습니다.",
        date: "2025-04-20",
        views: 823,
        isImportant: false,
        isPublished: true,
        sortOrder: 20
    },
    {
        id: 3,
        title: "5월 황금연휴 고객센터 운영 안내",
        content: "5월 황금연휴 기간 동안 고객센터 운영시간이 다음과 같이 변경됩니다...\n\n[운영 시간 변경 안내]\n- 5월 1일(목): 정상 운영 (09:00-18:00)\n- 5월 2일(금) ~ 5월 5일(월): 운영 중단\n- 5월 6일(화): 정상 운영 재개\n\n긴급 문의는 이메일 (help@reviewservice.co.kr)로 보내주시면 연휴 이후 순차적으로 답변 드리겠습니다.",
        date: "2025-04-18",
        views: 756,
        isImportant: false,
        isPublished: true,
        sortOrder: 30
    },
    {
        id: 4,
        title: "리뷰어시스템 개편 안내",
        content: "더 공정하고 합리적인 리뷰어 시스템으로 개편되었습니다...\n\n[주요 변경사항]\n1. 리뷰어 등급 세분화 (5단계 → 7단계)\n2. 활동 점수 산정 방식 개선\n3. 신규 혜택 추가\n\n기존 리뷰어 등급은 자동으로 새 등급으로 전환되며, 마이페이지에서 확인하실 수 있습니다.",
        date: "2025-04-15",
        views: 1102,
        isImportant: false,
        isPublished: true,
        sortOrder: 40
    },
    {
        id: 5,
        title: "[중요] 개인정보 처리방침 개정 안내",
        content: "개인정보 처리방침이 일부 개정되었습니다. 주요 변경사항은 다음과 같습니다...\n\n[개정 주요 내용]\n- 개인정보 보호 강화를 위한 보안 시스템 업데이트\n- 개인정보 보관 기간 명확화\n- 제3자 정보제공 관련 조항 구체화\n- 회원 탈퇴 시 데이터 처리 과정 상세화\n\n개정된 개인정보 처리방침은 2025년 5월 10일부터 적용됩니다.",
        date: "2025-04-10",
        views: 986,
        isImportant: true,
        isPublished: true,
        sortOrder: 50
    },
    {
        id: 6,
        title: "서비스 점검 안내 (5/15)",
        content: "시스템 안정화를 위한 정기 점검이 진행될 예정입니다.\n\n[점검 일정]\n- 일시: 2025년 5월 15일 (수) 02:00 ~ 06:00 (4시간)\n- 영향: 해당 시간 동안 서비스 이용 불가\n\n점검 중에는 웹사이트 및 모바일 앱 접속이 원활하지 않을 수 있으니 양해 부탁드립니다. 보다 안정적인 서비스 제공을 위한 작업이오니 많은 이해 부탁드립니다.",
        date: "2025-04-08",
        views: 543,
        isImportant: false,
        isPublished: false,
        sortOrder: 60
    },
    {
        id: 7,
        title: "신규 브랜드 파트너십 안내",
        content: "새로운 브랜드 파트너십이 시작되었습니다.\n\n[신규 파트너 브랜드]\n- 프리미엄 뷰티 브랜드 'Luminique'\n- 홈케어 전문 브랜드 'HomePlus Care'\n- 헬스케어 브랜드 'VitaLife'\n\n새로운 브랜드의 다양한 제품들을 체험하고 리뷰할 수 있는 기회가 제공될 예정입니다. 많은 관심과 참여 바랍니다.",
        date: "2025-04-05",
        views: 721,
        isImportant: false,
        isPublished: true,
        sortOrder: 70
    },
    {
        id: 8,
        title: "3월 우수 리뷰어 발표",
        content: "3월 우수 리뷰어를 발표합니다.\n\n[우수 리뷰어]\n- 패션 카테고리: 사용자 '패션러버123'\n- 뷰티 카테고리: 사용자 '화장품탐험가'\n- 가전 카테고리: 사용자 '테크가이'\n- 식품 카테고리: 사용자 '맛있는리뷰'\n- 육아 카테고리: 사용자 '슈퍼맘'\n\n선정되신 모든 분들께 축하드립니다. 우수 리뷰어에게는 추가 포인트와 다음 달 체험단 선정 시 우선권이 제공됩니다.",
        date: "2025-04-02",
        views: 892,
        isImportant: false,
        isPublished: true,
        sortOrder: 80
    },
    {
        id: 9,
        title: "새로운 리뷰 작성 가이드라인 안내",
        content: "더 좋은 리뷰 문화를 위한 새로운 가이드라인이 적용됩니다.\n\n[주요 내용]\n1. 객관적인 사용 경험 중심의 리뷰 작성\n2. 과장되거나 허위 정보 포함 금지\n3. 최소 3장 이상의 실제 사용 사진 첨부 권장\n4. 장/단점을 균형있게 서술\n5. 제품 스펙보다 실제 사용감 위주의 내용 작성\n\n새 가이드라인은 5월부터 적용되며, 이에 따라 리뷰 평가 기준도 업데이트됩니다.",
        date: "2025-03-28",
        views: 1057,
        isImportant: false,
        isPublished: false,
        sortOrder: 90
    },
    {
        id: 10,
        title: "[중요] 앱 업데이트 안내 (v2.5.0)",
        content: "새로운 버전의 앱이 출시되었습니다. 원활한 서비스 이용을 위해 업데이트를 진행해 주세요.\n\n[주요 업데이트 내용]\n- 리뷰 작성 인터페이스 개선\n- 알림 시스템 개선\n- 검색 기능 강화\n- 성능 및 안정성 향상\n- 여러 UI/UX 개선사항\n\n업데이트는 앱스토어 또는 플레이스토어에서 진행할 수 있습니다.",
        date: "2025-03-25",
        views: 1345,
        isImportant: true,
        isPublished: true,
        sortOrder: 100
    }
];

// 정렬 옵션
const sortOptions = [
    { id: 'newest', name: '최신 등록순' },
    { id: 'oldest', name: '오래된 등록순' },
];

export default function NoticeAdminPage() {
    const [loading, setLoading] = useState(false);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // 필터 및 검색 상태
    const [searchQuery, setSearchQuery] = useState('');
    const [importantFilter, setImportantFilter] = useState('all'); // 'all', 'important', 'normal'
    const [publishedFilter, setPublishedFilter] = useState('all'); // 'all', 'published', 'unpublished'
    const [sortBy, setSortBy] = useState('newest');

    // 모달 상태
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
    const [newNotice, setNewNotice] = useState({
        title: '',
        content: '',
        isImportant: false,
        isPublished: true,
        sortOrder: 10
    });

    // 데이터 로딩
    useEffect(() => {
        setLoading(true);
        // API 호출 시뮬레이션
        const timer = setTimeout(() => {
            setNotices(DUMMY_NOTICES);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // 필터링 및 정렬 적용
    useEffect(() => {
        let result = [...notices];

        // 중요 공지 필터링
        if (importantFilter === 'important') {
            result = result.filter(notice => notice.isImportant);
        } else if (importantFilter === 'normal') {
            result = result.filter(notice => !notice.isImportant);
        }

        // 공개 상태 필터링
        if (publishedFilter === 'published') {
            result = result.filter(notice => notice.isPublished);
        } else if (publishedFilter === 'unpublished') {
            result = result.filter(notice => !notice.isPublished);
        }

        // 검색어 필터링
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(notice =>
                notice.title.toLowerCase().includes(query) ||
                notice.content.toLowerCase().includes(query)
            );
        }

        // 정렬
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'oldest':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'viewsDesc':
                    return b.views - a.views;
                case 'sortOrder':
                    return a.sortOrder - b.sortOrder;
                default:
                    return 0;
            }
        });

        setFilteredNotices(result);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋
    }, [notices, importantFilter, publishedFilter, searchQuery, sortBy]);

    // 현재 페이지 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNotices = filteredNotices.slice(indexOfFirstItem, indexOfLastItem);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

    // 공지사항 조회 모달 열기
    const openViewModal = (notice: Notice) => {
        setSelectedNotice(notice);
        setIsViewModalOpen(true);
    };

    // 공지사항 생성 모달 열기
    const openCreateModal = () => {
        // 기본 정렬 순서는 현재 가장 큰 값 + 10으로 설정
        const defaultSortOrder = notices.length > 0
            ? Math.max(...notices.map(notice => notice.sortOrder)) + 10
            : 10;

        setNewNotice({
            title: '',
            content: '',
            isImportant: false,
            isPublished: true,
            sortOrder: defaultSortOrder
        });
        setIsCreateModalOpen(true);
    };

    // 공지사항 수정 모달 열기
    const openEditModal = (notice: Notice) => {
        setSelectedNotice(notice);
        setIsEditModalOpen(true);
    };

    // 공지사항 삭제 다이얼로그 열기
    const openDeleteDialog = (notice: Notice) => {
        setSelectedNotice(notice);
        setIsDeleteDialogOpen(true);
    };

    // 공지사항 생성 처리
    const handleCreateNotice = () => {
        if (!newNotice.title || !newNotice.content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        // 새 공지사항 객체 생성
        const newNoticeItem: Notice = {
            id: notices.length > 0 ? Math.max(...notices.map(notice => notice.id)) + 1 : 1,
            title: newNotice.title,
            content: newNotice.content,
            date: new Date().toISOString().split('T')[0],
            views: 0,
            isImportant: newNotice.isImportant,
            isPublished: newNotice.isPublished,
            sortOrder: newNotice.sortOrder
        };

        // 공지사항 배열에 추가
        setNotices([newNoticeItem, ...notices]);
        setIsCreateModalOpen(false);

        // 성공 메시지
        alert('공지사항이 성공적으로 등록되었습니다.');
    };

    // 공지사항 수정 처리
    const handleUpdateNotice = () => {
        if (!selectedNotice) return;

        if (!selectedNotice.title || !selectedNotice.content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        // 공지사항 배열 업데이트
        const updatedNotices = notices.map(notice =>
            notice.id === selectedNotice.id ? selectedNotice : notice
        );

        setNotices(updatedNotices);
        setIsEditModalOpen(false);

        // 성공 메시지
        alert('공지사항이 성공적으로 수정되었습니다.');
    };

    // 공지사항 삭제 처리
    const handleDeleteNotice = () => {
        if (!selectedNotice) return;

        // 공지사항 배열에서 삭제
        const updatedNotices = notices.filter(notice => notice.id !== selectedNotice.id);
        setNotices(updatedNotices);
        setIsDeleteDialogOpen(false);

        // 성공 메시지
        alert('공지사항이 성공적으로 삭제되었습니다.');
    };

    // 중요 공지 토글
    const toggleImportant = (notice: Notice) => {
        const updatedNotices = notices.map(item =>
            item.id === notice.id
                ? { ...item, isImportant: !item.isImportant }
                : item
        );

        setNotices(updatedNotices);
    };

    // 공개 상태 토글
    const togglePublished = (notice: Notice) => {
        const updatedNotices = notices.map(item =>
            item.id === notice.id
                ? { ...item, isPublished: !item.isPublished }
                : item
        );

        setNotices(updatedNotices);
    };

    // 공지사항 상태별 카운트
    const getStatusCounts = () => {
        return {
            all: notices.length,
            important: notices.filter(notice => notice.isImportant).length,
            published: notices.filter(notice => notice.isPublished).length,
            unpublished: notices.filter(notice => !notice.isPublished).length
        };
    };

    const statusCounts = getStatusCounts();

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
        alert('공지사항 목록 엑셀 다운로드');
        // 실제 구현 시 API 호출 필요
    };

    // 로딩 중 UI
    if (loading) {
        return (
            <div className="w-full py-12 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <p className="mt-4 text-gray-600">공지사항 목록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    공지사항 관리
                </h1>
                <div className="mt-4 sm:mt-0 flex gap-2">
                    <Button
                        onClick={openCreateModal}
                        className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600"
                    >
                        <Plus size={16} className="mr-2" />
                        공지사항 등록
                    </Button>
                </div>
            </div>

            {/* 상태 필터 탭 */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200">
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        importantFilter === 'all' && publishedFilter === 'all'
                            ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-indigo-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => {
                        setImportantFilter('all');
                        setPublishedFilter('all');
                    }}
                >
                    전체 ({statusCounts.all})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        importantFilter === 'important'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setImportantFilter('important')}
                >
                    중요 공지 ({statusCounts.important})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        publishedFilter === 'published' && importantFilter === 'all'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => {
                        setPublishedFilter('published');
                        setImportantFilter('all');
                    }}
                >
                    공개 ({statusCounts.published})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        publishedFilter === 'unpublished'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => {
                        setPublishedFilter('unpublished');
                        setImportantFilter('all');
                    }}
                >
                    비공개 ({statusCounts.unpublished})
                </button>
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
                            placeholder="제목 또는 내용 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
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

            {/* 공지사항 목록 테이블 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* 테이블 헤더 */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">제목</th>
                            <th className="px-6 py-3">등록일</th>
                            <th className="px-6 py-3 text-center">중요 표시</th>
                            <th className="px-6 py-3 text-center">공개 상태</th>
                            <th className="px-6 py-3">관리</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {currentNotices.length > 0 ? (
                            currentNotices.map((notice) => (
                                <tr key={notice.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {notice.id}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {notice.isImportant && (
                                                <Badge className="bg-red-100 text-red-800 mr-2">중요</Badge>
                                            )}
                                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                                {notice.title}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                            {notice.content.replace(/\n/g, ' ')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-700">
                                            <Calendar size={14} className="mr-1 text-gray-500" />
                                            <span>{formatDate(notice.date)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => toggleImportant(notice)}
                                            className={`p-1 rounded-full ${
                                                notice.isImportant
                                                    ? 'text-red-500 hover:bg-red-50'
                                                    : 'text-gray-400 hover:bg-gray-50'
                                            }`}
                                        >
                                            <PinIcon size={18} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="relative inline-block w-12 align-middle select-none">
                                            <input
                                                type="checkbox"
                                                id={`toggle-${notice.id}`}
                                                className="sr-only"
                                                checked={notice.isPublished}
                                                onChange={() => togglePublished(notice)}
                                            />
                                            <label
                                                htmlFor={`toggle-${notice.id}`}
                                                className={`block h-6 rounded-full cursor-pointer transition-colors ${
                                                    notice.isPublished ? 'bg-indigo-500' : 'bg-gray-300'
                                                }`}
                                            >
                          <span
                              className={`block h-6 w-6 rounded-full bg-white border border-gray-300 transform transition-transform ${
                                  notice.isPublished ? 'translate-x-6' : 'translate-x-0'
                              }`}
                          ></span>
                                            </label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openViewModal(notice)}
                                                className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-full"
                                                title="공지사항 보기"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(notice)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                                                title="공지사항 수정"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteDialog(notice)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                                                title="공지사항 삭제"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <AlertCircle size={32} className="text-gray-400 mb-4" />
                                        <p className="text-gray-500 text-lg font-medium">
                                            공지사항이 없습니다
                                        </p>
                                        <p className="text-gray-500 mt-1">
                                            {searchQuery
                                                ? '검색 조건에 맞는 공지사항이 없습니다. 다른 검색어를 입력해보세요.'
                                                : importantFilter !== 'all' || publishedFilter !== 'all'
                                                    ? '해당 조건의 공지사항이 없습니다. 다른 필터를 선택해보세요.'
                                                    : '새 공지사항을 등록해보세요.'}
                                        </p>
                                        {(!searchQuery && importantFilter === 'all' && publishedFilter === 'all') && (
                                            <Button
                                                onClick={openCreateModal}
                                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <Plus size={16} className="mr-2" />
                                                공지사항 등록
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
                {filteredNotices.length > itemsPerPage && (
                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">{indexOfFirstItem + 1}</span>
                                    -
                                    <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredNotices.length)}
                  </span>
                                    {' / '}
                                    <span className="font-medium">{filteredNotices.length}</span> 개
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

            {/* 공지사항 생성 모달 */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>공지사항 등록</DialogTitle>
                        <DialogDescription>
                            사용자에게 안내할 공지사항을 작성해주세요.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="new-notice-important"
                                    checked={newNotice.isImportant}
                                    onChange={(e) => setNewNotice({...newNotice, isImportant: e.target.checked})}
                                    className="rounded text-red-600 focus:ring-red-500"
                                />
                                <Label htmlFor="new-notice-important" className="text-sm">
                                    중요 공지로 표시
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="new-notice-published"
                                    checked={newNotice.isPublished}
                                    onChange={(e) => setNewNotice({...newNotice, isPublished: e.target.checked})}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <Label htmlFor="new-notice-published" className="text-sm">
                                    즉시 공개
                                </Label>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="new-notice-title" className="block mb-2">
                                제목 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="new-notice-title"
                                placeholder="공지사항 제목을 입력하세요"
                                value={newNotice.title}
                                onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                                className="w-full"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-notice-content" className="block mb-2">
                                내용 <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="new-notice-content"
                                placeholder="공지사항 내용을 입력하세요"
                                value={newNotice.content}
                                onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                                className="min-h-[200px] w-full"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                줄바꿈은 \n으로 처리됩니다. 내용을 단락으로 구분하려면 빈 줄을 추가하세요.
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="new-notice-sortOrder" className="block mb-2">
                                정렬 순서
                            </Label>
                            <Input
                                id="new-notice-sortOrder"
                                type="number"
                                placeholder="정렬 순서 (숫자가 작을수록 먼저 표시됨)"
                                value={newNotice.sortOrder}
                                onChange={(e) => setNewNotice({...newNotice, sortOrder: parseInt(e.target.value) || 0})}
                                className="w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                숫자가 작을수록 목록에서 먼저 표시됩니다. 기본값: 10단위
                            </p>
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
                            <Button onClick={handleCreateNotice}>등록</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 공지사항 수정 모달 */}
            {selectedNotice && (
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                            <DialogTitle>공지사항 수정</DialogTitle>
                            <DialogDescription>
                                공지사항 ID: {selectedNotice.id}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="edit-notice-important"
                                        checked={selectedNotice.isImportant}
                                        onChange={(e) => setSelectedNotice({...selectedNotice, isImportant: e.target.checked})}
                                        className="rounded text-red-600 focus:ring-red-500"
                                    />
                                    <Label htmlFor="edit-notice-important" className="text-sm">
                                        중요 공지로 표시
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="edit-notice-published"
                                        checked={selectedNotice.isPublished}
                                        onChange={(e) => setSelectedNotice({...selectedNotice, isPublished: e.target.checked})}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label htmlFor="edit-notice-published" className="text-sm">
                                        공개
                                    </Label>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="edit-notice-title" className="block mb-2">
                                    제목 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-notice-title"
                                    value={selectedNotice.title}
                                    onChange={(e) => setSelectedNotice({...selectedNotice, title: e.target.value})}
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-notice-content" className="block mb-2">
                                    내용 <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="edit-notice-content"
                                    value={selectedNotice.content}
                                    onChange={(e) => setSelectedNotice({...selectedNotice, content: e.target.value})}
                                    className="min-h-[200px] w-full"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    줄바꿈은 \n으로 처리됩니다. 내용을 단락으로 구분하려면 빈 줄을 추가하세요.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="block mb-2">등록일</Label>
                                    <div className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                                        {formatDate(selectedNotice.date)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                취소
                            </Button>
                            <Button onClick={handleUpdateNotice}>저장</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* 공지사항 상세 보기 모달 */}
            {selectedNotice && (
                <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                    <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-center gap-2">
                                {selectedNotice.isImportant && (
                                    <Badge className="bg-red-100 text-red-800">중요</Badge>
                                )}
                                <DialogTitle>{selectedNotice.title}</DialogTitle>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                                <div>등록일: {formatDate(selectedNotice.date)}</div>
                            </div>
                        </DialogHeader>
                        <div className="border-t border-b border-gray-200 py-4 my-4">
                            <div className="whitespace-pre-line text-gray-700">{selectedNotice.content}</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div>공개 상태: {selectedNotice.isPublished ? '공개' : '비공개'}</div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                                    닫기
                                </Button>
                                <Button onClick={() => {
                                    setIsViewModalOpen(false);
                                    openEditModal(selectedNotice);
                                }}>
                                    <Edit size={16} className="mr-2" />
                                    수정
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* 공지사항 삭제 확인 다이얼로그 */}
            {selectedNotice && (
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>공지사항 삭제</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-center text-gray-700">
                                다음 공지사항을 정말 삭제하시겠습니까?
                            </p>
                            <p className="text-center font-medium mt-2 px-4 py-2 bg-gray-50 rounded-md">
                                "{selectedNotice.title}"
                            </p>
                            <p className="text-center text-gray-500 text-sm mt-4">
                                이 작업은 되돌릴 수 없습니다.
                            </p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                취소
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteNotice}>
                                삭제
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}