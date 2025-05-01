import Image from "next/image"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent } from "@/src/components/ui/card"
import { Progress } from "@/src/components/ui/progress"
import { Truck } from "lucide-react"
import Link from "next/link";

interface Campaign {
  id: number
  title: string
  price: number
  todayParticipants: number
  todayTarget: number
  totalParticipants: number
  totalTarget: number
  rejoinDays: number
  status: string
  isDeadlineSoon: boolean
  isAvailable: boolean
  image: string
  shipType: string
  platformLogos?: { src: string; href: string; alt: string }[]
  deliveryType: string
  reservation?: { check: boolean; time: string}[]
}

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const formatPrice = (price: number) => {
    return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "모집중":
        return "default"
      case "마감임박":
        return "destructive"
      case "마감":
        return "outline"
      default:
        return "default"
    }
  }

  const todayRate =
      campaign.todayTarget > 0
          ? Math.min((campaign.todayParticipants / campaign.todayTarget) * 100, 100)
          : 0
  const totalRate =
      campaign.totalTarget > 0
          ? Math.min((campaign.totalParticipants / campaign.totalTarget) * 100, 100)
          : 0

  return (
      <Link
          key={campaign.id}
          href="/campaignDetail" // 현재는 임시 고정 경로
      >
        <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
          <div className="relative h-48 w-full">
            {/* 캠페인 이미지 */}
            <Image
                src={campaign.image || "/placeholder.svg"}
                alt={campaign.title}
                fill
                className="object-cover"
            />

            {/* 로고 (좌측 상단) */}
            {/*<div className="absolute top-2 left-3 z-20 flex gap-2">
              {campaign.platformLogos?.slice(0, 2).map((logo, index) => (
                  <a
                      key={index}
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                    <Image
                        src={logo.src}
                        alt="구매처"
                        width={30}
                        height={30}
                        className="object-contain rounded-full bg-white shadow"
                    />
                  </a>
              ))}
            </div>*/}

            {/* 상태 뱃지 (우측 상단) */}
            <div className="absolute top-2 right-3 z-20">
              <Badge
                  variant={getBadgeVariant(campaign.status)}
                  className="text-white drop-shadow-sm "
              >
                {campaign.status}
              </Badge>
            </div>
          </div>
          <div className="px-4 pt-2 flex justify-between items-center">
            {/* 좌측 뱃지 */}
            <div className="flex gap-2">
              {campaign.reservation?.[0]?.check && (
                <Badge className="bg-blue-100 text-blue-700 px-2 py-0.5 text-xs rounded-sm cursor-default">
                  예약가능
                </Badge>
              )}
              <Badge className="bg-green-100 text-green-700 px-2 py-0.5 text-xs rounded-sm cursor-default">
                참여가능
              </Badge>
            </div>


            {/* 우측 로고 */}
            <div className="flex gap-2 items-end">
              {campaign.platformLogos?.slice(0, 2).map((logo, index) => {
                const isCoupang = logo.alt === "쿠팡";
                const isRocketWow = campaign.deliveryType === "로켓와우";
                const isRocketSeller = campaign.deliveryType === "판매자배송";
                const isCommon = campaign.deliveryType === "";

                return (
                    <div key={index} className="flex flex-col items-center">
                      <a
                          href={logo.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                      >
                        <img
                            src={logo.src}
                            alt={logo.alt}
                            width={23}
                            height={23}
                            className="rounded-full bg-white object-contain"
                        />
                      </a>

                      {/* 쿠팡일 경우 배송 형태 아래 표시 */}
                      {isCoupang ? (
                          <>
                            {isRocketWow && (
                                <img
                                    src="/logos/coupang_rocket_wow.png"
                                    alt="로켓와우 배송"
                                    width={48}
                                    height={14}
                                    className="mt-1 object-contain"
                                />
                            )}
                            {isRocketSeller && (
                                <img
                                    src="/logos/coupang_seller_rocket.png"
                                    alt="판매자 로켓배송"
                                    width={50}
                                    height={18}
                                    className="mt-1 object-contain"
                                />
                            )}
                            {isCommon && (
                                <img
                                    src="/logos/coupang_common.png"
                                    alt="일반배송"
                                    width={40}
                                    height={12}
                                    className="mt-1 object-contain"
                                />
                            )}
                          </>
                      ) : (
                          // 쿠팡이 아닌 경우도 정렬 유지를 위한 placeholder
                          <div style={{ height: 12 }} />
                      )}
                    </div>
                );
              })}
            </div>

          </div>


          <CardContent className="px-4 flex-grow flex flex-col">
            {campaign.reservation?.[0]?.check ? (
                <p className="text-xs font-semibold line-clamp-2 text-gray-500">
                  09:00에 참여시작
                </p>
            ) : (
                <p className="text-xs font-semibold invisible"> </p> // ← 여백만 확보
            )}
            <h3 className="text-lg font-semibold line-clamp-2 mb-1">{campaign.title}</h3>
            <div className="space-y-2 text-sm mt-auto text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">제품 가격</span>
                <span className="text-red-500 font-semibold">{formatPrice(campaign.price)}</span>
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-gray-500">오늘 모집</span>
                  <span className="font-medium">
                    <span className="text-gray-600 font-semibold">{campaign.todayParticipants}</span>
                    <span className="text-gray-500">명</span>
                    {" / "}
                    <span className="text-gray-600 font-semibold">{campaign.todayTarget}</span>
                    <span className="text-gray-500">명</span>
                  </span>
                </div>
                  {/*<Progress value={todayRate} className="h-2 mt-1 bg-gray-200" />*/}
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-gray-500">전체 모집</span>
                  <span className="font-medium">
                    <span className="text-gray-600 font-semibold">{campaign.totalParticipants}</span>
                    <span className="text-gray-500">명</span>
                    {" / "}
                    <span className="text-gray-600 font-semibold">{campaign.totalTarget}</span>
                    <span className="text-gray-500">명</span>
                  </span>
                </div>
                  {/*<Progress value={totalRate} className="h-2 mt-1 bg-gray-200" />*/}
                </div>

              <div className="flex justify-between">
                <span className="text-gray-500">재참여 가능</span>
                <span className="font-medium">
                  <span className="font-semibold text-red-500">{campaign.rejoinDays}</span>
                  <span className="text-gray-500">일 후</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
  )
}
