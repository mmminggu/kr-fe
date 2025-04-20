import { Button } from "@/src/components/ui/button"

export function Navigation() {
  return (
    <nav className="border-b sticky top-0 bg-white z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start overflow-x-auto scrollbar-hide py-1">
          <Button variant="ghost" className="text-base font-medium whitespace-nowrap">
            캠페인
          </Button>
          <Button variant="ghost" className="text-base font-medium whitespace-nowrap">
            내 캠페인
          </Button>
          <Button variant="ghost" className="text-base font-medium whitespace-nowrap">
            포인트
          </Button>
          <Button variant="ghost" className="text-base font-medium whitespace-nowrap">
            마이페이지
          </Button>
        </div>
      </div>
    </nav>
  )
}
