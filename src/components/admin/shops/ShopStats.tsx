// src/components/admin/shops/ShopStats.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import {
    ShoppingBag,
    CheckCircle,
    Clock,
    MessageSquare
} from 'lucide-react';

export default function ShopStats() {
    // 실제 구현에서는 API를 통해 데이터를 가져올 것
    const stats = [
        { title: '총 쇼핑몰', value: 320, icon: ShoppingBag, color: 'text-blue-500' },
        { title: '활성 쇼핑몰', value: 275, icon: CheckCircle, color: 'text-green-500' },
        { title: '승인 대기', value: 18, icon: Clock, color: 'text-yellow-500' },
        { title: '최근 문의', value: 12, icon: MessageSquare, color: 'text-purple-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                            <h3 className="text-2xl font-bold">{stat.value.toLocaleString()}</h3>
                        </div>
                        <div className={`rounded-full p-3 bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}