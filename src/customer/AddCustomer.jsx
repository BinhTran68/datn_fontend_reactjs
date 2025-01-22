import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Select, DatePicker, Button, Upload, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { Password } = Input;

const AddCustomer = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [specificAddress, setSpecificAddress] = useState('');

    useEffect(() => {
        fetchProvinces();
    }, []);

    const fetchProvinces = () => {
        axios.get('https://provinces.open-api.vn/api/p/')
            .then(response => {
                setProvinces(response.data);
            })
            .catch(error => {
                console.error('Error fetching provinces:', error);
            });
    };

    const fetchDistricts = (provinceCode) => {
        if (!provinceCode) return;
        axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}/?depth=2`)
            .then(response => {
                setDistricts(response.data.districts);
            })
            .catch(error => {
                console.error('Error fetching districts:', error);
            });
    };

    const fetchWards = (districtCode) => {
        if (!districtCode) return;
        axios.get(`https://provinces.open-api.vn/api/d/${districtCode}/?depth=2`)
            .then(response => {
                setWards(response.data.wards);
            })
            .catch(error => {
                console.error('Error fetching wards:', error);
            });
    };

    const handleProvinceChange = (value) => {
        setSelectedProvince(value);
        setDistricts([]);
        setSelectedDistrict(null);
        setWards([]);
        setSelectedWard(null);
        fetchDistricts(value);
    };

    const handleDistrictChange = (value) => {
        setSelectedDistrict(value);
        setWards([]);
        setSelectedWard(null);
        fetchWards(value);
    };

    const handleWardChange = (value) => {
        setSelectedWard(value);
    };

    const handleSpecificAddressChange = (e) => {
        setSpecificAddress(e.target.value);
    };

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

                let fullAddress = specificAddress;

                if (selectedWard) {
                    const selectedWardName = wards.find(w => w.code === selectedWard)?.name;
                    fullAddress += `, ${selectedWardName}`;
                }

                if (selectedDistrict) {
                    const selectedDistrictName = districts.find(d => d.code === selectedDistrict)?.name;
                    fullAddress += `, ${selectedDistrictName}`;
                }

                if (selectedProvince) {
                    const selectedProvinceName = provinces.find(p => p.code === selectedProvince)?.name;
                    fullAddress += `, ${selectedProvinceName}`;
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
                    address: fullAddress, // Combine address parts
                    password: values.password // Include password
                };

                // Create
                axios.post('http://localhost:8080/api/customers/add', newData)
                    .then(() => {
                        message.success('Thêm khách hàng thành công!');
                        form.resetFields();
                        setFileList([]);
                        setSelectedProvince(null);
                        setSelectedDistrict(null);
                        setSelectedWard(null);
                        setSpecificAddress('');
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

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#1890ff', marginBottom: '20px' }}>Thêm mới khách hàng</h2>
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
                        format="YYYY-MM-DD HH:mm:ss"
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
                <Form.Item label="Địa chỉ">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Tỉnh"
                                labelCol={{ span: 12 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Select
                                    value={selectedProvince || null}
                                    onChange={handleProvinceChange}
                                    placeholder="Chọn tỉnh/thành phố"
                                >
                                    {provinces.map(province => (
                                        <Option key={province.code} value={province.code}>
                                            {province.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Huyện"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Select
                                    value={selectedDistrict || null}
                                    onChange={handleDistrictChange}
                                    placeholder="Chọn quận/huyện"
                                    disabled={!selectedProvince}
                                >
                                    {districts.map(district => (
                                        <Option key={district.code} value={district.code}>
                                            {district.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Xã"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Select
                                    value={selectedWard || null}
                                    onChange={handleWardChange}
                                    placeholder="Chọn xã/phường"
                                    disabled={!selectedDistrict}
                                >
                                    {wards.map(ward => (
                                        <Option key={ward.code} value={ward.code}>
                                            {ward.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số nhà/ngõ đường"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Input
                                    value={specificAddress}
                                    onChange={handleSpecificAddressChange}
                                    placeholder="Ngõ/tên đường ..."
                                />
                            </Form.Item>
                        </Col>
                    </Row>
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
        </div>
    );
};

export default AddCustomer;