"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import {AlertCircle, Lock, Mail, Phone, ShieldCheck, User, MessageCircle, CreditCard, UserCheck} from "lucide-react"

export function UserInfoSection() {
  const [showVerification, setShowVerification] = useState(false)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>내정보 수정</CardTitle>
        <CardDescription>개인 정보를 수정하실 수 있습니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-7">
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

          {/* ✅ 계좌번호 (라벨 + 은행선택 + 계좌번호 입력 한 줄) */}
          <div className="flex items-center gap-3">
            <Label className="w-36 text-gray-700 flex items-center gap-1">
              <CreditCard className="w-4 h-4" /> 계좌번호
            </Label>
            <div className="flex gap-2 w-full">
              {/* 은행 선택 */}
              <select className="w-1/3 border rounded px-3 py-2 text-sm">
                <option value="">은행 선택</option>
                <option value="국민은행">국민은행</option>
                <option value="신한은행">신한은행</option>
                <option value="우리은행">우리은행</option>
                <option value="카카오뱅크">카카오뱅크</option>
                <option value="농협은행">농협은행</option>
              </select>

              {/* 계좌번호 입력 */}
              <Input className="w-2/3" placeholder="계좌번호 입력" />
            </div>
          </div>

          {/* ✅ 예금주 입력 */}
          <div className="flex items-center gap-3">
            <Label className="w-36 text-gray-700 flex items-center gap-1">
              <UserCheck className="w-4 h-4" /> 예금주
            </Label>
            <Input placeholder="예금주 입력" />
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
          {/* 카카오톡 ID - 왼쪽에만 표시, 오른쪽은 비움 */}
          <div className="flex items-center gap-3">
            <Label className="w-36 text-gray-700 flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              카카오톡 ID
            </Label>
            <Input
                type="text"
                placeholder="kakao123"
                className="w-full"
            />
          </div>

          {/* 오른쪽 비워두기 */}
          <div></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>수정하기</Button>
      </CardFooter>
    </Card>
  )
}
