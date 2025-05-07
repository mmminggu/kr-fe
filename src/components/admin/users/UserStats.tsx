// src/components/admin/users/UserStats.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import {
    Users,
    Building,
    UserCheck,
    AlertTriangle
} from 'lucide-react';

export default function UserStats() {
    // 실제 구현에서는 API를 통해 데이터를 가져올 것
    const stats = [
        { title: '전체 회원', value: 8750, icon: Users, color: 'text-blue-500' },
        { title: '업체', value: 320, icon: Building, color: 'text-green-500' },
        { title: '리뷰어', value: 8400, icon: UserCheck, color: 'text-purple-500' },
        { title: '정지된 계정', value: 30, icon: AlertTriangle, color: 'text-red-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">{stat.title}</p>
                            <h3 className="text-2xl font-bold">{stat.value.toLocaleString()}</h3>
                        </div>
                        <div className={`rounded-full p-3 bg-gray-100 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}