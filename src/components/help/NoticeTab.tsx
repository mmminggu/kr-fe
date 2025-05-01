"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Calendar, Eye, Search,ChevronDown, ChevronUp, ChevronLeft } from "lucide-react";
import { Badge } from "@/src/components/ui/badge"
import Link from "next/link";

// 공지사항 타입 정의
interface Notice {
    id: number;
    title: string;
    content: string;
    date: string;
    views: number;
    isImportant: boolean;
}

// 임시 공지사항 데이터
const DUMMY_NOTICES: Notice[] = [
    {
        id: 1,
        title: "[중요] 리뷰체험단 서비스 이용약관 변경 안내",
        content: "안녕하세요. 리뷰체험단 서비스 이용약관이 변경되었습니다. 주요 변경사항은 다음과 같습니다...\n\n1. 리뷰 작성 기한 변경: 기존 7일에서 10일로 연장\n2. 리뷰 품질 평가 기준 강화: 더 상세한 리뷰 작성 가이드라인 추가\n3. 개인정보 처리방침 관련 조항 업데이트\n\n변경된 이용약관은 2025년 5월 1일부터 적용됩니다. 서비스를 계속 이용하시는 경우 변경된 약관에 동의하시는 것으로 간주됩니다. 자세한 내용은 이용약관 페이지를 참고해 주세요.",
        date: "2025-04-25",
        views: 1250,
        isImportant: true
    },
    {
        id: 2,
        title: "리뷰체험단 서비스 개선 안내",
        content: "더 나은 서비스 제공을 위해 다음과 같은 개선사항이 적용되었습니다...\n\n- 리뷰어 등급 시스템 개편\n- 모바일 앱 UI/UX 개선\n- 포인트 적립 시스템 변경\n- 상품 카테고리 세분화\n\n회원님들의 소중한 피드백을 바탕으로 계속해서 서비스를 발전시켜 나가겠습니다.",
        date: "2025-04-20",
        views: 823,
        isImportant: false
    },
    {
        id: 3,
        title: "5월 황금연휴 고객센터 운영 안내",
        content: "5월 황금연휴 기간 동안 고객센터 운영시간이 다음과 같이 변경됩니다...\n\n[운영 시간 변경 안내]\n- 5월 1일(목): 정상 운영 (09:00-18:00)\n- 5월 2일(금) ~ 5월 5일(월): 운영 중단\n- 5월 6일(화): 정상 운영 재개\n\n긴급 문의는 이메일 (help@reviewservice.co.kr)로 보내주시면 연휴 이후 순차적으로 답변 드리겠습니다.",
        date: "2025-04-18",
        views: 756,
        isImportant: false
    },
    {
        id: 4,
        title: "리뷰어시스템 개편 안내",
        content: "더 공정하고 합리적인 리뷰어 시스템으로 개편되었습니다...\n\n[주요 변경사항]\n1. 리뷰어 등급 세분화 (5단계 → 7단계)\n2. 활동 점수 산정 방식 개선\n3. 신규 혜택 추가\n\n기존 리뷰어 등급은 자동으로 새 등급으로 전환되며, 마이페이지에서 확인하실 수 있습니다.",
        date: "2025-04-15",
        views: 1102,
        isImportant: false
    },
    {
        id: 5,
        title: "[중요] 개인정보 처리방침 개정 안내",
        content: "개인정보 처리방침이 일부 개정되었습니다. 주요 변경사항은 다음과 같습니다...\n\n[개정 주요 내용]\n- 개인정보 보호 강화를 위한 보안 시스템 업데이트\n- 개인정보 보관 기간 명확화\n- 제3자 정보제공 관련 조항 구체화\n- 회원 탈퇴 시 데이터 처리 과정 상세화\n\n개정된 개인정보 처리방침은 2025년 5월 10일부터 적용됩니다.",
        date: "2025-04-10",
        views: 986,
        isImportant: true
    }
];


interface AnnouncementDetailProps {
    id: number
    onBack: () => void
}

export default function NoticeTab({ id, onBack }: AnnouncementDetailProps) {
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
    const [notices, setNotices] = useState<Notice[]>(DUMMY_NOTICES);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredNotices, setFilteredNotices] = useState<Notice[]>(DUMMY_NOTICES);

    // 검색어 변경 시 필터링
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredNotices(notices);
        } else {
            const filtered = notices.filter(notice =>
                notice.title.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredNotices(filtered);
        }
    }, [searchQuery, notices]);

    // 공지사항 선택 핸들러
    const handleNoticeClick = (notice: Notice) => {
        setSelectedNotice(notice);
        // 실제 구현 시: 조회수 증가 API 호출
    };

    // 상세 보기에서 목록으로 돌아가기
    const handleBackToList = () => {
        setSelectedNotice(null);
    };

    // 검색어 변경 핸들러
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // 이전 공지사항 이동 핸들러
    const handlePrevNotice = () => {
        if (selectedNotice) {
            // 현재 공지사항의 인덱스 찾기
            const currentIndex = notices.findIndex(notice => notice.id === selectedNotice.id);
            if (currentIndex > 0) {
                setSelectedNotice(notices[currentIndex - 1]); // 이전 공지로 이동
            }
        }
    };

// 다음 공지사항 이동 핸들러
    const handleNextNotice = () => {
        if (selectedNotice) {
            // 현재 공지사항의 인덱스 찾기
            const currentIndex = notices.findIndex(notice => notice.id === selectedNotice.id);
            if (currentIndex < notices.length - 1) {
                setSelectedNotice(notices[currentIndex + 1]); // 다음 공지로 이동
            }
        }
    };


    // 현재 선택된 공지사항이 가장 최신인지 확인
    const isNewest = selectedNotice ? notices.findIndex(notice => notice.id === selectedNotice.id) === 0 : false;

    // 현재 선택된 공지사항이 가장 오래된 것인지 확인
    const isOldest = selectedNotice ? notices.findIndex(notice => notice.id === selectedNotice.id) === notices.length - 1 : false;

    return (
        <div className="space-y-4">
            {selectedNotice ? (
                // 공지사항 상세 보기
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-6 space-y-6">
                            {/* 헤더 */}
                            <div className="border-b border-gray-200 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    {selectedNotice.isImportant && <Badge className="bg-red-200 text-red-800">중요</Badge>}
                                    <h1 className="text-xl md:text-2xl font-bold">{selectedNotice.title}</h1>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                                    <span>작성일: {selectedNotice.date}</span>
                                </div>
                            </div>

                            {/*<div className="bg-gray-100 p-4 border-b flex flex-col gap-3">
                                 상단 : 제목 + 목록버튼
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        {selectedNotice.isImportant && (
                                            <span className="inline-block bg-red-200 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                                                중요
                                            </span>
                                        )}
                                        <h2 className="text-xl font-bold leading-tight">
                                            {selectedNotice.title}
                                        </h2>
                                    </div>
                                    <Button
                                        onClick={handleBackToList}
                                        size="sm"
                                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 rounded-lg px-4 py-2"
                                    >
                                        목록
                                    </Button>
                                </div>

                                 하단 : 작성일 + 조회수
                                <div className="flex items-center gap-6 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1 text-indigo-500" />
                                        {selectedNotice.date}
                                    </div>
                                    <div className="flex items-center">
                                        <Eye className="h-4 w-4 mr-1 text-indigo-500" />
                                        조회 {selectedNotice.views}
                                    </div>
                                </div>
                            </div>
*/}

                            {/* 상세 내용 */}
                           {/* <div className="p-6 min-h-[300px] whitespace-pre-line text-gray-700 leading-relaxed">
                                {selectedNotice.content}
                            </div>*/}
                            {/* 본문 */}
                            <div className="min-h-[200px] whitespace-pre-line text-gray-700">{selectedNotice.content}</div>

                            <div className="border-t border-gray-200 pt-4 space-y-3">
                                {/* 다음 글 */}
                                {selectedNotice && selectedNotice.id !== notices[notices.length - 1].id && (
                                    <div
                                        className="flex justify-between items-center py-2 px-4 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                                        onClick={handleNextNotice}
                                    >
                                        <div className="flex items-center text-indigo-600">
                                            <ChevronUp className="h-4 w-4 mr-2" />
                                            <span className="font-medium">다음글</span>
                                        </div>
                                        <div className="truncate flex-1 mx-4 text-gray-700">
                                            {/* 제목 */}
                                            {notices.find((item) => item.id === selectedNotice.id + 1)?.title}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {/* 날짜 */}
                                            {notices.find((item) => item.id === selectedNotice.id + 1)?.date}
                                        </span>
                                    </div>
                                )}

                                {/* 이전 글 */}
                                {selectedNotice && selectedNotice.id !== notices[0].id && (
                                    <div
                                        className="flex justify-between items-center py-2 px-4 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                                        onClick={handlePrevNotice}
                                    >
                                        <div className="flex items-center text-indigo-600">
                                            <ChevronDown className="h-4 w-4 mr-2" />
                                            <span className="font-medium">이전글</span>
                                        </div>
                                        <div className="truncate flex-1 mx-4 text-gray-700">
                                            {/* 제목 */}
                                            {notices.find((item) => item.id === selectedNotice.id - 1)?.title}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {/* 날짜 */}
                                            {notices.find((item) => item.id === selectedNotice.id - 1)?.date}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* 버튼 */}
                    <div className="flex justify-between">
                        <Button
                            onClick={handleBackToList}
                            size="sm"
                            variant="outline" className="border-gray-200 text-gray-700"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            목록으로
                        </Button>
                    </div>
                </div>
            ) : (
                // 공지사항 목록
                <div>
                    {/* 검색 영역 */}
                    <div className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="공지사항 제목 검색"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full p-3 pl-10 border text-sm border-gray-200 rounded-lg bg-gray-50"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* 목록 헤더 */}
                        <div className="grid grid-cols-12 bg-gray-100 py-3 px-4 text-sm font-medium text-gray-700 border-b">
                            <div className="col-span-1 text-center">번호</div>
                            <div className="col-span-7 md:col-span-5">제목</div>
                            <div className="col-span-4 md:col-span-3 md:col-start-10 text-center">날짜</div>
                        </div>

                        {/* 목록 내용 */}
                        <div className="divide-y text-sm">
                            {filteredNotices.length > 0 ? (
                                filteredNotices.map((notice, index) => (
                                    <button
                                        key={notice.id}
                                        className="w-full text-left hover:bg-gradient-to-r hover:from-indigo-50/100 hover:to-purple-100/50 transition py-4 px-4 grid grid-cols-12 items-center"
                                        onClick={() => handleNoticeClick(notice)}
                                    >
                                        <div className="col-span-1 text-center text-sm text-gray-500">
                                            {notice.id}
                                        </div>
                                        <div className="col-span-7 md:col-span-5 flex items-center">
                                            {notice.isImportant &&
                                                <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full mr-2 shrink-0">
                                                    중요
                                                </span>
                                            }
                                            <span className="truncate">{notice.title}</span>
                                        </div>
                                        <div className="col-span-4 md:col-span-3 md:col-start-10 text-sm text-gray-500 text-center">
                                            {notice.date}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="py-8 text-center text-gray-500">
                                    검색 결과가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 페이지네이션 */}
                    {filteredNotices.length > 0 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-1">
                                <Button variant="outline" size="sm" className="w-9 h-9 p-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-500">
                                    1
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}