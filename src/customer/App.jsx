// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ApiComponent = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Use axios to fetch data
//     axios.get('http://localhost:8080/api/khachhang/hienthi')
//       .then((response) => {
//         setData(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError(error);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div>
//       <h1>API Data:</h1>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   );
// };

// export default ApiComponent;












import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Select, DatePicker, Slider, Button, Table, Modal, Form, Space, message } from 'antd';
import { SearchOutlined, ReloadOutlined, CheckOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [status, setstatus] = useState('Tất cả');
  const [dobRange, setDobRange] = useState([]);
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:8080/api/khachhang/hienthi')
      .then((response) => {
        const fetchedData = response.data.map((item, index) => ({
          key: index + 1,
          avatar: item.avatar,
          fullName: item.fullName,
          CitizenId: item.citizenId,
          phoneNumber: item.phoneNumber,
          dateBirth: moment(item.dateBirth).format('DD/MM/YYYY'),
          status: item.status === 1 ? 'Kích hoạt' : 'Khóa',
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

      const dob = moment(item.dateBirth, 'DD/MM/YYYY');
      const dobFromMatch = !dobRange[0] || dob.isSameOrAfter(dobRange[0], 'day');
      const dobToMatch = !dobRange[1] || dob.isSameOrBefore(dobRange[1], 'day');

      const age = moment().diff(dob, 'years');
      const ageMatch = age >= ageRange[0] && age <= ageRange[1];
      return (nameMatch || phoneMatch) && statusMatch && dobFromMatch && dobToMatch && ageMatch;
    });
    setData(filtered);
  };

  const handleReset = () => {
    setSearchText('');
    setstatus('Tất cả');
    setDobRange([]);
    setAgeRange([0, 100]);
    fetchData();
  };

  const handleDelete = (record) => {
    axios.delete(`http://localhost:8080/api/khachhang/delete/${record.id}`)
      .then(() => {
        message.success('Xóa khách hàng thành công!');
        fetchData();
      })
      .catch((error) => {
        console.error('Error deleting customer:', error);
        message.error('Xóa khách hàng thất bại!');
      });
  };

  const showModal = (record = null) => {
    setSelectedRecord(record);
    form.resetFields();
    if (record) {
      form.setFieldsValue({
        ...record,
        dateBirth: moment(record.dateBirth, 'DD/MM/YYYY'),
      });
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        const newData = {
          ...values,
          dateBirth: values.dateBirth.format('YYYY-MM-DD'),
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

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'avatar',
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
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Button
          type={text === 'Kích hoạt' ? 'primary' : 'default'}
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
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </Space>
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
          <Select value={status} onChange={(value) => setstatus(value)} style={{ width: '250px', marginRight: "20px" }}>
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
          <Button type="default" icon={<ReloadOutlined />} onClick={handleReset} style={{ marginRight: "10px" }}>
            Làm mới bộ lọc
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Thêm mới
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={data} />

      <Modal
        title={selectedRecord ? 'Chỉnh sửa khách hàng' : 'Thêm mới khách hàng'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
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
            name="dateBirth"
            label="Ngày sinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
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
        </Form>
      </Modal>
    </div>
  );
};

export default App;
