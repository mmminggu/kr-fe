"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {AlertCircle, Lock, Mail, Phone, ShieldCheck, User} from "lucide-react"

export function UserInfoSection() {
  const [showVerification, setShowVerification] = useState(false)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>내정보 수정</CardTitle>
        <CardDescription>개인 정보를 수정하실 수 있습니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>수정하기</Button>
      </CardFooter>
    </Card>
  )
}
