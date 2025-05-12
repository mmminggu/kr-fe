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