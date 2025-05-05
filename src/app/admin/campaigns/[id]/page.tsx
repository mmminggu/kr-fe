import CampaignDetail from "@/src/components/admin/campaigns/CampaignDetail";

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
    return (
        <CampaignDetail id={parseInt(params.id)} />
    );
}