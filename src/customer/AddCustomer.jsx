import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Form, Input, Select, DatePicker, Button, Upload, message, Row, Col, Card} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import AddressSelectorAntd from "../admin/utils/AddressSelectorAntd.jsx";
import {useNavigate} from "react-router";

const { Option } = Select;
const { Password } = Input;

const AddCustomer = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate();

    const handleAvatarChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                let avatarUrl = ''; // Initialize avatar URL
                // Handle file upload (if a new file is selected)
                if (fileList.length > 0 && fileList[0].originFileObj) {
                    const formData = new FormData();
                    formData.append('file', fileList[0].originFileObj);

                    try {
                        const uploadRes = await axios.post('http://localhost:8080/api/customers/upload', formData, {
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
                const newData = {
                    fullName: values.fullName,
                    citizenId: values.CitizenId,
                    phoneNumber: values.phoneNumber,
                    email: values.email,
                    gender: values.gender,
                    dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'),
                    status: values.status,
                    avatar: avatarUrl,
                    password: values.password, // Include password,
                    provinceId: address.provinceId,
                    districtId: address.districtId,
                    wardId: address.provinceId,
                    specificAddress: address.specificAddress,
                };

                // Create
                axios.post('http://localhost:8080/api/customers/add', newData)
                    .then(() => {
                        message.success('Thêm khách hàng thành công!');
                        form.resetFields();
                        navigate("/admin/customer")
                    })
                    .catch((error) => {
                        console.error('Error adding customer:', error);
                        message.error('Thêm khách hàng thất bại!');
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const [address, setAddress] = useState({
        provinceId: null,
        districtId: null,
        wardId: null,
        specificAddress: null,
    })

    const handleAddressChange = (provinceId, districtId, wardId, specificAddress) => {
        setAddress({...address, districtId: districtId, provinceId: provinceId, wardId: wardId, specificAddress: specificAddress})
    };


    const currentBill = {

    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#1890ff', marginBottom: '20px' }}>Thêm mới khách hàng</h2>

            <Row>
                <Col span={5} >
                    <Card>
                        <h1>
                            Chỗ add ảnh
                        </h1>
                    </Card>
                </Col>

                <Col span={1} >

                </Col>

                <Col span={18} >
                    <Card>
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="fullName"
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="CitizenId"
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
                                <DatePicker
                                    format="YYYY-MM-DD "
                                    showTime
                                    style={{ width: '100%' }}
                                />
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
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            >
                                <Password />
                            </Form.Item>
                            <Form.Item>
                                <AddressSelectorAntd
                                    provinceId={parseInt(currentBill?.address?.provinceId) ?? null}
                                    districtId={parseInt(currentBill?.address?.districtId) ?? null}
                                    wardId={parseInt(currentBill?.address?.wardId) ?? null}
                                    specificAddressDefault={currentBill?.address?.specificAddress ?? null}
                                    onAddressChange={handleAddressChange} // Pass the callback to update the form
                                />
                            </Form.Item>

                            <Form.Item label="Avatar">
                                <Upload
                                    action=""
                                    fileList={fileList}
                                    onChange={handleAvatarChange}
                                    beforeUpload={beforeUpload}
                                >
                                    <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" onClick={handleOk}>
                                    Lưu
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

        </div>
    );
};

export default AddCustomer;