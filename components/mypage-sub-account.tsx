"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Trash2, User, Phone, MapPin, CreditCard } from "lucide-react"
import Image from "next/image"

interface StoreAccount {
    id: number
    storeName: string
    storeLogo: string
    userId: string
    userName: string
    depositor: string
    receiver: string
    accountNumber: string
    bank: string
    phone: string
    address: string
}

const mockAccounts: StoreAccount[] = [
    {
        id: 1,
        storeName: "쿠팡",
        storeLogo: "/logos/coupang.png",
        userId: "honggil",
        userName: "홍길동",
        depositor: "홍길동",
        receiver: "홍길동",
        accountNumber: "1234567890",
        bank: "국민은행",
        phone: "010-1111-2222",
        address: "서울시 강남구 테헤란로 123",
    },
    {
        id: 2,
        storeName: "네이버",
        storeLogo: "/logos/naver.png",
        userId: "kimyh",
        userName: "김영희",
        depositor: "김영희",
        receiver: "김영희",
        accountNumber: "9876543210",
        bank: "신한은행",
        phone: "010-2222-3333",
        address: "서울시 마포구 월드컵북로 456",
    },
]

export default function StoreAccountSection() {
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 4

    const filtered = useMemo(() => {
        return mockAccounts.filter((acc) =>
            acc.storeName.includes(search) || acc.userName.includes(search)
        )
    }, [search])

    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-900">스토어 계정 관리</h3>
                <Button size="sm">+ 계정 추가</Button>
            </div>

            <Input
                placeholder="스토어명, 아이디, 이름 검색"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                }}
                className="w-full sm:w-96"
            />

            <div className="grid grid-cols-1 gap-3 text-sm">
                {paginated.map((acc) => (
                    <div key={acc.id} className="border rounded-lg p-3 shadow-sm bg-white space-y-4">
                        {/* 상단: 로고 + 스토어명 + 버튼 */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Image src={acc.storeLogo} alt={`${acc.storeName} 로고`} width={20} height={20} />
                                <span className="text-base font-bold text-gray-900">{acc.storeName}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-1" />
                                    상세보기
                                </Button>
                                <Button size="sm" variant="destructive">
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    삭제
                                </Button>
                            </div>
                        </div>

                        {/* 정보 레이아웃 */}
                        <div className="grid grid-cols-4 md:grid-cols-4 gap-2 text-xs">
                            <InfoItem icon={<User className="w-3 h-3" />} label="아이디" value={acc.userId} />
                            <InfoItem icon={<User className="w-3 h-3" />} label="이름" value={acc.userName} />
                            <InfoItem icon={<User className="w-3 h-3" />} label="예금주" value={acc.depositor} />
                            <InfoItem icon={<User className="w-3 h-3" />} label="수취인" value={acc.receiver} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                            <InfoItem icon={<Phone className="w-3 h-3" />} label="연락처" value={acc.phone} />
                            <InfoItem icon={<CreditCard className="w-3 h-3" />} label="계좌" value={`${acc.bank} ${acc.accountNumber}`} />
                            <InfoItem icon={<MapPin className="w-3 h-3" />} label="배송지" value={acc.address} />
                        </div>


                    </div>
                ))}
            </div>
        </section>
    )
}

function InfoItem({
                      icon,
                      label,
                      value,
                      full = false,
                  }: {
    icon: React.ReactNode
    label: string
    value: string
    full?: boolean
}) {
    return (
        <div className={`flex justify-between items-center border rounded bg-gray-50 p-2 ${full ? "col-span-full" : ""}`}>
            <div className="flex items-center gap-1 text-gray-500">
                {icon}
                <span>{label}</span>
            </div>
            <p className="text-gray-800 font-medium text-right">{value}</p>
        </div>
    )
}
