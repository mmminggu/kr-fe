// src/app/admin/users/page.tsx
'use client';

import React, { useState } from 'react';
import UserPage from '@/src/components/admin/users/UserManagement';

export default function UsersPage() {
    const [filterOptions, setFilterOptions] = useState({
        status: 'all',
        role: 'all',
        search: '',
    });

    return (
        <UserPage />
    );
}