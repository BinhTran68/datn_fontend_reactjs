import axios from "axios";

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const baseUrl = "http://localhost:8080";

export function convertDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = String(date.getFullYear()).slice(-2); // Lấy 2 số cuối của năm

    return `${day}-${month}-${year}`;
}




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



// Helper function to get GHN shipping fee
const getGHNShippingFee = async ({ fromDistrictId, toDistrictId, weight }) => {
    try {
        const response = await axios.post(
            'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
            {
                service_type_id: 2, // Chuyển phát tiêu chuẩn
                    from_district_id: fromDistrictId,
                    to_district_id: toDistrictId,
                weight: weight,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Token: process.env.VITE_GHN_API_KEY, // Lấy API Key từ .env
                },
            }
        );

        return response.data.data.total; // Trả về số tiền vận chuyển
    } catch (error) {
        console.error('Error fetching GHN shipping fee:', error);
        throw error;
    }
};

export default getGHNShippingFee; // Xuất hàm để sử dụng ở component khác

const GHN_API_URL = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee';
const SERVICE_TYPE_ID = 5; // Loại dịch vụ: Giao hàng tiêu chuẩn

export const calculateShippingFee = async ({
                                               token,
                                               shopId,
                                               fromDistrictId,
                                               fromWardCode,
                                               toDistrictId,
                                               toWardCode,
                                               length = 30,
                                               width = 40,
                                               height = 20,
                                               weight = 3000,
                                               insuranceValue = 0,
                                               coupon = null,
                                               items = []
                                           }) => {
    try {
        const response = await axios.post(GHN_API_URL, {
            service_type_id: SERVICE_TYPE_ID,
            from_district_id: fromDistrictId,
            from_ward_code: fromWardCode,
            to_district_id: toDistrictId,
            to_ward_code: toWardCode,
            length,
            width,
            height,
            weight,
            insurance_value: insuranceValue,
            coupon,
            items
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Token': token,
                'ShopId': shopId
            }
        });

        return response.data.data.total;
    } catch (error) {
        console.error('Error calculating shipping fee:', error.response?.data || error.message);
        throw new Error('Failed to calculate shipping fee');
    }
};