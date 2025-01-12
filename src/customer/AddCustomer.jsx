import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Radio, Select, Button, Upload, Space } from 'antd';
import { UploadOutlined, QrcodeOutlined } from '@ant-design/icons';

const { Option } = Select;

const MyForm = () => {
    const [form] = Form.useForm();
    const [selectedCity, setSelectedCity] = useState(null);

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleCityChange = (value) => {
        setSelectedCity(value);
        form.setFieldsValue({
            quanHuyen: undefined,
            xaPhuong: undefined,
        });
    };

    // Sample data for demonstration - Replace with your actual data
    const cities = {
        hanoi: {
            name: 'Hà Nội',
            districts: {
                badinh: {
                    name: 'Ba Đình',
                    wards: ['Phúc Xá', 'Trúc Bạch', 'Vĩnh Phúc']
                },
                hoankiem: {
                    name: 'Hoàn Kiếm',
                    wards: ['Chương Dương Độ', 'Cửa Đông', 'Cửa Nam']
                }
                // Add more districts and wards for Hanoi
            }
        },
        hochiminh: {
            name: 'Hồ Chí Minh',
            districts: {
                quan1: {
                    name: 'Quận 1',
                    wards: ['Bến Nghé', 'Bến Thành', 'Cô Giang']
                },
                quan3: {
                    name: 'Quận 3',
                    wards: ['Phường 1', 'Phường 2', 'Phường 3']
                }
                // Add more districts and wards for Ho Chi Minh
            }
        }
        // Add more cities, districts, and wards
    };

    useEffect(() => {
        // Reset dependent fields when city changes
        if (selectedCity) {
          form.setFieldsValue({
            quanHuyen: undefined,
            xaPhuong: undefined,
          });
        }
    }, [selectedCity, form]);

    return (
        <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{ maxWidth: 600 }}
        >

            <Form.Item label="Ảnh đại diện">
                <Upload>
                    <div style={{
                        width: 108,
                        height: 108,
                        borderRadius: '50%',
                        border: '1px dashed #d9d9d9',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}>
                        <UploadOutlined style={{ fontSize: 24 }} />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                </Upload>
            </Form.Item>


            <Form.Item
                label="Tên khách hàng"
                name="tenKhachHang"
                rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
            >
                <Input placeholder="Tên khách hàng" />
            </Form.Item>

            <Form.Item
                label="Căn cước công dân"
                name="cccd"
                rules={[{ required: true, message: 'Vui lòng nhập căn cước công dân!' }]}
            >
                <Input placeholder="CCCD" />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                ]}
            >
                <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
                label="Tỉnh/Thành phố"
                name="tinhThanhPho"
                rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố!' }]}
            >
                <Select placeholder="--Chọn Tỉnh/Thành phố--" onChange={handleCityChange}>
                    {Object.keys(cities).map(cityKey => (
                        <Option key={cityKey} value={cityKey}>{cities[cityKey].name}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Quận/Huyện"
                name="quanHuyen"
                rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện!' }]}
                hidden={!selectedCity} 
            >
                <Select placeholder="--Chọn Quận/Huyện--">
                    {selectedCity && Object.keys(cities[selectedCity].districts).map(districtKey => (
                        <Option key={districtKey} value={districtKey}>{cities[selectedCity].districts[districtKey].name}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Xã/Phường"
                name="xaPhuong"
                rules={[{ required: true, message: 'Vui lòng chọn Xã/Phường!' }]}
                hidden={!form.getFieldValue('quanHuyen')}
            >
                <Select placeholder="--Chọn Xã/Phường--">
                    {selectedCity && form.getFieldValue('quanHuyen') && cities[selectedCity].districts[form.getFieldValue('quanHuyen')].wards.map((ward, index) => (
                        <Option key={index} value={ward}>{ward}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Trạng thái"
                name="trangThai"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
                <Select placeholder="Kích hoạt">
                    <Option value="kichhoat">Kích hoạt</Option>
                    <Option value="khongkichhoat">Không kích hoạt</Option>
                    {/* Add more options if needed */}
                </Select>
            </Form.Item>


            <Form.Item
                label="Ngày sinh"
                name="ngaySinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
                <DatePicker style={{ width: '100%' }} placeholder="dd/mm/yyyy" format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item
                label="Giới tính"
                name="gioiTinh"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
                <Radio.Group>
                    <Radio value="nam">Nam</Radio>
                    <Radio value="nu">Nữ</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label="Số điện thoại"
                name="soDienThoai"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
                <Input placeholder="Số điện thoại" />
            </Form.Item>

            

            <Form.Item
                label="Số nhà/Ngõ/Đường"
                name="soNha"
                rules={[{ required: true, message: 'Vui lòng nhập Số nhà/Ngõ/Đường!' }]}
            >
                <Input placeholder="Số nhà/Ngõ/Đường" />
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">
                        Thêm
                    </Button>
                    <Button htmlType="button" onClick={() => form.resetFields()}>
                        Hủy
                    </Button>
                    <Button icon={<QrcodeOutlined />} >
                        Quét QR
                    </Button>
                </Space>
            </Form.Item>



        </Form>
    );
};

export default MyForm;