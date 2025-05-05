// src/components/admin/settlements/SettlementFilter.tsx
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

export default function SettlementFilter({ filterOptions, setFilterOptions }) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/4">
                <Select
                    value={filterOptions.status}
                    onValueChange={(value) => setFilterOptions({ ...filterOptions, status: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="정산 상태" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">전체 상태</SelectItem>
                        <SelectItem value="completed">완료</SelectItem>
                        <SelectItem value="pending">대기중</SelectItem>
                        <SelectItem value="rejected">거부됨</SelectItem>
                        <SelectItem value="processing">처리중</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full md:w-1/4">
                <Select
                    value={filterOptions.period}
                    onValueChange={(value) => setFilterOptions({ ...filterOptions, period: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="기간" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">전체 기간</SelectItem>
                        <SelectItem value="this-month">이번 달</SelectItem>
                        <SelectItem value="last-month">지난 달</SelectItem>
                        <SelectItem value="this-year">올해</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full md:w-2/4">
                <Input
                    type="text"
                    placeholder="업체명 또는 캠페인명으로 검색"
                    value={filterOptions.search}
                    onChange={(e) => setFilterOptions({ ...filterOptions, search: e.target.value })}
                    className="w-full"
                />
            </div>
        </div>
    );
}