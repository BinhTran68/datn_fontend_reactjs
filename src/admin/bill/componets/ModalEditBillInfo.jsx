import React, {useEffect, useState} from 'react';
import {Form, Input, Select, Button, message} from "antd";
import axios from "axios";
import {baseUrl} from "../../../helpers/Helpers.js";
import AddressSelectorAntd from "../../utils/AddressSelectorAntd.jsx";
import {toast} from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance.js";

const {Option} = Select;

const ModalEditBillInfo = ({currentBill, handleOnEdit}) => {
    const [form] = Form.useForm();

    const [address, setAddress] = useState({
        provinceId: null,
        districtId: null,
        wardId: null,
        specificAddress: null,
    })

    useEffect(() => {
        // Set các giá trị mặc định khi component render
        if (currentBill?.address) {
            form.setFieldsValue({
                provinceId: currentBill?.address?.provinceId ?? null,
                districtId: currentBill?.address?.districtId ?? null,
                wardId: currentBill?.address?.wardId ?? null,
                specificAddress: currentBill?.address?.specificAddress ?? "",
            });
        }
    }, [currentBill, form]);

    const onSubmit = async (values) => {

        try {

            const payload = {
                ...values,
                provinceId: address.provinceId,
                districtId: address.districtId,
                wardId: address.wardId,
                specificAddress: address.specificAddress,

            };

            const response = await axiosInstance.put(`${baseUrl}/api/admin/bill/${currentBill.billCode}/update-info-bill`, payload);
            if (response.status === 200) {
                toast.success("Cập nhật hóa đơn thành công")
                handleOnEdit(response.data.data);
            } else {
                toast.error('Có lỗi xảy ra khi cập nhật!');
            }
        } catch (error) {
            toast.error(error);
            toast.error('Có lỗi xảy ra khi cập nhật!');
        }
    };

    const handleAddressChange = (provinceId, districtId, wardId, specificAddress) => {
        setAddress({...address, districtId: districtId, provinceId: provinceId, wardId: wardId, specificAddress: specificAddress})
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
                email: currentBill?.email ?? "",
                note: currentBill?.note ?? "",
                provinceId: currentBill?.address?.provinceId ?? null,
                districtId: currentBill?.address?.districtId ?? null,
                wardId: currentBill?.address?.wardId ?? null,
                specificAddress: currentBill?.address?.specificAddress ?? "",
            }}
        >
            <h5>Chỉnh sửa hóa đơn</h5>
            <hr/>
            {/* Các trường form */}
            <Form.Item label={<span className="fw-bold text-black">Mã đơn hàng</span>} name="billCode">
                <Input disabled/>
            </Form.Item>
            <Form.Item label={<span className="fw-bold text-black">Loại Hóa Đơn</span>} name="type">
                <Select disabled>
                    <Option value="ONLINE">Online</Option>
                    <Option value="OFFLINE">Offline</Option>
                </Select>
            </Form.Item>
            <Form.Item label={<span className="fw-bold text-black">Tên khách hàng</span>} name="customerName">
                <Input />
            </Form.Item>
            <Form.Item label={<span className="fw-bold text-black">Email khách hàng</span>} name="email">
                <Input />
            </Form.Item>
            <Form.Item label={<span className="fw-bold text-black">Số điện thoại</span>} name="customerPhone">
                <Input/>
            </Form.Item>
            <Form.Item name="address">
                <AddressSelectorAntd
                    provinceId={parseInt(currentBill?.address?.provinceId) ?? null}
                    districtId={parseInt(currentBill?.address?.districtId) ?? null}
                    wardId={parseInt(currentBill?.address?.wardId) ?? null}
                    specificAddressDefault={currentBill?.address?.specificAddress ?? null}
                    onAddressChange={handleAddressChange} // Pass the callback to update the form
                />
            </Form.Item>
            <Form.Item label={<span className="fw-bold text-black">Ghi chú</span>} name="note">
                <Input.TextArea rows={4}/>
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
