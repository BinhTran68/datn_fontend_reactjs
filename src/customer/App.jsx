import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Select, DatePicker, Slider, Button, Table, Modal, Form, Space, message, Upload, Card } from 'antd';
import { SearchOutlined, ReloadOutlined, CheckOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const App = () => {
    const [searchText, setSearchText] = useState('');
    const [status, setStatus] = useState('Tất cả');
    const [dobRange, setDobRange] = useState([]);
    const [ageRange, setAgeRange] = useState([0, 100]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);  // State for uploaded file

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('http://localhost:8080/api/khachhang/hienthi')
            .then((response) => {
                const fetchedData = response.data.map((item, index) => ({
                    key: index + 1,
                    id: item.id, // Add id for update/delete
                    avatar: item.avatar,
                    fullName: item.fullName,
                    CitizenId: item.citizenId,
                    phoneNumber: item.phoneNumber,
                    dateBirth: moment(item.dateBirth).format('YYYY-MM-DD HH:mm:ss'),  // Adjusted format to include time
                    status: item.status === 1 ? 'Kích hoạt' : 'Khóa',
                    email: item.email,
                    gender: item.gender,
                }));
                setData(fetchedData);
            })
            .catch((error) => console.error('Error fetching data:', error));
    };

    const handleSearch = () => {
        const filtered = data.filter((item) => {
            const nameMatch = item.fullName.toLowerCase().includes(searchText.toLowerCase());
            const phoneMatch = item.phoneNumber.includes(searchText);

            const statusMatch = status === 'Tất cả' || item.status === status;

            const dob = moment(item.dateBirth, 'YYYY-MM-DD HH:mm:ss');  // Handle the full datetime format
            const dobFromMatch = !dobRange[0] || dob.isSameOrAfter(dobRange[0], 'minute');
            const dobToMatch = !dobRange[1] || dob.isSameOrBefore(dobRange[1], 'minute');

            const age = moment().diff(dob, 'years');
            const ageMatch = age >= ageRange[0] && age <= ageRange[1];
            return (nameMatch || phoneMatch) && statusMatch && dobFromMatch && dobToMatch && ageMatch;
        });
        setData(filtered); // Update data state with the filtered results
    };

    const handleReset = () => {
        setSearchText('');
        setStatus('Tất cả');
        setDobRange([]);
        setAgeRange([0, 100]);
        fetchData();
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa khách hàng này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                axios.delete(`http://localhost:8080/api/khachhang/delete/${record.id}`)
                    .then(() => {
                        message.success('Xóa khách hàng thành công!');
                        fetchData();
                    })
                    .catch((error) => {
                        console.error('Error deleting customer:', error);
                        message.error('Xóa khách hàng thất bại!');
                    });
            }
        });
    };

    const showModal = (record = null) => {
        setSelectedRecord(record);
        form.resetFields();
        setFileList([]); // Reset file list when opening modal

        if (record) {
            form.setFieldsValue({
                ...record,
                fullName: record.fullName,
                CitizenId: record.CitizenId,
                phoneNumber: record.phoneNumber,
                email: record.email,
                gender: record.gender,
                dateBirth: moment(record.dateBirth, 'YYYY-MM-DD HH:mm:ss'),  // Handle datetime format
                status: record.status === 'Kích hoạt' ? 1 : 0,
            });

            if (record.avatar) {
                setFileList([{
                    uid: '-1',
                    name: 'avatar',
                    status: 'done',
                    url: record.avatar,
                }]);
            }
        }
        setIsModalVisible(true);
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
                        const uploadRes = await axios.post('http://localhost:8080/api/khachhang/add', formData, {
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
                    citizenId: values.CitizenId, 
                    phoneNumber: values.phoneNumber, 
                    email: values.email, 
                    gender: values.gender,
                    // Format dateBirth to include both date and time (LocalDateTime)
                    dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'), 
                    status: values.status,
                    avatar: avatarUrl, 
                };

                if (selectedRecord) {
                    axios.put(`http://localhost:8080/api/khachhang/update/${selectedRecord.id}`, newData)
                        .then(() => {
                            message.success('Cập nhật khách hàng thành công!');
                            fetchData();
                            setIsModalVisible(false);
                        })
                        .catch((error) => {
                            console.error('Error updating customer:', error);
                            message.error('Cập nhật khách hàng thất bại!');
                        });
                } else {
                    axios.post('http://localhost:8080/api/khachhang/add', newData)
                        .then(() => {
                            message.success('Thêm khách hàng thành công!');
                            fetchData();
                            setIsModalVisible(false);
                        })
                        .catch((error) => {
                            console.error('Error adding customer:', error);
                            message.error('Thêm khách hàng thất bại!');
                        });
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
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

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (src) => (
                <img src={src} alt="avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} />
            ),
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'CCCD',
            dataIndex: 'CitizenId',
            key: 'CitizenId',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateBirth',
            key: 'dateBirth',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <Button
                    type={text === 'Kích hoạt' ? 'primary' : 'default'}
                    disabled
                    style={{
                        borderRadius: '20px',
                        padding: '6px 12px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        backgroundColor: text === 'Kích hoạt' ? '#4CAF50' : '#f44336',
                        color: 'white'
                    }}
                >
                    {text}
                </Button>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                        style={{ borderRadius: '20px', backgroundColor: '#1890ff', color: 'white' }}
                    />
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                        style={{ borderRadius: '20px' }}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#1890ff', marginBottom: '20px' }}>Quản lý tài khoản khách hàng</h2>

            <Card style={{ padding: '20px', borderRadius: '10px' }}>
                <h3 style={{ marginBottom: '15px', fontWeight: 'bold' }}>Bộ lọc</h3>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ marginRight: '10px', fontWeight: '500' }}>Tìm kiếm:</label>
                    <Input
                        placeholder="Tìm kiếm tên và sdt..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: '250px', marginRight: '20px', borderRadius: '10px' }}
                    />

                    <label style={{ marginRight: '10px', fontWeight: '500' }}>Ngày sinh:</label>
                    <RangePicker
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime
                        value={dobRange}
                        onChange={(dates) => setDobRange(dates)}
                        style={{ marginRight: '20px', borderRadius: '10px' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '10px', fontWeight: '500' }}>Trạng thái:</label>
                    <Select
                        value={status}
                        onChange={(value) => setStatus(value)}
                        style={{ width: '250px', marginRight: "20px", borderRadius: '10px' }}
                    >
                        <Option value="Kích hoạt">Kích hoạt</Option>
                        <Option value="Khóa">Khóa</Option>
                    </Select>

                    <label style={{ marginRight: '10px', fontWeight: '500' }}>Khoảng tuổi:</label>
                    <Slider
                        range
                        min={0}
                        max={100}
                        value={ageRange}
                        onChange={(value) => setAgeRange(value)}
                        style={{ width: '250px' }}
                    />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                        style={{ marginRight: "10px", borderRadius: '20px' }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        type="default"
                        icon={<ReloadOutlined />}
                        onClick={handleReset}
                        style={{ marginRight: "10px", borderRadius: '20px' }}
                    >
                        Làm mới bộ lọc
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                        style={{ borderRadius: '20px', backgroundColor: '#4CAF50', color: 'white' }}
                    >
                        Thêm mới
                    </Button>
                </div>
            </Card>

            <Table columns={columns} dataSource={data} style={{ marginTop: '20px' }} />

            <Modal
                title={selectedRecord ? 'Chỉnh sửa khách hàng' : 'Thêm mới khách hàng'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
                width={600}
                style={{
                    borderRadius: '10px',
                    backgroundColor: '#f4f6f9',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                }}
            >
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
                </Form>
            </Modal>
        </div>
    );
};

export default App;
