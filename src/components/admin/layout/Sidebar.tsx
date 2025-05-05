'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    MessageSquare,
    FileText,
    DollarSign,
    Settings,
    HelpCircle,
    ChevronDown,
    LogOut, Users, Package, FileCheck, Bell
} from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    submenu?: { name: string; href: string }[];
}

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    // 화면 크기 변경 시 모바일 메뉴 상태 관리
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 서브메뉴 토글 함수
    const toggleSubmenu = (name: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    // 활성 메뉴 아이템 체크 함수
    const isSubitemActive = (subHref: string) => {
        return pathname === subHref || pathname.startsWith(subHref + '/');
    };

    const isItemActive = (item: NavItem): boolean => {
        if (item.submenu) {
            return item.submenu.some(sub => isSubitemActive(sub.href));
        }
        return pathname === item.href;
    };


    // 내비게이션 아이템 정의
    const navItems: NavItem[] = [
        {
            name: "대시보드",
            icon: <LayoutDashboard size={20} />,
            href: "/admin",
        },
        {
            name: "회원관리",
            icon: <Users size={20} />,
            href: "/admin/users",
        },
        {
            name: "캠페인",
            icon: <Package size={20} />,
            href: "/admin/campaigns",
            submenu: [
                { name: "캠페인 목록", href: "/admin/campaigns" },
                { name: "캠페인 승인", href: "/admin/campaigns/approval" },
                { name: "예약 리스트", href: "/admin/campaigns/reservations" },
            ],
        },
        {
            name: "리뷰어 활동",
            icon: <FileText size={20} />,
            href: "/admin/reviewers",
        },
        {
            name: "정산 관리",
            icon: <DollarSign size={20}/>,
            href: '/admin/settlements',
            submenu: [
                {name: "포인트 출금 신청 내역", href: "/admin/settlements/withdrawal"},
                {name: "포인트 전체 리스트", href: "/admin/settlements/points"},
                {name: "캠페인 입출금 내역", href: "/admin/settlements/campaign"},
            ]
        },
        {
            name: "쇼핑몰 관리",
            icon: <ShoppingBag size={20}/>,
            href: '/admin/shops',
            submenu: [
                {name: "쇼핑몰 등록", href: "/admin/shops/create"},
                {name: "쇼핑몰 목록", href: "/admin/shops"},
            ]
        },
        {
            name: "고객센터",
            icon: <HelpCircle size={20} />,
            href: "/admin/customer-service/inquiries",
            submenu: [
                { name: "FAQ", href: "/admin/customer-service/faq" },
                { name: "공지사항", href: "/admin/customer-service/notices" },
                { name: "문의", href: "/admin/customer-service/inquiries" },
            ],
        },
        {
            name: "광고견적",
            icon: <FileCheck size={20} />,
            href: "/admin/ad-quotes",
        },
        {
            name: "알림",
            icon: <Bell size={20} />,
            href: "/admin/notifications",
        },
    ];

    return (
        <>
            {/* 오버레이 - 모바일에서 사이드바 외부 클릭 시 닫힘 */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* 사이드바 */}
            <aside
                className={`
                    fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-gray-800 shadow-xl transform 
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
                    transition-transform duration-300 ease-in-out
                    flex flex-col overflow-y-auto border-r border-gray-200 dark:border-gray-700
                `}
            >
                {/* 로고 영역 */}
                <div className="px-6 py-[21px] border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
                    <Link href="/admin" className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-white">
                        {/* 로고 아이콘 또는 약자 */}
                        <div className="w-32 h-9 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                            K-REVIEW
                        </div>
                        <span className="hidden sm:inline-block tracking-tight">ADMIN</span>
                    </Link>
                </div>

                {/* 내비게이션 메뉴 */}
                <nav className="flex-1 overflow-y-auto py-5 px-4">
                    <ul className="space-y-1.5">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                {item.submenu ? (
                                    <div className="mb-2">
                                        <button
                                            className={`
                        flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm
                        ${isItemActive(item)
                                                ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-600 dark:text-purple-300 font-medium shadow-sm'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750'}
                    `}
                                            onClick={() => toggleSubmenu(item.name)}
                                        >
                                            <div className="flex items-center">
                        <span className={`mr-3 ${isItemActive(item) ? 'text-purple-500' : 'text-gray-500 dark:text-gray-400'}`}>
                            {item.icon}
                        </span>
                                                <span>{item.name}</span>
                                            </div>
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform text-gray-500 dark:text-gray-400 ${expandedItems[item.name] ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {/* 서브메뉴 */}
                                        {expandedItems[item.name] && (
                                            <ul className="mt-1 pl-9 space-y-1">
                                                {item.submenu.map((subitem) => (
                                                    <li key={subitem.name}>
                                                        <Link
                                                            href={subitem.href}
                                                            className={`
                                        block px-4 py-2 rounded-lg text-sm transition-colors
                                        ${isSubitemActive(subitem.href)
                                                                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 font-medium'
                                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 hover:text-gray-800 dark:hover:text-gray-200'}
                                    `}
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
                                        className={`
                    flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors
                    ${isItemActive(item)
                                            ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-600 dark:text-purple-300 font-medium shadow-sm'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750'}
                `}
                                    >
                                        <div className="flex items-center">
                    <span className={`mr-3 ${isItemActive(item) ? 'text-purple-500' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.icon}
                    </span>
                                            <span>{item.name}</span>
                                        </div>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
}