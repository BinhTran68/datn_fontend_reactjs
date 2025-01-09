export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};




export const  baseUrl ="http://localhost:8080";


// Chuyển từ Long sang date
export   const convertLongTimestampToDate = (timestamp) => {
    if(timestamp ==  null) {
        return null;
    }
    const date = new Date(timestamp); // Convert từ Long sang Date
    console.log("date", date);
    return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} `;
};


export const  convertBillStatusToString = (status) => {
    if (status === null) {
        return  null;
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
