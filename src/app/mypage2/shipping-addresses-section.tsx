"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
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
import { Badge } from "@/src/components/ui/badge"
import { Plus, Search, Home, Trash2, Check } from "lucide-react"

// Mock data for shipping addresses
const mockAddresses = [
  { id: 1, name: "집", address: "서울시 강남구 테헤란로 123", isDefault: true },
  { id: 2, name: "회사", address: "서울시 서초구 서초대로 456", isDefault: false },
  { id: 3, name: "부모님댁", address: "경기도 성남시 분당구 789", isDefault: false },
]

export function ShippingAddressesSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("name")
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5
  const totalPages = Math.ceil(mockAddresses.length / itemsPerPage)

  const filteredAddresses = mockAddresses.filter((address) => {
    if (!searchTerm) return true
    // @ts-ignore
    return address[searchType].toLowerCase().includes(searchTerm.toLowerCase())
  })

  const paginatedAddresses = filteredAddresses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>배송지관리</CardTitle>
            <CardDescription>배송지 정보를 관리하실 수 있습니다.</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                배송지 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>배송지 추가</DialogTitle>
                <DialogDescription>새로운 배송지 정보를 입력해주세요.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="addressName" className="text-right">
                    주소명
                  </Label>
                  <Input id="addressName" placeholder="예: 집, 회사" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    주소
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex gap-2">
                      <Input id="zipcode" placeholder="우편번호" className="w-32" />
                      <Button variant="outline">주소 검색</Button>
                    </div>
                    <Input id="address1" placeholder="기본 주소" />
                    <Input id="address2" placeholder="상세 주소" />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="col-span-4 flex items-center space-x-2">
                    <input type="checkbox" id="defaultAddress" className="rounded border-gray-300" />
                    <Label htmlFor="defaultAddress">기본 배송지</Label>
                  </div>
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
              <SelectItem value="name">주소명</SelectItem>
              <SelectItem value="address">주소</SelectItem>
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

        {/*<div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>주소명</TableHead>
                <TableHead>주소</TableHead>
                <TableHead>기본 배송지</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAddresses.length > 0 ? (
                paginatedAddresses.map((address) => (
                  <TableRow key={address.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        {address.name}
                      </div>
                    </TableCell>
                    <TableCell>{address.address}</TableCell>
                    <TableCell>
                      {address.isDefault ? (
                        <Badge variant="default" className="bg-green-500">
                          <Check className="h-3 w-3 mr-1" />
                          기본 배송지
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm">
                          기본 배송지로 설정
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:ml-2">삭제</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    등록된 배송지가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
*/}
        {/* 카드 리스트로 변환 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedAddresses.length > 0 ? (
              paginatedAddresses.map((address) => (
                  <div
                      key={address.id}
                      className="border rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-semibold text-gray-900">
                        <Home className="w-4 h-4 text-gray-500" />
                        <span>{address.name}</span>
                        {address.isDefault && (
                            <Badge variant="default" className="bg-green-500 text-white ml-2">
                              <Check className="h-3 w-3 mr-1" />
                              기본
                            </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{address.address}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                      {!address.isDefault && (
                          <Button size="sm" variant="outline">
                            기본 배송지
                          </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only">삭제</span>
                      </Button>
                    </div>
                  </div>
              ))
          ) : (
              <div className="text-center col-span-full py-8 text-gray-500">
                등록된 배송지가 없습니다.
              </div>
          )}
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
    </Card>
  )
}
