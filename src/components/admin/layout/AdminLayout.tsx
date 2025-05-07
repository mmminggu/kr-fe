import { ReactNode } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './Sidebar';
import AdminFooter from './AdminFooter';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* 사이드바 */}
            <AdminSidebar />

            {/* 메인 콘텐츠 - 사이드바 너비만큼 왼쪽 마진 추가 */}
            <div className="flex flex-col flex-1 w-full">
                {/* 페이지 콘텐츠 */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                <AdminFooter />
            </div>
        </div>
    );
}