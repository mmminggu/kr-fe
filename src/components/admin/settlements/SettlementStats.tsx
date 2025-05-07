// src/components/admin/settlements/SettlementStats.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import {
    DollarSign,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';

export default function SettlementStats() {
    // 실제 구현에서는 API를 통해 데이터를 가져올 것
    const stats = [
        { title: '이번 달 총 정산액', value: 45670000, icon: DollarSign, color: 'text-green-500', format: 'currency' },
        { title: '대기중 정산', value: 12, icon: Clock, color: 'text-yellow-500' },
        { title: '완료된 정산', value: 87, icon: CheckCircle, color: 'text-blue-500' },
        { title: '거부된 정산', value: 3, icon: XCircle, color: 'text-red-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 ">{stat.title}</p>
                            <h3 className="text-2xl font-bold">
                                {stat.format === 'currency'
                                    ? `${stat.value.toLocaleString()}원`
                                    : stat.value.toLocaleString()}
                            </h3>
                        </div>
                        <div className={`rounded-full p-3 bg-gray-100  ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}