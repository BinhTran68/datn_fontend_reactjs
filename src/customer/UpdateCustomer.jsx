import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Select, DatePicker, Button, Upload, message, Row, Col, Card, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import AddressSelectorAntd from "../admin/utils/AddressSelectorAntd.jsx";

const { Option } = Select;
const { Password } = Input;

const UpdateCustomer = () => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [address, setAddress] = useState({
        provinceId: null,
        districtId: null,
        wardId: null,
        specificAddress: null,
    });
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        fetchCustomer(id);
    }, [id]);

    const fetchCustomer = (id) => {
        axios.get(`http://localhost:8080/api/customers/detail/${id}`)
            .then((response) => {
                const customer = response.data;
                setSelectedRecord(customer);

                const addressParts = customer.address ? customer.address.split(', ') : [];
                const specific = addressParts[0] || '';
                const wardName = addressParts[1] || '';
                const districtName = addressParts[2] || '';
                const provinceName = addressParts[3] || '';

                // Assuming you have a way to get provinceId, districtId, and wardId from their names


                form.setFieldsValue({
                    ...customer,
                    fullName: customer.fullName,
                    CitizenId: customer.citizenId,
                    phoneNumber: customer.phoneNumber,
                    email: customer.email,
                    gender: customer.gender,
                    dateBirth: moment(customer.dateBirth, 'YYYY-MM-DD HH:mm:ss'),
                    status: customer.status === 'Kích hoạt' ? 0 : 1,
                    password: customer.password,
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

                const updatedData = {
                    fullName: values.fullName,
                    citizenId: values.CitizenId,
                    phoneNumber: values.phoneNumber,
                    email: values.email,
                    gender: values.gender,
                    dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'),
                    status: values.status,
                    avatar: avatarUrl,
                    provinceId: address.provinceId,
                    districtId: address.districtId,
                    wardId: address.wardId,
                    specificAddress: address.specificAddress,
                    password: values.password,
                };

                axios.put(`http://localhost:8080/api/customers/update/${selectedRecord.id}`, updatedData)
                    .then(() => {
                        message.success('Cập nhật khách hàng thành công!');
                        navigate("/admin/customer")
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

    const handleAddressChange = (provinceId, districtId, wardId, specificAddress) => {
        setAddress({ ...address, districtId: districtId, provinceId: provinceId, wardId: wardId, specificAddress: specificAddress });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#1890ff', marginBottom: '20px' }}>Chỉnh sửa khách hàng</h2>

            <Row gutter={16}>
                {/* <Col span={6}>
                    <Card>
                        <Form.Item label="Ảnh đại diện">
                            <Upload
                                action=""
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleAvatarChange}
                                beforeUpload={beforeUpload}
                            >
                                {fileList.length < 1 && '+ Upload'}
                            </Upload>
                        </Form.Item>
                    </Card>
                </Col> */}

                <Col span={18}>
                    <Card>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="fullName"
                                        label="Tên khách hàng"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="dateBirth"
                                        label="Ngày sinh"
                                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                                    >
                                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="CitizenId"
                                        label="Căn cước công dân"
                                        rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="gender"
                                        label="Giới tính"
                                        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                                    >
                                        <Radio.Group>
                                            <Radio value={true}>Nam</Radio>
                                            <Radio value={false}>Nữ</Radio>
                                        </Radio.Group>
                                    </Form.Item>

                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="phoneNumber"
                                        label="Số điện thoại"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Địa chỉ">
                                <AddressSelectorAntd
                                    provinceId={address.provinceId}
                                    districtId={address.districtId}
                                    wardId={address.wardId}
                                    specificAddressDefault={address.specificAddress}
                                    onAddressChange={handleAddressChange}
                                />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="status"
                                        label="Trạng thái"
                                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                                    >
                                        <Select>
                                            <Option value={1}>Kích hoạt</Option>
                                            <Option value={0}>Khóa</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="password"
                                        label="Mật khẩu"
                                    >
                                        <Password />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item>
                                <Button type="primary" onClick={handleOk} style={{ marginRight: '10px' }}>
                                    Lưu
                                </Button>
                                <Button onClick={() => navigate('/admin/customer')}>Hủy</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default UpdateCustomer;