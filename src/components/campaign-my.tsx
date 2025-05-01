// app/my-campaign/page.tsx
"use client"

import Image from "next/image"
import { useState } from "react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import {SearchIcon, UploadCloud, AlertCircle, Pencil, Info} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {Input} from "@/src/components/ui/input";

type CampaignStatus = "전체" | "구매증빙" | "리뷰증빙" | "완료" | "취소" | "참여" | "구매증빙 수정"| "리뷰증빙 수정";
type DashboardCategory = "전체" | "진행중" | "마감됨";

const isCorrectionRequired = true;
const correctionImage = "ex_coupang.png"; // ← 없으면 null
// const correctionImage = ""; // ← 없으면 null
const correctionMessages = [
    "영수증 이미지가 흐릿하게 촬영됨",
    "금액 정보가 누락됨",
    "주문 번호가 누락됨",
];
interface MyCampaign {
    id: number
    title: string
    image: string
    status: CampaignStatus
    price: number
    shipping: number
    point: number
    deliveryType: string
    proofDeadline: string // 날짜 문자열
}


const campaigns: MyCampaign[] = [
    {
        id: 1,
        title: "프리미엄 커피 리뷰 모집",
        image: "/placeholder.svg",
        status: "참여",
        price: 12500,
        shipping: 2500,
        point: 1500,
        deliveryType: "빈박스",
        proofDeadline: "2025-04-30",
    },
    {
        id: 2,
        title: "헤어케어 제품 체험단",
        image: "/placeholder.svg",
        status: "구매증빙 수정",
        price: 19000,
        shipping: 3000,
        point: 2000,
        deliveryType: "실배송",
        proofDeadline: "2025-04-25",
    },
    {
        id: 3,
        title: "뷰티 디바이스 리뷰",
        image: "/placeholder.svg",
        status: "리뷰증빙",
        price: 45000,
        shipping: 0,
        point: 3000,
        deliveryType: "빈박스",
        proofDeadline: "2025-04-20",
    },
    {
        id: 4,
        title: "취소된 캠페인 예시",
        image: "/placeholder.svg",
        status: "취소",
        price: 50000,
        shipping: 2500,
        point: 0,
        deliveryType: "실배송",
        proofDeadline: "2025-04-10",
    },
    {
        id: 5,
        title: "뷰티 디바이스 리뷰",
        image: "/placeholder.svg",
        status: "구매증빙",
        price: 45000,
        shipping: 0,
        point: 3000,
        deliveryType: "빈박스",
        proofDeadline: "2025-04-20",
    },
    {
        id: 6,
        title: "취소된 캠페인 예시",
        image: "/placeholder.svg",
        status: "취소",
        price: 50000,
        shipping: 2500,
        point: 0,
        deliveryType: "실배송",
        proofDeadline: "2025-04-10",
    },
    {
        id: 7,
        title: "뷰티 디바이스 리뷰",
        image: "/placeholder.svg",
        status: "리뷰증빙",
        price: 45000,
        shipping: 0,
        point: 3000,
        deliveryType: "빈박스",
        proofDeadline: "2025-04-20",
    },
    {
        id: 8,
        title: "취소된 캠페인 예시",
        image: "/placeholder.svg",
        status: "리뷰증빙 수정",
        price: 50000,
        shipping: 2500,
        point: 0,
        deliveryType: "실배송",
        proofDeadline: "2025-04-10",
    },
    {
        id: 9,
        title: "뷰티 디바이스 리뷰",
        image: "/placeholder.svg",
        status: "리뷰증빙",
        price: 45000,
        shipping: 0,
        point: 3000,
        deliveryType: "빈박스",
        proofDeadline: "2025-04-20",
    },
    {
        id: 10,
        title: "취소된 캠페인 예시",
        image: "/placeholder.svg",
        status: "취소",
        price: 50000,
        shipping: 2500,
        point: 0,
        deliveryType: "실배송",
        proofDeadline: "2025-04-10",
    },
]



export default function MyCampaignPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const [selectedCampaign, setSelectedCampaign] = useState<MyCampaign | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState<CampaignStatus | "전체">("전체")
    const router = useRouter();
// 상태 변수 추가
    const [dashboardCategory, setDashboardCategory] = useState<DashboardCategory>("전체");

// 대시보드 카테고리에 따른 상태 그룹 정의
    const statusGroups: Record<DashboardCategory, (CampaignStatus | "전체")[]> = {
        "전체": ["전체", "참여", "구매증빙", "구매증빙 수정", "리뷰증빙", "리뷰증빙 수정", "완료", "취소"],
        "진행중": ["전체", "참여", "구매증빙", "구매증빙 수정", "리뷰증빙", "리뷰증빙 수정"],
        "마감됨": ["전체", "완료", "취소"]
    };

// 캠페인 상태를 대시보드 카테고리로 매핑
    const campaignStatusToDashboardCategory: Record<CampaignStatus, DashboardCategory> = {
        "참여": "진행중",
        "구매증빙": "진행중",
        "구매증빙 수정": "진행중",
        "리뷰증빙": "진행중",
        "리뷰증빙 수정": "진행중",
        "완료": "마감됨",
        "취소": "마감됨"
    };

// 대시보드 카테고리별 캠페인 수 계산
    const dashboardCounts: Record<DashboardCategory, number> = {
        "전체": campaigns.length,
        "진행중": campaigns.filter(c =>
            ["참여", "구매증빙", "구매증빙 수정", "리뷰증빙", "리뷰증빙 수정"].includes(c.status)
        ).length,
        "마감됨": campaigns.filter(c =>
            ["완료", "취소"].includes(c.status)
        ).length
    };

// 대시보드 카테고리 변경 핸들러
    const handleDashboardCategoryChange = (category: DashboardCategory) => {
        setDashboardCategory(category);
        setStatusFilter("전체");
        setCurrentPage(1);
    };

// 필터링 함수 업데이트
    const filteredCampaigns = campaigns.filter((c) => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDashboard = dashboardCategory === "전체" || campaignStatusToDashboardCategory[c.status] === dashboardCategory;
        const matchesStatus = statusFilter === "전체" || c.status === statusFilter;

        return matchesSearch && matchesDashboard && matchesStatus;
    });

    // 상태별 캠페인 카운트 계산
    const statusCounts: Record<CampaignStatus | "전체", number> = {
        전체: campaigns.length,
        참여: 0,
        구매증빙: 0,
        리뷰증빙: 0,
        완료: 0,
        취소: 0,
        "구매증빙 수정": 0,
        "리뷰증빙 수정": 0
    }

    // 상태별 카운트 계산
    campaigns.forEach((c) => {
        // 수정된 상태도 각 카테고리에 포함시킴
        if (c.status === "구매증빙 수정") {
            statusCounts["구매증빙"]++
        } else if (c.status === "리뷰증빙 수정") {
            statusCounts["리뷰증빙"]++
        } else {
            statusCounts[c.status]++
        }
    })

    // 페이지네이션 적용
    const paginatedCampaigns = filteredCampaigns.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // 상태 필터 변경 핸들러
    const handleStatusFilterChange = (newStatus: CampaignStatus | "전체") => {
        setStatusFilter(newStatus);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
    }

    const handleOpenModal = (campaign: MyCampaign) => {
        setSelectedCampaign(campaign);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCampaign(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-5 space-y-5 sm:space-y-5">
            {/* 제목 */}
            <h2 className="text-2xl font-bold text-gray-900">내 캠페인</h2>
            {/* 대시보드 */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
                {["전체", "진행중", "마감됨"].map((category) => (
                    <StatusCard
                        key={category}
                        label={category}
                        count={dashboardCounts[category]}
                        isActive={dashboardCategory === category}
                        onClick={() => handleDashboardCategoryChange(category)}
                    />
                ))}
            </div>

            <div className="relative w-full">
                <SearchIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                />
                <input
                    type="text"
                    placeholder="캠페인 검색"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
            </div>

            {/* 상세 필터 버튼 */}
            <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-sm text-gray-500 self-center">상세 필터:</span>
                {statusGroups[dashboardCategory].map((status) => (
                    <button
                        key={status}
                        onClick={() => {
                            setStatusFilter(status);
                            setCurrentPage(1);
                        }}
                        className={`px-3 py-1 rounded-full text-xs transition-colors ${
                            statusFilter === status
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                    >
                        {status === "전체" ? "모두 보기" : status}
                    </button>
                ))}
            </div>

            {/* 캠페인 카드 리스트 */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
                {paginatedCampaigns.map((campaign) => (
                    <div
                        key={campaign.id}
                        onClick={() => router.push(`/campaignDetail`)} // 추후 /campaigns/${campaign.id} 로 변경 가능
                        className={"cursor-pointer"}
                    >
                        <div key={campaign.id} className="border rounded-xl hover:shadow-md transition-shadow shadow-sm bg-white overflow-hidden">
                            <Image src={campaign.image} alt={campaign.title} width={400} height={250} className="w-full h-40 object-cover" />
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-sm sm:text-base font-semibold leading-snug">{campaign.title}</h3>
                                    <Badge className="text-xs sm:text-xs">{campaign.status}</Badge>
                                </div>

                                <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                                    <div className="text-xs sm:text-sm text-gray-700 space-y-1 sm:space-y-1">
                                        {/* 제품비 & 배송비 한 줄 */}
                                        <div className="flex justify-between gap-1 sm:gap-4">
                                            <div className="flex-1 flex justify-between">
                                                <span className="text-gray-500">제품비</span>
                                                <span className="font-medium text-gray-800">{campaign.price.toLocaleString()}원</span>
                                            </div>
                                            <span className="text-gray-400">|</span>
                                            <div className="flex-1 flex justify-between">
                                                <span className="text-gray-500">배송비</span>
                                                <span className="font-medium text-gray-800">{campaign.shipping.toLocaleString()}원</span>
                                            </div>
                                        </div>

                                        {/* 입금자, 담당자 */}
                                        <div className="flex justify-between gap-4">
                                            <div className="flex-1 flex justify-between">
                                                <span className="text-gray-500">입금자</span>
                                                <span className="font-medium text-gray-800 ">리뷰리뷰</span>
                                            </div>
                                            <span className="text-gray-400">|</span>
                                            <div className="flex-1 flex justify-between">
                                                <span className="text-gray-500">담당자</span>
                                                <span className="font-medium text-gray-800">초롱이</span>
                                            </div>
                                        </div>

                                        {/* 포인트, 배송형태 */}
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">배송형태</span>
                                            <span className="font-medium text-gray-800">{campaign.deliveryType}</span>
                                        </div>

                                        {/* 계정, 기한 */}
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">참여계정</span>
                                            <span className="font-medium text-gray-800">test@naver.com</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">지급 포인트</span>
                                            <span className="font-semibold text-indigo-600">{campaign.point.toLocaleString()}P</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">증빙 기한</span>
                                            <span className="text-red-600 font-semibold">{getDDayLabel(campaign.proofDeadline)}</span>
                                        </div>
                                    </div>

                                </div>

                                <div className="flex flex-col gap-2 ">
                                    {/* 구매/리뷰 증빙 버튼 한 줄 */}
                                    <div className="h-3 text-xs">
                                        {campaign.status === "구매증빙 수정" && (
                                            <div className="text-red-600 font-semibold flex items-center gap-2 animate-blink duration-[90000ms]">
                                                <AlertCircle className="w-3 h-3" />
                                                구매증빙 수정 요청
                                            </div>
                                        )}
                                        {campaign.status === "리뷰증빙 수정" && (
                                            <div className="text-red-600 font-semibold flex items-center gap-2 animate-blink duration-[90000ms]">
                                                <AlertCircle className="w-3 h-3" />
                                                리뷰증빙 수정 요청
                                            </div>
                                        )}
                                        {campaign.status !== "구매증빙 수정" && campaign.status !== "리뷰증빙 수정" && (
                                            <div className="invisible">-</div>
                                        )}
                                    </div>
                                    {renderButtonsByStatus(campaign)}
                                    {/* 가이드 / 문의 버튼 한 줄 */}
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="w-full text-xs" onClick={(e) => e.stopPropagation()}>📘 가이드</Button>
                                        <Button variant="outline" size="sm" className="w-full text-xs" onClick={(e) => e.stopPropagation()}>💬 문의</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지가 없을 경우 메시지 표시 */}
            {filteredCampaigns.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">해당 조건의 캠페인이 없습니다.</p>
                </div>
            )}

            {/* 페이지네이션 */}
            {filteredCampaigns.length > 0 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: Math.ceil(filteredCampaigns.length / itemsPerPage) }, (_, i) => (
                        <Button
                            key={i + 1}
                            size="sm"
                            variant={currentPage === i + 1 ? "default" : "outline"}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </div>
            )}

            {isModalOpen && selectedCampaign && (
                <ReceiptUploadModal
                    campaign={selectedCampaign}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    )
    function renderButtonsByStatus(campaign: MyCampaign) {
        switch (campaign.status) {
            case "참여":
            case "취소":
                return (
                    <div className="flex gap-2">
                        <button disabled  onClick={(e) => e.stopPropagation()} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-gray-100 text-gray-400 border border-gray-200 rounded-md shadow-sm">
                            <UploadCloud className="w-4 h-4" />
                            구매증빙
                        </button>
                        <button disabled  onClick={(e) => e.stopPropagation()} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-gray-100 text-gray-400 border border-gray-200 rounded-md shadow-sm">
                            <UploadCloud className="w-4 h-4" />
                            리뷰증빙
                        </button>
                    </div>
                );

            case "구매증빙":
            case "구매증빙 수정":
                return (
                    <div className="flex gap-2">
                        <button
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-md shadow-sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelectedCampaign(campaign);
                                setIsModalOpen(true);
                            }}
                        >
                            <UploadCloud className="w-4 h-4" />
                            구매증빙
                        </button>
                        <button disabled  onClick={(e) => e.stopPropagation()} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-gray-100 text-gray-400 border border-gray-200 rounded-md shadow-sm">
                            <UploadCloud className="w-4 h-4" />
                            리뷰증빙
                        </button>
                    </div>
                );

            case "리뷰증빙":
            case "리뷰증빙 수정":
                return (
                    <div className="flex gap-2">
                        <button  onClick={(e) => e.stopPropagation()} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-md shadow-sm">
                            <UploadCloud className="w-4 h-4" />
                            구매증빙 확인
                        </button>
                        <button
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md shadow-sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelectedCampaign(campaign);
                                setIsModalOpen(true);
                            }}
                        >
                            <UploadCloud className="w-4 h-4" />
                            리뷰증빙
                        </button>
                    </div>
                );

            case "완료":
                return (
                    <div className="flex gap-2">
                        <button  onClick={(e) => e.stopPropagation()} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-md shadow-sm">
                            <UploadCloud className="w-4 h-4" />
                            구매증빙 확인
                        </button>
                        <button  onClick={(e) => e.stopPropagation()} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md shadow-sm">
                            <UploadCloud className="w-4 h-4" />
                            리뷰증빙 확인
                        </button>
                    </div>
                );
        }
    }

}

// 상태별 개수 카드 (클릭 가능)
function StatusCard({
                        label,
                        count,
                        isActive,
                        onClick
                    }: {
    label: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            className={`flex items-center justify-between px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200
        ${isActive
                ? 'bg-indigo-50 text-indigo-700 border-indigo-400'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
            onClick={onClick}
        >
            <span>{label}</span>
            <span className="ml-2 font-semibold">{count}</span>
        </button>
    );
}


// D-Day 계산 유틸
function getDDayLabel(deadline: string): string {
    const today = new Date()
    const endDate = new Date(deadline)
    const diff = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diff < 0) return "마감"
    if (diff === 0) return "D-DAY"
    return `D-${diff}`
}

// 모달 컴포넌트
function ReceiptUploadModal({
                                campaign,
                                onClose,
                            }: {
    campaign: MyCampaign;
    onClose: () => void;
}) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [editingOrderNumber, setEditingOrderNumber] = useState(false);
    const [editingAmount, setEditingAmount] = useState(false);
    const [orderNumber, setOrderNumber] = useState("1234567890");
    const [amount, setAmount] = useState("5600");

    const [isEditingOrderNumber, setIsEditingOrderNumber] = useState(false);
    const [isEditingAmount, setIsEditingAmount] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImageFile(file);
    };

    const isCorrectionRequired = campaign.status === "구매증빙 수정";

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 py-7">
            <div className="bg-white w-full max-w-md md:max-w-md lg:max-w-3xl rounded-xl shadow-lg p-6 space-y-4 overflow-y-auto max-h-[90vh]">
                {/* 대제목 */}
                <div className="border-b pb-3">
                    <h2 className="text-xl font-semibold text-gray-900">구매 영수증 업로드</h2>
                </div>

                {/* 관리자 수정 요청 박스 */}
                {isCorrectionRequired && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-xs space-y-1">
                        <p className="font-semibold text-sm">※ 관리자 수정 요청 항목</p>
                        <div className="flex gap-3 items-start">
                            {/* 조건부 이미지 렌더링 */}
                            {correctionImage && (
                                <div className="min-w-[50px] max-w-[50px]">
                                    <img
                                        src={correctionImage}
                                        alt="수정 요청 예시"
                                        className="w-full h-auto rounded border cursor-pointer"
                                        onClick={() => window.open(correctionImage, "_blank")}
                                    />
                                </div>
                            )}

                            {/* 텍스트 설명 */}
                            <div className="flex-1 space-y-1">
                                <ul className="list-disc pl-4 space-y-1">
                                    {correctionMessages?.map((msg, idx) => (
                                        <li key={idx}>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 w-full border border-gray-200 rounded-md p-3">
                    {/* 좌측: 업로드 영역 */}
                    <div className="sm:w-1/2 w-full flex flex-col items-center justify-center gap-2">
                        {/* 미리보기 영역 */}
                        <div className="w-full border rounded-md bg-gray-50 aspect-[4/3] flex items-center justify-center overflow-hidden">
                            {imageFile ? (
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="미리보기"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <span className="text-gray-400 text-sm">미리보기 없음</span>
                            )}
                        </div>

                        {/* 업로드 + 가이드 버튼 한 줄 중앙 정렬 */}
                        <div className="mt-2 flex items-center justify-center gap-3 w-full">
                            {/* 업로드 버튼 */}
                            <label
                                htmlFor="receipt-upload"
                                className="cursor-pointer flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                            >
                                <UploadCloud className="w-4 h-4 text-gray-600" />
                                <span className="text-gray-700">영수증 업로드</span>
                            </label>

                            {/* 가이드 버튼 (동일 스타일 적용) */}
                            <button
                                type="button"
                                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition text-gray-700"
                                onClick={() => {
                                    // TODO: 가이드 페이지 이동 또는 모달 등
                                    alert("가이드로 이동 예정입니다.")
                                }}
                            >
                                📘 가이드
                            </button>
                        </div>

                        {/* 숨겨진 업로드 인풋 */}
                        <input
                            id="receipt-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                    </div>

                    <div className="sm:w-1/2 w-full space-y-3">
                        {/* 주문번호 카드 */}
                        <div className="flex justify-between items-center border border-gray-200 rounded px-3 py-2">
                            <span className="text-sm text-gray-600 font-medium">주문번호</span>
                            {isEditingOrderNumber ? (
                                <input
                                    type="text"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    onBlur={() => setIsEditingOrderNumber(false)}
                                    autoFocus
                                    className="text-sm text-right border-none outline-none bg-transparent w-36"
                                />
                            ) : (
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-gray-900">{orderNumber || "미입력"}</span>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingOrderNumber(true)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 결제 금액 카드 */}
                        <div className="flex justify-between items-center border border-gray-200 rounded px-3 py-2">
                            <span className="text-sm text-gray-600 font-medium">결제 금액</span>
                            {isEditingAmount ? (
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    onBlur={() => setIsEditingAmount(false)}
                                    autoFocus
                                    className="text-sm text-right border-none outline-none bg-transparent w-36"
                                />
                            ) : (
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-gray-900">{amount ? `${Number(amount).toLocaleString()}원` : "미입력"}</span>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingAmount(true)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* 안내 문구 - 적절한 공백 후 표시 */}
                        <div className="pt-16 text-xs text-gray-400 leading-relaxed">
                            <p className="text-xs text-gray-500 mb-1">※ 안내 사항</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>이미지 업로드 시 주문번호와 결제금액이 자동으로 입력됩니다.</li>
                                <li>구매 증빙은 등록 후 1~3일 이내 관리자 검토 후 승인됩니다.</li>
                                <li className="text-red-600">30분 이내에 구매 증빙 미완료 시 자동으로 취소됩니다.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex justify-end gap-2">
                    <Button className="bg-indigo-600 text-white">등록</Button>
                    <Button variant="outline" onClick={onClose}>닫기</Button>
                </div>
            </div>
        </div>
    );
}