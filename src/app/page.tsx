"use client"

import { useState } from "react"
import { Header } from "@/src/components/header"
import { CampaignGrid } from "@/src/components/campaign-grid"
import { SearchAndFilters } from "@/src/components/search-and-filters"
import { Footer } from "@/src/components/footer"

export default function CampaignPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showDeadlineSoon, setShowDeadlineSoon] = useState(false)
  const [showAvailable, setShowAvailable] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">캠페인 목록</h2>

        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showDeadlineSoon={showDeadlineSoon}
          setShowDeadlineSoon={setShowDeadlineSoon}
          showAvailable={showAvailable}
          setShowAvailable={setShowAvailable}
        />

        <CampaignGrid searchQuery={searchQuery} showDeadlineSoon={showDeadlineSoon} showAvailable={showAvailable} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
