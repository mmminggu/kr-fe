import InquiryDetail from "@/src/components/admin/customer-service/InquiryDetail";

export default function InquiryDetailPage({ params }: { params: { id: string } }) {
    return (
        <InquiryDetail id={parseInt(params.id)} />
    );
}