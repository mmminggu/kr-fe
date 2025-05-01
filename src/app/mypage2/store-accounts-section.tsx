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
  const [selectedStore, setSelectedStore] = useState(selectedAccount?.storeName || "");

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
              <Button className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                계정 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
              {/* 헤더 영역 */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  스토어 계정 추가
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">새로운 스토어 계정 정보를 입력해주세요.</p>
              </div>

              <div className="py-4 px-6 space-y-3 max-h-[60vh] overflow-y-auto">
                {/* 1. 스토어명 + 와우회원 체크 */}
                <div className="flex items-center">
                  <div className="w-20 flex items-center">
                    <Store className="w-4 h-4 text-gray-400 mr-1" />
                    <label className="text-xs font-medium text-gray-500">스토어명</label>
                  </div>
                  <div className="flex gap-3 items-center flex-1">
                    <Select className="flex-1">
                      <SelectTrigger className="w-full border-gray-300 h-9 text-sm">
                        <SelectValue placeholder="스토어 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="쿠팡">쿠팡</SelectItem>
                        <SelectItem value="네이버">네이버</SelectItem>
                        <SelectItem value="올리브영">올리브영</SelectItem>
                        <SelectItem value="11번가">11번가</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* 와우 멤버십 체크박스 */}
                    <div className="flex items-center whitespace-nowrap">
                      <Checkbox
                          id="wowMember"
                          className="h-4 w-4 rounded text-blue-500"
                      />
                      <Label
                          htmlFor="wowMember"
                          className="ml-2 text-xs font-medium text-blue-600"
                      >
                        와우 멤버십
                      </Label>
                    </div>
                  </div>
                </div>

                {/* 2. 아이디 */}
                <div className="flex items-center">
                  <div className="w-20 flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-1" />
                    <label htmlFor="add-userId" className="text-xs font-medium text-gray-500">아이디</label>
                  </div>
                  <div className="flex-1">
                    <Input
                        id="add-userId"
                        className="w-full border-gray-300 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* 3. 이름 */}
                <div className="flex items-center">
                  <div className="w-20 flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-1" />
                    <label htmlFor="add-userName" className="text-xs font-medium text-gray-500">이름</label>
                  </div>
                  <div className="flex-1">
                    <Input
                        id="add-userName"
                        className="w-full border-gray-300 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* 4. 수취인 */}
                <div className="flex items-center">
                  <div className="w-20 flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-1" />
                    <label htmlFor="add-recipient" className="text-xs font-medium text-gray-500">수취인</label>
                  </div>
                  <div className="flex-1">
                    <Input
                        id="add-recipient"
                        className="w-full border-gray-300 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* 5. 연락처 정보 */}
                <div className="flex items-center">
                  <div className="w-20 flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-1" />
                    <label htmlFor="add-contact" className="text-xs font-medium text-gray-500">연락처</label>
                  </div>
                  <div className="flex-1">
                    <Input
                        id="add-contact"
                        className="w-full border-gray-300 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* 6. 배송지 정보 */}
                <div className="flex items-center">
                  <div className="w-20 flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <label className="text-xs font-medium text-gray-500">배송지</label>
                  </div>
                  <div className="flex gap-2 flex-1">
                    <Select className="flex-1">
                      <SelectTrigger className="w-full border-gray-300 h-9 text-sm">
                        <SelectValue placeholder="배송지 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="서울 강남구">서울 강남구</SelectItem>
                        <SelectItem value="서울 마포구">서울 마포구</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* 배송지 추가 버튼 */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded bg-blue-100 border-blue-300 text-blue-500 hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* 푸터 영역 */}
              <div className="flex items-center justify-end gap-3 px-6 py-3 bg-gray-50 border-t">
                <Button
                    variant="outline"
                    className="h-8 px-3 text-sm font-medium"
                >
                  취소
                </Button>
                <Button
                    type="submit"
                    className="h-8 px-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
                >
                  추가
                </Button>
              </div>
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
                {/* 헤더 부분 */}
                <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Image src={acc.storeLogo} alt={`${acc.storeName} 로고`} width={20} height={20} />
                    <span className="text-base font-semibold text-gray-900">{acc.storeName}</span>

                    {/* 와우회원 표시 */}
                    {acc.wowMember && (
                        <div className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-50 border border-blue-100">
                          <Image src="/logos/coupang_rocket_wow.png" alt="와우 멤버십" width={50} height={15} />
                        </div>
                    )}
                  </div>

                  <div className="flex gap-1.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 rounded-full bg-blue-50 text-blue-600"
                        onClick={() => handleViewDetails(acc)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span className="sr-only">수정</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 rounded-full bg-red-50 text-red-600"
                        onClick={() => console.log("삭제", acc.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
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

      {/* 스토어 계정 상세정보 수정 다이얼로그 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
          {/* 헤더 영역 */}
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Edit className="h-5 w-5" />
              스토어 계정 수정
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">계정 정보를 수정하실 수 있습니다.</p>
          </div>

          {/* 콘텐츠 영역 - 라벨과 입력란을 같은 행에 배치 */}
          {selectedAccount && (
              <div className="py-4 px-6 space-y-3 max-h-[60vh] overflow-y-auto">
                {/* 1. 스토어명 섹션 */}
                <div className="flex items-center">
                  <div className="w-20 flex items-center">
                    <Store className="w-4 h-4 text-gray-400 mr-1" />
                    <label className="text-xs font-medium text-gray-500">스토어명</label>
                  </div>
                  <div className="flex gap-3 items-center flex-1">
                    <Select
                        defaultValue={selectedAccount.storeName}
                        onValueChange={(value) => setSelectedStore(value)}
                        className="flex-1"
                    >
                      <SelectTrigger className="w-full border-gray-300 h-9 text-sm">
                        <SelectValue placeholder="스토어 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="쿠팡">쿠팡</SelectItem>
                        <SelectItem value="네이버">네이버</SelectItem>
                        <SelectItem value="올리브영">올리브영</SelectItem>
                        <SelectItem value="11번가">11번가</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* 와우 멤버십 체크박스 */}
                    {(selectedStore === "쿠팡" || (!selectedStore && selectedAccount.storeName === "쿠팡")) && (
                        <div className="flex items-center whitespace-nowrap">
                          <Checkbox
                              id="edit-wowMember"
                              defaultChecked={selectedAccount.wowMember}
                              className="h-4 w-4 rounded text-blue-500"
                          />
                          <Label
                              htmlFor="edit-wowMember"
                              className="ml-2 text-xs font-medium text-blue-600"
                          >
                            와우 멤버십
                          </Label>
                        </div>
                    )}
                  </div>
                </div>

                {/* 2. 아이디 */}
                <div className="flex items-center">
                  <div className="w-20 flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-1" />
                    <label htmlFor="edit-userId" className="text-xs font-medium text-gray-500">아이디</label>
                  </div>
                  <div className="flex-1">
                    <Input
                        id="edit-userId"
                        defaultValue={selectedAccount.userId}
                        onChange={(e) => console.log(`userId changed:`, e.target.value)}
                        className="w-full border-gray-300 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* 3. 이름 */}
                <div className="flex items-center">
                  <div className="w-20 flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-1" />
                    <label htmlFor="edit-name" className="text-xs font-medium text-gray-500">이름</label>
                  </div>
                  <div className="flex-1">
                    <Input
                        id="edit-name"
                        defaultValue={selectedAccount.userName ?? selectedAccount.name}
                        onChange={(e) => console.log(`name changed:`, e.target.value)}
                        className="w-full border-gray-300 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* 4. 수취인 */}
                <div className="flex items-center">
                  <div className="w-20 flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-1" />
                    <label htmlFor="edit-recipient" className="text-xs font-medium text-gray-500">수취인</label>
                  </div>
                  <div className="flex-1">
                    <Input
                        id="edit-recipient"
                        defaultValue={selectedAccount.recipient}
                        onChange={(e) => console.log(`recipient changed:`, e.target.value)}
                        className="w-full border-gray-300 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* 5. 연락처 정보 */}
                <div className="flex items-center">
                  <div className="w-20 flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-1" />
                    <label htmlFor="edit-contact" className="text-xs font-medium text-gray-500">연락처</label>
                  </div>
                  <div className="flex-1">
                    <Input
                        id="edit-contact"
                        defaultValue={selectedAccount.contact}
                        onChange={(e) => console.log(`contact changed:`, e.target.value)}
                        className="w-full border-gray-300 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* 6. 배송지 정보 */}
                <div className="flex items-center">
                  <div className="w-20 flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <label className="text-xs font-medium text-gray-500">배송지</label>
                  </div>
                  <div className="flex gap-2 flex-1">
                    <Select defaultValue="current" className="flex-1">
                      <SelectTrigger className="w-full border-gray-300 h-9 text-sm">
                        <SelectValue placeholder="배송지 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">{selectedAccount.address}</SelectItem>
                        <SelectItem value="home">집</SelectItem>
                        <SelectItem value="office">회사</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* 배송지 추가 버튼 */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded bg-blue-100 border-blue-300 text-blue-500 hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
          )}

          {/* 푸터 영역 */}
          <div className="flex items-center justify-end gap-3 px-6 py-3 bg-gray-50 border-t">
            <Button
                variant="outline"
                onClick={() => setShowDetailDialog(false)}
                className="h-8 px-3 text-sm font-medium"
            >
              취소
            </Button>
            <Button
                type="submit"
                className="h-8 px-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              수정
            </Button>
          </div>
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
      <div className="flex items-start gap-2 bg-gray-100 rounded px-2 py-1">
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
