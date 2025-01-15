// import React, { useState, useEffect } from 'react';
// import { Input, Select, DatePicker, Slider, Button, Table, Modal, Form } from 'antd';
// import { SearchOutlined, ReloadOutlined, CheckOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
// import moment from 'moment';
// import axios from 'axios';

// const { Option } = Select;
// const { RangePicker } = DatePicker;

// const App = () => {
//   const [searchText, setSearchText] = useState('');
//   const [status, setStatus] = useState('Tất cả');
//   const [dobRange, setDobRange] = useState([]);
//   const [ageRange, setAgeRange] = useState([0, 100]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [filteredData, setFilteredData] = useState([]);
//   const [form] = Form.useForm();
//   const [data, setData] = useState([]);

//   // Lấy dữ liệu từ localStorage khi component được mount
//   useEffect(() => {
//     const storedData = JSON.parse(localStorage.getItem('khachhangData'));
//     if (storedData) {
//       setData(storedData);
//     } else {
//       // Nếu không có dữ liệu trong localStorage, gọi API (hoặc có thể không gọi API nếu không cần thiết)
//       axios.get('https://api.example.com/khachhang') 
//         .then(response => {
//           setData(response.data);
//           localStorage.setItem('khachhangData', JSON.stringify(response.data)); // Lưu vào localStorage
//         })
//         .catch(error => {
//           console.error('Đã có lỗi xảy ra khi gọi API:', error);
//         });
//     }
//   }, []);


//   const handleSearch = () => {
//     const filtered = data.filter((item) => {
//       const nameMatch = item.ten.toLowerCase().includes(searchText.toLowerCase());
//       const phoneMatch = item.sdt.includes(searchText);

//       const statusMatch = status === 'Tất cả' || item.trangthai === status;

//       const dob = moment(item.ngaysinh, 'DD/MM/YYYY');
//       const dobFromMatch = !dobRange[0] || dob.isSameOrAfter(dobRange[0], 'day');
//       const dobToMatch = !dobRange[1] || dob.isSameOrBefore(dobRange[1], 'day');

//       const age = moment().diff(dob, 'years');
//       const ageMatch = age >= ageRange[0] && age <= ageRange[1];
//       return (nameMatch || phoneMatch) && statusMatch && dobFromMatch && dobToMatch && ageMatch;
//     });
//     setFilteredData(filtered)
//     setData(filtered);
//   };

//   const handleReset = () => {
//     setSearchText('');
//     setStatus('Tất cả');
//     setDobRange([]);
//     setAgeRange([0, 100]);
//     setData(data);
//   };

//   const handleActivate = (record) => {
//     const newData = data.map((item) =>
//       item.key === record.key ? { ...item, trangthai: 'Kích hoạt' } : item
//     );
//     setData(newData);
//     localStorage.setItem('khachhangData', JSON.stringify(newData)); // Lưu lại dữ liệu vào localStorage
//     console.log('Activate:', record);
//   };

//   const handleEdit = (record) => {
//     setSelectedRecord(record);
//     form.setFieldsValue({
//       ten: record.ten,
//       cccd: record.cccd,
//       sdt: record.sdt,
//       ngaysinh: moment(record.ngaysinh, 'DD/MM/YYYY'),
//       trangthai: record.trangthai,
//       email: record.email,
//       gioitinh: record.gioitinh,
//       diachi: record.diachi,
//     });
//     setIsModalVisible(true);
//     console.log('Edit:', record);
//   };

//   const handleDelete = (record) => {
//     Modal.confirm({
//       title: 'Xác nhận xóa',
//       content: `Bạn có chắc chắn muốn xóa khách hàng ${record.ten}?`,
//       okText: 'Xóa',
//       cancelText: 'Hủy',
//       onOk: () => {
//         const newData = data.filter((item) => item.key !== record.key);
//         setData(newData);
//         localStorage.setItem('khachhangData', JSON.stringify(newData)); // Lưu lại dữ liệu vào localStorage
//         console.log('Delete:', record);
//       },
//     });
//   };

//   const handleAdd = () => {
//     setSelectedRecord(null);
//     form.resetFields();
//     setIsModalVisible(true);
//   };

//   const handleModalOk = () => {
//     form.validateFields().then((values) => {
//       const newRecord = {
//         key: selectedRecord ? selectedRecord.key : String(Date.now()), // Use timestamp for new key
//         stt: selectedRecord ? selectedRecord.stt : String(data.length + 1),
//         ten: values.ten,
//         cccd: values.cccd,
//         sdt: values.sdt,
//         ngaysinh: values.ngaysinh.format('DD/MM/YYYY'),
//         trangthai: values.trangthai,
//         email: values.email,
//         gioitinh: values.gioitinh,
//         diachi: values.diachi,
//       };

//       let newData;
//       if (selectedRecord) {
//         // Cập nhật bản ghi hiện tại
//         newData = data.map((item) =>
//           item.key === selectedRecord.key ? newRecord : item
//         );
//       } else {
//         // Thêm bản ghi mới
//         newData = [...data, newRecord];
//       }

//       setData(newData);
//       localStorage.setItem('khachhangData', JSON.stringify(newData)); // Lưu vào localStorage

//       setIsModalVisible(false);
//       setSelectedRecord(null);
//     }).catch(info => {
//       console.log('Validate Failed:', info);
//     });
//   };

//   const handleModalCancel = () => {
//     setIsModalVisible(false);
//     setSelectedRecord(null);
//     form.resetFields();
//   };

//   const columns = [
//     {
//       title: 'STT',
//       dataIndex: 'stt',
//       key: 'stt',
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
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email',
//     },
//     {
//       title: 'Giới tính',
//       dataIndex: 'gioitinh',
//       key: 'gioitinh',
//     },
//     {
//       title: 'Địa chỉ',
//       dataIndex: 'diachi',
//       key: 'diachi',
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
//         <Button
//           type={text === 'Kích hoạt' ? 'primary' : 'default'}
//           style={{
//             backgroundColor: text === 'Kích hoạt' ? '#90ee90' : '',
//             cursor: 'default'
//           }}
//           disabled
//         >
//           {text}
//         </Button>
//       ),
//     },
//     {
//       title: 'Hành động',
//       key: 'action',
//       render: (_, record) => (
//         <span>
//           <Button
//             type="primary"
//             shape="circle"
//             icon={<CheckOutlined />}
//             style={{ marginRight: 8, backgroundColor: record.trangthai === "Khóa" ? "#f0ad4e" : "#D3D3D3", borderColor: record.trangthai === "Khóa" ? "#eea236" : "#D3D3D3"}}
//             onClick={() => handleActivate(record)}
//             disabled={record.trangthai === "Kích hoạt"}
//           />
//           <Button
//             type="primary"
//             shape="circle"
//             icon={<EditOutlined />}
//             style={{ marginRight: 8, backgroundColor: "#5cb85c", borderColor: "#4cae4c" }}
//             onClick={() => handleEdit(record)}
//           />
//           <Button
//             type="primary"
//             shape="circle"
//             icon={<DeleteOutlined />}
//             style={{ backgroundColor: "#000000", borderColor: "#000000" }}
//             onClick={() => handleDelete(record)}
//           />
//         </span>
//       ),
//     },
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
//           <RangePicker
//             format="DD/MM/YYYY"
//             value={dobRange}
//             onChange={(dates) => setDobRange(dates)}
//             style={{ marginRight: '20px' }}
//           />
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <label style={{ marginRight: '10px' }}>Trạng thái:</label>
//           <Select value={status} onChange={(value) => setStatus(value)} style={{ width: '250px', marginRight: "20px" }}>
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
//           <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{ marginRight: "10px" }}>
//             Tìm kiếm
//           </Button>
//           <Button type="default" icon={<ReloadOutlined />} onClick={handleReset}>
//             Làm mới bộ lọc
//           </Button>
//         </div>
//       </div>

//       <div style={{ marginBottom: "10px" }}>
//         <h3 style={{ display: "inline-block", marginRight: "10px" }}>Danh sách khách hàng</h3>
//         <Button type="primary" style={{ float: "right" }} icon={<PlusOutlined />} onClick={handleAdd}>
//           Thêm
//         </Button>
//       </div>
//       <Table columns={columns} dataSource={data} />

//       <Modal
//         title={selectedRecord ? `Chỉnh sửa khách hàng ${selectedRecord.ten}` : "Thêm khách hàng"}
//         visible={isModalVisible}
//         onOk={handleModalOk}
//         onCancel={handleModalCancel}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           initialValues={{
//             trangthai: 'Kích hoạt', // Default value for new records
//           }}
//         >
//           <Form.Item
//             label="Tên khách hàng"
//             name="ten"
//             rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]} >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="CCCD"
//             name="cccd"
//             rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]} >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Số điện thoại"
//             name="sdt"
//             rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]} >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Giới tính"
//             name="gioitinh"
//             rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
//             <Select>
//               <Option value="Nam">Nam</Option>
//               <Option value="Nữ">Nữ</Option>
//               <Option value="Khác">Khác</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             label="Địa chỉ"
//             name="diachi"
//             rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Ngày sinh"
//             name="ngaysinh"
//             rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
//             <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
//           </Form.Item>
//           <Form.Item label="Trạng Thái" name="trangthai">
//             <Select>
//               <Option value="Kích hoạt">Kích hoạt</Option>
//               <Option value="Khóa">Khóa</Option>
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default App;







import React, { useState, useEffect } from 'react';
import { Input, Select, DatePicker, Slider, Button, Table, Modal, Form } from 'antd';
import { SearchOutlined, ReloadOutlined, CheckOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Option } = Select;
const { RangePicker } = DatePicker;

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('Tất cả');
  const [dobRange, setDobRange] = useState([]);
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('khachhangData'));
    if (storedData) {
      setData(storedData);
    } else {
      axios.get('https://api.example.com/khachhang')
        .then(response => {
          setData(response.data);
          localStorage.setItem('khachhangData', JSON.stringify(response.data));
        })
        .catch(error => {
          console.error('Đã có lỗi xảy ra khi gọi API:', error);
        });
    }
  }, []);

  const handleSearch = () => {
    const filtered = data.filter((item) => {
      const nameMatch = item.ten.toLowerCase().includes(searchText.toLowerCase());
      const phoneMatch = item.sdt.includes(searchText);
      const statusMatch = status === 'Tất cả' || item.trangthai === status;
      const dob = moment(item.ngaysinh, 'DD/MM/YYYY');
      const dobFromMatch = !dobRange[0] || dob.isSameOrAfter(dobRange[0], 'day');
      const dobToMatch = !dobRange[1] || dob.isSameOrBefore(dobRange[1], 'day');
      const age = moment().diff(dob, 'years');
      const ageMatch = age >= ageRange[0] && age <= ageRange[1];
      return (nameMatch || phoneMatch) && statusMatch && dobFromMatch && dobToMatch && ageMatch;
    });
    setFilteredData(filtered);
    setData(filtered);
  };

  const handleReset = () => {
    setSearchText('');
    setStatus('Tất cả');
    setDobRange([]);
    setAgeRange([0, 100]);
    setData(JSON.parse(localStorage.getItem('khachhangData')) || []);
  };

  const handleActivate = (record) => {
    const newData = data.map((item) =>
      item.key === record.key ? { ...item, trangthai: 'Kích hoạt' } : item
    );
    setData(newData);
    localStorage.setItem('khachhangData', JSON.stringify(newData));
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      ten: record.ten,
      cccd: record.cccd,
      sdt: record.sdt,
      ngaysinh: moment(record.ngaysinh, 'DD/MM/YYYY'),
      trangthai: record.trangthai,
      email: record.email,
      gioitinh: record.gioitinh,
      diachi: record.diachi,
    });
    setIsModalVisible(true);
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
        localStorage.setItem('khachhangData', JSON.stringify(newData));
      },
    });
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newRecord = {
        key: selectedRecord ? selectedRecord.key : String(Date.now()),
        stt: selectedRecord ? selectedRecord.stt : String(data.length + 1),
        ten: values.ten,
        cccd: values.cccd,
        sdt: values.sdt,
        ngaysinh: values.ngaysinh.format('DD/MM/YYYY'),
        trangthai: values.trangthai,
        email: values.email,
        gioitinh: values.gioitinh,
        diachi: values.diachi,
      };

      let newData;
      if (selectedRecord) {
        newData = data.map((item) =>
          item.key === selectedRecord.key ? newRecord : item
        );
      } else {
        newData = [...data, newRecord];
      }

      setData(newData);
      localStorage.setItem('khachhangData', JSON.stringify(newData));
      setIsModalVisible(false);
      setSelectedRecord(null);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gioitinh',
      key: 'gioitinh',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diachi',
      key: 'diachi',
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
          disabled
          style={{
            backgroundColor: text === 'Kích hoạt' ? '#90ee90' : '',
            cursor: 'default',
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
        <span>
          <Button
            type="primary"
            shape="circle"
            icon={<CheckOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleActivate(record)}
            disabled={record.trangthai === 'Kích hoạt'}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleDelete(record)}
          />
          <Button
            type="default"
            onClick={() =>
              Modal.info({
                title: `Địa chỉ của ${record.ten}`,
                content: <p>{record.diachi}</p>,
                okText: 'Đóng',
              })
            }
          >
            Hiển thị địa chỉ
          </Button>
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
          <RangePicker
            format="DD/MM/YYYY"
            value={dobRange}
            onChange={(dates) => setDobRange(dates)}
            style={{ marginRight: '20px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '10px' }}>Trạng thái:</label>
          <Select
            value={status}
            onChange={(value) => setStatus(value)}
            style={{ width: '250px', marginRight: '20px' }}
          >
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
            style={{ marginRight: '10px' }}
          >
            Tìm kiếm
          </Button>
          <Button type="default" icon={<ReloadOutlined />} onClick={handleReset}>
            Làm mới bộ lọc
          </Button>
        </div>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <h3 style={{ display: 'inline-block', marginRight: '10px' }}>Danh sách khách hàng</h3>
        <Button type="primary" style={{ float: 'right' }} icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />
      <Modal
        title={selectedRecord ? `Chỉnh sửa khách hàng ${selectedRecord.ten}` : 'Thêm khách hàng'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên khách hàng"
            name="ten"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="CCCD"
            name="cccd"
            rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="sdt"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giới tính"
            name="gioitinh"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Select>
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="diachi"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name="ngaysinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Trạng Thái" name="trangthai">
            <Select>
              <Option value="Kích hoạt">Kích hoạt</Option>
              <Option value="Khóa">Khóa</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
