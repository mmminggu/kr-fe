// src/components/admin/users/UserFilter.tsx
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

export default function UserFilter({ filterOptions, setFilterOptions }) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/4">
                <Select
                    value={filterOptions.status}
                    onValueChange={(value) => setFilterOptions({ ...filterOptions, status: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="계정 상태" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">전체 상태</SelectItem>
                        <SelectItem value="active">활성</SelectItem>
                        <SelectItem value="inactive">비활성</SelectItem>
                        <SelectItem value="suspended">정지</SelectItem>
                        <SelectItem value="pending">대기중</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full md:w-1/4">
                <Select
                    value={filterOptions.role}
                    onValueChange={(value) => setFilterOptions({ ...filterOptions, role: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="회원 유형" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">전체 유형</SelectItem>
                        <SelectItem value="admin">관리자</SelectItem>
                        <SelectItem value="client">업체</SelectItem>
                        <SelectItem value="reviewer">리뷰어</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full md:w-2/4">
                <Input
                    type="text"
                    placeholder="이름 또는 이메일로 검색"
                    value={filterOptions.search}
                    onChange={(e) => setFilterOptions({ ...filterOptions, search: e.target.value })}
                    className="w-full"
                />
            </div>
        </div>
    );
}