// src/components/admin/settlements/SettlementTable.tsx
'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
    MoreHorizontal,
    FileText,
    CheckCircle,
    XCircle,
    FileSpreadsheet
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {Pagination} from '@/src/components/ui/pagination';

// 정산 상태별 배지 스타일
const statusStyles = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

// 임시 데이터
const mockSettlements = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    clientName: `업체 ${i + 1}`,
    campaignName: `캠페인 ${i + 1}`,
    amount: Math.floor(Math.random() * 1000000) + 100000,
    status: i % 4 === 0 ? 'completed' : i % 4 === 1 ? 'pending' : i % 4 === 2 ? 'rejected' : 'processing',
    requestDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    completionDate: i % 4 === 0 ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0] : null,
}));

export default function SettlementTable({ filterOptions }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 필터링 로직
    const filteredSettlements = mockSettlements.filter(settlement => {
        if (filterOptions.status !== 'all' && settlement.status !== filterOptions.status) return false;

        // 기간 필터링 로직
        if (filterOptions.period === 'this-month') {
            const today = new Date();
            const requestDate = new Date(settlement.requestDate);
            if (requestDate.getMonth() !== today.getMonth() || requestDate.getFullYear() !== today.getFullYear()) return false;
        }

        if (filterOptions.search &&
            !settlement.clientName.includes(filterOptions.search) &&
            !settlement.campaignName.includes(filterOptions.search)) return false;

        return true;
    });

    // 페이지네이션 로직
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSettlements = filteredSettlements.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSettlements.length / itemsPerPage);

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>정산 ID</TableHead>
                        <TableHead>업체명</TableHead>
                        <TableHead>캠페인명</TableHead>
                        <TableHead>정산 금액</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>요청일</TableHead>
                        <TableHead>완료일</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentSettlements.map((settlement) => (
                        <TableRow key={settlement.id}>
                            <TableCell>{settlement.id}</TableCell>
                            <TableCell className="font-medium">{settlement.clientName}</TableCell>
                            <TableCell>{settlement.campaignName}</TableCell>
                            <TableCell>{settlement.amount.toLocaleString()}원</TableCell>
                            <TableCell>
                                <Badge className={statusStyles[settlement.status]}>
                                    {settlement.status === 'completed' ? '완료' :
                                        settlement.status === 'pending' ? '대기중' :
                                            settlement.status === 'rejected' ? '거부됨' : '처리중'}
                                </Badge>
                            </TableCell>
                            <TableCell>{settlement.requestDate}</TableCell>
                            <TableCell>{settlement.completionDate || '-'}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">메뉴 열기</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => window.location.href=`/admin/settlements/${settlement.id}`}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            <span>정산 상세 보기</span>
                                        </DropdownMenuItem>
                                        {settlement.status === 'pending' && (
                                            <>
                                                <DropdownMenuItem>
                                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                                    <span>정산 승인</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                                    <span>정산 거부</span>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        <DropdownMenuItem>
                                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                                            <span>정산서 다운로드</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    총 {filteredSettlements.length}건의 정산 중 {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSettlements.length)}건 표시
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}