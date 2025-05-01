"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Mail,
    User,
    Lock,
    Phone,
    Info,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";

export default function SignupPage() {
    // 폼 상태 관리
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        gender: 'male', // 기본값
        password: '',
        confirmPassword: '',
        phone: '',
        agreeTerms: false,
        agreeMarketing: false
    });

    // 인증 관련 상태
    const [showVerification, setShowVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);

    // 입력 오류 관리
    const [errors, setErrors] = useState({});

    // 폼 입력 처리
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // 입력 시 해당 필드 오류 초기화
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    // 휴대폰 인증 관련 핸들러
    const handleVerifyPhone = () => {
        if (!formData.phone) {
            setErrors({
                ...errors,
                phone: '핸드폰 번호를 입력해주세요.'
            });
            return;
        }

        // 인증번호 입력 UI 표시
        setShowVerification(true);
        // 실제로는 여기서 인증번호를 발송하는 API 호출이 필요합니다
    };

    // 인증번호 확인
    const handleVerifyCode = () => {
        if (!verificationCode) {
            return;
        }

        setVerifyLoading(true);

        // 실제로는 서버에서 인증번호 검증이 필요합니다
        setTimeout(() => {
            setIsVerified(true);
            setShowVerification(false);
            setVerifyLoading(false);
        }, 1000);
    };

    // 취소 버튼 핸들러 추가
    const handleCancelVerify = () => {
        setShowVerification(false);
        setVerificationCode('');
    };

    // 전체 양식 제출
    const handleSubmit = (e) => {
        e.preventDefault();

        // 유효성 검사
        const newErrors = {};

        if (!formData.email) newErrors.email = '이메일을 입력해주세요.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '유효한 이메일 형식이 아닙니다.';

        if (!formData.name) newErrors.name = '이름을 입력해주세요.';

        if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';
        else if (formData.password.length < 8) newErrors.password = '비밀번호는 8자 이상이어야 합니다.';

        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';

        if (!formData.phone) newErrors.phone = '핸드폰 번호를 입력해주세요.';

        if (!formData.agreeTerms) newErrors.agreeTerms = '이용약관에 동의해주세요.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // 회원가입 처리 (실제로는 API 호출)
        console.log('회원가입 처리:', formData);
        // 회원가입 성공 후 로그인 페이지로 이동
        // router.push('/login');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                {/* 로고 및 헤더 */}
                <div className="flex flex-col items-center mb-8">
                    <Image src="/logos/login_logo.png" alt="로고" width={200} height={50} />
                    <div className="w-full mt-8 mb-2 flex items-center justify-center">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <h2 className="text-lg font-medium text-gray-800 mx-4">회원가입</h2>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
                    <p className="text-sm text-gray-500">
                        가입 후 서비스를 이용해보세요.
                    </p>
                </div>

                {/* 회원가입 폼 */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* 이메일 */}
                    <div className="space-y-1.5">
                        <div className="flex items-center">
                            <div className="w-24 flex items-center">
                                <Mail className="w-4 h-4 text-indigo-400 mr-1.5" />
                                <label htmlFor="email" className="text-xs font-medium text-gray-600">이메일</label>
                            </div>
                            <div className="flex-1">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={`w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                />
                            </div>
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-500 pl-20">{errors.email}</p>
                        )}
                    </div>

                    {/* 이름 */}
                    <div className="space-y-1.5">
                        <div className="flex items-center">
                            <div className="w-24 flex items-center">
                                <User className="w-4 h-4 text-indigo-400 mr-1.5" />
                                <label htmlFor="name" className="text-xs font-medium text-gray-600">이름</label>
                            </div>
                            <div className="flex-1">
                                <Input
                                    id="name"
                                    name="name"
                                    className={`w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="실명을 입력하세요"
                                />
                            </div>
                        </div>
                        {errors.name && (
                            <p className="text-xs text-red-500 pl-20">{errors.name}</p>
                        )}
                    </div>

                    {/* 성별 */}
                    <div className="space-y-1">
                        <div className="flex items-start">
                            <div className="w-24 flex items-center pt-2">
                                <User className="w-4 h-4 text-indigo-400 mr-1.5" />
                                <label className="text-xs font-medium text-gray-600">성별</label>
                            </div>
                            <div className="flex-1">
                                <div className="flex space-x-3">
                                    <div
                                        className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md cursor-pointer border transition-all ${
                                            formData.gender === 'male'
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => setFormData({...formData, gender: 'male'})}
                                    >
                                        <input
                                            type="radio"
                                            id="male"
                                            name="gender"
                                            value="male"
                                            checked={formData.gender === 'male'}
                                            onChange={() => {}}
                                            className="sr-only"
                                        />
                                        <label htmlFor="male" className="text-sm font-medium cursor-pointer">남성</label>
                                    </div>

                                    <div
                                        className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md cursor-pointer border transition-all ${
                                            formData.gender === 'female'
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => setFormData({...formData, gender: 'female'})}
                                    >
                                        <input
                                            type="radio"
                                            id="female"
                                            name="gender"
                                            value="female"
                                            checked={formData.gender === 'female'}
                                            onChange={() => {}}
                                            className="sr-only"
                                        />
                                        <label htmlFor="female" className="text-sm font-medium cursor-pointer">여성</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 비밀번호 */}
                    <div className="space-y-1.5">
                        <div className="flex items-center">
                            <div className="w-24 flex items-center">
                                <Lock className="w-4 h-4 text-indigo-400 mr-1.5" />
                                <label htmlFor="password" className="text-xs font-medium text-gray-600">비밀번호</label>
                            </div>
                            <div className="flex-1">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className={`w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="8자 이상 입력하세요"
                                />
                            </div>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500 pl-20">{errors.password}</p>
                        )}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="space-y-1.5">
                        <div className="flex items-center">
                            <div className="w-24 flex items-center">
                                <Lock className="w-4 h-4 text-indigo-400 mr-1.5" />
                                <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-600">비밀번호 확인</label>
                            </div>
                            <div className="flex-1">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    className={`w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="비밀번호를 다시 입력하세요"
                                />
                            </div>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500 pl-20">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* 핸드폰 번호 + 인증 */}
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <div className="w-24 flex items-center">
                                <Phone className="w-4 h-4 text-indigo-400 mr-1.5" />
                                <label htmlFor="phone" className="text-xs font-medium text-gray-600">핸드폰 번호</label>
                            </div>
                            <div className="flex-1 flex space-x-2">
                                <Input
                                    id="phone"
                                    name="phone"
                                    className={`w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="'-' 없이 입력하세요"
                                />
                                <Button
                                    type="button"
                                    variant={isVerified ? "outline" : "secondary"}
                                    className={`text-xs h-10 whitespace-nowrap px-3 ${isVerified ? 'bg-green-50 text-green-600 border-green-200' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                                    onClick={handleVerifyPhone}
                                    disabled={isVerified || showVerification}
                                >
                                    {isVerified ? '인증완료' : '인증하기'}
                                </Button>
                            </div>
                        </div>

                        {errors.phone && (
                            <p className="text-xs text-red-500 pl-20">{errors.phone}</p>
                        )}

                        {/* 인증번호 입력 영역 - 인증하기 버튼 클릭시 노출됨 */}
                        {showVerification && (
                            <div className="pl-24 space-y-2 pt-1">
                                <div className="flex space-x-2">
                                    <Input
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        placeholder="인증번호 6자리"
                                        maxLength={6}
                                        className="h-10 text-sm bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md"
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="text-xs h-10 whitespace-nowrap bg-indigo-500 text-white hover:bg-indigo-600"
                                        onClick={handleVerifyCode}
                                        disabled={verifyLoading}
                                    >
                                        {verifyLoading ? '확인 중...' : '확인'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-xs h-10 whitespace-nowrap"
                                        onClick={handleCancelVerify}
                                        disabled={verifyLoading}
                                    >
                                        취소
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    입력하신 핸드폰 번호로 발송된 인증번호 6자리를 입력해주세요. (유효시간: 5분)
                                </p>
                            </div>
                        )}

                        {!isVerified && !errors.phone && !showVerification && (
                            <div className="flex items-center pl-20 gap-1">
                                <Info className="w-3 h-3 text-blue-500" />
                                <p className="text-xs text-blue-500">핸드폰 인증 시 포인트가 추가로 지급됩니다</p>
                            </div>
                        )}

                        {isVerified && (
                            <div className="flex items-center pl-20 gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                                <p className="text-xs text-green-600">핸드폰 인증이 완료되었습니다</p>
                            </div>
                        )}
                    </div>

                    {/* 약관 동의 */}
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                        <div className="flex items-start">
                            <Checkbox
                                id="agreeTerms"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onCheckedChange={(checked) => setFormData({...formData, agreeTerms: checked})}
                                className={`mt-0.5 ${errors.agreeTerms ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            <label
                                htmlFor="agreeTerms"
                                className="ml-2 text-xs text-gray-700 leading-tight"
                            >
                                <span className="font-medium text-gray-900">(필수)</span> 이용약관 및 개인정보 처리방침에 동의합니다.
                            </label>
                        </div>

                        {errors.agreeTerms && (
                            <p className="text-xs text-red-500">{errors.agreeTerms}</p>
                        )}
                    </div>

                    {/* 회원가입 버튼 */}
                    <Button
                        type="submit"
                        className="w-full h-11 mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-md shadow-md transition-all"
                    >
                        회원가입
                    </Button>

                    {/* 로그인 링크 */}
                    <div className="text-center text-sm mt-4">
                        <span className="text-gray-500">이미 계정이 있으신가요?</span>
                        <Link href="/login" className="ml-1 text-indigo-600 hover:text-indigo-800 font-medium">
                            로그인하기
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}