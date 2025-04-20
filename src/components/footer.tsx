import Link from "next/link"
import { Separator } from "@/src/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">법적 정보</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-semibold mb-4">고객 지원</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>이메일: support@kreview.com</li>
              <li>전화: 010-1234-5678</li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="font-semibold mb-4">회사 정보</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>KReview Inc. | CEO 홍길동</li>
              <li>사업자등록번호: 123-45-67890</li>
              <li>서울특별시 강남구 테헤란로 123</li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center text-sm text-gray-500">© 2025 KReview. All rights reserved.</div>
      </div>
    </footer>
  )
}
