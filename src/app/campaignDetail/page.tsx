import CampaignDetailPage from "@/src/components/campaign-detail";
import {Header} from "@/src/components/header";
import {Footer} from "@/src/components/footer";

export default function Page() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">
                <CampaignDetailPage />
            </main>
            <Footer />
        </div>
    )
}
