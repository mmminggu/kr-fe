import FindPage from "@/src/components/findUserInfo";
import {Header} from "@/src/components/header";
import {Footer} from "@/src/components/footer";

export default function Page() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="container mx-auto flex-grow">
                <FindPage />
            </main>
        </div>
    )
}
