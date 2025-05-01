

"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    User,
    Phone,
    ArrowLeft,
    Mail,
    Check,
    AlertCircle,
    Info,
    CheckCircle2
} from 'lucide-react';

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Card, CardContent } from "@/src/components/ui/card";
import { Alert, AlertDescription } from "@/src/components/ui/alert";

export default function FindAccountPage() {
    // 탭 상태
    const [activeTab, setActiveTab] = useState("findId");

    // 아이디찾기 폼 상태
    const [findIdForm, setFindIdForm] = useState({
        name: '',
        phone: ''
    });

    // 비밀번호찾기 폼 상태
    const [findPwForm, setFindPwForm] = useState({
        email: '',
        phone: ''
    });

    // 인증 관련 상태
    const [showVerification, setShowVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);

    // 결과 상태
    const [idResult, setIdResult] = useState(null);
    const [pwResult, setpwResult] = useState(false);

    // 오류 상태
    const [idErrors, setIdErrors] = useState({});
    const [pwErrors, setPwErrors] = useState({});

    // 아이디찾기 입력 핸들러
    const handleIdFormChange = (e) => {
        const { name, value } = e.target;
        setFindIdForm({
            ...findIdForm,
            [name]: value
        });

        // 입력 시 해당 필드 오류 초기화
        if (idErrors[name]) {
            setIdErrors({
                ...idErrors,
                [name]: null
            });
        }
    };

    // 비밀번호찾기 입력 핸들러
    const handlePwFormChange = (e) => {
        const { name, value } = e.target;
        setFindPwForm({
            ...findPwForm,
            [name]: value
        });

        // 입력 시 해당 필드 오류 초기화
        if (pwErrors[name]) {
            setPwErrors({
                ...pwErrors,
                [name]: null
            });
        }
    };

    // 휴대폰 인증 핸들러
    const handleVerifyPhone = () => {
        if (!findPwForm.phone) {
            setPwErrors({
                ...pwErrors,
                phone: '핸드폰 번호를 입력해주세요'
            });
            return;
        }

        // 인증번호 입력 UI 표시
        setShowVerification(true);
        // 실제로는 여기서 인증번호를 발송하는 API 호출이 필요합니다
    };

    // 인증 취소 핸들러
    const handleCancelVerify = () => {
        setShowVerification(false);
        setVerificationCode('');
    };

    // 인증번호 확인 핸들러
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

    // 아이디 찾기 요청 처리
    const handleFindId = (e) => {
        e.preventDefault();

        // 유효성 검사
        const errors = {};

        if (!findIdForm.name) {
            errors.name = '이름을 입력해주세요';
        }

        if (!findIdForm.phone) {
            errors.phone = '핸드폰 번호를 입력해주세요';
        }

        if (Object.keys(errors).length > 0) {
            setIdErrors(errors);
            return;
        }

        // 아이디 찾기 요청 (실제로는 API 호출)
        setTimeout(() => {
            setIdResult({
                email: 'user***@gmail.com',
                registerDate: '2023년 10월 15일'
            });
        }, 800);
    };

    // 비밀번호 찾기 요청 처리
    const handleFindPassword = (e) => {
        e.preventDefault();

        // 유효성 검사
        const errors = {};

        if (!findPwForm.email) {
            errors.email = '이메일을 입력해주세요';
        } else if (!/\S+@\S+\.\S+/.test(findPwForm.email)) {
            errors.email = '유효한 이메일 형식이 아닙니다';
        }

        if (!findPwForm.phone) {
            errors.phone = '핸드폰 번호를 입력해주세요';
        }

        if (!isVerified) {
            errors.verify = '핸드폰 인증이 필요합니다';
        }

        if (Object.keys(errors).length > 0) {
            setPwErrors(errors);
            return;
        }

        // 비밀번호 찾기 요청 (실제로는 API 호출)
        setTimeout(() => {
            setpwResult(true);
        }, 800);
    };

    // 처음으로 돌아가기
    const handleReset = () => {
        setFindIdForm({ name: '', phone: '' });
        setFindPwForm({ email: '', phone: '' });
        setIdResult(null);
        setpwResult(false);
        setIdErrors({});
        setPwErrors({});
        setIsVerified(false);
        setVerificationCode('');
        setShowVerification(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                {/* 로고 및 헤더 */}
                <div className="flex flex-col items-center mb-8">
                    <Image src="/logos/login_logo.png" alt="로고" width={200} height={50} />

                    <div className="w-full mt-8 mb-2 flex items-center justify-center">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <h2 className="text-lg font-medium text-gray-800 mx-4">계정 찾기</h2>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <p className="text-sm text-gray-500">
                        {idResult || pwResult ? '회원님의 계정 정보입니다' : '잊어버린 계정 정보를 찾아보세요'}
                    </p>
                </div>

                {idResult || pwResult ? (
                    // 결과 화면
                    <div className="space-y-6">
                        {idResult && (
                            <Card className="border-indigo-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-3 px-4">
                                    <h3 className="text-white font-medium text-sm">이메일 찾기 결과</h3>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center">
                                            <Check className="w-5 h-5 text-green-500 mr-2" />
                                            <span className="font-medium text-sm">회원님의 정보를 찾았습니다</span>
                                        </div>
                                        <span className="text-xs text-gray-500">가입일: {idResult.registerDate}</span>
                                    </div>

                                    <div className="flex items-center bg-gray-50 p-3 rounded-md border border-gray-100">
                                        <Mail className="w-4 h-4 text-indigo-500 mr-2" />
                                        <span className="text-sm font-medium">{idResult.email}</span>
                                    </div>

                                    <p className="text-xs text-gray-500 mt-3">
                                        개인정보 보호를 위해 이메일 일부는 ***로 표시됩니다
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {pwResult && (
                            <Card className="border-indigo-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-3 px-4">
                                    <h3 className="text-white font-medium text-sm">비밀번호 찾기 결과</h3>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex items-center mb-3">
                                        <Check className="w-5 h-5 text-green-500 mr-2" />
                                        <span className="font-medium text-sm">회원님의 정보를 찾았습니다.</span>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-md border border-gray-100 text-sm">
                                        <p>asdfasdf***</p>
                                    </div>

                                    {/* 안내 메시지 */}
                                    <Alert className="bg-red-50 border-red-200 p-3 mt-3">
                                        <div className="flex">
                                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0"/>
                                            <AlertDescription className="text-xs text-red-800 ml-2">
                                                비밀번호 찾기로 인해 포인트 10점이 차감 될 예정입니다.
                                            </AlertDescription>
                                        </div>
                                    </Alert>
                                </CardContent>
                            </Card>
                        )}

                        <div className="flex space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 h-10"
                                onClick={handleReset}
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                다시 찾기
                            </Button>

                            <Button
                                type="button"
                                className="flex-1 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                            >
                                <Link href="/login" className="text-white">
                                    로그인하기
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    // 아이디/비밀번호 찾기 폼
                    <Tabs
                        defaultValue="findId"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid grid-cols-2 mb-6">
                            <TabsTrigger
                                value="findId"
                                className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700"
                            >
                                아이디 찾기
                            </TabsTrigger>
                            <TabsTrigger
                                value="findPw"
                                className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700"
                            >
                                비밀번호 찾기
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="findId" className="mt-0">
                            <form onSubmit={handleFindId} className="space-y-5">
                                {/* 이름 */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center">
                                        <div className="w-24 flex items-center">
                                            <User className="w-4 h-4 text-indigo-400 mr-1.5" />
                                            <label htmlFor="id-name" className="text-xs font-medium text-gray-600">이름</label>
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                id="id-name"
                                                name="name"
                                                className={`w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md ${idErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                                                value={findIdForm.name}
                                                onChange={handleIdFormChange}
                                                placeholder="실명을 입력하세요"
                                            />
                                        </div>
                                    </div>
                                    {idErrors.name && (
                                        <p className="text-xs text-red-500 pl-24">{idErrors.name}</p>
                                    )}
                                </div>

                                {/* 핸드폰 번호 */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center">
                                        <div className="w-24 flex items-center">
                                            <Phone className="w-4 h-4 text-indigo-400 mr-1.5" />
                                            <label htmlFor="id-phone" className="text-xs font-medium text-gray-600">핸드폰 번호</label>
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                id="id-phone"
                                                name="phone"
                                                className={`w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md ${idErrors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                                                value={findIdForm.phone}
                                                onChange={handleIdFormChange}
                                                placeholder="'-' 없이 입력하세요"
                                            />
                                        </div>
                                    </div>
                                    {idErrors.phone && (
                                        <p className="text-xs text-red-500 pl-24">{idErrors.phone}</p>
                                    )}
                                </div>

                                {/* 설명 */}
                                <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
                                    <div className="flex items-start">
                                        <Info className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <p className="text-xs text-blue-700">
                                            회원가입 시 입력한 이름과 핸드폰 번호로 아이디를 찾을 수 있습니다.
                                        </p>
                                    </div>
                                </div>

                                {/* 아이디 찾기 버튼 */}
                                <Button
                                    type="submit"
                                    className="w-full h-11 mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-md shadow-md transition-all"
                                >
                                    아이디 찾기
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="findPw" className="mt-0">
                            <form onSubmit={handleFindPassword} className="space-y-5">
                                {/* 이메일 */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center">
                                        <div className="w-24 flex items-center">
                                            <Mail className="w-4 h-4 text-indigo-400 mr-1.5" />
                                            <label htmlFor="pw-email" className="text-xs font-medium text-gray-600">이메일</label>
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                id="pw-email"
                                                name="email"
                                                type="email"
                                                className={`w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md ${pwErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                                                value={findPwForm.email}
                                                onChange={handlePwFormChange}
                                                placeholder="가입한 이메일을 입력하세요"
                                            />
                                        </div>
                                    </div>
                                    {pwErrors.email && (
                                        <p className="text-xs text-red-500 pl-24">{pwErrors.email}</p>
                                    )}
                                </div>

                                {/* 핸드폰 번호 + 인증 */}
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <div className="w-24 flex items-center">
                                            <Phone className="w-4 h-4 text-indigo-400 mr-1.5" />
                                            <label htmlFor="pw-phone" className="text-xs font-medium text-gray-600">핸드폰 번호</label>
                                        </div>
                                        <div className="flex-1 flex space-x-2">
                                            <Input
                                                id="pw-phone"
                                                name="phone"
                                                className={`w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md ${pwErrors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                                                value={findPwForm.phone}
                                                onChange={handlePwFormChange}
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

                                    {pwErrors.phone && (
                                        <p className="text-xs text-red-500 pl-24">{pwErrors.phone}</p>
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

                                    {isVerified && (
                                        <div className="flex items-center pl-24 gap-1">
                                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                                            <p className="text-xs text-green-600">핸드폰 인증이 완료되었습니다</p>
                                        </div>
                                    )}

                                    {pwErrors.verify && (
                                        <p className="text-xs text-red-500 pl-24">{pwErrors.verify}</p>
                                    )}
                                </div>

                                {/* 안내 메시지 */}
                                <Alert className="bg-red-50 border-red-200 p-3">
                                    <div className="flex">
                                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0"/>
                                        <AlertDescription className="text-xs text-red-800 ml-2">
                                            비밀번호 찾기를 진행하면 포인트 10점이 차감됩니다.
                                        </AlertDescription>
                                    </div>
                                </Alert>

                                {/* 비밀번호 찾기 버튼 */}
                                <Button
                                    type="submit"
                                    className="w-full h-11 mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-md shadow-md transition-all"
                                >
                                    비밀번호 찾기
                                </Button>
                            </form>
                        </TabsContent>

                        <div className="text-center text-sm mt-6">
                            <span className="text-gray-500">아직 회원이 아니신가요?</span>
                            <Link href="/signup" className="ml-1 text-indigo-600 hover:text-indigo-800 font-medium">
                                회원가입하기
                            </Link>
                        </div>
                    </Tabs>
                )}
            </div>
        </div>
    );
}