// import React from 'react';
// import { Form, Input, Button, Select, DatePicker, Upload, message } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import axios from 'axios';
// import moment from 'moment';

// const { Option } = Select;

// const AddStaff = () => {
//     const [form] = Form.useForm();

//     const handleFinish = async (values) => {
//         let avatarUrl = '';
//         if (values.avatar && values.avatar.file) {
//             const formData = new FormData();
//             formData.append('file', values.avatar.file);

//             try {
//                 const uploadRes = await axios.post('http://localhost:8080/api/admin/staff/add', formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 });
//                 avatarUrl = uploadRes.data;
//             } catch (uploadError) {
//                 console.error('Error uploading image:', uploadError);
//                 message.error('Lỗi tải ảnh lên!');
//                 return;
//             }
//         }

//         const newData = {
//             fullName: values.fullName,
//             citizenId: values.citizenId,
//             phoneNumber: values.phoneNumber,
//             email: values.email,
//             gender: values.gender,
//             dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'),
//             status: values.status,
//             avatar: avatarUrl,
//         };

//         axios.post('http://localhost:8080/api/admin/staff/add', newData)
//             .then(() => {
//                 message.success('Thêm nhân viên thành công!');
//                 history.push('/');
//                 form.resetFields();
//                 navigate("/admin/staff")
//             })
//             .catch((error) => {
//                 console.error('Error adding staff:', error);
//                 message.error('Thêm nhân viên thất bại!');
//             });
//     };

//     return (
//         <Form form={form} layout="vertical" onFinish={handleFinish}>
//             <Form.Item
//                 name="fullName"
//                 label="Họ và tên"
//                 rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
//             >
//                 <Input />
//             </Form.Item>
//             <Form.Item
//                 name="citizenId"
//                 label="CCCD"
//                 rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]}
//             >
//                 <Input />
//             </Form.Item>
//             <Form.Item
//                 name="phoneNumber"
//                 label="Số điện thoại"
//                 rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
//             >
//                 <Input />
//             </Form.Item>
//             <Form.Item
//                 name="email"
//                 label="Email"
//                 rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
//             >
//                 <Input />
//             </Form.Item>
//             <Form.Item
//                 name="gender"
//                 label="Giới tính"
//                 rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
//             >
//                 <Select>
//                     <Option value="true">Nam</Option>
//                     <Option value="false">Nữ</Option>
//                 </Select>
//             </Form.Item>
//             <Form.Item
//                 name="dateBirth"
//                 label="Ngày sinh"
//                 rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
//             >
//                 <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime style={{ width: '100%' }} />
//             </Form.Item>
//             <Form.Item
//                 name="status"
//                 label="Trạng thái"
//                 rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
//             >
//                 <Select>
//                     <Option value="1">Kích hoạt</Option>
//                     <Option value="0">Khóa</Option>
//                 </Select>
//             </Form.Item>
//             <Form.Item label="Avatar">
//                 <Upload
//                     beforeUpload={() => false}
//                     listType="picture"
//                 >
//                     <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
//                 </Upload>
//             </Form.Item>
//             <Form.Item>
//                 <Button type="primary" htmlType="submit">
//                     Thêm mới
//                 </Button>
//             </Form.Item>
//         </Form>
//     );
// };

// export default AddStaff;




// import React from 'react';
// import { Form, Input, Button, Select, DatePicker, Upload, message } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

// const { Option } = Select;

// const AddStaff = () => {
//     const [form] = Form.useForm();
//     const navigate = useNavigate();  // Initialize useNavigate

//     const handleFinish = async (values) => {
//         let avatarUrl = '';
//         if (values.avatar && values.avatar.file) {
//             const formData = new FormData();
//             formData.append('file', values.avatar.file);

//             try {
//                 const uploadRes = await axios.post('http://localhost:8080/api/admin/staff/add', formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 });
//                 avatarUrl = uploadRes.data;
//             } catch (uploadError) {
//                 console.error('Error uploading image:', uploadError);
//                 message.error('Lỗi tải ảnh lên!');
//                 return;
//             }
//         }

//         const newData = {
//             fullName: values.fullName,
//             citizenId: values.citizenId,
//             phoneNumber: values.phoneNumber,
//             email: values.email,
//             gender: values.gender,
//             dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'),
//             status: values.status,
//             avatar: avatarUrl,
//         };

//         axios.post('http://localhost:8080/api/admin/staff/add', newData)
//             .then(() => {
//                 message.success('Thêm nhân viên thành công!');
//                 form.resetFields();
//                 navigate("/admin/staff");  // Navigate to Staff page after successful addition
//             })
//             .catch((error) => {
//                 console.error('Error adding staff:', error);
//                 message.error('Thêm nhân viên thất bại!');
//             });
//     };

//     return (
//         <Form form={form} layout="vertical" onFinish={handleFinish}>
//             <Form.Item
//                 name="fullName"
//                 label="Họ và tên"
//                 rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
//             >
//                 <Input />
//             </Form.Item>
//             <Form.Item
//                 name="citizenId"
//                 label="CCCD"
//                 rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]}
//             >
//                 <Input />
//             </Form.Item>
//             <Form.Item
//                 name="phoneNumber"
//                 label="Số điện thoại"
//                 rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
//             >
//                 <Input />
//             </Form.Item>
//             <Form.Item
//                 name="email"
//                 label="Email"
//                 rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
//             >
//                 <Input />
//             </Form.Item>
//             <Form.Item
//                 name="gender"
//                 label="Giới tính"
//                 rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
//             >
//                 <Select>
//                     <Option value="true">Nam</Option>
//                     <Option value="false">Nữ</Option>
//                 </Select>
//             </Form.Item>
//             <Form.Item
//                 name="dateBirth"
//                 label="Ngày sinh"
//                 rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
//             >
//                 <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime style={{ width: '100%' }} />
//             </Form.Item>
//             <Form.Item
//                 name="status"
//                 label="Trạng thái"
//                 rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
//             >
//                 <Select>
//                     <Option value="1">Kích hoạt</Option>
//                     <Option value="0">Khóa</Option>
//                 </Select>
//             </Form.Item>
//             <Form.Item label="Avatar">
//                 <Upload
//                     beforeUpload={() => false}
//                     listType="picture"
//                 >
//                     <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
//                 </Upload>
//             </Form.Item>
//             <Form.Item>
//                 <Button type="primary" htmlType="submit">
//                     Thêm mới
//                 </Button>
//             </Form.Item>
//         </Form>
//     );
// };

// export default AddStaff;





import React, { useState } from 'react';
import { Form, Input, Button, Select, DatePicker, Upload, message, Row, Col, Card, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

const AddStaff = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();  // Initialize useNavigate
    const [fileList, setFileList] = useState([]);

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

    const handleFinish = async (values) => {
        let avatarUrl = '';
        if (fileList.length > 0 && fileList[0].originFileObj) {
            const formData = new FormData();
            formData.append('file', fileList[0].originFileObj);

            try {
                const uploadRes = await axios.post('http://localhost:8080/api/admin/staff/upload', formData, {
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
            citizenId: values.citizenId,
            phoneNumber: values.phoneNumber,
            email: values.email,
            gender: values.gender,
            dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'),
            status: 1, // Set status to 'Kích hoạt'
            avatar: avatarUrl,
        };

        axios.post('http://localhost:8080/api/admin/staff/add', newData)
            .then(() => {
                message.success('Thêm nhân viên thành công!');
                form.resetFields();
                navigate("/admin/staff");  // Navigate to Staff page after successful addition
            })
            .catch((error) => {
                console.error('Error adding staff:', error);
                message.error('Thêm nhân viên thất bại!');
            });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#1890ff', marginBottom: '20px' }}>Thêm mới nhân viên</h2>

            <Row gutter={16}>
                <Col span={6}>
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
                </Col>

                <Col span={18}>
                    <Card>
                        <Form form={form} layout="vertical" onFinish={handleFinish}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="fullName"
                                        label="Họ và tên"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
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
                                        name="citizenId"
                                        label="CCCD"
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
                                            <Radio value="true">Nam</Radio>
                                            <Radio value="false">Nữ</Radio>
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

                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                                    Thêm mới
                                </Button>
                                <Button onClick={() => navigate('/admin/staff')}>Hủy</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AddStaff;