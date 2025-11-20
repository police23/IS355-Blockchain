export const formatTimeAgo = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) return "Thời gian không hợp lệ";

    const diffMs = Date.now() - date.getTime();
    if (diffMs < 0) return "Trong tương lai";

    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) return `${seconds} giây trước`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} tháng trước`;

    const years = Math.floor(days / 365);
    return `${years} năm trước`;
};