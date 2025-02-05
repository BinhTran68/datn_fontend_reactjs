import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Form, Input, Button, Select, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const EditStaff = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate(); // Initialize useNavigate
    const [loading, setLoading] = useState(true); // State to manage loading
    const [staff, setStaff] = useState(null); // State to store staff details

    useEffect(() => {
        const staffId = location.pathname.split('/').pop(); // Extract staff ID from URL
        // Fetch staff details using the detail endpoint
        axios.get(`http://localhost:8080/api/admin/staff/detail/${staffId}`)
            .then((response) => {
                const staffData = response.data;
                setStaff(staffData);
                form.setFieldsValue({
                    ...staffData,
                    dateBirth: moment(staffData.dateBirth, 'YYYY-MM-DDTHH:mm:ss'),
                    status: staffData.status === 'Kích hoạt' ? 1 : 0,
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching staff details:', error);
                message.error('Lỗi tải dữ liệu nhân viên!');
                setLoading(false);
            });
    }, [location.pathname, form]);

    const handleFinish = async (values) => {
        let avatarUrl = staff.avatar || '';
        if (values.avatar && values.avatar.file) {
            const formData = new FormData();
            formData.append('file', values.avatar.file);

            try {
                const uploadRes = await axios.post('http://localhost:8080/api/admin/staff/add', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                avatarUrl = uploadRes.data;
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                message.error('Lỗi tải ảnh lên!');
                return;
            }
        }

        const updatedData = {
            fullName: values.fullName,
            citizenId: values.citizenId,
            phoneNumber: values.phoneNumber,
            email: values.email,
            gender: values.gender,
            dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'),
            status: values.status,
            avatar: avatarUrl,
        };

        axios.put(`http://localhost:8080/api/admin/staff/update/${staff.id}`, updatedData)
            .then(() => {
                message.success('Cập nhật nhân viên thành công!');
                navigate('/admin/staff'); // Navigate back to the staff list
            })
            .catch((error) => {
                console.error('Error updating staff:', error);
                message.error('Cập nhật nhân viên thất bại!');
            });
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading message while fetching data
    }

    return (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="citizenId"
                label="CCCD"
                rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
                <Select>
                    <Option value="true">Nam</Option>
                    <Option value="false">Nữ</Option>
                </Select>
            </Form.Item>
            <Form.Item
                name="dateBirth"
                label="Ngày sinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
                <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
                <Select>
                    <Option value="1">Kích hoạt</Option>
                    <Option value="0">Khóa</Option>
                </Select>
            </Form.Item>
            <Form.Item label="Avatar" name="avatar">
                <Upload
                    beforeUpload={() => false}
                    listType="picture"
                >
                    <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Cập nhật
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditStaff;