// src/app/admin/users/page.tsx
'use client';

import React, { useState } from 'react';
import {AdminLayout} from '@/src/components/admin/layout/AdminLayout';
import UserTable from '@/src/components/admin/users/UserTable';
import UserFilter from '@/src/components/admin/users/UserFilter';
import UserStats from '@/src/components/admin/users/UserStats';
import { Button } from '@/src/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default function UsersPage() {
    const [filterOptions, setFilterOptions] = useState({
        status: 'all',
        role: 'all',
        search: '',
    });

    return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">회원 관리</h1>
                    <Button>
                        <PlusIcon className="w-4 h-4 mr-2" /> 신규 회원 등록
                    </Button>
                </div>

                <UserStats />

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <UserFilter
                        filterOptions={filterOptions}
                        setFilterOptions={setFilterOptions}
                    />

                    <UserTable filterOptions={filterOptions} />
                </div>
            </div>
    );
}