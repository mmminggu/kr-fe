// app/help/page.tsx
"use client";

import { useState } from "react";
import NoticeTab from "@/src/components/help/NoticeTab";
import FaqTab from "@/src/components/help/FaqTab";
import InquiryTab from "@/src/components/help/InquiryTab";

const TABS = [
    { key: "notice", label: "공지사항" },
    { key: "faq", label: "자주 묻는 질문" },
    { key: "inquiry", label: "1:1 문의" },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function HelpPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("notice");

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* 탭 버튼 */}
            <div className="flex flex-wrap justify-start gap-2 border-b mb-4">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                            activeTab === tab.key
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-indigo-600"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 콘텐츠 영역 */}
            <div className="min-h-[400px]">
                {activeTab === "notice" && <NoticeTab />}
                {activeTab === "faq" && <FaqTab />}
                {activeTab === "inquiry" && <InquiryTab />}
            </div>
        </div>
    );
}
