
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Select, DatePicker, Slider, Button, Table, Modal, Form, Space, message, Upload, Card, Avatar } from 'antd';
import { SearchOutlined, ReloadOutlined, CheckOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {FaEdit} from "react-icons/fa";
import {COLORS} from "../../constants/constants.js";
import * as XLSX from 'xlsx';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Staff = () => {
    const [searchText, setSearchText] = useState('');
    const [status, setStatus] = useState('Tất cả');
    const [dobRange, setDobRange] = useState([]);
    const [ageRange, setAgeRange] = useState([0, 100]);
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

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
                    status: item.status === 0 ? 'Kích hoạt' : 'Khóa',
                    email: item.email,
                    gender: item.gender,
                }));
                
                // Log to see what's in the avatar field
                console.log("Staff data with avatars:", fetchedData);
                
                setData(fetchedData);
            })
            .catch((error) => console.error('Error fetching data:', error));
    };

    const handleSearch = () => {
        axios.get('http://localhost:8080/api/admin/staff/filterr', {
            params: {
                searchText: searchText,
                status: status,
                dobFrom: dobRange[0] ? dobRange[0].format('YYYY-MM-DD HH:mm:ss') : null,
                dobTo: dobRange[1] ? dobRange[1].format('YYYY-MM-DD HH:mm:ss') : null,
                ageFrom: ageRange[0],
                ageTo: ageRange[1],
            }
        })
        .then((response) => {
            const filteredData = response.data.map((item, index) => ({
                key: index + 1,
                id: item.id,
                avatar: item.avatar,
                fullName: item.fullName,
                CitizenId: item.CitizenId,
                phoneNumber: item.phoneNumber,
                dateBirth: moment(item.dateBirth).format('YYYY-MM-DD HH:mm:ss'),
                status: item.status === 0 ? 'Kích hoạt' : 'Khóa',
                email: item.email,
                gender: item.gender,
            }));
            setData(filteredData);
        })
        .catch((error) => console.error('Error fetching filtered data:', error));
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

    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
            'Họ và tên': item.fullName,
            'CCCD': item.CitizenId,
            'Số điện thoại': item.phoneNumber,
            'Ngày sinh': item.dateBirth,
            'Email': item.email,
            'Trạng Thái': item.status,
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Staff Data');

        XLSX.writeFile(workbook, 'staff_data.xlsx');
    };

    // Function to check if the URL is valid
    const isValidUrl = (url) => {
        if (!url) return false;
        
        // Check if the URL is a string and has a minimum length
        if (typeof url !== 'string' || url.length < 5) return false;
        
        // Simple check if it starts with http:// or https:// or data:
        return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:');
    };

    // Generate avatar initials from name
    const getInitials = (name) => {
        if (!name) return '?';
        
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0].charAt(0)}${parts[parts.length-1].charAt(0)}`.toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
            width: 60,
        },
        {
            title: 'Ảnh',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 80,
            render: (src, record) => {
                // For debugging - log the avatar URL
                console.log(`Avatar for ${record.fullName}:`, src);
                
                return (
                    <Avatar 
                        src={isValidUrl(src) ? src : null}
                        style={{ 
                            backgroundColor: !isValidUrl(src) ? '#1890ff' : 'transparent',
                            color: '#fff',
                            fontSize: '16px',
                            border: '1px solid #f0f0f0',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        size={50}
                        alt={record.fullName}
                    >
                        {!isValidUrl(src) && getInitials(record.fullName)}
                    </Avatar>
                );
            },
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
            render: (text) => (
                <span>{moment(text).format('DD/MM/YYYY')}</span>
            ),
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
                type={text === 'Kích hoạt' ? 'primary' : 'danger'}
                style={{
                    borderRadius: '5px',
                    padding: '2px 15px',
                    height: '30px',
                    textAlign: 'center',
                    fontWeight: 'normal',
                    backgroundColor: text === 'Kích hoạt' ? '#f6ffed' : '#fff1f0',
                    color: text === 'Kích hoạt' ? '#52c41a' : '#ff4d4f',
                    border: text === 'Kích hoạt' ? '1px solid #b7eb8f' : '1px solid #ffa39e'
                }}
            >
                {text }
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
                            icon={
                                <FaEdit
                                    style={{
                                        color: `${COLORS.primary}`,
                                        fontSize: "1.5rem",
                                    }}
                                />
                            }
                        />
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2>Quản lý nhân viên</h2>

            <Card style={{ padding: '20px',  borderRadius: '8px' }}>
                <h3>Bộ lọc</h3>
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
                        format="DD/MM/YYYY"
                        value={dobRange}
                        onChange={(dates) => setDobRange(dates)}
                        style={{ marginRight: '20px' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '10px' }}>Trạng thái:</label>
                    <Select value={status} onChange={(value) => setStatus(value)} style={{ width: '250px', marginRight: "20px" }}>
                        <Option value="Tất cả">Tất cả</Option>
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
                        style={{ marginRight: "10px"}}
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
                        >
                            Thêm mới
                        </Button>
                    </Link>
                    <Button
                        type="default"
                        onClick={handleExport}
                        style={{ marginLeft: '10px', backgroundColor: '#f5f5f5' }}
                    >
                        Xuất Excel
                    </Button>
                </div>
            </Card>
            <Card>
                <h3>Danh sách nhân viên</h3>
                <hr/>
                <Table 
                    columns={columns} 
                    dataSource={data} 
                    style={{ marginTop: '20px' }}
                    scroll={{ x: 1100 }} 
                />
            </Card>
        </div>
    );
};

export default Staff;









// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Input, Select, DatePicker, Slider, Button, Table, Modal, Form, Space, message, Upload, Card } from 'antd';
// import { SearchOutlined, ReloadOutlined, CheckOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
// import moment from 'moment';
// import { Link } from 'react-router-dom';
// import {FaEdit} from "react-icons/fa";
// import {COLORS} from "../../constants/constants.js";  // Import Link component
// import * as XLSX from 'xlsx'; // Import the xlsx library

// const { Option } = Select;
// const { RangePicker } = DatePicker;

// const Staff = () => {
//     const [searchText, setSearchText] = useState('');
//     const [status, setStatus] = useState('Tất cả');
//     const [dobRange, setDobRange] = useState([]);
//     const [ageRange, setAgeRange] = useState([0, 100]);
//     const [data, setData] = useState([]);
//     const [form] = Form.useForm();
//     const [fileList, setFileList] = useState([]);  // State for uploaded file

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = () => {
//         axios.get('http://localhost:8080/api/admin/staff/hienthi')
//             .then((response) => {
//                 const fetchedData = response.data.map((item, index) => ({
//                     key: index + 1,
//                     id: item.id, 
//                     avatar: item.avatar,
//                     fullName: item.fullName,
//                     CitizenId: item.citizenId,
//                     phoneNumber: item.phoneNumber,
//                     dateBirth: moment(item.dateBirth).format('YYYY-MM-DD HH:mm:ss'),  
//                     status: item.status === 0 ? 'Kích hoạt' : 'Khóa',
//                     email: item.email,
//                     gender: item.gender,
//                 }));
//                 setData(fetchedData);
//             })
//             .catch((error) => console.error('Error fetching data:', error));
//     };

//     // const handleSearch = () => {
//     //     const filtered = data.filter((item) => {
//     //         const nameMatch = item.fullName.toLowerCase().includes(searchText.toLowerCase());
//     //         const phoneMatch = item.phoneNumber.includes(searchText);

//     //         const statusMatch = status === 'Tất cả' || item.status === status;

//     //         const dob = moment(item.dateBirth, 'YYYY-MM-DD HH:mm:ss');  
//     //         const dobFromMatch = !dobRange[0] || dob.isSameOrAfter(dobRange[0], 'minute');
//     //         const dobToMatch = !dobRange[1] || dob.isSameOrBefore(dobRange[1], 'minute');

//     //         const age = moment().diff(dob, 'years');
//     //         const ageMatch = age >= ageRange[0] && age <= ageRange[1];
//     //         return (nameMatch || phoneMatch) && statusMatch && dobFromMatch && dobToMatch && ageMatch;
//     //     });
//     //     setData(filtered); 
//     // };

//     const handleExport = () => {
//         // Convert data to a format suitable for an Excel file
//         const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
//             'Họ và tên': item.fullName,
//             'CCCD': item.CitizenId,
//             'Số điện thoại': item.phoneNumber,
//             'Ngày sinh': item.dateBirth,
//             'Email': item.email,
//             'Trạng Thái': item.status,
//         })));

//         // Create a new workbook and add the worksheet
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Staff Data');

//         // Export the file
//         XLSX.writeFile(workbook, 'staff_data.xlsx');
//     };


//     const handleSearch = () => {
//         axios.get('http://localhost:8080/api/admin/staff/filterr', {
//             params: {
//                 searchText: searchText,
//                 status: status,
//                 dobFrom: dobRange[0] ? dobRange[0].format('YYYY-MM-DD HH:mm:ss') : null,
//                 dobTo: dobRange[1] ? dobRange[1].format('YYYY-MM-DD HH:mm:ss') : null,
//                 ageFrom: ageRange[0],
//                 ageTo: ageRange[1],
//             }
//         })
//         .then((response) => {
//             const filteredData = response.data.map((item, index) => ({
//                 key: index + 1,
//                 id: item.id,
//                 avatar: item.avatar,
//                 fullName: item.fullName,
//                 CitizenId: item.CitizenId,
//                 phoneNumber: item.phoneNumber,
//                 dateBirth: moment(item.dateBirth).format('YYYY-MM-DD HH:mm:ss'),
//                 status: item.status === 0 ? 'Kích hoạt' : 'Khóa',
//                 email: item.email,
//                 gender: item.gender,
//             }));
//             setData(filteredData);
//         })
//         .catch((error) => console.error('Error fetching filtered data:', error));
//     };


//     const handleReset = () => {
//         setSearchText('');
//         setStatus('Tất cả');
//         setDobRange([]);
//         setAgeRange([0, 100]);
//         fetchData();
//     };

//     const handleDelete = (record) => {
//         Modal.confirm({
//             title: 'Xác nhận xóa',
//             content: 'Bạn có chắc chắn muốn xóa nhân viên này?',
//             okText: 'Xóa',
//             okType: 'danger',
//             cancelText: 'Hủy',
//             onOk() {
//                 axios.delete(`http://localhost:8080/api/admin/staff/delete/${record.id}`)
//                     .then(() => {
//                         message.success('Xóa nhân viên thành công!');
//                         fetchData();
//                     })
//                     .catch((error) => {
//                         console.error('Error deleting staff:', error);
//                         message.error('Xóa nhân viên thất bại!');
//                     });
//             }
//         });
//     };

//     const columns = [
//         {
//             title: 'STT',
//             dataIndex: 'key',
//             key: 'key',
//         },
//         // {
//         //     title: 'Avatar',
//         //     dataIndex: 'avatar',
//         //     key: 'avatar',
//         //     render: (src) => (
//         //         <img src={src} alt="avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} />
//         //     ),
//         // },
//         {
//             title: 'Họ và tên',
//             dataIndex: 'fullName',
//             key: 'fullName',
//         },
//         {
//             title: 'CCCD',
//             dataIndex: 'CitizenId',
//             key: 'CitizenId',
//         },
//         {
//             title: 'Số điện thoại',
//             dataIndex: 'phoneNumber',
//             key: 'phoneNumber',
//         },
//         {
//             title: 'Ngày sinh',
//             dataIndex: 'dateBirth',
//             key: 'dateBirth',
//         },
//         {
//             title: 'Email',
//             dataIndex: 'email',
//             key: 'email',
//         },
//         {
//             title: 'Trạng Thái',
//             dataIndex: 'status',
//             key: 'status',
//             render: (text) => (
//                 <Button
//                     type={text === 'Kích hoạt' ? 'primary' : 'default'}
//                     disabled
//                     style={{
//                         borderRadius: '20px', 
//                         padding: '6px 12px', 
//                         textAlign: 'center',
//                         fontWeight: 'bold',
//                         backgroundColor: text === 'Kích hoạt' ? '#52c41a' : `${COLORS.error}`,
//                         color: 'white'
//                     }}
//                 >
//                     {text}
//                 </Button>
//             ),
//         },
//         {
//             title: 'Hành động',
//             key: 'action',
//             render: (_, record) => (
//                 <Space size="middle">
//                     <Link to={`/admin/edit-staff/${record.id}`}>
//                         <Button
//                             icon={
//                                 <FaEdit
//                                     style={{
//                                         color: `${COLORS.primary}`,
//                                         // marginRight: 8,
//                                         fontSize: "1.5rem",
//                                     }}
//                                 />
//                             }

//                         />
//                     </Link>
//                     {/* <Button
//                         type="danger"
//                         icon={<DeleteOutlined />}
//                         onClick={() => handleDelete(record)}
//                         style={{ borderRadius: '20px', color:"#FF0000", border: '1px solid red' }}
//                     /> */}
//                 </Space>
//             ),
//         },
//     ];

//     return (
//         <div>
//             <h2 >Quản lý nhân viên</h2>

//             <Card style={{ padding: '20px',  borderRadius: '8px' }}>
//                 <h3 >Bộ lọc</h3>
//                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//                     <label style={{ marginRight: '10px' }}>Tìm kiếm:</label>
//                     <Input
//                         placeholder="Tìm kiếm tên và sdt..."
//                         value={searchText}
//                         onChange={(e) => setSearchText(e.target.value)}
//                         style={{ width: '250px', marginRight: '20px' }}
//                     />

//                     <label style={{ marginRight: '10px' }}>Ngày sinh:</label>
//                     <RangePicker
//                         format="YYYY-MM-DD HH:mm:ss"
//                         showTime
//                         value={dobRange}
//                         onChange={(dates) => setDobRange(dates)}
//                         style={{ marginRight: '20px' }}
//                     />
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                     <label style={{ marginRight: '10px' }}>Trạng thái:</label>
//                     <Select value={status} onChange={(value) => setStatus(value)} style={{ width: '250px', marginRight: "20px" }}>
//                         <Option value="Kích hoạt">Kích hoạt</Option>
//                         <Option value="Khóa">Khóa</Option>
//                     </Select>

//                     <label style={{ marginRight: '10px' }}>Khoảng tuổi:</label>
//                     <Slider
//                         range
//                         min={0}
//                         max={100}
//                         value={ageRange}
//                         onChange={(value) => setAgeRange(value)}
//                         style={{ width: '250px' }}
//                     />
//                 </div>
//                 <div style={{ marginTop: '20px' }}>
//                     <Button 
//                         type="primary" 
//                         icon={<SearchOutlined />} 
//                         onClick={handleSearch} 
//                         style={{ marginRight: "10px"}}
//                     >
//                         Tìm kiếm
//                     </Button>
//                     <Button 
//                         type="default" 
//                         icon={<ReloadOutlined />} 
//                         onClick={handleReset} 
//                         style={{ marginRight: "10px", backgroundColor: '#f5f5f5' }}
//                     >
//                         Làm mới bộ lọc
//                     </Button>
//                     <Link to="/admin/add-staff">
//                         <Button 
//                             type="primary" 
//                             icon={<PlusOutlined />} 

//                         >
//                             Thêm mới
//                         </Button>
//                     </Link>
//                     <Button
//                         type="default"
//                         onClick={handleExport}
//                         style={{ marginLeft: '10px', backgroundColor: '#f5f5f5' }}
//                     >
//                         Xuất Excel
//                     </Button>
//                 </div>
//             </Card>
//             <Card>
//                 <h3>Danh sách nhân viên</h3>
//                 <hr/>
//                 <Table columns={columns} dataSource={data} style={{ marginTop: '20px' }} />
//             </Card>

//         </div>
//     );
// };

// export default Staff;





