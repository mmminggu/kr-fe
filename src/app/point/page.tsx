import PointPage from "@/src/components/point";
import {Header} from "@/src/components/header";
import {Footer} from "@/src/components/footer";

export default function Page() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">
                <PointPage />
            </main>
            <Footer />
        </div>
    )
}
