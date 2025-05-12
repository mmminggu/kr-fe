import React from 'react';
import { Clock, CalendarDays, BadgeCheck, XCircle, Pause, AlertCircle } from 'lucide-react';

interface CampaignStatusBadgeProps {
    status: 'pending' | 'active' | 'completed' | 'rejected' | 'paused' | string;
    className?: string;
}

export default function CampaignStatusBadge({ status, className = '' }: CampaignStatusBadgeProps) {
    let color = '';
    let icon = null;
    let label = '';

    switch (status) {
        case 'pending':
            color = 'bg-blue-100 text-blue-800';
            icon = <AlertCircle size={14} className="mr-1" />;
            label = '검토중';
            break;
        case 'active':
            color = 'bg-emerald-100 text-emerald-800';
            icon = <Clock size={14} className="mr-1" />;
            label = '진행중';
            break;
        case 'completed':
            color = 'bg-gray-100 text-gray-800';
            icon = <BadgeCheck size={14} className="mr-1" />;
            label = '완료';
            break;
        case 'rejected':
            color = 'bg-rose-100 text-rose-800';
            icon = <XCircle size={14} className="mr-1" />;
            label = '반려';
            break;
        case 'paused':
            color = 'bg-amber-100 text-amber-800';
            icon = <Pause size={14} className="mr-1" />;
            label = '중단';
            break;
        default:
            color = 'bg-gray-100 text-gray-800';
            label = status;
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${className}`}>
      {icon}
            {label}
    </span>
    );
}