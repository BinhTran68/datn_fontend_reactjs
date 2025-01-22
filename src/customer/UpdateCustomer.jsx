import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Select, DatePicker, Button, Upload, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const { Option } = Select;
const { Password } = Input;

const UpdateCustomer = () => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const [fileList, setFileList] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [specificAddress, setSpecificAddress] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        fetchProvinces();
        fetchCustomer(id);
    }, [id]);

    const fetchProvinces = () => {
        axios.get('https://provinces.open-api.vn/api/p/')
            .then(response => {
                setProvinces(response.data);
            })
            .catch(error => {
                console.error('Error fetching provinces:', error);
            });
    };

    const fetchCustomer = (id) => {
        axios.get(`http://localhost:8080/api/customers/${id}`)
            .then((response) => {
                const customer = response.data;
                setSelectedRecord(customer);

                const addressParts = customer.address ? customer.address.split(', ') : [];
                let specific = '';
                let provinceName = '';
                let districtName = '';
                let wardName = '';
                if (addressParts.length === 4) {
                    specific = addressParts[0] || '';
                    wardName = addressParts[1] || '';
                    districtName = addressParts[2] || '';
                    provinceName = addressParts[3] || '';
                } else if (addressParts.length === 3) {
                    wardName = addressParts[0] || '';
                    districtName = addressParts[1] || '';
                    provinceName = addressParts[2] || '';
                }

                const province = provinces.find(p => p.name === provinceName);
                const provinceCode = province ? province.code : null;
                const district = districts.find(d => d.name === districtName);
                const districtCode = district ? district.code : null;

                setSelectedProvince(provinceCode);
                fetchDistricts(provinceCode);
                setSelectedDistrict(districtCode);
                fetchWards(districtCode)
                setSpecificAddress(specific);

                form.setFieldsValue({
                    ...customer,
                    fullName: customer.fullName,
                    CitizenId: customer.citizenId,
                    phoneNumber: customer.phoneNumber,
                    email: customer.email,
                    gender: customer.gender  === "Nam" ? 1 : 0,
                    dateBirth: moment(customer.dateBirth, 'YYYY-MM-DD HH:mm:ss'),  // Handle datetime format
                    status: customer.status === 'Kích hoạt' ? 1 : 0,
                    password: customer.password // Set password field
                });

                if (customer.avatar) {
                    setFileList([{
                        uid: '-1',
                        name: 'avatar',
                        status: 'done',
                        url: customer.avatar,
                    }]);
                }
            })
            .catch(error => {
                console.error('Error fetching customer:', error);
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
                let avatarUrl = selectedRecord && selectedRecord.avatar ? selectedRecord.avatar : ''; // Keep existing avatar if not changed

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

                const updatedData = {
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

                // Update
                axios.put(`http://localhost:8080/api/customers/update/${selectedRecord.id}`, updatedData)
                    .then(() => {
                        message.success('Cập nhật khách hàng thành công!');
                    })
                    .catch((error) => {
                        console.error('Error updating customer:', error);
                        message.error('Cập nhật khách hàng thất bại!');
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#1890ff', marginBottom: '20px' }}>Chỉnh sửa khách hàng</h2>
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
                    rules={[{ required: false, message: 'Vui lòng nhập mật khẩu!' }]}
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

export default UpdateCustomer;