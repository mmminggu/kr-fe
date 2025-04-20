// components/support/InquiryTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { ChevronDown } from "lucide-react";

const tabs = [
    { key: "write", label: "문의 접수" },
    { key: "history", label: "문의 내역" },
    { key: "response", label: "답변 확인" },
] as const;

type TabKey = typeof tabs[number]["key"];

export default function InquiryTab() {
    const [activeTab, setActiveTab] = useState<TabKey>("write");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleTabClick = (key: TabKey) => {
        setActiveTab(key);
        setDropdownOpen(false);
    };

    return (
        <div className="space-y-4">
            {/* 탭 버튼 - Desktop */}
            <div className="hidden sm:flex gap-3 border-b pb-2">
                {tabs.map(({ key, label }) => (
                    <Button
                        key={key}
                        variant={activeTab === key ? "default" : "ghost"}
                        onClick={() => handleTabClick(key)}
                        className="text-sm"
                    >
                        {label}
                    </Button>
                ))}
            </div>

            {/* 탭 버튼 - Mobile Dropdown */}
            <div className="sm:hidden relative">
                <Button
                    variant="outline"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full justify-between"
                >
                    {tabs.find((t) => t.key === activeTab)?.label}
                    <ChevronDown className="w-4 h-4" />
                </Button>
                {dropdownOpen && (
                    <div className="absolute z-10 bg-white shadow-md border rounded w-full mt-1">
                        {tabs.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => handleTabClick(key)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                    activeTab === key ? "bg-gray-100 font-medium" : ""
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 콘텐츠 영역 */}
            <div className="mt-4">
                {activeTab === "write" && <div>📩 문의 접수 화면</div>}
                {activeTab === "history" && <div>📜 문의 내역 리스트</div>}
                {activeTab === "response" && <div>✅ 답변 확인 화면</div>}
            </div>
        </div>
    );
}
