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
    LogOut
} from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    submenu?: { name: string; href: string }[];
}

export default function ClientSidebar() {
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
    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    // 내비게이션 아이템 정의
    // 내비게이션 아이템 정의
    const navItems: NavItem[] = [
        {
            name: '대시보드',
            href: '/client',
            icon: <LayoutDashboard size={20} />,
        },
        {
            name: '캠페인 관리',
            href: '/client/campaigns',  // .tsx 확장자 제거
            icon: <ShoppingBag size={20} />,
            submenu: [
                { name: '캠페인 목록', href: '/client/campaigns' },  // .tsx 확장자 제거
                { name: '캠페인 등록', href: '/client/campaigns/create' },  // 경로 수정
            ],
        },
        {
            name: '리뷰 관리',
            href: '/client/reviews',
            icon: <FileText size={20} />,
        },
        {
            name: '정산 관리',
            href: '/client/settlements',
            icon: <DollarSign size={20} />,
        },
        {
            name: '메시지',
            href: '/client/messages',
            icon: <MessageSquare size={20} />,
        },
        {
            name: '설정',
            href: '/client/settings',
            icon: <Settings size={20} />,
        },
        {
            name: '고객센터',
            href: '/client/support',
            icon: <HelpCircle size={20} />,
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
          fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-white  shadow-lg transform 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          transition-transform duration-300 ease-in-out
          flex flex-col overflow-y-auto
        `}
            >
                {/* 로고 영역 */}
                <div className="px-6 py-4 border-b border-gray-200 ">
                    <Link
                        href="/client"
                        className="flex items-center justify-center md:justify-start"
                    >
                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center mr-2">
                            <span className="text-white font-bold">R</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 ">리뷰어 체험단</h1>
                    </Link>
                </div>

                {/* 내비게이션 메뉴 */}
                <nav className="flex-1 overflow-y-auto px-4 py-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                {item.submenu ? (
                                    <div>
                                        <button
                                            className={`
                        flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm
                        ${isActive(item.href)
                                                ? 'bg-blue-50  text-blue-700  font-medium'
                                                : 'text-gray-700  hover:bg-gray-100 '
                                            }
                      `}
                                            onClick={() => toggleSubmenu(item.name)}
                                        >
                                            <div className="flex items-center">
                                                <span className="mr-3">{item.icon}</span>
                                                <span>{item.name}</span>
                                            </div>
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform ${expandedItems[item.name] ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {/* 서브메뉴 */}
                                        {expandedItems[item.name] && (
                                            <ul className="mt-1 pl-10 space-y-1">
                                                {item.submenu.map((subitem) => (
                                                    <li key={subitem.name}>
                                                        <Link
                                                            href={subitem.href}
                                                            className={`
                                block px-3 py-2 rounded-lg text-sm
                                ${isActive(subitem.href)
                                                                ? 'bg-blue-50  text-blue-700  font-medium'
                                                                : 'text-gray-700  hover:bg-gray-100 '
                                                            }
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
                      flex items-center px-3 py-2 rounded-lg text-sm
                      ${isActive(item.href)
                                            ? 'bg-blue-50  text-blue-700  font-medium'
                                            : 'text-gray-700  hover:bg-gray-100 '
                                        }
                    `}
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* 사이드바 하단 영역 */}
                <div className="px-4 py-4 border-t border-gray-200 ">
                    <button
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100  rounded-lg"
                    >
                        <LogOut size={20} className="mr-3" />
                        <span>로그아웃</span>
                    </button>
                </div>
            </aside>
        </>
    );
}