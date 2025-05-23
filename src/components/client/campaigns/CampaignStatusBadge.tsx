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
            bgColor: 'bg-gray-100 ',
            textColor: 'text-gray-800 ',
            icon: <Clock size={14} className="mr-1" />,
            text: '임시저장',
        },
        pending: {
            bgColor: 'bg-amber-100 ',
            textColor: 'text-amber-800 ',
            icon: <AlertCircle size={14} className="mr-1" />,
            text: '검토중',
        },
        active: {
            bgColor: 'bg-green-100 ',
            textColor: 'text-green-800 ',
            icon: <PlayCircle size={14} className="mr-1" />,
            text: '진행중',
        },
        completed: {
            bgColor: 'bg-blue-100 ',
            textColor: 'text-blue-800 ',
            icon: <CheckCircle2 size={14} className="mr-1" />,
            text: '완료',
        },
        rejected: {
            bgColor: 'bg-red-100 ',
            textColor: 'text-red-800 ',
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