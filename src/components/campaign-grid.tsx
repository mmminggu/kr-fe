import { useState } from "react"
import { CampaignCard } from "@/src/components/campaign-card"

const ITEMS_PER_PAGE = 8; // 한 페이지에 몇 개씩 보여줄지 설정

// Sample campaign data
const campaigns = [
  {
    id: 1,
    title: "신제품 커피 리뷰어 모집",
    price: 12500,
    todayParticipants: 2,
    todayTarget: 2,
    totalParticipants: 5,
    totalTarget: 10,
    rejoinDays: 14,
    status: "모집중",
    isDeadlineSoon: false,
    isAvailable: true,
    image: "/img/img1.png?height=200&width=300",
    shipType: "빈박스",
    platformLogos: [{ src: "/logos/oliveyoung.jpg", href: "https://www.oliveyoung.co.kr/", alt:"올리브영" }],
    deliveryType: ""
  },
  {
    id: 2,
    title: "프리미엄 헤드폰 체험단",
    price: 189000,
    todayParticipants: 1,
    todayTarget: 2,
    totalParticipants: 13,
    totalTarget: 50,
    rejoinDays: 5,
    status: "마감임박",
    isDeadlineSoon: true,
    isAvailable: true,
    image: "/img/img2.png?height=200&width=300",
    shipType: "실배송",
    platformLogos: [{ src: "/logos/coupang.png", href: "https://www.coupang.com", alt:"쿠팡" }],
    deliveryType: "로켓와우",
    reservation: [{check: true, time: "2025-04-25 09:00"}],
  },
  {
    id: 3,
    title: "유기농 스킨케어 제품 리뷰",
    price: 45000,
    todayParticipants: 0,
    todayTarget: 3,
    totalParticipants: 20,
    totalTarget: 50,
    rejoinDays: 7,
    status: "모집중",
    isDeadlineSoon: false,
    isAvailable: false,
    image: "/placeholder.svg?height=200&width=300",
    shipType: "빈박스",
    platformLogos: [{ src: "/logos/coupang.png", href: "https://www.coupang.com", alt:"쿠팡" }],
    deliveryType: "판매자배송",
    reservation: [{check: true, time: "2025-04-25 09:00"}],
  },
  {
    id: 4,
    title: "신상 운동화 착화 리뷰",
    price: 79000,
    todayParticipants: 0,
    todayTarget: 0,
    totalParticipants: 35,
    totalTarget: 80,
    rejoinDays: 21,
    status: "마감",
    isDeadlineSoon: false,
    isAvailable: false,
    image: "/placeholder.svg?height=200&width=300",
    shipType: "빈박스",
    platformLogos: [{ src: "/logos/naver.png", href: "https://www.naver.com", alt:"네이버" }],
    deliveryType: "",
    reservation: [{check: false, time: ""}],
  },
  {
    id: 5,
    title: "프리미엄 홈케어 제품 체험",
    price: 34500,
    todayParticipants: 2,
    todayTarget: 2,
    totalParticipants: 80,
    totalTarget: 150,
    rejoinDays: 14,
    status: "모집중",
    isDeadlineSoon: false,
    isAvailable: true,
    image: "/placeholder.svg?height=200&width=300",
    shipType: "실배송",
    platformLogos: [{ src: "/logos/oliveyoung.jpg", href: "https://www.oliveyoung.co.kr/", alt:"올리브영" }],
    deliveryType: "",
    reservation: [{check: false, time: ""}],
  },
  {
    id: 6,
    title: "건강식품 체험단 모집",
    price: 28000,
    todayParticipants: 2,
    todayTarget: 2,
    totalParticipants: 10,
    totalTarget: 120,
    rejoinDays: 10,
    status: "모집중",
    isDeadlineSoon: true,
    isAvailable: false,
    image: "/placeholder.svg?height=200&width=300",
    shipType: "실배송",
    platformLogos: [{ src: "/logos/naver.png", href: "https://www.naver.com", alt:"네이버" }],
    deliveryType: "",
    reservation: [{check: false, time: ""}],
  },
  {
    id: 7,
    title: "스마트워치 사용자 리뷰 모집",
    price: 159000,
    todayParticipants: 1,
    todayTarget: 3,
    totalParticipants: 15,
    totalTarget: 30,
    rejoinDays: 60,
    status: "모집중",
    isDeadlineSoon: false,
    isAvailable: true,
    image: "/placeholder.svg?height=200&width=300",
    shipType: "실배송",
    platformLogos: [{ src: "/logos/naver.png", href: "https://www.naver.com", alt:"네이버" }],
    deliveryType: "",
    reservation: [{check: true, time: "2025-04-25 09:00"}],
  },
  {
    id: 8,
    title: "친환경 주방용품 체험단",
    price: 45000,
    todayParticipants: 2,
    todayTarget: 2,
    totalParticipants: 100,
    totalTarget: 100,
    rejoinDays: 14,
    status: "마감임박",
    isDeadlineSoon: true,
    isAvailable: true,
    image: "/placeholder.svg?height=200&width=300",
    shipType: "빈박스",
    platformLogos: [{ src: "/logos/coupang.png", href: "https://www.coupang.com", alt:"쿠팡" }],
    deliveryType: "",
    reservation: [{check: true, time: "2025-04-25 09:00"}],
  },
  {
    id: 9,
    title: "체험단9",
    price: 45000,
    todayParticipants: 2,
    todayTarget: 2,
    totalParticipants: 100,
    totalTarget: 100,
    rejoinDays: 14,
    status: "마감임박",
    isDeadlineSoon: true,
    isAvailable: true,
    image: "/placeholder.svg?height=200&width=300",
    shipType: "빈박스",
    platformLogos: [{ src: "/logos/coupang.png", href: "https://www.coupang.com", alt:"쿠팡" }],
    deliveryType: "판매자배송",
    reservation: [{check: true, time: "2025-04-25 09:00"}],
  },{
    id: 10,
    title: "체험단10",
    price: 45000,
    todayParticipants: 2,
    todayTarget: 2,
    totalParticipants: 100,
    totalTarget: 100,
    rejoinDays: 14,
    status: "마감임박",
    isDeadlineSoon: true,
    isAvailable: true,
    image: "/placeholder.svg?height=200&width=300",
    shipType: "빈박스",
    platformLogos: [{ src: "/logos/coupang.png", href: "https://www.coupang.com", alt:"쿠팡" }],
    deliveryType: "로켓와우",
    reservation: [{check: true, time: "2025-04-25 09:00"}],
  },{
    id: 11,
    title: "체험단11",
    price: 45000,
    todayParticipants: 2,
    todayTarget: 2,
    totalParticipants: 100,
    totalTarget: 100,
    rejoinDays: 14,
    status: "마감임박",
    isDeadlineSoon: true,
    isAvailable: true,
    image: "/placeholder.svg?height=200&width=300",
    shipType: "실배송",
    platformLogos: [{ src: "/logos/coupang.png", href: "https://www.coupang.com", alt:"쿠팡" }],
    deliveryType: "",
    reservation: [{check: true, time: "2025-04-25 09:00"}],
  },{
    id: 12,
    title: "체험단12",
    price: 45000,
    todayParticipants: 2,
    todayTarget: 2,
    totalParticipants: 100,
    totalTarget: 100,
    rejoinDays: 14,
    status: "마감임박",
    isDeadlineSoon: true,
    isAvailable: true,
    image: "/placeholder.svg?height=200&width=300",
    shipType: "빈박스",
    platformLogos: [{ src: "/logos/coupang.png", href: "https://www.coupang.com", alt:"쿠팡" }],
    deliveryType: "로켓와우",
    reservation: [{check: true, time: "2025-04-25 09:00"}],
  },
]


interface CampaignGridProps {
  searchQuery: string
  showDeadlineSoon: boolean
  showAvailable: boolean
}

export function CampaignGrid({ searchQuery, showDeadlineSoon, showAvailable }: CampaignGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDeadline = showDeadlineSoon ? campaign.isDeadlineSoon : true
    const matchesAvailability = showAvailable ? campaign.isAvailable : true
    return matchesSearch && matchesDeadline && matchesAvailability
  });

  const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCampaigns = filteredCampaigns.slice(startIndex, endIndex);

  return (
      <>
        {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
        ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentCampaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 border rounded-md ${
                            page === currentPage
                                ? "bg-indigo-600 text-white font-bold"
                                : "bg-white text-gray-700"
                        }`}
                    >
                      {page}
                    </button>
                ))}
              </div>
            </>
        )}
      </>
  )
}
