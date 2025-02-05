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
export const convertStatusVoucher = (statusVoucher)=>{
    // if(statusVoucher === null){
    //     return null;
    // }
    if(statusVoucher === "dang_kich_hoat"){
        return "Đang kích hoạt";
    }
    if(statusVoucher === "ngung_kich_hoat"){
        return "Ngừng kích hoạt";
    }
    if(statusVoucher === "chua_kich_hoat"){
        return "Chưa kích hoạt";
    }
}


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
    // Kiểm tra các tham số đầu vào có hợp lệ hay không
    if (!provinceId && !districtId && !wardId) {
        return "Địa chỉ không hợp lệ";  // Trả về thông báo nếu không có thông tin địa chỉ
    }

    let provinceName = "";
    let districtName = "";
    let wardName = "";

    // Gọi API chỉ khi provinceId có giá trị hợp lệ
    if (provinceId) {
        try {
            const provinceResponse = await axios.get(`https://provinces.open-api.vn/api/p/${provinceId}/?depth=2`);
            provinceName = provinceResponse.data.name || "";  // Nếu không có tên tỉnh, dùng chuỗi rỗng
        } catch (error) {
            provinceName = "";  // Nếu có lỗi, gán thông báo lỗi
        }
    }

    // Gọi API chỉ khi districtId có giá trị hợp lệ
    if (districtId) {
        try {
            const districtResponse = await axios.get(`https://provinces.open-api.vn/api/d/${districtId}/?depth=2`);
            districtName = districtResponse.data.name || "";  // Nếu không có tên huyện, dùng chuỗi rỗng
        } catch (error) {
            districtName = "";  // Nếu có lỗi, gán thông báo lỗi
        }
    }

    // Gọi API chỉ khi wardId có giá trị hợp lệ
    if (wardId) {
        try {
            const wardResponse = await axios.get(`https://provinces.open-api.vn/api/w/${wardId}/?depth=2`);
            wardName = wardResponse.data.name || "";  // Nếu không có tên xã/phường, dùng chuỗi rỗng
        } catch (error) {
            wardName = "";  // Nếu có lỗi, gán thông báo lỗi
        }
    }

    // Tạo chuỗi địa chỉ
    return `${specificAddressDefault ? (specificAddressDefault + `,`) : ""} ${wardName ? wardName + `,` : ""} ${districtName ? districtName + `,` : ""} ${provinceName ? provinceName + `,` : ""}`;
}


export function formatVND(number) {
    if (typeof number !== "number") {
        return '0 VND' // Kiểm tra nếu không phải là số
    }

    return number.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
}
