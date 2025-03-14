import React, {useEffect, useState} from "react";
import {Image} from "antd";
import {genQrUrl} from "../../../utils/payment.js";
import axios from "axios";
import {toast} from "react-toastify";
import {formatVND} from "../../../helpers/Helpers.js";

const PaymentQrComponent = ({amount, currentBill, transactionCode, handleBankCustomerMoneyChange}) => {
    console.log("PaymentQrComponent:", amount, currentBill, transactionCode);

    const tokenSePay = import.meta.env.VITE_SE_PAY_API_KEY;
    const [qrUrl, setQrUrl] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Generate QR Code khi `amount` hoặc `currentBill` thay đổi
    useEffect(() => {
        if (amount > 0 && currentBill) {
            generateNewQr();
        }
    }, [amount, currentBill]);

    // Hàm tạo mã QR
    const generateNewQr = () => {
        const url = genQrUrl(amount, currentBill);
        if (url) {
            setQrUrl(url);
            if (!transactionCode) {
                setPaymentSuccess(false); // Reset trạng thái thanh toán khi tạo QR mới
            }
            setTimeout(() => setQrUrl(""), 300000); // Xóa QR sau 5 phút
        } else {
            setQrUrl("");
        }
    };

    // Bắt đầu kiểm tra giao dịch sau khi tạo QR, dừng khi `paymentSuccess = true`
    useEffect(() => {
        if (!paymentSuccess) {
            const intervalId = setInterval(() => {
                console.log("Checking transactions...");
                fetchTransactions();
            }, 5000);

            return () => clearInterval(intervalId); // Cleanup interval khi component unmount hoặc paymentSuccess thay đổi
        }
    }, [paymentSuccess]);

    // Hàm lấy danh sách giao dịch
    const fetchTransactions = async () => {
        console.log("Fetching transactions...");
        try {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const formatDate = (date) => date.toISOString().split("T")[0];

            console.log("Goọi api")
            // const response = await axios.get("/userapi/transactions/list", {
            //     params: {
            //         transaction_date_min: formatDate(today),
            //         transaction_date_max: formatDate(tomorrow),
            //     },
            //     headers: {
            //         Authorization: `Bearer ${tokenSePay}`,
            //     },
            // });



            // Kiểm tra xem giao dịch có khớp với `currentBill` không
            const billTransaction = "oke"; // Cần thay bằng logic thực tế
            if (billTransaction) {
                handleBankCustomerMoneyChange(35000, "transactionCode");
                setPaymentSuccess(true); // Đánh dấu thanh toán thành công
                toast.success(`Đơn hàng ${currentBill} thanh toán ${formatVND(35000)}.`);
            }
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu  giao dịch", err);
        }
    };

    return qrUrl ? <Image width={150} height={150} src={qrUrl} alt="QR Code"/> : null;
};

export default PaymentQrComponent;

