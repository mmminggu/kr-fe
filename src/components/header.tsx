"use client"
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Menu, Bell } from "lucide-react";
import {useState} from "react";
import { useRouter } from "next/navigation";
import NotificationPanel from "@/src/components/NotificationPanel";

export function Header() {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const NAV_ITEMS = [
        { label: "캠페인", path: "/" },
        { label: "내 캠페인", path: "/campaignMy" },
        { label: "포인트", path: "/point" },
        { label: "마이페이지", path: "/mypage2" },
        { label: "고객센터", path: "/customerCenter" },
    ];
    const router = useRouter();

    return (
        <header className="border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                {/* Top Row: 로고 + 로그인 (모바일 메뉴 버튼) */}
                <div className="flex items-center justify-between w-full sm:w-auto">
                    <Link href="/" className="text-2xl font-bold text-gray-800">
                        KReview
                    </Link>
                    <div className="sm:hidden">
                        <Button variant="outline" size="icon">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* 중간: 네비게이션 메뉴 */}
                <nav className="w-full">
                    <div className="flex flex-wrap justify-start gap-2 sm:hidden">
                        {NAV_ITEMS.map(({ label, path }) => (
                            <Link href={path} key={label}>
                                <Button variant="ghost" className="text-sm font-medium px-3">
                                    {label}
                                </Button>
                            </Link>
                        ))}
                    </div>

                    <div className="hidden sm:flex justify-center gap-6">
                        {NAV_ITEMS.map(({ label, path }) => (
                            <Link href={path} key={label}>
                                <Button variant="ghost" className="text-base font-medium">
                                    {label}
                                </Button>
                            </Link>
                        ))}
                    </div>

                </nav>

                {/* 우측: 알림 + 로그인/회원가입 */}
                <div className="hidden sm:flex items-center space-x-3">
                    {/* 알림 아이콘 */}
                    <button
                        type="button"
                        className="relative text-gray-600 hover:text-black"
                        aria-label="알림"
                        onClick={() => setIsNotificationOpen(true)}
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute  -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">3</span>
                    </button>

                    {/* 로그인/회원가입 */}
                    <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
                        로그인
                    </Button>
                    <Button size="sm" onClick={() => router.push("/signup")}>회원가입</Button>
                </div>
                {isNotificationOpen && (
                    <NotificationPanel
                        onClose={() => setIsNotificationOpen(false)}
                        notifications={[
                            { id: 1, title: "포인트 적립", description: "리뷰 캠페인 참여 완료", date: "2025-04-18", read: false },
                            { id: 2, title: "문의 답변", description: "문의사항 답변이 완료되었습니다.", date: "2025-04-17", read: false },
                            { id: 3, title: "구매증빙 승인", description: "구매 영수증이 승인되었습니다.", date: "2025-04-17", read: true }
                        ]}
                    />
                )}
            </div>
        </header>
    );
}
