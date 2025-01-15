import React, { useEffect, useMemo, useState } from 'react';
import { Space, Table, Input, Tabs, Card, Col, Row, Button, Select, DatePicker, ConfigProvider, Badge } from 'antd';
import axios from "axios";
import { baseUrl, convertLongTimestampToDate } from "../../helpers/Helpers.js";
import { FiEye } from "react-icons/fi";
import FilterComponent from "./componets/FilterComponent.jsx";
import { Link } from "react-router-dom";

const { RangePicker } = DatePicker;


const { Search } = Input;


const columns = [

    {
        title: 'Mã đơn hàng',
        dataIndex: 'billCode',
        key: 'billCode',
    },
    {
        title: 'Mã',
        dataIndex: 'billCode',
        key: 'billCode',
        // render: (text) => <a>{text}</a>,
    },
    {
        title: 'Khách Hàng',
        dataIndex: 'customerName',
        key: 'customerName',
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'customerPhone',
        key: 'customerPhone',
    },

    {
        title: 'Loại đơn hàng',
        dataIndex: 'billType',
        key: 'billType',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'createAt',
        key: 'createAt',
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
        title: 'Hành động',
        key: 'action',
        render: (_, record) => (
            <Link to={`/admin/bill/bill-detail/${record.billCode}`}>
                <Button
                    type="primary"
                    icon={<FiEye />}
                    onClick={() => {
                    }}
                >

                    Chi tiết

                </Button>
            </Link>

        ),
    },
];




const items = [
    {
        key: 'all',
        label: "Tất cả"

    },
    {
        key: 'CHO_XAC_NHAN',
        label: (
            <>
                Chờ xác nhận <Badge count={5} className={"mb-3 ms-1"} />
            </>
        ),

    },
    {
        key: 'DA_XAC_NHAN',

        label: (
            <>
                Đã xác nhận <Badge count={5} className={"mb-3 ms-1"} />
            </>
        ),
    },
    {
        key: 'CHO_VAN_CHUYEN',
        label: (
            <>
                Chờ vận chuyển <Badge count={5} className={"mb-3 ms-1"} />
            </>
        ),
    },
    {
        key: 'DANG_VAN_CHUYEN',
        label: (
            <>
                Đang vận chuyển <Badge count={5} className={"mb-3 ms-1"} />
            </>
        ),
    },
    {
        key: 'DA_THANH_TOAN',
        label: (
            <>
                Đã thanh toán <Badge count={5} className={"mb-3 ms-1"} />
            </>
        ),
    },
    {
        key: 'DA_HOAN_THANH',
        label: (
            <>
                Đã hoàn thành <Badge count={5} className={"mb-3 ms-1"} />
            </>
        ),
    },
    {
        key: 'DA_HUY',
        label: (
            <>
                Đã hủy <Badge count={5} className={"mb-3 ms-1"} />
            </>
        ),
    }
];

const BillList = (factory, deps) => {

    const defaultURL = `${baseUrl}/api/admin/bill/index`;

    const [activeTab, setActiveTab] = useState('all');

    const [billsData, setBillsData] = useState([]);

    const [url, setUrl] = useState(defaultURL);

    const [statusBill, setStatusBill] = useState()

    const [pagination, setPagination] = useState({
        page: 0,
        size: 1,
        total: 0
    })

    const onSearch = (value) => {
        console.log('Search value', value);

    };
    const onChange = (key) => {
        setActiveTab(key);
        setStatusBill(key)
        setPagination({
            ...pagination,
            page: 0, // Trang hiện tại
            size: pagination.size, // Số mục mỗi trang
        });
    };

    const memoizeUrl = useMemo(() => {
        if (activeTab === 'all') {
            return `${defaultURL}?page=${pagination.page}&size=${pagination.size}`;
        } else {
            return `${defaultURL}?page=${pagination.page}&size=${pagination.size}&statusBill=${activeTab}`;
        }

    })

    useEffect(() => {
        console.log("gọi hàm")
        getBill();
    }, [url]);
    useEffect(() => {
        setUrl(memoizeUrl);
    }, [memoizeUrl]);


    const getBill = async () => {
        const response = await axios.get(url)
        setBillsData(response.data.data)

        setPagination({
            ...pagination, page: response.data.currentPage, size: pagination.size, total: response.data.totalElements
        })

    }

    function handleOnChangeTable(paginationTable) {
        setPagination({
            ...pagination,
            page: paginationTable.current - 1, // Trang hiện tại
            size: paginationTable.pageSize, // Số mục mỗi trang
        });
    }

    const handleOnChangeSelectBillType = (value) => {

    }



    return (
        <>
            <div className={"d-flex flex-column gap-3"}>
                <h2>Quản lý hóa đơn</h2>
                <Card className={"flex-column gap-5 d-flex"}>
                    <h4>Bộ lọc</h4>
                    <div className={"row"}>
                        <FilterComponent label={"Tìm kiếm :"} child={<Input />} />
                        <FilterComponent label={"Loại đơn :"} child={
                            <Select
                                defaultValue="all"
                                className={"w-100"}
                                onChange={handleOnChangeSelectBillType}
                                options={[
                                    { value: 'all', label: 'Tất cả' },
                                    { value: 'online', label: 'Online' },
                                    { value: 'offline', label: 'Offline' },
                                ]}
                            />
                        } />

                        <FilterComponent label={"Sắp xếp theo :"}
                            child={<ConfigProvider theme={{}}>
                                <DatePicker.RangePicker />
                            </ConfigProvider>} />

                    </div>

                    <div className={"d-flex  justify-content-center gap-5 mt-5 "}>
                        <Button type={"primary"}>
                            Tìm kiếm
                        </Button>

                        <Button>
                            Làm mới
                        </Button>
                    </div>


                </Card>
                <Card>
                    <h4>Danh sách hóa đơn</h4>
                    <Tabs defaultActiveKey="all" items={items} onChange={onChange} />
                    <div className={"d-flex justify-content-center"}>
                        <Table className={"w-100"} onChange={handleOnChangeTable}
                            pagination={{
                                current: pagination.page + 1,
                                pageSize: pagination.size,
                                total: pagination.total,
                            }}
                            columns={columns} dataSource={billsData} />
                    </div>

                </Card>

            </div>



        </>
    );
};
export default BillList;