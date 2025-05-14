'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
    Search,
    Filter,
    Phone,
    ChevronDown,
    Calendar,
    AlertCircle,
    FileDown,
    Eye,
    EyeOff,
    User ,
    MapPin,
    ExternalLink,
    Users,
    CreditCard,
    Store
} from 'lucide-react';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/src/components/ui/select';
import Image from 'next/image';

// 사용자별 추가 계정 정보 (모의 데이터)
const additionalAccountsMap = {
    "user1@example.com": [
        {
            id: 101,
            storeName: "쿠팡",
            storeLogo: "/logos/coupang.png",
            userId: "coupang_user1",
            userName: "사용자 1",
            accountHolder: "사용자 1",
            recipient: "사용자 1",
            accountNumber: "1234567890",
            bank: "국민은행",
            contact: "010-1234-5678",
            phone: "010-1234-5678",
            receiver: "사용자 1",
            address: "서울시 강남구 테헤란로 123, 테헤란로 아파트 1단지 207동 1045호",
            wowMember: true,
            emailOrPhone: "user1_coupang@example.com",
            status: "active",
            joinDate: "2024-05-10"
        },
        {
            id: 102,
            storeName: "네이버",
            storeLogo: "/logos/naver.png",
            userId: "naver_user1",
            userName: "사용자 1",
            accountHolder: "사용자 1",
            recipient: "사용자 1",
            accountNumber: "0987654321",
            bank: "신한은행",
            contact: "010-8765-4321",
            phone: "010-8765-4321",
            receiver: "사용자 1",
            address: "서울시 강남구 역삼로 456",
            wowMember: false,
            emailOrPhone: "user1_naver@example.com",
            status: "inactive",
            joinDate: "2024-01-15"
        }
    ],
    "user3@example.com": [
        {
            id: 301,
            storeName: "올리브영",
            storeLogo: "/logos/oliveyoung.jpg",
            userId: "olive_user3",
            userName: "사용자 3",
            accountHolder: "사용자 3",
            recipient: "사용자 3",
            accountNumber: "1122334455",
            bank: "우리은행",
            contact: "010-2233-4455",
            phone: "010-2233-4455",
            receiver: "사용자 3",
            address: "서울시 송파구 올림픽로 100",
            wowMember: false,
            emailOrPhone: "user3_olive@example.com",
            status: "active",
            joinDate: "2024-02-20"
        }
    ],
    "user5@example.com": [
        {
            id: 501,
            storeName: "네이버",
            storeLogo: "/logos/naver.png",
            userId: "11st_user5",
            userName: "사용자 5",
            accountHolder: "사용자 5",
            recipient: "사용자 5",
            accountNumber: "5544332211",
            bank: "하나은행",
            contact: "010-5544-3322",
            phone: "010-5544-3322",
            receiver: "사용자 5",
            address: "서울시 중구 명동길 100",
            wowMember: false,
            emailOrPhone: "user5_11st@example.com",
            status: "pending",
            joinDate: "2024-04-05"
        },
        {
            id: 502,
            storeName: "올리브영",
            storeLogo: "/logos/oliveyoung.jpg",
            userId: "gmarket_user5",
            userName: "사용자 5",
            accountHolder: "사용자 5",
            recipient: "사용자 5",
            accountNumber: "6677889900",
            bank: "기업은행",
            contact: "010-6677-8899",
            phone: "010-6677-8899",
            receiver: "사용자 5",
            address: "서울시 서초구 강남대로 200",
            wowMember: false,
            emailOrPhone: "010-5555-6666",
            status: "active",
            joinDate: "2023-11-10"
        },
        {
            id: 503,
            storeName: "쿠팡",
            storeLogo: "/logos/coupang.png",
            userId: "tmon_user5",
            userName: "사용자 5",
            accountHolder: "사용자 5",
            recipient: "사용자 5",
            accountNumber: "1357924680",
            bank: "농협은행",
            contact: "010-1357-9246",
            phone: "010-1357-9246",
            receiver: "사용자 5",
            address: "서울시 강동구 천호대로 300",
            wowMember: false,
            emailOrPhone: "user5_tmon@example.com",
            status: "suspended",
            joinDate: "2023-12-25",
            suspendedDate: "2024-03-15"
        }
    ]
};

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

// 정렬 옵션
const sortOptions = [
    { id: 'newest', name: '최신 가입순' },
    { id: 'oldest', name: '오래된 가입순' },
    { id: 'nameAsc', name: '이름 오름차순' },
    { id: 'nameDesc', name: '이름 내림차순' },
];

// 임시 데이터
const mockUsers = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: `사용자 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    gender: i % 2 === 0 ? '남성' : '여성',
    role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'client' : 'reviewer',
    status: i % 4 === 0 ? 'active' : i % 4 === 1 ? 'inactive' : i % 4 === 2 ? 'suspended' : 'pending',
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    suspendedDate: i % 4 === 2 ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0] : null,
    isActive: i % 2 === 0,
}));

export default function UserManagement() {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // 필터 및 검색 상태
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // 모달 상태
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        gender: '남성',
        role: 'reviewer',
        status: 'active',
        isActive: true
    });

    // 데이터 로딩
    useEffect(() => {
        setLoading(true);
        // API 호출 시뮬레이션
        const timer = setTimeout(() => {
            setUsers(mockUsers);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // 필터링 및 정렬 적용
    useEffect(() => {
        let result = [...users];

        // 상태 필터링
        if (statusFilter !== 'all') {
            result = result.filter(user => user.status === statusFilter);
        }

        // 역할 필터링
        if (roleFilter !== 'all') {
            result = result.filter(user => user.role === roleFilter);
        }

        // 검색어 필터링
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
        }

        // 정렬
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
                case 'oldest':
                    return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
                case 'nameAsc':
                    return a.name.localeCompare(b.name);
                case 'nameDesc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });

        setFilteredUsers(result);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋
    }, [users, statusFilter, roleFilter, searchQuery, sortBy]);

    // 현재 페이지 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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

    // 활성화 토글 함수
    const toggleActive = (id: number) => {
        setUsers(users.map(user =>
            user.id === id ? { ...user, isActive: !user.isActive } : user
        ));
        // 실제 구현에서는 API 호출로 업데이트
        console.log('사용자 활성화 상태 변경:', id);
    };

    // 회원등급 변경 함수
    const changeUserRole = (id: number, newRole: string) => {
        setUsers(users.map(user =>
            user.id === id ? { ...user, role: newRole } : user
        ));
        // 실제 구현에서는 API 호출로 업데이트
        console.log('회원등급 변경:', id, newRole);
    };

    // 신규 회원 모달 열기
    const openCreateModal = () => {
        setNewUser({
            name: '',
            email: '',
            gender: '남성',
            role: 'reviewer',
            status: 'active',
            isActive: true
        });
        setIsCreateModalOpen(true);
    };

    // 회원 삭제 다이얼로그 열기
    const openDeleteDialog = (user) => {
        setCurrentUser(user);
        setIsDeleteDialogOpen(true);
    };

    // 계정 목록 모달 열기
    const openAccountsModal = (userEmail) => {
        setCurrentUserEmail(userEmail);
        setIsAccountsModalOpen(true);
    };

    // 사용자에게 추가 계정이 있는지 확인
    const hasAdditionalAccounts = (email) => {
        return additionalAccountsMap[email] && additionalAccountsMap[email].length > 0;
    };

    // 추가 계정 수 확인
    const getAdditionalAccountsCount = (email) => {
        return additionalAccountsMap[email] ? additionalAccountsMap[email].length : 0;
    };


    // 엑셀 다운로드 함수
    const handleExcelDownload = () => {
        alert('회원 목록 엑셀 다운로드');
        // 실제 구현 시 API 호출 필요
    };

    // 날짜 포맷 함수
    const formatDate = (dateString) => {
        if (!dateString) return '-';

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    // 상태별 카운트
    const getStatusCounts = () => {
        const counts = {
            all: users.length,
            active: 0,
            inactive: 0,
            suspended: 0,
            pending: 0
        };

        users.forEach(user => {
            counts[user.status]++;
        });

        return counts;
    };

    const statusCounts = getStatusCounts();

    // 로딩 중 UI
    if (loading) {
        return (
            <div className="w-full py-12 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <p className="mt-4 text-gray-600">회원 목록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    회원 관리
                </h1>
            </div>

            {/* 상태 필터 탭 */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200">
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'all'
                            ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-indigo-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setStatusFilter('all')}
                >
                    전체 ({statusCounts.all})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'active'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setStatusFilter('active')}
                >
                    활성 ({statusCounts.active})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'inactive'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setStatusFilter('inactive')}
                >
                    비활성 ({statusCounts.inactive})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'suspended'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setStatusFilter('suspended')}
                >
                    정지 ({statusCounts.suspended})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        statusFilter === 'pending'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setStatusFilter('pending')}
                >
                    대기중 ({statusCounts.pending})
                </button>
            </div>

            {/* 필터 및 검색 영역 */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* 검색 입력 */}
                <div className="flex w-full md:w-auto">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-[400px] pl-10 p-2.5"
                            placeholder="이름 또는 이메일로 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* 역할 필터 */}
                <div className="relative w-full md:w-48">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Filter size={18} className="text-gray-400" />
                    </div>
                    <select
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 appearance-none"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">모든 회원 유형</option>
                        <option value="admin">관리자</option>
                        <option value="client">업체</option>
                        <option value="reviewer">리뷰어</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown size={18} className="text-gray-400" />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 md:ml-auto">
                    {/* 엑셀 다운로드 버튼 */}
                    <button
                        onClick={handleExcelDownload}
                        className="inline-flex items-center px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-teal-500"
                    >
                        <FileDown size={16} className="mr-2" />
                        엑셀 다운로드
                    </button>

                    {/* 정렬 필터 */}
                    <div className="relative w-full sm:w-40 md:w-48">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                                />
                            </svg>
                        </div>
                        <select
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 appearance-none"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            {sortOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown size={18} className="text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

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
                            <th className="px-6 py-3">추가계정</th>
                            <th className="px-6 py-3">성별</th>
                            <th className="px-6 py-3">회원 유형</th>
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
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {hasAdditionalAccounts(user.email) ? (
                                            <button
                                                onClick={() => openAccountsModal(user.email)}
                                                className="flex items-center gap-1 py-1 px-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                                                title="추가 계정 보기"
                                            >
                                                <Users size={14} />
                                                <span className="text-xs font-medium">{getAdditionalAccountsCount(user.email)}개</span>
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-xs"></span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.gender}</div>
                                    </td>
                                    {/* 두번째 대안: 더 심플한 드롭다운 스타일 */}
                                    {/* 개선된 배지 스타일 (2번 대안 개선) */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="inline-flex items-center gap-1 relative group">
                                            <Badge className={`${roleStyles[user.role]} py-1 px-2 text-xs flex items-center gap-1`}>
                                                {user.role === 'admin' ? '관리자' : user.role === 'client' ? '업체' : '리뷰어'}
                                                <ChevronDown size={12} className="text-current" />
                                            </Badge>
                                            <select
                                                value={user.role}
                                                onChange={(e) => changeUserRole(user.id, e.target.value)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                style={{ fontSize: '14px', minWidth: '100px' }}
                                            >
                                                <option value="admin">관리자</option>
                                                <option value="client">업체</option>
                                                <option value="reviewer">리뷰어</option>
                                            </select>
                                        </div>
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
                                <td colSpan={10} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <AlertCircle size={32} className="text-gray-400 mb-4" />
                                        <p className="text-gray-500 text-lg font-medium">
                                            회원이 없습니다
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                {filteredUsers.length > itemsPerPage && (
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

            {/* 추가 계정 모달 */}
            <Dialog open={isAccountsModalOpen} onOpenChange={setIsAccountsModalOpen}>
                <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
                    {/* 헤더 영역 */}
                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            추가 계정 목록
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {currentUserEmail ? `${currentUserEmail} 사용자의 추가 계정 정보입니다.` : '추가 계정 정보'}
                        </p>
                    </div>

                    {/* 콘텐츠 영역 - 추가 계정 목록 */}
                    <div className="py-2 px-6 max-h-[60vh] overflow-y-auto">
                        {currentUserEmail && additionalAccountsMap[currentUserEmail]?.length > 0 ? (
                            <div className="space-y-3">
                                {additionalAccountsMap[currentUserEmail].map((account) => (
                                    <div key={account.id} className="border rounded-lg p-3 shadow-sm bg-white">
                                        {/* 스토어 정보 */}
                                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
                                            <div className="flex items-center gap-2">
                                                        <Image src={account.storeLogo} alt={account.storeName} width={20} height={20} />
                                                <span className="text-base font-semibold text-gray-900">{account.storeName}</span>

                                                {/* 와우회원 표시 */}
                                                {account.wowMember && account.storeName === "쿠팡" && (
                                                    <div className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-50 border border-blue-100">
                                                        <Image src="/logos/coupang_rocket_wow.png" alt="와우 멤버십" width={50} height={15} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 계정 정보 그리드 */}
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            {/* 아이디 */}
                                            <div className="flex items-start gap-2 bg-gray-100 rounded px-3 py-1">
                                                <div className="flex items-center gap-1 text-gray-500 text-xs min-w-[40px]">
                                                    <User className="w-3 h-3" />
                                                    <span>아이디</span>
                                                </div>
                                                <p className="text-gray-800 font-medium text-xs">
                                                    {account.userId}
                                                </p>
                                            </div>

                                            {/* 이름 */}
                                            <div className="flex items-start gap-2 bg-gray-100 rounded px-3 py-1">
                                                <div className="flex items-center gap-1 text-gray-500 text-xs min-w-[40px]">
                                                    <User className="w-3 h-3" />
                                                    <span>이름</span>
                                                </div>
                                                <p className="text-gray-800 font-medium text-xs">
                                                    {account.userName}
                                                </p>
                                            </div>

                                            {/* 수취인 */}
                                            <div className="flex items-start gap-2 bg-gray-100 rounded px-3 py-1">
                                                <div className="flex items-center gap-1 text-gray-500 text-xs min-w-[40px]">
                                                    <User className="w-3 h-3" />
                                                    <span>수취인</span>
                                                </div>
                                                <p className="text-gray-800 font-medium text-xs">
                                                    {account.recipient || account.receiver}
                                                </p>
                                            </div>

                                            {/* 연락처 */}
                                            <div className="flex items-start gap-2 bg-gray-100 rounded px-3 py-1">
                                                <div className="flex items-center gap-1 text-gray-500 text-xs min-w-[40px]">
                                                    <Phone className="w-3 h-3" />
                                                    <span>연락처</span>
                                                </div>
                                                <p className="text-gray-800 font-medium text-xs">
                                                    {account.phone || account.contact}
                                                </p>
                                            </div>

                                            {/* 배송지 */}
                                            <div className="flex items-start gap-2 bg-gray-100 rounded px-3 py-1 col-span-2">
                                                <div className="flex items-center gap-1 text-gray-500 text-xs min-w-[40px]">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>배송지</span>
                                                </div>
                                                <p className="text-gray-800 font-medium text-xs whitespace-pre-wrap break-words">
                                                    {account.address}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <Users className="h-12 w-12 mb-2 text-gray-300" />
                                <p>추가 계정이 없습니다</p>
                            </div>
                        )}
                    </div>

                    {/* 푸터 영역 */}
                    <div className="flex items-center justify-end gap-3 px-6 py-3 bg-gray-50 border-t">
                        <Button
                            onClick={() => setIsAccountsModalOpen(false)}
                            className="h-8 px-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            닫기
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}