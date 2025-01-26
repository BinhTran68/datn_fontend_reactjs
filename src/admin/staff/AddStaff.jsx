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




import React from 'react';
import { Form, Input, Button, Select, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

const { Option } = Select;

const AddStaff = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();  // Initialize useNavigate

    const handleFinish = async (values) => {
        let avatarUrl = '';
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

        const newData = {
            fullName: values.fullName,
            citizenId: values.citizenId,
            phoneNumber: values.phoneNumber,
            email: values.email,
            gender: values.gender,
            dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'),
            status: values.status,
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
            <Form.Item label="Avatar">
                <Upload
                    beforeUpload={() => false}
                    listType="picture"
                >
                    <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Thêm mới
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddStaff;