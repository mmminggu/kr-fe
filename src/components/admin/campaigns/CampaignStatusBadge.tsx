import React from 'react';
import {
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    PlayCircle
} from 'lucide-react';

type CampaignStatus = 'draft' | 'pending' | 'active' | 'completed' | 'rejected';

interface CampaignStatusBadgeProps {
    status: CampaignStatus;
}

export default function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
    // 상태별 스타일 및 텍스트 매핑
    const statusConfig = {
        draft: {
            bgColor: 'bg-gray-100 dark:bg-gray-700',
            textColor: 'text-gray-800 dark:text-gray-300',
            icon: <Clock size={14} className="mr-1" />,
            text: '임시저장',
        },
        pending: {
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
            textColor: 'text-amber-800 dark:text-amber-300',
            icon: <AlertCircle size={14} className="mr-1" />,
            text: '검토중',
        },
        active: {
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            textColor: 'text-green-800 dark:text-green-300',
            icon: <PlayCircle size={14} className="mr-1" />,
            text: '진행중',
        },
        completed: {
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            textColor: 'text-blue-800 dark:text-blue-300',
            icon: <CheckCircle2 size={14} className="mr-1" />,
            text: '완료',
        },
        rejected: {
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            textColor: 'text-red-800 dark:text-red-300',
            icon: <XCircle size={14} className="mr-1" />,
            text: '반려',
        },
    };

    const { bgColor, textColor, icon, text } = statusConfig[status];

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
        >
      {icon}
            {text}
    </span>
    );
}