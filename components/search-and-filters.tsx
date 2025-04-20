"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, Clock, CheckCircle, CalendarCheck } from "lucide-react"

interface SearchAndFiltersProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  showDeadlineSoon: boolean
  setShowDeadlineSoon: (value: boolean) => void
  showAvailable: boolean
  setShowAvailable: (value: boolean) => void
}

export function SearchAndFilters({
  searchQuery,
  setSearchQuery,
  showDeadlineSoon,
  setShowDeadlineSoon,
  showAvailable,
  setShowAvailable,
}: SearchAndFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="캠페인 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant={showDeadlineSoon ? "default" : "outline"}
          onClick={() => setShowDeadlineSoon(!showDeadlineSoon)}
          className="flex items-center gap-2"
        >
          <Clock size={16} />
          마감임박
        </Button>

        <Button
            variant={showDeadlineSoon ? "default" : "outline"}
            onClick={() => setShowDeadlineSoon(!showDeadlineSoon)}
            className="flex items-center gap-2"
        >
          <CalendarCheck size={16} />
          예약가능
        </Button>

        <Button
          variant={showAvailable ? "default" : "outline"}
          onClick={() => setShowAvailable(!showAvailable)}
          className="flex items-center gap-2"
        >
          <CheckCircle size={16} />
          참여 가능
        </Button>
      </div>
    </div>
  )
}
