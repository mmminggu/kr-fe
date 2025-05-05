// src/components/admin/shops/ShopFilter.tsx
'use client';

import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/select';
import { Input } from '@/src/components/ui/input';

export default function ShopFilter({ filterOptions, setFilterOptions }) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/4">
                <Select
                    value={filterOptions.status}
                    onValueChange={(value) => setFilterOptions({ ...filterOptions, status: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="쇼핑몰 상태" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">전체 상태</SelectItem>
                        <SelectItem value="active">활성</SelectItem>
                        <SelectItem value="inactive">비활성</SelectItem>
                        <SelectItem value="pending">승인대기</SelectItem>
                        <SelectItem value="suspended">정지</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full md:w-1/4">
                <Select
                    value={filterOptions.category}
                    onValueChange={(value) => setFilterOptions({ ...filterOptions, category: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="카테고리" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">전체 카테고리</SelectItem>
                        <SelectItem value="fashion">패션</SelectItem>
                        <SelectItem value="beauty">뷰티</SelectItem>
                        <SelectItem value="food">식품</SelectItem>
                        <SelectItem value="electronics">전자기기</SelectItem>
                        <SelectItem value="home">홈/리빙</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full md:w-2/4">
                <Input
                    type="text"
                    placeholder="쇼핑몰명 검색"
                    value={filterOptions.search}
                    onChange={(e) => setFilterOptions({ ...filterOptions, search: e.target.value })}
                    className="w-full"
                />
            </div>
        </div>
    );
}