'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Plus,
    ChevronDown,
    Calendar,
    AlertCircle,
    FileDown,
    Edit,
    Trash,
    Upload,
    X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from "@/src/components/ui/textarea";

// 정렬 옵션
const sortOptions = [
    { id: 'newest', name: '최신순' },
    { id: 'oldest', name: '오래된순' },
    { id: 'nameAsc', name: '쇼핑몰명 오름차순' },
    { id: 'nameDesc', name: '쇼핑몰명 내림차순' },
];

// 임시 데이터
const mockShops = Array.from({ length: 11 }).map((_, i) => ({
    id: i + 1,
    name: `쇼핑몰 ${i + 1}`,
    logo: '/logos/coupang.png',
    url: `https://shop${i + 1}.example.com`,
    registrationDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    description: `쇼핑몰 ${i + 1}에 대한 간단한 설명입니다. 여기에 쇼핑몰에 대한 추가 정보가 들어갑니다.`
}));

export default function ShopTable() {
    const [loading, setLoading] = useState(false);
    const [shops, setShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // 모달 상태 관리
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentShop, setCurrentShop] = useState(null);
    const [newShop, setNewShop] = useState({
        name: '',
        url: '',
        logo: '/logos/default.png',
        description: ''
    });
    const [logoPreview, setLogoPreview] = useState('/logos/default.png');
    const [logoFile, setLogoFile] = useState(null);

    // 데이터 로딩
    useEffect(() => {
        // API 호출 시뮬레이션
        const timer = setTimeout(() => {
            setShops(mockShops);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // 필터링 및 정렬 적용
    useEffect(() => {
        let result = [...shops];

        // 검색어 필터링
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(shop =>
                shop.name.toLowerCase().includes(query) ||
                shop.url.toLowerCase().includes(query)
            );
        }

        // 정렬
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
                case 'oldest':
                    return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
                case 'nameAsc':
                    return a.name.localeCompare(b.name);
                case 'nameDesc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });

        setFilteredShops(result);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋
    }, [shops, searchQuery, sortBy]);

    // 현재 페이지 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentShops = filteredShops.slice(indexOfFirstItem, indexOfLastItem);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredShops.length / itemsPerPage);

    // 신규 쇼핑몰 모달 열기
    const openCreateModal = () => {
        setNewShop({
            name: '',
            url: '',
            logo: '/logos/default.png',
            description: ''
        });
        setLogoPreview('/logos/default.png');
        setLogoFile(null);
        setIsCreateModalOpen(true);
    };

    // 로고 파일 변경 핸들러
    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 신규 쇼핑몰 저장
    const handleCreateShop = () => {
        // 폼 유효성 검사
        if (!newShop.name || !newShop.url) {
            alert('쇼핑몰명과 URL은 필수 입력 항목입니다.');
            return;
        }

        // URL 유효성 검사
        try {
            new URL(newShop.url);
        } catch (_) {
            alert('유효한 URL 형식이 아닙니다. http:// 또는 https://로 시작하는 URL을 입력해주세요.');
            return;
        }

        // 새 쇼핑몰 객체 생성
        const newShopObject = {
            id: shops.length + 1,
            name: newShop.name,
            url: newShop.url,
            logo: logoPreview, // 실제 구현에서는 서버에 업로드 후 URL을 받아와야 함
            description: newShop.description,
            registrationDate: new Date().toISOString().split('T')[0]
        };

        // 실제 구현에서는 API 호출로 저장
        console.log('신규 쇼핑몰 등록:', newShopObject);

        // 상태 업데이트
        setShops([newShopObject, ...shops]);
        setIsCreateModalOpen(false);

        // 성공 메시지
        alert('쇼핑몰이 성공적으로 등록되었습니다.');
    };

    // 쇼핑몰 수정 모달 열기
    const openEditModal = (shop) => {
        setCurrentShop(shop);
        setIsEditModalOpen(true);
    };

    // 쇼핑몰 삭제 다이얼로그 열기
    const openDeleteDialog = (shop) => {
        setCurrentShop(shop);
        setIsDeleteDialogOpen(true);
    };

    // 쇼핑몰 수정 저장
    const handleSaveShop = () => {
        // 폼 유효성 검사
        if (!currentShop.name || !currentShop.url) {
            alert('쇼핑몰명과 URL은 필수 입력 항목입니다.');
            return;
        }

        // 실제 구현에서는 API 호출로 업데이트
        console.log('쇼핑몰 정보 저장:', currentShop);

        // 상태 업데이트
        setShops(shops.map(shop =>
            shop.id === currentShop.id ? currentShop : shop
        ));

        setIsEditModalOpen(false);

        // 성공 메시지
        alert('쇼핑몰 정보가 성공적으로 업데이트되었습니다.');
    };

    // 쇼핑몰 삭제
    const handleDeleteShop = () => {
        // 실제 구현에서는 API 호출로 삭제
        console.log('쇼핑몰 삭제:', currentShop?.id);

        // 상태 업데이트
        setShops(shops.filter(shop => shop.id !== currentShop.id));

        setIsDeleteDialogOpen(false);

        // 성공 메시지
        alert('쇼핑몰이 성공적으로 삭제되었습니다.');
    };

    // 엑셀 다운로드 함수
    const handleExcelDownload = () => {
        alert('쇼핑몰 목록 엑셀 다운로드');
        // 실제 구현 시 API 호출 필요
    };

    // 날짜 포맷 함수
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    // 로딩 중 UI
    if (loading) {
        return (
            <div className="w-full py-12 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <p className="mt-4 text-gray-600">쇼핑몰 목록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    쇼핑몰 관리
                </h1>
                <div className="mt-4 sm:mt-0">
                    <Button
                        onClick={openCreateModal}
                        className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
                    >
                        <Plus size={16} className="mr-2" />
                        신규 쇼핑몰 등록
                    </Button>
                </div>
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
                            placeholder="쇼핑몰명 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 md:ml-auto">
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
                                    strokeWidth={2}
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

            {/* 쇼핑몰 목록 테이블 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* 테이블 헤더 */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">쇼핑몰명</th>
                            <th className="px-6 py-3">이미지</th>
                            <th className="px-6 py-3">등록일</th>
                            <th className="px-6 py-3">관리</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {currentShops.length > 0 ? (
                            currentShops.map((shop) => (
                                <tr key={shop.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {shop.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-indigo-600 hover:underline">
                                                    <Link href={`/admin/shops/${shop.id}`}>
                                                        {shop.name}
                                                    </Link>
                                                </div>
                                                <div className="text-sm text-gray-500">{shop.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 relative flex-shrink-0">
                                                <Image
                                                    src={shop.logo}
                                                    alt={`${shop.name} 로고`}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Calendar size={14} className="mr-1 text-gray-500" />
                                                <span>{formatDate(shop.registrationDate)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openEditModal(shop)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteDialog(shop)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <AlertCircle size={32} className="text-gray-400 mb-4" />
                                        <p className="text-gray-500 text-lg font-medium">
                                            쇼핑몰이 없습니다
                                        </p>
                                        <p className="text-gray-500 mt-1">
                                            {searchQuery
                                                ? '검색 조건에 맞는 쇼핑몰이 없습니다. 다른 검색어를 입력해보세요.'
                                                : '신규 쇼핑몰을 등록해보세요.'}
                                        </p>
                                        {!searchQuery && (
                                            <Button
                                                onClick={openCreateModal}
                                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <Plus size={16} className="mr-2" />
                                                신규 쇼핑몰 등록
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                {filteredShops.length > itemsPerPage && (
                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">{indexOfFirstItem + 1}</span>
                                    -
                                    <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredShops.length)}
                  </span>
                                    {' / '}
                                    <span className="font-medium">{filteredShops.length}</span> 개 쇼핑몰
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

            {/* 신규 쇼핑몰 등록 모달 */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>신규 쇼핑몰 등록</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        {/* 로고 업로드 영역 */}
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-24 h-24 relative">
                                <Image
                                    src={logoPreview}
                                    alt="쇼핑몰 로고 미리보기"
                                    width={96}
                                    height={96}
                                    className="rounded-full object-cover border border-gray-300"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <label htmlFor="logo-upload" className="cursor-pointer p-2 text-white">
                                        <Upload size={20} />
                                    </label>
                                    <input
                                        id="logo-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleLogoChange}
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">로고 이미지 등록 (권장 사이즈: 200x200px)</p>
                        </div>

                        {/* 쇼핑몰 정보 입력 폼 */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="new-shop-name" className="text-right">
                                쇼핑몰명 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="new-shop-name"
                                placeholder="쇼핑몰 이름을 입력하세요"
                                value={newShop.name}
                                onChange={(e) => setNewShop({...newShop, name: e.target.value})}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="new-shop-url" className="text-right">
                                URL <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="new-shop-url"
                                placeholder="https://example.com"
                                value={newShop.url}
                                onChange={(e) => setNewShop({...newShop, url: e.target.value})}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="new-shop-description" className="text-right mt-2">
                                쇼핑몰 설명
                            </Label>
                            <Textarea
                                id="new-shop-description"
                                placeholder="쇼핑몰에 대한 간단한 설명을 입력하세요"
                                value={newShop.description}
                                onChange={(e) => setNewShop({...newShop, description: e.target.value})}
                                className="col-span-3 min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <div className="text-sm text-gray-500">
                            <span className="text-red-500">*</span> 표시는 필수 입력 항목입니다
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                취소
                            </Button>
                            <Button onClick={handleCreateShop}>등록</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 쇼핑몰 수정 모달 */}
            {currentShop && (
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>쇼핑몰 정보 수정</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-24 h-24 relative">
                                    <Image
                                        src={currentShop.logo}
                                        alt={`${currentShop.name} 로고`}
                                        width={96}
                                        height={96}
                                        className="rounded-full object-cover border border-gray-300"
                                    />
                                    <button
                                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full"
                                        onClick={() => console.log('로고 변경')}
                                    >
                                        <Edit size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="shop-id" className="text-right">
                                    ID
                                </Label>
                                <Input
                                    id="shop-id"
                                    value={currentShop.id}
                                    disabled
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="shop-name" className="text-right">
                                    쇼핑몰명 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="shop-name"
                                    value={currentShop.name}
                                    onChange={(e) => setCurrentShop({...currentShop, name: e.target.value})}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="shop-url" className="text-right">
                                    URL <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="shop-url"
                                    value={currentShop.url}
                                    onChange={(e) => setCurrentShop({...currentShop, url: e.target.value})}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            {currentShop.description !== undefined && (
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <Label htmlFor="shop-description" className="text-right mt-2">
                                        쇼핑몰 설명
                                    </Label>
                                    <Textarea
                                        id="shop-description"
                                        value={currentShop.description || ''}
                                        onChange={(e) => setCurrentShop({...currentShop, description: e.target.value})}
                                        className="col-span-3 min-h-[100px]"
                                    />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                취소
                            </Button>
                            <Button onClick={handleSaveShop}>저장</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* 쇼핑몰 삭제 확인 다이얼로그 */}
            {currentShop && (
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>쇼핑몰 삭제</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-center text-gray-700">
                                <span className="font-semibold">{currentShop.name}</span> 쇼핑몰을 정말 삭제하시겠습니까?
                            </p>
                            <p className="text-center text-gray-500 text-sm mt-2">
                                이 작업은 되돌릴 수 없습니다.
                            </p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                취소
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteShop}>
                                삭제
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}