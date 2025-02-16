import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Radio, DatePicker, Upload, message, Row, Col, Card, Spin, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/library';

const AddStaff = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(null);
    // State cho modal quét mã QR
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const videoRef = useRef(null);
    const codeReader = new BrowserMultiFormatReader();

    useEffect(() => {
        // Khi modal quét mã QR được mở, khởi tạo camera
        if (qrModalVisible && videoRef.current) {
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
        // Dừng quét khi modal đóng
        return () => {
            codeReader.reset();
        };
    }, [qrModalVisible]);

    // Hàm xử lý kết quả khi quét thành công
    const handleScanSuccess = (result) => {
        if (result?.text) {
            // Giả sử dữ liệu quét trả về là CCCD gồm 12 chữ số (có thể cần xử lý tương tự như AddCustomer)
            const numericValue = result.text.replace(/\D/g, '').slice(0, 12);
            if (numericValue.length === 12) {
                form.setFieldsValue({ citizenId: numericValue });
                message.success(`Quét thành công: ${numericValue}`);
            } else {
                message.error('Dữ liệu quét không hợp lệ! Chỉ nhận số CCCD hợp lệ gồm 12 chữ số.');
            }
            setQrModalVisible(false);
        } else {
            message.error('Không tìm thấy dữ liệu CCCD từ mã QR!');
        }
    };

    const handleAvatarChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ được tải lên file JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Ảnh phải nhỏ hơn 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    // Hàm validate số điện thoại
    const validatePhoneNumber = (_, value) => {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!value) {
            return Promise.reject('Vui lòng nhập số điện thoại!');
        }
        if (!phoneRegex.test(value)) {
            return Promise.reject('Số điện thoại không hợp lệ!');
        }
        return Promise.resolve();
    };

    // Hàm validate CCCD
    const validateCitizenId = (_, value) => {
        const citizenIdRegex = /^([0-9]{12})$/;
        if (!value) {
            return Promise.reject('Vui lòng nhập CCCD!');
        }
        if (!citizenIdRegex.test(value)) {
            return Promise.reject('CCCD không hợp lệ! Phải có 12 chữ số.');
        }
        return Promise.resolve();
    };

    // Hàm disable chọn ngày dưới 18 tuổi
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

    const checkEmailAvailability = async (email) => {
        if (!email) {
            setEmailError(null);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/staff/check-email?email=${email}`);
            if (response.data.exists) {
                setEmailError('Email này đã được sử dụng.');
                return Promise.reject('Email đã tồn tại');
            } else {
                setEmailError(null);
                return Promise.resolve();
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra email:', error);
            setEmailError('Có lỗi xảy ra khi kiểm tra email.');
            return Promise.reject('Lỗi khi kiểm tra email');
        }
    };

    const handleFinish = async (values) => {
        setLoading(true);
        let avatarUrl = '';
        if (fileList.length > 0 && fileList[0].originFileObj) {
            const formData = new FormData();
            formData.append('file', fileList[0].originFileObj);

            try {
                const uploadRes = await axios.post('http://localhost:8080/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                avatarUrl = uploadRes.data;
            } catch (uploadError) {
                console.error('Lỗi tải ảnh lên:', uploadError);
                message.error('Lỗi tải ảnh lên!');
                setLoading(false);
                return;
            }
        }

        const newPassword = generateRandomPassword();

        const newData = {
            fullName: values.fullName,
            citizenId: values.citizenId,
            phoneNumber: values.phoneNumber,
            email: values.email,
            gender: values.gender ? true : false, // Đảm bảo giá trị boolean
            dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'),
            status: 0, // Mặc định là kích hoạt khi thêm mới
            avatar: avatarUrl,
            password: newPassword,
        };

        axios.post('http://localhost:8080/api/admin/staff/add', newData)
            .then(() => {
                message.success(`Thêm nhân viên thành công! Mật khẩu tạm thời đã được gửi đến email của nhân viên.`);
                form.resetFields();
                setFileList([]);
                setTimeout(() => {
                    setLoading(false);
                    navigate("/admin/staff");
                }, 2000);
            })
            .catch((error) => {
                setLoading(false);
                if (error.response && error.response.status === 409) {
                    setEmailError('Email này đã được sử dụng.');
                    form.setFields([{ name: 'email', errors: ['Email này đã được sử dụng.'] }]);
                } else {
                    console.error('Lỗi thêm nhân viên:', error);
                    message.error('Thêm nhân viên thất bại!');
                }
            });
    };

    return (
        <Spin spinning={loading} tip="Đang xử lý...">
            <div style={{ padding: '20px' }}>
                <h2 style={{ marginBottom: '20px' }}>Thêm mới nhân viên</h2>
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
                                            name="citizenId"
                                            label="CCCD"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập CCCD!' },
                                                { validator: validateCitizenId }
                                            ]}
                                        >
                                            <Input placeholder="Nhập hoặc quét mã QR" />
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
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập email!' },
                                                { type: 'email', message: 'Email không hợp lệ!' },
                                                () => ({
                                                    validator(_, value) {
                                                        return checkEmailAvailability(value);
                                                    },
                                                }),
                                            ]}
                                            validateStatus={emailError ? 'error' : ''}
                                            help={emailError || ''}
                                        >
                                            <Input onBlur={(e) => checkEmailAvailability(e.target.value)} />
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

                               

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }} disabled={!!emailError}>
                                        Thêm mới
                                    </Button>
                                    <Button onClick={() => navigate('/admin/staff')}>Hủy</Button>
                                    <Button type="dashed" onClick={() => setQrModalVisible(true)}>
                                            Quét QR
                                        </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>

                {/* Modal Quét mã QR */}
                <Modal
                    title="Quét mã QR CCCD"
                    visible={qrModalVisible}
                    onCancel={() => setQrModalVisible(false)}
                    footer={null}
                >
                    <div>
                        <video
                            ref={videoRef}
                            id="video"
                            width="100%"
                            style={{ display: 'block', margin: '0 auto' }}
                        ></video>
                    </div>
                </Modal>
            </div>
        </Spin>
    );
};

export default AddStaff;









// import React, { useState, useEffect } from 'react';
// import { Form, Input, Button, Radio, DatePicker, Upload, message, Row, Col, Card, Spin } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';

// const AddStaff = () => {
//     const [form] = Form.useForm();
//     const navigate = useNavigate();
//     const [fileList, setFileList] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [emailError, setEmailError] = useState(null);

//     useEffect(() => {
//         // Reset email error when the email field changes, or when the form is reset
//         form.setFieldsValue({ email: form.getFieldValue('email') });
//         setEmailError(null);
//     }, [form]);

//     const handleAvatarChange = ({ fileList: newFileList }) => {
//         setFileList(newFileList);
//     };

//     const beforeUpload = (file) => {
//         const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//         if (!isJpgOrPng) {
//             message.error('Chỉ được tải lên file JPG/PNG!');
//         }
//         const isLt2M = file.size / 1024 / 1024 < 2;
//         if (!isLt2M) {
//             message.error('Ảnh phải nhỏ hơn 2MB!');
//         }
//         return isJpgOrPng && isLt2M;
//     };


//     const validatePhoneNumber = (_, value) => {
//         const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
//         if (!value) {
//             return Promise.reject('Vui lòng nhập số điện thoại!');
//         }
//         if (!phoneRegex.test(value)) {
//             return Promise.reject('Số điện thoại không hợp lệ!');
//         }
//         return Promise.resolve();
//     };

//     const validateCitizenId = (_, value) => {
//         const citizenIdRegex = /^([0-9]{12})$/;
//         if (!value) {
//             return Promise.reject('Vui lòng nhập CCCD!');
//         }
//         if (!citizenIdRegex.test(value)) {
//             return Promise.reject('CCCD không hợp lệ! Phải có 12 chữ số.');
//         }
//         return Promise.resolve();
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

//     const checkEmailAvailability = async (email) => {
//         if (!email) {
//             setEmailError(null);
//             return;
//         }
//         try {
//             const response = await axios.get(`http://localhost:8080/api/admin/staff/check-email?email=${email}`);
//             if (response.data.exists) {
//                 setEmailError('Email này đã được sử dụng.');
//                 return Promise.reject('Email đã tồn tại');
//             } else {
//                 setEmailError(null);
//                 return Promise.resolve();
//             }
//         } catch (error) {
//             console.error('Lỗi khi kiểm tra email:', error);
//             setEmailError('Có lỗi xảy ra khi kiểm tra email.');
//             return Promise.reject('Lỗi khi kiểm tra email');
//         }
//     };

//     const handleFinish = async (values) => {
//         setLoading(true);
//         let avatarUrl = '';
//         if (fileList.length > 0 && fileList[0].originFileObj) {
//             const formData = new FormData();
//             formData.append('file', fileList[0].originFileObj);

//             try {
//                 const uploadRes = await axios.post('http://localhost:8080/api/upload', formData, { // Giả sử endpoint upload chung là /api/upload
//                     headers: {
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 });
//                 avatarUrl = uploadRes.data;
//             } catch (uploadError) {
//                 console.error('Lỗi tải ảnh lên:', uploadError);
//                 message.error('Lỗi tải ảnh lên!');
//                 setLoading(false);
//                 return;
//             }
//         }

//         const newPassword = generateRandomPassword();

//         const newData = {
//             fullName: values.fullName,
//             citizenId: values.citizenId,
//             phoneNumber: values.phoneNumber,
//             email: values.email,
//             gender: values.gender ? true : false, // Đảm bảo giá trị boolean
//             dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'),
//             status: 0, // Mặc định là kích hoạt khi thêm mới
//             avatar: avatarUrl,
//             password: newPassword
//         };

//         axios.post('http://localhost:8080/api/admin/staff/add', newData)
//             .then(() => {
//                 message.success(`Thêm nhân viên thành công! Mật khẩu tạm thời đã được gửi đến email của nhân viên.`);
//                 form.resetFields();
//                 setFileList([]);
//                 setTimeout(() => {
//                     setLoading(false);
//                     navigate("/admin/staff");
//                 }, 2000);
//             })
//             .catch((error) => {
//                 setLoading(false);
//                 if (error.response && error.response.status === 409) {
//                     setEmailError('Email này đã được sử dụng.');
//                     form.setFields([{ name: 'email', errors: ['Email này đã được sử dụng.'] }]);
//                 } else {
//                     console.error('Lỗi thêm nhân viên:', error);
//                     message.error('Thêm nhân viên thất bại!');
//                 }
//             });
//     };

//     return (
//         <Spin spinning={loading} tip="Đang xử lý...">
//             <div style={{ padding: '20px' }}>
//                 <h2 style={{ marginBottom: '20px' }}>Thêm mới nhân viên</h2>

//                 <Row gutter={16}>
//                     <Col span={6}>
//                         <Card>
//                             <Form.Item label="Ảnh đại diện">
//                                 <Upload
//                                     action=""
//                                     listType="picture-card"
//                                     fileList={fileList}
//                                     onChange={handleAvatarChange}
//                                     beforeUpload={beforeUpload}
//                                 >
//                                     {fileList.length < 1 && '+ Upload'}
//                                 </Upload>
//                             </Form.Item>
//                         </Card>
//                     </Col>

//                     <Col span={18}>
//                         <Card>
//                             <Form form={form} layout="vertical" onFinish={handleFinish}>
//                                 <Row gutter={16}>
//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="fullName"
//                                             label="Họ và tên"
//                                             rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
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
//                                     <Form.Item
//                             name="citizenId"
//                             label="CCCD"
//                             rules={[
//                                 { required: true, message: 'Vui lòng nhập CCCD!' },
//                                 { validator: validateCitizenId }
//                             ]}
//                         >
//                             <Input />
//                         </Form.Item>
//                                     </Col>
//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="gender"
//                                             label="Giới tính"
//                                             rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
//                                         >
//                                             <Radio.Group>
//                                                 <Radio value={true}>Nam</Radio>
//                                                 <Radio value={false}>Nữ</Radio>
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
//                                                 () => ({
//                                                     validator(_, value) {
//                                                         return checkEmailAvailability(value);
//                                                     },
//                                                 }),
//                                             ]}
//                                             validateStatus={emailError ? 'error' : ''}
//                                             help={emailError || ''}
//                                         >
//                                             <Input onBlur={(e) => checkEmailAvailability(e.target.value)} />
//                                         </Form.Item>
//                                     </Col>
//                                     <Col span={12}>
//                                     <Form.Item
//                             name="phoneNumber"
//                             label="Số điện thoại"
//                             rules={[
//                                 { required: true, message: 'Vui lòng nhập số điện thoại!' },
//                                 { validator: validatePhoneNumber }
//                             ]}
//                         >
//                             <Input />
//                         </Form.Item>
//                                     </Col>
//                                 </Row>

//                                 <Form.Item>
//                                     <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }} disabled={!!emailError}>
//                                         Thêm mới
//                                     </Button>
//                                     <Button onClick={() => navigate('/admin/staff')}>Hủy</Button>
//                                 </Form.Item>
//                             </Form>
//                         </Card>
//                     </Col>
//                 </Row>
//             </div>
//         </Spin>
//     );
// };

// export default AddStaff;



