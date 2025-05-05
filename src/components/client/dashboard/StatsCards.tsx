import { DollarSign, ShoppingBag, FileText, BarChart2 } from 'lucide-react';

interface StatsProps {
    stats: {
        activeCampaigns: number;
        pendingReviews: number;
        completedReviews: number;
        approvalRate: number;
        totalRevenue: number;
    };
}

export default function StatsCards({ stats }: StatsProps) {
    // 금액 포맷팅 함수
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const cards = [
        {
            title: '진행 중인 캠페인',
            value: stats.activeCampaigns,
            icon: <ShoppingBag size={20} />,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            description: '현재 활성화된 캠페인 수',
        },
        {
            title: '대기 중인 리뷰',
            value: stats.pendingReviews,
            icon: <FileText size={20} />,
            color: 'text-amber-600 dark:text-amber-400',
            bgColor: 'bg-amber-50 dark:bg-amber-900/20',
            description: '검토가 필요한 리뷰 수',
        },
        {
            title: '리뷰 승인율',
            value: `${stats.approvalRate}%`,
            icon: <BarChart2 size={20} />,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            description: '승인된 리뷰의 비율',
        },
        {
            title: '총 정산 금액',
            value: formatCurrency(stats.totalRevenue),
            icon: <DollarSign size={20} />,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            description: '누적 정산 금액',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 flex flex-col"
                >
                    <div className="flex items-center space-x-4 mb-3">
                        <div className={`p-2 rounded-lg ${card.bgColor}`}>
                            <div className={card.color}>{card.icon}</div>
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {card.title}
                        </h3>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {card.value}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {card.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}