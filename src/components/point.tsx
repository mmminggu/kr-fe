"use client"

import { useEffect, useMemo, useState } from "react"
import { format, parseISO, subDays, subMonths } from "date-fns"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import {
    PiggyBank,
    Wallet,
    RotateCcw,
    MinusCircle,
    ArrowDownCircle,
    CheckCircle,
    Search,
    Calendar,
    Filter,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"

type PointRecord = {
    id: number;
    campaign?: string; // 없을 수도 있음
    detail?: string;    // 상세 사유
    type: "적립" | "차감" | "출금신청" | "출금완료";
    point: number;
    date: string;
    completeDate?: string; // 출금 완료 날짜 (출금완료인 경우에만 존재할 수 있음)
};

const iconMap = {
    green: PiggyBank,
    indigo: Wallet,
    blue: ArrowDownCircle,
    red: MinusCircle,
    complete: CheckCircle,
}

const sampleData: PointRecord[] = [
    { id: 1, campaign: "프리미엄 커피 리뷰", type: "적립", point: 1500, date: "2025-04-12" },
    { id: 2, campaign: "프리미엄 커피 리뷰", type: "차감", point: -200, date: "2025-04-11", detail: "리뷰 미작성 패널티" },
    { id: 3, campaign: "", type: "차감", point: -50, date: "2025-04-10", detail: "비밀번호 찾기" },
    { id: 1, campaign: "", type: "출금신청", point: -10000, date: "2025-04-08", detail: "출금 신청" },
    { id: 2, campaign: "", type: "출금완료", point: -10000, date: "2025-04-10", detail: "출금 완료" },
    { id: 4, campaign: "캠페인 AAAA", type: "적립", point: 2000, date: "2025-04-09" },
    { id: 5, campaign: "건강기능식품 리뷰", type: "적립", point: 5000, date: "2025-04-08" },
    { id: 6, campaign: "테스트 캠페인", type: "적립", point: 3000, date: "2025-04-07" },
    { id: 7, campaign: "테스트 캠페인", type: "적립", point: 3000, date: "2025-04-07" },
    { id: 8, campaign: "캠페인 AAAA", type: "적립", point: 2000, date: "2025-04-06" },
    { id: 9, campaign: "테스트 캠페인", type: "적립", point: 3000, date: "2025-04-07" },
    { id: 10, campaign: "테스트 캠페인", type: "적립", point: 3000, date: "2025-04-07" },
    { id: 11, campaign: "테스트 캠페인", type: "적립", point: 3000, date: "2025-04-07" },
    { id: 12, campaign: "테스트 캠페인", type: "적립", point: 3000, date: "2025-04-07" },
]

const dateRanges = {
    "1주일": () => [subDays(new Date(), 7), new Date()],
    "1개월": () => [subMonths(new Date(), 1), new Date()],
    "3개월": () => [subMonths(new Date(), 3), new Date()],
    "6개월": () => [subMonths(new Date(), 6), new Date()],
}

export default function PointPage() {
    const [activeTab, setActiveTab] = useState("point")
    const [selectedRange, setSelectedRange] = useState("1개월")
    const [customStart, setCustomStart] = useState("")
    const [customEnd, setCustomEnd] = useState("")
    const [type, setType] = useState("전체")
    const [keyword, setKeyword] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        if (selectedRange !== "기간설정") {
            const [start, end] = dateRanges[selectedRange as keyof typeof dateRanges]()
            setCustomStart(format(start, "yyyy-MM-dd"))
            setCustomEnd(format(end, "yyyy-MM-dd"))
        }
    }, [selectedRange])

    // 적립/차감 내역과 출금 내역 분리
    const pointRecords = useMemo(() => {
        return sampleData.filter(item => item.type === "적립" || item.type === "차감")
    }, [])

    // 각 출금 신청에 대한 완료 데이터를 찾아 매핑
    const withdrawalRecords = useMemo(() => {
        const records = sampleData.filter(item => item.type === "출금신청" || item.type === "출금완료")

        // 실제 API 연동 시에는 이 로직이 필요 없을 수 있음 (백엔드에서 처리)
        // 현재는 더미 데이터로 작업하므로 프론트에서 처리
        const processedRecords = records.map(item => {
            if(item.type === "출금신청") {
                // 같은 포인트 값을 가진 출금완료 항목 찾기 (실제로는 요청 ID 등으로 매칭해야 함)
                const completedItem = records.find(
                    completeItem => completeItem.type === "출금완료" &&
                        completeItem.point === item.point
                )
                return {
                    ...item,
                    completeDate: completedItem?.date || null
                }
            } else {
                return item
            }
        })

        return processedRecords
    }, [])

    const filtered = useMemo(() => {
        const records = activeTab === "point" ? pointRecords : withdrawalRecords

        return records.filter((item) => {
            const itemDate = parseISO(item.date)
            const from = customStart ? parseISO(customStart) : null
            const to = customEnd ? parseISO(customEnd) : null

            const matchDate = from && to ? itemDate >= from && itemDate <= to : true
            const matchType = type === "전체" || item.type === type
            const matchKeyword = keyword === "" || item.campaign?.includes(keyword);

            return matchDate && matchType && matchKeyword
        })
    }, [activeTab, customStart, customEnd, type, keyword, pointRecords, withdrawalRecords])

    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    // 탭 변경 시 페이지 리셋
    useEffect(() => {
        setCurrentPage(1)
        // 탭에 맞는 타입 필터 설정
        if (activeTab === "point") {
            setType("전체")
        } else {
            setType("전체")
        }
    }, [activeTab])

    // 포인트 요약 계산
    const totalEarned = pointRecords.filter(item => item.type === "적립")
        .reduce((sum, item) => sum + item.point, 0)

    const totalDeducted = Math.abs(pointRecords.filter(item => item.type === "차감")
        .reduce((sum, item) => sum + item.point, 0))

    const withdrawalPending = Math.abs(withdrawalRecords.filter(item => item.type === "출금신청")
        .reduce((sum, item) => sum + item.point, 0))

    const withdrawalCompleted = Math.abs(withdrawalRecords.filter(item => item.type === "출금완료")
        .reduce((sum, item) => sum + item.point, 0))

    const availablePoints = totalEarned - totalDeducted - withdrawalPending - withdrawalCompleted

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">포인트 내역 / 관리</h2>

            {/* === 포인트 현황 카드 === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <PointSummaryCard label="총 적립 포인트" value={totalEarned} color="green" />
                <PointSummaryCard label="출금 가능 포인트" value={availablePoints} color="indigo" />
                <PointSummaryCard label="출금 신청 중" value={withdrawalPending} color="blue" />
                <PointSummaryCard label="차감 포인트" value={totalDeducted} color="red" />
            </div>

            {/* === 출금 신청 영역 === */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 shadow-sm">
                <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-indigo-600" />
                    <label className="font-medium text-indigo-900">출금신청 포인트</label>
                </div>
                <Input
                    type="number"
                    placeholder="포인트 입력"
                    className="w-full sm:w-60 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 transition-colors">신청</Button>
            </div>

            {/* 탭 구분 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="border-b border-gray-200">
                        <TabsList className="h-auto p-0 bg-transparent flex">
                            <TabsTrigger
                                value="point"
                                className="flex-1 py-4 px-6 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 text-gray-600 hover:text-indigo-700 transition-colors"
                            >
                                적립/차감 내역
                            </TabsTrigger>
                            <TabsTrigger
                                value="withdrawal"
                                className="flex-1 py-4 px-6 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 text-gray-600 hover:text-indigo-700 transition-colors"
                            >
                                출금 내역
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="point" className="px-6 py-5 m-0">
                        {/* 필터 영역 - 토글 방식 */}
                        <div className="mb-5">
                            {/* 필터 세부 영역 */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="space-y-4">
                                    {/* 기간 버튼 + 날짜 필드 */}
                                    <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
                                        {/* 기간 버튼 */}
                                        <div className="flex gap-1">
                                            {["1개월", "3개월", "6개월", "기간설정"].map((range) => (
                                                <Button
                                                    key={range}
                                                    size="sm"
                                                    variant={selectedRange === range ? "default" : "outline"}
                                                    onClick={() => setSelectedRange(range)}
                                                    className={`h-9 px-3 text-sm py-0 ${selectedRange === range
                                                        ? "bg-indigo-600 hover:bg-indigo-700"
                                                        : "border-gray-300 text-gray-700 hover:border-indigo-300 hover:text-indigo-700"}`}
                                                >
                                                    {range}
                                                </Button>
                                            ))}
                                        </div>

                                        {/* 날짜 입력 필드 (항상 표시, disabled 조건부) */}
                                        <div className="flex items-center gap-1">
                                            <Input
                                                type="date"
                                                value={customStart}
                                                onChange={(e) => setCustomStart(e.target.value)}
                                                disabled={selectedRange !== "기간설정"}
                                                className={`h-9 w-32 text-sm border-gray-300 ${selectedRange !== "기간설정" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "focus:border-indigo-500 focus:ring-indigo-500"}`}
                                            />
                                            <span className="text-gray-500 text-sm">~</span>
                                            <Input
                                                type="date"
                                                value={customEnd}
                                                onChange={(e) => setCustomEnd(e.target.value)}
                                                disabled={selectedRange !== "기간설정"}
                                                className={`h-9 w-32 text-xs border-gray-300 ${selectedRange !== "기간설정" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "focus:border-indigo-500 focus:ring-indigo-500"}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 items-center">
                                        {/* 타입 선택 (1/5) */}
                                        <div className="w-full sm:w-1/5">
                                            <Select value={type} onValueChange={setType}>
                                                <SelectTrigger className="w-full h-9 text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                                                    <SelectValue placeholder="타입 선택" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="전체">전체</SelectItem>
                                                    <SelectItem value="적립">적립</SelectItem>
                                                    <SelectItem value="차감">차감</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* 검색창 (3/5) */}
                                        <div className="relative w-full sm:w-3/5">
                                            <Input
                                                placeholder="캠페인명 검색"
                                                value={keyword}
                                                onChange={(e) => {
                                                    setKeyword(e.target.value)
                                                    setCurrentPage(1)
                                                }}
                                                className="w-full h-9 pl-9 text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>

                                        {/* 초기화 버튼 (작게) */}
                                        <div className="w-full sm:w-auto">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedRange("1개월")
                                                    setType("전체")
                                                    setKeyword("")
                                                }}
                                                className="h-9 px-3 text-sm border-gray-300 text-gray-700 hover:border-gray-400"
                                            >
                                                <RotateCcw className="w-4 h-4 mr-1" />
                                                초기화
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* 리스트 */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-gray-50 text-left border-t border-b border-gray-200">
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">캠페인</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">타입</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">포인트</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {paginated.length > 0 ? (
                                    paginated.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="py-4 px-4 text-sm font-medium text-gray-700">{item.id}</td>
                                            <td className="py-4 px-4 text-sm text-gray-700">
                                                {item.campaign
                                                    ? <span className="font-medium">{item.campaign}</span>
                                                    : ""}
                                                {item.detail && (
                                                    <span className="text-gray-500 ml-1">
                                                            {item.campaign ? "- " : ""}{item.detail}
                                                        </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                                                        ${item.type === "적립"
                                                        ? "bg-green-50 text-green-700 border border-green-200"
                                                        : "bg-red-50 text-red-700 border border-red-200"}`}>
                                                        {item.type}
                                                    </span>
                                            </td>
                                            <td className={`py-4 px-4 text-sm font-medium ${
                                                item.point >= 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}>
                                                {item.point > 0
                                                    ? `+${item.point.toLocaleString()}P`
                                                    : `${item.point.toLocaleString()}P`}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-500">{item.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-400">
                                            내역이 없습니다.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>

                    <TabsContent value="withdrawal" className="px-6 py-5 m-0">
                        {/* 필터 영역 - 토글 방식 */}
                        <div className="mb-5">
                            {/* 필터 세부 영역 */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* 기간 버튼 + 날짜 입력 */}
                                        <div className="flex items-center gap-1 flex-wrap">
                                            {["1개월", "3개월", "6개월", "기간설정"].map((range) => (
                                                <Button
                                                    key={range}
                                                    size="sm"
                                                    variant={selectedRange === range ? "default" : "outline"}
                                                    onClick={() => setSelectedRange(range)}
                                                    className={`h-9 px-3 text-sm py-0 ${
                                                        selectedRange === range
                                                            ? "bg-indigo-600 hover:bg-indigo-700"
                                                            : "border-gray-300 text-gray-700 hover:border-indigo-300 hover:text-indigo-700"
                                                    }`}
                                                >
                                                    {range}
                                                </Button>
                                            ))}

                                            <Input
                                                type="date"
                                                value={customStart}
                                                onChange={(e) => setCustomStart(e.target.value)}
                                                disabled={selectedRange !== "기간설정"}
                                                className={`h-9 w-32 text-sm border-gray-300 ${
                                                    selectedRange !== "기간설정"
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "focus:border-indigo-500 focus:ring-indigo-500"
                                                }`}
                                            />
                                            <span className="text-gray-500 text-sm">~</span>
                                            <Input
                                                type="date"
                                                value={customEnd}
                                                onChange={(e) => setCustomEnd(e.target.value)}
                                                disabled={selectedRange !== "기간설정"}
                                                className={`h-9 w-32 text-sm border-gray-300 ${
                                                    selectedRange !== "기간설정"
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "focus:border-indigo-500 focus:ring-indigo-500"
                                                }`}
                                            />
                                        </div>

                                        {/* 상태 선택 */}
                                        <div className="w-32">
                                            <Select value={type} onValueChange={setType}>
                                                <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                                                    <SelectValue placeholder="상태 선택" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="전체">전체</SelectItem>
                                                    <SelectItem value="출금신청">진행 중</SelectItem>
                                                    <SelectItem value="출금완료">완료</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* 초기화 버튼 */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedRange("1개월")
                                                setType("전체")
                                            }}
                                            className="h-9 text-sm px-3 border-gray-300 text-gray-700 hover:border-gray-400"
                                        >
                                            <RotateCcw className="w-4 h-4 mr-1" />
                                            초기화
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 리스트 */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-gray-50 text-left border-t border-b border-gray-200">
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">포인트</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">요청날짜</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">완료날짜</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {paginated.length > 0 ? (
                                    paginated.map((item) => {
                                        // 출금 신청과 완료 날짜 구분 - 임시 데이터
                                        // 실제로는 API에서 두 날짜를 모두 받아와야 함
                                        // 날짜 정보 처리
                                        const requestDate =
                                            item.type === "출금신청" || item.type === "출금완료"
                                                ? item.date
                                                : "-";

                                        const completeDate =
                                            item.type === "출금완료" && item.completeDate
                                                ? item.completeDate
                                                : "-";

                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="py-4 px-4 text-sm font-medium text-gray-700">{item.id}</td>
                                                <td className="py-4 px-4 text-sm font-medium text-gray-700">
                                                    {Math.abs(item.point).toLocaleString()}P
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                                                            ${item.type === "출금신청"
                                                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                            : "bg-green-50 text-green-700 border border-green-200"}`}>
                                                            {item.type === "출금신청" ? "진행 중" : "완료"}
                                                        </span>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-500">{requestDate}</td>
                                                <td className="py-4 px-4 text-sm text-gray-500">{item.type === "출금완료" ? "2025-04-15" : "-"}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-400">
                                            내역이 없습니다.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* 페이징 */}
            {filtered.length > 0 && (
                <div className="flex justify-center items-center gap-1 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="rounded-full w-9 h-9 p-0 text-gray-600 border-gray-300 hover:text-indigo-700 hover:border-indigo-400"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </Button>

                    {Array.from({ length: Math.ceil(filtered.length / itemsPerPage) }, (_, i) => {
                        // 너무 많은 페이지 버튼이 생기지 않도록 처리
                        const pageNum = i + 1;
                        const totalPages = Math.ceil(filtered.length / itemsPerPage);

                        // 현재 페이지 주변 및 처음/끝 페이지만 표시
                        if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`rounded-full w-9 h-9 p-0 ${
                                        currentPage === pageNum
                                            ? "bg-indigo-600 hover:bg-indigo-700"
                                            : "text-gray-700 border-gray-300 hover:text-indigo-700 hover:border-indigo-400"
                                    }`}
                                >
                                    {pageNum}
                                </Button>
                            );
                        }

                        // 생략 표시 (...) - 중복 방지
                        if (
                            (pageNum === currentPage - 2 && pageNum > 2) ||
                            (pageNum === currentPage + 2 && pageNum < totalPages - 1)
                        ) {
                            return (
                                <span key={pageNum} className="text-gray-500 px-1">
                                    ...
                                </span>
                            );
                        }

                        return null;
                    })}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filtered.length / itemsPerPage), prev + 1))}
                        disabled={currentPage === Math.ceil(filtered.length / itemsPerPage)}
                        className="rounded-full w-9 h-9 p-0 text-gray-600 border-gray-300 hover:text-indigo-700 hover:border-indigo-400"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </Button>
                </div>
            )}
        </div>
    )
}

function PointSummaryCard({
                              label,
                              value,
                              color = "green",
                          }: {
    label: string
    value: number
    color?: "green" | "indigo" | "blue" | "red" | "complete"
}) {
    const colorMap = {
        green: {
            bg: "bg-gradient-to-r from-green-50 to-green-100",
            text: "text-green-700",
            border: "border-green-200",
            icon: "text-green-600 bg-white",
        },
        indigo: {
            bg: "bg-gradient-to-r from-indigo-50 to-indigo-100",
            text: "text-indigo-700",
            border: "border-indigo-200",
            icon: "text-indigo-600 bg-white",
        },
        blue: {
            bg: "bg-gradient-to-r from-blue-50 to-blue-100",
            text: "text-blue-700",
            border: "border-blue-200",
            icon: "text-blue-600 bg-white",
        },
        red: {
            bg: "bg-gradient-to-r from-red-50 to-red-100",
            text: "text-red-700",
            border: "border-red-200",
            icon: "text-red-600 bg-white",
        },
        complete: {
            bg: "bg-gradient-to-r from-green-50 to-green-100",
            text: "text-green-700",
            border: "border-green-200",
            icon: "text-green-600 bg-white",
        }
    }

    const { bg, text, border, icon } = colorMap[color]
    const Icon = iconMap[color]

    return (
        <div className={`rounded-lg p-5 shadow-sm border ${bg} ${border} flex items-center gap-4`}>
            <div className={`p-2.5 rounded-full ${icon} shadow-sm`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className={`text-xl font-bold ${text}`}>{value.toLocaleString()}P</p>
            </div>
        </div>
    )
}