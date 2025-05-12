'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from "next/image"
import { Progress } from '@/src/components/ui/progress';
import CampaignInfoCard from '@/src/components/admin/campaigns/detail/CampaignInfo';
import ProofList from '@/src/components/admin/campaigns/detail/ProofList';
import ReservationList from '@/src/components/admin/campaigns/detail/ReservationList';
import { OptionItem } from '@/src/components/admin/campaigns/detail/OptionTable';
import { RecruitmentDay } from '@/src/components/admin/campaigns/detail/RecruitmentTable';
import clsx from 'clsx';

// 여기서 Campaign 인터페이스 정의
interface Campaign {
    id: string;
    title: string;
    status: 'pending' | 'active' | 'completed' | 'rejected' | 'paused';
    startDate: string;
    endDate: string;
    progress: number;
    productPrice: number;
    shippingFee: number;
    rewardPoints: number;
    options: OptionItem[];
    recruit: RecruitmentDay[];
    totalRecruits: number;
    currentRecruits: number;
    csWaiting: number;
    csCompleted: number;
    todayRecruits: number;
    receiptProofs: {
        waiting: number;
        approved: number;
        rejected: number;
    };
    reviewProofs: {
        waiting: number;
        approved: number;
        rejected: number;
    };
}

// CampaignList의 캠페인 데이터 형식 정의
interface ListCampaign {
    id: string;
    title: string;
    status: 'pending' | 'active' | 'completed' | 'rejected';
    company: string;
    deadline: string;
    applicants: number;
    selectedReviewers: number;
    completedReviews: number;
    createdAt: string;
    isActive: boolean;
}

import {
    Star, TrendingUp, PlusCircle, Users, FilePlus2, UserPlus,
    Clock, ReceiptText, ChevronLeft, PieChart, MessageCircle,
    CalendarDays, Bell, Search, RefreshCw, ChevronRight, AlertCircle,
    Calendar, BadgeCheck, Pause, Play, Download, Filter, Pencil,
    Trash2, Settings, Save, Package, CheckCircle2, XCircle
} from 'lucide-react';

export default function CampaignDetailPage() {
    const params = useParams();
    const campaignId = params.id as string;
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('receipt');
    const [campaign, setCampaign] = useState<Campaign | null>(null);

    // 모든 useState 훅들을 여기로 이동
    const [activePeriod, setActivePeriod] = useState('1m');
    const [dateRange, setDateRange] = useState([new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()]);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        // API 호출로 캠페인 데이터 로드
        const fetchCampaign = async () => {
            try {
                // 실제로는 여기서 API 호출을 통해 특정 ID의 캠페인 데이터를 가져옴
                console.log('로드할 캠페인 ID:', campaignId);

                // CampaignList에서 가져온 mockCampaigns 배열 - 여기서 직접 정의
                const mockCampaigns: ListCampaign[] = [
                    {
                        id: 'camp-001',
                        title: '여름 신상품 체험단 모집',
                        status: 'active',
                        company: '화장품몰',
                        deadline: '2025-05-15',
                        applicants: 32,
                        selectedReviewers: 10,
                        completedReviews: 3,
                        createdAt: '2025-04-01',
                        isActive: true,
                    },
                    {
                        id: 'camp-002',
                        title: '헤어 케어 제품 리뷰어 모집',
                        status: 'active',
                        company: '뷰티샵',
                        deadline: '2025-05-20',
                        applicants: 45,
                        selectedReviewers: 15,
                        completedReviews: 8,
                        createdAt: '2025-04-05',
                        isActive: true,
                    },
                    {
                        id: 'camp-003',
                        title: '주방용품 체험단',
                        status: 'active',
                        company: '홈쇼핑몰',
                        deadline: '2025-05-25',
                        applicants: 28,
                        selectedReviewers: 8,
                        completedReviews: 5,
                        createdAt: '2025-04-08',
                        isActive: true,
                    },
                    {
                        id: 'camp-004',
                        title: '뷰티 디바이스 리뷰어 모집',
                        status: 'pending',
                        company: '코스메틱몰',
                        deadline: '2025-06-01',
                        applicants: 0,
                        selectedReviewers: 12,
                        completedReviews: 0,
                        createdAt: '2025-04-15',
                        isActive: false,
                    },
                    {
                        id: 'camp-005',
                        title: '건강식품 체험단',
                        status: 'pending',
                        company: '헬스마트',
                        deadline: '2025-06-10',
                        applicants: 0,
                        selectedReviewers: 6,
                        completedReviews: 0,
                        createdAt: '2025-04-18',
                        isActive: true,
                    },
                    {
                        id: 'camp-006',
                        title: '가정용 운동기구 체험단',
                        status: 'completed',
                        company: '스포츠마트',
                        deadline: '2025-04-10',
                        applicants: 65,
                        selectedReviewers: 20,
                        completedReviews: 20,
                        createdAt: '2025-03-01',
                        isActive: true,
                    },
                    {
                        id: 'camp-007',
                        title: '프리미엄 마스크팩 리뷰어 모집',
                        status: 'completed',
                        company: '스킨케어몰',
                        deadline: '2025-04-05',
                        applicants: 78,
                        selectedReviewers: 25,
                        completedReviews: 22,
                        createdAt: '2025-03-05',
                        isActive: true,
                    },
                    {
                        id: 'camp-008',
                        title: '스마트 홈 가전 체험단',
                        status: 'rejected',
                        company: '테크마트',
                        deadline: '2025-05-01',
                        applicants: 0,
                        selectedReviewers: 0,
                        completedReviews: 0,
                        createdAt: '2025-04-10',
                        isActive: false,
                    },
                    {
                        id: 'camp-009',
                        title: '신상 슈즈 체험단',
                        status: 'completed',
                        company: '패션마트',
                        deadline: '2025-06-15',
                        applicants: 0,
                        selectedReviewers: 15,
                        completedReviews: 0,
                        createdAt: '2025-04-20',
                        isActive: true,
                    },
                    {
                        id: 'camp-010',
                        title: '유기농 스킨케어 체험단',
                        status: 'completed',
                        company: '유기농화장품',
                        deadline: '2025-06-20',
                        applicants: 0,
                        selectedReviewers: 100,
                        completedReviews: 50,
                        createdAt: '2025-04-25',
                        isActive: false,
                    },
                    {
                        id: 'camp-011',
                        title: '여름 신상품 체험단 모집',
                        status: 'active',
                        company: '화장품몰',
                        deadline: '2025-05-15',
                        applicants: 0,
                        selectedReviewers: 50,
                        completedReviews: 20,
                        createdAt: '2025-04-25',
                        isActive: false,
                    },
                ];

                // mockCampaigns에서 해당 ID와 일치하는 캠페인 찾기
                const foundCampaign = mockCampaigns.find(camp => camp.id === campaignId);

                if (foundCampaign) {
                    // CampaignDetail에서 필요한 데이터 구조로 변환
                    const detailCampaign: Campaign = {
                        id: foundCampaign.id,
                        title: foundCampaign.title,
                        status: foundCampaign.status, // pending, active, completed, rejected
                        startDate: foundCampaign.createdAt, // 시작일은 생성일로 대체
                        endDate: foundCampaign.deadline, // 종료일은 마감일로 대체
                        progress: Math.round((foundCampaign.completedReviews / (foundCampaign.selectedReviewers || 1)) * 100),
                        productPrice: 159000, // 기본값
                        shippingFee: 3000, // 기본값
                        rewardPoints: 15000, // 기본값
                        options: [
                            {
                                name: '블랙',
                                isWished: true,
                                isPhotoRequired: true,
                                reviewType: '포토리뷰',
                                deliveryType: '실배송',
                                recruitCount: Math.round(foundCampaign.selectedReviewers / 2) || 10,
                                point: 1000
                            },
                            {
                                name: '화이트',
                                isWished: false,
                                isPhotoRequired: false,
                                reviewType: '텍스트리뷰',
                                deliveryType: '빈박스',
                                recruitCount: Math.round(foundCampaign.selectedReviewers / 2) || 10,
                                point: 500
                            }
                        ],
                        recruit: [
                            {
                                date: foundCampaign.createdAt,
                                quota: Math.round(foundCampaign.selectedReviewers * 0.3) || 5,
                            },
                            {
                                date: new Date(new Date(foundCampaign.createdAt).getTime() + 86400000).toISOString().split('T')[0], // 생성일 + 1일
                                quota: Math.round(foundCampaign.selectedReviewers * 0.7) || 5,
                            }
                        ],
                        totalRecruits: foundCampaign.selectedReviewers || 20,
                        currentRecruits: foundCampaign.completedReviews || 0,
                        csWaiting: 8, // 기본값
                        csCompleted: 24, // 기본값
                        todayRecruits: 5, // 기본값
                        receiptProofs: {
                            waiting: 18,
                            approved: 34,
                            rejected: 2
                        },
                        reviewProofs: {
                            waiting: 12,
                            approved: 22,
                            rejected: 0
                        }
                    };

                    setCampaign(detailCampaign);
                } else {
                    // 캠페인을 찾지 못했을 때
                    console.error('캠페인을 찾을 수 없음:', campaignId);
                    setCampaign(null);
                }

                setLoading(false);
            } catch (error) {
                console.error('캠페인 로딩 중 오류 발생:', error);
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [campaignId]);

    // 로딩 상태 처리
    if (loading) {
        return (
            <div className="w-full py-12 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <p className="mt-4 text-gray-600">캠페인 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="container mx-auto py-12 text-center">
                <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">캠페인을 찾을 수 없습니다</h2>
                <p className="text-gray-600 mb-6">요청하신 캠페인 정보를 찾을 수 없습니다.</p>
                <a href="/admin/campaigns" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <ChevronLeft size={16} className="mr-2" />
                    캠페인 목록으로 돌아가기
                </a>
            </div>
        );
    }

    // 날짜 포맷 헬퍼 함수
    const formatDateYYYY_MM_DD = (date: Date) => {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
    };

    // 캠페인 작업 처리 함수
    const handleCampaignAction = (action: string) => {
        if (action === 'approve') {
            // 승인 처리 로직
            setCampaign({...campaign, status: 'active'});
            // 실제 API 호출 코드 추가
            console.log('캠페인 승인됨');
        } else if (action === 'reject') {
            // 반려 처리 로직 (모달로 반려 사유 입력 받을 수 있음)
            setCampaign({...campaign, status: 'rejected'});
            // 실제 API 호출 코드 추가
            console.log('캠페인 반려됨');
        } else if (action === 'pause') {
            setCampaign({...campaign, status: 'paused'});
            // 실제 API 호출 코드 추가
            console.log('캠페인 중단됨');
        } else if (action === 'resume') {
            setCampaign({...campaign, status: 'active'});
            // 실제 API 호출 코드 추가
            console.log('캠페인 재개됨');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    // 캠페인 상태 전환 함수
    const toggleStatus = () => {
        if (campaign.status === 'active') {
            handleCampaignAction('pause');
        } else {
            handleCampaignAction('resume');
        }
    };

    // 승인된 상태인지 확인
    const isApproved = (status: string) => {
        return ['active', 'completed', 'paused'].includes(status);
    };

    // 상태 표시를 위한 함수
    const getStatusKorean = (status: string) => {
        switch (status) {
            case 'pending': return '검토중';
            case 'active': return '진행중';
            case 'completed': return '완료';
            case 'rejected': return '반려';
            case 'paused': return '중단';
            default: return '';
        }
    };

    // 상태에 따른 아이콘
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <AlertCircle className="w-4 h-4 mr-1" />;
            case 'active': return <Clock className="w-4 h-4 mr-1" />;
            case 'completed': return <BadgeCheck className="w-4 h-4 mr-1" />;
            case 'rejected': return <XCircle className="w-4 h-4 mr-1" />;
            case 'paused': return <Pause className="w-4 h-4 mr-1" />;
            default: return null;
        }
    };

    return (
        <div className="container mx-auto">
            {/* 고정 상단 캠페인 요약 헤더 */}
            <div className="fixed top-0 left-64 right-0 z-30 bg-white border-b border-gray-200 shadow-sm px-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* 왼쪽: 타이틀 + 상태 + 날짜 */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                            <h1 className="text-xl font-bold text-gray-900">{campaign.title}</h1>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            {/* 상태 뱃지 */}
                            <span className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${campaign.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                                campaign.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                                    campaign.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                                        campaign.status === 'paused' ? 'bg-amber-100 text-amber-800' :
                                            'bg-gray-100 text-gray-800'}
                            `}>
                                {getStatusIcon(campaign.status)}
                                {getStatusKorean(campaign.status)}
                            </span>

                            {/* 날짜 */}
                            {isApproved(campaign.status) && (
                                <span className="text-gray-500">
                                    {campaign.startDate} ~ {campaign.endDate}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 오른쪽: 캠페인 상태에 따른 버튼 영역 */}
                    <div className="flex items-center gap-2">
                        {campaign.status === 'pending' ? (
                            // 검토중 상태일 때 승인/반려 버튼
                            <>
                                <button
                                    onClick={() => handleCampaignAction('approve')}
                                    className="text-sm px-4 py-2 rounded-md text-white flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600"
                                >
                                    <CheckCircle2 size={16} />
                                    캠페인 승인
                                </button>
                                <button
                                    onClick={() => handleCampaignAction('reject')}
                                    className="text-sm px-4 py-2 rounded-md text-white flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600"
                                >
                                    <XCircle size={16} />
                                    캠페인 반려
                                </button>
                            </>
                        ) : (
                            // 승인 또는 다른 상태일 때 기존 버튼
                            campaign.status !== 'rejected' && (
                                <button
                                    onClick={toggleStatus}
                                    className={`text-sm px-4 py-2 rounded-md text-white flex items-center gap-1.5
                                        ${campaign.status === 'active'
                                        ? 'bg-amber-500 hover:bg-amber-600'
                                        : 'bg-emerald-500 hover:bg-emerald-600'}
                                    `}
                                >
                                    {campaign.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                                    {campaign.status === 'active' ? '캠페인 중단' : '캠페인 실행'}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* 캠페인 상태에 따른 콘텐츠 표시 */}
            <div className="pt-[80px]">
                {campaign.status !== 'pending' && campaign.status !== 'rejected' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
                    <StatCard
                        title="오늘 신청 수"
                        value={`${campaign.todayRecruits}건`}
                        icon={<FilePlus2 size={20} />}
                        color="orange"
                    />
                    <StatCard
                        title="오늘 모집률"
                        value={`${Math.round((campaign.currentRecruits / campaign.totalRecruits) * 100)}%`}
                        icon={<TrendingUp size={20} />}
                        color="blue"
                    />
                    <StatCard
                        title="CS 답변 대기"
                        value={`${campaign.csWaiting}건`}
                        icon={<MessageCircle size={20} />}
                        color="red"
                    />
                    <StatCard
                        title="구매 승인 대기"
                        value={`${campaign.receiptProofs.waiting}건`}
                        icon={<ReceiptText size={20} />}
                        color="yellow"
                    />
                    <StatCard
                        title="리뷰 승인 대기"
                        value={`${campaign.reviewProofs.waiting}건`}
                        icon={<Clock size={20} />}
                        color="purple"
                    />
                </div>
            )}
                {/* 캠페인 기본 정보 카드는 항상 표시 */}
                <CampaignInfoCard
                    campaign={campaign}
                    isEditable={campaign.status === 'pending'}
                />

                {campaign.status === 'pending' ? (
                    /* 검토중일 때 안내 메시지 */
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 rounded-full p-3">
                                <AlertCircle className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-blue-800">검토 진행 중</h3>
                                <p className="mt-1 text-blue-700">
                                    이 캠페인은 현재 검토 중입니다. 승인 후에 아래 기능들이 활성화됩니다:
                                </p>
                                <ul className="mt-3 space-y-2">
                                    <li className="flex items-center text-blue-700">
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        캠페인 현황 대시보드
                                    </li>
                                    <li className="flex items-center text-blue-700">
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        상세 증빙 목록 관리
                                    </li>
                                    <li className="flex items-center text-blue-700">
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        예약자 리스트 관리
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : campaign.status === 'rejected' ? (
                    /* 반려되었을 때 안내 메시지 */
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-6 my-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-rose-100 rounded-full p-3">
                                <XCircle className="h-6 w-6 text-rose-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-rose-800">캠페인 반려됨</h3>
                                <p className="mt-1 text-rose-700">
                                    이 캠페인은 관리자에 의해 반려되었습니다. 아래 사유를 확인하고 수정 후 다시 검토를 요청해주세요.
                                </p>
                                <div className="mt-3 p-3 bg-white rounded border border-rose-200">
                                    <p className="text-gray-700">반려 사유: 상품 정보가 불충분합니다. 상세 스펙과 이미지를 추가해주세요.</p>
                                </div>
                                <button className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">
                                    수정하여 재검토 요청
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* 승인된 상태일 때 (active, completed, paused) */
                    <>
                        {/* 증빙 목록 */}
                        <ProofList />

                        {/* 예약자 리스트 */}
                        <ReservationList />
                    </>
                )}
            </div>
        </div>
    );
}

// 통계 카드 컴포넌트
function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
    const colorVariants = {
        blue: "bg-blue-100 text-blue-700",
        green: "bg-green-100 text-green-700",
        orange: "bg-orange-100 text-orange-700",
        yellow: "bg-yellow-100 text-yellow-700",
        purple: "bg-purple-100 text-purple-700",
        red: "bg-red-100 text-red-700",
    };

    return (
        <div className="bg-white rounded-lg shadow-sm px-8 py-4 border border-gray-200">
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