import React, {useEffect, useMemo, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Badge, Button, Card, Descriptions, Image, Modal, Steps, Table, Tag} from "antd";

import axios from "axios";
import {
    baseUrl,
    convertBillStatusToString,
    convertLongTimestampToDate, formatVND,
    generateAddressString, paymentMethodConvert, paymentTypeConvert
} from "../../helpers/Helpers.js";
import {FiEye} from "react-icons/fi";
import {FaClipboardCheck} from "react-icons/fa";
import StepProgress from "./componets/StepProgress.jsx";
import {FaFileCircleCheck} from "react-icons/fa6";

import {Input, InputNumber} from 'antd';
import TextArea from "antd/es/input/TextArea.js";
import ModalConfirmUpdateStatusBill from "./componets/ModalConfirmUpdateStatusBill.jsx";
import {GrDrag} from "react-icons/gr";
import {MdDelete} from "react-icons/md";
import {IoAdd} from "react-icons/io5";
import ModalBillProductList from "./componets/ModalBillProductList.jsx";
import ModalEditBillInfo from "./componets/ModalEditBillInfo.jsx";
import BillStatusComponent from "./componets/BillTypeComponent.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import ProductDetailModal from "../sales-page/component/ProductDetailModal.jsx";
import {toast} from "react-toastify";
import {ExclamationCircleFilled} from "@ant-design/icons";


const {Step} = Steps;


const columnsPaymentMethodTable = [
    {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'Mã giao dịch',
        dataIndex: 'transactionCode',
        key: 'transactionCode',
        render: (record) => <span>{record ? record : "Không"}</span>,
    },
    {
        title: 'Loại giao dịch',
        dataIndex: 'paymentMethodsType',
        key: 'paymentMethodsType',
        render: (text) => <Tag style={{
            fontSize: 16
        }} color={"purple"}>{paymentTypeConvert[text]}</Tag>,
    },
    {
        title: 'Phương thức thanh toán',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
        render: (text) => <Tag style={{
            fontSize: 16
        }} color={"blue"}>{paymentMethodConvert[text]}</Tag>,

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
        title: 'Tổng tiền',
        dataIndex: 'totalMoney',
        key: 'totalMoney',
        render: (text) => (
            <div>
                {formatVND(text)}
            </div>
        )
    },


    {
        title: 'Ghi chú',
        dataIndex: 'notes',
        key: 'notes',
    },

];


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
        render: (images) => {
            if (images) {
                return (
                    <Image
                        src={images}
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
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
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
    },

    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
            <Button
                type="primary"
                onClick={() => {
                    console.log(record?.productName);
                }}
            >
                Xóa
            </Button>
        ),

    },

];

const columnsBillHistory = [
    {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (record) => <div>
            <Tag style={{
                fontSize: 16
            }} color={"purple"}>{convertBillStatusToString(record)}</Tag>
        </div>,
        key: 'status',
    },
    {
        title: 'Người xác nhận',
        dataIndex: 'createdBy',
        key: 'createdBy',
    },
    {
        title: 'Ghi chú',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (timestamp) => {
            return convertLongTimestampToDate(Number(timestamp));
        },
    },


];


const BillDetail = () => {
        const {id} = useParams();

        const modalBillHistoryType = "modalBillHistoryType";
        const modalUpdateStatusBillType = "modalUpdateStatusBillType";
        const modalListProduct = "modalListProduct";
        const modalEditForm = "modalEditForm";
        const defaultURL = `${baseUrl}`;
        const [paymentBillHistory, setPaymentBillHistory] = useState([])
        const [billProductDetails, setBillProductDetails] = useState()
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
        const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);
        const [selectedProduct, setSelectedProduct] = useState(null);
        const [inputQuantity, setInputQuantity] = useState(1);
        const [isRollbackAction, setIsRollbackAction] = useState(false);


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
                // Xác định status mới dựa vào nguồn gọi hàm
                const newStatus = isRollbackAction 
                    ? handleRollBackStatusUpdate(currentBill.status)
                    : handleNewStatusUpdate(currentBill.status);

                const data = {
                    status: newStatus,
                    note: confirmNotes
                };

                const response = await axiosInstance.put(`/api/admin/bill/${id}/update`, data);
                const result = response.data.data;
                
                setCurrentBill(result.bill);
                setBillHistory(result.billHistory);

                if (result.bill.status === "DANG_VAN_CHUYEN") {
                    handlePrintBillPdf();
                }

                toast.success(isRollbackAction 
                    ? "Đã quay lại trạng thái trước đó"
                    : "Cập nhật trạng thái thành công"
                );
            } catch (error) {
                toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
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

            switch(currentBill.status) {
                case "TAO_DON_HANG":
                    return "CHO_XAC_NHAN";
                case "CHO_XAC_NHAN":
                    return "DA_XAC_NHAN";
                case "DA_XAC_NHAN":
                    return "CHO_VAN_CHUYEN";
                case "CHO_VAN_CHUYEN":
                    return "DANG_VAN_CHUYEN";
                case "DANG_VAN_CHUYEN":
                    return "DA_GIAO_HANG";
                case "DA_GIAO_HANG":
                    // Nếu đã thanh toán trước thì chuyển thẳng sang DA_HOAN_THANH
                    if (isAlreadyPaid) {
                        return "DA_HOAN_THANH";
                    }
                    return "CHO_THANH_TOAN";
                case "CHO_THANH_TOAN":
                    return "DA_THANH_TOAN";
                case "DA_THANH_TOAN":
                    return "DA_HOAN_THANH";
                default:
                    return currentBill.status;
            }
        };


        const handleRollBackStatusUpdate = () => {
            switch(currentBill.status) {
                case "DA_HOAN_THANH":
                    return "DA_THANH_TOAN";
                case "DA_THANH_TOAN":
                    return "DA_GIAO_HANG";
                case "DA_GIAO_HANG":
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
        }

        const getCurrentBill = async () => {
            const response = await axiosInstance.get(`/api/admin/bill/detail/${id}`);
            const bill = response.data.data;
            setCurrentBill(bill);
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
            {id: 1, label: "Tạo đơn hàng", time: "", icon: <FaFileCircleCheck size={34}/>, status: "TAO_DON_HANG"},
            {id: 2, label: "Chờ xác nhận", time: "", icon: <FaFileCircleCheck size={34}/>, status: "CHO_XAC_NHAN"},
            {id: 3, label: "Đã xác nhận", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DA_XAC_NHAN"},
            {id: 4, label: "Chờ vận chuyển", time: "", icon: <FaFileCircleCheck size={34}/>, status: "CHO_VAN_CHUYEN"},
            {id: 5, label: "Đang vận chuyển", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DANG_VAN_CHUYEN"},
            {id: 6, label: "Đã giao hàng", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DA_GIAO_HANG"},
            {id: 7, label: "Hoàn thành", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DA_HOAN_THANH"},
        ];


        const handleButtonConfirm = (step) => {
            const isAlreadyPaid = billHistory.some(h => h.status === "DA_THANH_TOAN");

            switch(step) {
                case "TAO_DON_HANG":
                    return "Tạo đơn hàng";
                case "CHO_XAC_NHAN":
                    return "Xác nhận";
                case "DA_XAC_NHAN":
                    return "Chuyển vận chuyển";
                case "CHO_VAN_CHUYEN":
                    return "Bắt đầu vận chuyển";
                case "DANG_VAN_CHUYEN":
                    return "Xác nhận đã giao";
                case "DA_GIAO_HANG":
                    return isAlreadyPaid ? "Hoàn thành đơn" : "Chuyển chờ thanh toán";
                case "CHO_THANH_TOAN":
                    return "Xác nhận thanh toán";
                case "DA_THANH_TOAN":
                    return "Hoàn thành đơn";
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
        
        const modalConfirmUpdateStatusBill = () => {
            return (
                <div>
                    <div className={"mb-4 w"}>
                        <h3>Xác nhận đơn hàng</h3>
                    </div>

                </div>

            )
        }


        const showModalBillHistory = () => {
            setOpen(true)
            setModalType(modalBillHistoryType)
            setWidthModal("75%")
        };


        const handleOnConfirmUpdateValue = () => {
            setIsRollbackAction(false); // Đánh dấu là hành động tiến lên
            setOpen(true);
            setWidthModal("40%");
            setConfirmNotes('');
            setModalType(modalUpdateStatusBillType);
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
                        {formatVND(currentBill?.totalMoney)}
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
                label: 'Voucher giảm giá',
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
        const { confirm } = Modal;

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
            setSelectedProduct(product);
            setInputQuantity(1); // Reset về 1
            setIsQuantityModalVisible(true);
        };

        const handleConfirmAddProduct = async () => {
            try {
                if (!selectedProduct || inputQuantity <= 0) {
                    toast.error("Vui lòng nhập số lượng hợp lệ");
                    return;
                }

                const response = await axiosInstance.post('/api/admin/bill-product-detail/add-product', {
                    billCode: id,
                    productDetailId: selectedProduct.id,
                    quantity: inputQuantity,
                    price: selectedProduct.price
                });

                if (response.status === 200) {
                    toast.success("Thêm sản phẩm thành công");
                    // Refresh lại data
                    getBillProductDetail();
                    getCurrentBill();
                    // Đóng modal
                    setIsQuantityModalVisible(false);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Lỗi khi thêm sản phẩm");
            }
        };

        const handleConfirmPayment = () => {
            setOpen(true);
            setWidthModal("40%");
            setConfirmNotes('');
            setModalType(modalUpdateStatusBillType);
            // Cập nhật trạng thái thành DA_THANH_TOAN
            const data = {
                status: "DA_THANH_TOAN",
                note: "Xác nhận thanh toán"
            };
            handleUpdateStatusBill(data);
        };

        const handleCancelBill = async () => {
            try {
                const data = {
                    status: "DA_HUY",
                    note: "Đơn hàng đã bị hủy"
                };
                await handleUpdateStatusBill(data);
            } catch (error) {
                toast.error("Có lỗi xảy ra khi hủy đơn hàng");
            }
        };

        const handleReturnRequest = async () => {
            try {
                const data = {
                    status: "TRA_HANG",
                    note: "Yêu cầu trả hàng"
                };
                await handleUpdateStatusBill(data);
            } catch (error) {
                toast.error("Có lỗi xảy ra khi yêu cầu trả hàng");
            }
        };

        return (
            <div className={"flex-column d-flex gap-3"}>

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
                </Modal>
                <Card className={"mb-2"}>
                    <div>
                        <StepProgress steps={steps1}
                                      billHistoryList={billHistory}
                                      currentStep={billHistory.length}/>


                    </div>
                    <div className={"d-flex align-items-center justify-content-between"}>
                        <div className={"d-flex align-items-center gap-5"}>
                            {!["DA_HUY", "DA_HOAN_THANH", "TRA_HANG", "HUY_YEU_CAU_TRA_HANG", "TU_CHOI_TRA_HANG"].includes(currentBill?.status) && (
                                <Button type={"primary"} onClick={handleOnConfirmUpdateValue}>
                                    {handleButtonConfirm(currentBill?.status)}
                                </Button>
                            )}
                            {!["TAO_DON_HANG", "DA_HUY", "DA_HOAN_THANH", "TRA_HANG", "HUY_YEU_CAU_TRA_HANG", "TU_CHOI_TRA_HANG"].includes(currentBill?.status) && (
                                <Button onClick={handleOnRollbackStatus} color={"danger"} type={""}>
                                    Quay lại
                                </Button>
                            )}
                            {!billHistory.some(h => h.status === "DA_THANH_TOAN") && 
                             !["TAO_DON_HANG", "CHO_XAC_NHAN", "DA_HUY", "DA_HOAN_THANH", "TRA_HANG"].includes(currentBill?.status) && (
                                <Button onClick={handleConfirmPayment} type="primary">
                                    Xác nhận thanh toán
                                </Button>
                            )}
                            {!["DA_HUY", "DA_HOAN_THANH", "TRA_HANG"].includes(currentBill?.status) && (
                                <Button onClick={handleCancelBill} type="danger">
                                    Hủy đơn
                                </Button>
                            )}
                            {["DA_GIAO_HANG", "DA_THANH_TOAN", "DA_HOAN_THANH"].includes(currentBill?.status) && (
                                <Button onClick={handleReturnRequest} type="warning">
                                    Yêu cầu trả hàng
                                </Button>
                            )}
                        </div>
                        <Button type={"primary"} onClick={showModalBillHistory}>
                            Lịch sử hóa đơn
                        </Button>

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
                        {currentBill?.status === "TAO_DON_HANG" && (
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
                        {currentBill?.status === "TAO_DON_HANG" && (
                            <Button
                                type={"primary"}
                                onClick={handleOnShowProduct}
                                primary
                                icon={<IoAdd/>}
                            >
                                Thêm sản phẩm
                            </Button>
                        )}
                    </div>
                    <Table
                        className={"w-100"}
                        pagination={false}
                        columns={columnsBillProductDetailTable}
                        dataSource={billProductDetails}
                    />
                    <hr/>

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
                <Modal
                    title="Nhập số lượng sản phẩm"
                    open={isQuantityModalVisible}
                    onOk={handleConfirmAddProduct}
                    onCancel={() => setIsQuantityModalVisible(false)}
                >
                    <div className="d-flex flex-column gap-3">
                        {selectedProduct && (
                            <div>
                                <p><strong>Sản phẩm:</strong> {selectedProduct.productName}</p>
                                <p><strong>Giá:</strong> {formatVND(selectedProduct.price)}</p>
                                <p><strong>Tồn kho:</strong> {selectedProduct.quantity}</p>
                            </div>
                        )}

                        <div>
                            <label>Số lượng:</label>
                            <InputNumber
                                min={1}
                                max={selectedProduct?.quantity || 1}
                                value={inputQuantity}
                                onChange={(value) => setInputQuantity(value)}
                                style={{width: '100%'}}
                            />
                        </div>

                        <div>
                            <p><strong>Thành tiền:</strong> {formatVND(inputQuantity * (selectedProduct?.price || 0))}</p>
                        </div>
                    </div>
                </Modal>

            </div>


        );
    }
;

export default BillDetail;
