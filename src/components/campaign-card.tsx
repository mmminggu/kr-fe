import Image from "next/image"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent } from "@/src/components/ui/card"
import { Progress } from "@/src/components/ui/progress"
import { Truck } from "lucide-react"

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
  platformLogos?: { src: string; href: string }[]
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
                className="text-white drop-shadow-sm"
            >
              {campaign.status}
            </Badge>
          </div>
        </div>
        <div className="px-4 pt-3 flex justify-between items-center">
          {/* 좌측 뱃지 */}
          <div className="flex gap-2">
            <Badge className="bg-blue-100 text-blue-700 px-2 py-0.5 text-xs rounded-sm">
              예약가능
            </Badge>
            <Badge className="bg-green-100 text-green-700 px-2 py-0.5 text-xs rounded-sm">
              참여가능
            </Badge>
          </div>

          {/* 우측 로고 */}
          <div className="flex gap-2">
            {campaign.platformLogos?.slice(0, 2).map((logo, index) => (
                <a
                    key={index}
                    href={logo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                >
                  <Image
                      src={logo.src}
                      alt="구매처"
                      width={24}
                      height={24}
                      className="rounded bg-white border object-contain"
                  />
                </a>
            ))}
          </div>
        </div>

        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold line-clamp-2 mb-3">{campaign.title}</h3>
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
  )
}
