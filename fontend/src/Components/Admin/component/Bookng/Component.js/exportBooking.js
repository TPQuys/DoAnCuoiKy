import * as XLSX from "xlsx";
import {formatDate,formatDateTime,getDecore,getDecoreType,getEventType,getRangeTime,getTime} from './FormatFunction'
export const exportToExcel = (bookings) => {
    // Chuyển đổi dữ liệu booking thành định dạng cần thiết
    const data = bookings.map((booking) => ({
        "Thời gian đặt": new Date(booking.BookingTime).toLocaleString("vi-VN"),
        "Email": booking.User?.email || "N/A",
        "Loại sự kiện": getEventType(booking.Event?.EventType),
        "Tổng số bàn": booking.Event?.TotalTable || "N/A",
        "Ngày tổ chức": formatDate(new Date(booking.Event?.EventDate)),
        "Thời gian": booking.Event.Time !== "CUSTOM" 
            ? getTime(booking.Event?.Time) 
            : getRangeTime(booking.Event?.From, booking.Event?.To),
        "Ghi chú": booking.Event?.Note || "Không có",
        "Tên nhà hàng": booking.Event?.RoomEvent?.RoomName || "N/A",
        "Trang trí": `${getDecore(booking.Event?.Decore)} ${getDecoreType(booking.Event?.Decore)}`,
        "Menu": booking.Event?.Menu?.MenuID ? "Có" : "Không",
        "Trạng thái thanh toán": booking.Payment ? "Đã thanh toán" : "Chưa thanh toán"
    }));

    // Tạo một workbook mới
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    // Xuất file Excel
    XLSX.writeFile(workbook, "Bookings.xlsx");
};
