import React, { useEffect, useState } from 'react';
import { Space, Table, Input, DatePicker, Select, Card, Button, Modal, Form, message, Row, Col, theme } from 'antd';
import axios from 'axios';
import { baseUrl } from '../../helpers/Helpers.js';
import moment from 'moment';
const AddPromotion = () => {
    const [form] = Form.useForm();
    return (
<>
<Form form={form} layout="vertical"  >
                        <Form.Item name="promotionCode" label="Mã đợt giảm giá" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="promotionName" label="Tên đợt giảm giá" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="promotionType" label="Loại đợt giảm giá" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                            <Select>
                                <Option value="HOAT_DONG">Hoạt động</Option>
                                <Option value="NGUNG_HOAT_DONG">Tạm ngưng</Option>
                            </Select>
                        </Form.Item>
                    </Form>


</>
    );
};

export default AddPromotion;
