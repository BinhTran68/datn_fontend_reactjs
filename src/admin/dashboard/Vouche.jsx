import React, { useState } from 'react';
import { Space, Table, Input, DatePicker, Select } from 'antd';
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
        key: 'giamtrigiam',
    },
    {
        title: 'Giá trị đơn hàng tối thiểu',
        dataIndex: 'giatritt',
        key: 'giatritt',
    },
    {
        title: 'Giá trị đơn hàng đối ta',
        dataIndex: 'giatritd',
        key: 'giatritd',
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
        ma: 'Đợt 1',
        hinhthuc: 'trực tiếp vào sản phẩm',
        giatrigiam: '10%',
        giatritt: '100k',
        giatritd: '300k',
        ngaybatdau: '12/12/2024',
        ngayketthuc: '31/12/2024',
        trangthai: 'Hoạt động',


    },

];

const Vouche = () => {
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
            <h4>Danh sách đợt giảm giá</h4>          
            <Table columns={columns} dataSource={data} />
        </>
    );
};

export default Vouche;
