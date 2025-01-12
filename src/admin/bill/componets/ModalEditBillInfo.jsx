import React from 'react';
import {Form, Input, Select, Button, message} from "antd";
import axios from "axios";
import {baseUrl} from "../../../helpers/Helpers.js";

const { Option } = Select;

const ModalEditBillInfo = ({ currentBill, handleOnEdit }) => {
    const [form] = Form.useForm();


    const onSubmit = async (values) => {
        try {
            const response = await axios.put(`${baseUrl}/api/admin/bill/${currentBill.billCode}/update-info-bill`, values);
            if (response.status === 200) {
                message.success('Cập nhật thành công!');
                handleOnEdit(response.data.data);
            } else {
                message.error('Có lỗi xảy ra khi cập nhật!');
            }
        } catch (error) {
            console.error(error);
            message.error('Có lỗi xảy ra khi cập nhật!');
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            initialValues={{
                billCode: currentBill?.billCode ?? "",
                status: currentBill?.status ?? "DA_THANH_TOAN",
                type: currentBill?.type ?? "ONLINE",
                customerName: currentBill?.customerName ?? "",
                customerPhone: currentBill?.customerPhone ?? "",
                shippingAddress: currentBill?.shippingAddress ?? "",
                note: currentBill?.note ?? "",
            }}
        >
            {/* Các trường form */}
            <Form.Item label={<span className="fw-bold text-black">Mã đơn hàng</span>} name="billCode">
                <Input disabled />
            </Form.Item>
            <Form.Item label={<span className="fw-bold text-black">Trạng thái</span>} name="status">
                <Select disabled>
                    <Option value="DA_THANH_TOAN">Đã thanh toán</Option>
                    <Option value="CHO_THANH_TOAN">Chờ thanh toán</Option>
                    <Option value="DA_HUY">Đã hủy</Option>
                </Select>
            </Form.Item>
            <Form.Item label={<span className="fw-bold text-black">Loại</span>} name="type">
                <Select disabled>
                    <Option value="ONLINE">Online</Option>
                    <Option value="OFFLINE">Offline</Option>
                </Select>
            </Form.Item>
            <Form.Item label={<span className="fw-bold text-black">Tên khách hàng</span>} name="customerName">
                <Input disabled />
            </Form.Item>
            <Form.Item label={<span className="fw-bold text-black">Số điện thoại</span>} name="customerPhone">
                <Input />
            </Form.Item>
            <Form.Item label={<span className="fw-bold text-black">Địa chỉ</span>} name="shippingAddress">
                <Input />
            </Form.Item>
            <Form.Item label={<span className="fw-bold text-black">Ghi chú</span>} name="note">
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Cập nhật
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ModalEditBillInfo;
