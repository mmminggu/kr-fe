'use client';

import { useEffect, useRef, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

// 차트 데이터 (모의 데이터)
const data = [
    { name: '4월 1주', 신청자: 25, 선정자: 8, 완료리뷰: 5 },
    { name: '4월 2주', 신청자: 32, 선정자: 10, 완료리뷰: 7 },
    { name: '4월 3주', 신청자: 30, 선정자: 9, 완료리뷰: 8 },
    { name: '4월 4주', 신청자: 45, 선정자: 15, 완료리뷰: 10 },
    { name: '5월 1주', 신청자: 52, 선정자: 18, 완료리뷰: 12 },
    { name: '5월 2주', 신청자: 48, 선정자: 16, 완료리뷰: 11 },
];

export default function ActivityChart() {
    const [isMounted, setIsMounted] = useState(false);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [chartWidth, setChartWidth] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // 컴포넌트 마운트 시 차트 렌더링 활성화
    useEffect(() => {
        setIsMounted(true);

        // 다크모드 감지
        if (typeof window !== 'undefined') {
            setIsDarkMode(document.documentElement.classList.contains('dark'));

            // 다크모드 변경 감지를 위한 MutationObserver
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (
                        mutation.type === 'attributes' &&
                        mutation.attributeName === 'class'
                    ) {
                        setIsDarkMode(document.documentElement.classList.contains('dark'));
                    }
                });
            });

            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class'],
            });

            return () => observer.disconnect();
        }
    }, []);

    // 차트 컨테이너 크기 변경 감지
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setChartWidth(entry.contentRect.width);
            }
        });

        resizeObserver.observe(chartContainerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // 차트 스타일 적용
    const chartColors = {
        신청자: '#3B82F6',  // blue-500
        선정자: '#10B981',  // green-500
        완료리뷰: '#8B5CF6', // violet-500
    };

    if (!isMounted) {
        return (
            <div
                ref={chartContainerRef}
                className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded"
            >
                <div className="text-gray-400 dark:text-gray-500">차트 로딩 중...</div>
            </div>
        );
    }

    return (
        <div ref={chartContainerRef} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDarkMode ? 'rgba(107, 114, 128, 0.2)' : 'rgba(229, 231, 235, 0.8)'}
                    />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                    />
                    <YAxis
                        tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                            borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                            color: isDarkMode ? '#F3F4F6' : '#111827',
                        }}
                        labelStyle={{
                            fontWeight: 'bold',
                            marginBottom: '5px',
                            color: isDarkMode ? '#F3F4F6' : '#111827',
                        }}
                    />
                    <Legend
                        wrapperStyle={{
                            paddingTop: '10px',
                            color: isDarkMode ? '#D1D5DB' : '#4B5563'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="신청자"
                        stroke={chartColors.신청자}
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        dot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="선정자"
                        stroke={chartColors.선정자}
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        dot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="완료리뷰"
                        stroke={chartColors.완료리뷰}
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}