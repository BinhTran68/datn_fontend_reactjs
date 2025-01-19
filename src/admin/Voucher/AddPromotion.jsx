import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Row, Col, Card, Table, Button, message } from 'antd';
import axios from 'axios';
import { baseUrl } from '../../helpers/Helpers.js';
import moment from 'moment';
import { Link } from 'react-router-dom';

const { Option } = Select;

const AddPromotion = () => {
 const [promotionData, setPromotionData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingPromotion, setEditingPromotion] = useState(null);

    // Dữ liệu giả cho bảng sản phẩm
    const productData = [
      
    ];

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <span style={{ color: 'green', fontWeight: 'bold' }}>{text}</span>
            ),
        },
    ];

    // Hàm thêm mới phiếu giảm giá
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
        <Row gutter={20}>
            {/* Bảng thêm đợt giảm giá */}
            <Col span={8}>
                <Card title="Thêm đợt giảm giá" bordered>
                    <Form form={form} layout="vertical">
                        <Form.Item name="promotionCode" label="Mã đợt giảm giá" rules={[{ required: true,message:'Mã đợt giảm giá không được bỏ trống! ' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="promotionName" label="Tên đợt giảm giá" rules={[{ required: true ,message:'Tên đợt giảm giá không được bỏ trống! '}]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="promotionType" label="Loại đợt giảm giá" rules={[{ required: true ,message:'Loại đợt giảm giá không được bỏ trống! '}]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true,message:'Giá trị đợt giảm giá không được bỏ trống! ' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="quantity" label="Số lượng" rules={[{ required: true ,message:'Số lượng đợt giảm giá không được bỏ trống! '}]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true,message:'Thời gian không được bỏ trống! ' }]}>
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true,message:' Thời gian không được bỏ trống!' }]}>
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái" rules={[{ required: true,message:'Trạng thái đợt giảm giá không được bỏ trống! ' }]}>
                            <Select>
                                <Option value="HOAT_DONG">Hoạt động</Option>
                                <Option value="NGUNG_HOAT_DONG">Tạm ngưng</Option>
                            </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="button" onClick={handleAdd}>
                            Thêm
                        </Button>
                    </Form>
                </Card>
            </Col>

            {/* Bảng sản phẩm */}
            <Col span={16}>
                <Card title="Sản phẩm" bordered>
                    <Table
                        dataSource={productData}
                        columns={columns}
                        // pagination={{ pageSize: 5 }}
                        rowSelection={{ type: 'checkbox' }}
                    />
                </Card>
                <Card title="Sản phẩm chi tiết" >
                <Table
                        dataSource={productData}
                        columns={columns}
                        // pagination={{ pageSize: 5 }}
                        rowSelection={{ type: 'checkbox' }}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default AddPromotion;
