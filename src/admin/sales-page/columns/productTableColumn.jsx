import {Button, Tag, Tooltip} from "antd";
import React from "react";

export const productTableColumn = (pagination, handleOnAddProductToBill) => [
    {
        title: "#",
        dataIndex: "stt",
        key: "stt",
        render: (_, __, index) => (
            <div>{index + 1 + (pagination.current - 1) * pagination.pageSize}</div>
        ),
        onCell: () => ({
            style: {
                width: "50px",
                height: "50px",
                lineHeight: "50px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
        }),
    },
    {
        title: "Sản phẩm",
        dataIndex: "productName",
        key: "productName",
        render: (_, record) => {
            const { productName, sizeName, colorName } = record;
            return productName ? `${productName} - [${sizeName}] - [${colorName}]` : "";
        },
        onCell: () => ({
            style: {
                width: "100px",
                height: "50px",
                lineHeight: "50px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
        }),
    },
    {
        title: "Hãng",
        dataIndex: "brandName",
        key: "productName",
        onCell: () => ({
            style: {
                width: "100px",
                height: "50px",
                lineHeight: "50px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
        }),
    },
    {
        title: "Loại giày",
        dataIndex: "typeName",
        key: "productName",

        onCell: () => ({
            style: {
                width: "100px",
                height: "50px",
                lineHeight: "50px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
        }),
    },
    {
        title: "Màu sắc",
        dataIndex: "colorName",
        key: "productName",
        onCell: () => ({
            style: {
                width: "100px",
                height: "50px",
                lineHeight: "50px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
        }),
    },
    {
        title: "Chất liệu",
        dataIndex: "materialName",
        key: "productName",
        onCell: () => ({
            style: {
                width: "100px",
                height: "50px",
                lineHeight: "50px",

                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
        }),
    },
    {
        title: "Kích cỡ",
        dataIndex: "sizeName",
        key: "productName",

        onCell: () => ({
            style: {
                width: "100px",
                height: "50px",
                lineHeight: "50px",

                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
        }),
    },
    {
        title: "Đế giày",
        dataIndex: "soleName",
        key: "productName",

        onCell: () => ({
            style: {
                width: "100px",
                height: "50px",
                lineHeight: "50px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
        }),
    },
    {
        title: "Giới tính",
        dataIndex: "genderName",
        key: "productName",

        onCell: () => ({
            style: {
                width: "100px",
                height: "50px",
                lineHeight: "50px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
        }),
    },
    {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "productName",
        onCell: () => ({
            style: {
                width: "100px",
                height: "50px",
                lineHeight: "50px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
        }),
    },
    {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render: (price) => {
            if (price === null || price === undefined) return null; // Nếu không có dữ liệu, trả về null
            return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(price);
        },
        onCell: () => ({
            style: {
                width: "100px",
                height: "50px",
                lineHeight: "50px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
        }),
    },
    {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (_, {status}) => {
            let color = status === "HOAT_DONG" ? "green" : "red";
            if (!status) {
                return null;
            }
            return (
                <Tag color={color} style={{fontSize: "12px", padding: "5px 15px"}}>
                    {status === "HOAT_DONG" ? "Hoạt động" : "Ngừng hoạt động"}{" "}
                    {/* Hiển thị status với chữ in hoa */}
                </Tag>
            );
        },
    },
    {
        title: "Thao tác",
        dataIndex: "actions",
        key: "actions",
        width: "10rem",
        render: (_, record) => {
            if (!record.status || Object.keys(record).length === 0) {
                return null;
            }
            return (
                <>
                    <Tooltip title="Chọn sản phẩm">
                        <Button
                            type={"primary"}
                            onClick={() => {
                                handleOnAddProductToBill(record)
                            }}
                            style={{marginRight: "1rem"}}
                        >
                            Chọn
                        </Button>
                    </Tooltip>
                </>
            );
        },
    },
];