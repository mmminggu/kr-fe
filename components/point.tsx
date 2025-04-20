"use client"

import { useEffect, useMemo, useState } from "react"
import { format, parseISO, subDays, subMonths } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    PiggyBank,
    Wallet,
    RotateCcw,
    MinusCircle,
} from "lucide-react"

type PointRecord = {
    id: number
    campaign: string
    type: "적립" | "출금" | "차감"
    point: number
    date: string
}

const iconMap = {
    green: PiggyBank,
    indigo: Wallet,
    blue: RotateCcw,
    red: MinusCircle,
}

const sampleData: PointRecord[] = [
    { id: 1, campaign: "프리미엄 커피 리뷰", type: "적립", point: 1500, date: "2025-04-12" },
    { id: 2, campaign: "헤어케어 제품", type: "차감", point: -3000, date: "2025-04-11" },
    { id: 3, campaign: "스킨케어 후기", type: "출금", point: -10000, date: "2025-04-10" },
    { id: 4, campaign: "리뷰 미작성 패널티", type: "차감", point: -2000, date: "2025-04-09" },
    { id: 5, campaign: "건강기능식품 리뷰", type: "적립", point: 5000, date: "2025-04-08" },
    { id: 6, campaign: "테스트 캠페인", type: "적립", point: 3000, date: "2025-04-07" },
    { id: 7, campaign: "캠페인 AAAA", type: "출금", point: -2000, date: "2025-04-06" },
    { id: 8, campaign: "테스트 캠페인", type: "적립", point: 3000, date: "2025-04-07" },
    { id: 9, campaign: "캠페인 A", type: "출금", point: -2000, date: "2025-04-06" },
    { id: 10, campaign: "캠페인 A", type: "출금", point: -2000, date: "2025-04-06" },
    { id: 11, campaign: "테스트 캠페인", type: "적립", point: 3000, date: "2025-04-07" },
    { id: 12, campaign: "캠페인 A", type: "출금", point: -2000, date: "2025-04-06" },
]

const dateRanges = {
    "1주일": () => [subDays(new Date(), 7), new Date()],
    "1개월": () => [subMonths(new Date(), 1), new Date()],
    "3개월": () => [subMonths(new Date(), 3), new Date()],
    "6개월": () => [subMonths(new Date(), 6), new Date()],
}

export default function PointPage() {
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

    const filtered = useMemo(() => {
        return sampleData.filter((item) => {
            const itemDate = parseISO(item.date)
            const from = customStart ? parseISO(customStart) : null
            const to = customEnd ? parseISO(customEnd) : null

            const matchDate = from && to ? itemDate >= from && itemDate <= to : true
            const matchType = type === "전체" || item.type === type
            const matchKeyword = item.campaign.includes(keyword)

            return matchDate && matchType && matchKeyword
        })
    }, [customStart, customEnd, type, keyword])

    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-bold">포인트 내역 / 관리</h2>

            {/* === 포인트 현황 카드 === */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <PointSummaryCard label="총 적립 포인트" value={16500} color="green" />
                <PointSummaryCard label="출금 가능 포인트" value={12000} color="indigo" />
                <PointSummaryCard label="출금 진행 중" value={3000} color="blue" />
                <PointSummaryCard label="차감 포인트" value={5000} color="red" />
            </div>


            {/* === 출금 신청 영역 === */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-4 border p-4 rounded-lg bg-white shadow-sm">
                <label className="text-sm font-medium text-gray-700">출금신청 포인트</label>
                <Input type="number" placeholder="포인트 입력" className="w-full sm:w-60" />
                <Button className="w-full sm:w-auto">신청</Button>
            </div>


            {/* 필터 */}
            <div className="space-y-4 border rounded-xl p-4 bg-white shadow-sm text-sm">
                <div className="flex flex-wrap gap-2">
                    {["1주일", "1개월", "3개월", "6개월", "기간설정"].map((range) => (
                        <Button
                            key={range}
                            size="sm"
                            variant={selectedRange === range ? "default" : "outline"}
                            onClick={() => setSelectedRange(range)}
                        >
                            {range}
                        </Button>
                    ))}
                </div>

                {selectedRange === "기간설정" && (
                    <div className="flex gap-2">
                        <Input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                        />
                        <span className="text-gray-500">~</span>
                        <Input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                        />
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="타입 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="전체">전체</SelectItem>
                            <SelectItem value="적립">적립</SelectItem>
                            <SelectItem value="차감">차감</SelectItem>
                            <SelectItem value="출금">출금</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="캠페인명 검색"
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>
            </div>

            {/* 리스트 */}
            <div className="border rounded-xl bg-white p-4 shadow-sm text-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-500 text-xs border-b">
                    <tr>
                        <th className="py-2 px-2">번호</th>
                        <th className="px-2">캠페인</th>
                        <th className="px-2">타입</th>
                        <th className="px-2">포인트</th>
                        <th className="px-2">날짜</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginated.length > 0 ? (
                        paginated.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-2 px-2">{item.id}</td>
                                <td className="px-2">{item.campaign}</td>
                                <td className="px-2">{item.type}</td>
                                <td
                                    className={`px-2 ${
                                        item.point >= 0 ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {item.point > 0
                                        ? `+${item.point.toLocaleString()}P`
                                        : `${item.point.toLocaleString()}P`}
                                </td>
                                <td className="px-2">{item.date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-4 text-gray-400">
                                내역이 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>


            {/* 페이징 */}
            <div className="flex justify-center gap-2">
                {Array.from({ length: Math.ceil(filtered.length / itemsPerPage) }, (_, i) => (
                    <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </Button>
                ))}
            </div>
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
    color?: "green" | "indigo" | "blue" | "red"
}) {
    const colorMap = {
        green: {
            bg: "bg-green-50",
            text: "text-green-700",
            border: "border-green-200",
        },
        indigo: {
            bg: "bg-indigo-50",
            text: "text-indigo-700",
            border: "border-indigo-200",
        },
        blue: {
            bg: "bg-blue-50",
            text: "text-blue-700",
            border: "border-blue-200",
        },
        red: {
            bg: "bg-red-50",
            text: "text-red-700",
            border: "border-red-200",
        },
    }

    const { bg, text, border } = colorMap[color]
    const Icon = iconMap[color]

    return (
        <div className={`rounded-lg p-4 shadow-sm border ${bg} ${border} flex items-center gap-3`}>
            <div className={`p-2 rounded-full ${text} bg-white shadow-sm`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`text-2xl font-bold ${text}`}>{value.toLocaleString()}P</p>
            </div>
        </div>
    )
}
