import { useState, useEffect, useRef, useMemo  } from 'react';
import {
    RefreshCw,
    Search,
    MessageCircle,
    Filter,
    ChevronDown,
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle,
    Upload,
    X,
    User,
    Phone,
    MapPin,
    Calendar,
    Trash2,
    FileImage,
    Plus,
    Building,
    Mail,
    CreditCard,
    ShoppingBag,
    ClipboardList,
    Image as ImageIcon,
    Send,
    ArrowLeft,
    Download,
    Paperclip,
    File,
    FileText
} from 'lucide-react';
import clsx from 'clsx';
import Image from "next/image";

// CS 항목 인터페이스
interface CSItem {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone?: string;
    campaignId: string;
    campaignTitle: string;
    requestType: 'refund' | 'exchange' | 'inquiry' | 'complaint' | 'other';
    title: string;
    content: string;
    status: 'received' | 'completed';
    requestDate: string;
    responseDate?: string;
    response?: string;
    adminId?: string;
    adminName?: string;
    attachments: Array<{
        id: string;
        name: string;
        url: string;
        type: string;
        size: number;
    }>;
    responseAttachments?: Array<{
        id: string;
        name: string;
        url: string;
        type: string;
        size: number;
    }>;
}

// 증빙 정보 인터페이스
interface ProofItem {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    isSubAccount: boolean;
    storeName?: string;
    date: string;
    status: '구매증빙' | '리뷰증빙' | '구매증빙 수정' | '리뷰증빙 수정' | '완료';
    option: string;
    orderNumber: string;
    amount: string;
    receiptImageUrl?: string;
    reviewImageUrl?: string;
}

// 다계정 정보 인터페이스
interface SubAccount {
    id: number;
    storeName: string;
    storeLogo: string;
    userId: string;
    userName: string;
    accountHolder: string;
    recipient: string;
    accountNumber: string;
    bank: string;
    contact: string;
    phone: string;
    receiver: string;
    address: string;
    wowMember: boolean;
    emailOrPhone: string;
    status: string;
    joinDate: string;
}

// 고객 정보 확장 인터페이스
interface CustomerInfo {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    joinDate: string;
    status: 'active' | 'inactive' | 'suspended' | 'pending';
    subAccounts?: SubAccount[];
}

// CS 유형 한글 변환 함수
const getRequestTypeText = (type: CSItem['requestType']) => {
    switch(type) {
        case 'refund': return '환불 요청';
        case 'exchange': return '교환 요청';
        case 'inquiry': return '문의';
        case 'complaint': return '불만';
        case 'other': return '기타';
        default: return '알 수 없음';
    }
};

// CS 상태 한글 변환 함수
const getStatusText = (status: CSItem['status']) => {
    switch(status) {
        case 'received': return '접수됨';
        case 'completed': return '완료됨';
        default: return '알 수 없음';
    }
};

// 상태별 아이콘 및 색상
const getStatusIcon = (status: CSItem['status']) => {
    switch(status) {
        case 'received':
            return <Clock className="w-4 h-4 text-orange-500" />;
        case 'completed':
            return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        default:
            return null;
    }
};

// 상태별 배경색 클래스
const getStatusBgClass = (status: CSItem['status']) => {
    switch(status) {
        case 'received': return 'bg-orange-100 text-orange-800';
        case 'completed': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function CSManagement() {
    const [statusFilter, setStatusFilter] = useState<CSItem['status'] | ''>('');
    const [typeFilter, setTypeFilter] = useState<CSItem['requestType'] | ''>('');
    const [campaignFilter, setCampaignFilter] = useState('current'); // 'current', 'all', or specific campaign ID
    const [searchText, setSearchText] = useState('');
    const [selectedCS, setSelectedCS] = useState<CSItem | null>(null);
    const [responseText, setResponseText] = useState('');
    const [activeTab, setActiveTab] = useState<'cs-detail' | 'customer-info' | 'proof-info' | 'cs-history'>('cs-detail');
    const [selectedCSHistory, setSelectedCSHistory] = useState<CSItem | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState(null);

    // 파일 관련 상태
    const [responseFiles, setResponseFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // 파일 입력 참조
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [localSearchText, setLocalSearchText] = useState('');
    const [localStatusFilter, setLocalStatusFilter] = useState('');


// 검색 핸들러
    const handleSearch = () => {
        // 검색 로직 구현
        console.log('검색:', {
            기간: activePeriod,
            상태: statusFilter,
            검색어: searchText
        });
    };


    // 초기화 핸들러
    const handleReset = () => {
    };

    const handleProofSearch = () => {
    };

    const handleProofReset = () => {
        setLocalSearchText('');
        setLocalStatusFilter('');
    };

    // 파일 변경 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
            setResponseFiles(prev => [...prev, ...newFiles]);

            if (files.length !== newFiles.length) {
                alert('이미지 파일만 업로드 가능합니다.');
            }

            // 파일 입력 초기화
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // 파일 제거 핸들러
    const handleRemoveFile = (index: number) => {
        setResponseFiles(prev => prev.filter((_, i) => i !== index));
    };

    // 파일 선택 버튼 클릭
    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    // 드래그 앤 드롭 핸들러
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
            setResponseFiles(prev => [...prev, ...newFiles]);

            if (files.length !== newFiles.length) {
                alert('이미지 파일만 업로드 가능합니다.');
            }
        }
    };

    // 붙여넣기 핸들러
    const handlePaste = (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) {
                        setResponseFiles(prev => [...prev, file]);
                    }
                    break;
                }
            }
        }
    };

    // CS 응답 제출 핸들러
    const handleSubmitResponse = () => {
        if (!selectedCS) return;

        console.log('CS 응답 제출:', {
            csId: selectedCS.id,
            response: responseText,
            files: responseFiles
        });

        // 실제 구현에서는 API 호출 등으로 저장
        const updatedCS = {
            ...selectedCS,
            status: 'completed' as const,
            response: responseText,
            responseDate: new Date().toISOString(),
            adminId: 'admin-001',
            adminName: '관리자1',
            responseAttachments: responseFiles.map((file, index) => ({
                id: `resp-${selectedCS.id}-${index}`,
                name: file.name,
                url: URL.createObjectURL(file),
                type: file.type,
                size: file.size
            }))
        };

        setSelectedCS(updatedCS);

        // 실제 구현에서는 여기서 API 호출 후 성공 시 아래 코드 실행
        alert('응답이 성공적으로 처리되었습니다.');
    };

    // 컴포넌트 마운트/언마운트 시 붙여넣기 이벤트 처리
    useEffect(() => {
        if (selectedCS && activeTab === 'cs-detail') {
            window.addEventListener('paste', handlePaste);
        }

        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, [selectedCS, activeTab]);


    // ESC 클릭 시 이미지 닫음
    useEffect(() => {
        if (!previewImageUrl) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                console.log('ESC 눌림');
                setPreviewImageUrl(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [previewImageUrl]);



    // 샘플 CS 데이터 - 더 많은 샘플 데이터 추가
    const csItems: CSItem[] = [
        {
            id: 'cs-001',
            userId: 'user-001',
            userName: '김고객',
            userEmail: 'user1@example.com',
            userPhone: '010-1234-5678',
            campaignId: 'camp-001',
            campaignTitle: '여름 신상품 체험단',
            requestType: 'inquiry',
            title: '제품 사용법 문의',
            content: '제품을 어떻게 사용하나요? 설명서가 없어서 문의드립니다.',
            status: 'received',
            requestDate: '2025-05-10T14:30:00',
            attachments: [
                {
                    id: 'att-001',
                    name: '제품사진1.jpg',
                    url: '/Placeholder2.svg',
                    type: 'image/jpeg',
                    size: 234567
                },
                {
                    id: 'att-002',
                    name: '제품사진2.jpg',
                    url: '/Placeholder2.svg',
                    type: 'image/jpeg',
                    size: 345678
                }
            ]
        },
        {
            id: 'cs-002',
            userId: 'user-002',
            userName: '이문의',
            userEmail: 'user3@example.com',
            userPhone: '010-2345-6789',
            campaignId: 'camp-001',
            campaignTitle: '여름 신상품 체험단',
            requestType: 'refund',
            title: '환불 요청합니다',
            content: '제품이 파손된 상태로 배송되었습니다. 환불 부탁드립니다.',
            status: 'received',
            requestDate: '2025-05-09T11:20:00',
            adminId: 'admin-001',
            adminName: '관리자1',
            attachments: [
                {
                    id: 'att-003',
                    name: '파손사진.jpg',
                    url: '/Placeholder2.svg',
                    type: 'image/jpeg',
                    size: 456789
                }
            ]
        },
        {
            id: 'cs-003',
            userId: 'user-003',
            userName: '박환불',
            userEmail: 'user5@example.com',
            userPhone: '010-3456-7890',
            campaignId: 'camp-002',
            campaignTitle: '헤어 케어 제품 리뷰어',
            requestType: 'exchange',
            title: '사이즈 교환 요청',
            content: '제가 잘못 선택했는데, 사이즈를 교환할 수 있을까요?',
            status: 'completed',
            requestDate: '2025-05-08T09:15:00',
            responseDate: '2025-05-08T15:30:00',
            response: '네, 교환 가능합니다. 배송지와 연락처를 보내주시면 교환 절차를 안내해드리겠습니다.',
            adminId: 'admin-002',
            adminName: '관리자2',
            attachments: [
                {
                    id: 'att-004',
                    name: '제품사진.jpg',
                    url: '/Placeholder2.svg',
                    type: 'image/jpeg',
                    size: 567890
                }
            ],
            responseAttachments: [
                {
                    id: 'resp-001',
                    name: '교환안내.jpg',
                    url: '/Placeholder2.svg',
                    type: 'image/jpeg',
                    size: 678901
                }
            ]
        },
        {
            id: 'cs-004',
            userId: 'user-004',
            userName: '최불만',
            userEmail: 'user5@example.com',
            userPhone: '010-4567-8901',
            campaignId: 'camp-003',
            campaignTitle: '주방용품 체험단',
            requestType: 'complaint',
            title: '배송이 너무 느립니다',
            content: '주문한 지 일주일이 지났는데 아직 배송이 안 왔습니다. 확인 부탁드립니다.',
            status: 'completed',
            requestDate: '2025-05-07T16:45:00',
            responseDate: '2025-05-07T17:50:00',
            response: '해당 주문은 이미 배송 완료되었습니다. 배송 조회 결과 5월 7일 오전 10시에 배송 완료되었습니다.',
            adminId: 'admin-001',
            adminName: '관리자1',
            attachments: [],
            responseAttachments: [
                {
                    id: 'resp-002',
                    name: '배송조회결과.jpg',
                    url: '/Placeholder2.svg',
                    type: 'image/jpeg',
                    size: 789012
                }
            ]
        },
        {
            id: 'cs-005',
            userId: 'user-001',
            userName: '김고객',
            userEmail: 'user1@example.com',
            userPhone: '010-1234-5678',
            campaignId: 'camp-001',
            campaignTitle: '여름 신상품 체험단',
            requestType: 'other',
            title: '상품 정보 변경 문의',
            content: '상품 정보가 잘못 표기되어 있습니다. 확인 부탁드립니다.',
            status: 'completed',
            requestDate: '2025-05-06T10:15:00',
            responseDate: '2025-05-06T14:30:00',
            response: '안내해주신 내용 확인했습니다. 상품 정보를 수정하였습니다. 확인 감사합니다.',
            adminId: 'admin-001',
            adminName: '관리자1',
            attachments: [
                {
                    id: 'att-005',
                    name: '정보오류.jpg',
                    url: '/Placeholder2.svg',
                    type: 'image/jpeg',
                    size: 345678
                }
            ],
            responseAttachments: []
        },
        {
            id: 'cs-006',
            userId: 'user-002',
            userName: '이문의',
            userEmail: 'user3@example.com',
            userPhone: '010-2345-6789',
            campaignId: 'camp-004',
            campaignTitle: '스마트 홈 가전 체험단',
            requestType: 'inquiry',
            title: '추가 구매 가능 여부',
            content: '체험단으로 받은 제품이 너무 마음에 듭니다. 추가 구매는 어떻게 하나요?',
            status: 'received',
            requestDate: '2025-05-05T09:45:00',
            attachments: []
        },
        {
            id: 'cs-007',
            userId: 'user-001',
            userName: '김고객',
            userEmail: 'user1@example.com',
            userPhone: '010-1234-5678',
            campaignId: 'camp-005',
            campaignTitle: '유기농 스킨케어 체험단',
            requestType: 'complaint',
            title: '배송 중 파손',
            content: '제품이 배송 중 파손되었습니다. 어떻게 처리해주실 건가요?',
            status: 'completed',
            requestDate: '2025-05-04T16:30:00',
            responseDate: '2025-05-04T17:45:00',
            response: '불편을 드려 죄송합니다. 교체 상품을 바로 발송해드리겠습니다. 파손된 제품은 회수 처리하겠습니다.',
            adminId: 'admin-002',
            adminName: '관리자2',
            attachments: [
                {
                    id: 'att-006',
                    name: '파손제품.jpg',
                    url: '/Placeholder2.svg',
                    type: 'image/jpeg',
                    size: 456789
                }
            ],
            responseAttachments: []
        }
    ];

    // 샘플 고객 정보
    const customerInfoMap: Record<string, CustomerInfo> = {
        'user1@example.com': {
            id: 'user-001',
            name: '김고객',
            email: 'user1@example.com',
            phone: '010-1234-5678',
            address: '서울시 강남구 테헤란로 123, 테헤란로 아파트 1단지 207동 1045호',
            joinDate: '2024-01-15',
            status: 'active',
            subAccounts: [
                {
                    id: 101,
                    storeName: "쿠팡",
                    storeLogo: "/logos/coupang.png",
                    userId: "coupang_user1",
                    userName: "김고객",
                    accountHolder: "김고객",
                    recipient: "김고객",
                    accountNumber: "1234567890",
                    bank: "국민은행",
                    contact: "010-1234-5678",
                    phone: "010-1234-5678",
                    receiver: "김고객",
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
                    userName: "김고객",
                    accountHolder: "김고객",
                    recipient: "김고객",
                    accountNumber: "0987654321",
                    bank: "신한은행",
                    contact: "010-8765-4321",
                    phone: "010-8765-4321",
                    receiver: "김고객",
                    address: "서울시 강남구 역삼로 456",
                    wowMember: false,
                    emailOrPhone: "user1_naver@example.com",
                    status: "inactive",
                    joinDate: "2024-01-15"
                }
            ]
        },
        'user3@example.com': {
            id: 'user-003',
            name: '박환불',
            email: 'user3@example.com',
            phone: '010-2233-4455',
            address: '서울시 송파구 올림픽로 100',
            joinDate: '2024-02-20',
            status: 'active',
            subAccounts: [
                {
                    id: 301,
                    storeName: "올리브영",
                    storeLogo: "/logos/oliveyoung.jpg",
                    userId: "olive_user3",
                    userName: "박환불",
                    accountHolder: "박환불",
                    recipient: "박환불",
                    accountNumber: "1122334455",
                    bank: "우리은행",
                    contact: "010-2233-4455",
                    phone: "010-2233-4455",
                    receiver: "박환불",
                    address: "서울시 송파구 올림픽로 100",
                    wowMember: false,
                    emailOrPhone: "user3_olive@example.com",
                    status: "active",
                    joinDate: "2024-02-20"
                }
            ]
        },
        'user5@example.com': {
            id: 'user-005',
            name: '최불만',
            email: 'user5@example.com',
            phone: '010-5544-3322',
            address: '서울시 중구 명동길 100',
            joinDate: '2023-12-25',
            status: 'active',
            subAccounts: [
                {
                    id: 501,
                    storeName: "네이버",
                    storeLogo: "/logos/naver.png",
                    userId: "11st_user5",
                    userName: "최불만",
                    accountHolder: "최불만",
                    recipient: "최불만",
                    accountNumber: "5544332211",
                    bank: "하나은행",
                    contact: "010-5544-3322",
                    phone: "010-5544-3322",
                    receiver: "최불만",
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
                    userName: "최불만",
                    accountHolder: "최불만",
                    recipient: "최불만",
                    accountNumber: "6677889900",
                    bank: "기업은행",
                    contact: "010-6677-8899",
                    phone: "010-6677-8899",
                    receiver: "최불만",
                    address: "서울시 서초구 강남대로 200",
                    wowMember: false,
                    emailOrPhone: "user5_gmarket@example.com",
                    status: "active",
                    joinDate: "2023-11-10"
                },
                {
                    id: 503,
                    storeName: "쿠팡",
                    storeLogo: "/logos/coupang.png",
                    userId: "tmon_user5",
                    userName: "최불만",
                    accountHolder: "최불만",
                    recipient: "최불만",
                    accountNumber: "1357924680",
                    bank: "농협은행",
                    contact: "010-1357-9246",
                    phone: "010-1357-9246",
                    receiver: "최불만",
                    address: "서울시 강동구 천호대로 300",
                    wowMember: false,
                    emailOrPhone: "user5_tmon@example.com",
                    status: "suspended",
                    joinDate: "2023-12-25"
                }
            ]
        }
    };

    // 샘플 증빙 정보
    const proofItems: ProofItem[] = [
        {
            id: 'RP001',
            userId: 'user-001',
            userName: '김고객',
            userEmail: 'user1@example.com',
            isSubAccount: false,
            date: '2025-05-02',
            status: '구매증빙',
            option: '블랙',
            orderNumber: '123123123123',
            amount: '15000',
            receiptImageUrl: '/img/receipt_coupang.png'
        },
        {
            id: 'RP002',
            userId: 'user-001',
            userName: '김고객',
            userEmail: 'user1_coupang@example.com',
            isSubAccount: true,
            storeName: '쿠팡',
            date: '2025-05-03',
            status: '리뷰증빙',
            option: '화이트',
            orderNumber: '456456456456',
            amount: '25000',
            receiptImageUrl: '/img/receipt_coupang.png',
            reviewImageUrl: '/img/review.png'
        },
        {
            id: 'RP003',
            userId: 'user-003',
            userName: '박환불',
            userEmail: 'user3@example.com',
            isSubAccount: false,
            date: '2025-05-04',
            status: '구매증빙 수정',
            option: '블루',
            orderNumber: '789789789789',
            amount: '35000',
            receiptImageUrl: '/img/receipt_coupang.png'
        },
        {
            id: 'RP004',
            userId: 'user-003',
            userName: '박환불',
            userEmail: 'user3_olive@example.com',
            isSubAccount: true,
            storeName: '올리브영',
            date: '2025-05-05',
            status: '리뷰증빙 수정',
            option: '레드',
            orderNumber: '101010101010',
            amount: '45000',
            receiptImageUrl: '/img/receipt_coupang.png',
            reviewImageUrl: '/img/review.png'
        },
        {
            id: 'RP005',
            userId: 'user-005',
            userName: '최불만',
            userEmail: 'user5@example.com',
            isSubAccount: false,
            date: '2025-05-06',
            status: '완료',
            option: '그린',
            orderNumber: '111111111111',
            amount: '55000',
            receiptImageUrl: '/img/receipt_coupang.png',
            reviewImageUrl: '/img/review.png'
        }
    ];


    // 현재 선택한 고객의 증빙 정보 가져오기
    const getCustomerProofItems = () => {
        if (!selectedCS) return [];

        const mainEmail = selectedCS.userEmail;
        const subAccountEmails = customerInfoMap[mainEmail]?.subAccounts?.map(acc => acc.emailOrPhone) || [];

        // 메인 + 서브 이메일 리스트
        const allEmails = [mainEmail, ...subAccountEmails];

        return proofItems.filter(item => {
            const belongsToCustomer = allEmails.includes(item.userEmail);

            const matchesSearch =
                localSearchText.trim() === '' ||
                item.userEmail.toLowerCase().includes(localSearchText.toLowerCase());

            const matchesStatus =
                localStatusFilter === '' ||
                (localStatusFilter === 'receipt' && item.status.includes('구매')) ||
                (localStatusFilter === 'review' && item.status.includes('리뷰'));

            return belongsToCustomer && matchesSearch && matchesStatus;
        });
    };


    const filteredProofItems = useMemo(() => getCustomerProofItems(), [
        proofItems, selectedCS, customerInfoMap, localSearchText, localStatusFilter
    ]);

    // 필터링된 CS 항목
    const filteredItems = csItems.filter(item => {
        // 상태 필터
        if (statusFilter && item.status !== statusFilter) return false;

        // 유형 필터
        if (typeFilter && item.requestType !== typeFilter) return false;

        // 캠페인 필터
        if (campaignFilter === 'current' && item.campaignId !== 'camp-001') return false;  // 현재 캠페인 ID가 camp-001이라고 가정

        // 검색어
        if (searchText) {
            const searchLower = searchText.toLowerCase();
            return (
                item.userName.toLowerCase().includes(searchLower) ||
                item.title.toLowerCase().includes(searchLower) ||
                item.content.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });

    // CS 모달 열기
    const handleCSClick = (cs: CSItem) => {
        setSelectedCS(cs);
        setResponseText('');
        setResponseFiles([]);
        setActiveTab('cs-detail');
        setSelectedCSHistory(null);
    };

    // CS 모달 닫기
    const handleCloseModal = () => {
        setSelectedCS(null);
        setResponseText('');
        setResponseFiles([]);
        setSelectedCSHistory(null);
    };

    // CS 이력에서 특정 CS 클릭 시
    const handleCSHistoryClick = (cs: CSItem) => {
        setSelectedCSHistory(cs);
    };

    // CS 이력 상세에서 뒤로가기
    const handleCSHistoryBack = () => {
        setSelectedCSHistory(null);
    };

    // 포맷팅 함수
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR');
    };

    // 간단한 날짜 포맷팅 (YYYY-MM-DD)
    const formatSimpleDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // 파일 크기 포맷팅
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // 모달 내부 탭 변경 핸들러
    const handleTabChange = (tab: 'cs-detail' | 'customer-info' | 'proof-info' | 'cs-history') => {
        setActiveTab(tab);
        setSelectedCSHistory(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <MessageCircle className="w-5 h-5 mr-2 text-blue-600"/>
                        CS 발생 및 처리 현황
                    </h2>

                    {/* 통계 요약 */}
                    <div className="flex gap-2">
                        <div className="bg-orange-50 text-orange-700 text-xs font-medium px-3 py-1 rounded-full border border-orange-200">
                            접수됨: {csItems.filter(cs => cs.status === 'received').length}건
                        </div>
                        <div className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
                            완료됨: {csItems.filter(cs => cs.status === 'completed').length}건
                        </div>
                    </div>
                </div>

                {/* 필터 영역 */}
                <div className="mb-6 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* 상태 필터 */}
                        <div className="flex items-center whitespace-nowrap">
                            <select
                                className="h-10 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-28 shadow-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as CSItem['status'] | '')}
                            >
                                <option value="">모든 상태</option>
                                <option value="received">접수됨</option>
                                <option value="completed">완료됨</option>
                            </select>
                        </div>

                        {/* 유형 필터 */}
                        <div className="flex items-center whitespace-nowrap">
                            <select
                                className="h-10 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-28 shadow-sm"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as CSItem['requestType'] | '')}
                            >
                                <option value="">모든 유형</option>
                                <option value="refund">환불 요청</option>
                                <option value="exchange">교환 요청</option>
                                <option value="inquiry">문의</option>
                                <option value="complaint">불만</option>
                                <option value="other">기타</option>
                            </select>
                        </div>

                        {/* 검색 필드 */}
                        <div className="flex-1 flex items-center gap-2">
                            <div className="relative flex-1 max-w-2xl">
                                <input
                                    type="text"
                                    placeholder="이름, 제목, 내용으로 검색"
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
                                onClick={handleReset}
                            >
                                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                                초기화
                            </button>
                        </div>
                    </div>
                </div>

                {/* CS 목록 테이블 */}
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-sm text-gray-800 border-collapse">
                            <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="px-4 py-3 text-left border-b border-gray-200">상태</th>
                                <th className="px-4 py-3 text-left border-b border-gray-200">유형</th>
                                <th className="px-4 py-3 text-left border-b border-gray-200">회원명</th>
                                <th className="px-4 py-3 text-left border-b border-gray-200">제목</th>
                                <th className="px-4 py-3 text-left border-b border-gray-200">캠페인</th>
                                <th className="px-4 py-3 text-left border-b border-gray-200">요청일</th>
                                <th className="px-4 py-3 text-left border-b border-gray-200">처리일</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">첨부</th>
                                <th className="px-4 py-3 text-center border-b border-gray-200">작업</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((cs) => (
                                    <tr key={cs.id} className="hover:bg-blue-50 transition-colors duration-150">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBgClass(cs.status)}`}>
                                                    {getStatusIcon(cs.status)}
                                                    <span className="ml-1">{getStatusText(cs.status)}</span>
                                                </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                            {getRequestTypeText(cs.requestType)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                                            {cs.userName}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                                            {cs.title}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                            {cs.campaignTitle}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                            {formatSimpleDate(cs.requestDate)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                            {cs.responseDate ? formatSimpleDate(cs.responseDate) : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-600">
                                            {cs.attachments.length > 0 ? cs.attachments.length : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleCSClick(cs)}
                                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                            >
                                                {cs.status === 'received' ? '응답하기' : '상세보기'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                                        검색 조건에 맞는 CS 항목이 없습니다.
                                    </td>
                                </tr>
                            )}
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

            {/* CS 상세 모달 */}
            {selectedCS && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col shadow-xl">
                        {/* 모달 헤더 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                                CS 상세 정보 - {selectedCS.userName}({selectedCS.userEmail})
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* 탭 메뉴 */}
                        <div className="flex border-b">
                            <button
                                className={`px-4 py-3 text-sm font-medium ${
                                    activeTab === 'cs-detail'
                                        ? 'text-blue-700 border-b-2 border-blue-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => handleTabChange('cs-detail')}
                            >
                                CS 상세
                            </button>
                            <button
                                className={`px-4 py-3 text-sm font-medium ${
                                    activeTab === 'customer-info'
                                        ? 'text-blue-700 border-b-2 border-blue-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => handleTabChange('customer-info')}
                            >
                                고객 정보
                            </button>
                            <button
                                className={`px-4 py-3 text-sm font-medium ${
                                    activeTab === 'proof-info'
                                        ? 'text-blue-700 border-b-2 border-blue-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => handleTabChange('proof-info')}
                            >
                                증빙 정보
                            </button>
                            <button
                                className={`px-4 py-3 text-sm font-medium ${
                                    activeTab === 'cs-history'
                                        ? 'text-blue-700 border-b-2 border-blue-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => handleTabChange('cs-history')}
                            >
                                CS 이력
                            </button>
                        </div>

                        {/* 콘텐츠 영역 - 스크롤 가능 */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* CS 상세 탭 */}
                            {activeTab === 'cs-detail' && (
                                <div className="">
                                    <div>
                                        {/* 문의 헤더 - 질문 영역 */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-start">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                    Q
                                                </div>
                                                <div className="ml-4">
                                                    <h2 className="text-xl font-bold text-gray-900">{selectedCS.title}</h2>
                                                    <div className="flex flex-wrap gap-3 mt-2">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <User size={14} className="mr-1" />
                                                            {selectedCS.userName}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Clock size={14} className="mr-1" />
                                                            {formatDate(selectedCS.requestDate)}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBgClass(selectedCS.status)}`}>
                                                            {getStatusIcon(selectedCS.status)}
                                                            <span className="ml-1">{getStatusText(selectedCS.status)}</span>
                                                        </span>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            {getRequestTypeText(selectedCS.requestType)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 문의 내용 */}
                                        <div className="mt-5 p-4 bg-gray-100 rounded-lg">
                                            <p className="whitespace-pre-line text-gray-700">{selectedCS.content}</p>
                                        </div>

                                        {/* 첨부 파일 (이미지) */}
                                        {selectedCS.attachments.length > 0 && (
                                            <div className="mt-6">
                                                <h3 className="text-sm font-medium text-gray-700 mb-3">첨부파일</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {selectedCS.attachments.map((file, index) => (
                                                        <div
                                                            key={file.id}
                                                            className="flex border border-gray-200 rounded-lg overflow-hidden"
                                                        >
                                                            <div
                                                                className="w-16 h-16 bg-gray-100 flex-shrink-0 flex items-center justify-center cursor-pointer"
                                                            >
                                                                {file.type.startsWith('image/') ? (
                                                                    <img
                                                                        src="/Placeholder2.svg"
                                                                        alt={file.name}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <FileText className="h-7 w-7 text-gray-500" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 p-3 flex flex-col justify-center">
                                                                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                            </div>
                                                            <div className="flex items-center pr-3">
                                                                <a
                                                                    href={file.url}
                                                                    download={file.name}
                                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
                                                                    title="다운로드"
                                                                >
                                                                    <Download size={16} />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 구분선 */}
                                    <div className="my-8 border-t border-gray-200"></div>

                                    {/* 답변 영역 */}
                                    {selectedCS.response ? (
                                        <div>
                                            {/* 답변 헤더 */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-start">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold">
                                                        A
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="flex items-center">
                                                            <h3 className="text-lg font-medium text-gray-900">{selectedCS.adminName}</h3>
                                                            <span className="ml-3 text-sm text-gray-500">{formatDate(selectedCS.responseDate!)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 답변 내용 */}
                                            <div className="ml-14 p-4 bg-gray-100 rounded-lg mb-3">
                                                <p className="whitespace-pre-line text-gray-700">{selectedCS.response}</p>
                                            </div>

                                            {/* 응답 첨부 파일 (있는 경우) */}
                                            {selectedCS.responseAttachments && selectedCS.responseAttachments.length > 0 && (
                                                <div className="ml-14">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-3">응답 첨부 파일</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {selectedCS.responseAttachments.map((file) => (
                                                            <div
                                                                key={file.id}
                                                                className="flex border border-gray-200 rounded-lg overflow-hidden"
                                                            >
                                                                <div
                                                                    className="w-16 h-16 bg-gray-100 flex-shrink-0 flex items-center justify-center cursor-pointer"
                                                                >
                                                                    {file.type.startsWith('image/') ? (
                                                                        <img
                                                                            src={file.url}
                                                                            alt={file.name}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <FileText className="h-7 w-7 text-gray-500" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 p-3 flex flex-col justify-center">
                                                                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                                </div>
                                                                <div className="flex items-center pr-3">
                                                                    <a
                                                                        href={file.url}
                                                                        download={file.name}
                                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
                                                                        title="다운로드"
                                                                    >
                                                                        <Download size={16} />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-start mb-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold">
                                                    A
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h3 className="text-lg font-medium text-gray-900 mb-3">답변 작성</h3>

                                                    {/* 답변 입력 영역 */}
                                                    <div className="mb-4">
                                                        <textarea
                                                            rows={6}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="답변 내용을 입력해주세요..."
                                                            value={responseText}
                                                            onChange={(e) => setResponseText(e.target.value)}
                                                            required
                                                        ></textarea>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            줄바꿈은 그대로 유지됩니다. 문단을 구분하려면 빈 줄을 추가하세요.
                                                        </p>
                                                    </div>

                                                    {/* 첨부파일 영역 */}
                                                    <div className="mb-4">
                                                        <div className="flex items-center space-x-2 mb-3">
                                                            <button
                                                                type="button"
                                                                onClick={handleFileSelect}
                                                                className="flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
                                                            >
                                                                <Paperclip size={16} className="mr-1" />
                                                                파일 첨부
                                                            </button>
                                                            <input
                                                                type="file"
                                                                ref={fileInputRef}
                                                                onChange={handleFileChange}
                                                                className="hidden"
                                                                multiple
                                                            />
                                                            <span className="text-xs text-gray-500">
                                                                이미지 파일만 첨부 가능합니다.
                                                            </span>
                                                        </div>

                                                        {/* 첨부파일 목록 */}
                                                        {responseFiles.length > 0 && (
                                                            <div className="space-y-2">
                                                                {responseFiles.map((file, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-md"
                                                                    >
                                                                        <div className="flex items-center space-x-2 text-sm text-gray-700 truncate">
                                                                            {file.type.includes('image')
                                                                                ? <ImageIcon className="h-4 w-4 text-blue-500" />
                                                                                : <File className="h-4 w-4 text-blue-500" />
                                                                            }
                                                                            <span className="truncate max-w-[180px] sm:max-w-xs">{file.name}</span>
                                                                            <span className="text-xs text-gray-500">
                                                                                ({formatFileSize(file.size)})
                                                                            </span>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleRemoveFile(index)}
                                                                            className="text-gray-500 hover:text-red-500 p-1"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 고객 정보 탭 */}
                            {activeTab === 'customer-info' && (
                                <div className="space-y-6">
                                    {customerInfoMap[selectedCS.userEmail] ? (
                                        <>
                                            {/* 기본 정보 */}
                                            <div>
                                                <h4 className="text-md font-semibold text-gray-800 mb-4">기본 정보</h4>

                                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                                        {/* 이름 */}
                                                        <div className="flex items-start gap-3">
                                                            <User className="w-4 h-4 mt-0.5 text-gray-500" />
                                                            <div>
                                                                <p className="text-xs text-gray-500">이름</p>
                                                                <p className="text-sm text-gray-900 font-medium">{customerInfoMap[selectedCS.userEmail].name}</p>
                                                            </div>
                                                        </div>

                                                        {/* 이메일 */}
                                                        <div className="flex items-start gap-3">
                                                            <Mail className="w-4 h-4 mt-0.5 text-gray-500" />
                                                            <div>
                                                                <p className="text-xs text-gray-500">이메일</p>
                                                                <p className="text-sm text-gray-900 font-medium">{customerInfoMap[selectedCS.userEmail].email}</p>
                                                            </div>
                                                        </div>

                                                        {/* 연락처 */}
                                                        <div className="flex items-start gap-3">
                                                            <Phone className="w-4 h-4 mt-0.5 text-gray-500" />
                                                            <div>
                                                                <p className="text-xs text-gray-500">연락처</p>
                                                                <p className="text-sm text-gray-900 font-medium">{customerInfoMap[selectedCS.userEmail].phone || '-'}</p>
                                                            </div>
                                                        </div>

                                                        {/* 가입일 */}
                                                        <div className="flex items-start gap-3">
                                                            <Calendar className="w-4 h-4 mt-0.5 text-gray-500" />
                                                            <div>
                                                                <p className="text-xs text-gray-500">가입일</p>
                                                                <p className="text-sm text-gray-900 font-medium">{customerInfoMap[selectedCS.userEmail].joinDate}</p>
                                                            </div>
                                                        </div>

                                                        {/* 배송지 - 2칸 전체 차지 */}
                                                        <div className="flex items-start gap-3 sm:col-span-2">
                                                            <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                                                            <div>
                                                                <p className="text-xs text-gray-500">배송지</p>
                                                                <p className="text-sm text-gray-900 font-medium whitespace-pre-wrap break-words">
                                                                    {customerInfoMap[selectedCS.userEmail].address || '-'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 다계정 정보 */}
                                            {customerInfoMap[selectedCS.userEmail].subAccounts && customerInfoMap[selectedCS.userEmail].subAccounts.length > 0 && (
                                                <div>
                                                    <h4 className="text-md font-semibold text-gray-800 mb-4 mt-3">다계정 정보</h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {customerInfoMap[selectedCS.userEmail].subAccounts.map((account) => (
                                                            <div key={account.id} className="border rounded-lg p-3 shadow-sm bg-white">
                                                                {/* 스토어 정보 */}
                                                                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                                                            <Image src={account.storeLogo} alt={`${account.storeName} 로고`} width={20} height={20} />
                                                                        </div>
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
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8">
                                            <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
                                            <p className="text-gray-500">고객 정보를 찾을 수 없습니다</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 증빙 정보 탭 */}
                            {activeTab === 'proof-info' && (
                                <div>
                                    {/* 이메일 검색창 + 상태 필터 */}
                                    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        {/* 이메일 검색 */}
                                        <div className="flex items-center gap-2 w-full md:w-auto">
                                            <div className="relative w-full md:w-64">
                                                <input
                                                    type="text"
                                                    placeholder="이메일 검색"
                                                    value={localSearchText}
                                                    onChange={(e) => setLocalSearchText(e.target.value)}
                                                    className="h-10 w-full px-3 pl-9 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                                />
                                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            </div>

                                            <button
                                                className="h-10 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow"
                                                onClick={handleProofSearch}
                                            >
                                                검색
                                            </button>

                                            <button
                                                className="h-10 px-4 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition flex items-center"
                                                onClick={handleProofReset}
                                            >
                                                <RefreshCw className="w-4 h-4 mr-1.5" />
                                                초기화
                                            </button>
                                        </div>

                                        {/* 상태 필터 */}
                                        <div className="flex flex-wrap gap-2">
                                            {['all', 'receipt', 'review'].map((status) => {
                                                const value = status === 'all' ? '' : status;
                                                const isSelected = localStatusFilter === value;
                                                return (
                                                    <button
                                                        key={status}
                                                        onClick={() => setLocalStatusFilter(value)}
                                                        className={`px-3 py-1 h-8 rounded-full text-xs font-medium border transition-all
                            ${isSelected
                                                            ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                                                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {status === 'all' ? '모든 증빙' : status === 'receipt' ? '구매증빙' : '리뷰증빙'}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 증빙 테이블 */}
                                    <div className="overflow-x-auto border rounded-lg">
                                        <table className="w-full text-sm text-gray-800 border-collapse">
                                            <thead>
                                            <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <th className="px-4 py-3 text-left border-b">번호</th>
                                                <th className="px-4 py-3 text-left border-b">이메일</th>
                                                <th className="px-4 py-3 text-left border-b">날짜</th>
                                                <th className="px-4 py-3 text-left border-b">상태</th>
                                                <th className="px-4 py-3 text-left border-b">옵션</th>
                                                <th className="px-4 py-3 text-left border-b">주문번호</th>
                                                <th className="px-4 py-3 text-left border-b">결제 금액</th>
                                                <th className="px-4 py-3 text-center border-b">구매 영수증</th>
                                                <th className="px-4 py-3 text-center border-b">리뷰 증빙</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                            {getCustomerProofItems().length > 0 ? (
                                                getCustomerProofItems().map((proof, index) => (
                                                    <tr key={proof.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex items-center">
                                    <span className="text-gray-800">
                                        {proof.userEmail}
                                        {proof.isSubAccount && (
                                            <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                                다계정
                                            </span>
                                        )}
                                    </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">{proof.date}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                <span className={clsx(
                                    'px-2 py-0.5 text-xs font-medium rounded-full',
                                    proof.status.includes('구매') && 'bg-orange-100 text-orange-800',
                                    proof.status.includes('리뷰') && 'bg-green-100 text-green-800',
                                    proof.status === '완료' && 'bg-gray-100 text-gray-800'
                                )}>
                                    {proof.status}
                                </span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">{proof.option}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap">{proof.orderNumber}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap">{Number(proof.amount).toLocaleString()}원</td>
                                                        <td className="px-4 py-3">
                                                            {proof.receiptImageUrl && (
                                                                <div className="flex justify-center">
                                                                    <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200">
                                                                        <img
                                                                            src={proof.receiptImageUrl}
                                                                            alt="구매 영수증"
                                                                            className="w-full h-full object-cover cursor-pointer"
                                                                            onClick={() => setPreviewImageUrl(proof.receiptImageUrl)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {proof.reviewImageUrl && (
                                                                <div className="flex justify-center">
                                                                    <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200">
                                                                        <img
                                                                            src={proof.reviewImageUrl}
                                                                            alt="리뷰 증빙"
                                                                            className="w-full h-full object-cover cursor-pointer"
                                                                            onClick={() => setPreviewImageUrl(proof.reviewImageUrl)}
                                                                        />

                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                                                        증빙 정보가 없습니다.
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* CS 이력 탭 */}
                            {activeTab === 'cs-history' && !selectedCSHistory && (
                                <div>
                                    <div className="mb-4 flex justify-between items-center">
                                        <h4 className="text-md font-medium text-gray-700">CS 이력</h4>
                                        <div className="flex gap-2 items-center">
                                            <span className="text-sm text-gray-500">캠페인:</span>
                                            <select
                                                className="text-sm border border-gray-300 rounded-md px-2 py-1"
                                                onChange={(e) => console.log('CS 이력 캠페인 필터링:', e.target.value)}
                                            >
                                                <option value="current">현재 캠페인만</option>
                                                <option value="all">모든 캠페인</option>
                                                <option value="camp-001">여름 신상품 체험단</option>
                                                <option value="camp-002">헤어 케어 제품 리뷰어</option>
                                                <option value="camp-003">주방용품 체험단</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto border rounded-lg">
                                        <table className="w-full text-sm text-gray-800 border-collapse">
                                            <thead>
                                            <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <th className="px-4 py-3 text-left border-b">상태</th>
                                                <th className="px-4 py-3 text-left border-b">유형</th>
                                                <th className="px-4 py-3 text-left border-b">제목</th>
                                                <th className="px-4 py-3 text-left border-b">캠페인</th>
                                                <th className="px-4 py-3 text-left border-b">요청일</th>
                                                <th className="px-4 py-3 text-left border-b">처리일</th>
                                                <th className="px-4 py-3 text-center border-b">작업</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                            {csItems
                                                .filter(item => item.userEmail === selectedCS.userEmail)
                                                .filter(item => item.campaignId === 'camp-001')  // 기본적으로 현재 캠페인만 표시
                                                .map((cs) => (
                                                    <tr key={cs.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBgClass(cs.status)}`}>
                                                                    {getStatusIcon(cs.status)}
                                                                    <span className="ml-1">{getStatusText(cs.status)}</span>
                                                                </span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                            {getRequestTypeText(cs.requestType)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                                                            {cs.title}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                            {cs.campaignTitle}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                            {formatSimpleDate(cs.requestDate)}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                            {cs.responseDate ? formatSimpleDate(cs.responseDate) : '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <button
                                                                onClick={() => handleCSHistoryClick(cs)}
                                                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                                            >
                                                                상세보기
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            {csItems.filter(item => item.userEmail === selectedCS.userEmail && item.campaignId === 'camp-001').length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                                        CS 이력이 없습니다.
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* CS 이력 상세 */}
                            {activeTab === 'cs-history' && selectedCSHistory && (
                                <div>
                                    <div className="flex items-center mb-6">
                                        <button
                                            onClick={handleCSHistoryBack}
                                            className="flex items-center text-gray-500 hover:text-gray-700"
                                        >
                                            <ArrowLeft size={20} className="mr-2" />
                                            <span>뒤로 가기</span>
                                        </button>
                                    </div>

                                    <div className="">
                                        <div>
                                            {/* 문의 헤더 */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-start">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                        Q
                                                    </div>
                                                    <div className="ml-4">
                                                        <h2 className="text-xl font-bold text-gray-900">{selectedCSHistory.title}</h2>
                                                        <div className="flex flex-wrap gap-3 mt-2">
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <User size={14} className="mr-1" />
                                                                {selectedCSHistory.userName}
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Clock size={14} className="mr-1" />
                                                                {formatDate(selectedCSHistory.requestDate)}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBgClass(selectedCSHistory.status)}`}>
                                                                {getStatusIcon(selectedCSHistory.status)}
                                                                <span className="ml-1">{getStatusText(selectedCSHistory.status)}</span>
                                                            </span>
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                {getRequestTypeText(selectedCSHistory.requestType)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 문의 내용 */}
                                            <div className="mt-5 p-4 bg-gray-100 rounded-lg">
                                                <p className="whitespace-pre-line text-gray-700">{selectedCSHistory.content}</p>
                                            </div>

                                            {/* 첨부 파일 */}
                                            {selectedCSHistory.attachments.length > 0 && (
                                                <div className="mt-6">
                                                    <h3 className="text-sm font-medium text-gray-700 mb-3">첨부파일</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {selectedCSHistory.attachments.map((file) => (
                                                            <div
                                                                key={file.id}
                                                                className="flex border border-gray-200 rounded-lg overflow-hidden"
                                                            >
                                                                <div className="w-16 h-16 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                                                    {file.type.startsWith('image/') ? (
                                                                        <img
                                                                            src={file.url}
                                                                            alt={file.name}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <FileText className="h-7 w-7 text-gray-500" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 p-3 flex flex-col justify-center">
                                                                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                                </div>
                                                                <div className="flex items-center pr-3">
                                                                    <a
                                                                        href={file.url}
                                                                        download={file.name}
                                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
                                                                        title="다운로드"
                                                                    >
                                                                        <Download size={16} />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* 구분선 */}
                                        <div className="my-8 border-t border-gray-200"></div>

                                        {/* 답변 영역 */}
                                        {selectedCSHistory.response && (
                                            <div>
                                                {/* 답변 헤더 */}
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-start">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold">
                                                            A
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="flex items-center">
                                                                <h3 className="text-lg font-medium text-gray-900">{selectedCSHistory.adminName}</h3>
                                                                <span className="ml-3 text-sm text-gray-500">{formatDate(selectedCSHistory.responseDate!)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 답변 내용 */}
                                                <div className="ml-14 p-4 bg-gray-100 rounded-lg">
                                                    <p className="whitespace-pre-line text-gray-700">{selectedCSHistory.response}</p>
                                                </div>

                                                {/* 응답 첨부 파일 */}
                                                {selectedCSHistory.responseAttachments && selectedCSHistory.responseAttachments.length > 0 && (
                                                    <div className="mt-4 ml-14">
                                                        <h4 className="text-sm font-medium text-gray-700 mb-3">응답 첨부 파일</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {selectedCSHistory.responseAttachments.map((file) => (
                                                                <div
                                                                    key={file.id}
                                                                    className="flex border border-gray-200 rounded-lg overflow-hidden"
                                                                >
                                                                    <div className="w-16 h-16 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                                                        {file.type.startsWith('image/') ? (
                                                                            <img
                                                                                src={file.url}
                                                                                alt={file.name}
                                                                                className="h-full w-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <FileText className="h-7 w-7 text-gray-500" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 p-3 flex flex-col justify-center">
                                                                        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                                                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                                    </div>
                                                                    <div className="flex items-center pr-3">
                                                                        <a
                                                                            href={file.url}
                                                                            download={file.name}
                                                                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
                                                                            title="다운로드"
                                                                        >
                                                                            <Download size={16} />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 모달 푸터 */}
                        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                닫기
                            </button>

                            {activeTab === 'cs-detail' && selectedCS.status === 'received' && (
                                <button
                                    onClick={handleSubmitResponse}
                                    disabled={!responseText.trim()}
                                    className={`px-4 py-2 rounded-md text-white flex items-center ${
                                        responseText.trim()
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <Send size={16} className="mr-2" />
                                    완료 처리하기
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {previewImageUrl && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
                    onClick={() => setPreviewImageUrl(null)}
                >
                    <div
                        className="bg-white rounded-lg p-4 max-w-3xl max-h-[90vh] shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={previewImageUrl}
                            alt="미리보기 이미지"
                            className="w-full h-auto max-h-[80vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}