import {Button, Image} from "antd";
import {convertLongTimestampToDate} from "../../../helpers/Helpers.js";
import {MdDelete} from "react-icons/md";
import React from "react";
import {Link} from "react-router-dom";
import {FiEye} from "react-icons/fi";

export const columnsBillProductTable = (onActionClick) => [
    {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'Ảnh sản phẩm',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: (url) => {
            return (
                <div className="d-flex justify-content-center">
                    <Image
                        style={{ objectFit: 'contain' }}
                        width={120}
                        src={url ?? 'https://via.placeholder.com/120'}
                    />
                </div>
            );
        },
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'productName',
        key: 'productName',
    },
    {
        title: 'Thương hiệu',
        dataIndex: 'brand',
        key: 'brand',
        render: (brand) => brand?.brandName ?? 'Không xác định',
    },


    {
        title: 'Số lượng có sẵn',
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
    },

    {
        title: 'Tổng tiền',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        render: (price) =>
            price ? `${price.toLocaleString()} VND` : 'Chưa tính',
    },
    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
            <Button
                type="primary"
                onClick={() => {
                    if (onActionClick) {
                        onActionClick(record);
                    }
                }}
            >
                Chọn
            </Button>
        ),
    },
];

export  const  columnsBillList = () => {
    return  [

        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Mã hóa đơn',
            dataIndex: 'billCode',
            key: 'billCode',
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
                        icon={<FiEye/>}
                        onClick={() => {
                        }}
                    >

                    </Button>
                </Link>

            ),
        },
    ]
};
