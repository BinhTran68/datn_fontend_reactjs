import axios from "axios";

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const baseUrl = "http://localhost:8080";


// Chuyển từ Long sang date
export const convertLongTimestampToDate = (timestamp) => {
    if (timestamp == null) {
        return null;
    }
    const date = new Date(timestamp); // Convert từ Long sang Date
    console.log("date", date);
    return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} `;
};


export const convertBillStatusToString = (status) => {
    if (status === null) {
        return null;
    }

    if (status === "CHO_XAC_NHAN") {
        return "Chờ xác nhận";
    }
    if (status === "DA_XAC_NHAN") {
        return "Đã xác nhận";
    }
    if (status === "CHO_VAN_CHUYEN") {
        return "Chờ vận chuyển";
    }

    if (status === "DANG_VAN_CHUYEN") {
        return "Đang vận chuyển";
    }

    if (status === "DA_THANH_TOAN") {
        return "Đã thanh toán";
    }
    if (status === "DA_HOAN_THANH") {
        return "Đã hoàn thành"
    }
    return "Khác";
}


export async function generateAddressString(provinceId, districtId, wardId, specificAddressDefault) {
    let provinceName = "";
    let districtName = "";
    let wardName = "";

    try {
        // Gọi API lấy thông tin tỉnh
        const provinceResponse = await axios.get(`https://provinces.open-api.vn/api/p/${provinceId}/?depth=2`);
        provinceName = provinceResponse.data.name || "";  // Nếu không có tên tỉnh, dùng chuỗi rỗng
    } catch (error) {
        console.error('Error fetching province:', error);
        provinceName = "Tỉnh không tìm thấy";  // Trường hợp có lỗi, cung cấp thông báo
    }

    try {
        // Gọi API lấy thông tin huyện
        const districtResponse = await axios.get(`https://provinces.open-api.vn/api/d/${districtId}/?depth=2`);
        districtName = districtResponse.data.name || "";  // Nếu không có tên huyện, dùng chuỗi rỗng
    } catch (error) {
        console.error('Error fetching district:', error);
        districtName = "Huyện không tìm thấy";  // Trường hợp có lỗi, cung cấp thông báo
    }

    try {
        // Gọi API lấy thông tin xã/phường
        const wardResponse = await axios.get(`https://provinces.open-api.vn/api/w/${wardId}/?depth=2`);
        wardName = wardResponse.data.name || "";  // Nếu không có tên xã/phường, dùng chuỗi rỗng
    } catch (error) {
        console.error('Error fetching ward:', error);
        wardName = "Xã/Phường không tìm thấy";  // Trường hợp có lỗi, cung cấp thông báo
    }

    // Tạo chuỗi địa chỉ
    const address = `${specificAddressDefault}, ${wardName}, ${districtName}, ${provinceName}`;

    return address;
}