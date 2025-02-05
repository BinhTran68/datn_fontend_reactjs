import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Select, DatePicker, Slider, Button, Table, Modal, Form, Space, message, Upload, Card } from 'antd';
import { SearchOutlined, ReloadOutlined, CheckOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';  // Import Link component

const { Option } = Select;
const { RangePicker } = DatePicker;

const Staff = () => {
    const [searchText, setSearchText] = useState('');
    const [status, setStatus] = useState('Tất cả');
    const [dobRange, setDobRange] = useState([]);
    const [ageRange, setAgeRange] = useState([0, 100]);
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);  // State for uploaded file

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('http://localhost:8080/api/admin/staff/hienthi')
            .then((response) => {
                const fetchedData = response.data.map((item, index) => ({
                    key: index + 1,
                    id: item.id, 
                    avatar: item.avatar,
                    fullName: item.fullName,
                    CitizenId: item.citizenId,
                    phoneNumber: item.phoneNumber,
                    dateBirth: moment(item.dateBirth).format('YYYY-MM-DD HH:mm:ss'),  
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

            const dob = moment(item.dateBirth, 'YYYY-MM-DD HH:mm:ss');  
            const dobFromMatch = !dobRange[0] || dob.isSameOrAfter(dobRange[0], 'minute');
            const dobToMatch = !dobRange[1] || dob.isSameOrBefore(dobRange[1], 'minute');

            const age = moment().diff(dob, 'years');
            const ageMatch = age >= ageRange[0] && age <= ageRange[1];
            return (nameMatch || phoneMatch) && statusMatch && dobFromMatch && dobToMatch && ageMatch;
        });
        setData(filtered); 
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
            content: 'Bạn có chắc chắn muốn xóa nhân viên này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                axios.delete(`http://localhost:8080/api/admin/staff/delete/${record.id}`)
                    .then(() => {
                        message.success('Xóa nhân viên thành công!');
                        fetchData();
                    })
                    .catch((error) => {
                        console.error('Error deleting staff:', error);
                        message.error('Xóa nhân viên thất bại!');
                    });
            }
        });
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
                        backgroundColor: text === 'Kích hoạt' ? '#52c41a' : '#FEE527',
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
                    <Link to={`/admin/edit-staff/${record.id}`}>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            style={{ borderRadius: '20px', backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                        />
                    </Link>
                    {/* <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                        style={{ borderRadius: '20px', color:"#FF0000", border: '1px solid red' }}
                    /> */}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2 style={{ color: '#1890ff' }}>Quản lý nhân viên</h2>

            <Card style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '8px' }}>
                <h3 style={{ color: '#1890ff' }}>Bộ lọc</h3>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ marginRight: '10px' }}>Tìm kiếm:</label>
                    <Input
                        placeholder="Tìm kiếm tên và sdt..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: '250px', marginRight: '20px' }}
                    />

                    <label style={{ marginRight: '10px' }}>Ngày sinh:</label>
                    <RangePicker
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime
                        value={dobRange}
                        onChange={(dates) => setDobRange(dates)}
                        style={{ marginRight: '20px' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '10px' }}>Trạng thái:</label>
                    <Select value={status} onChange={(value) => setStatus(value)} style={{ width: '250px', marginRight: "20px" }}>
                        <Option value="Kích hoạt">Kích hoạt</Option>
                        <Option value="Khóa">Khóa</Option>
                    </Select>

                    <label style={{ marginRight: '10px' }}>Khoảng tuổi:</label>
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
                        style={{ marginRight: "10px",  backgroundColor: '#1890ff' }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button 
                        type="default" 
                        icon={<ReloadOutlined />} 
                        onClick={handleReset} 
                        style={{ marginRight: "10px", backgroundColor: '#f5f5f5' }}
                    >
                        Làm mới bộ lọc
                    </Button>
                    <Link to="/admin/add-staff">
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            style={{  backgroundColor: '#52c41a' }}
                        >
                            Thêm mới
                        </Button>
                    </Link>
                </div>
            </Card>

            <Table columns={columns} dataSource={data} style={{ marginTop: '20px' }} />
        </div>
    );
};

export default Staff;