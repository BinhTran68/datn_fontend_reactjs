// import React, { useState } from 'react';
// import { Input, Select, DatePicker, Slider, Button, Table } from 'antd';
// import { SearchOutlined, ReloadOutlined, CheckOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// const { Option } = Select;

// const App = () => {
//   const [searchText, setSearchText] = useState('');
//   const [status, setStatus] = useState('Tất cả');
//   const [dobFrom, setDobFrom] = useState(null);
//   const [dobTo, setDobTo] = useState(null);
//   const [ageRange, setAgeRange] = useState([0, 100]);

//   const handleSearch = () => {
//     console.log('Search:', searchText, status, dobFrom, dobTo, ageRange);
//     // Implement your search logic here
//   };

//   const handleReset = () => {
//     setSearchText('');
//     setStatus('Tất cả');
//     setDobFrom(null);
//     setDobTo(null);
//     setAgeRange([0, 100]);
//     console.log('Reset filters');
//     // Implement your reset logic here
//   };

//   const columns = [
//     {
//       title: 'STT',
//       dataIndex: 'stt',
//       key: 'stt',
//     },
//     {
//       title: 'Ảnh',
//       dataIndex: 'anh',
//       key: 'anh',
//       render: () => <span>Placeholder</span>, // Replace with your image rendering logic
//     },
//     {
//       title: 'Tên khách hàng',
//       dataIndex: 'ten',
//       key: 'ten',
//     },
//     {
//       title: 'CCCD',
//       dataIndex: 'cccd',
//       key: 'cccd',
//     },
//     {
//       title: 'Số điện thoại',
//       dataIndex: 'sdt',
//       key: 'sdt',
//     },
//     {
//       title: 'Ngày sinh',
//       dataIndex: 'ngaysinh',
//       key: 'ngaysinh',
//     },
//     {
//       title: 'Trạng Thái',
//       dataIndex: 'trangthai',
//       key: 'trangthai',
//       render: (text) => (
//         <Button type={text === 'Kích hoạt' ? 'primary' : 'default'} style={{ backgroundColor: text === 'Kích hoạt' ? '#90ee90' : '' }} disabled>
//           {text}
//         </Button>
//       ),
//     },
//     {
//       title: 'Hành động',
//       key: 'action',
//       render: (_, record) => (
//         <span>
//           <Button type="primary" shape="circle" icon={<CheckOutlined />} style={{marginRight: 8, backgroundColor: "#f0ad4e", borderColor: "#eea236"}}/>
//           <Button type="primary" shape="circle" icon={<EditOutlined />} style={{marginRight: 8, backgroundColor: "#5cb85c", borderColor: "#4cae4c"}}/>
//           <Button type="primary" shape="circle" icon={<DeleteOutlined />} style={{backgroundColor: "#000000", borderColor: "#000000"}}/>
//         </span>
//       ),
//     },
//   ];

//   const data = [
//     {
//       key: '1',
//       stt: '1',
//       ten: 'Nguyễn Văn Anh',
//       cccd: '001200006666',
//       sdt: '0370530000',
//       ngaysinh: '01/06/2000',
//       trangthai: 'Kích hoạt',
//     },
//     // Add more data here
//   ];

//   return (
//     <div>
//       <h2>Quản lý tài khoản khách hàng</h2>

//       <div style={{ padding: '20px', background: '#fff', borderRadius: '5px', marginBottom: '20px' }}>
//         <h3>Bộ lọc</h3>
//         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//           <label style={{ marginRight: '10px' }}>Tìm kiếm:</label>
//           <Input
//             placeholder="Tìm kiếm tên và sdt..."
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             style={{ width: '250px', marginRight: '20px' }}
//           />

//           <label style={{ marginRight: '10px' }}>Ngày sinh:</label>
//           <DatePicker
//             placeholder="dd/mm/yyyy"
//             value={dobFrom}
//             onChange={(date) => setDobFrom(date)}
//             format="DD/MM/YYYY"
//             style={{ marginRight: '10px' }}
//           />
//           <DatePicker
//             placeholder="dd/mm/yyyy"
//             value={dobTo}
//             onChange={(date) => setDobTo(date)}
//             format="DD/MM/YYYY"
//             style={{ marginRight: '20px' }}
//           />
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <label style={{ marginRight: '10px' }}>Trạng thái:</label>
//           <Select value={status} onChange={(value) => setStatus(value)} style={{ width: '250px', marginRight:"20px" }}>
//             <Option value="Tất cả">Tất cả</Option>
//             <Option value="Kích hoạt">Kích hoạt</Option>
//             <Option value="Khóa">Khóa</Option>
//           </Select>

//           <label style={{ marginRight: '10px' }}>Khoảng tuổi:</label>
//           <Slider
//             range
//             min={0}
//             max={100}
//             value={ageRange}
//             onChange={(value) => setAgeRange(value)}
//             style={{ width: '250px' }}
//           />
//         </div>
//         <div style={{ marginTop: '20px' }}>
//           <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{marginRight:"10px"}}>
//             Tìm kiếm
//           </Button>
//           <Button type="default" icon={<ReloadOutlined />} onClick={handleReset}>
//             Làm mới bộ lọc
//           </Button>
//         </div>
//       </div>

//       <div style={{marginBottom: "10px"}}>
//         <h3 style={{display: "inline-block", marginRight: "10px"}}>Danh sách khách hàng</h3>
//           <Button type="primary" style={{float: "right"}} >+ Thêm</Button>
//       </div>
//       <Table columns={columns} dataSource={data} />
//     </div>
//   );
// };

// export default App;
import React, { useState } from 'react';
import { Input, Select, DatePicker, Slider, Button, Table, Modal } from 'antd';
import { SearchOutlined, ReloadOutlined, CheckOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('Tất cả');
  const [dobFrom, setDobFrom] = useState(null);
  const [dobTo, setDobTo] = useState(null);
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const initialData = [
    {
      key: '1',
      stt: '1',
      ten: 'Nguyễn Văn Anh',
      cccd: '001200006666',
      sdt: '0370530000',
      ngaysinh: '01/06/2000',
      trangthai: 'Kích hoạt',
    },
    {
      key: '2',
      stt: '2',
      ten: 'Trần Thị Bé',
      cccd: '001200007777',
      sdt: '0370530001',
      ngaysinh: '15/11/1995',
      trangthai: 'Khóa',
    },
    {
      key: '3',
      stt: '3',
      ten: 'Lê Văn Cường',
      cccd: '001200008888',
      sdt: '0370530002',
      ngaysinh: '20/03/1988',
      trangthai: 'Kích hoạt',
    },
    {
      key: '4',
      stt: '4',
      ten: 'Phạm Thị Dung',
      cccd: '001200009999',
      sdt: '0370530003',
      ngaysinh: '10/09/2005',
      trangthai: 'Kích hoạt',
    },
  ];
  
  const [data, setData] = useState(initialData);

  const handleSearch = () => {
    const filtered = initialData.filter((item) => {
      const nameMatch = item.ten.toLowerCase().includes(searchText.toLowerCase());
      const phoneMatch = item.sdt.includes(searchText);

      const statusMatch = status === 'Tất cả' || item.trangthai === status;

      const dob = moment(item.ngaysinh, 'DD/MM/YYYY');
      const dobFromMatch = !dobFrom || dob.isSameOrAfter(dobFrom, 'day');
      const dobToMatch = !dobTo || dob.isSameOrBefore(dobTo, 'day');

      const age = moment().diff(dob, 'years');
      const ageMatch = age >= ageRange[0] && age <= ageRange[1];
      return (nameMatch || phoneMatch) && statusMatch && dobFromMatch && dobToMatch && ageMatch;
    });
    setFilteredData(filtered)
    setData(filtered);
  };

  const handleReset = () => {
    setSearchText('');
    setStatus('Tất cả');
    setDobFrom(null);
    setDobTo(null);
    setAgeRange([0, 100]);
    setData(initialData);
  };

  const handleActivate = (record) => {
    const newData = data.map((item) =>
      item.key === record.key ? { ...item, trangthai: 'Kích hoạt' } : item
    );
    setData(newData);
    console.log('Activate:', record);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
    console.log('Edit:', record);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa khách hàng ${record.ten}?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        const newData = data.filter((item) => item.key !== record.key);
        setData(newData);
        console.log('Delete:', record);
      },
    });
  };

  const handleAdd = () => {
      setSelectedRecord(null)
      setIsModalVisible(true)
  }

  const handleModalOk = () => {
    // Handle form submission and data update here

    console.log('Modal OK:', selectedRecord);

    setIsModalVisible(false);
    setSelectedRecord(null);

    // Example of updating data (replace with your actual logic)
    // if (selectedRecord) {
    //   const newData = data.map((item) =>
    //     item.key === selectedRecord.key ? { ...item, ...selectedRecord } : item
    //   );
    //   setData(newData);
    // }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
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
      render: () => <span>Placeholder</span>,
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
        <Button
          type={text === 'Kích hoạt' ? 'primary' : 'default'}
          style={{
            backgroundColor: text === 'Kích hoạt' ? '#90ee90' : '',
            cursor: 'default'
          }}
          disabled
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button
            type="primary"
            shape="circle"
            icon={<CheckOutlined />}
            style={{ marginRight: 8, backgroundColor: record.trangthai === "Khóa" ? "#f0ad4e" : "#D3D3D3", borderColor: record.trangthai === "Khóa" ? "#eea236" : "#D3D3D3"}}
            onClick={() => handleActivate(record)}
            disabled={record.trangthai === "Kích hoạt"}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            style={{ marginRight: 8, backgroundColor: "#5cb85c", borderColor: "#4cae4c" }}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            style={{ backgroundColor: "#000000", borderColor: "#000000" }}
            onClick={() => handleDelete(record)}
          />
        </span>
      ),
    },
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
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{ marginRight: "10px" }}>
            Tìm kiếm
          </Button>
          <Button type="default" icon={<ReloadOutlined />} onClick={handleReset}>
            Làm mới bộ lọc
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <h3 style={{ display: "inline-block", marginRight: "10px" }}>Danh sách khách hàng</h3>
        <Button type="primary" style={{ float: "right" }} icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />

      <Modal
        title={selectedRecord ? `Chỉnh sửa khách hàng ${selectedRecord.ten}` : "Thêm khách hàng"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        {/* Add your form fields here */}
        <p>Form fields for {selectedRecord ? 'editing' : 'adding'} customer data...</p>
      </Modal>
    </div>
  );
};

export default App;