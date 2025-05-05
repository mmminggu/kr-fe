import ClientLayout from '@/src/components/client/layout/ClientLayout';

export const metadata = {
    title: '리뷰어 체험단 | 업체 페이지',
    description: '리뷰어 체험단 업체 관리 페이지입니다.',
};

export default function ClientRootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    return <ClientLayout>{children}</ClientLayout>;
}