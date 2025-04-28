"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Eye, Trash2, User, Mail, Phone, MapPin, CreditCard, Store, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Checkbox } from "@/src/components/ui/checkbox"; // 와우회원 체크용
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination"
import { Plus, Search, Edit } from "lucide-react"
import Image from "next/image"

// Mock data for store accounts
const mockStoreAccounts = [
  {
    id: 1,
    storeName: "쿠팡",
    storeLogo: "/logos/coupang.png",
    userId: "honggil",
    userName: "홍길동",
    accountHolder: "홍길동",
    recipient: "홍길동",
    accountNumber: "1234567890",
    bank: "국민은행",
    contact: "010-1234-5678",
    depositor: "홍길동",
    phone: "010-1111-2222",
    receiver: "홍길동",
    address: "서울시 강남구 테헤란로 123, 테헤란로 아파트 1단지 207동 1045호",
    wowMember: true
  },
  {
    id: 2,
    storeName: "네이버",
    storeLogo: "/logos/naver.png",
    userId: "kimcs",
    userName: "김철수",
    accountHolder: "김철수",
    recipient: "김철수",
    accountNumber: "987-654-321",
    bank: "국민은행",
    contact: "010-8765-4321",
    depositor: "김철수",
    phone: "010-1111-2222",
    receiver: "김철수",
    address: "서울시 마포구 월드컵북로 456",
    wowMember: false
  },
  {
    id: 3,
    storeName: "올리브영",
    storeLogo: "/logos/oliveyoung.jpg",
    userId: "leeyh",
    userName: "이영희",
    name: "이영희",
    accountHolder: "이영희",
    recipient: "이영희",
    bank: "신한은행",
    contact: "010-8765-4321",
    depositor: "이영희",
    phone: "010-1111-2222",
    receiver: "이영희",
    address: "서울시 송파구",
    wowMember: false
  },
  {
    id: 4,
    storeName: "쿠팡",
    storeLogo: "/logos/coupang.png",
    userId: "honggil",
    userName: "김영희",
    accountHolder: "김영희",
    recipient: "김영희",
    accountNumber: "1234567890",
    bank: "국민은행",
    contact: "010-1234-5678",
    depositor: "김영희",
    phone: "010-1111-2222",
    receiver: "김영희",
    address: "서울시 강남구 테헤란로 123, 테헤란로 아파트 1단지 207동 1045호",
    wowMember: false
  },
]

export function StoreAccountsSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("storeName")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const itemsPerPage = 5
  const totalPages = Math.ceil(mockStoreAccounts.length / itemsPerPage)

  const filteredAccounts = mockStoreAccounts.filter((account) => {
    if (!searchTerm) return true
    return account[searchType].toLowerCase().includes(searchTerm.toLowerCase())
  })

  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleViewDetails = (account) => {
    setSelectedAccount(account)
    setShowDetailDialog(true)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>스토어 계정관리</CardTitle>
            <CardDescription>스토어 계정 정보를 관리하실 수 있습니다.</CardDescription>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                계정 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[600px] w-full">
              <DialogHeader>
                <DialogTitle>스토어 계정 추가</DialogTitle>
                <DialogDescription>새로운 스토어 계정 정보를 입력해주세요.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-sm">
                {/* 1행: 스토어명 (Select 넓게) + 와우회원 체크 */}
                <div className="flex items-start border rounded-md px-3 py-2 gap-2 bg-gray-50">
                  <div className="flex items-center gap-1 text-gray-500 min-w-[70px] pt-[5px]">
                    <Store className="w-3 h-3" />
                    <span>스토어명</span>
                  </div>

                  {/* Select + 체크박스 같은 줄에 */}
                  <div className="flex gap-2 flex-1 items-center">
                    <Select>
                      <SelectTrigger className="w-[250px] text-sm h-8 px-2 border rounded">
                        <SelectValue placeholder="스토어 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="쿠팡">쿠팡</SelectItem>
                        <SelectItem value="네이버">네이버</SelectItem>
                        <SelectItem value="올리브영">올리브영</SelectItem>
                        <SelectItem value="11번가">11번가</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* 와우회원 체크박스 */}
                    <div className="flex items-center gap-1 text-blue-500 text-xs ml-5">
                      <Checkbox id="wowMember" />
                      <Label htmlFor="wowMember" className="flex items-center gap-1 ml-1">
                        와우회원
                      </Label>
                    </div>
                  </div>
                </div>

                {/* 2행: 아이디 + 이름 */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "add-userId", label: "아이디", icon: <User className="w-3 h-3" /> },
                    { id: "add-userName", label: "이름", icon: <User className="w-3 h-3" /> },
                  ].map(({ id, label, icon }) => (
                      <div key={id} className="flex items-start border rounded-md px-3 py-2 gap-2 bg-gray-50">
                        <div className="flex items-center gap-1 text-gray-500 min-w-[70px] pt-[5px]">
                          {icon}
                          <span>{label}</span>
                        </div>
                        <Input id={id} className="flex-1 text-sm h-8 px-2" />
                      </div>
                  ))}
                </div>

                {/* 3행: 수취인 + 연락처 */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "add-recipient", label: "수취인", icon: <User className="w-3 h-3" /> },
                    { id: "add-contact", label: "연락처", icon: <Phone className="w-3 h-3" /> },
                  ].map(({ id, label, icon }) => (
                      <div key={id} className="flex items-start border rounded-md px-3 py-2 gap-2 bg-gray-50">
                        <div className="flex items-center gap-1 text-gray-500 min-w-[70px] pt-[5px]">
                          {icon}
                          <span>{label}</span>
                        </div>
                        <Input id={id} className="flex-1 text-sm h-8 px-2" />
                      </div>
                  ))}
                </div>

                {/* 배송지 Select + 배송지 추가 버튼 (아이콘만) */}
                <div className="flex items-start border rounded-md px-3 py-2 gap-2 bg-gray-50">
                  <div className="flex items-center gap-1 text-gray-500 min-w-[70px] pt-[5px]">
                    <MapPin className="w-3 h-3" />
                    <span>배송지</span>
                  </div>
                  <div className="flex gap-2 flex-1 items-center">
                    <Select>
                      <SelectTrigger className="w-full text-sm h-8 px-2 border rounded">
                        <SelectValue placeholder="배송지 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="서울 강남구">서울 강남구</SelectItem>
                        <SelectItem value="서울 마포구">서울 마포구</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* 배송지 추가 아이콘 버튼 (같은 줄) */}
                    <Button variant="outline" size="icon" className="h-8 w-8 min-w-0 bg-blue-50 border-blue-200">
                      <Plus className="w-4 h-4 text-blue-500" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter className="">
                <Button type="submit">저장하기</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="검색 조건" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="storeName">스토어명</SelectItem>
              <SelectItem value="userId">아이디</SelectItem>
              <SelectItem value="name">이름</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex w-full">
            <Input
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" className="ml-2">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {paginatedAccounts.map((acc) => (
              <div key={acc.id} className="border rounded-lg p-3 shadow-sm bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Image src={acc.storeLogo} alt={`${acc.storeName} 로고`} width={20} height={20} />
                    <span className="text-base font-bold text-gray-900">{acc.storeName}</span>

                    {/* ✅ 와우회원 표시 */}
                    {acc.wowMember && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium">
                          <Image src="/logos/coupang_rocket_wow.png" alt={`${acc.storeName} 로고`} width={50}
                                 height={15}/>
                        </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(acc)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">수정</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => console.log("삭제", acc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">삭제</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <InfoBlock icon={<User className="w-3 h-3" />} label="아이디" value={acc.userId} />
                    <InfoBlock icon={<User className="w-3 h-3" />} label="이름" value={acc.userName} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <InfoBlock icon={<User className="w-3 h-3" />} label="수취인" value={acc.receiver} />
                    <InfoBlock icon={<Phone className="w-3 h-3" />} label="연락처" value={acc.phone} />
                  </div>
                  <InfoBlock icon={<MapPin className="w-3 h-3" />} label="배송지" value={acc.address} />
                </div>
              </div>
          ))}
        </div>

        <Pagination>
          <PaginationContent>
            {/*<PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>*/}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink isActive={currentPage === page} onClick={() => setCurrentPage(page)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            {/*<PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>*/}
          </PaginationContent>
        </Pagination>
      </CardContent>

      {/* Detail/Edit Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>스토어 계정 상세정보</DialogTitle>
            <DialogDescription>스토어 계정 정보를 수정하실 수 있습니다.</DialogDescription>
          </DialogHeader>
          {selectedAccount && (
              <div className="grid gap-4 py-4">
                {[
                  {
                    id: "edit-storeName",
                    label: "스토어명",
                    icon: <Store className="w-3 h-3" />,
                    value: selectedAccount.storeName,
                  },
                  {
                    id: "edit-userId",
                    label: "아이디",
                    icon: <User className="w-3 h-3" />,
                    value: selectedAccount.userId,
                  },
                  {
                    id: "edit-name",
                    label: "이름",
                    icon: <User className="w-3 h-3" />,
                    value: selectedAccount.userName ?? selectedAccount.name,
                  },
                  {
                    id: "edit-recipient",
                    label: "수취인",
                    icon: <User className="w-3 h-3" />,
                    value: selectedAccount.recipient,
                  },
                  {
                    id: "edit-contact",
                    label: "연락처",
                    icon: <Phone className="w-3 h-3" />,
                    value: selectedAccount.contact,
                  },
                  {
                    id: "edit-address",
                    label: "배송지",
                    icon: <MapPin className="w-3 h-3" />,
                    value: selectedAccount.address,
                  },
                ].map(({ id, label, icon, value }) => (
                    <div
                        key={id}
                        className="flex items-start border rounded-md px-3 py-2 gap-2 bg-gray-50"
                    >
                      <div className="flex items-center gap-1 text-gray-500 text-sm min-w-[70px] pt-[5px]">
                        {icon}
                        <span>{label}</span>
                      </div>
                      <Input id={id} defaultValue={value} className="flex-1 text-sm h-8 px-2" />
                    </div>
                ))}
              </div>
          )}
          <DialogFooter>
            <Button type="submit">저장하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
function InfoBlock({
                     icon,
                     label,
                     value,
                   }: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
      <div className="flex items-start gap-2 border bg-gray-50 rounded px-2 py-1">
        {/* 고정 너비 라벨 영역 */}
        <div className="flex items-center gap-1 text-gray-500 text-[11px] min-w-[40px] shrink-0">
          {icon}
          <span>{label}</span>
        </div>

        {/* 값 영역 (줄바꿈 포함) */}
        <p className="text-gray-800 font-medium text-xs whitespace-pre-wrap break-words">
          {value}
        </p>
      </div>
  )
}
