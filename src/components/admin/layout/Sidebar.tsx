'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    FileText,
    DollarSign,
    Settings,
    HelpCircle,
    ChevronDown,
    LogOut,
    Users,
    Package,
    FileCheck,
    Bell,
    Home,
    ExternalLink,
    User,
} from 'lucide-react';

export default function AdminSidebar() {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationOpen(false);
            }
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleSubmenu = (name: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const isSubitemActive = (subHref: string) =>
        pathname === subHref || pathname.startsWith(subHref + '/');

    const isItemActive = (item: any) => {
        if (item.submenu) {
            return item.submenu.some((sub) => isSubitemActive(sub.href));
        }
        return pathname === item.href;
    };

    const navItems = [
        /*{ name: '대시보드', icon: <LayoutDashboard size={20} />, href: '/admin' },*/
        { name: '회원 관리', icon: <Users size={20} />, href: '/admin/users' },
        {
            name: '캠페인 관리',
            icon: <Package size={20} />,
            href: '/admin/campaigns',
            /*submenu: [
                { name: '캠페인 목록', href: '/admin/campaigns' },
                { name: '캠페인 승인', href: '/admin/campaigns/approval' },
                { name: '예약 리스트', href: '/admin/campaigns/reservations' },
            ],*/
        },
        /*{
            name: '리뷰어 활동',
            icon: <FileText size={20} />,
            href: '/admin/reviewers',
        },*/
        {
            name: '쇼핑몰 관리',
            icon: <ShoppingBag size={20} />,
            href: '/admin/shops',
            /*submenu: [
                /!*{ name: '쇼핑몰 등록', href: '/admin/shops/create' },*!/
                { name: '쇼핑몰 목록', href: '/admin/shops' },
            ],*/
        },
        {
            name: '고객센터',
            icon: <HelpCircle size={20} />,
            href: '/admin/customer-service/inquiries',
            submenu: [
                { name: 'FAQ', href: '/admin/customer-service/faq' },
                { name: '공지사항', href: '/admin/customer-service/notices' },
                { name: '문의', href: '/admin/customer-service/inquiries' },
            ],
        },
        { name: '광고 견적', icon: <FileCheck size={20} />, href: '/admin/adQuotation' },
        {
            name: '정산 관리',
            icon: <DollarSign size={20} />,
            href: '/admin/settlements',
            submenu: [
                { name: '포인트 출금 신청 내역', href: '/admin/settlements/withdrawal' },
                { name: '포인트 전체 리스트', href: '/admin/settlements/points' },
                { name: '캠페인 입출금 내역', href: '/admin/settlements/campaign' },
            ],
        },
        { name: '알림', icon: <Bell size={20} />, href: '/admin/notifications' },
    ];

    return (
        <aside className="fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* 로고 */}
            <div className="px-6 py-[26px] border-b border-gray-200  bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
                <Link href="/admin" className="flex items-center gap-2 text-xl font-semibold text-gray-800 ">
                    {/* 로고 아이콘 또는 약자 */}
                    <div className="w-32 h-9 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                        K-REVIEW
                    </div>
                    <span className="hidden sm:inline-block tracking-tight">ADMIN</span>
                </Link>
            </div>

            {/* 내비게이션 메뉴 */}
            <nav className="flex-1 overflow-y-auto py-4 px-4">
                <ul className="space-y-1.5">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            {item.submenu ? (
                                <div>
                                    <button
                                        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm ${
                                            isItemActive(item)
                                                ? 'bg-purple-50 text-purple-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        onClick={() => toggleSubmenu(item.name)}
                                    >
                                        <div className="flex items-center">
                      <span className={`mr-3 ${isItemActive(item) ? 'text-purple-500' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                                            <span>{item.name}</span>
                                        </div>
                                        <ChevronDown size={16} className={`transition-transform ${expandedItems[item.name] ? 'rotate-180' : ''}`} />
                                    </button>
                                    {expandedItems[item.name] && (
                                        <ul className="mt-1 pl-9 space-y-1">
                                            {item.submenu.map((subitem) => (
                                                <li key={subitem.name}>
                                                    <Link
                                                        href={subitem.href}
                                                        className={`block px-4 py-2 rounded-lg text-sm ${
                                                            isSubitemActive(subitem.href)
                                                                ? 'bg-purple-100 text-purple-700 font-medium'
                                                                : 'text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {subitem.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-4 py-2.5 rounded-lg text-sm ${
                                        isItemActive(item)
                                            ? 'bg-purple-50 text-purple-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                  <span className={`mr-3 ${isItemActive(item) ? 'text-purple-500' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                                    <span>{item.name}</span>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* 하단 프로필 */}
            <div className="relative flex items-center justify-between w-full px-4 py-3 border-t border-gray-200">
                <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center justify-center">
                            <User size={16} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-800">홍길동</p>
                            <p className="text-xs text-gray-500">관리자</p>
                        </div>
                    </div>
                </button>
                {profileOpen && (
                    <div className="absolute left-4 bottom-16 w-56 bg-white border shadow-md rounded-md z-40">
                        <div className="px-4 py-3 border-b border-gray-100 ">
                            <p className="text-sm font-medium text-gray-800 ">플로우몰</p>
                            <p className="text-xs text-gray-500 ">flow@example.com</p>
                        </div>
                        <Link
                            href="/client/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50  "
                        >
                            <User size={16} className="mr-2 text-gray-500 " />
                            프로필 설정
                        </Link>
                        <button
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50  "
                        >
                            <LogOut size={16} className="mr-2 text-gray-500 " />
                            로그아웃
                        </button>
                    </div>
                )}
                {/* 알림 버튼 (오른쪽) */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setNotificationOpen(!notificationOpen)}
                        className="p-1 rounded hover:bg-gray-100"
                    >
                        <Bell size={21} className="text-gray-500" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white">
                            5
                          </span>
                    </button>

                    {/* 알림 드롭다운 */}
                    {notificationOpen && (
                        <div className="absolute -right-80 bottom-10 w-80 rounded-md shadow-lg border bg-white z-50">
                            {/* 헤더 */}
                            <div className="px-4 py-2 border-b flex justify-between items-center border-gray-100 ">
                                <p className="text-sm font-medium">알림</p>
                                <button className="text-xs text-purple-600 hover:text-purple-800  ">
                                    모두 읽음 표시
                                </button>
                            </div>

                            {/* 알림 리스트 */}
                            <div className="divide-y divide-gray-100 ">
                                {/* 샘플 알림 항목들 */}
                                <div className="px-4 py-3 cursor-pointer hover:bg-gray-50 ">
                                    <div className="flex">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2" />
                                        <div>
                                            <p className="text-sm">새로운 리뷰어 신청이 3건 있습니다.</p>
                                            <p className="text-xs mt-1 text-gray-500 ">10분 전</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 cursor-pointer hover:bg-gray-50 ">
                                    <div className="flex">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2" />
                                        <div>
                                            <p className="text-sm">"여름 신상품" 캠페인 리뷰 2건이 제출되었습니다.</p>
                                            <p className="text-xs mt-1 text-gray-500 ">1시간 전</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 cursor-pointer hover:bg-gray-50 ">
                                    <div className="flex">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-2" />
                                        <div>
                                            <p className="text-sm">"화장품 테스터" 캠페인 마감이 2일 남았습니다.</p>
                                            <p className="text-xs mt-1 text-gray-500 ">5시간 전</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 하단 전체 보기 */}
                            <div className="px-4 py-2 border-t text-center border-gray-100 ">
                                <Link
                                    href="/client/notifications"
                                    className="text-xs text-purple-600 hover:text-purple-800  "
                                >
                                    모든 알림 보기
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
