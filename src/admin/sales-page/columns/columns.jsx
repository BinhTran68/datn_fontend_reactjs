import {Button, Image, InputNumber} from "antd";
import React from "react";
import {formatVND} from "../../../helpers/Helpers.js";

export const salesColumns = (onActionClick, handleOnChangeQuantityInCart, ) => [
    {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
        align: 'center',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'Ảnh sản phẩm',
        dataIndex: 'imageUrl',
        align: 'center',
        key: 'imageUrl',
        render: (url) => {
            return (
                <div className="d-flex justify-content-center">
                    <Image
                        style={{ objectFit: 'contain' }}
                        width={220}
                        src={url ?? 'https://golfgroup.com.vn/wp-content/uploads/2023/04/giay-de-mem-nu-Adidas-GV9392-1.jpg'}
                    />
                </div>
            );
        },
    },
    {
        title: 'Sản phẩm',
        dataIndex: 'productName',
        align: 'center',
        key: 'productName',
    },
    {
        title: 'Giá',
        dataIndex: 'price',
        align: 'center',
        key: 'price',
        render: (price) => formatVND(price)
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantityInCart',
        key: 'quantityInCart',
        render: (quantityInCart, record) => (
            <InputNumber
                min={1}
                type={"number"}
                value={quantityInCart}
                defaultValue={quantityInCart}
                onChange={(value) => handleOnChangeQuantityInCart(value, record)}
            />
        ),

    },
    {
        title: 'Tổng tiền',
        align: 'center',
        key: 'totalPrice',
        // nếu có discount thì viết logic ở đây
        render: (_, record) =>
            formatVND(record.price * (record.quantityInCart || 1)),
    },

    {
        title: 'Hành động',
        dataIndex: 'action',
        align: 'center',
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
                Xóa
            </Button>
        ),
    },
];