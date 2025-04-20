"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, User, Lock, Phone, ShieldCheck } from "lucide-react"
import SubAccountSection from "@/components/mypage-sub-account"
import SubAddressSection from "@/components/mypage-sub-address"

export default function UserInfoSection() {
    const [showVerification, setShowVerification] = useState(false)

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">마이페이지</h2>
            <section className="bg-white border rounded-xl shadow-md p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-900">내 정보 수정</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    {/* 이메일 (수정 불가) */}
                    <div className="flex items-center gap-3">
                        <Label className="w-36 text-gray-700 flex items-center gap-1">
                            <Mail className="w-4 h-4" /> 이메일
                        </Label>
                        <Input value="user@example.com" disabled className="bg-gray-100" />
                    </div>

                    {/* 이름 */}
                    <div className="flex items-center gap-3">
                        <Label className="w-36 text-gray-700 flex items-center gap-1">
                            <User className="w-4 h-4" /> 이름
                        </Label>
                        <Input placeholder="이름 입력" value="홍길동" />
                    </div>

                    {/* 비밀번호 */}
                    <div className="flex items-center gap-3">
                        <Label className="w-36 text-gray-700 flex items-center gap-1">
                            <Lock className="w-4 h-4" /> 비밀번호
                        </Label>
                        <Input type="password" placeholder="비밀번호 입력" />
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="flex items-center gap-3">
                        <Label className="w-36 text-gray-700 flex items-center gap-1">
                            <Lock className="w-4 h-4" /> 비밀번호 확인
                        </Label>
                        <Input type="password" placeholder="비밀번호 확인" />
                    </div>

                    {/* 3행: 휴대폰 번호 변경 영역 */}
                    <div className="flex items-center gap-3">
                        <Label className="w-36 text-gray-700 flex items-center gap-1">
                            <Phone className="w-4 h-4" /> 휴대폰 번호
                        </Label>
                        <div className="flex gap-2 w-full">
                            <Input placeholder="010-0000-0000" value="010-1111-2222" />
                            <Button variant="outline" onClick={() => setShowVerification(true)}>
                                번호 변경
                            </Button>
                        </div>
                    </div>

                    {/* 우측 - 인증번호 입력 영역 (동적 표시) */}
                    <div className="flex items-center gap-2">
                        {showVerification ? (
                            <>
                                <Label className="w-36 text-gray-700 flex items-center gap-1">
                                    <ShieldCheck className="w-4 h-4" /> 인증번호
                                </Label>
                                <div className="flex gap-2 w-full">
                                    <Input placeholder="인증번호 입력" />
                                    <Button size="sm">인증</Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setShowVerification(false)}
                                    >
                                        취소
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-xs text-red-500">
                                ※ 휴대폰 번호 변경 시 50포인트가 차감됩니다.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button className="w-full sm:w-auto">수정하기</Button>
                </div>
            </section>
            <SubAccountSection />
            <SubAddressSection />
        </div>
    )
}

