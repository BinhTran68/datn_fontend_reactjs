import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Select, DatePicker, Slider, Button, Table, Modal, Form, Space, message, Upload, Card, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined, CheckOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const CustomerTest = () => {
    const [searchText, setSearchText] = useState('');
    const [status, setStatus] = useState('Tất cả');
    const [dobRange, setDobRange] = useState([]);
    const [ageRange, setAgeRange] = useState([0, 100]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);  // State for uploaded file
    const [provinces, setProvinces] = useState([]); // Tỉnh
    const [districts, setDistricts] = useState([]); // Quận/Huyện
    const [wards, setWards] = useState([]); // Xã/Phường
    const [selectedProvince, setSelectedProvince] = useState(null); // Province ID
    const [selectedDistrict, setSelectedDistrict] = useState(null); // District ID
    const [selectedWard, setSelectedWard] = useState(null); // Ward ID
    const [specificAddress, setSpecificAddress] = useState(''); // House Number/Input

    useEffect(() => {
        fetchData();
        fetchProvinces();
    }, []);

    const fetchData = () => {
        axios.get('http://localhost:8080/api/customers/')
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
                    address:item.address
                }));
                setData(fetchedData);
            })
            .catch((error) => console.error('Error fetching data:', error));
    };

    const fetchProvinces = () => {
        axios.get('https://provinces.open-api.vn/api/p/')
            .then(response => {
                setProvinces(response.data);
            })
            .catch(error => {
                console.error('Error fetching provinces:', error);
            });
    };

    const fetchDistricts = (provinceCode) => {
      if (!provinceCode) return;
        axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}/?depth=2`)
            .then(response => {
                setDistricts(response.data.districts);
            })
            .catch(error => {
                console.error('Error fetching districts:', error);
            });
    };

    const fetchWards = (districtCode) => {
      if (!districtCode) return;
        axios.get(`https://provinces.open-api.vn/api/d/${districtCode}/?depth=2`)
            .then(response => {
                setWards(response.data.wards);
            })
            .catch(error => {
                console.error('Error fetching wards:', error);
            });
    };

    const handleProvinceChange = (value) => {
        setSelectedProvince(value);
        setDistricts([]);
        setSelectedDistrict(null);
        setWards([]);
        setSelectedWard(null);
        fetchDistricts(value);
    };

    const handleDistrictChange = (value) => {
        setSelectedDistrict(value);
        setWards([]);
        setSelectedWard(null);
        fetchWards(value);
    };

    const handleWardChange = (value) => {
        setSelectedWard(value);
    };
    const handleSpecificAddressChange = (e) => {
        setSpecificAddress(e.target.value);
    };

    const handleAddressChange = (province, district, ward, specific) => {
        setSelectedProvince(province);
        setSelectedDistrict(district);
        setSelectedWard(ward);
        setSpecificAddress(specific);
      
        // Fetch districts and wards when province/district changes
        if (province) {
            fetchDistricts(province);
        }
        if (district) {
            fetchWards(district);
        }
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
                axios.delete(`http://localhost:8080/api/customers/delete/${record.id}`)
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
        setDistricts([]);
        setWards([]);

        if (record) {
            const addressParts = record.address ? record.address.split(', ') : [];
            let specific = '';
            let provinceName = '';
            let districtName = '';
            let wardName = '';
            if(addressParts.length === 4){
                 specific = addressParts[0] || '';
                 wardName = addressParts[1] || '';
                 districtName = addressParts[2] || '';
                 provinceName = addressParts[3] || '';
            } else if(addressParts.length === 3){
                wardName = addressParts[0] || '';
                districtName = addressParts[1] || '';
                provinceName = addressParts[2] || '';
            }
          
            const province = provinces.find(p => p.name === provinceName);
            const provinceCode = province ? province.code : null;
            const district = districts.find(d => d.name === districtName);
            const districtCode = district ? district.code : null;

            setSelectedProvince(provinceCode);
            fetchDistricts(provinceCode);
            setSelectedDistrict(districtCode);
            fetchWards(districtCode)
            setSpecificAddress(specific);


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
        } else {
            setSelectedProvince(null);
            setSelectedDistrict(null);
            setSelectedWard(null);
            setSpecificAddress('');
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

            let fullAddress = specificAddress;

            if(selectedWard){
                const selectedWardName = wards.find(w => w.code === selectedWard)?.name;
                fullAddress += `, ${selectedWardName}`;
            }

            if(selectedDistrict){
                const selectedDistrictName = districts.find(d => d.code === selectedDistrict)?.name;
                fullAddress += `, ${selectedDistrictName}`;
            }

            if(selectedProvince){
                const selectedProvinceName = provinces.find(p => p.code === selectedProvince)?.name;
                fullAddress += `, ${selectedProvinceName}`;
            }


          const newData = {
              fullName: values.fullName,
              citizenId: values.CitizenId,
              phoneNumber: values.phoneNumber,
              email: values.email,
              gender: values.gender,
              dateBirth: values.dateBirth.format('YYYY-MM-DDTHH:mm:ss'),
              status: values.status,
              avatar: avatarUrl,
              address: fullAddress, // Combine address parts
          };

          if (selectedRecord) {
              // Update
              axios.put(`http://localhost:8080/api/customers/update/${selectedRecord.id}`, newData)
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
              // Create
              axios.post('http://localhost:8080/api/customers/add', newData)
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
                        icon={<DeleteOutlined  />}
                        onClick={() => handleDelete(record)}
                        style={{ borderRadius: '20px', color:"#FF0000", border: '1px solid red'}}
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
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                        style={{  backgroundColor: '#4CAF50', color: 'white' }}
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

                  

                    <Form.Item label="Địa chỉ">
                        <Row gutter={16}>
                            {/* Dropdown for Provinces */}
                            <Col span={12} className={"mb-3"}>
                                <Form.Item
                                    label="Tỉnh"
                                    labelCol={{ span: 12 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Select
                                        value={selectedProvince || null}
                                        onChange={handleProvinceChange}
                                        placeholder="Chọn tỉnh/thành phố"
                                    >
                                        {provinces.map(province => (
                                            <Option key={province.code} value={province.code}>
                                                {province.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            {/* Dropdown for Districts */}
                            <Col span={12}>
                                <Form.Item
                                    label="Huyện"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Select
                                        value={selectedDistrict || null}
                                        onChange={handleDistrictChange}
                                        placeholder="Chọn quận/huyện"
                                        disabled={!selectedProvince}
                                    >
                                        {districts.map(district => (
                                            <Option key={district.code} value={district.code}>
                                                {district.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            {/* Dropdown for Wards */}
                            <Col span={12}>
                                <Form.Item
                                    label="Xã"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Select
                                        value={selectedWard || null}
                                        onChange={handleWardChange}
                                        placeholder="Chọn xã/phường"
                                        disabled={!selectedDistrict}
                                    >
                                        {wards.map(ward => (
                                            <Option key={ward.code} value={ward.code}>
                                                {ward.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label="Số nhà/ngõ đường"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Input
                                        value={specificAddress}
                                        onChange={handleSpecificAddressChange}
                                        placeholder="Ngõ/tên đường ..."
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
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

export default CustomerTest;