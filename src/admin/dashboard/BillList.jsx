import React, { useState } from 'react';
import { Space, Table, Input, Tabs } from 'antd';
const { Search } = Input;


const columns = [

    {
        title: '#',
        dataIndex: 'key',
        key: '#',
    },
    {
        title: 'Mã',
        dataIndex: 'ma',
        key: 'ma',
        // render: (text) => <a>{text}</a>,
    },
    {
        title: 'Khách Hàng',
        dataIndex: 'kh',
        key: 'kh',
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'sdt',
        key: 'sdt',
    },
    {
        title: 'Hình thức thanh toán',
        dataIndex: 'thanhtoan',
        key: 'thanhtoan',
    },
    {
        title: 'Loại đơn hàng',
        dataIndex: 'loai',
        key: 'loai',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trangthai',
        key: 'trangthai',
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'ngaytao',
        key: 'ngaytao',
    },
    {
        title: 'Trạng thái hoạt động',
        dataIndex: 'hoatdong',
        key: 'hoatdong',
    },

    // render: (_, { tags }) => (
    //   <>
    //     {tags.map((tag) => {
    //       let color = tag.length > 5 ? 'geekblue' : 'green';
    //       if (tag === 'loser') {
    //         color = 'volcano';
    //       }
    //       return (
    //         <Tag color={color} key={tag}>
    //           {tag.toUpperCase()}
    //         </Tag>
    //       );
    //     })}
    //   </>
    // ),
    //   },
    {
        title: 'Action',
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
        ma: 'HD01',
        kh: 'Trịnh Bá Tú',
        sdt: '0974873654',
        thanhtoan: 'tiền mặt',
        loai: 'A',
        trangthai: 'Đã thanh toán',
        ngaytao: '28/12/2024',
        hoatdong: 'Tạm ngưng',

    },
    {
        key: '2',
        ma: 'HD02',
        kh: 'Lươn Duy Công',
        sdt: '0334873654',
        thanhtoan: 'tiền mặt',
        loai: 'C',
        trangthai: 'Đã thanh toán',
        ngaytao: '25/12/2024',
        hoatdong: 'Tạm ngưng',

    },
    {
        key: '3',
        ma: 'HD03',
        kh: 'Trần Đình Bình',
        sdt: '0345672109',
        thanhtoan: 'Chuyển khoản',
        loai: 'B',
        trangthai: 'Đã thanh toán',
        ngaytao: '21/12/2024',
        hoatdong: 'Tạm ngưng',

    },
];
const BillList = () => {

    const onSearch = (value) => {
        console.log('Search value', value);

    };
    const [activeTab, setActiveTab] = useState('1');
    const onChange = (key) => {
        setActiveTab(key);
    };
    const items = [
        {
            key: '1',
            label: 'Tất cả',
            children: 'Content of Tab Pane 1',
            trang: "."
        },
        {
            key: '2',
            label: 'Chờ xác nhận',
            children: 'Content of Tab Pane 2',
        },
        {
            key: '3',
            label: 'Đã xác nhận',
            children: 'Content of Tab Pane 3',
        },
        {
            key: '4',
            label: 'Đang giao',
            children: 'Content of Tab Pane 4',
        },
        {
            key: '5',
            label: 'Hoàn thành',
            children: 'Content of Tab Pane 5',
        },
        {
            key: '6',
            label: 'Đã hủy',
            children: 'Content of Tab Pane 6',
        }
    ];
    return (

        <>
        <h4>Danh sách hóa đơn</h4>

            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            {activeTab === '1' && (

            <div style={{ padding: '20px' }}>
                <Search
                    placeholder="input search text"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}/>
            </div>
            )}
            {activeTab === '1' && (
                <Table columns={columns} dataSource={data} />
            )}
        </>
    );
};
export default BillList;