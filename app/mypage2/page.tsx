
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserInfoSection } from "./user-info-section"
import { StoreAccountsSection } from "./store-accounts-section"
import { ShippingAddressesSection } from "./shipping-addresses-section"
import { User, Store, Truck } from "lucide-react"
import {Header} from "@/components/header";
import {Footer} from "@/components/footer";

export default function Page() {
  return (
      <div className="min-h-screen flex flex-col bg-white">
      <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      <Tabs defaultValue="user-info" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="user-info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">내정보 수정</span>
            <span className="sm:hidden">내정보</span>
          </TabsTrigger>
          <TabsTrigger value="store-accounts" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">스토어 계정관리</span>
            <span className="sm:hidden">계정관리</span>
          </TabsTrigger>
          <TabsTrigger value="shipping-addresses" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">배송지관리</span>
            <span className="sm:hidden">배송지</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user-info">
          <UserInfoSection />
        </TabsContent>

        <TabsContent value="store-accounts">
          <StoreAccountsSection />
        </TabsContent>

        <TabsContent value="shipping-addresses">
          <ShippingAddressesSection />
        </TabsContent>
      </Tabs>
          </div>
        </main>
        <Footer />
      </div>
  )
}
