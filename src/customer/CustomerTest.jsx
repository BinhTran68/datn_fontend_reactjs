import React, { useState, useEffect } from 'react';
import { Input, Select, DatePicker, Slider, Button, Table, Space, Card, message, Modal, Drawer } from 'antd';
import { SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {FaEdit, FaMapMarkedAlt} from "react-icons/fa";
import { generateAddressString } from "../helpers/Helpers.js";
import {COLORS} from "../constants/constants.js";

const { Option } = Select;
const { RangePicker } = DatePicker;

const CustomerTest = () => {
    const [searchText, setSearchText] = useState('');
    const [status, setStatus] = useState('Tất cả');
    const [dobRange, setDobRange] = useState([]);
    const [ageRange, setAgeRange] = useState([0, 100]);
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer visibility
    const [recordSelected, setRecordSelected] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({});
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    useEffect(() => {
        fetchData();
        fetchProvinces();
    }, []);

    const fetchData = () => {
        axios.get('http://localhost:8080/api/customers/')
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
                    gender: item.gender === 1 ? 'Nam' : 'Nữ',
                    addresses: item.addresses,
                    password: item.password
                }));
                setData(fetchedData);
            })
            .catch((error) => console.error('Error fetching data:', error));
    };

    const fetchProvinces = () => {
        axios.get('https://provinces.open-api.vn/api/p/')
            .then((response) => {
                setProvinces(response.data);
            })
            .catch((error) => {
                console.error('Error fetching provinces:', error);
            });
    };

    const fetchDistricts = (provinceCode) => {
        axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}/?depth=2`)
            .then((response) => {
                setDistricts(response.data.districts);
            })
            .catch((error) => {
                console.error('Error fetching districts:', error);
            });
    };

    const fetchWards = (districtCode) => {
        axios.get(`https://provinces.open-api.vn/api/d/${districtCode}/?depth=2`)
            .then((response) => {
                setWards(response.data.wards);
            })
            .catch((error) => {
                console.error('Error fetching wards:', error);
            });
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
        axios.delete(`http://localhost:8080/api/customers/delete/${record.id}`)
            .then(() => {
                message.success('Xóa khách hàng thành công!');
                setData(prevData => prevData.filter(item => item.id !== record.id));
            })
            .catch((error) => {
                console.error('Error deleting customer:', error);
                message.error('Xóa khách hàng thất bại!');
            });
    };

    const showModalAddress = (record) => {
        setIsModalOpen(true);
        setRecordSelected(record);
        fetchAddresses(record);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const fetchAddresses = async (record) => {
        if (record?.addresses) {
            const addressStrings = await Promise.all(
                record.addresses.map(async (el) => {
                    const addressString = await generateAddressString(el.provinceId, el.districtId, el.wardId, el.specificAddress);
                    return { id: el.id, address: addressString, isDefault: el.isAddressDefault };
                })
            );
            setAddresses(addressStrings);
        }
    };

    const handleAddAddressClick = () => {
        setIsDrawerOpen(true);
        setNewAddress({});
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setWards([]);
    };

    const handleAddAddress = () => {
        axios.post(`http://localhost:8080/api/customers/add-address/${recordSelected.id}`, newAddress)
            .then((response) => {
                message.success('Thêm địa chỉ thành công!');
                setAddresses([...addresses, response.data]);
                setNewAddress({});
                setIsDrawerOpen(false);
                fetchData();
            })
            .catch((error) => {
                console.error('Error adding address:', error);
                message.error('Thêm địa chỉ thất bại!');
            });
    };

    const handleEditAddress = (addressId) => {
        axios.put(`http://localhost:8080/api/customers/update-address/${addressId}`, newAddress)
            .then((response) => {
                message.success('Cập nhật địa chỉ thành công!');
                setAddresses(addresses.map(address => address.id === addressId ? response.data : address));
                setNewAddress({});
                setIsDrawerOpen(false);
                fetchData();
            })
            .catch((error) => {
                console.error('Error updating address:', error);
                message.error('Cập nhật địa chỉ thất bại!');
            });
    };

 

    const handleSetDefaultAddress = (addressId) => {
        setAddresses(addresses.map(address => ({
            ...address,
            isDefault: address.id === addressId
        })));
        message.success('Đặt làm mặc định thành công!');
    };

    const handleProvinceChange = (value) => {
        setSelectedProvince(value);
        setNewAddress({ ...newAddress, provinceId: value });
        setSelectedDistrict(null);
        setWards([]);
        fetchDistricts(value);
    };

    const handleDistrictChange = (value) => {
        setSelectedDistrict(value);
        setNewAddress({ ...newAddress, districtId: value });
        fetchWards(value);
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
                        backgroundColor: text === 'Kích hoạt' ? '#4CAF50' : `${COLORS.error}`,
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
                    <Link to={`/admin/customer-update/${record.id}`}>
                        <Button
                            icon={
                                <FaEdit
                                    style={{
                                        color: `${COLORS.primary}`,
                                        // marginRight: 8,
                                        fontSize: "1.5rem",
                                    }}
                                />
                            }
                        />
                    </Link>
                    <Button
                        type="danger"
                        icon={<FaMapMarkedAlt />}
                        onClick={() => showModalAddress(record)}
                        style={{
                            borderRadius: '20px',
                            color: '#17a2b8',
                            border: '1px solid #17a2b8'
                        }}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2 >Quản lý tài khoản khách hàng</h2>

            <Modal
                title={`Danh sách địa chỉ của ${recordSelected?.fullName} - ${recordSelected?.phoneNumber}`}
                okText="OK"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Button type="primary" onClick={handleAddAddressClick} icon={<PlusOutlined />} style={{ marginBottom: '10px' }}>
                    Thêm địa chỉ mới
                </Button>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {addresses.length === 0 ? (
                        <p>Không có địa chỉ nào.</p>
                    ) : (
                        addresses.map((addressObj, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #d9d9d9',
                                    marginBottom: '10px',
                                    backgroundColor: '#f9f9f9'
                                }}
                            >
                                <span style={{ flex: 1 }}>{addressObj.address}</span>
                                <Button
                                    type="default"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        setNewAddress({
                                            specificAddress: addressObj.specificAddress,
                                            provinceId: addressObj.provinceId,
                                            districtId: addressObj.districtId,
                                            wardId: addressObj.wardId
                                        });
                                        setIsDrawerOpen(true);
                                    }}
                                    style={{ marginLeft: '10px', borderRadius: '5px' }}
                                />
                            
                                <Button
                                    type="primary"
                                    onClick={() => handleSetDefaultAddress(addressObj.id)}
                                    style={{
                                        marginLeft: '10px',
                                        borderRadius: '5px',
                                        backgroundColor: addressObj.isDefault ? '#4CAF50' : '#1890ff'
                                    }}
                                >
                                    {addressObj.isDefault ? 'Mặc định' : 'Đặt làm mặc định'}
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </Modal>

            <Drawer
                title="Thêm địa chỉ mới"
                width={360}
                onClose={() => setIsDrawerOpen(false)}
                visible={isDrawerOpen}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Input
                    placeholder="Nhập địa chỉ mới..."
                    value={newAddress.specificAddress}
                    onChange={(e) => setNewAddress({ ...newAddress, specificAddress: e.target.value })}
                    style={{ width: '100%', marginBottom: '10px', borderRadius: '5px' }}
                />
                <Select
                    placeholder="Chọn tỉnh/thành phố"
                    style={{ width: '100%', marginBottom: '10px', borderRadius: '5px' }}
                    onChange={handleProvinceChange}
                    value={newAddress.provinceId}
                >
                    {provinces.map((province) => (
                        <Option key={province.code} value={province.code}>{province.name}</Option>
                    ))}
                </Select>
                <Select
                    placeholder="Chọn quận/huyện"
                    style={{ width: '100%', marginBottom: '10px', borderRadius: '5px' }}
                    onChange={handleDistrictChange}
                    value={newAddress.districtId}
                    disabled={!selectedProvince}
                >
                    {districts.map((district) => (
                        <Option key={district.code} value={district.code}>{district.name}</Option>
                    ))}
                </Select>
                <Select
                    placeholder="Chọn phường/xã"
                    style={{ width: '100%', marginBottom: '10px', borderRadius: '5px' }}
                    onChange={(value) => setNewAddress({ ...newAddress, wardId: value })}
                    value={newAddress.wardId}
                    disabled={!selectedDistrict}
                >
                    {wards.map((ward) => (
                        <Option key={ward.code} value={ward.code}>{ward.name}</Option>
                    ))}
                </Select>
                <Button
                    type="primary"
                    onClick={handleAddAddress}
                    style={{ width: '100%', marginBottom: '10px', borderRadius: '5px' }}
                >
                    Thêm địa chỉ
                </Button>
            </Drawer>

            <Card >
                <h3>Bộ lọc</h3>
                <hr/>
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
                        style={{ marginRight: "10px" }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        type="default"
                        icon={<ReloadOutlined />}
                        onClick={handleReset}
                        style={{ marginRight: "10px" }}
                    >
                        Làm mới bộ lọc
                    </Button>

                    <Link to="/admin/customer-create">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}

                        >
                            Thêm mới
                        </Button>
                    </Link>
                </div>
            </Card>

            <Card className={"mt-3"}>
                <h3>Danh sách khách hàng</h3>
                <hr/>
                <Table columns={columns} dataSource={data} style={{ marginTop: '20px' }} />
            </Card>

        </div>
    );
};

export default CustomerTest;