import React, { useState } from 'react';
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
    totalCapacity?: number;
    companyName?: string;
    shopName?: string;
    reviewManager?: string;
}


const TabView = ({ options, recruitmentData }: { options: OptionItem[], recruitmentData: RecruitmentDay[] }) => {
    const [activeTab, setActiveTab] = useState<'option' | 'recruit' | 'settings'>('option');

    return (
        <div className="mt-3">
            <div className="flex bg-white rounded-t-lg overflow-hidden border-b">
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

            <div className="">
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
    const [editedCampaign, setEditedCampaign] = useState<Campaign>({
        ...campaign,
        totalCapacity: campaign.totalCapacity || 100,
        companyName: campaign.companyName || '주식회사',
        shopName: campaign.shopName || '쿠팡',
        reviewManager: campaign.reviewManager || '초롱이',
        productUrl: campaign.productUrl || 'https://www.coupang.com/vp/products/7465135328'
    });

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
        // 여기에 저장 로직 추가
        console.log('저장된 데이터:', editedCampaign);
    };

    const handleCancel = () => {
        // 수정 취소 시 원본 데이터로 복원
        setEditedCampaign({
            ...campaign,
            totalCapacity: campaign.totalCapacity || 100,
            companyName: campaign.companyName || '주식회사',
            shopName: campaign.shopName || '쿠팡',
            reviewManager: campaign.reviewManager || '초롱이',
            productUrl: campaign.productUrl || 'https://www.coupang.com/vp/products/7465135328'
        });
        setIsEditing(false);
    };

    const handleChange = (field: keyof Campaign, value: any) => {
        setEditedCampaign(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 실제 구현에서는 파일 업로드 API 호출 후 URL 설정
            const tempUrl = URL.createObjectURL(file);
            handleChange('imageUrl', tempUrl);
        }
    };

    // 파일 입력을 위한 ref
    const fileInputRef = React.createRef<HTMLInputElement>();

    // 이미지 업로드 버튼 클릭 핸들러
    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
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

                {/* 헤더 우측에 편집/저장/취소 버튼 추가 */}
                <div className="flex gap-2">
                    {!isEditing ? (
                        <button
                            onClick={handleEdit}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            title="편집"
                        >
                            <Edit size={20} />
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
                                title="저장"
                            >
                                <Save size={16} className="mr-1" />
                                저장
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
                                title="취소"
                            >
                                <X size={16} className="mr-1" />
                                취소
                            </button>
                        </>
                    )}
                </div>
            </div>
            {/* 컨텐츠 영역: 이미지 + 정보 */}
            <div className="flex flex-col md:flex-row gap-6 pt-3 pb-5 ">
                {/* 왼쪽: 대표 이미지 */}
                <div className="relative w-full md:w-1/3 lg:w-1/4">
                    <div className="relative aspect-[1/1.1] bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                        {editedCampaign.imageUrl ? (
                            <img
                                src={editedCampaign.imageUrl}
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
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                <button
                                    className="absolute bottom-2 right-2 bg-white p-2 rounded-md text-gray-600 shadow-sm hover:bg-gray-50 border border-gray-200"
                                    onClick={handleImageUploadClick}
                                >
                                    <Edit size={16} />
                                </button>
                            </>
                        )}
                    </div>
                    {/* 캠페인 상세 설명 버튼 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="w-full mt-4 py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md flex items-center justify-center text-sm font-medium transition-colors duration-200 border border-indigo-100">
                                <Info size={16} className="mr-2" />
                                캠페인 상세 설명
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-gray-900">캠페인 상세설명</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-2">
                                {defaultGuideImage && (
                                    <div className="rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={defaultGuideImage}
                                            alt="캠페인 상세설명"
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
                    <div className="mb-3 grid grid-cols-2 gap-3">
                        {/* 총 진행률 */}
                        <div className="p-3 bg-white rounded-md border border-gray-200 shadow-sm">
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <TrendingUp className="w-5 h-5 text-indigo-600 mr-2" />
                                        <span className="font-medium text-gray-800">총 진행률 <span className="font-bold text-indigo-600 ml-1">{campaign.progress}%</span></span>
                                    </div>
                                    {/* 인원 수를 오른쪽으로 이동 */}
                                    <div className="font-medium text-gray-700 text-xs">
                                        {campaign.progress}/100명
                                    </div>
                                </div>

                                <Progress
                                    value={campaign.progress}
                                    className="h-2 bg-indigo-100"
                                    indicatorClassName="bg-indigo-500"
                                />
                            </div>
                        </div>

                        {/* 예산 사용률 */}
                        <div className="p-3 bg-white rounded-md border border-gray-200 shadow-sm">
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BadgeCheck className="w-5 h-5 text-green-600 mr-2" />
                                        <span className="font-medium text-gray-800">예산 사용률 <span className="font-bold text-green-600 ml-1">25%</span></span>
                                    </div>
                                    {/* 금액 정보 */}
                                    <div className="font-medium text-gray-700 text-xs">
                                        500,000원/2,000,000원
                                    </div>
                                </div>

                                <Progress
                                    value={25}
                                    className="h-2 bg-green-100"
                                    indicatorClassName="bg-green-500"
                                />
                            </div>
                        </div>
                    </div>


                    {/* 정보 테이블 형식 */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2 bg-white rounded-md p-3 border border-gray-200 shadow-sm">
                            <div>
                                <div className="flex items-center justify-between mb-2 pb-1 border-b-2 border-indigo-100">
                                    <div className="flex items-center">
                                        <ClipboardList className="w-5 h-5 text-indigo-500 mr-2" />
                                        <span className="font-medium text-gray-800">캠페인 정보</span>
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">모집 인원</span>
                                        <div>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    className="text-gray-900 font-medium text-right w-20 border border-gray-300 rounded px-2 py-1"
                                                    value={editedCampaign.totalCapacity || 100}
                                                    onChange={(e) => handleChange('totalCapacity', parseInt(e.target.value))}
                                                />
                                            ) : (
                                                <span className="text-gray-900 font-medium">{editedCampaign.totalCapacity || 100}명</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">기간</span>
                                        <div>
                                            {isEditing ? (
                                                <div className="flex gap-1 items-center">
                                                    <input
                                                        type="date"
                                                        className="text-gray-900 font-medium text-right w-32 border border-gray-300 rounded px-2 py-1"
                                                        value={editedCampaign.startDate}
                                                        onChange={(e) => handleChange('startDate', e.target.value)}
                                                    />
                                                    <span>~</span>
                                                    <input
                                                        type="date"
                                                        className="text-gray-900 font-medium text-right w-32 border border-gray-300 rounded px-2 py-1"
                                                        value={editedCampaign.endDate}
                                                        onChange={(e) => handleChange('endDate', e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-gray-900 font-medium">{formatDate(editedCampaign.startDate)} ~ {formatDate(editedCampaign.endDate)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">시작 일시</span>
                                        <div>
                                            {isEditing ? (
                                                <input
                                                    type="datetime-local"
                                                    className="text-gray-900 font-medium text-right w-40 border border-gray-300 rounded px-2 py-1"
                                                    value={editedCampaign.startDateTime}
                                                    onChange={(e) => handleChange('startDateTime', e.target.value)}
                                                />
                                            ) : (
                                                <span className="text-gray-900 font-medium">2025월 05월 01일 오전 10:00</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">재참여 기간</span>
                                        <div>
                                            {isEditing ? (
                                                <div className="flex items-center">
                                                    <input
                                                        type="number"
                                                        className="text-gray-900 font-medium text-right w-16 border border-gray-300 rounded px-2 py-1"
                                                        value={editedCampaign.rejoinPeriod || 14}
                                                        onChange={(e) => handleChange('rejoinPeriod', parseInt(e.target.value))}
                                                    />
                                                    <span className="ml-1">일</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-gray-900 font-medium">{editedCampaign.rejoinPeriod || 14}일</span>
                                                    <span className="text-xs text-gray-500 ml-1">(이전 참여 완료일로부터)</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2 pb-1 border-b-2 border-indigo-100">
                                    <div className="flex items-center">
                                        <Briefcase className="w-5 h-5 text-indigo-600 mr-2" />
                                        <span className="font-medium text-gray-800">진행 정보</span>
                                    </div>
                                </div>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">리뷰 담당자</span>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="text-gray-900 font-medium text-right w-48 border border-gray-300 rounded px-2 py-1"
                                                value={editedCampaign.reviewManager || '초롱이'}
                                                onChange={(e) => handleChange('reviewManager', e.target.value)}
                                            />
                                        ) : (
                                            <span className="text-gray-900 font-medium">{editedCampaign.reviewManager || '초롱이'}</span>
                                        )}
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
                                </div>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">업체</span>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="text-gray-900 font-medium text-right w-48 border border-gray-300 rounded px-2 py-1"
                                                value={editedCampaign.companyName || '주식회사'}
                                                onChange={(e) => handleChange('companyName', e.target.value)}
                                            />
                                        ) : (
                                            <span className="text-gray-900 font-medium">{editedCampaign.companyName || '주식회사'}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">쇼핑몰</span>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="text-gray-900 font-medium text-right w-48 border border-gray-300 rounded px-2 py-1"
                                                value={editedCampaign.shopName || '쿠팡'}
                                                onChange={(e) => handleChange('shopName', e.target.value)}
                                            />
                                        ) : (
                                            <span className="text-gray-900 font-medium">{editedCampaign.shopName || '쿠팡'}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">제품명</span>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="text-gray-900 font-medium text-right w-48 border border-gray-300 rounded px-2 py-1"
                                                value={editedCampaign.productName || ''}
                                                onChange={(e) => handleChange('productName', e.target.value)}
                                                placeholder="제품명 입력"
                                            />
                                        ) : (
                                            <span className="text-gray-900 font-medium">
                                                {editedCampaign.productName || '등록된 제품명이 없습니다'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">제품 링크</span>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="text-gray-900 font-medium text-right w-64 border border-gray-300 rounded px-2 py-1"
                                                value={editedCampaign.productUrl || 'https://www.coupang.com/vp/products/7465135328'}
                                                onChange={(e) => handleChange('productUrl', e.target.value)}
                                            />
                                        ) : (
                                            <a
                                                href={editedCampaign.productUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 underline break-all text-right max-w-[60%]"
                                            >
                                                {editedCampaign.productUrl || 'https://www.coupang.com/vp/products/7465135328'}
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">제품 가격</span>
                                        {isEditing ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    className="text-gray-900 font-medium text-right w-24 border border-gray-300 rounded px-2 py-1"
                                                    value={editedCampaign.productPrice}
                                                    onChange={(e) => handleChange('productPrice', parseInt(e.target.value))}
                                                />
                                                <span className="ml-1">원</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-900 font-medium">{editedCampaign.productPrice.toLocaleString()}원</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600 font-medium">배송비</span>
                                        {isEditing ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    className="text-gray-900 font-medium text-right w-24 border border-gray-300 rounded px-2 py-1"
                                                    value={editedCampaign.shippingFee}
                                                    onChange={(e) => handleChange('shippingFee', parseInt(e.target.value))}
                                                />
                                                <span className="ml-1">원</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-900 font-medium">{editedCampaign.shippingFee.toLocaleString()}원</span>
                                        )}
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