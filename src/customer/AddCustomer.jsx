import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Form, Input, Select, DatePicker, Button, Upload, message, Row, Col, Card, Radio, Modal, Spin } from 'antd';
import { UploadOutlined , UserOutlined  } from '@ant-design/icons';
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
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(null);
    const [phoneError, setPhoneError] = useState(null);
    const [cleanUpImage, setCleanUpImage] = useState([]);
    const cleanUpImageRef = useRef(cleanUpImage);
    const videoRef = useRef(null);
    const codeReader = new BrowserMultiFormatReader();

    useEffect(() => {
        cleanUpImageRef.current = cleanUpImage;

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
        
        return () => {
            codeReader.reset();
        };
    }, [cleanUpImage, qrModalVisible]);

    // Cleanup images when component unmounts
    useEffect(() => {
        return () => {
            deleteImages(cleanUpImageRef.current);
        };
    }, []);

    // Cloudinary Upload Function
    const cloudinaryUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "uploaddatn"); // Use your preset
          
            const res = await fetch(
              `https://api.cloudinary.com/v1_1/dieyhvcou/image/upload`,
              { method: "POST", body: formData }
            );
            
            if (!res.ok) {
                throw new Error(`Cloudinary upload failed with status: ${res.status}`);
            }
            
            const data = await res.json();
            setCleanUpImage((prev) => [...prev, data.public_id]);
            
            return {
              url: data.secure_url,
              public_id: data.public_id,
            };
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            message.error("Lỗi khi tải ảnh lên Cloudinary!");
            throw error;
        }
    };

    // Delete Images from Cloudinary
    const deleteImages = async (publicIds) => {
        if (!publicIds || publicIds.length === 0) return;
      
        try {
          const deleteRequests = publicIds.map((id) =>
            fetch("http://localhost:8080/cloudinary/delete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ public_id: id }),
            })
          );
          await Promise.all(deleteRequests);
        } catch (error) {
          console.error("Lỗi khi xóa ảnh hàng loạt:", error);
        }
    };

    // Custom Request and Upload Handling
    const handleAvatarChange = ({ fileList }) => {
        setFileList(fileList);
    };
      
    const customRequest = async ({ file, onSuccess, onError }) => {
        try {
          const result = await cloudinaryUpload(file);
          onSuccess(result, file);
        } catch (error) {
          console.error("Custom request error:", error);
          onError(error);
        }
    };
      
    const handleRemove = async (file) => {
        if (file.response?.public_id) {
          try {
            await fetch("http://localhost:8080/cloudinary/delete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ public_id: file.response.public_id }),
            });
            setCleanUpImage((prev) => 
              prev.filter(id => id !== file.response.public_id)
            );
          } catch (error) {
            console.error("Lỗi khi xóa ảnh:", error);
          }
        }
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

    const disableFutureDates = (current) => {
        return current && current > moment().endOf("day");
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
        if (!value || !value.trim()) {
            setEmailError(null);
            return Promise.reject('Vui lòng nhập email!');
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailError('Email không hợp lệ!');
            return Promise.reject('Email không hợp lệ!');
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/admin/customers/check-email?email=${encodeURIComponent(value)}`);
            if (response.data && response.data.exists) {
                setEmailError('Email này đã được sử dụng!');
                return Promise.reject('Email đã tồn tại');
            } else {
                setEmailError(null);
                return Promise.resolve();
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra email:', error);
            setEmailError('Email đã tồn tại.');
            return Promise.reject('Lỗi khi kiểm tra email');
        }
    };

    const checkPhoneNumberAvailability = async (phoneNumber) => {
        // Don't make unnecessary API calls if field is empty
        if (!phoneNumber || !phoneNumber.trim()) {
            setPhoneError(null);
            return Promise.reject('Vui lòng nhập số điện thoại!');
        }

        // Basic phone format validation before API call
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!phoneRegex.test(phoneNumber)) {
            setPhoneError('Số điện thoại không hợp lệ!');
            return Promise.reject('Số điện thoại không hợp lệ!');
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/admin/customers/check-phone?phoneNumber=${encodeURIComponent(phoneNumber)}`);
            if (response.data && response.data.exists) {
                setPhoneError('Số điện thoại này đã được sử dụng.');
                return Promise.reject('Số điện thoại đã tồn tại');
            } else {
                setPhoneError(null);
                return Promise.resolve();
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra số điện thoại:', error);
            setPhoneError('Số điện thoại đã tồn tại.');
            return Promise.reject('Lỗi khi kiểm tra số điện thoại');
        }
    };

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

    const handleFinish = async (values) => {
        setLoading(true);
        
        try {
            // Get avatarUrl from Cloudinary
            let avatarUrl = '';
            
            if (fileList.length > 0 && fileList[0].response && fileList[0].response.url) {
                // Get URL from Cloudinary response
                avatarUrl = fileList[0].response.url;
            }
            
            const newPassword = generateRandomPassword();
            
            const newData = {
                fullName: values.fullName,
                citizenId: values.CitizenId,
                phoneNumber: values.phoneNumber,
                email: values.email,
                gender: values.gender === "true" ? true : false, // Ensure boolean
                dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'),
                status: 1, // Default to active when adding
                avatar: avatarUrl,
                password: newPassword,
                provinceId: address.provinceId,
                districtId: address.districtId,
                wardId: address.wardId,
                specificAddress: address.specificAddress,
            };
            
            await axios.post('http://localhost:8080/api/admin/customers/add', newData);
            message.success("Thêm khách hàng thành công! Mật khẩu tạm thời đã được gửi đến email của khách hàng.");
            form.resetFields();
            setFileList([]);
            
            setTimeout(() => {
                setLoading(false);
                navigate("/admin/customer");
            }, 2000);
        } catch (error) {
            setLoading(false);
            console.error('Lỗi thêm khách hàng:', error);
            
            if (error.response && error.response.status === 409) {
                setEmailError('Email này đã được sử dụng.');
                form.setFields([{ name: 'email', errors: ['Email này đã được sử dụng.'] }]);
            } else {
                message.error('Thêm khách hàng thất bại! ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleAddressChange = (provinceId, districtId, wardId, specificAddress) => {
        setAddress({
            ...address,
            districtId: districtId,
            provinceId: provinceId,
            wardId: wardId,
            specificAddress: specificAddress
        });
    };

    
    const uploadButton = (
        <div className="ant-upload-btn">
            <div style={{
                width: '190px',
                height: '190px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fafafa',
                border: '1px dashed #d9d9d9'
            }}>
                {fileList.length === 0 ? (
                    <div style={{ textAlign: 'center' }}>
                        <UserOutlined style={{ fontSize: '32px', color: '#bfbfbf' }} />
                        <div style={{ marginTop: '8px', color: '#8c8c8c' }}>+ Upload</div>
                    </div>
                ) : null}
            </div>
        </div>
    );

    return (
        <Spin spinning={loading} tip="Đang xử lý...">
            <div style={{ padding: '20px' }}>
                <h2 style={{ marginBottom: '20px' }}>Thêm mới khách hàng</h2>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card>
                        <Form.Item label="Ảnh đại diện" style={{ textAlign: 'center' }}>
                                <Upload
                                    customRequest={customRequest}
                                    fileList={fileList}
                                    onChange={handleAvatarChange}
                                    onRemove={handleRemove}
                                    beforeUpload={beforeUpload}
                                    maxCount={1}
                                    showUploadList={false}
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    {fileList.length > 0 ? (
                                        <div style={{
                                            width: '190px',
                                            height: '190px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            margin: '0 auto',
                                            cursor: 'pointer',
                                            border: '1px solid #d9d9d9'
                                        }}>
                                            <img
                                                src={fileList[0]?.response?.url || fileList[0]?.url}
                                                alt="Avatar"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                    ) : uploadButton}
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
                                            rules={[
                                                { required: true, message: "Vui lòng chọn ngày sinh!" },
                                                {
                                                    validator: (_, value) => {
                                                        if (value && value > moment().endOf("day")) {
                                                            return Promise.reject("Ngày sinh không thể là ngày trong tương lai!");
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                }
                                            ]}
                                        >
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                style={{ width: "100%" }}
                                                disabledDate={disableFutureDates}
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
                                                () => ({
                                                    validator(_, value) {
                                                        return checkEmail(_, value);
                                                    },
                                                }),
                                            ]}
                                            validateStatus={emailError ? 'error' : ''}
                                            help={emailError || ''}
                                        >
                                            <Input
                                                onBlur={(e) => checkEmail(null, e.target.value)}
                                                onChange={() => emailError && setEmailError(null)} // Reset error when user types
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="phoneNumber"
                                            label="Số điện thoại"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                                () => ({
                                                    validator(_, value) {
                                                        return checkPhoneNumberAvailability(value);
                                                    },
                                                }),
                                            ]}
                                            validateStatus={phoneError ? 'error' : ''}
                                            help={phoneError || ''}
                                        >
                                            <Input
                                                onBlur={(e) => checkPhoneNumberAvailability(e.target.value)}
                                                onChange={() => phoneError && setPhoneError(null)} // Reset error when user types
                                            />
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
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        style={{ marginRight: '10px' }} 
                                        disabled={!!emailError || !!phoneError}
                                    >
                                        Thêm mới
                                    </Button>
                                    <Button 
                                        onClick={() => navigate('/admin/customer')}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button 
                                        type="dashed" 
                                        onClick={() => setQrModalVisible(true)}
                                    >
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
                    open={qrModalVisible} // Changed from 'visible' to 'open' for newer Antd versions
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

export default AddCustomer;


// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Form, Input, Select, DatePicker, Button, Upload, message, Row, Col, Card, Radio, Modal, Spin } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import moment from 'moment';
// import AddressSelectorAntd from "../admin/utils/AddressSelectorAntd.jsx";
// import { useNavigate } from "react-router";
// import { BrowserMultiFormatReader } from "@zxing/library";

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
//     const [phoneError, setPhoneError] = useState(null);
//     const videoRef = useRef(null);
//     const codeReader = new BrowserMultiFormatReader();

//     useEffect(() => {
//         if (videoRef.current) {
//             codeReader.getVideoInputDevices()
//                 .then(videoInputDevices => {
//                     if (videoInputDevices.length > 0) {
//                         codeReader.decodeFromInputVideoDevice(videoInputDevices[0].deviceId, videoRef.current)
//                             .then(result => {
//                                 handleScanSuccess(result);
//                             })
//                             .catch(err => {
//                                 console.error('QR Scan Error:', err);
//                                 message.error('Quét mã QR thất bại!');
//                             });
//                     } else {
//                         message.error('Không tìm thấy thiết bị quét mã QR!');
//                     }
//                 })
//                 .catch(err => {
//                     console.error('QR Scan Error:', err);
//                     message.error('Quét mã QR thất bại!');
//                 });
//         }
//     }, [qrModalVisible]);

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

//     // const disableUnder18 = (current) => {
//     //     return current && current > moment().subtract(18, "years").endOf("day");
//     // };
//     const disableFutureDates = (current) => {
//         return current && current > moment().endOf("day");
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
//                         const uploadRes = await axios.post('http://localhost:8080/api/admin/customers/upload', formData, {
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
//                     await axios.post('http://localhost:8080/api/admin/customers/add', newData);
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
//         setAddress({
//             ...address,
//             districtId: districtId,
//             provinceId: provinceId,
//             wardId: wardId,
//             specificAddress: specificAddress
//         });
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
//                 const response = await axios.get(`http://localhost:8080/api/admin/customers/check-email?email=${value}`);
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


//     // const checkPhoneNumberAvailability = async (phoneNumber) => {
//     //     if (!phoneNumber) {
//     //         setPhoneError(null);
//     //         return;
//     //     }
//     //     try {
//     //         const response = await axios.get(`http://localhost:8080/api/admin/customers/check-phone?phoneNumber=${phoneNumber}`);
//     //         if (response.data.exists) {
//     //             setPhoneError('Số điện thoại này đã được sử dụng.');
//     //             return Promise.reject('Số điện thoại đã tồn tại');
//     //         } else {
//     //             setPhoneError(null);
//     //             return Promise.resolve();
//     //         }
//     //     } catch (error) {
//     //         console.error('Lỗi khi kiểm tra số điện thoại:', error);
//     //         setPhoneError('Số điện thoại đã tồn tại.');
//     //         return Promise.reject('Lỗi khi kiểm tra số điện thoại');
//     //     }
//     // };
//     const checkPhoneNumberAvailability = async (phoneNumber) => {
//         // Don't make unnecessary API calls if field is empty
//         if (!phoneNumber || !phoneNumber.trim()) {
//             setPhoneError(null);
//             return Promise.reject('Vui lòng nhập số điện thoại!');
//         }

//         // Basic phone format validation before API call
//         const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
//         if (!phoneRegex.test(phoneNumber)) {
//             setPhoneError('Số điện thoại không hợp lệ!');
//             return Promise.reject('Số điện thoại không hợp lệ!');
//         }

//         try {
//             const response = await axios.get(`http://localhost:8080/api/admin/customers/check-phone?phoneNumber=${encodeURIComponent(phoneNumber)}`);
//             if (response.data && response.data.exists) {
//                 setPhoneError('Số điện thoại này đã được sử dụng.');
//                 return Promise.reject('Số điện thoại đã tồn tại');
//             } else {
//                 setPhoneError(null);
//                 return Promise.resolve();
//             }
//         } catch (error) {
//             console.error('Lỗi khi kiểm tra số điện thoại:', error);
//             setPhoneError('Số điện thoại đã tồn tại.');
//             return Promise.reject('Lỗi khi kiểm tra số điện thoại');
//         }
//     };

//     // Thêm các hàm xác thực cho số điện thoại và CCCD
//     const validatePhoneNumber = (_, value) => {
//         const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/; // 10 chữ số bắt đầu bằng 0
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
//                                         {/* <Form.Item
//                                             name="dateBirth"
//                                             label="Ngày sinh"
//                                             rules={[{required: true, message: "Vui lòng chọn ngày sinh!"}]}
//                                         >
//                                             <DatePicker
//                                                 format="DD/MM/YYYY"
//                                                 style={{width: "100%"}}
//                                                 disabledDate={disableUnder18}
//                                             />
//                                         </Form.Item> */}
//                                         <Form.Item
//                                             name="dateBirth"
//                                             label="Ngày sinh"
//                                             rules={[
//                                                 { required: true, message: "Vui lòng chọn ngày sinh!" },
//                                                 {
//                                                     validator: (_, value) => {
//                                                         if (value && value > moment().endOf("day")) {
//                                                             return Promise.reject("Ngày sinh không thể là ngày trong tương lai!");
//                                                         }
//                                                         return Promise.resolve();
//                                                     }
//                                                 }
//                                             ]}
//                                         >
//                                             <DatePicker
//                                                 format="DD/MM/YYYY"
//                                                 style={{ width: "100%" }}
//                                                 disabledDate={disableFutureDates}
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
//                                         {/* <Form.Item
//                                             name="phoneNumber"
//                                             label="Số điện thoại"
//                                             rules={[
//                                                 {required: true, message: 'Vui lòng nhập số điện thoại!'},
//                                                 {validator: validatePhoneNumber},
//                                                 () => ({
//                                                     validator(_, value) {
//                                                         return checkPhoneNumberAvailability(value);
//                                                     },
//                                                 }),
//                                             ]}
//                                             validateStatus={phoneError ? 'error' : ''}
//                                             help={phoneError || ''}
//                                         >
//                                             <Input
//                                                 onBlur={(e) => checkPhoneNumberAvailability(e.target.value)}
//                                                 onChange={() => setPhoneError(null)} // Reset error khi thay đổi
//                                             />
//                                         </Form.Item> */}
//                                         <Form.Item
//                                             name="phoneNumber"
//                                             label="Số điện thoại"
//                                             rules={[
//                                                 { required: true, message: 'Vui lòng nhập số điện thoại!' },
//                                                 () => ({
//                                                     validator(_, value) {
//                                                         return checkPhoneNumberAvailability(value);
//                                                     },
//                                                 }),
//                                             ]}
//                                             validateStatus={phoneError ? 'error' : ''}
//                                             help={phoneError || ''}
//                                         >
//                                             <Input
//                                                 onBlur={(e) => checkPhoneNumberAvailability(e.target.value)}
//                                                 onChange={() => phoneError && setPhoneError(null)} // Reset error when user types
//                                             />
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
//                                     <Button type="primary" onClick={handleOk} loading={loading}
//                                         style={{ marginRight: '10px' }}>
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
//                     <div>
//                         <video ref={videoRef} id="video" width="100%" style={{ display: 'block', margin: '0 auto' }}></video>
//                     </div>
//                 </Modal>
//             </div>
//         </Spin>
//     );
// };

// export default AddCustomer;






