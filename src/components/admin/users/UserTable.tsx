// src/components/admin/users/UserTable.tsx
'use client';

import React, { useState } from 'react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
    Eye,
    EyeOff,
    AlertCircle,
    Calendar,
    ChevronDown,
    Plus,
    Search
} from 'lucide-react';
import { Pagination } from '@/src/components/ui/pagination';
import Link from 'next/link';

// 사용자 상태별 배지 스타일
const statusStyles = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
};

// 회원 유형별 배지 스타일
const roleStyles = {
    admin: 'bg-purple-100 text-purple-800',
    client: 'bg-blue-100 text-blue-800',
    reviewer: 'bg-pink-100 text-pink-800',
};

// 임시 데이터
const mockUsers = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    name: `사용자 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    gender: i % 2 === 0 ? '남성' : '여성', // 성별 추가
    role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'client' : 'reviewer',
    status: i % 4 === 0 ? 'active' : i % 4 === 1 ? 'inactive' : i % 4 === 2 ? 'suspended' : 'pending',
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    suspendedDate: i % 4 === 2 ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0] : null, // 이용정지일
    isActive: i % 2 === 0, // 활성화 상태 추가
}));

export default function UserTable({ filterOptions }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]); // 선택된 사용자 ID
    const itemsPerPage = 10;

    // 필터링 로직
    const filteredUsers = mockUsers.filter(user => {
        if (filterOptions.status !== 'all' && user.status !== filterOptions.status) return false;
        if (filterOptions.role !== 'all' && user.role !== filterOptions.role) return false;
        if (filterOptions.search && !user.name.includes(filterOptions.search) && !user.email.includes(filterOptions.search)) return false;
        return true;
    });

    // 페이지네이션 로직
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // 활성화 토글 함수
    const toggleActive = (id: number) => {
        const updatedMockUsers = mockUsers.map(user =>
            user.id === id ? { ...user, isActive: !user.isActive } : user
        );
        // 실제 구현에서는 API 호출로 업데이트
        console.log('사용자 활성화 상태 변경:', id);
    };

    // 체크박스 전체 선택/해제
    const handleSelectAll = () => {
        if (selectedUsers.length === currentUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(currentUsers.map(user => user.id));
        }
    };

    // 개별 체크박스 토글
    const handleSelectUser = (id: number) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    // 엑셀 다운로드 함수
    const handleExcelDownload = () => {
        alert('회원 목록 엑셀 다운로드');
        // 실제 구현 시 API 호출 필요
    };

    // 날짜 포맷 함수
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    return (
        <div className="space-y-6">

            {/* 회원 목록 테이블 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* 테이블 헤더 */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-3">
                                <input
                                    type="checkbox"
                                    checked={
                                        currentUsers.length > 0 &&
                                        selectedUsers.length === currentUsers.length
                                    }
                                    onChange={handleSelectAll}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th className="px-6 py-3">이름</th>
                            <th className="px-6 py-3">이메일</th>
                            <th className="px-6 py-3">성별</th>
                            <th className="px-6 py-3">유형</th>
                            <th className="px-6 py-3">상태</th>
                            <th className="px-6 py-3">가입일</th>
                            <th className="px-6 py-3">이용정지일</th>
                            <th className="px-6 py-3">활성화</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleSelectUser(user.id)}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.gender}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className={roleStyles[user.role]}>
                                            {user.role === 'admin' ? '관리자' : user.role === 'client' ? '업체' : '리뷰어'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className={statusStyles[user.status]}>
                                            {user.status === 'active' ? '활성' :
                                                user.status === 'inactive' ? '비활성' :
                                                    user.status === 'suspended' ? '정지' : '대기중'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Calendar size={14} className="mr-1 text-gray-500" />
                                                <span>{formatDate(user.joinDate)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            {user.status === 'suspended' && user.suspendedDate ? (
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Calendar size={14} className="mr-1 text-gray-500" />
                                                    <span>{formatDate(user.suspendedDate)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleActive(user.id)}
                                            className={`p-1 rounded-full ${user.isActive
                                                ? 'text-green-500 hover:bg-green-50'
                                                : 'text-gray-400 hover:bg-gray-50'}`}
                                        >
                                            {user.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <AlertCircle size={32} className="text-gray-400 mb-4" />
                                        <p className="text-gray-500 text-lg font-medium">
                                            회원이 없습니다
                                        </p>
                                        <p className="text-gray-500 mt-1">
                                            {filterOptions.search
                                                ? '검색 조건에 맞는 회원이 없습니다. 다른 검색어를 입력해보세요.'
                                                : filterOptions.status !== 'all' || filterOptions.role !== 'all'
                                                    ? '해당 조건의 회원이 없습니다. 다른 필터를 선택해보세요.'
                                                    : '신규 회원을 등록해보세요.'}
                                        </p>
                                        {(!filterOptions.search && filterOptions.status === 'all' && filterOptions.role === 'all') && (
                                            <Link
                                                href="/admin/users/create"
                                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <Plus size={16} className="mr-2" />
                                                신규 회원 등록
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                {filteredUsers.length > 0 && (
                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">{indexOfFirstItem + 1}</span>
                                    -
                                    <span className="font-medium">
                                        {Math.min(indexOfLastItem, filteredUsers.length)}
                                    </span>
                                    {' / '}
                                    <span className="font-medium">{filteredUsers.length}</span> 명
                                </p>
                            </div>
                            <nav className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-2 py-1 text-sm rounded-md ${
                                        currentPage === 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;

                                    // 현재 페이지 주변의 페이지만 표시
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentPage(pageNumber)}
                                                className={`px-3 py-1 text-sm rounded-md ${
                                                    currentPage === pageNumber
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    }

                                    // 중간 생략 부분 표시
                                    if (
                                        (pageNumber === currentPage - 2 && currentPage > 3) ||
                                        (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                                    ) {
                                        return (
                                            <span
                                                key={index}
                                                className="px-2 py-1 text-sm text-gray-500"
                                            >
                                                ...
                                            </span>
                                        );
                                    }

                                    return null;
                                })}
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`px-2 py-1 text-sm rounded-md ${
                                        currentPage === totalPages
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}