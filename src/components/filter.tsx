"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function Filter() {
  const [category, setCategory] = useState<string>("전체")
  const [deadline, setDeadline] = useState<boolean>(false)
  const [available, setAvailable] = useState<boolean>(false)

  const categories = ["전체", "식품", "화장품", "가전제품", "의류", "기타"]

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            카테고리: {category}
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {categories.map((cat) => (
            <DropdownMenuItem key={cat} onClick={() => setCategory(cat)}>
              {cat}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant={deadline ? "default" : "outline"} onClick={() => setDeadline(!deadline)}>
        마감 임박
      </Button>

      <Button variant={available ? "default" : "outline"} onClick={() => setAvailable(!available)}>
        참여 가능
      </Button>
    </div>
  )
}
