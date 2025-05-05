"use client";

import { useState } from "react";
import {
    Users, Package, Star, ShoppingCart,
    AlertCircle, ArrowRight, Clock
} from "lucide-react";

export default function Dashboard() {
    // 실제 구현 시 API에서 데이터를 가져와야 합니다
    const [statistics] = useState({
        totalUsers: 1458,
        activeCampaigns: 24,
        pendingReviews: 186,
        pendingApprovals: 8,
        todayInquiries: 12
    });

    const [recentCampaigns] = useState([
        { id: 1, title: "신규 헤어케어 제품 체험단", status: "진행중", applicants: 87, deadline: "2025-05-10" },
        { id: 2, title: "친환경 주방용품 리뷰어 모집", status: "승인대기", applicants: 0, deadline: "2025-05-15" },
        { id: 3, title: "신상 스킨케어 세트 체험단", status: "진행중", applicants: 156, deadline: "2025-05-08" },
        { id: 4, title: "다이어트 보조제 체험 리뷰", status: "승인대기", applicants: 0, deadline: "2025-05-20" },
    ]);

    const [pendingTasks] = useState([
        { id: 1, type: "campaign", title: "캠페인 승인 요청", count: 5 },
        { id: 2, type: "review", title: "리뷰 검수 대기", count: 18 },
        { id: 3, type: "withdrawal", title: "포인트 출금 요청", count: 7 },
        { id: 4, type: "inquiry", title: "미응답 문의", count: 12 },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
                <div className="text-gray-500 text-sm">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>

            {/* 주요 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    title="총 회원수"
                    value={statistics.totalUsers.toLocaleString()}
                    icon={<Users size={20} />}
                    color="blue"
                />
                <StatCard
                    title="진행중 캠페인"
                    value={statistics.activeCampaigns.toString()}
                    icon={<Package size={20} />}
                    color="green"
                />
                <StatCard
                    title="검수 대기 리뷰"
                    value={statistics.pendingReviews.toString()}
                    icon={<Star size={20} />}
                    color="yellow"
                />
                <StatCard
                    title="승인 대기"
                    value={statistics.pendingApprovals.toString()}
                    icon={<Clock size={20} />}
                    color="purple"
                />
                <StatCard
                    title="금일 문의"
                    value={statistics.todayInquiries.toString()}
                    icon={<AlertCircle size={20} />}
                    color="red"
                />
            </div>

            {/* 대기 작업 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">대기 작업</h2>
                    <Link href="/admin/tasks" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                        모두 보기 <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pendingTasks.map((task) => (
                        <Link
                            key={task.id}
                            href={getTaskLink(task.type)}
                            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-700 font-medium">{task.title}</span>
                                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{task.count}</span>
                            </div>
                            <p className="text-sm text-gray-500">처리가 필요합니다</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 최근 캠페인 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">최근 캠페인</h2>
                    <Link href="/admin/campaigns" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                        모두 보기 <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">캠페인명</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청자</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마감일</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {recentCampaigns.map((campaign) => (
                            <tr key={campaign.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {campaign.applicants}명
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(campaign.deadline)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/campaigns/${campaign.id}`} className="text-blue-600 hover:text-blue-900">
                                        상세보기
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// 통계 카드 컴포넌트
function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
    const colorVariants = {
        blue: "bg-blue-100 text-blue-700",
        green: "bg-green-100 text-green-700",
        yellow: "bg-yellow-100 text-yellow-700",
        purple: "bg-purple-100 text-purple-700",
        red: "bg-red-100 text-red-700",
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorVariants[color as keyof typeof colorVariants]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

// 헬퍼 함수
function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return (
        <a href={href} className={className}>
            {children}
        </a>
    );
}

function getStatusColor(status: string): string {
    switch (status) {
        case "진행중":
            return "bg-green-100 text-green-800";
        case "승인대기":
            return "bg-yellow-100 text-yellow-800";
        case "종료":
            return "bg-gray-100 text-gray-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}

function getTaskLink(type: string): string {
    switch (type) {
        case "campaign":
            return "/admin/CampaignList.tsx/approval";
        case "review":
            return "/admin/reviewers";
        case "withdrawal":
            return "/admin/settlements/withdrawal";
        case "inquiry":
            return "/admin/customer-service/inquiries";
        default:
            return "/admin";
    }
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}