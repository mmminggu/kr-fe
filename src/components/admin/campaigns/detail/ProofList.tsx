import { useState, useEffect, useMemo } from 'react';
import {
    Upload,
    ReceiptText,
    RefreshCw,
    Search,
    X,
    ChevronDown,
    Pencil,
    Check,
    XCircle,
    SortDesc,
    ArrowUpDown
} from 'lucide-react';
import clsx from "clsx";

export default function ProofList() {
    const [statusFilter, setStatusFilter] = useState('');  // 상태 필터
    const [activeTab, setActiveTab] = useState('receipt');
    const [searchText, setSearchText] = useState('');  // 검색어
    const [activePeriod, setActivePeriod] = useState('1m');  // 활성화된 기간 ('1m', '3m', '6m', 'custom')
    const [sortOption, setSortOption] = useState('review_pending_first');  // 정렬 옵션

    // 증빙 확인 모달 관련 상태
    const [isProofModalOpen, setIsProofModalOpen] = useState(false);
    const [selectedProof, setSelectedProof] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackFile, setFeedbackFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // 검색 핸들러
    const handleSearch = () => {
        // 검색 로직 구현
        console.log('검색:', {
            기간: activePeriod,
            상태: statusFilter,
            검색어: searchText
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const receiptProofs = [
        {id: 'RP001', user: '김구매', date: '2025-05-02', status: '구매증빙', imageUrl: '/images/receipt1.jpg', orderNumber: '123123123123', amount: '15000', hasReviewProof: false},
        {id: 'RP002', user: '이증빙', date: '2025-05-03', status: '리뷰증빙', imageUrl: '/images/receipt2.jpg', orderNumber: '456456456456', amount: '25000', hasReviewProof: true},
        {id: 'RP003', user: '김철수', date: '2025-05-03', status: '구매증빙 수정', imageUrl: '/images/receipt2.jpg', orderNumber: '789789789789', amount: '35000', hasReviewProof: false},
        {id: 'RP004', user: '홍길동', date: '2025-05-03', status: '리뷰증빙 수정', imageUrl: '/images/receipt2.jpg', orderNumber: '101010101010', amount: '45000', hasReviewProof: true},
        {id: 'RP005', user: '이영희', date: '2025-05-03', status: '구매증빙 수정', imageUrl: '/images/receipt2.jpg', orderNumber: '111111111111', amount: '55000', hasReviewProof: false},
        {id: 'RP006', user: '박민수', date: '2025-05-03', status: '완료', imageUrl: '/images/receipt2.jpg', orderNumber: '121212121212', amount: '65000', hasReviewProof: true},
        {id: 'RP007', user: '김짱구', date: '2025-05-03', status: '리뷰증빙 수정', imageUrl: '/images/receipt2.jpg', orderNumber: '131313131313', amount: '75000', hasReviewProof: true},
        {id: 'RP008', user: '이훈이', date: '2025-05-03', status: '완료', imageUrl: '/images/receipt2.jpg', orderNumber: '141414141414', amount: '85000', hasReviewProof: true},
        {id: 'RP009', user: '이길동', date: '2025-05-03', status: '구매증빙', imageUrl: '/images/receipt2.jpg', orderNumber: '151515151515', amount: '95000', hasReviewProof: false},
        {id: 'RP010', user: '이증빙', date: '2025-05-03', status: '구매증빙', imageUrl: '/images/receipt2.jpg', orderNumber: '161616161616', amount: '105000', hasReviewProof: false},
    ];

    // 정렬된 증빙 목록
    const sortedProofs = useMemo(() => {
        let sorted = [...receiptProofs];

        switch (sortOption) {
            case 'review_pending_first':
                // 리뷰증빙이 없는 항목 먼저 정렬
                return sorted.sort((a, b) => {
                    // 리뷰증빙 없는 항목이 앞으로
                    if (!a.hasReviewProof && b.hasReviewProof) return -1;
                    if (a.hasReviewProof && !b.hasReviewProof) return 1;

                    // 같은 경우 상태별 정렬
                    const statusPriority = {
                        '구매증빙': 1,
                        '구매증빙 수정': 2,
                        '리뷰증빙': 3,
                        '리뷰증빙 수정': 4,
                        '완료': 5
                    };
                    return statusPriority[a.status] - statusPriority[b.status];
                });
            case 'date_desc':
                // 날짜 내림차순 (최신 순)
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'date_asc':
                // 날짜 오름차순 (오래된 순)
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            default:
                return sorted;
        }
    }, [receiptProofs, sortOption]);
    const handleProofClick = (proof) => {
        setSelectedProof(proof);
        setIsProofModalOpen(true);
        setFeedbackText('');
        setFeedbackFile(null);
    };

    // 증빙 모달 닫기
    const closeProofModal = () => {
        setIsProofModalOpen(false);
        setSelectedProof(null);
        setFeedbackText('');
        setFeedbackFile(null);
    };

    // 파일 변경 핸들러
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setFeedbackFile(file);
        } else if (file) {
            alert('이미지 파일만 업로드 가능합니다.');
        }
    };

    // 드래그 앤 드롭 핸들러 추가
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setFeedbackFile(file);
        } else if (file) {
            alert('이미지 파일만 업로드 가능합니다.');
        }
    };

    // 붙여넣기 핸들러 추가
    const handlePaste = (e) => {
        const items = (e.clipboardData || window.clipboardData).items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    setFeedbackFile(file);
                    break;
                }
            }
        }
    };

    // 컴포넌트 마운트/언마운트 시 붙여넣기 이벤트 처리
    useEffect(() => {
        if (isProofModalOpen) {
            window.addEventListener('paste', handlePaste);
        }

        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, [isProofModalOpen]);

    // 승인 처리 핸들러
    const handleApprove = () => {
        console.log('승인 처리:', {
            proofId: selectedProof?.id
        });

        // 여기서 API 호출 등 필요한 로직 구현

        // 모달 닫기
        closeProofModal();
    };

    // 반려 처리 핸들러
    const handleReject = () => {
        if (!feedbackText.trim()) {
            alert('반려 사유를 입력해주세요.');
            return;
        }

        console.log('반려 처리:', {
            proofId: selectedProof?.id,
            reason: feedbackText,
            file: feedbackFile
        });

        // 여기서 API 호출 등 필요한 로직 구현

        // 모달 닫기
        closeProofModal();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                    <ReceiptText className="w-5 h-5 mr-2 text-indigo-600" />
                    증빙 목록
                </h2>

                {/* 필터 영역 */}
                <div className="mb-6 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex flex-wrap items-center gap-3 justify-between">
                        {/* 좌측: 상태 필터 및 검색 */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* 상태 필터 */}
                            <div className="flex items-center whitespace-nowrap">
                                <select
                                    className="h-10 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-28 shadow-sm"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">전체</option>
                                    <option value="pending">구매증빙</option>
                                    <option value="approved">리뷰증빙</option>
                                    <option value="approved">구매증빙 수정</option>
                                    <option value="rejected">리뷰증빙 수정</option>
                                    <option value="rejected">완료</option>
                                </select>
                            </div>

                            {/* 검색 필드 */}
                            <div className="flex items-center gap-2">
                                <div className="relative w-full md:w-64">
                                    <input
                                        type="text"
                                        placeholder="회원명 검색"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        className="h-10 w-full px-3 pl-9 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                    />
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                </div>
                                <button className="h-10 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm whitespace-nowrap flex items-center" onClick={handleSearch}>
                                    검색
                                </button>
                                <button className="h-10 px-4 border border-gray-200 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center whitespace-nowrap shadow-sm"
                                        onClick={() => {
                                            setActivePeriod('1m');
                                            setStatusFilter('');
                                            setSearchText('');
                                        }}
                                >
                                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                                    초기화
                                </button>
                            </div>
                        </div>

                        {/* 우측: 정렬 필터 */}
                        <div className="relative w-full md:w-48 ml-auto mt-3 md:mt-0">
                            {/* 정렬 필터 */}
                            <div className="relative w-full md:w-48 ml-auto">
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
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="review_pending_first">리뷰증빙 미완료 순</option>
                                    <option value="date_desc">최신 등록일 순</option>
                                    <option value="date_asc">오래된 등록일 순</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ChevronDown size={18} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 증빙 목록 테이블 */}
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-sm text-gray-800 border-collapse">
                            <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="px-4 py-3 text-center border-b border-gray-200">번호</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">회원</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">날짜</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">상태</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">옵션</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">주문번호</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">결제 금액</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">구매 영수증</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">리뷰 증빙</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {sortedProofs.map((proof, index) => (
                                <tr key={proof.id} className="hover:bg-blue-50 transition-colors duration-150">
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-800">{index + 1}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-800">{proof.user}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">{proof.date}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                                      <span
                                          className={clsx(
                                              'px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full',
                                              proof.status === '구매증빙' && 'bg-blue-100 text-blue-800',
                                              proof.status === '리뷰증빙' && 'bg-green-100 text-green-800',
                                              proof.status === '구매증빙 수정' && 'bg-red-100 text-red-800',
                                              proof.status === '리뷰증빙 수정' && 'bg-red-100 text-red-800',
                                              proof.status === '완료' && 'bg-gray-200 text-gray-800'
                                          )}
                                      >
                                        {proof.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">블랙</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">{proof.orderNumber}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">{Number(proof.amount).toLocaleString()}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm align-middle">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 transition-colors block mx-auto"
                                            onClick={() => handleProofClick(proof)}
                                        >
                                            확인
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm align-middle">
                                        {['리뷰증빙', '리뷰증빙 수정'].includes(proof.status) && (
                                            <button
                                                className="text-blue-600 hover:text-blue-800 transition-colors block mx-auto"
                                                onClick={() => handleProofClick(proof)}
                                            >
                                                확인
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 페이지네이션 */}
                <div className="flex items-center justify-center p-4">
                    <div className="flex space-x-1">
                        <button className="px-3 py-1.5 border border-transparent bg-blue-600 text-sm font-medium rounded-md text-white hover:bg-blue-700 transition-colors">
                            1
                        </button>
                    </div>
                </div>
            </div>

            {/* 증빙 확인 모달 */}
            {isProofModalOpen && selectedProof && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900">
                                {selectedProof.status.includes('리뷰') ? '리뷰 증빙 확인' : '구매 영수증 확인'}
                            </h3>
                            <button
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                onClick={closeProofModal}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* 좌측: 고객 입력 정보 */}
                                <div className="md:w-1/2 w-full">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">고객 업로드 정보</h4>

                                    {/* 이미지 표시 영역 */}
                                    <div className="border rounded-md bg-gray-50 aspect-[4/3] flex items-center justify-center overflow-hidden mb-4">
                                        <img
                                            src="/Placeholder2.svg"
                                            alt="고객 업로드 이미지"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* 주문정보 카드 */}
                                    <div className="space-y-2">
                                        {/* 주문번호 */}
                                        <div className="flex justify-between items-center border border-gray-200 rounded px-3 py-2">
                                            <span className="text-sm text-gray-600 font-medium">주문번호</span>
                                            <span className="text-sm text-gray-900">{selectedProof.orderNumber}</span>
                                        </div>

                                        {/* 결제금액 */}
                                        <div className="flex justify-between items-center border border-gray-200 rounded px-3 py-2">
                                            <span className="text-sm text-gray-600 font-medium">결제 금액</span>
                                            <span className="text-sm text-gray-900">{Number(selectedProof.amount).toLocaleString()}원</span>
                                        </div>

                                        {/* 상태 */}
                                        <div className="flex justify-between items-center border border-gray-200 rounded px-3 py-2">
                                            <span className="text-sm text-gray-600 font-medium">현재 상태</span>
                                            <span className={clsx(
                                                'px-2 py-0.5 text-xs font-medium rounded-full',
                                                selectedProof.status === '구매증빙' && 'bg-orange-100 text-orange-800',
                                                selectedProof.status === '리뷰증빙' && 'bg-green-100 text-green-800',
                                                selectedProof.status === '구매증빙 수정' && 'bg-orange-100 text-orange-800',
                                                selectedProof.status === '리뷰증빙 수정' && 'bg-green-100 text-green-800',
                                                selectedProof.status === '완료' && 'bg-gray-200 text-gray-800'
                                            )}>
                                                {selectedProof.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 우측: 관리자 피드백 입력 영역 */}
                                <div className="md:w-1/2 w-full">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">관리자 피드백</h4>

                                    {/* 피드백 입력 영역 */}
                                    <div className="mb-4">
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            rows="8"
                                            placeholder="승인 시 피드백은 선택사항입니다. 반려 시에는 반드시 사유를 입력해주세요."
                                            value={feedbackText}
                                            onChange={(e) => setFeedbackText(e.target.value)}
                                        ></textarea>
                                    </div>

                                    {/* 파일 업로드 영역 */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                className={`flex flex-col items-center justify-center w-full h-32 border-2 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'} border-dashed rounded-lg cursor-pointer hover:bg-gray-100`}
                                                onDragEnter={handleDragEnter}
                                                onDragLeave={handleDragLeave}
                                                onDragOver={handleDragOver}
                                                onDrop={handleDrop}
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-1 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">이미지 파일을 업로드하세요</span></p>
                                                    <p className="text-xs text-gray-500">이미지를 드래그하거나 Ctrl+V로 붙여넣기 하세요.</p>
                                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG, GIF</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                            </label>
                                        </div>
                                        {feedbackFile && (
                                            <div className="mt-2 text-sm text-gray-500 flex items-center">
                                                <span className="truncate">{feedbackFile.name}</span>
                                                <button
                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                    onClick={() => setFeedbackFile(null)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* 안내 사항 */}
                                    <div className="text-xs text-gray-400 mt-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                                        <p className="font-medium text-gray-600 mb-1">※ 관리자 안내사항</p>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li>반려 시 반드시 사유를 입력해주세요.</li>
                                            <li>승인/반려 후에는 상태 변경이 불가능합니다.</li>
                                            <li>첨부파일은 이미지만 가능합니다.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
                            <button
                                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                                onClick={closeProofModal}
                            >
                                취소
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors flex items-center"
                                onClick={handleReject}
                            >
                                <XCircle className="w-4 h-4 mr-1" />
                                반려
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors flex items-center"
                                onClick={handleApprove}
                            >
                                <Check className="w-4 h-4 mr-1" />
                                승인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}