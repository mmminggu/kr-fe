// src/app/admin/shops/page.tsx
'use client';

import React, { useState } from 'react';
import ShopTable from '@/src/components/admin/shops/ShopTable';
import ShopFilter from '@/src/components/admin/shops/ShopFilter';
import ShopStats from '@/src/components/admin/shops/ShopStats';
import { Button } from '@/src/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default function ShopsPage() {
    const [filterOptions, setFilterOptions] = useState({
        status: 'all',
        category: 'all',
        search: '',
    });

    return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">쇼핑몰 관리</h1>
                    <Button>
                        <PlusIcon className="w-4 h-4 mr-2" /> 신규 쇼핑몰 등록
                    </Button>
                </div>

                <ShopStats />

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <ShopFilter
                        filterOptions={filterOptions}
                        setFilterOptions={setFilterOptions}
                    />

                    <ShopTable filterOptions={filterOptions} />
                </div>
            </div>
    );
}