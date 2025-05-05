'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    ClipboardList,
    Upload,
    Tag,
    DollarSign,
    Info,
    X,
    Plus,
    AlertCircle,
    ChevronDown,
    Users
} from 'lucide-react';

// 카테고리 목록
const categories = [
    { id: 'beauty', name: '뷰티' },
    { id: 'fashion', name: '패션' },
    { id: 'food', name: '식품' },
    { id: 'home', name: '가전/주방' },
    { id: 'digital', name: '디지털/IT' },
    { id: 'sports', name: '스포츠/레저' },
    { id: 'baby', name: '유아/출산' },
    { id: 'pet', name: '반려동물' },
    { id: 'health', name: '건강/의료' },
    { id: 'book', name: '도서/음반' },
    { id: 'travel', name: '여행/숙박' },
    { id: 'other', name: '기타' },
];

// 리뷰 플랫폼 목록
const reviewPlatforms = [
    { id: 'naver-blog', name: '네이버 블로그' },
    { id: 'instagram', name: '인스타그램' },
    { id: 'youtube', name: '유튜브' },
    { id: 'naver-cafe', name: '네이버 카페' },
    { id: 'naver-shop', name: '네이버 쇼핑몰' },
    { id: 'kakao-story', name: '카카오스토리' },
    { id: 'tiktok', name: '틱톡' },
];

// 리뷰어 모집 조건 목록
const reviewerConditions = [
    { id: 'followers', name: '팔로워 수' },
    { id: 'age', name: '연령대' },
    { id: 'gender', name: '성별' },
    { id: 'region', name: '지역' },
    { id: 'interests', name: '관심사' },
];

// 폼 데이터 타입 정의
interface CampaignFormData {
    title: string;
    category: string;
    mainImageUrl: string | null;
    productName: string;
    productDescription: string;
    productPrice: string;
    reviewerCount: string;
    reviewBudget: string;
    reviewPlatforms: string[];
    reviewerConditions: {
        id: string;
        value: string;
    }[];
    campaignDuration: {
        start: string;
        end: string;
    };
    reviewDeadline: string;
    campaignNotice: string;
    campaignDescription: string;
    isFeatured: boolean;
    additionalImages: string[];
    tags: string[];
}

export default function CampaignForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const additionalFileInputRef = useRef<HTMLInputElement>(null);

    // 오늘 날짜를 기본값으로 설정
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // 기본 마감일: 7일 후
    const defaultEndDate = new Date();
    defaultEndDate.setDate(today.getDate() + 7);
    const defaultEndDateString = defaultEndDate.toISOString().split('T')[0];

    // 리뷰 마감일: 14일 후
    const defaultReviewDeadline = new Date();
    defaultReviewDeadline.setDate(today.getDate() + 14);
    const defaultReviewDeadlineString = defaultReviewDeadline.toISOString().split('T')[0];

    // 폼 상태 관리
    const [formData, setFormData] = useState<CampaignFormData>({
        title: '',
        category: '',
        mainImageUrl: null,
        productName: '',
        productDescription: '',
        productPrice: '',
        reviewerCount: '',
        reviewBudget: '',
        reviewPlatforms: [],
        reviewerConditions: [],
        campaignDuration: {
            start: todayString,
            end: defaultEndDateString,
        },
        reviewDeadline: defaultReviewDeadlineString,
        campaignNotice: '',
        campaignDescription: '',
        isFeatured: false,
        additionalImages: [],
        tags: [],
    });

    // 태그 입력 상태
    const [tagInput, setTagInput] = useState('');

    // 유효성 검사 에러 상태
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 폼 단계 상태
    const [formStep, setFormStep] = useState<number>(1);

    // 폼 제출 상태
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // 미리보기 이미지 URL
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);

    // 입력 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // 중첩된 속성을 다루기 위한 로직
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof CampaignFormData],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // 입력 시 해당 필드의 오류 메시지 초기화
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // 체크박스 핸들러
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    // 리뷰 플랫폼 토글 핸들러
    const toggleReviewPlatform = (platformId: string) => {
        setFormData((prev) => {
            const platformExists = prev.reviewPlatforms.includes(platformId);

            return {
                ...prev,
                reviewPlatforms: platformExists
                    ? prev.reviewPlatforms.filter((id) => id !== platformId)
                    : [...prev.reviewPlatforms, platformId],
            };
        });
    };

    // 리뷰어 조건 추가 핸들러
    const addReviewerCondition = (conditionId: string) => {
        // 이미 해당 조건이 추가되어 있는지 확인
        const conditionExists = formData.reviewerConditions.some((condition) => condition.id === conditionId);

        if (!conditionExists) {
            setFormData((prev) => ({
                ...prev,
                reviewerConditions: [...prev.reviewerConditions, { id: conditionId, value: '' }],
            }));
        }
    };

    // 리뷰어 조건 제거 핸들러
    const removeReviewerCondition = (conditionId: string) => {
        setFormData((prev) => ({
            ...prev,
            reviewerConditions: prev.reviewerConditions.filter((condition) => condition.id !== conditionId),
        }));
    };

    // 리뷰어 조건 값 변경 핸들러
    const handleReviewerConditionChange = (conditionId: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            reviewerConditions: prev.reviewerConditions.map((condition) =>
                condition.id === conditionId ? { ...condition, value } : condition
            ),
        }));
    };

    // 태그 추가 핸들러
    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }));
            setTagInput('');
        }
    };

    // 태그 입력 키 핸들러 (엔터 키 지원)
    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    // 태그 제거 핸들러
    const handleRemoveTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    // 메인 이미지 업로드 핸들러
    const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 실제 API에서는 이미지를 서버에 업로드하고 URL을 받아와야 함
            // 여기서는 로컬 미리보기만 구현
            const imageUrl = URL.createObjectURL(file);
            setMainImagePreview(imageUrl);
            setFormData((prev) => ({ ...prev, mainImageUrl: imageUrl }));
        }
    };

    // 추가 이미지 업로드 핸들러
    const handleAdditionalImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            // 최대 5개 이미지로 제한
            const newFiles = Array.from(files).slice(0, 5 - formData.additionalImages.length);

            // 미리보기 URL 생성
            const newImagePreviews = newFiles.map((file) => URL.createObjectURL(file));

            // 상태 업데이트
            setAdditionalImagePreviews((prev) => [...prev, ...newImagePreviews]);
            setFormData((prev) => ({
                ...prev,
                additionalImages: [...prev.additionalImages, ...newImagePreviews],
            }));
        }
    };

    // 추가 이미지 제거 핸들러
    const handleRemoveAdditionalImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            additionalImages: prev.additionalImages.filter((_, i) => i !== index),
        }));
        setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // 폼 단계 이동 핸들러
    const handleNextStep = () => {
        // 현재 단계에 따른 유효성 검사
        const currentStepErrors: Record<string, string> = {};

        if (formStep === 1) {
            if (!formData.title.trim()) currentStepErrors.title = '캠페인 제목을 입력해주세요.';
            if (!formData.category) currentStepErrors.category = '카테고리를 선택해주세요.';
            if (!formData.mainImageUrl) currentStepErrors.mainImageUrl = '메인 이미지를 업로드해주세요.';
            if (!formData.productName.trim()) currentStepErrors.productName = '제품명을 입력해주세요.';
            if (!formData.productDescription.trim()) currentStepErrors.productDescription = '제품 설명을 입력해주세요.';
        } else if (formStep === 2) {
            if (!formData.reviewerCount || parseInt(formData.reviewerCount) <= 0) {
                currentStepErrors.reviewerCount = '모집할 리뷰어 수를 입력해주세요.';
            }
            if (!formData.reviewBudget || parseInt(formData.reviewBudget) <= 0) {
                currentStepErrors.reviewBudget = '리뷰어당 지급 금액을 입력해주세요.';
            }
            if (formData.reviewPlatforms.length === 0) {
                currentStepErrors.reviewPlatforms = '최소 1개 이상의 리뷰 플랫폼을 선택해주세요.';
            }
        }

        // 오류가 있는 경우
        if (Object.keys(currentStepErrors).length > 0) {
            setErrors(currentStepErrors);
            return;
        }

        // 오류가 없으면 다음 단계로 이동
        if (formStep < 3) {
            setFormStep(formStep + 1);
            window.scrollTo(0, 0); // 상단으로 스크롤
        }
    };

    // 이전 단계로 이동
    const handlePrevStep = () => {
        if (formStep > 1) {
            setFormStep(formStep - 1);
            window.scrollTo(0, 0); // 상단으로 스크롤
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
        e.preventDefault();

        // 최종 유효성 검사
        const finalErrors: Record<string, string> = {};

        // 필수 필드 검사 (임시저장은 스킵)
        if (!isDraft) {
            if (!formData.title.trim()) finalErrors.title = '캠페인 제목을 입력해주세요.';
            if (!formData.category) finalErrors.category = '카테고리를 선택해주세요.';
            if (!formData.mainImageUrl) finalErrors.mainImageUrl = '메인 이미지를 업로드해주세요.';
            if (!formData.productName.trim()) finalErrors.productName = '제품명을 입력해주세요.';
            if (!formData.productDescription.trim()) finalErrors.productDescription = '제품 설명을 입력해주세요.';
            if (!formData.reviewerCount || parseInt(formData.reviewerCount) <= 0) {
                finalErrors.reviewerCount = '모집할 리뷰어 수를 입력해주세요.';
            }
            if (!formData.reviewBudget || parseInt(formData.reviewBudget) <= 0) {
                finalErrors.reviewBudget = '리뷰어당 지급 금액을 입력해주세요.';
            }
            if (formData.reviewPlatforms.length === 0) {
                finalErrors.reviewPlatforms = '최소 1개 이상의 리뷰 플랫폼을 선택해주세요.';
            }
            if (!formData.campaignDescription.trim()) {
                finalErrors.campaignDescription = '캠페인 상세 설명을 입력해주세요.';
            }
        }

        // 오류가 있는 경우
        if (Object.keys(finalErrors).length > 0) {
            setErrors(finalErrors);

            // 오류가 있는 단계로 이동
            if (finalErrors.title || finalErrors.category || finalErrors.mainImageUrl ||
                finalErrors.productName || finalErrors.productDescription) {
                setFormStep(1);
            } else if (finalErrors.reviewerCount || finalErrors.reviewBudget || finalErrors.reviewPlatforms) {
                setFormStep(2);
            } else {
                setFormStep(3);
            }

            return;
        }

        // 제출 상태 업데이트
        setIsSubmitting(true);

        try {
            // 실제 API 호출
            // const response = await fetch('/api/campaigns', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ ...formData, status: isDraft ? 'draft' : 'pending' }),
            // });
            // const data = await response.json();

            // API 호출 시뮬레이션 (setTimeout으로 지연)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // 성공 시 캠페인 목록 페이지로 이동
            router.push('/client/campaigns');
        } catch (error) {
            console.error('캠페인 등록 오류:', error);
            setErrors({ submit: '캠페인 등록 중 오류가 발생했습니다. 다시 시도해 주세요.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 메인 이미지 업로드 트리거
    const triggerMainImageUpload = () => {
        fileInputRef.current?.click();
    };

    // 추가 이미지 업로드 트리거
    const triggerAdditionalImageUpload = () => {
        additionalFileInputRef.current?.click();
    };

    // 현재 단계에 맞는 UI 렌더링
    const renderCurrentStep = () => {
        switch (formStep) {
            case 1:
                return renderBasicInfoStep();
            case 2:
                return renderReviewerStep();
            case 3:
                return renderDetailStep();
            default:
                return renderBasicInfoStep();
        }
    };

    // 기본 정보 입력 단계 UI
    const renderBasicInfoStep = () => {
        return (
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <ClipboardList className="mr-2" size={20} />
                    기본 정보
                </h2>

                {/* 캠페인 제목 */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        캠페인 제목 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 여름 신상품 체험단 모집"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.title}
                        </p>
                    )}
                </div>

                {/* 카테고리 */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        카테고리 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full appearance-none px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">카테고리 선택</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown size={16} className="text-gray-500" />
                        </div>
                    </div>
                    {errors.category && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.category}
                        </p>
                    )}
                </div>

                {/* 메인 이미지 업로드 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        메인 이미지 <span className="text-red-500">*</span>
                    </label>
                    <div
                        className={`border-2 border-dashed rounded-lg p-4 mt-1 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                            errors.mainImageUrl ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'
                        }`}
                        onClick={triggerMainImageUpload}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleMainImageUpload}
                            className="hidden"
                            accept="image/*"
                        />

                        {mainImagePreview ? (
                            <div className="relative inline-block">
                                <img
                                    src={mainImagePreview}
                                    alt="메인 이미지 미리보기"
                                    className="max-h-48 max-w-full rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMainImagePreview(null);
                                        setFormData((prev) => ({ ...prev, mainImageUrl: null }));
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="py-8">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    클릭하여 메인 이미지를 업로드하세요
                                </p>
                                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                    권장 크기: 1200 x 800px, 최대 5MB
                                </p>
                            </div>
                        )}
                    </div>
                    {errors.mainImageUrl && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.mainImageUrl}
                        </p>
                    )}
                </div>

                {/* 제품명 */}
                <div>
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        제품명 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 프리미엄 헤어 케어 세트"
                    />
                    {errors.productName && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.productName}
                        </p>
                    )}
                </div>

                {/* 제품 가격 */}
                <div>
                    <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        제품 가격
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₩</span>
                        </div>
                        <input
                            type="number"
                            id="productPrice"
                            name="productPrice"
                            value={formData.productPrice}
                            onChange={handleChange}
                            className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                            min="0"
                        />
                    </div>
                </div>

                {/* 제품 설명 */}
                <div>
                    <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        제품 설명 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="productDescription"
                        name="productDescription"
                        value={formData.productDescription}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="제품에 대한 간단한 설명을 입력하세요"
                    />
                    {errors.productDescription && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.productDescription}
                        </p>
                    )}
                </div>

                {/* 추가 이미지 업로드 (선택사항) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        추가 이미지 (최대 5개)
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                        {/* 추가된 이미지들 */}
                        {formData.additionalImages.map((img, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={img}
                                    alt={`추가 이미지 ${index + 1}`}
                                    className="h-32 w-full object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveAdditionalImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        {/* 이미지 추가 버튼 (5개 미만일 때만 표시) */}
                        {formData.additionalImages.length < 5 && (
                            <div
                                onClick={triggerAdditionalImageUpload}
                                className="h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                            >
                                <input
                                    type="file"
                                    ref={additionalFileInputRef}
                                    onChange={handleAdditionalImagesUpload}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                />
                                <Plus className="h-8 w-8 text-gray-400" />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">추가 이미지</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // 리뷰어 모집 정보 입력 단계 UI
    const renderReviewerStep = () => {
        return (
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Users size={20} className="mr-2" />
                    리뷰어 모집 정보
                </h2>

                {/* 모집 인원 */}
                <div>
                    <label htmlFor="reviewerCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        모집 인원 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            id="reviewerCount"
                            name="reviewerCount"
                            value={formData.reviewerCount}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                            min="1"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">명</span>
                        </div>
                    </div>
                    {errors.reviewerCount && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.reviewerCount}
                        </p>
                    )}
                </div>

                {/* 리뷰 비용 */}
                <div>
                    <label htmlFor="reviewBudget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        리뷰어당 지급 금액 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₩</span>
                        </div>
                        <input
                            type="number"
                            id="reviewBudget"
                            name="reviewBudget"
                            value={formData.reviewBudget}
                            onChange={handleChange}
                            className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                            min="0"
                            step="1000"
                        />
                    </div>
                    {errors.reviewBudget && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.reviewBudget}
                        </p>
                    )}
                </div>

                {/* 캠페인 기간 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        캠페인 기간 <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="campaignDuration.start" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                시작일
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar size={16} className="text-gray-500" />
                                </div>
                                <input
                                    type="date"
                                    id="campaignDuration.start"
                                    name="campaignDuration.start"
                                    value={formData.campaignDuration.start}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min={todayString}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="campaignDuration.end" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                종료일
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar size={16} className="text-gray-500" />
                                </div>
                                <input
                                    type="date"
                                    id="campaignDuration.end"
                                    name="campaignDuration.end"
                                    value={formData.campaignDuration.end}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min={formData.campaignDuration.start}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 리뷰 마감일 */}
                <div>
                    <label htmlFor="reviewDeadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        리뷰 마감일 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={16} className="text-gray-500" />
                        </div>
                        <input
                            type="date"
                            id="reviewDeadline"
                            name="reviewDeadline"
                            value={formData.reviewDeadline}
                            onChange={handleChange}
                            className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min={formData.campaignDuration.end}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        캠페인 종료일 이후로 설정해주세요. 리뷰어는 이 날짜까지 리뷰를 제출해야 합니다.
                    </p>
                </div>

                {/* 리뷰 플랫폼 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        리뷰 플랫폼 <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {reviewPlatforms.map((platform) => (
                            <button
                                key={platform.id}
                                type="button"
                                onClick={() => toggleReviewPlatform(platform.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                                    formData.reviewPlatforms.includes(platform.id)
                                        ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                                } hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors`}
                            >
                                {platform.name}
                            </button>
                        ))}
                    </div>
                    {errors.reviewPlatforms && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.reviewPlatforms}
                        </p>
                    )}
                </div>

                {/* 리뷰어 조건 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        리뷰어 조건 (선택사항)
                    </label>

                    {/* 추가된 리뷰어 조건 */}
                    <div className="space-y-3 mb-3">
                        {formData.reviewerConditions.map((condition) => {
                            const conditionInfo = reviewerConditions.find((c) => c.id === condition.id);
                            return (
                                <div key={condition.id} className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {conditionInfo?.name}
                                        </div>
                                        <input
                                            type="text"
                                            value={condition.value}
                                            onChange={(e) => handleReviewerConditionChange(condition.id, e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={`${conditionInfo?.name} 조건 입력`}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeReviewerCondition(condition.id)}
                                        className="h-10 w-10 flex items-center justify-center text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* 조건 추가 드롭다운 */}
                    {formData.reviewerConditions.length < reviewerConditions.length && (
                        <div className="relative inline-block text-left">
                            <div>
                                <button
                                    type="button"
                                    className="inline-flex justify-center items-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={() => {
                                        const dropdown = document.getElementById('condition-dropdown');
                                        if (dropdown) {
                                            dropdown.classList.toggle('hidden');
                                        }
                                    }}
                                >
                                    조건 추가
                                    <ChevronDown size={16} className="ml-2" />
                                </button>
                            </div>
                            <div
                                id="condition-dropdown"
                                className="hidden origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
                            >
                                <div className="py-1">
                                    {reviewerConditions
                                        .filter(
                                            (condition) =>
                                                !formData.reviewerConditions.some((c) => c.id === condition.id)
                                        )
                                        .map((condition) => (
                                            <button
                                                key={condition.id}
                                                type="button"
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                                onClick={() => {
                                                    addReviewerCondition(condition.id);
                                                    const dropdown = document.getElementById('condition-dropdown');
                                                    if (dropdown) {
                                                        dropdown.classList.add('hidden');
                                                    }
                                                }}
                                            >
                                                {condition.name}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // 상세 정보 입력 단계 UI
    const renderDetailStep = () => {
        return (
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <ClipboardList size={20} className="mr-2" />
                    상세 정보
                </h2>

                {/* 캠페인 설명 */}
                <div>
                    <label htmlFor="campaignDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        캠페인 상세 설명 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="campaignDescription"
                        name="campaignDescription"
                        value={formData.campaignDescription}
                        onChange={handleChange}
                        rows={8}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="캠페인의 상세 설명을 입력하세요. 리뷰어가 알아야 할 제품의 특징, 리뷰 작성 시 포함해야 할 내용 등을 상세히 기재해주세요."
                    />
                    {errors.campaignDescription && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.campaignDescription}
                        </p>
                    )}
                </div>

                {/* 캠페인 유의사항 */}
                <div>
                    <label htmlFor="campaignNotice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        캠페인 유의사항
                    </label>
                    <textarea
                        id="campaignNotice"
                        name="campaignNotice"
                        value={formData.campaignNotice}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="리뷰어들이 주의해야 할 사항이 있다면 입력해주세요."
                    />
                </div>

                {/* 해시태그 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        해시태그 (선택사항)
                    </label>
                    <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                        {formData.tags.map((tag, index) => (
                            <div
                                key={index}
                                className="flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full text-sm"
                            >
                                <span className="mr-1">#{tag}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            className="flex-1 min-w-32 border-0 p-0 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0"
                            placeholder={formData.tags.length === 0 ? "해시태그 입력 (엔터로 추가)" : ""}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        해시태그를 입력하고 엔터를 누르면 추가됩니다. (예: 신상품, 여름아이템)
                    </p>
                </div>

                {/* 프리미엄 캠페인 설정 */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                        프리미엄 캠페인으로 설정 (추가 비용 발생)
                    </label>
                </div>

                {/* 프리미엄 캠페인 설명 */}
                {formData.isFeatured && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                        <div className="flex">
                            <Info size={20} className="text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                                    프리미엄 캠페인 안내
                                </h3>
                                <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                                    프리미엄 캠페인은 리뷰어 목록 상단에 노출되며, 더 많은 리뷰어에게 노출됩니다.
                                    추가 비용은 캠페인 당 30,000원이며, 익월 정산 시 함께 청구됩니다.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 제출 오류 메시지 */}
                {errors.submit && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                        <div className="flex">
                            <AlertCircle size={20} className="text-red-500 mr-2 flex-shrink-0" />
                            <p className="text-sm text-red-700 dark:text-red-400">{errors.submit}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* 페이지 헤더 */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">새 캠페인 등록</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    새로운 체험단 캠페인을 등록하고 리뷰어를 모집하세요.
                </p>
            </div>

            {/* 폼 단계 표시 */}
            <div className="mb-8">
                <div className="flex items-center">
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            formStep >= 1
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        1
                    </div>
                    <div
                        className={`flex-1 h-1 mx-2 ${
                            formStep >= 2
                                ? 'bg-blue-600'
                                : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    ></div>
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            formStep >= 2
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        2
                    </div>
                    <div
                        className={`flex-1 h-1 mx-2 ${
                            formStep >= 3
                                ? 'bg-blue-600'
                                : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    ></div>
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            formStep >= 3
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        3
                    </div>
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">기본 정보</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">리뷰어 모집 정보</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">상세 정보</span>
                </div>
            </div>

            {/* 폼 */}
            <form onSubmit={(e) => handleSubmit(e)} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {renderCurrentStep()}

                {/* 단계 이동 및 제출 버튼 */}
                <div className="mt-8 flex justify-between">
                    {formStep > 1 ? (
                        <button
                            type="button"
                            onClick={handlePrevStep}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            이전 단계
                        </button>
                    ) : (
                        <div></div>
                    )}

                    <div className="flex gap-2">
                        {formStep === 3 && (
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {isSubmitting ? '저장 중...' : '임시저장'}
                            </button>
                        )}

                        {formStep < 3 ? (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                다음 단계
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {isSubmitting ? '제출 중...' : '캠페인 등록하기'}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}