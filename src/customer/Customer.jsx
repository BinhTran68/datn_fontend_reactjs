import React, { useState } from 'react';
import { Input, Select, DatePicker, Slider, Button, Table } from 'antd';
import { SearchOutlined, ReloadOutlined, CheckOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('Tất cả');
  const [dobFrom, setDobFrom] = useState(null);
  const [dobTo, setDobTo] = useState(null);
  const [ageRange, setAgeRange] = useState([0, 100]);

  const handleSearch = () => {
    console.log('Search:', searchText, status, dobFrom, dobTo, ageRange);
    // Implement your search logic here
  };

  const handleReset = () => {
    setSearchText('');
    setStatus('Tất cả');
    setDobFrom(null);
    setDobTo(null);
    setAgeRange([0, 100]);
    console.log('Reset filters');
    // Implement your reset logic here
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Ảnh',
      dataIndex: 'anh',
      key: 'anh',
      render: () => <span>Placeholder</span>, // Replace with your image rendering logic
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'CCCD',
      dataIndex: 'cccd',
      key: 'cccd',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'sdt',
      key: 'sdt',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaysinh',
      key: 'ngaysinh',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangthai',
      key: 'trangthai',
      render: (text) => (
        <Button type={text === 'Kích hoạt' ? 'primary' : 'default'} style={{ backgroundColor: text === 'Kích hoạt' ? '#90ee90' : '' }} disabled>
          {text}
        </Button>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button type="primary" shape="circle" icon={<CheckOutlined />} style={{marginRight: 8, backgroundColor: "#f0ad4e", borderColor: "#eea236"}}/>
          <Button type="primary" shape="circle" icon={<EditOutlined />} style={{marginRight: 8, backgroundColor: "#5cb85c", borderColor: "#4cae4c"}}/>
          <Button type="primary" shape="circle" icon={<DeleteOutlined />} style={{backgroundColor: "#000000", borderColor: "#000000"}}/>
        </span>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      stt: '1',
      ten: 'Nguyễn Văn Anh',
      cccd: '001200006666',
      sdt: '0370530000',
      ngaysinh: '01/06/2000',
      trangthai: 'Kích hoạt',
    },
    // Add more data here
  ];

  return (
    <div>
      <h2>Quản lý tài khoản khách hàng</h2>

      <div style={{ padding: '20px', background: '#fff', borderRadius: '5px', marginBottom: '20px' }}>
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
          <DatePicker
            placeholder="dd/mm/yyyy"
            value={dobFrom}
            onChange={(date) => setDobFrom(date)}
            format="DD/MM/YYYY"
            style={{ marginRight: '10px' }}
          />
          <DatePicker
            placeholder="dd/mm/yyyy"
            value={dobTo}
            onChange={(date) => setDobTo(date)}
            format="DD/MM/YYYY"
            style={{ marginRight: '20px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '10px' }}>Trạng thái:</label>
          <Select value={status} onChange={(value) => setStatus(value)} style={{ width: '250px', marginRight:"20px" }}>
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
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{marginRight:"10px"}}>
            Tìm kiếm
          </Button>
          <Button type="default" icon={<ReloadOutlined />} onClick={handleReset}>
            Làm mới bộ lọc
          </Button>
        </div>
      </div>

      <div style={{marginBottom: "10px"}}>
        <h3 style={{display: "inline-block", marginRight: "10px"}}>Danh sách khách hàng</h3>
          <Button type="primary" style={{float: "right"}} >+ Thêm</Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default App;