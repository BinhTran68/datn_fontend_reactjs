import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Select, DatePicker, Button, Upload, message, Row, Col, Card, Radio, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import AddressSelectorAntd from "../admin/utils/AddressSelectorAntd.jsx";
import { useNavigate } from "react-router";
import { QrReader } from 'react-qr-reader';

const { Option } = Select;

const AddCustomer = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate();
    const [address, setAddress] = useState({
        provinceId: null,
        districtId: null,
        wardId: null,
        specificAddress: null,
    });
    const [qrModalVisible, setQrModalVisible] = useState(false);

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

    const generateRandomPassword = () => {
        const length = 8;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    };

    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                let avatarUrl = ''; // Initialize avatar URL
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

                const newPassword = generateRandomPassword();

                const newData = {
                    fullName: values.fullName,
                    citizenId: values.CitizenId,
                    phoneNumber: values.phoneNumber,
                    email: values.email,
                    gender: values.gender,
                    dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'),
                    status: 1, // Set status to 'Kích hoạt'
                    avatar: avatarUrl,
                    password: newPassword, // Automatically generated password
                    provinceId: address.provinceId,
                    districtId: address.districtId,
                    wardId: address.provinceId,
                    specificAddress: address.specificAddress,
                };

                axios.post('http://localhost:8080/api/customers/add', newData)
                    .then(() => {
                        message.success(`Thêm khách hàng thành công! Mật khẩu là: ${newPassword}`);
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

    const handleAddressChange = (provinceId, districtId, wardId, specificAddress) => {
        setAddress({ ...address, districtId: districtId, provinceId: provinceId, wardId: wardId, specificAddress: specificAddress });
    };

    

    const handleScanSuccess = (result) => {
        console.log("result ", result)
        if (result?.text) {
            // Extract only numeric values (CCCD number) and get the first 12 digits
            const numericValue = result.text.replace(/\D/g, '').slice(0, 12); // Remove non-numeric characters and take the first 12 digits
            
            // Ensure the extracted value has exactly 12 digits
            if (numericValue.length === 12) {
                form.setFieldsValue({ CitizenId: numericValue });
                message.success(`Quét thành công: ${numericValue}`);
            } else {
                message.error('Dữ liệu quét không hợp lệ! Chỉ nhận số CCCD hợp lệ gồm 12 chữ số.');
            }
    
            setQrModalVisible(false);
        } else {
            message.error('Không tìm thấy dữ liệu CCCD từ mã QR!');
        }
    };
    
    
    return (
        <div style={{ padding: '20px' }}>
            <h2 >Thêm mới khách hàng</h2>

            <Row gutter={24}>

                <Col span={24}>
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

                            <Form.Item label="Địa chỉ">
                                <AddressSelectorAntd
                                    provinceId={address.provinceId}
                                    districtId={address.districtId}
                                    wardId={address.wardId}
                                    specificAddressDefault={address.specificAddress}
                                    onAddressChange={handleAddressChange}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" onClick={handleOk} style={{ marginRight: '10px' }}>
                                    Thêm
                                </Button>
                                <Button onClick={() => navigate('/admin/customer')} style={{ marginRight: '10px' }}>
                                    Hủy
                                </Button>
                                <Button onClick={() => setQrModalVisible(true)}>Quét QR</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Quét mã QR CCCD"
                visible={qrModalVisible}
                onCancel={() => setQrModalVisible(false)}
                footer={null}
            >
                <QrReader
                    // constraints={{ facingMode: 'environment' }}
                    // onResult={(result, error) => {
                    //     if (result) handleScanSuccess(result);
                    //     if (error) console.warn(error);
                    // }}
                    // style={{ width: '100%' }}
                    constraints={{ facingMode: 'environment' }}
                    onResult={(result, error) => {
                        if (result) handleScanSuccess(result);
                        if (error) console.warn('QR Error:', error);
                    }}
                    style={{ width: '100%' }}
                />
            </Modal>
        </div>
    );
};

export default AddCustomer;





// import React, { useState } from 'react';
// import axios from 'axios';
// import { Form, Input, Select, DatePicker, Button, Upload, message, Row, Col, Card, Radio, Modal } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import moment from 'moment';
// import AddressSelectorAntd from "../admin/utils/AddressSelectorAntd.jsx";
// import { useNavigate } from "react-router";
// import { QrReader } from 'react-qr-reader';

// const { Option } = Select;

// const AddCustomer = () => {
//     const [form] = Form.useForm();
//     const [fileList, setFileList] = useState([]);
//     const navigate = useNavigate();
//     const [address, setAddress] = useState({
//         provinceId: null,
//         districtId: null,
//         wardId: null,
//         specificAddress: null,
//     });
//     const [qrModalVisible, setQrModalVisible] = useState(false);

//     const handleAvatarChange = ({ fileList: newFileList }) => {
//         setFileList(newFileList);
//     };

//     const beforeUpload = (file) => {
//         const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//         if (!isJpgOrPng) {
//             message.error('You can only upload JPG/PNG file!');
//         }
//         const isLt2M = file.size / 1024 / 1024 < 2;
//         if (!isLt2M) {
//             message.error('Image must smaller than 2MB!');
//         }
//         return isJpgOrPng && isLt2M;
//     };

//     const generateRandomPassword = () => {
//         const length = 8;
//         const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//         let password = "";
//         for (let i = 0, n = charset.length; i < length; ++i) {
//             password += charset.charAt(Math.floor(Math.random() * n));
//         }
//         return password;
//     };

//     const handleOk = () => {
//         form.validateFields()
//             .then(async (values) => {
//                 let avatarUrl = ''; // Initialize avatar URL
//                 if (fileList.length > 0 && fileList[0].originFileObj) {
//                     const formData = new FormData();
//                     formData.append('file', fileList[0].originFileObj);

//                     try {
//                         const uploadRes = await axios.post('http://localhost:8080/api/customers/upload', formData, {
//                             headers: {
//                                 'Content-Type': 'multipart/form-data'
//                             }
//                         });
//                         avatarUrl = uploadRes.data;
//                     } catch (uploadError) {
//                         console.error('Error uploading image:', uploadError);
//                         message.error('Lỗi tải ảnh lên!');
//                         return;
//                     }
//                 }

//                 const newPassword = generateRandomPassword();

//                 const newData = {
//                     fullName: values.fullName,
//                     citizenId: values.CitizenId,
//                     phoneNumber: values.phoneNumber,
//                     email: values.email,
//                     gender: values.gender,
//                     dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'),
//                     status: 1, // Set status to 'Kích hoạt'
//                     avatar: avatarUrl,
//                     password: newPassword, // Automatically generated password
//                     provinceId: address.provinceId,
//                     districtId: address.districtId,
//                     wardId: address.provinceId,
//                     specificAddress: address.specificAddress,
//                 };

//                 axios.post('http://localhost:8080/api/customers/add', newData)
//                     .then(() => {
//                         message.success(`Thêm khách hàng thành công! Mật khẩu là: ${newPassword}`);
//                         // Gửi email thông báo
//                         const emailContent = `Chào ${values.fullName},\n\nTài khoản của bạn đã được tạo thành công.\nMật khẩu của bạn là: ${newPassword}\n\nCảm ơn!`;
//                         axios.post('http://localhost:3001/send-email', {
//                             to: values.email,
//                             subject: 'Thông báo tạo tài khoản thành công',
//                             text: emailContent
//                         }).then(() => {
//                             message.success('Email thông báo đã được gửi!');
//                         }).catch((error) => {
//                             console.error('Error sending email:', error);
//                             message.error('Lỗi gửi email thông báo!');
//                         });

//                         form.resetFields();
//                         navigate("/admin/customer")
//                     })
//                     .catch((error) => {
//                         console.error('Error adding customer:', error);
//                         message.error('Thêm khách hàng thất bại!');
//                     });
//             })
//             .catch((info) => {
//                 console.log('Validate Failed:', info);
//             });
//     };

//     const handleAddressChange = (provinceId, districtId, wardId, specificAddress) => {
//         setAddress({ ...address, districtId: districtId, provinceId: provinceId, wardId: wardId, specificAddress: specificAddress });
//     };

//     const handleScanSuccess = (result) => {
//         if (result?.text) {
//             // Extract only numeric values (CCCD number) and get the first 12 digits
//             const numericValue = result.text.replace(/\D/g, '').slice(0, 12); // Remove non-numeric characters and take the first 12 digits
            
//             // Ensure the extracted value has exactly 12 digits
//             if (numericValue.length === 12) {
//                 form.setFieldsValue({ CitizenId: numericValue });
//                 message.success(`Quét thành công: ${numericValue}`);
//             } else {
//                 message.error('Dữ liệu quét không hợp lệ! Chỉ nhận số CCCD hợp lệ gồm 12 chữ số.');
//             }
    
//             setQrModalVisible(false);
//         } else {
//             message.error('Không tìm thấy dữ liệu CCCD từ mã QR!');
//         }
//     };

//     return (
//         <div style={{ padding: '20px' }}>
//             <h2 style={{ color: '#1890ff', marginBottom: '20px' }}>Thêm mới khách hàng</h2>

//             <Row gutter={16}>
//                 <Col span={6}>
//                     <Card>
//                         <Form.Item label="Ảnh đại diện">
//                             <Upload
//                                 action=""
//                                 listType="picture-card"
//                                 fileList={fileList}
//                                 onChange={handleAvatarChange}
//                                 beforeUpload={beforeUpload}
//                             >
//                                 {fileList.length < 1 && '+ Upload'}
//                             </Upload>
//                         </Form.Item>
//                     </Card>
//                 </Col>

//                 <Col span={18}>
//                     <Card>
//                         <Form form={form} layout="vertical">
//                             <Row gutter={16}>
//                                 <Col span={12}>
//                                     <Form.Item
//                                         name="fullName"
//                                         label="Tên khách hàng"
//                                         rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
//                                     >
//                                         <Input />
//                                     </Form.Item>
//                                 </Col>
//                                 <Col span={12}>
//                                     <Form.Item
//                                         name="dateBirth"
//                                         label="Ngày sinh"
//                                         rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
//                                     >
//                                         <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
//                                     </Form.Item>
//                                 </Col>
//                             </Row>

//                             <Row gutter={16}>
//                                 <Col span={12}>
//                                     <Form.Item
//                                         name="CitizenId"
//                                         label="Căn cước công dân"
//                                         rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]}
//                                     >
//                                         <Input />
//                                     </Form.Item>
//                                 </Col>
//                                 <Col span={12}>
//                                     <Form.Item
//                                         name="gender"
//                                         label="Giới tính"
//                                         rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
//                                     >
//                                         <Radio.Group>
//                                             <Radio value="true">Nam</Radio>
//                                             <Radio value="false">Nữ</Radio>
//                                         </Radio.Group>
//                                     </Form.Item>
//                                 </Col>
//                             </Row>

//                             <Row gutter={16}>
//                                 <Col span={12}>
//                                     <Form.Item
//                                         name="email"
//                                         label="Email"
//                                         rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
//                                     >
//                                         <Input />
//                                     </Form.Item>
//                                 </Col>
//                                 <Col span={12}>
//                                     <Form.Item
//                                         name="phoneNumber"
//                                         label="Số điện thoại"
//                                         rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
//                                     >
//                                         <Input />
//                                     </Form.Item>
//                                 </Col>
//                             </Row>

//                             <Form.Item label="Địa chỉ">
//                                 <AddressSelectorAntd
//                                     provinceId={address.provinceId}
//                                     districtId={address.districtId}
//                                     wardId={address.wardId}
//                                     specificAddressDefault={address.specificAddress}
//                                     onAddressChange={handleAddressChange}
//                                 />
//                             </Form.Item>

//                             <Form.Item>
//                                 <Button type="primary" onClick={handleOk} style={{ marginRight: '10px' }}>
//                                     Thêm
//                                 </Button>
//                                 <Button onClick={() => navigate('/admin/customer')} style={{ marginRight: '10px' }}>
//                                     Hủy
//                                 </Button>
//                                 <Button onClick={() => setQrModalVisible(true)}>Quét QR</Button>
//                             </Form.Item>
//                         </Form>
//                     </Card>
//                 </Col>
//             </Row>

//             <Modal
//                 title="Quét mã QR CCCD"
//                 visible={qrModalVisible}
//                 onCancel={() => setQrModalVisible(false)}
//                 footer={null}
//             >
//                 <QrReader
//                     constraints={{ facingMode: 'environment' }}
//                     onResult={(result, error) => {
//                         if (result) handleScanSuccess(result);
//                         if (error) console.warn('QR Error:', error);
//                     }}
//                     style={{ width: '100%' }}
//                 />
//             </Modal>
//         </div>
//     );
// };

// export default AddCustomer;