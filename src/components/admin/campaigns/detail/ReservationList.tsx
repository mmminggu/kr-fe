import { useState } from 'react';
import {
    RefreshCw,
    Search,
    Users
} from 'lucide-react';



export default function ReservationList() {
    const [statusFilter, setStatusFilter] = useState('');  // 상태 필터
    const [searchText, setSearchText] = useState('');  // 검색어
    const [activePeriod, setActivePeriod] = useState('1m');  // 활성화된 기간 ('1m', '3m', '6m', 'custom')

    // 검색 핸들러
    const handleSearch = () => {
        // 검색 로직 구현
        console.log('검색:', {
            기간: activePeriod,
            상태: statusFilter,
            검색어: searchText
        });
    };

    const reservations = [
        {id: '1', name: '김예약', email: 'kim@example.com', phone: '010-1234-5678', option: '블랙', date: '2025-05-01'},
        {id: '2', name: '이신청', email: 'lee@example.com', phone: '010-2345-6789', option: '화이트', date: '2025-05-01'},
        {id: '4', name: '박참여', email: 'park@example.com', phone: '010-3456-7890', option: '블루', date: '2025-05-02'},
        {id: '5', name: '박참여', email: 'park@example.com', phone: '010-3456-7890', option: '블루', date: '2025-05-02'},
        {id: '6', name: '박참여', email: 'park@example.com', phone: '010-3456-7890', option: '블루', date: '2025-05-02'},
        {id: '7', name: '박참여', email: 'park@example.com', phone: '010-3456-7890', option: '블루', date: '2025-05-02'},
        {id: '8', name: '박참여', email: 'park@example.com', phone: '010-3456-7890', option: '블루', date: '2025-05-02'},
        {id: '9', name: '박참여', email: 'park@example.com', phone: '010-3456-7890', option: '블루', date: '2025-05-02'},
        {id: '10', name: '박참여', email: 'park@example.com', phone: '010-3456-7890', option: '블루', date: '2025-05-02'},
        {id: '11', name: '박참여', email: 'park@example.com', phone: '010-3456-7890', option: '블루', date: '2025-05-02'},
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-blue-600"/>
                        예약자 리스트
                    </h2>
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
                                <option value="name">이름</option>
                                <option value="pending">이메일</option>
                            </select>
                        </div>

                        {/* 검색 필드 */}
                        <div className="flex-1 flex items-center gap-2">
                            <div className="relative flex-1 max-w-2xl">
                                <input
                                    type="text"
                                    placeholder="검색어를 입력하세요"
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

                {/* 예약자 테이블 */}
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-sm text-gray-800 border-collapse">
                            <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="px-4 py-3 text-center border-b border-gray-200">번호</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">이름</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">이메일</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">연락처</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">옵션</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">예약일</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {reservations.map((reservation, index) => (
                                <tr key={reservation.id} className="hover:bg-blue-50 transition-colors duration-150">
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-800">{index + 1}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-800">{reservation.name}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">{reservation.email}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">{reservation.phone}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">{reservation.option}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">{reservation.date}</td>
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
        </div>
    );
}
