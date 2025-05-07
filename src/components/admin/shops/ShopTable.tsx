// src/components/admin/shops/ShopTable.tsx
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
    ExternalLink,
    BarChart2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {Pagination} from '@/src/components/ui/pagination';
import Image from 'next/image';

// 쇼핑몰 상태별
// src/components/admin/shops/ShopTable.tsx (계속)
// 쇼핑몰 상태별 배지 스타일
const statusStyles = {
    active: 'bg-green-100 text-green-800  ',
    inactive: 'bg-gray-100 text-gray-800  ',
    pending: 'bg-yellow-100 text-yellow-800  ',
    suspended: 'bg-red-100 text-red-800  ',
};

// 쇼핑몰 카테고리별 배지 스타일
const categoryStyles = {
    fashion: 'bg-purple-100 text-purple-800  ',
    beauty: 'bg-pink-100 text-pink-800  ',
    food: 'bg-orange-100 text-orange-800  ',
    electronics: 'bg-blue-100 text-blue-800  ',
    home: 'bg-teal-100 text-teal-800  ',
};

// 임시 데이터
const mockShops = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    name: `쇼핑몰 ${i + 1}`,
    logo: '/placeholder-logo.png', // 실제 구현에서는 실제 로고 URL로 대체
    url: `https://shop${i + 1}.example.com`,
    category: i % 5 === 0 ? 'fashion' : i % 5 === 1 ? 'beauty' : i % 5 === 2 ? 'food' : i % 5 === 3 ? 'electronics' : 'home',
    status: i % 4 === 0 ? 'active' : i % 4 === 1 ? 'inactive' : i % 4 === 2 ? 'pending' : 'suspended',
    registrationDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    campaignCount: Math.floor(Math.random() * 20),
}));

export default function ShopTable({ filterOptions }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 필터링 로직
    const filteredShops = mockShops.filter(shop => {
        if (filterOptions.status !== 'all' && shop.status !== filterOptions.status) return false;
        if (filterOptions.category !== 'all' && shop.category !== filterOptions.category) return false;
        if (filterOptions.search && !shop.name.includes(filterOptions.search)) return false;
        return true;
    });

    // 페이지네이션 로직
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentShops = filteredShops.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredShops.length / itemsPerPage);

    const getCategoryName = (category) => {
        switch(category) {
            case 'fashion': return '패션';
            case 'beauty': return '뷰티';
            case 'food': return '식품';
            case 'electronics': return '전자기기';
            case 'home': return '홈/리빙';
            default: return category;
        }
    };

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>쇼핑몰명</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>카테고리</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>등록일</TableHead>
                        <TableHead>캠페인 수</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentShops.map((shop) => (
                        <TableRow key={shop.id}>
                            <TableCell>{shop.id}</TableCell>
                            <TableCell className="font-medium">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 mr-2 relative">
                                        <Image
                                            src={shop.logo}
                                            alt={`${shop.name} 로고`}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-full"
                                        />
                                    </div>
                                    {shop.name}
                                </div>
                            </TableCell>
                            <TableCell>
                                <a href={shop.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                                    {shop.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                            </TableCell>
                            <TableCell>
                                <Badge className={categoryStyles[shop.category]}>
                                    {getCategoryName(shop.category)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={statusStyles[shop.status]}>
                                    {shop.status === 'active' ? '활성' :
                                        shop.status === 'inactive' ? '비활성' :
                                            shop.status === 'pending' ? '승인대기' : '정지'}
                                </Badge>
                            </TableCell>
                            <TableCell>{shop.registrationDate}</TableCell>
                            <TableCell>{shop.campaignCount}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">메뉴 열기</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => window.location.href=`/admin/shops/${shop.id}`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>쇼핑몰 정보 수정</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <BarChart2 className="mr-2 h-4 w-4" />
                                            <span>쇼핑몰 통계 보기</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">
                                            <Trash className="mr-2 h-4 w-4" />
                                            <span>쇼핑몰 삭제</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500 ">
                    총 {filteredShops.length}개의 쇼핑몰 중 {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredShops.length)}개 표시
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