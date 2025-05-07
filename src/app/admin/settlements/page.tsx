// src/app/admin/settlements/page.tsx
'use client';

import React, { useState } from 'react';
import SettlementTable from '@/src/components/admin/settlements/SettlementTable';
import SettlementFilter from '@/src/components/admin/settlements/SettlementFilter';
import SettlementStats from '@/src/components/admin/settlements/SettlementStats';
import { Button } from '@/src/components/ui/button';
import { FileTextIcon, DownloadIcon } from 'lucide-react';

export default function SettlementsPage() {
    const [filterOptions, setFilterOptions] = useState({
        status: 'all',
        period: 'this-month',
        search: '',
    });

    return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">정산 관리</h1>
                    <div className="flex space-x-2">
                        <Button>
                            <FileTextIcon className="w-4 h-4 mr-2" /> 정산 보고서 생성
                        </Button>
                        <Button variant="outline">
                            <DownloadIcon className="w-4 h-4 mr-2" /> 엑셀 다운로드
                        </Button>
                    </div>
                </div>

                <SettlementStats />

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <SettlementFilter
                        filterOptions={filterOptions}
                        setFilterOptions={setFilterOptions}
                    />

                    <SettlementTable filterOptions={filterOptions} />
                </div>
            </div>
    );
}