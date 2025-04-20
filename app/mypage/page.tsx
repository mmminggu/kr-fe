import MyPagePage from "@/components/mypage";
import {Header} from "@/components/header";
import {Footer} from "@/components/footer";

export default function Page() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">
                <MyPagePage />
            </main>
            <Footer />
        </div>
    )
}
