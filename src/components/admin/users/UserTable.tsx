// src/components/admin/users/UserTable.tsx
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
    Edit,
    Trash,
    Lock,
    MessageSquare
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {Pagination} from '@/src/components/ui/pagination';

// 사용자 상태별 배지 스타일
const statusStyles = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

// 회원 유형별 배지 스타일
const roleStyles = {
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    client: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    reviewer: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
};

// 임시 데이터
const mockUsers = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    name: `사용자 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'client' : 'reviewer',
    status: i % 4 === 0 ? 'active' : i % 4 === 1 ? 'inactive' : i % 4 === 2 ? 'suspended' : 'pending',
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0],
}));

export default function UserTable({ filterOptions }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 필터링 로직
    const filteredUsers = mockUsers.filter(user => {
        if (filterOptions.status !== 'all' && user.status !== filterOptions.status) return false;
        if (filterOptions.role !== 'all' && user.role !== filterOptions.role) return false;
        if (filterOptions.search && !user.name.includes(filterOptions.search) && !user.email.includes(filterOptions.search)) return false;
        return true;
    });

    // 페이지네이션 로직
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>회원 ID</TableHead>
                        <TableHead>이름</TableHead>
                        <TableHead>이메일</TableHead>
                        <TableHead>유형</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>가입일</TableHead>
                        <TableHead>최근 접속일</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge className={roleStyles[user.role]}>
                                    {user.role === 'admin' ? '관리자' : user.role === 'client' ? '업체' : '리뷰어'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={statusStyles[user.status]}>
                                    {user.status === 'active' ? '활성' :
                                        user.status === 'inactive' ? '비활성' :
                                            user.status === 'suspended' ? '정지' : '대기중'}
                                </Badge>
                            </TableCell>
                            <TableCell>{user.joinDate}</TableCell>
                            <TableCell>{user.lastActive}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">메뉴 열기</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => window.location.href=`/admin/users/${user.id}`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>회원 정보 수정</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Lock className="mr-2 h-4 w-4" />
                                            <span>계정 상태 변경</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            <span>메시지 보내기</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">
                                            <Trash className="mr-2 h-4 w-4" />
                                            <span>회원 삭제</span>
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
                    총 {filteredUsers.length}명의 회원 중 {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)}명 표시
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