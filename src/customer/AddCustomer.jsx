
// import React, { useState } from 'react';
// import axios from 'axios';
// import { Form, Input, Select, DatePicker, Button, Upload, message, Row, Col, Card, Radio, Modal, Spin } from 'antd';
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
//     const [loading, setLoading] = useState(false); // Loading state
//     const [emailError, setEmailError] = useState(null);

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


//     const disableUnder18 = (current) => {
//         return current && current > moment().subtract(18, "years").endOf("day");
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
//                 setLoading(true); // Start loading
//                 let avatarUrl = '';
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
//                         setLoading(false);
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
//                     status: 1,
//                     avatar: avatarUrl,
//                     password: newPassword,
//                     provinceId: address.provinceId,
//                     districtId: address.districtId,
//                     wardId: address.wardId, // Sửa từ address.provinceId sang address.wardId
//                     specificAddress: address.specificAddress,
//                 };

//                 try {
//                     await axios.post('http://localhost:8080/api/customers/add', newData);
//                     message.success(`Thêm khách hàng thành công! Mật khẩu tạm thời đã được gửi đến email của khách hàng.`);
//                     form.resetFields();
//                     setEmailError(null); // Clear any previous email error

//                     setTimeout(() => {
//                         setLoading(false);
//                         navigate("/admin/customer");
//                     }, 1500); // Wait 1.5 seconds before navigating
//                 } catch (error) {
//                     console.error('Error adding customer:', error);
//                     if (error.response && error.response.status === 400 && error.response.data.message === "Email already exists") {
//                         setEmailError("Email này đã được sử dụng!");
//                         form.setFields([{ name: 'email', errors: ["Email này đã được sử dụng!"] }]);
//                     } else {
//                         message.error('Thêm khách hàng thất bại!');
//                     }
//                     setLoading(false);
//                 }
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
//             const numericValue = result.text.replace(/\D/g, '').slice(0, 12);

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

//     const checkEmail = async (rule, value) => {
//         if (value) {
//             try {
//                 const response = await axios.get(`http://localhost:8080/api/customers/check-email?email=${value}`);
//                 if (response.data.exists) {
//                     throw new Error('Email này đã được sử dụng!');
//                 }
//             } catch (error) {
//                 if (error.response && error.response.status === 409) {
//                     throw new Error('Email này đã được sử dụng!');
//                 } else {
//                     // Optional: Handle other errors
//                 }
//             }
//         }
//     };

//     // Thêm các hàm xác thực cho số điện thoại và CCCD
//     const validatePhoneNumber = (_, value) => {
//         const phoneRegex = /^0\d{9}$/; // 10 chữ số bắt đầu bằng 0
//         if (value && !phoneRegex.test(value)) {
//             return Promise.reject(new Error('Số điện thoại không hợp lệ!'));
//         }
//         return Promise.resolve();
//     };

//     const validateCitizenId = (_, value) => {
//         const citizenIdRegex = /^\d{12}$/; // 12 chữ số
//         if (value && !citizenIdRegex.test(value)) {
//             return Promise.reject(new Error('CCCD phải gồm 12 chữ số!'));
//         }
//         return Promise.resolve();
//     };

//     return (
//         <Spin spinning={loading} tip="Đang xử lý...">
//             <div style={{ padding: '20px' }}>
//                 <h2>Thêm mới khách hàng</h2>

//                 <Row gutter={24}>
//                     <Col span={24}>
//                         <Card>
//                             <Form form={form} layout="vertical">
//                                 <Row gutter={16}>
//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="fullName"
//                                             label="Tên khách hàng"
//                                             rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
//                                         >
//                                             <Input />
//                                         </Form.Item>
//                                     </Col>
//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="dateBirth"
//                                             label="Ngày sinh"
//                                             rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
//                                         >
//                                             <DatePicker
//                                                 format="DD/MM/YYYY"
//                                                 style={{ width: "100%" }}
//                                                 disabledDate={disableUnder18}
//                                             />
//                                         </Form.Item>
//                                     </Col>
//                                 </Row>

//                                 <Row gutter={16}>
//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="CitizenId"
//                                             label="Căn cước công dân"
//                                             rules={[
//                                                 { required: true, message: 'Vui lòng nhập CCCD!' },
//                                                 { validator: validateCitizenId }
//                                             ]}
//                                         >
//                                             <Input />
//                                         </Form.Item>
//                                     </Col>
//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="gender"
//                                             label="Giới tính"
//                                             rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
//                                         >
//                                             <Radio.Group>
//                                                 <Radio value="true">Nam</Radio>
//                                                 <Radio value="false">Nữ</Radio>
//                                             </Radio.Group>
//                                         </Form.Item>
//                                     </Col>
//                                 </Row>

//                                 <Row gutter={16}>
//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="email"
//                                             label="Email"
//                                             rules={[
//                                                 { required: true, message: 'Vui lòng nhập email!' },
//                                                 { type: 'email', message: 'Email không hợp lệ!' },
//                                                 { validator: checkEmail }
//                                             ]}
//                                         >
//                                             <Input />
//                                         </Form.Item>
//                                     </Col>
//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="phoneNumber"
//                                             label="Số điện thoại"
//                                             rules={[
//                                                 { required: true, message: 'Vui lòng nhập số điện thoại!' },
//                                                 { validator: validatePhoneNumber }
//                                             ]}
//                                         >
//                                             <Input />
//                                         </Form.Item>
//                                     </Col>
//                                 </Row>

//                                 <Form.Item label="Địa chỉ">
//                                     <AddressSelectorAntd
//                                         provinceId={address.provinceId}
//                                         districtId={address.districtId}
//                                         wardId={address.wardId}
//                                         specificAddressDefault={address.specificAddress}
//                                         onAddressChange={handleAddressChange}
//                                     />
//                                 </Form.Item>

//                                 <Form.Item>
//                                     <Button type="primary" onClick={handleOk} loading={loading} style={{ marginRight: '10px' }}>
//                                         Thêm
//                                     </Button>
//                                     <Button onClick={() => navigate('/admin/customer')} style={{ marginRight: '10px' }}>
//                                         Hủy
//                                     </Button>
//                                     <Button onClick={() => setQrModalVisible(true)}>Quét QR</Button>
//                                 </Form.Item>
//                             </Form>
//                         </Card>
//                     </Col>
//                 </Row>

//                 <Modal
//                     title="Quét mã QR CCCD"
//                     visible={qrModalVisible}
//                     onCancel={() => setQrModalVisible(false)}
//                     footer={null}
//                 >
//                     <QrReader
//                         constraints={{ facingMode: 'environment' }}
//                         onResult={(result, error) => {
//                             if (result) handleScanSuccess(result);
//                             if (error) console.warn('QR Error:', error);
//                         }}
//                         style={{ width: '100%' }}
//                     />
//                 </Modal>
//             </div>
//         </Spin>
//     );
// };

// export default AddCustomer;









import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Form, Input, Select, DatePicker, Button, Upload, message, Row, Col, Card, Radio, Modal, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import AddressSelectorAntd from "../admin/utils/AddressSelectorAntd.jsx";
import { useNavigate } from "react-router";
import { BrowserMultiFormatReader } from "@zxing/library";

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
    const [loading, setLoading] = useState(false); // Loading state
    const [emailError, setEmailError] = useState(null);
    const videoRef = useRef(null);
    const codeReader = new BrowserMultiFormatReader();

    useEffect(() => {
        if (videoRef.current) {
            codeReader.getVideoInputDevices()
                .then(videoInputDevices => {
                    if (videoInputDevices.length > 0) {
                        codeReader.decodeFromInputVideoDevice(videoInputDevices[0].deviceId, videoRef.current)
                            .then(result => {
                                handleScanSuccess(result);
                            })
                            .catch(err => {
                                console.error('QR Scan Error:', err);
                                message.error('Quét mã QR thất bại!');
                            });
                    } else {
                        message.error('Không tìm thấy thiết bị quét mã QR!');
                    }
                })
                .catch(err => {
                    console.error('QR Scan Error:', err);
                    message.error('Quét mã QR thất bại!');
                });
        }
    }, [qrModalVisible]);

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

    const disableUnder18 = (current) => {
        return current && current > moment().subtract(18, "years").endOf("day");
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
                setLoading(true); // Start loading
                let avatarUrl = '';
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
                        setLoading(false);
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
                    status: 1,
                    avatar: avatarUrl,
                    password: newPassword,
                    provinceId: address.provinceId,
                    districtId: address.districtId,
                    wardId: address.wardId, // Sửa từ address.provinceId sang address.wardId
                    specificAddress: address.specificAddress,
                };

                try {
                    await axios.post('http://localhost:8080/api/customers/add', newData);
                    message.success(`Thêm khách hàng thành công! Mật khẩu tạm thời đã được gửi đến email của khách hàng.`);
                    form.resetFields();
                    setEmailError(null); // Clear any previous email error

                    setTimeout(() => {
                        setLoading(false);
                        navigate("/admin/customer");
                    }, 1500); // Wait 1.5 seconds before navigating
                } catch (error) {
                    console.error('Error adding customer:', error);
                    if (error.response && error.response.status === 400 && error.response.data.message === "Email already exists") {
                        setEmailError("Email này đã được sử dụng!");
                        form.setFields([{ name: 'email', errors: ["Email này đã được sử dụng!"] }]);
                    } else {
                        message.error('Thêm khách hàng thất bại!');
                    }
                    setLoading(false);
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleAddressChange = (provinceId, districtId, wardId, specificAddress) => {
        setAddress({ ...address, districtId: districtId, provinceId: provinceId, wardId: wardId, specificAddress: specificAddress });
    };

    const handleScanSuccess = (result) => {
        if (result?.text) {
            const numericValue = result.text.replace(/\D/g, '').slice(0, 12);

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

    const checkEmail = async (rule, value) => {
        if (value) {
            try {
                const response = await axios.get(`http://localhost:8080/api/customers/check-email?email=${value}`);
                if (response.data.exists) {
                    throw new Error('Email này đã được sử dụng!');
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    throw new Error('Email này đã được sử dụng!');
                } else {
                    // Optional: Handle other errors
                }
            }
        }
    };

    // Thêm các hàm xác thực cho số điện thoại và CCCD
    const validatePhoneNumber = (_, value) => {
        const phoneRegex = /^0\d{9}$/; // 10 chữ số bắt đầu bằng 0
        if (value && !phoneRegex.test(value)) {
            return Promise.reject(new Error('Số điện thoại không hợp lệ!'));
        }
        return Promise.resolve();
    };

    const validateCitizenId = (_, value) => {
        const citizenIdRegex = /^\d{12}$/; // 12 chữ số
        if (value && !citizenIdRegex.test(value)) {
            return Promise.reject(new Error('CCCD phải gồm 12 chữ số!'));
        }
        return Promise.resolve();
    };

    return (
        <Spin spinning={loading} tip="Đang xử lý...">
            <div style={{ padding: '20px' }}>
                <h2>Thêm mới khách hàng</h2>

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
                                            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
                                        >
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                style={{ width: "100%" }}
                                                disabledDate={disableUnder18}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="CitizenId"
                                            label="Căn cước công dân"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập CCCD!' },
                                                { validator: validateCitizenId }
                                            ]}
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
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập email!' },
                                                { type: 'email', message: 'Email không hợp lệ!' },
                                                { validator: checkEmail }
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="phoneNumber"
                                            label="Số điện thoại"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                                { validator: validatePhoneNumber }
                                            ]}
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
                                    <Button type="primary" onClick={handleOk} loading={loading} style={{ marginRight: '10px' }}>
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
                    <div>
                        <video ref={videoRef} id="video" width="100%" style={{ display: 'block', margin: '0 auto' }}></video>
                    </div>
                </Modal>
            </div>
        </Spin>
    );
};

export default AddCustomer;