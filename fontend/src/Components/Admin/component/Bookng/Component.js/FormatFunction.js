const formatDate = (date) => {
    if (date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
};

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    if (date) {
        return date.toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }
};

const getEventType = (type) => {
    switch (type) {
        case "WEDDING": return "Đám cưới";
        case "CONFERENCE": return "Hội nghị";
        case "BIRTHDAY": return "Sinh nhật";
        case "OTHER": return "Khác";
        default: return "";
    }
};

const getRangeTime = (from, to) => {
    const fromTime = new Date(from).toLocaleTimeString()
    const toTime = new Date(to).toLocaleTimeString()

    return fromTime + "-" + toTime
}

const getTime = (time) => {
    switch (time) {
        case "MORNING": return "Buổi sáng";
        case "AFTERNOON": return "Buổi chiều";
        case "ALLDAY": return "Cả ngày";
        default: return "";
    }
};

const getDecore = (Decore) => {
    const lobby = Decore?.LobbyDecore ? "sảnh" : "";
    const stage = Decore?.StageDecore ? "sân khấu" : "";
    const table = Decore?.TableDecore ? "bàn" : "";

    // Tạo một mảng chỉ chứa các phần tử không rỗng
    const decoreArray = [lobby, stage, table]?.filter(item => item !== "");

    // Chỉ viết hoa chữ cái đầu tiên của phần tử đầu tiên
    if (decoreArray.length > 0) {
        decoreArray[0] = decoreArray[0].charAt(0).toUpperCase() + decoreArray[0].slice(1);
    }

    return decoreArray.join(", ");
};

const getDecoreType = (decore) => {
    if (decore) {
        if (decore?.DecorePrice?.Type === 'BASIC') {
            return "(Cơ bản)"
        } else if (decore?.DecorePrice?.Type === 'ADVANCED') {
            return "(Nâng cao)"
        } else if (decore?.DecorePrice?.Type === 'PREMIUM') {
            return "(Cao cấp)"
        }
    }
}

export { getDecore, formatDate, formatDateTime, getDecoreType, getEventType, getRangeTime, getTime, }