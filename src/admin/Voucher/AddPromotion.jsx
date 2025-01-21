import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Row, Col, Card, Table, Button, message } from 'antd';
import axios from 'axios';
import { baseUrl } from '../../helpers/Helpers.js';
import moment from 'moment';
import { Link } from 'react-router-dom';
import "./StatusSelector.css";


const { Option } = Select;

const AddPromotion = () => {
    const [promotionData, setPromotionData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingPromotion, setEditingPromotion] = useState(null);
    //
    const [statusIndex, setStatusIndex] = useState(0);

    const statuses = [
      { label: "Đang kích hoạt", color: "green" },
      { label: "Ngừng kích hoạt", color: "red" },
      { label: "Chưa kích hoạt", color: "gray" },
    ];
  
    const toggleStatus = () => {
      setStatusIndex((prevIndex) => (prevIndex + 1) % statuses.length);
    };
  
      
      //


    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <span >{text}</span>
            ),
        },
    ];
    const productData1 = [
        {
            "id": 2,
            "code": "G01",
            "productName": "Adidas",
            "brandName": "Nike",
            "typeName": "Sports Shoes",
            "colorName": "Black",
            "materialName": "Leather",
            "sizeName": "37,38",
            "soleName": "Rubber Sole",
            "genderName": "Nam,Nữ",
            "quantity": 200,
            "price": 89.99,
            "weight": 0.6,
            "descrition": null,
            "status": "HOAT_DONG",
            "updateAt": 1735925166571,
            "updateBy": null,
            img: "https://authentic-shoes.com/wp-content/uploads/2024/01/Giay-Adidas-Forum-Low-Core-Black-IG5513-5-768x334.png"
        },

        {
            "id": 3,
            "code": "G02",
            "productName": "Nike Air Max",
            "brandName": "Nike",
            "typeName": "Sports Shoes",
            "colorName": "White-Red",
            "materialName": "Leather",
            "sizeName": "39,40",
            "soleName": "Rubber Sole",
            "genderName": "Nam,Nữ",
            "quantity": 200,
            "price": 89.99,
            "weight": 0.6,
            "descrition": null,
            "status": "HOAT_DONG",
            "updateAt": 1735925166571,
            "updateBy": null,
            img: "https://authentic-shoes.com/wp-content/uploads/2024/01/Giay-Nike-Air-Jordan-1-Low-SE-Year-of-the-Dragon-FJ5735-100-10-300x139.png"

        }

    ];

    const columns1 = [

        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Ảnh',
            dataIndex: 'img',
            key: 'img',
            render: (imgUrl) => (
                <img
                    src={imgUrl}
                    alt="Sản phẩm"
                    style={{ width: '100px', height: 'auto' }}
                />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Giới tính',
            dataIndex: 'genderName',
            key: 'genderName',
        },
        {
            title: 'Màu',
            dataIndex: 'colorName',
            key: 'colorName',
        },
        {
            title: 'Kích thước',
            dataIndex: 'sizeName',
            key: 'sizeName',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <span >{text}</span>
            ),
        },

    ];

    // Hàm thêm mới phiếu giảm giá
    const [selectedProductDetails, setSelectedProductDetails] = useState([]);
    const handleProductSelection = (selectedRowKeys, selectedRows) => {
        setSelectedProductDetails(selectedRows);
    };

    const rowSelection = {
        type: 'checkbox',
        onChange: handleProductSelection,
    };



    const handleAdd = async () => {
        try {
            const values = await form.validateFields(); // Lấy dữ liệu từ form nếu hợp lệ
            const response = await axios.post(`${baseUrl}/api/admin/promotion/add`, values);
            message.success('Thêm mới phiếu giảm giá thành công!');
            setIsModalOpen(false);
            form.resetFields(); // Reset form
        } catch (error) {
            message.error('Lỗi khi lưu dữ liệu! Vui lòng kiểm tra lại.');
        }
    };

    return (

        <>
        
        <div className="status-selector">
      <h3>Trạng Thái</h3>
      <div
        className="status-display"
        style={{
          backgroundColor: statuses[statusIndex].color,
          color: "white",
          padding: "10px 20px",
          borderRadius: "20px",
          display: "inline-block",
        }}
      >
        {statuses[statusIndex].label}
        <button
          className="toggle-button"
          onClick={toggleStatus}
          style={{
            marginLeft: "10px",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            color: "white",
            fontSize: "16px",
          }}
        >
          👁️
        </button>
      </div>
    </div>

        
        <Row gutter={20}>
            {/* Bảng thêm đợt giảm giá */}
            <Col span={8}>
                <Card title="Thêm đợt giảm giá" bordered>
                    <Form form={form} layout="vertical">
                        <Form.Item name="promotionCode" label="Mã đợt giảm giá" rules={[{ required: true, message: 'Mã đợt giảm giá không được bỏ trống! ' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="promotionName" label="Tên đợt giảm giá" rules={[{ required: true, message: 'Tên đợt giảm giá không được bỏ trống! ' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="promotionType" label="Loại đợt giảm giá" rules={[{ required: true, message: 'Loại đợt giảm giá không được bỏ trống! ' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="discountValue" label="Giá trị giảm(%)" rules={[{ required: true, message: 'Giá trị đợt giảm giá không được bỏ trống! ' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Số lượng đợt giảm giá không được bỏ trống! ' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: 'Thời gian không được bỏ trống! ' }]}>
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: ' Thời gian không được bỏ trống!' }]}>
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Trạng thái đợt giảm giá không được bỏ trống! ' }]}>
                            <Select>
                                <Option value="HOAT_DONG">Hoạt động</Option>
                                <Option value="NGUNG_HOAT_DONG">Tạm ngưng</Option>
                            </Select>
                        </Form.Item>
                        <Link to={"/admin/PromotionList"} >
                            <Button
                                type="primary" htmlType="button" onClick={handleAdd}  style={{
                                    marginBottom: '20px',

                                    border: 'none',
                                }}>
                               

                                Thêm
                            </Button>
                        </Link>

                    </Form>
                </Card>
            </Col>

            {/* Bảng sản phẩm */}
            <Col span={16}>
                <Card title="Sản phẩm" bordered >
                    <Table
                        dataSource={productData1}
                        columns={columns}
                        rowKey="id"
                        rowSelection={rowSelection}
                    />
                </Card>
                <Card title="Sản phẩm chi tiết" >
                    <Table
                        dataSource={selectedProductDetails}
                        columns={columns1}
                        rowKey="id"
                        rowSelection={rowSelection}

                    />
                </Card>
            </Col>
        </Row>
        </>

        
    );
};

export default AddPromotion;
