"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, Trash2, User, Mail, Phone, MapPin, CreditCard, Store } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>스토어 계정 추가</DialogTitle>
                <DialogDescription>새로운 스토어 계정 정보를 입력해주세요.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="storeName" className="text-right">
                    스토어명
                  </Label>
                  <Input id="storeName" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="userId" className="text-right">
                    아이디
                  </Label>
                  <Input id="userId" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    이름
                  </Label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="accountHolder" className="text-right">
                    예금주
                  </Label>
                  <Input id="accountHolder" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipient" className="text-right">
                    수취인
                  </Label>
                  <Input id="recipient" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="accountNumber" className="text-right">
                    계좌번호
                  </Label>
                  <Input id="accountNumber" className="col-span-3" placeholder="은행명 포함" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">
                    연락처
                  </Label>
                  <Input id="contact" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    배송지
                  </Label>
                  <Input id="address" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
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
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(acc)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">수정</span>
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => console.log("삭제", acc.id)}>
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
                    <InfoBlock icon={<User className="w-3 h-3" />} label="예금주" value={acc.depositor} />
                    <InfoBlock icon={<User className="w-3 h-3" />} label="수취인" value={acc.receiver} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <InfoBlock icon={<CreditCard className="w-3 h-3" />} label="계좌" value={`${acc.bank} ${acc.accountNumber}`} />
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
                    id: "edit-accountHolder",
                    label: "예금주",
                    icon: <User className="w-3 h-3" />,
                    value: selectedAccount.accountHolder,
                  },
                  {
                    id: "edit-recipient",
                    label: "수취인",
                    icon: <User className="w-3 h-3" />,
                    value: selectedAccount.recipient,
                  },
                  {
                    id: "edit-accountNumber",
                    label: "계좌번호",
                    icon: <CreditCard className="w-3 h-3" />,
                    value: selectedAccount.accountNumber,
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
