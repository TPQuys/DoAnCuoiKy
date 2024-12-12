export const formatDate = (date) => {
    if (date) {
        // Lấy ngày, tháng và năm
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0 nên +1
        const year = date.getFullYear();

        // Định dạng thành dd/mm/yyyy
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate
    }
}

export const formatDateTime = (dateString) => {
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

export const getEventType = (type) => {
    if (type) {
        if (type === "WEDDING") {
            return "Đám cưới"
        } else if (type === "CONFERENCE") {
            return "Hội nghị"
        } else if (type === "BIRTHDAY") {
            return "Sinh nhật"
        } else if (type === "ORTHER") {
            return "Khác"
        }
    }
}

export const getDecoreType = (decore)=>{
    if(decore){
        if(decore?.DecorePrice?.Type==='BASIC'){
            return "(Cơ bản)"
        }else   if(decore?.DecorePrice?.Type==='ADVANCED'){
            return "(Nâng cao)"
        } else   if(decore?.DecorePrice?.Type==='PREMIUM'){
            return "(Cao cấp)"
        } 
    }
}

export const getTime = (time) => {
    if (time) {
        if (time === "MORNING") {
            return "Buổi sáng"
        }
        if (time === "AFTERNOON") {
            return "Buổi chiều"
        }
        if (time === "ALLDAY") {
            return "Cả ngày"
        }
    }
}

export const getRangeTime = (from,to)=>{
    const fromTime = new Date(from).toLocaleTimeString()
    const toTime = new Date(to).toLocaleTimeString()

    return fromTime+"-"+ toTime
}

export const getDecore = (Decore) => {
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

 
export const getMenuPrice = (menu) => {
    if (menu) {
        let totalMenuPrice = 0
        // Tính toán giá của menu
        const foodTotalPrice = menu?.Food.reduce((total, food) => {
            return total + (food.UnitPrice);
        }, 0);

        const drinksTotalPrice = menu?.Drinks.reduce((total, drink) => {
            return total + (drink.UnitPrice);
        }, 0);

        totalMenuPrice = foodTotalPrice + drinksTotalPrice;
        return totalMenuPrice
    }
    return 0;
}


export const rommPriceByEvent = (event, roomPrice) => {
    if (event?.Time === "ALLDAY") {
        return roomPrice * 2
    } else if (event?.Time === "CUSTOM") {
        const from = new Date(event.From)
        const to = new Date(event.To)
        const diff = (to - from) / (1000 * 60 * 60)
        return roomPrice * diff
    }
    else {
        return roomPrice
    }
}
export const getDecorePrice = (event, decore) => {
    if (decore) {
        let total = 0;
        if (decore?.LobbyDecore) {
            total += decore?.DecorePrice?.LobbyDecorePrice; // Sử dụng += để cộng dồn
        }
        if (decore?.StageDecore) {
            total += decore?.DecorePrice?.StageDecorePrice; // Sử dụng += để cộng dồn
        }
        if (decore?.TableDecore) {
            total += (decore?.DecorePrice?.TableDecorePrice) * event?.TotalTable; // Sử dụng += để cộng dồn
        }
        return total; // Trả về tổng giá trị
    }
};