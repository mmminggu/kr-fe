"use client";

import { useState } from "react";
import NoticeTab from "@/src/components/help/NoticeTab";
import FaqTab from "@/src/components/help/FaqTab";
import InquiryTab from "@/src/components/help/InquiryTab";
import { Megaphone, HelpCircle, MessageSquare } from "lucide-react";

const TABS = [
    {
        key: "notice",
        label: "공지사항",
        icon: Megaphone
    },
    {
        key: "faq",
        label: "자주 묻는 질문",
        icon: HelpCircle
    },
    {
        key: "inquiry",
        label: "1:1 문의",
        icon: MessageSquare
    },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function HelpPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("notice");

    // 1:1 문의 탭으로 이동하는 함수
    const moveToInquiryTab = () => {
        setActiveTab("inquiry");
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6 text-center">고객센터</h1>

            {/* 탭 버튼 - 네모 박스 형태 */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all
                            ${
                            activeTab === tab.key
                                ? "border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50"
                                : "border-gray-200 bg-white text-gray-500 hover:border-indigo-200 hover:bg-gradient-to-br hover:from-indigo-50/50 hover:to-purple-50/50"
                        }
                            w-36 h-28
                        `}
                    >
                        <tab.icon className={`w-6 h-6 mb-2 ${
                            activeTab === tab.key
                                ? "text-indigo-500"
                                : "text-gray-400 group-hover:text-indigo-400"
                        }`} />
                        <span className={`font-medium ${
                            activeTab === tab.key
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text"
                                : "text-gray-600"
                        }`}>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* 콘텐츠 영역 */}
            <div className="min-h-[400px] bg-white rounded-lg p-4">
                {activeTab === "notice" && <NoticeTab />}
                {activeTab === "faq" && <FaqTab moveToInquiry={moveToInquiryTab} />}
                {activeTab === "inquiry" && <InquiryTab />}
            </div>
        </div>
    );
}