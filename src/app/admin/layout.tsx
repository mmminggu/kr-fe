import AdminLayout from "@/src/components/admin/layout/AdminLayout";

export const metadata = {
    title: '리뷰어 체험단 - 관리자',
    description: '리뷰어 체험단 관리자 페이지',
};

export default function AdminRootLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
}