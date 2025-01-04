import React, { useState } from 'react';
import {Space, Table, Input, DatePicker, Select, Card} from 'antd';
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const columns = [
    {
        title: '#',
        dataIndex: 'key',
        key: '#',
    },
    {
        title: 'Tên phiếu giảm giá',
        dataIndex: 'ten',
        key: 'ten',
    },
    {
        title: 'Mã phiếu giảm giá',
        dataIndex: 'ma',
        key: 'ma',
    },
    {
        title: 'Hình thức giảm giá',
        dataIndex: 'hinhthuc',
        key: 'hinhthuc',
    },
    {
        title: 'Giá trị giảm',
        dataIndex: 'giatrigiam',
        key: 'giatrigiam',
    },
    {
        title: 'Giá trị đơn hàng tối thiểu',
        dataIndex: 'giatritt',
        key: 'giatritt',
    },
    {
        title: 'Giá trị đơn hàng tối đa',
        dataIndex: 'giatritd',
        key: 'giatritd',
    },
    {
        title: 'Số lượng',
        dataIndex: 'soluong',
        key: 'soluong',
    },
    {
        title: 'Ngày bắt đầu',
        dataIndex: 'ngaybatdau',
        key: 'ngaybatdau',
    },
    {
        title: 'Ngày kết thúc',
        dataIndex: 'ngayketthuc',
        key: 'ngayketthuc',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trangthai',
        key: 'trangthai',
    },
    {
        title: 'Thao tác',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Chỉnh sửa {record.name}</a>
                <a>Xóa</a>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        ten: 'Giảm giá tháng 12',
        ma: 'P01',
        hinhthuc: 'Trực tiếp vào sản phẩm',
        giatrigiam: '10%',
        giatritt: '100k',
        giatritd: '300k',
        soluong: '30',
        ngaybatdau: '12/12/2024',
        ngayketthuc: '31/12/2024',
        trangthai: 'Hoạt động',
    },
];

const VoucheList = () => {
    const [dates, setDates] = useState([]); 
    const [status, setStatus] = useState(''); 

    const onSearch = (value) => {
        console.log('Search value:', value);
    };

    const handleDateChange = (dates, dateStrings) => {
        console.log('Selected dates:', dates);
        console.log('Formatted dates:', dateStrings);
        setDates(dateStrings);
    };

    const handleStatusChange = (value) => {
        console.log('Selected status:', value);
        setStatus(value);
    };

    return (
        <>
            <Card>
                <h4>Danh sách phiếu giảm giá</h4>
                <div className={"d-flex flex-column gap-2"}>
                    <Search
                        placeholder="Nhập phiếu giảm giá bạn muốn tìm"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                        style={{marginBottom: '20px'}}
                    />
                    <Space style={{marginBottom: '20px'}}>
                        <RangePicker format="DD/MM/YYYY" onChange={handleDateChange}/>
                        <Select
                            placeholder="Chọn trạng thái"
                            style={{width: 200}}
                            onChange={handleStatusChange}
                            allowClear
                        >
                            <Option value="all">Tất cả</Option>
                            <Option value="active">Hoạt động</Option>
                            <Option value="inactive">Tạm ngưng</Option>
                        </Select>
                    </Space>
                </div>
                <Table columns={columns} dataSource={data}/>
            </Card>
        </>
    );
};

export default VoucheList;
