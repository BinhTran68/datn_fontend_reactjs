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
        title: 'Ảnh sản phẩm',
        dataIndex: 'urlImage',
        key: 'urlImage',
        render: (url) => {
            return (
                <div
                    className="d-flex justify-content-center"

                >
                    <Image style={{
                        objectFit: "contain"
                    }} width={120}
                           src={url ?? "data:image/jpeg;base64,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"}/>

                </div>
            )
        }
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
        title: 'Tổng tiền',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
    },

    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
            <Button
                type="danger"
                icon={<MdDelete/>}
                style={{borderRadius: '20px', color: "#FF0000", border: '1px solid red'}}

                onClick={() => {
                    console.log(record?.productName);
                }}
            >
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


        const handleOkModal = () => {
            if (modalType === modalBillHistoryType) {
                setOpen(false);
                return
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

            const data = {
                "status": handleNewStatusUpdate(currentBill.status),
                "note": confirmNotes
            }

            await axiosInstance.put(`/api/admin/bill/${id}/update`, data).then(
                (res) => {
                    const result = res.data.data;
                    setCurrentBill(result.bill)
                    if (result.bill.status === "DANG_VAN_CHUYEN") {
                        handlePrintBillPdf()
                    }
                    setBillHistory(result.billHistory)
                }
            ).catch((e) => {

            })
        }

        const handlePrintBillPdf = async () => {
            const response = await axiosInstance.get(`/api/admin/bill/print-bill/${id}`);
            const result = response.data
            print(result)
        }

        const handleNewStatusUpdate = () => {
            if (currentBill.status === "CHO_XAC_NHAN") {
                return "DA_XAC_NHAN"
            }
            if (currentBill.status === "DA_XAC_NHAN") {
                return "CHO_VAN_CHUYEN"
            }
            if (currentBill.status === "CHO_VAN_CHUYEN") {
                return "DANG_VAN_CHUYEN"
            }
            if (currentBill.status === "DANG_VAN_CHUYEN") {
                const check = billHistory.find((el) => el.status === "DA_THANH_TOAN")
                if (check) {
                    return "DA_HOAN_THANH"
                } else {
                    return "DA_THANH_TOAN"
                }
            }
            if (currentBill.status === "DA_THANH_TOAN") {
                return "DA_HOAN_THANH"
            }

        }


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
            console.log(response);

        }


        const getCurrentBill = async () => {
            const response = await axiosInstance.get(`/api/admin/bill/detail/${id}`);
            const bill = response.data.data;
            setCurrentBill(bill);
            console.log(bill);
            const address = await generateAddressString(
                bill?.address?.provinceId,
                bill?.address?.districtId,
                bill?.address?.wardId,
                bill?.address?.specificAddress
            );

            setAddressString(address);

        }

        useEffect(() => {
            getPaymentsBill();
            getCurrentBill();
            getBillHistory();
            getBillProductDetail();
        }, [id]);


        const steps1 = [
            {id: 1, label: "Chờ xác nhận", time: "", icon: <FaFileCircleCheck size={34}/>, status: "CHO_XAC_NHAN"},
            {id: 2, label: "Đã xác nhận", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DA_XAC_NHAN"},
            {id: 3, label: "Chờ vận chuyển", time: "", icon: <FaFileCircleCheck size={34}/>, status: "CHO_VAN_CHUYEN"},
            {id: 4, label: "Đang vận chuyển", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DANG_VAN_CHUYEN"},
            {id: 5, label: "Đã thanh toán", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DA_THANH_TOAN"},
        ];


        const handleButtonConfirm = (step) => {

            if (step === "CHO_XAC_NHAN") {
                return "Xác nhận";
            }
            if (step === "DA_XAC_NHAN") {
                return "Vận chuyển";
            }
            if (step === "CHO_VAN_CHUYEN") {
                return "Xác nhận Vận chuyển";
            }

            if (step === "DANG_VAN_CHUYEN") {
                const check = billHistory.find((el) => el.status === "DA_THANH_TOAN")
                if (check) {
                    return "Xác nhận hoàn thành"
                } else {
                    return "Xác nhận thanh toán"
                }

            }
            if (step === "DA_THANH_TOAN") {
                return "Xác nhận hoàn thành";
            }
        }

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
                    <TextArea
                        value={confirmNotes}
                        onChange={(e) => setConfirmNotes(e.target.value)}
                        placeholder="Controlled autosize"
                        autoSize={{minRows: 3, maxRows: 5}}
                    />
                </div>

            )
        }

        

        const showModalBillHistory = () => {
            setOpen(true)
            setModalType(modalBillHistoryType)
            setWidthModal("75%")
        };

        const showModalConfirm = (title, content) => {
            Modal.confirm({
                title: title,
                content: content,
                onCancel: () => {
                    return false;
                },
                onOk: () => {
                    return true;
                },
                footer: (_, {OkBtn, CancelBtn}) => (
                    <>
                        <CancelBtn/>
                        <OkBtn/>
                    </>
                ),
            });
        }

        const handleOnConfirmUpdateValue = () => {
            setOpen(true)
            setWidthModal("40%")
            setConfirmNotes('')
            setModalType(modalUpdateStatusBillType)
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
        const handleOnRollbackSatus = async () => {
            // Kiểm tra nếu không có history hoặc đang ở trạng thái đầu
            if (!billHistory.length || currentBill?.status === "CHO_XAC_NHAN") {
                toast.error("Không thể quay lại trạng thái trước đó");
                return;
            }

            try {
                const data = {
                    status: billHistory[billHistory.length - 2]?.status,
                    note: "Quay lại trạng thái trước đó"
                }

                const response = await axiosInstance.put(`/api/admin/bill/${id}/update`, data);
                const result = response.data.data;
                
                setCurrentBill(result.bill);
                setBillHistory(result.billHistory);
                
                toast.success("Đã quay lại trạng thái trước đó");
            } catch (error) {
                toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
            }
        }

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
                        <div className={"d-flex align-items-cente gap-5"}>
                            {
                                currentBill?.status !== "DA_HOAN_THANH" ?
                                    <Button type={"primary"} onClick={handleOnConfirmUpdateValue}>
                                        {
                                            handleButtonConfirm(currentBill?.status)
                                        }
                                    </Button> : <div></div>
                            }
                            {
                                currentBill?.status !== "DA_HOAN_THANH" ?
                                    <Button onClick={handleOnRollbackSatus} color={"danger"} type={""}>
                                        Quay lại
                                    </Button> : <div></div>
                            }
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
                        <Button type={"primary"} onClick={showModalEditBillInfo}>
                            Chỉnh sửa thông tin đơn hàng
                        </Button>
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
                            <Tag style={{fontSize: 16}} color="blue">  {currentBill?.customerPhone ? currentBill.customerPhone : "Khách lẻ" }</Tag>
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
                        <Button
                            type={"primary"}
                            onClick={handleOnShowProduct}
                            primary
                            icon={<IoAdd/>}
                        >
                            Thêm sản phẩm
                        </Button>
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
                                style={{ width: '100%' }}
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
