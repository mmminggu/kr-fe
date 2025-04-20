"use client"

import { useState } from "react"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import { CheckCircle, MapPin, Trash } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface Address {
    id: number
    name: string
    address: string
    isDefault: boolean
}

export default function AddressPage() {
    const [addresses, setAddresses] = useState<Address[]>([
        { id: 1, name: "집", address: "서울시 강남구 역삼동 123-45", isDefault: true },
        { id: 2, name: "회사", address: "서울시 중구 명동 10길 5", isDefault: false },
    ])
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")

    const handleAdd = () => {
        if (!name || !address) return
        const newAddress: Address = {
            id: Date.now(),
            name,
            address,
            isDefault: addresses.length === 0, // 첫 항목은 기본 설정
        }
        setAddresses((prev) => [...prev, newAddress])
        setName("")
        setAddress("")
    }

    const handleDelete = (id: number) => {
        setAddresses((prev) => {
            const filtered = prev.filter((addr) => addr.id !== id)
            // 기본 배송지 삭제 시, 남아있는 첫 항목을 기본으로
            if (!filtered.some((addr) => addr.isDefault) && filtered.length > 0) {
                filtered[0].isDefault = true
            }
            return filtered
        })
    }

    const handleSetDefault = (id: number) => {
        setAddresses((prev) =>
            prev.map((addr) => ({
                ...addr,
                isDefault: addr.id === id,
            }))
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            <h2 className="text-2xl font-bold text-gray-900">배송지 관리</h2>

            {/* 주소 추가 폼 */}
            <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
                <h3 className="text-lg font-semibold">배송지 추가</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Label className="w-24 text-gray-700">주소명</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 집, 회사" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Label className="w-24 text-gray-700">주소</Label>
                        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="주소 입력" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleAdd}>추가</Button>
                </div>
            </div>

            {/* 주소 리스트 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className={cn(
                            "border rounded-lg p-4 bg-white shadow-sm space-y-2 relative",
                            addr.isDefault ? "border-indigo-500" : "border-gray-200"
                        )}
                    >
                        {addr.isDefault && (
                            <Badge variant="default" className="absolute top-2 right-2 flex items-center gap-1">
                                <CheckCircle size={14} /> 기본 배송지
                            </Badge>
                        )}

                        <p className="font-semibold">{addr.name}</p>
                        <p className="text-sm text-gray-700">{addr.address}</p>

                        <div className="flex justify-end gap-2 pt-2 text-sm">
                            {!addr.isDefault && (
                                <Button size="sm" variant="outline" onClick={() => handleSetDefault(addr.id)}>
                                    기본 설정
                                </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(addr.id)}>
                                <Trash size={14} className="mr-1" />
                                삭제
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
