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
        <ShopTable />
    );
}