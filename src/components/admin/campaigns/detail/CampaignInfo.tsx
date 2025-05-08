import { useState } from 'react';
import {
    Briefcase, Calendar, Megaphone, Clock, CalendarDays, BadgeCheck, Image,
    CircleUser, Save, X, Info, TrendingUp, ClipboardList, Tag,
    Users, Edit, FileImage, Settings
} from 'lucide-react';
import { Progress } from '@/src/components/ui/progress';
import OptionTable, { OptionItem } from './OptionTable';
import RecruitmentTable, {RecruitmentDay} from './RecruitmentTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';

interface Campaign {
    id: number;
    title?: string;
    progress: number;
    productPrice: number;
    shippingFee: number;
    rewardPoints: number;
    options: OptionItem[];
    recruit: RecruitmentDay[];
    status?: '진행 중' | '예정' | '종료' | '중단';
    startDate?: string;
    endDate?: string;
    imageUrl?: string;
    rejoinPeriod?: number;
    startDateTime?: string;
    guideText?: string;
    guideImageUrl?: string;
    productName?: string;
    productUrl?: string;
}


const TabView = ({ options, recruitmentData }: { options: OptionItem[], recruitmentData: RecruitmentDay[] }) => {
    const [activeTab, setActiveTab] = useState<'option' | 'recruit' | 'settings'>('option');

    return (
        <div className="mt-5">
            <div className="flex bg-white rounded-t-lg overflow-hidden">
                <button
                    className={`flex items-center px-4 py-3 bg-gray-100 text-sm rounded-t-lg font-medium transition-colors ${
                        activeTab === 'option'
                            ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('option')}
                >
                    옵션 관리
                </button>
                <button
                    className={`flex items-center px-4 py-3 bg-gray-100 text-sm rounded-t-lg font-medium transition-colors ${
                        activeTab === 'recruit'
                            ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('recruit')}
                >
                    모집일 관리
                </button>
            </div>

            <div className="p-5 border rounded-lg">
                {activeTab === 'option' && <OptionTable initialOptions={options} />}
                {activeTab === 'recruit' && <RecruitmentTable initialDays={recruitmentData} />}
            </div>
        </div>
    );
};

function formatDate(dateStr?: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;
}

export default function CampaignInfoCard({ campaign }: { campaign: Campaign }) {
    const [campaignStatus, setCampaignStatus] = useState<Campaign['status']>(campaign.status ?? '예정');
    const [isEditing, setIsEditing] = useState(false);
    const [editedCampaign, setEditedCampaign] = useState<Campaign>(campaign);

    // 임시 가이드 데이터
    const defaultGuideText = campaign.guideText || "1. 정확한 제품명을 기재해 주세요.\n2. 최소 3장 이상의 제품 사진을 첨부해 주세요.\n3. 실제 사용 후기를 500자 이상 작성해 주세요.\n4. 체험단임을 명시해 주세요.";
    const defaultGuideImage = campaign.guideImageUrl || "/images/guide-sample.jpg";

    const toggleStatus = () => {
        setCampaignStatus((prev) =>
            prev === '진행 중' ? '중단' : '진행 중'
        );
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // 실제 구현에서는 API 요청 등으로 저장
        setIsEditing(false);
    };

    const handleCancel = () => {
        // 수정 취소 시 원본 데이터로 복원
        setEditedCampaign(campaign);
        setIsEditing(false);
    };

    const handleChange = (field: keyof Campaign, value: any) => {
        setEditedCampaign(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            {/* 상단: 캠페인명 + 날짜 + 상태 뱃지 + 버튼 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Megaphone className="w-5 h-5 mr-2 text-indigo-600"/>
                            캠페인 상세 정보
                        </h2>
                    </div>
                </div>
            </div>
            {/* 컨텐츠 영역: 이미지 + 정보 */}
            <div className="flex flex-col md:flex-row gap-6 pt-3 pb-5 ">
                {/* 왼쪽: 대표 이미지 */}
                <div className="relative w-full md:w-1/3 lg:w-1/4">
                    <div className="aspect-[1/1.1] bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                        {/*<img
                            src="/img/img1.png"
                            alt="캠페인 대표 이미지"
                            className="w-full h-full object-cover"
                        />*/}
                        {campaign.imageUrl ? (
                            <img
                                src={campaign.imageUrl}
                                alt="캠페인 대표 이미지"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400 ">
                                <FileImage size={40} strokeWidth={1.5} />
                                <span className="text-sm mt-2">대표 이미지</span>
                            </div>
                        )}
                        {isEditing && (
                            <button
                                className="absolute bottom-2 right-2 bg-white  p-2 rounded-md text-gray-600  shadow-sm hover:bg-gray-50  border border-gray-200"
                                onClick={() => {/* 이미지 수정 기능 */}}
                            >
                                <Edit size={16} />
                            </button>
                        )}
                    </div>
                    {/* 캠페인 가이드 버튼 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="w-full mt-4 py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md flex items-center justify-center text-sm font-medium transition-colors duration-200 border border-indigo-100">
                                <Info size={16} className="mr-2" />
                                캠페인 가이드 보기
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-gray-900">캠페인 가이드</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-2">
                                {defaultGuideImage && (
                                    <div className="rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={defaultGuideImage}
                                            alt="캠페인 가이드"
                                            className="w-full object-cover max-h-60"
                                        />
                                    </div>
                                )}
                                <div className="bg-gray-50 rounded-md p-4 whitespace-pre-line border border-gray-200">
                                    {defaultGuideText}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* 오른쪽: 정보 영역 */}
                <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    {/* 진행률 */}
                    <div className="mb-4 p-3 bg-white rounded-md border border-gray-200 shadow-sm">
                        <div className="flex items-center space-x-4">
                            {/* 아이콘 + 라벨 + 퍼센트 */}
                            <div className="flex items-center whitespace-nowrap">
                                <TrendingUp className="w-5 h-5 text-indigo-600 mr-2" />
                                <span className="font-medium text-gray-800 mr-2">총 진행률</span>
                                <span className="font-bold text-indigo-600">{campaign.progress}%</span>
                            </div>

                            {/* 프로그레스 바 */}
                            <div className="flex-1">
                                <Progress
                                    value={campaign.progress}
                                    className="h-3 bg-indigo-100"
                                    indicatorClassName="bg-indigo-500"
                                />
                            </div>

                            {/* 인원 수 */}
                            <div className="text-xs text-gray-500 whitespace-nowrap">
                                {campaign.progress}/100명
                            </div>
                        </div>
                    </div>


                    {/* 정보 테이블 형식 */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-3 bg-white rounded-md p-3 border border-gray-200 shadow-sm">
                            <div>
                                <div className="flex items-center justify-between mb-2 pb-1 border-b-2 border-indigo-100">
                                    <div className="flex items-center">
                                        <ClipboardList className="w-5 h-5 text-indigo-500 mr-2" />
                                        <span className="font-medium text-gray-800">캠페인 정보</span>
                                    </div>
                                    {isEditing && (
                                        <button
                                            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                            onClick={() => {/* 재참여 기간 수정 */}}
                                        >
                                            <Edit size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="text-sm">
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">모집 인원</span>
                                        <div>
                                            <span className="text-gray-900 font-medium">100명</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">기간</span>
                                        <div>
                                            <span className="text-gray-900 font-medium">{formatDate(campaign.startDate)} ~ {formatDate(campaign.endDate)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">시작 일시</span>
                                        <div>
                                            <span className="text-gray-900 font-medium">2025월 05월 01일 오전 10:00</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">재참여 기간</span>
                                        <div>
                                            <span className="text-gray-900 font-medium">{campaign.rejoinPeriod || 14}일</span>
                                            <span className="text-xs text-gray-500 ml-1">(이전 참여 완료일로부터)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2 pb-1 border-b-2 border-indigo-100">
                                    <div className="flex items-center">
                                        <Briefcase className="w-5 h-5 text-indigo-600 mr-2" />
                                        <span className="font-medium text-gray-800">진행사 정보</span>
                                    </div>
                                    {isEditing && (
                                        <button
                                            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                            onClick={() => {/* 제품 정보 수정 */}}
                                        >
                                            <Edit size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">업체</span>
                                        <span className="text-gray-900 font-mediumx">주식회사</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">케이리뷰 담당자</span>
                                        <span className="text-gray-900 font-mediumx">초롱이</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 bg-white rounded-md p-3 border border-gray-200 shadow-sm">
                            {/* 제품 정보 */}
                            <div>
                                <div className="flex items-center justify-between mb-2 pb-1 border-b-2 border-indigo-100">
                                    <div className="flex items-center">
                                        <Tag className="w-5 h-5 text-indigo-600 mr-2" />
                                        <span className="font-medium text-gray-800">제품 정보</span>
                                    </div>
                                    {isEditing && (
                                        <button
                                            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                            onClick={() => {/* 제품 정보 수정 */}}
                                        >
                                            <Edit size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">쇼핑몰</span>
                                        <span className="text-gray-900 font-medium">
                                            쿠팡
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">제품명</span>
                                        <span className="text-gray-900 font-medium">
                                            {campaign.productName || '등록된 제품명이 없습니다'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">제품 링크</span>
                                        <a
                                            href={campaign.productUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 underline break-all text-right max-w-[60%]"
                                        >
                                            {campaign.productUrl || 'https://www.coupang.com/vp/products/7465135328'}
                                        </a>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">제품 가격</span>
                                        <span className="text-gray-900 font-medium">{campaign.productPrice.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">배송비</span>
                                        <span className="text-gray-900 font-medium">{campaign.shippingFee.toLocaleString()}원</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 옵션 테이블 */}
            <div className="">
                <TabView options={campaign.options} recruitmentData={campaign.recruit || []} />
            </div>
        </div>
    );
}