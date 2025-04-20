"use client";

import { useState } from "react";
import { X, Bell, Eye, EyeOff, Filter } from "lucide-react";
import clsx from "clsx";

interface Notification {
    id: number;
    title: string;
    description: string;
    date: string;
    read: boolean;
}

interface NotificationPanelProps {
    notifications: Notification[];
    onClose: () => void;
}

export default function NotificationPanel({ notifications, onClose }: NotificationPanelProps) {
    const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
    const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);

    const toggleRead = (id: number) => {
        setLocalNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
        );
    };

    const filtered = localNotifications.filter((n) => {
        if (filter === "read") return n.read;
        if (filter === "unread") return !n.read;
        return true;
    });

    return (
        <div className="fixed inset-0 z-50 bg-black/20 flex justify-end">
            {/* 알림 패널 */}
            <div className="w-full sm:w-[400px] h-full bg-white border-l border-gray-200 shadow-xl flex flex-col">

                {/* 상단 헤더 */}
                <div className="flex justify-between items-center py-2 px-4 border-b border-gray-300 bg-gray-100">
                    <div>
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-gray-700" />
                            <h3 className="text-base font-semibold text-gray-800">알림</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">최근 1개월 내 알림만 조회됩니다.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                setFilter((f) =>
                                    f === "all" ? "unread" : f === "unread" ? "read" : "all"
                                )
                            }
                            className="text-gray-500 hover:text-gray-800 transition"
                            title="필터 변경"
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="닫기">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>


                {/* 본문 (스크롤 영역) */}
                <div className="flex-1 overflow-y-auto divide-y">
                    {filtered.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">표시할 알림이 없습니다.</div>
                    ) : (
                        filtered.map((n) => (
                            <div
                                key={n.id}
                                className={clsx(
                                    "p-4 flex justify-between items-start group transition hover:cursor-pointer",
                                    !n.read && "bg-blue-50"
                                )}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-sm text-gray-800">{n.title}</h4>
                                        {!n.read && (
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1  hover:underline hover:decoration-gray-400">{n.description}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{n.date}</p>
                                </div>
                                <button
                                    onClick={() => toggleRead(n.id)}
                                    className="text-gray-400 hover:text-gray-600 ml-2"
                                    title={n.read ? "읽지 않음으로 표시" : "읽음으로 표시"}
                                >
                                    {n.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        ))
                    )}
                    {/* ✅ 하단 구분선 추가 */}
                    <div className="border-t border-gray-200" />
                </div>
            </div>
        </div>
    );
}
