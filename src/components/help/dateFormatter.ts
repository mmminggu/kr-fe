/**
 * ISO 형식의 날짜 문자열을 'YYYY-MM-DD HH:MM' 형식으로 변환합니다.
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 현재 시간으로부터 얼마나 지났는지 표시하는 함수
 * (예: '5분 전', '1시간 전', '어제', '2023-04-20')
 */
export function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return "방금 전";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
        return "어제";
    }

    if (diffInDays < 7) {
        return `${diffInDays}일 전`;
    }

    // 일주일 이상 지난 경우 날짜 표시
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}