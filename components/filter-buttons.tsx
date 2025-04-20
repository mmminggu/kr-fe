"use client"

import { Button } from "@/components/ui/button"
import { Clock, CheckCircle } from "lucide-react"

interface FilterButtonsProps {
  showDeadlineSoon: boolean
  setShowDeadlineSoon: (value: boolean) => void
  showAvailable: boolean
  setShowAvailable: (value: boolean) => void
}

export function FilterButtons({
  showDeadlineSoon,
  setShowDeadlineSoon,
  showAvailable,
  setShowAvailable,
}: FilterButtonsProps) {
  return (
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
        variant={showAvailable ? "default" : "outline"}
        onClick={() => setShowAvailable(!showAvailable)}
        className="flex items-center gap-2"
      >
        <CheckCircle size={16} />
        참여 가능
      </Button>
    </div>
  )
}
