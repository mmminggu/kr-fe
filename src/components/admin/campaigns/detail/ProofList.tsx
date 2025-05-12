import { useState, useEffect } from 'react';
import {
    Upload,
    ReceiptText,
    RefreshCw,
    Search,
    X
} from 'lucide-react';
import clsx from "clsx";

export default function ProofList() {
    const [statusFilter, setStatusFilter] = useState('');  // 상태 필터
    const [activeTab, setActiveTab] = useState('receipt');
    const [searchText, setSearchText] = useState('');  // 검색어
    const [activePeriod, setActivePeriod] = useState('1m');  // 활성화된 기간 ('1m', '3m', '6m', 'custom')

    // 모달 관련 상태 변수들
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectFile, setRejectFile] = useState(null);
    const [selectedProofId, setSelectedProofId] = useState(null);
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
        {id: 'RP001', user: '김구매', date: '2025-05-02', status: '대기중', imageUrl: '/images/receipt1.jpg'},
        {id: 'RP002', user: '이증빙', date: '2025-05-03', status: '승인됨', imageUrl: '/images/receipt2.jpg'},
        {id: 'RP003', user: '김철수', date: '2025-05-03', status: '대기중', imageUrl: '/images/receipt2.jpg'},
        {id: 'RP004', user: '홍길동', date: '2025-05-03', status: '승인됨', imageUrl: '/images/receipt2.jpg'},
        {id: 'RP005', user: '이영희', date: '2025-05-03', status: '반려됨', imageUrl: '/images/receipt2.jpg'},
        {id: 'RP006', user: '박민수', date: '2025-05-03', status: '대기중', imageUrl: '/images/receipt2.jpg'},
        {id: 'RP007', user: '김짱구', date: '2025-05-03', status: '대기중', imageUrl: '/images/receipt2.jpg'},
        {id: 'RP008', user: '이훈이', date: '2025-05-03', status: '승인됨', imageUrl: '/images/receipt2.jpg'},
        {id: 'RP009', user: '이길동', date: '2025-05-03', status: '승인됨', imageUrl: '/images/receipt2.jpg'},
        {id: 'RP010', user: '이증빙', date: '2025-05-03', status: '승인됨', imageUrl: '/images/receipt2.jpg'},
    ];

    const reviewProofs = [
        {
            id: 'RV001',
            user: '박리뷰',
            date: '2025-05-03',
            status: '대기중',
            platform: '네이버',
            linkUrl: 'https://example.com/review1'
        },
        {
            id: 'RV002',
            user: '최체험',
            date: '2025-05-04',
            status: '승인됨',
            platform: '인스타그램',
            linkUrl: 'https://example.com/review2'
        },{
            id: 'RV003',
            user: '최체험',
            date: '2025-05-04',
            status: '반려됨',
            platform: '인스타그램',
            linkUrl: 'https://example.com/review2'
        },{
            id: 'RV004',
            user: '최체험',
            date: '2025-05-04',
            status: '대기중',
            platform: '인스타그램',
            linkUrl: 'https://example.com/review2'
        },{
            id: 'RV005',
            user: '최체험',
            date: '2025-05-04',
            status: '반려됨',
            platform: '인스타그램',
            linkUrl: 'https://example.com/review2'
        },{
            id: 'RV006',
            user: '최체험',
            date: '2025-05-04',
            status: '대기중',
            platform: '인스타그램',
            linkUrl: 'https://example.com/review2'
        },{
            id: 'RV007',
            user: '최체험',
            date: '2025-05-04',
            status: '승인됨',
            platform: '인스타그램',
            linkUrl: 'https://example.com/review2'
        },{
            id: 'RV008',
            user: '최체험',
            date: '2025-05-04',
            status: '대기중',
            platform: '인스타그램',
            linkUrl: 'https://example.com/review2'
        },{
            id: 'RV009',
            user: '최체험',
            date: '2025-05-04',
            status: '대기중',
            platform: '인스타그램',
            linkUrl: 'https://example.com/review2'
        },
    ];

    // 반려 버튼 클릭 핸들러
    const handleRejectClick = (proofId) => {
        setSelectedProofId(proofId);
        setIsRejectModalOpen(true);
    };

    // 반려 모달 닫기
    const closeRejectModal = () => {
        setIsRejectModalOpen(false);
        setRejectReason('');
        setRejectFile(null);
        setSelectedProofId(null);
    };

    // 파일 변경 핸들러
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setRejectFile(file);
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
            setRejectFile(file);
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
                    setRejectFile(file);
                    break;
                }
            }
        }
    };

// 컴포넌트 마운트/언마운트 시 붙여넣기 이벤트 처리
    useEffect(() => {
        if (isRejectModalOpen) {
            window.addEventListener('paste', handlePaste);
        }

        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, [isRejectModalOpen]);

    // 반려 제출 핸들러
    const handleRejectSubmit = () => {
        console.log('반려 처리:', {
            proofId: selectedProofId,
            reason: rejectReason,
            file: rejectFile
        });

        // 여기서 API 호출 등 필요한 로직 구현

        // 모달 닫기
        closeRejectModal();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                    <ReceiptText className="w-5 h-5 mr-2 text-indigo-600" />
                    증빙 목록
                </h2>
                <div className="flex bg-white rounded-t-lg overflow-hidden mb-5 border-b">
                    <button
                        className={clsx(
                            'flex items-center px-4 py-3 bg-gray-100 text-sm rounded-t-lg font-medium transition-colors',
                            activeTab === 'receipt'
                                ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        )}
                        onClick={() => setActiveTab('receipt')}
                    >
                        구매 영수증 증빙
                    </button>
                    <button
                        className={clsx(
                            'flex items-center px-4 py-3 bg-gray-100 text-sm rounded-t-lg font-medium transition-colors',
                            activeTab === 'review'
                                ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        )}
                        onClick={() => setActiveTab('review')}
                    >
                        리뷰 증빙
                    </button>
                </div>

                {/* 필터 영역 */}
                <div className="mb-6 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* 상태 필터 */}
                        <div className="flex items-center whitespace-nowrap">
                            <select
                                className="h-10 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-28 shadow-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">전체</option>
                                <option value="pending">대기중</option>
                                <option value="approved">승인됨</option>
                                <option value="rejected">반려됨</option>
                            </select>
                        </div>

                        {/* 검색 필드 */}
                        <div className="flex-1 flex items-center gap-2">
                            <div className="relative flex-1 max-w-2xl">
                                <input
                                    type="text"
                                    placeholder="회원명 검색"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="h-10 w-full px-3 pl-9 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>

                            {/* 검색 버튼 */}
                            <button
                                className="h-10 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm whitespace-nowrap flex items-center"
                                onClick={handleSearch}
                            >
                                검색
                            </button>

                            {/* 초기화 버튼 */}
                            <button
                                className="h-10 px-4 border border-gray-200 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center whitespace-nowrap shadow-sm"
                                onClick={() => {
                                    setActivePeriod('1m');
                                    const endDate = new Date();
                                    const startDate = new Date();
                                    startDate.setMonth(startDate.getMonth() - 1);
                                    setStatusFilter('');
                                    setSearchText('');
                                }}
                            >
                                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                                초기화
                            </button>
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
                                <th className="px-4 py-3 text-center border-b border-gray-200">
                                    {activeTab === 'receipt' ? '구매 영수증' : '리뷰'}
                                </th>
                                <th className="px-4 py-3 text-center border-b border-gray-200"></th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {(activeTab === 'receipt' ? receiptProofs : reviewProofs).map((proof, index) => (
                                <tr key={proof.id} className="hover:bg-blue-50 transition-colors duration-150">
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-800">{index + 1}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-800">{proof.user}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">{proof.date}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                      <span
                          className={clsx(
                              'px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full',
                              proof.status === '대기중' && 'bg-amber-100 text-amber-800',
                              proof.status === '승인됨' && 'bg-green-100 text-green-800',
                              proof.status === '반려됨' && 'bg-red-100 text-red-800'
                          )}
                      >
                        {proof.status}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">블랙</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">123123123123</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">15,000</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm align-middle">
                                        <button className="text-blue-600 hover:text-blue-800 transition-colors block mx-auto">
                                            이미지 보기
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right space-x-2">
                                        {proof.status !== '승인됨' ?
                                            (
                                                <>
                                                    <button className="py-1 px-3 bg-green-100 text-green-600 rounded-md hover:bg-green-100 transition-colors text-xs font-medium">
                                                        승인
                                                    </button>
                                                    <button
                                                        className="py-1 px-3 bg-red-100 text-red-600 rounded-md hover:bg-red-100 transition-colors text-xs font-medium"
                                                        onClick={() => handleRejectClick(proof.id)}
                                                    >
                                                        반려
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button disabled className="py-1 px-3 bg-gray-100 text-gray-600 rounded-md transition-colors text-xs font-medium">
                                                        승인
                                                    </button>
                                                    <button disabled
                                                        className="py-1 px-3 bg-gray-100 text-gray-600 rounded-md  transition-colors text-xs font-medium"
                                                        onClick={() => handleRejectClick(proof.id)}
                                                    >
                                                        반려
                                                    </button>
                                                </>
                                            )
                                        }

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

            {/* 반려 모달 */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900">증빙 반려 사유</h3>
                            <button
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                onClick={closeRejectModal}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    반려 사유
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    rows="4"
                                    placeholder="반려 사유를 입력하세요"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    첨부 파일
                                </label>
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
                                {rejectFile && (
                                    <div className="mt-2 text-sm text-gray-500 flex items-center">
                                        <span className="truncate">{rejectFile.name}</span>
                                        <button
                                            className="ml-2 text-red-500 hover:text-red-700"
                                            onClick={() => setRejectFile(null)}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
                            <button
                                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                                onClick={closeRejectModal}
                            >
                                취소
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                                onClick={handleRejectSubmit}
                                disabled={!rejectReason.trim()}
                            >
                                반려 처리
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
