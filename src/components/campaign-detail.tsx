"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Progress } from "@/src/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Package, Truck, Info } from "lucide-react"
import { Fragment } from "react";

const getBadgeVariant = (status: string) => {
    switch (status) {
        case "모집중":
            return "default"
        case "마감임박":
            return "destructive"
        case "마감":
            return "outline"
        default:
            return "default"
    }
}

export default function CampaignDetailPage() {
    const [selectedOption, setSelectedOption] = useState("블랙");

    const campaign = {
        title: "프리미엄 커피 체험단 모집",
        image: "/placeholder.svg",
        reviewImage: "/img/review-sample.png",
        description: `프리미엄 원두를 사용한 고급 커피 제품을 체험하고 리뷰를 작성해주세요.\n\n✔ 참여자에게는 제품과 포인트가 함께 지급됩니다.\n\n✔ 리뷰 예시는 아래 이미지 참고`,
        notice: `✔ 신청 후 취소는 불가합니다.\n✔ 리뷰 미작성 시 향후 체험단 참여가 제한될 수 있습니다.\n✔ 동일 주소지 중복 신청은 제한됩니다.`,
        options: ["블랙", "라떼", "디카페인"],
        schedule: {
            모집기간: "2025.04.01 ~ 2025.04.10",
            리뷰작성기간: "2025.04.11 ~ 2025.04.20",
        },
        reward: "제품 제공 + 포인트 5,000",
        participants: {
            today: { current: 2, total: 3 },
            total: { current: 5, total: 10 },
        },
        status: "모집중",
        price: 12500,
        shipping: 2500,
        deliveryType: {
            블랙: "일반배송",
            라떼: "새벽배송",
            디카페인: "택배배송",
        },
        reviewType: {
            블랙: "텍스트 리뷰",
            라떼: "영상 리뷰",
            디카페인: "포토 리뷰",
        },
        point: {
            블랙: 1500,
            라떼: 2000,
            디카페인: 1800,
        },
        purchaseLinks: [
            { src: "/logos/coupang.png", href: "https://www.coupang.com" },
        ],
    };

    const totalPrice = campaign.price + campaign.shipping;
    const remaining = campaign.participants.total.total - campaign.participants.total.current;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-12 text-gray-800">
            {/* 상단: 이미지 + 우측 정보 */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* 이미지 & 결제 정보 */}
                <div className="w-full lg:w-2/5 space-y-4">
                    {/*<div className="border rounded-xl overflow-hidden bg-white">*/}
                    <div className="relative border rounded-xl overflow-hidden bg-white">
                        <Image
                            src={campaign.image}
                            alt={campaign.title}
                            width={700} // 원래 값 유지
                            height={450} // 기존보다 줄인 높이
                            className="object-cover w-full h-auto"
                        />
                        {/* 상태 뱃지 (우측 상단) */}
                        <div className="absolute top-2 right-2 z-50">
                            <Badge
                                variant={getBadgeVariant(campaign.status)}
                                className="text-white drop-shadow-sm"
                            >
                                {campaign.status}
                            </Badge>
                        </div>
                    </div>

                    {/* 결제 정보 + 구매처 */}
                    <div className="bg-white border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="text-sm text-gray-700 space-y-2 w-full">
                            <div className="text-sm text-gray-700 space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">모집 기간</span>
                                    <span className="font-medium text-gray-800">{campaign.schedule.모집기간}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">리뷰 작성 기간</span>
                                    <span className="font-medium text-gray-800">{campaign.schedule.리뷰작성기간}</span>
                                </div>
                            </div>

                            <hr className="my-4 border-t border-gray-200" />
                            <div className="space-y-1 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">모집 인원 현황</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">오늘 모집</span>
                                    <span className="font-medium">
                              <span className="text-gray-600 font-semibold">{campaign.participants.today.current}</span>
                              <span className="text-gray-500">명</span>
                                        {" / "}
                                        <span className="text-gray-600 font-semibold">{campaign.participants.today.total}</span>
                              <span className="text-gray-500">명</span>
                            </span>
                                </div>
                                <Progress value={(campaign.participants.today.current / campaign.participants.today.total) * 100} className="h-2" />

                                <div className="flex justify-between">
                                    <span className="text-gray-500">전체 모집</span>
                                    <span className="font-medium">
                              <span className="text-gray-600 font-semibold">{campaign.participants.total.current}</span>
                              <span className="text-gray-500">명</span>
                                        {" / "}
                                        <span className="text-gray-600 font-semibold">{campaign.participants.total.total}</span>
                              <span className="text-gray-500">명</span>
                            </span>
                                </div>
                                <Progress value={(campaign.participants.total.current / campaign.participants.total.total) * 100} className="h-2" />
                            </div>

                            <hr className="my-1 border-t border-gray-200" />

                            <div className="text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">재참여 기간</span>
                                    <span className="font-medium text-gray-800">14일 후</span>
                                </div>
                            </div>
                        </div>
                        {/*<div className="flex gap-3 items-center">
                            {campaign.purchaseLinks.map((logo, i) => (
                                <a key={i} href={logo.href} target="_blank" rel="noopener noreferrer">
                                    <Image
                                        src={logo.src}
                                        alt="구매처"
                                        width={60}
                                        height={30}
                                        className="object-contain hover:opacity-80 transition"
                                    />
                                </a>
                            ))}
                        </div>*/}
                    </div>
                </div>

                {/* 상세 정보 */}
                <div className="w-full lg:w-3/5 border border-gray-200 p-6 rounded-xl shadow-sm bg-white">
                    {/* 뱃지 (위쪽) */}
                    <div className="flex gap-2">
                        <Badge className="bg-blue-100 text-blue-700 px-2 py-0.5 text-xs rounded-sm">
                            예약가능
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 px-2 py-0.5 text-xs rounded-sm">
                            참여가능
                        </Badge>
                    </div>
                    <div className="flex justify-between items-start mt-1">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 leading-snug max-w-sm">
                                {campaign.title}
                            </h1>
                        </div>

                        {/* 총 제품 금액 + 제품/배송 상세 */}
                        <div className="text-right">
                            <p className="text-xs text-gray-500">총 제품 금액</p>
                            <p className="text-2xl font-extrabold text-red-600">
                                {campaign.price.toLocaleString()}원
                            </p>
                            <div className="mt-2 space-y-1 text-right">
                                <div className="flex justify-end items-center gap-2 text-gray-500 text-sm">
                                    <Package className="w-4 h-4" />
                                    <span>제품 금액</span>
                                    <span className="ml-1">{campaign.price.toLocaleString()}원</span>
                                </div>
                                <div className="flex justify-end items-center gap-2 text-gray-500 text-sm">
                                    <Truck className="w-4 h-4" />
                                    <span>배송비</span>
                                    <span className="ml-1">{campaign.shipping.toLocaleString()}원</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Select value={selectedOption} onValueChange={setSelectedOption}>
                            <SelectTrigger>
                                <SelectValue placeholder="옵션 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {campaign.options.map((opt) => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/*<div className="bg-gray-50 border rounded-lg px-6 py-3 space-y-2 text-sm text-gray-800">*/}
                        {/* 쇼핑몰 정보 박스 (아래에 묶어서) */}
                    <div className="flex justify-between items-center px-2 py-2 bg-gray-50 border-t border-l border-r border-gray-200 rounded text-sm mt-3">
                        <div className="flex items-center gap-2 text-gray-700">
                                <Image
                                    src={campaign.purchaseLinks[0].src}
                                    alt="쇼핑몰 로고"
                                    width={20}
                                    height={20}
                                    className="object-contain bg-white border rounded"
                                />
                                <span className="font-medium text-gray-900">쿠팡</span>
                            </div>
                            <a
                                href={campaign.purchaseLinks[0].href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm hover:text-blue-800"
                            >
                                제품 보기
                            </a>
                        </div>
                        {/* 옵션 요약 테이블 - 4열 구조 (라벨/값 2쌍) */}
                    {/* 옵션 요약 테이블 - 상품명, 옵션 각각 한 행 */}
                    <div className="grid grid-cols-[80px_1fr] bg-white text-xs sm:text-sm text-gray-800 border rounded-t-md overflow-hidden">
                        {[
                            { label: "상품명", value: "프리미엄 블랙 커피" },
                            { label: "옵션", value: selectedOption },
                        ].map(({ label, value }, index) => (
                            <Fragment key={label}>
                                <div
                                    className={`bg-gray-100 px-3 py-2 text-gray-600 ${
                                        index === 1 ? "border-t " : ""
                                    }`}
                                >
                                    {label}
                                </div>
                                <div
                                    className={`bg-white px-3 py-2 font-medium text-gray-900 ${
                                        index === 1 ? "border-t " : ""
                                    }`}
                                >
                                    {value}
                                </div>
                            </Fragment>
                        ))}
                    </div>

                    {/* 나머지 항목들 (2개씩 한 줄에 배치) */}
                    <div className="grid grid-cols-[80px_1fr_80px_1fr] text-xs sm:text-sm text-gray-800 border-x border-b rounded-b-md overflow-hidden">
                        {[
                            { label: "상품 찜", value: "필수" },
                            { label: "포토 여부", value: "필수" },
                            { label: "리뷰 타입", value: campaign.reviewType[selectedOption] },
                            { label: "배송 형태", value: campaign.deliveryType[selectedOption] },
                        ].map(({ label, value }, index) => (
                            <Fragment key={label}>
                                <div className={`bg-gray-100 px-3 py-2 text-gray-600 ${index >= 2 ? "border-t " : ""}`}>
                                    {label}
                                </div>
                                <div className={`bg-white px-3 py-2 font-medium text-gray-900 ${index >= 2 ? "border-t " : ""}`}>
                                    {value}
                                </div>
                            </Fragment>
                        ))}
                    </div>


                    {/* 지급 포인트 강조 박스 별도로 아래에 위치 */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-sm mt-3">
                        <p className="text-gray-600 font-medium mb-1">지급 포인트</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">참여 시 적립</span>
                            <span className="text-xl font-bold text-indigo-700">
                              {campaign.point[selectedOption].toLocaleString()}P
                            </span>
                        </div>
                    </div>
                    <div className=" text-red-600 text-sm px-2 py-2">
                        ※ 기한 내 구매 및 리뷰를 증빙하지 않을 경우 지급 포인트가 차감됩니다.
                    </div>

                    <hr className="mt-2 mb-3 border-t border-gray-200" />

                    <div className="flex justify-between text-xs text-gray-700 bg-gray-50 rounded-md px-4 py-2 border border-gray-200">
                        <div className="flex gap-2 min-w-0 items-center">
                            <Info className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-500 w-24 shrink-0">입금자명</span>
                            <span className="truncate">리뷰주식회사</span>
                        </div>
                        <div className="flex gap-2 min-w-0">
                            <span className="text-gray-500 w-28 shrink-0">담당자</span>
                            <span className="truncate">초롱이</span>
                        </div>
                    </div>
                    <Button className="w-full mt-3">지원하기</Button>
                </div>
            </div>

            {/* 하단 상세 설명 탭 */}
            <Tabs defaultValue="description" className="w-full">
                <TabsList className="bg-gray-100 border-b rounded-t-md">
                    <TabsTrigger
                        value="description"
                        className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-b-white data-[state=active]:font-semibold data-[state=active]:text-gray-900 rounded-t-md px-4 py-2"
                    >
                        캠페인 상세 설명
                    </TabsTrigger>
                    <TabsTrigger
                        value="notice"
                        className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-b-white data-[state=active]:font-semibold data-[state=active]:text-gray-900 rounded-t-md px-4 py-2"
                    >
                        유의사항
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-0">
                    <div className="bg-white border rounded-b-xl p-10 shadow-sm">
                        <div className="prose prose-base text-gray-800 whitespace-pre-line">
                            {campaign.description}
                        </div>
                        <div className="mt-6 border rounded overflow-hidden">
                            <Image
                                src={campaign.reviewImage}
                                alt="리뷰 예시"
                                width={800}
                                height={600}
                                className="w-full object-cover"
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="notice" className="mt-0">
                    <div className="bg-white border rounded-b-xl p-10 shadow-sm">
                        <div className="prose prose-base text-gray-800 whitespace-pre-line">
                            {campaign.notice}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
