import React, {useEffect, useMemo, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Badge, Button, Card, Collapse, Descriptions, Image, List, Modal, Steps, Table, Tag} from "antd";

import axios from "axios";
import {
    baseUrl,
    convertBillStatusToString, convertDate,
    convertLongTimestampToDate, formatVND,
    generateAddressString, paymentMethodConvert, paymentTypeConvert
} from "../../helpers/Helpers.js";
import StepProgress from "./componets/StepProgress.jsx";
import {FaFileCircleCheck} from "react-icons/fa6";

import {Input, InputNumber} from 'antd';
import ModalConfirmUpdateStatusBill from "./componets/ModalConfirmUpdateStatusBill.jsx";
import {GrDrag} from "react-icons/gr";
import {MdCancel, MdDelete} from "react-icons/md";
import {IoAdd} from "react-icons/io5";
import ModalEditBillInfo from "./componets/ModalEditBillInfo.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import ProductDetailModal from "../sales-page/component/ProductDetailModal.jsx";
import {toast} from "react-toastify";
import {CheckOutlined, EditFilled, ExclamationCircleFilled, SelectOutlined} from "@ant-design/icons";
import {Viewer} from "@react-pdf-viewer/core";

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/print/lib/styles/index.css';
import 'pdfjs-dist/build/pdf.worker.entry';
import {PrintIcon, printPlugin} from "@react-pdf-viewer/print";
import {columnsPaymentMethodTable} from "./columns/columnsPaymentMethodTable.jsx";
import {columnsBillHistory} from "./columns/columnsBillHistory.jsx";
import {FaCheckCircle, FaTicketAlt} from "react-icons/fa";
import {COLORS} from "../../constants/constants.js";
import voucher_image from "../../../public/img/voucher_image.png";
import {updateProductBill} from "./services/billDetailService.js";

const {Step} = Steps;

const BillDetail = () => {
        const {id} = useParams();

        const modalBillHistoryType = "modalBillHistoryType";
        const modalUpdateStatusBillType = "modalUpdateStatusBillType";
        const modalListProduct = "modalListProduct";
        const modalEditForm = "modalEditForm";
        const defaultURL = `${baseUrl}`;
        const [paymentBillHistory, setPaymentBillHistory] = useState([])
        const [billProductDetails, setBillProductDetails] = useState()
        const [billEditProductDetails, setBillEditProductDetails] = useState([])
        const [billProductList, setBillProductList] = useState()
        const [billHistory, setBillHistory] = useState([]);
        const [currentBill, setCurrentBill] = useState()
        const [confirmLoading, setConfirmLoading] = useState(false);
        const [open, setOpen] = useState(false);
        const [modalType, setModalType] = useState('');
        const [confirmNotes, setConfirmNotes] = useState('')
        const [widthModal, setWidthModal] = useState('50%')
        const [addressString, setAddressString] = useState('')
        const [products, setProducts] = useState([])
        const [inputQuantity, setInputQuantity] = useState(1);
        const [isRollbackAction, setIsRollbackAction] = useState(false);
        const [isCancelBill, setIsCancelBill] = useState(false);
        const [isEditingProduct, setIsEditingProduct] = useState(false);
        const [vouchers, setVouchers] = useState()
        const [selectedVouchers, setSelectedVouchers] = useState()
        const [discount, setDiscount] = useState(0);
        const [currentVoucher, setCurrentVoucher] = useState();


        useEffect(() => {
            getAllVoucher()
        }, [])

        const getAllVoucher = () => {
            axiosInstance.get(`${baseUrl}/api/admin/bill/vouchers`).then((res) => {
                setVouchers(res.data)
            })
        }

        const columnsBillProductDetailTable = [
            {
                title: 'STT',
                dataIndex: 'stt',
                key: 'stt',
                render: (text, record, index) => index + 1,
            },
            {
                title: "Ảnh sản phẩm",
                dataIndex: "urlImage",
                key: "urlImage",
                render: (urlImage, record) => {
                    if (record.urlImage) {
                        return (
                            <Image
                                src={record.urlImage}
                                alt="Sản phẩm"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                }}
                            />
                        );
                    }
                    if (record.image && record.image.length > 0) {
                        console.log("image oử sản phẩm", record.image[0])
                        return (
                            <div
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    backgroundColor: '#f5f5f5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '4px'
                                }}
                            >
                                <Image
                                    src={record.image[0].url}
                                    alt="Sản phẩm"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        );
                    }
                    return (
                        <div
                            style={{
                                width: '100px',
                                height: '100px',
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px'
                            }}
                        >
                            No image
                        </div>
                    );
                },
                onCell: () => ({
                    style: {
                        width: "80px",
                        height: "60px",
                        padding: "5px",
                    },
                }),
            },
            {
                title: 'Thông tin sản phẩm',
                dataIndex: 'productName',
                key: 'productName',
                // render: (text) => <a>{text}</a>,
            },
            {
                title: 'Màu sắc',
                dataIndex: 'color',
                key: 'color',
            },

            {
                title: 'Số lượng sản phẩm',
                dataIndex: 'quantity',
                key: 'quantity',
                render: (quantity, record) => (
                    <InputNumber
                        min={1}
                        disabled={!isEditingProduct}
                        type={"number"}
                        value={quantity}
                        style={{width: '60px', margin: '0 5px'}}
                        onChange={(value) => handleQuantityChange(record, value)}
                    />
                ),
            },
            {
                title: 'Thời gian',
                dataIndex: 'createdAt',
                key: 'createdAt ',
                render: (timestamp) => {
                    return convertLongTimestampToDate(timestamp)
                },
            },
            {
                title: 'Đơn giá',
                dataIndex: 'price',
                key: 'price',
                render: (price, record) => formatVND(price * record.quantity),
            },
            // Ẩn cột "Hành động" nếu không đang chỉnh sửa
            ...(isEditingProduct ? [{
                title: 'Hành động',
                dataIndex: 'action',
                key: 'action',
                render: (_, record) => (
                    <Button
                        type="primary"
                        onClick={() => {
                            if(billEditProductDetails.length === 1) {
                                toast.warning("Không thể xóa sản phẩm này");
                                return;
                            }
                            const newBillProductUpdate = billEditProductDetails.filter((p) => p.productDetailId !== record.productDetailId)
                            setBillEditProductDetails(newBillProductUpdate)
                        }}
                    >
                        Xóa
                    </Button>
                ),
            }] : []),
        ];

        useEffect(() => {
            checkAndApplyVoucher(currentVoucher)
        }, [billEditProductDetails])

        const handleOkModal = () => {
            if (modalType === modalBillHistoryType) {
                setOpen(false);
                return;
            }
            if (modalType === modalUpdateStatusBillType) {
                handleUpdateStatusBill();
                setOpen(false);
            }
        };

        const handleCancel = () => {
            console.log('Clicked cancel button');
            setOpen(false);
        };


        const handleUpdateStatusBill = async () => {
            try {
                let newStatus;

                console.log(modalType, "modalType")
                if (isCancelBill) {
                    newStatus = "DA_HUY"; // Trạng thái hủy đơn
                } else {
                    // Xác định status mới dựa vào nguồn gọi hàm
                    newStatus = isRollbackAction
                        ? handleRollBackStatusUpdate(currentBill.status)
                        : handleNewStatusUpdate(currentBill.status);
                }

                const data = {
                    status: newStatus,
                    note: confirmNotes // Ghi chú từ modal
                };

                const response = await axiosInstance.put(`/api/admin/bill/${id}/update`, data);
                const result = response.data.data;

                setCurrentBill(result.bill);
                setBillHistory(result.billHistory);

                toast.success(modalType === "modalConfirmCancelBill"
                    ? "Đơn hàng đã bị hủy thành công"
                    : (isRollbackAction
                        ? "Đã quay lại trạng thái trước đó"
                        : "Cập nhật trạng thái thành công")
                );
            } catch (error) {
                toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
            } finally {
                setIsCancelBill(false)
            }
        };

        const handlePrintBillPdf = async () => {
            const response = await axiosInstance.get(`/api/admin/bill/print-bill/${id}`);
            const result = response.data
            print(result)
        }

        const handleNewStatusUpdate = () => {
            // Kiểm tra xem đã thanh toán chưa
            const isAlreadyPaid = billHistory.some(h => h.status === "DA_THANH_TOAN");

            switch (currentBill.status) {
                case "TAO_DON_HANG":
                    return "CHO_XAC_NHAN";
                case "CHO_XAC_NHAN":
                    return "DA_XAC_NHAN";
                case "DA_XAC_NHAN":
                    return "CHO_VAN_CHUYEN";
                case "CHO_VAN_CHUYEN":
                    return "DANG_VAN_CHUYEN";
                case "DANG_VAN_CHUYEN":
                    // Nếu đã thanh toán trước, chuyển sang ĐÃ GIAO HÀNG
                    if (isAlreadyPaid) {
                        return "DA_GIAO_HANG";
                    }
                    // Nếu chưa thanh toán, chuyển thẳng sang ĐÃ THANH TOÁN
                    return "DA_THANH_TOAN";
                case "DA_GIAO_HANG":
                    return "DA_HOAN_THANH";
                case "DA_THANH_TOAN":
                    return "DA_HOAN_THANH";
                default:
                    return currentBill.status;
            }
        };


        const handleRollBackStatusUpdate = () => {
            // Kiểm tra xem đã thanh toán chưa
            const isAlreadyPaid = billHistory.some(h => h.status === "DA_THANH_TOAN");

            switch (currentBill?.status) {
                case "DA_HOAN_THANH":
                    // Nếu đã thanh toán trước, quay về ĐÃ GIAO HÀNG
                    if (isAlreadyPaid) {
                        return "DA_GIAO_HANG";
                    }
                    return "DA_THANH_TOAN";
                case "DA_GIAO_HANG":
                    return "DANG_VAN_CHUYEN";
                case "DA_THANH_TOAN":
                    return "DANG_VAN_CHUYEN";
                case "DANG_VAN_CHUYEN":
                    return "CHO_VAN_CHUYEN";
                case "CHO_VAN_CHUYEN":
                    return "DA_XAC_NHAN";
                case "DA_XAC_NHAN":
                    return "CHO_XAC_NHAN";
                case "CHO_XAC_NHAN":
                    return "TAO_DON_HANG";
                default:
                    return null;
            }
        };


        const getPaymentsBill = async () => {
            const response = await axiosInstance.get(`/api/admin/payment-bill?billCode=${id}`);
            setPaymentBillHistory(response.data.data)
        }

        const getBillHistory = async () => {
            const response = await axiosInstance.get(`/api/admin/bill-history?billCode=${id}`);
            const billHistoryResponse = response.data.data;
            setBillHistory(billHistoryResponse);
        }
        const getBillProductDetail = async () => {
            const response = await axiosInstance.get(`/api/admin/bill-product-detail/${id}`);
            const data = response.data.data;
            setBillProductDetails(data)
            setBillEditProductDetails(data);
        }

        const getCurrentBill = async () => {
            const response = await axiosInstance.get(`/api/admin/bill/detail/${id}`);
            const bill = response.data.data;
            setCurrentBill(bill);
            setCurrentVoucher(bill.voucherReponse)
            console.log(bill);

            if (bill?.address?.provinceId &&
                bill?.address?.districtId &&
                bill?.address?.wardId &&
                bill?.address?.specificAddress) {
                const address = await generateAddressString(
                    bill?.address?.provinceId,
                    bill?.address?.districtId,
                    bill?.address?.wardId,
                    bill?.address?.specificAddress
                );
                setAddressString(address);
            } else {
                setAddressString("Không có địa chỉ")
            }
        }

        useEffect(() => {
            getPaymentsBill();
            getCurrentBill();
            getBillHistory();
            getBillProductDetail();
        }, [id]);


        const steps1 = [
            {id: 9, label: "Đang xác minh", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DANG_XAC_MINH"},
            {id: 2, label: "Chờ xác nhận", time: "", icon: <FaFileCircleCheck size={34}/>, status: "CHO_XAC_NHAN"},
            {id: 3, label: "Đã xác nhận", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DA_XAC_NHAN"},
            {id: 4, label: "Chờ vận chuyển", time: "", icon: <FaFileCircleCheck size={34}/>, status: "CHO_VAN_CHUYEN"},
            {id: 5, label: "Đang vận chuyển", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DANG_VAN_CHUYEN"},
            {id: 6, label: "Đã giao hàng", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DA_GIAO_HANG"},
            {id: 7, label: "Đã thanh toán", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DA_THANH_TOAN"},
            {id: 8, label: "Hoàn thành", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DA_HOAN_THANH"},
            {id: 9, label: "Đã Hủy", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DA_HUY"},

        ];


        const handleButtonConfirm = (step) => {
            // Kiểm tra xem đã thanh toán chưa
            const isAlreadyPaid = billHistory.some(h => h.status === "DA_THANH_TOAN");
            switch (step) {
                case "CHO_XAC_NHAN":
                    return "Xác nhận";
                case "DA_XAC_NHAN":
                    return "Chuyển vận chuyển";
                case "CHO_VAN_CHUYEN":
                    return "Bắt đầu vận chuyển";
                case "DANG_VAN_CHUYEN":
                    return isAlreadyPaid ? "Xác nhận đã giao hàng" : "Xác nhận giao hàng và thanh toán";
                case "DA_GIAO_HANG":
                    return "Hoàn thành đơn";
                case "DA_THANH_TOAN":
                    return "Hoàn thành đơn";
                case "DANG_XAC_MINH":
                    return "Bỏ qua xác minh";
                default:
                    return "";
            }
        };


        const modalBillHistoryTable = () => {
            return (
                <div>
                    <div className={"mb-4"}>
                        <h3>Lịch sử hóa đơn</h3>
                    </div>
                    <Table
                        className={"w-100"}
                        pagination={false}
                        columns={columnsBillHistory}
                        dataSource={billHistory}
                    />
                </div>
            );
        }

        const handleOnChange = (e) => {
            setConfirmNotes(e.target.value)
        }


        const showModalBillHistory = () => {
            setOpen(true)
            setModalType(modalBillHistoryType)
            setWidthModal("75%")
        };


        const handleOnConfirmUpdateValue = () => {
            setIsRollbackAction(false); // Mark as a forward action
            setOpen(true);
            setWidthModal("40%");
            setConfirmNotes('');

            // Create the payload
            const payload = {
                products: billEditProductDetails, // Array of edited product details
                voucherId: selectedVouchers?.id, // ID of the selected voucher
                totalAmount, // Total amount calculated
                shippingFee, // Shipping fee
                discountValue, // Discount value
                finalAmount // Final amount after discount
            };

            console.log("Payload to be sent:", payload);
            // Here you can send the payload to your API
            // axiosInstance.post('/api/admin/bill/update', payload)
        };

        const handleOnShowProduct = () => {
            setWidthModal("75%")
            setOpen(true)
            getBillProducts();
            setModalType(modalListProduct)
        };

        const getBillProducts = async () => {
            const response = await axiosInstance.get(`/api/admin/bill-product-detail`);
            const data = response.data.data;
            setBillProductList(data.content)
        }

        const handleOnEditBill = (data) => {
            setOpen(false)
            setCurrentBill(data)
        }

        const showModalEditBillInfo = () => {
            setOpen(true)
            setWidthModal("50%")
            setModalType(modalEditForm)
        };


        const items = [
            {
                key: '1',
                label: 'Tổng tiền hàng',
                children: (
                    <div style={{
                        color: "blue"
                    }}>
                        {formatVND(currentBill?.moneyBeforeDiscount)}
                    </div>
                ),

            },
            {
                key: '2',
                label: 'Phí vận chuyển',
                children: formatVND(currentBill?.shipMoney),
            },
            {
                key: '3',
                label: 'Voucher áp dụng',
                children: currentBill?.voucherReponse?.voucherName,
            },
            {
                key: '3',
                label: 'Số tiền được giảm',
                children: formatVND(currentBill?.discountMoney),
            },
            {
                key: '4',
                label: 'Tổng tiền thanh toán',
                span: 2,
                children: <div style={{
                    color: "blue"
                }}>
                    {formatVND(currentBill?.totalMoney)}
                </div>,
            },

        ];
        const handleOnRollbackStatus = () => {
            if (!billHistory.length || currentBill?.status === "TAO_DON_HANG") {
                toast.error("Không thể quay lại trạng thái trước đó");
                return;
            }
            setIsRollbackAction(true); // Đánh dấu là hành động lùi lại
            setOpen(true);
            setWidthModal("40%");
            setConfirmNotes('');
            setModalType(modalUpdateStatusBillType);
        };

        const handleOnAddProductToBill = (product) => {
            let existingProductIndex = billEditProductDetails.findIndex(item => item.productDetailId === product.id);
            // Gọi api check số lượng đủ không
            //
            if (existingProductIndex !== -1) {
                const updatedProducts = [...billEditProductDetails];
                updatedProducts[existingProductIndex].quantity += inputQuantity; // Increase quantity
                setBillEditProductDetails(updatedProducts);
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới
                const newProduct = {
                    ...product,
                    productDetailId: product.id,
                    quantity: inputQuantity
                };
                setBillEditProductDetails([...billEditProductDetails, newProduct]);
            }

            // const updatedProductsArray = products.map(item => {
            //     if (item.id === product.id) {
            //         return { ...item, quantity: item.quantity - inputQuantity }; // Decrease quantity
            //     }
            //     return item; // Keep other products unchanged
            // });
            // setProducts(updatedProductsArray); // Update the products state
            setInputQuantity(1); // Reset input quantity
        };

        const calculateTotals = () => {
            const totalAmount = billEditProductDetails.reduce((total, product) => total + (product.price * product.quantity), 0);
            const shippingFee = currentBill?.shipMoney || 0; // Assuming shipMoney is part of currentBill
            const discountValue = discount || 0; // Assuming discountMoney is part of currentBill
            const finalAmount = totalAmount + shippingFee - discount;

            return {
                totalAmount,
                shippingFee,
                discountValue,
                finalAmount
            };
        };


        const handleCancelBill = () => {
            setOpen(true);
            setWidthModal("40%");
            setModalType(modalUpdateStatusBillType);
            setIsCancelBill(true)
            setConfirmNotes('');
        };


        const [pdfUrl, setPdfUrl] = useState(null);
        const [isShowPdfOk, setIsShowPdfOk] = useState(true)
        const [isDocumentLoaded, setIsDocumentLoaded] = useState(false)
        const printPluginInstance = printPlugin();
        const {print} = printPluginInstance;


        useEffect(() => {
            if (pdfUrl && isDocumentLoaded) {
                print()
                setIsShowPdfOk(true)
            }
        }, [pdfUrl, isDocumentLoaded]);

        const handleOnPrintBill = async () => {
            setIsShowPdfOk(false)
            try {
                // Lấy dữ liệu PDF từ API với responseType là 'blob'
                const response = await axios.get(`http://localhost:8080/api/admin/bill/print-bill/${id}`, {
                    responseType: 'blob'
                });
                // Tạo URL cho blob
                const blob = new Blob([response.data], {type: 'application/pdf'});
                const blobUrl = URL.createObjectURL(blob);
                setPdfUrl(blobUrl)
                setIsDocumentLoaded(false)
            } catch (error) {
                console.error("Lỗi tải PDF:", error);
            }
        };

        const handleQuantityChange = (record, newQuantity) => {
            if (newQuantity < 1) return;

            const updatedProducts = billEditProductDetails.map(item => {
                if (item.productDetailId === record.productDetailId) {
                    return {...item, quantity: newQuantity}; // Chỉ cập nhật sản phẩm cụ thể
                }
                return item; // Giữ nguyên các sản phẩm khác
            });
            setBillEditProductDetails(updatedProducts);

            // Kiểm tra và áp dụng voucher
            if (newQuantity > record.quantity) {
                // Tăng số lượng, không xóa voucher
                checkAndApplyVoucher(selectedVouchers);
            } else {
                // Giảm số lượng, kiểm tra điều kiện voucher
                if (currentVoucher) {
                    const totalAmount = updatedProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
                    const isCurrentVoucherApplicable = totalAmount >= (currentVoucher?.billMinValue || 0);
                    if (!isCurrentVoucherApplicable) {
                        setSelectedVouchers(null); // Không áp dụng voucher
                        setDiscount(0); // Reset discount
                    } else {
                        checkAndApplyVoucher(currentVoucher); // Áp dụng lại voucher nếu còn đủ điều kiện
                    }
                }
            }
        };

    const checkAndApplyVoucher = (voucher) => {

        const totalAmount = billEditProductDetails.reduce(
            (total, product) => total + (product.price * product.quantity), 0
        );
        console.log(billEditProductDetails)

        const isVoucherApplicable = totalAmount >= (voucher?.billMinValue || 0);

        if (isVoucherApplicable) {
            console.log("isVoucherApplicable ", isVoucherApplicable)
            setSelectedVouchers(voucher);

            let discountValue = voucher?.discountType === "MONEY"
                ? voucher?.discountValue
                : (totalAmount * voucher?.discountValue) / 100;

            if (voucher?.discountMaxValue && discountValue > voucher?.discountMaxValue) {
                discountValue = voucher?.discountMaxValue;
            }

            // Đảm bảo giảm giá không lớn hơn tổng tiền
            discountValue = Math.min(discountValue, totalAmount);

            setDiscount(discountValue);
        } else {
            console.log("!isVoucherApplicable ", isVoucherApplicable)
            if (currentVoucher && totalAmount >= (currentVoucher?.billMinValue || 0)) {
                setSelectedVouchers(currentVoucher);

                let previousDiscountValue = currentVoucher?.discountType === "MONEY"
                    ? currentVoucher.discountValue
                    : (totalAmount * currentVoucher.discountValue) / 100;

                if (currentVoucher.discountMaxValue && previousDiscountValue > currentVoucher.discountMaxValue) {
                    previousDiscountValue = currentVoucher.discountMaxValue;
                }

                // Đảm bảo giảm giá không lớn hơn tổng tiền
                previousDiscountValue = Math.min(previousDiscountValue, totalAmount);

                setDiscount(previousDiscountValue);
            } else {
                console.log("!isVoucherApplicable ", isVoucherApplicable)
                setSelectedVouchers(null);
                setDiscount(0);
            }
        }
    };


    // Function to handle voucher selection
        const handleOnSelectedVoucher = (voucher) => {
            setCurrentVoucher(voucher); // Save the selected voucher as currentVoucher
            checkAndApplyVoucher(voucher);
        };

        const {totalAmount, shippingFee, discountValue, finalAmount} = calculateTotals();
        const handleSaveNewUpdateProduct = async () => {
            const payload = {
                moneyBeforeDiscount: totalAmount,
                shipMoney: shippingFee,
                discountMoney: discount,
                totalMoney: finalAmount, // Tiền sau giảm giá
                productDetailRequestList: billEditProductDetails,
                voucherCode : selectedVouchers?.voucherCode
            };
            try {
                const response = await updateProductBill(id, payload)
                getCurrentBill();
                getBillHistory();
                getBillProductDetail();
                setIsEditingProduct(false);
                toast.success("Cập nhật sản phẩm thành công")
            } catch (e) {
                console.log(e)
                toast.error("Cập nhật sản phẩm không thành công")
            }
        }

        return (
            <div className={"flex-column d-flex gap-3"}>
                {pdfUrl ?
                    <div hidden={isShowPdfOk}>
                        <Viewer fileUrl={pdfUrl} plugins={[printPluginInstance]}
                                onDocumentLoad={() => setIsDocumentLoaded(true)} // Khi tài liệu load xong
                        />
                    </div>
                    : <p></p>}

                <Modal
                    width={widthModal}
                    open={open}
                    onOk={handleOkModal}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                >
                    {modalType === modalBillHistoryType && modalBillHistoryTable()}
                    {modalType === modalListProduct && <ProductDetailModal
                        products={products}
                        handleOnAddProductToBill={handleOnAddProductToBill}
                        setProducts={setProducts}
                    />}
                    {modalType === modalUpdateStatusBillType && (
                        <ModalConfirmUpdateStatusBill
                            notesUpdateStatusBillInput={confirmNotes}
                            onChangeNotesUpdateStatusBillInput={handleOnChange}
                        />
                    )}

                    {modalType === modalEditForm && (
                        <ModalEditBillInfo
                            currentBill={currentBill}
                            handleOnEdit={handleOnEditBill}
                        />
                    )}
                    {modalType === "modalConfirmCancelBill" && modalConfirmCancelBill()}
                </Modal>
                <Card className={"mb-2"}>
                    <div>
                        <StepProgress steps={steps1}
                                      billHistoryList={billHistory}
                                      currentStep={billHistory.length}/>


                    </div>
                    <div className={"d-flex align-items-center justify-content-between"}>
                        <div className={"d-flex align-items-center gap-5"}>
                            {!["DANG_XAC_MINH", "DA_HUY", "DA_HOAN_THANH", "TRA_HANG", "HUY_YEU_CAU_TRA_HANG", "TU_CHOI_TRA_HANG"].includes(currentBill?.status) && (
                                <Button type={"primary"} onClick={handleOnConfirmUpdateValue}>
                                    {handleButtonConfirm(currentBill?.status)}
                                </Button>
                            )}
                            {!["CHO_XAC_NHAN", "DANG_XAC_MINH", "TAO_DON_HANG", "DA_HUY", "DA_HOAN_THANH", "TRA_HANG", "HUY_YEU_CAU_TRA_HANG", "TU_CHOI_TRA_HANG"].includes(currentBill?.status) && (
                                <Button onClick={handleOnRollbackStatus} color={"danger"} type={""}>
                                    Quay lại
                                </Button>
                            )}

                            {["CHO_XAC_NHAN"].includes(currentBill?.status) && (
                                <Button onClick={handleCancelBill} type="default">
                                    Hủy đơn
                                </Button>
                            )}

                        </div>
                        <div className={"d-flex gap-2"}>
                            {currentBill?.status !== "CHO_XAC_NHAN" && (
                                <Button
                                    type={"primary"}
                                    onClick={handleOnPrintBill}
                                    primary
                                    icon={<PrintIcon/>}
                                >
                                    In hóa đơn
                                </Button>
                            )}

                            <Button type={"primary"} onClick={showModalBillHistory}>
                                Lịch sử hóa đơn
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className={"mb-4"}>
                        <h3>Lịch sử thanh toán</h3>
                    </div>
                    <Table
                        className={"w-100"}
                        pagination={false}
                        columns={columnsPaymentMethodTable}
                        dataSource={paymentBillHistory}
                    />
                </Card>
                <Card>
                    <div className={"d-flex justify-content-between"}>
                        <h3 className={"mb-4"}>Thông tin đơn hàng</h3>
                        {currentBill?.status === "CHO_XAC_NHAN" && (
                            <Button type={"primary"} onClick={showModalEditBillInfo}>
                                Chỉnh sửa thông tin đơn hàng
                            </Button>
                        )}
                    </div>
                    <Descriptions column={2}>
                        <Descriptions.Item label={<span className={"fw-bold text-black"}>Mã đơn hàng  </span>} span={2}>
                            {currentBill?.billCode ?? ""}
                        </Descriptions.Item>
                        <Descriptions.Item label={<span className={"fw-bold text-black"}>Trạng thái  </span>}>
                            <Tag style={{fontSize: 16}} color="blue">
                                {convertBillStatusToString(currentBill?.status ?? "")}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label={<span className={"fw-bold text-black"}>Tên khách hàng  </span>}>
                            <Tag style={{fontSize: 16}}
                                 color="blue">  {currentBill?.customerName ? currentBill.customerName : "Khách lẻ"}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label={<span className={"fw-bold text-black"}>Loại  </span>}>
                            <Tag style={{fontSize: 16}} color="purple">
                                {currentBill?.billType ?? ""}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label={<span className={"fw-bold text-black"}>Số điện thoại  </span>}>
                            <Tag style={{fontSize: 16}}
                                 color="blue">  {currentBill?.customerPhone ? currentBill.customerPhone : "Khách lẻ"}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label={<span className={"fw-bold text-black"}>Email</span>} span={2}>
                            {currentBill?.email}
                        </Descriptions.Item>
                        <Descriptions.Item label={<span className={"fw-bold text-black"}>Địa chỉ  </span>} span={2}>
                            {addressString}
                        </Descriptions.Item>
                        <Descriptions.Item label={<span className={"fw-bold text-black"}>Ghi chú  </span>} span={2}>
                            {currentBill?.notes ?? ""}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card>
                    <div className={"d-flex justify-content-between mb-3"}>
                        <h3>Thông tin sản phẩm đã mua</h3>
                        <div className={"d-flex gap-3"}>
                            {
                                ["CHO_XAC_NHAN", "CHO_XAC_MINH"].includes(currentBill?.status) &&  !isEditingProduct &&
                                <Button
                                    type={"primary"}
                                    onClick={() => setIsEditingProduct(true)}
                                    primary
                                    icon={<EditFilled/>}
                                >
                                    Chỉnh sửa sản phẩm trong đơn hàng
                                </Button>
                            }
                            {isEditingProduct && (
                                <Button
                                    type={"default"}
                                    onClick={() => setIsEditingProduct(false)}
                                    primary
                                    icon={<MdCancel/>}
                                >
                                    Hủy
                                </Button>
                            )}
                            {isEditingProduct && currentBill?.status === "CHO_XAC_NHAN" && (
                                <Button
                                    type={"primary"}
                                    onClick={handleOnShowProduct}
                                    primary
                                    icon={<IoAdd/>}
                                >
                                    Thêm sản phẩm
                                </Button>
                            )}

                            {/*{isEditingProduct && currentBill?.status === "CHO_XAC_NHAN" && (*/}
                            {/*    <Button*/}
                            {/*        type={"primary"}*/}
                            {/*        onClick={handleOnShowProduct}*/}
                            {/*        primary*/}
                            {/*        icon={<SelectOutlined/>}*/}
                            {/*    >*/}
                            {/*        Chọn Voucher*/}
                            {/*    </Button>*/}
                            {/*)}*/}
                        </div>
                    </div>
                    <Table
                        className={"w-100"}
                        pagination={false}
                        columns={columnsBillProductDetailTable}
                        dataSource={isEditingProduct ? billEditProductDetails : billProductDetails}
                    />
                    <hr/>
                    {
                        isEditingProduct && <div className={"row"}>
                            <div className={"py-2 col-md-6"}>

                            </div>
                            <div className={"py-2 col-md-6"}>
                                <Collapse
                                    expandIconPosition={"end"}
                                    defaultActiveKey={['1', '2']}
                                    items={[{
                                        key: '1',
                                        label: (
                                            <div className={"d-flex justify-content-between align-items-center"}>
                                                <span className={"d-flex gap-3 align-items-center"}><FaTicketAlt/> Phiếu giảm giá</span>
                                                <span className={"bold"}>Chọn hoặc nhập mã giảm giá </span>
                                            </div>
                                        ),
                                        children: (
                                            <>
                                                {selectedVouchers && (
                                                    <div
                                                        style={{
                                                            padding: '10px',
                                                            marginBottom: '10px',
                                                            backgroundColor: '#f6ffed',
                                                            border: '1px solid #b7eb8f',
                                                            borderRadius: '4px',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '8px'
                                                        }}
                                                    >
                                                        {
                                                            discount > 0 &&
                                                            <div className="d-flex align-items-center gap-2">
                                                                <FaCheckCircle color={COLORS.success}/>
                                                                <div>
                                                                    <div style={{fontWeight: 'bold'}}>
                                                                        Đã áp dụng voucher tốt nhất:
                                                                    </div>
                                                                    <div>
                                                                        {selectedVouchers?.voucherName} - Giảm {' '}
                                                                        {formatVND(discount)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }

                                                        {selectedVouchers?.suggestions && selectedVouchers?.suggestions.length > 0 && (
                                                            <div
                                                                style={{
                                                                    marginTop: '8px',
                                                                    padding: '8px',
                                                                    backgroundColor: '#fff1f0',
                                                                    border: '1px solid #ffccc7',
                                                                    borderRadius: '4px'
                                                                }}
                                                            >
                                                                <div style={{fontWeight: 'bold', marginBottom: '4px'}}>
                                                                    Gợi ý tối ưu voucher:
                                                                </div>
                                                                {selectedVouchers?.suggestions.map((suggestion, index) => (
                                                                    <div key={index}
                                                                         style={{
                                                                             fontSize: '13px',
                                                                             marginBottom: '4px'
                                                                         }}>
                                                                        Mua thêm {formatVND(suggestion.amountNeeded)} để
                                                                        dùng voucher{' '}
                                                                        <strong>{suggestion.voucherName}</strong> và
                                                                        tiết
                                                                        kiệm thêm{' '}
                                                                        <strong
                                                                            style={{color: '#ff4d4f'}}>{formatVND(suggestion.additionalBenefit)}</strong>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className={""}>

                                                    <div className={"x"} style={{}}>
                                                        <List
                                                            itemLayout="horizontal"
                                                            dataSource={vouchers}
                                                            renderItem={(item, index) => {
                                                                const originalTotal = totalAmount + shippingFee; // Total amount including shipping
                                                                const isVoucherApplicable = originalTotal >= (item.billMinValue || 0); // Check if the voucher can be applied

                                                                return (
                                                                    <List.Item
                                                                        actions={[
                                                                            (selectedVouchers?.id === item.id ?
                                                                                    <FaCheckCircle size={25}
                                                                                                   color={`${COLORS.success}`}/>
                                                                                    :
                                                                                    <Button
                                                                                        type={"primary"}
                                                                                        onClick={() => isVoucherApplicable ? handleOnSelectedVoucher(item) : null}
                                                                                        disabled={!isVoucherApplicable} // Disable if not applicable
                                                                                    >
                                                                                        Chọn
                                                                                    </Button>
                                                                            )
                                                                        ]}
                                                                    >
                                                                        <List.Item.Meta
                                                                            avatar={<img width={55} src={voucher_image}
                                                                                         alt={"img voucher"}/>}
                                                                            title={<a
                                                                                href="https://ant.design">{item?.voucherName}</a>}
                                                                            description={
                                                                                <div>
                                                                                    <div>Số lượng
                                                                                        : {item?.quantity ?? 0}</div>
                                                                                    <div>Ngày hết hạn
                                                                                        : {convertDate(item.endDate)}</div>
                                                                                    <div>Giá trị giảm
                                                                                        : {item?.discountType === "MONEY"
                                                                                            ? formatVND(item.discountValue)
                                                                                            : `${item.discountValue}% (tối đa ${formatVND(item.discountMaxValue)})`
                                                                                        }</div>
                                                                                    <div>Giá trị đơn hàng tối
                                                                                        thiểu: {formatVND(item?.billMinValue || 0)}</div>
                                                                                    <div>Giảm tối
                                                                                        đa: {item?.discountMaxValue && item.discountType === "PERCENT"
                                                                                            ? formatVND(item.discountMaxValue)
                                                                                            : 'Không giới hạn'
                                                                                        }</div>
                                                                                    <div>Loại
                                                                                        voucher: {item?.voucherType === "PUBLIC" ? "Công khai" : "Riêng tư"}</div>
                                                                                </div>
                                                                            }
                                                                        />
                                                                    </List.Item>
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }]}
                                />
                            </div>
                        </div>

                    }
                    {
                        isEditingProduct && (
                            <div className={"row"}>
                                <div className={"col-md-6"}>

                                </div>
                                <div className={"col-md-6"}>
                                    <div>Tổng tiền hàng dự kiến: {formatVND(totalAmount)}</div>
                                    <div>Phí ship dự kiến: {formatVND(shippingFee)}</div>
                                    <div>Số tiền được giảm dự kiến: {discount ? formatVND(discount) : 0}</div>
                                    <div>Số tiền cần thanh toán dự
                                        kiến: {formatVND(totalAmount + shippingFee - (discount ? discount : 0))}</div>

                                    <hr/>
                                    {
                                        isEditingProduct && <div className={"d-flex justify-content-end"}>
                                            <Button
                                                type={"primary"}
                                                onClick={handleSaveNewUpdateProduct}
                                                primary
                                                icon={<CheckOutlined/>}
                                            >
                                                Lưu
                                            </Button>
                                        </div>
                                    }
                                </div>

                            </div>
                        )
                    }
                    {isEditingProduct && <div className={"py-2"}>
                        <hr/>
                    </div>}

                    <div className={"row"}>
                        <div className={"col-md-8"}>
                        </div>
                        <div className={"col-md-4"}>
                            <Descriptions
                                column={1}
                                labelStyle={{
                                    color: "black",
                                    fontWeight: "bold"
                                }}
                                contentStyle={{justifyContent: "end", fontWeight: "bold"}}
                                layout="horizontal" items={items}>
                            </Descriptions>

                        </div>
                    </div>
                </Card>
            </div>


        );
    }
;

export default BillDetail;
