import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Badge, Button, Card, Descriptions, Modal, Steps, Table, Tag} from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CarOutlined,
    SyncOutlined,
    SmileOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {baseUrl, convertLongTimestampToDate} from "../../helpers/Helpers.js";
import {FiEye} from "react-icons/fi";
import {FaClipboardCheck} from "react-icons/fa";
import StepProgress from "./componets/StepProgress.jsx";
import {FaFileCircleCheck} from "react-icons/fa6";
import TextArea from "antd/es/input/TextArea.js";

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
    },
    {
        title: 'Loại giao dịch',
        dataIndex: 'paymentMethodsType',
        key: 'paymentMethodsType',
        // render: (text) => <a>{text}</a>,
    },
    {
        title: 'Phương thức thanh toán',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
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
        dataIndex: 'transactionCode',
        key: 'transactionCode',
    },
    {
        title: 'Thông tin sản phẩm',
        dataIndex: 'paymentMethodsType',
        key: 'paymentMethodsType',
        // render: (text) => <a>{text}</a>,
    },
    {
        title: 'Số lượng',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
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
    },


    {
        title: 'Ghi chú',
        dataIndex: 'notes',
        key: 'notes',
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
        key: 'status',
    },
    {
        title: 'Người xác nhận',
        dataIndex: 'staffName',
        key: 'staffName',
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

    const defaultURL = `${baseUrl}/api/admin`;
    const [paymentBillHistory, setPaymentBillHistory] = useState([])
    const [billProductDetails, setBillProductDetails] = useState()
    const [billHistory, setBillHistory] = useState([]);
    const [currentBill, setCurrentBill] = useState()
    const {id} = useParams();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modal, setModalText] = useState();

    const [confirmNotes, setConfirmNotes] = useState('')
    const [widthModal, setWidthModal] = useState('50%')


    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const getBillDetailByBillCode = () => {
        const response = axios.get(`${defaultURL}?billCode=${id}`);
    }


    const getProductDetailsByBillCode = () => {
        const response = axios.get(`${defaultURL}?billCode=${id}`);
    }


    const getPaymentsBill = async () => {
        const response = await axios.get(`${defaultURL}/payment-bill?billCode=${id}`);
        setPaymentBillHistory(response.data.data)
    }

    const getBillHistory = async () => {
        const response = await axios.get(`${defaultURL}/bill-history?billCode=${id}`);
        const billHistoryResponse = response.data.data;
        setBillHistory(billHistoryResponse);


    }


    const getCurrentBill = async () => {
        const response = await axios.get(`${defaultURL}/bill/detail/${id}`);
        setCurrentBill(response.data.data);
        console.log("steps", response.data.data.status)
        // setCurrentStep(response.data.data.status)
    }

    useEffect(() => {
        getPaymentsBill();
        getCurrentBill();
        getBillHistory();
    }, [id]);


    const steps1 = [
        {id: 1, label: "Chờ xác nhận", time: "", icon: <FaFileCircleCheck size={34}/>, status: "CHO_XAC_NHAN"},
        {id: 2, label: "Đã xác nhận", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DA_XAC_NHAN"},
        {id: 3, label: "Chờ vận chuyển", time: "", icon: <FaFileCircleCheck size={34}/>, status: "CHO_VAN_CHUYEN"},
        {id: 4, label: "Đang vận chuyển", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DANG_VAN_CHUYEN"},
        {id: 5, label: "Đã thanh toán", time: "", icon: <FaFileCircleCheck size={34}/>, status: "DA_THANH_TOAN"},
    ];


    const genIndexStepByStep = (step) => {

        if (step === "CHO_XAC_NHAN") {
            return 1;
        }
        if (step === "DA_XAC_NHAN") {
            return 2;
        }
        if (step === "CHO_VAN_CHUYEN") {
            return 3;
        }

        if (step === "DANG_VAN_CHUYEN") {
            return 4;
        }

        if (step === "DA_THANH_TOAN") {
            return 5;
        }
        return 1;
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
    const modalConfirmUpdateStatusBill = () => {
        return (
            <div >
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
        setWidthModal("75%")
        setModalText(modalBillHistoryTable())
    };
    const handleOnConfirmUpdateValue = () => {
        setOpen(true)
        setModalText(modalConfirmUpdateStatusBill())
    };
    return (
        <div className={"flex-column d-flex gap-3"}>
        <Modal

                width={widthModal}
                open={open}
                onOk={handleOk}
                children={
                    modal
                }
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            />

            <Card className={"mb-2"}>
                <div>
                    <StepProgress steps={steps1}
                                  billHistoryList={billHistory}
                                  currentStep={genIndexStepByStep("CHO_XAC_NHAN")}/>
                </div>

                <div className={"d-flex align-items-center justify-content-between"}>
                    <div className={"d-flex align-items-cente gap-5"}>
                        <Button type={"primary"} onClick={handleOnConfirmUpdateValue}>
                            Xác nhận
                        </Button>

                        <Button type={"primary"} danger={true}>
                            Hủy
                        </Button>
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
                <h3 className={"mb-4"}>Thông tin đơn hàng</h3>
                <Descriptions column={2}>

                    <Descriptions.Item label={<span className={"fw-bold text-black"}>Mã đơn hàng  </span>} span={2}>
                        {currentBill?.billCode ?? ""}
                    </Descriptions.Item>

                    <Descriptions.Item label={<span className={"fw-bold text-black"}>Trạng thái  </span>}>
                        <Tag color="blue">  {currentBill?.status ?? ""}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className={"fw-bold text-black"}>Tên khách hàng  </span>}>
                        <Tag color="blue">  {currentBill?.customerName ?? ""}</Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label={<span className={"fw-bold text-black"}>Loại  </span>}>
                        <Tag color="purple">ONLINE</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className={"fw-bold text-black"}>Số điện thoại  </span>}>
                        <Tag color="blue">  {currentBill?.customerPhone ?? ""}</Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label={<span className={"fw-bold text-black"}>Địa chỉ  </span>} span={2}>
                        {currentBill?.shippingAddress ?? ""}
                    </Descriptions.Item>

                    <Descriptions.Item label={<span className={"fw-bold text-black"}>Ghi chú  </span>} span={2}>
                        {currentBill?.note ?? ""}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card>
                <h3>Thông tin sản phẩm đã mua</h3>
                <Table
                    className={"w-100"}
                    pagination={false}
                    columns={columnsBillProductDetailTable}
                    dataSource={billProductDetails}
                />
            </Card>


        </div>


    );
};

export default BillDetail;
