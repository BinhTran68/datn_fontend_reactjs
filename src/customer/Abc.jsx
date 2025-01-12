import React, { useState, useEffect } from 'react';
import { Input, Select, DatePicker, Slider, Button, Table, Modal, Form } from 'antd';
import { SearchOutlined, ReloadOutlined, CheckOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const EmployeeManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('Tất cả');
  const [dobRange, setDobRange] = useState([]);
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  const initialData = [
    {
      key: '1',
      stt: '1',
      ten: 'Nguyễn Văn A',
      cccd: '001200006666',
      sdt: '0370530000',
      ngaysinh: '01/06/1990',
      chucvu: 'Quản lý',
      trangthai: 'Đang làm việc',
    },
    {
      key: '2',
      stt: '2',
      ten: 'Trần Thị B',
      cccd: '001200007777',
      sdt: '0370530001',
      ngaysinh: '15/11/1985',
      chucvu: 'Nhân viên',
      trangthai: 'Nghỉ việc',
    },
    {
      key: '3',
      stt: '3',
      ten: 'Lê Văn C',
      cccd: '001200008888',
      sdt: '0370530002',
      ngaysinh: '20/03/1980',
      chucvu: 'Nhân viên',
      trangthai: 'Đang làm việc',
    },
    {
      key: '4',
      stt: '4',
      ten: 'Phạm Thị D',
      cccd: '001200009999',
      sdt: '0370530003',
      ngaysinh: '10/09/1995',
      chucvu: 'Nhân viên',
      trangthai: 'Đang làm việc',
    },
  ];

  useEffect(() => {
    setData(initialData);
  }, []);

  const handleSearch = () => {
    const filtered = initialData.filter((item) => {
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
    setData(initialData);
  };

  const handleActivate = (record) => {
    const newData = data.map((item) =>
      item.key === record.key ? { ...item, trangthai: 'Đang làm việc' } : item
    );
    setData(newData);
    console.log('Activate:', record);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      ten: record.ten,
      cccd: record.cccd,
      sdt: record.sdt,
      ngaysinh: moment(record.ngaysinh, 'DD/MM/YYYY'),
      chucvu: record.chucvu,
      trangthai: record.trangthai,
    });
    setIsModalVisible(true);
    console.log('Edit:', record);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa nhân viên ${record.ten}?`,
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
    setSelectedRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newRecord = {
        key: selectedRecord ? selectedRecord.key : String(Date.now()), // Use timestamp for new key
        stt: selectedRecord ? selectedRecord.stt : String(data.length + 1),
        ten: values.ten,
        cccd: values.cccd,
        sdt: values.sdt,
        ngaysinh: values.ngaysinh.format('DD/MM/YYYY'),
        chucvu: values.chucvu,
        trangthai: values.trangthai,
      };

      if (selectedRecord) {
        // Update existing record
        const newData = data.map((item) =>
          item.key === selectedRecord.key ? newRecord : item
        );
        setData(newData);
      } else {
        // Add new record
        setData([...data, newRecord]);
      }

      setIsModalVisible(false);
      setSelectedRecord(null);
    }).catch(info => {
      console.log('Validate Failed:', info);
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
      title: 'Ảnh',
      dataIndex: 'anh',
      key: 'anh',
      render: () => <span>Placeholder</span>,
    },
    {
      title: 'Tên nhân viên',
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
      title: 'Chức vụ',
      dataIndex: 'chucvu',
      key: 'chucvu',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangthai',
      key: 'trangthai',
      render: (text) => (
        <Button
          type={text === 'Đang làm việc' ? 'primary' : 'default'}
          style={{
            backgroundColor: text === 'Đang làm việc' ? '#90ee90' : '',
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
            style={{ marginRight: 8, backgroundColor: record.trangthai === "Nghỉ việc" ? "#f0ad4e" : "#D3D3D3", borderColor: record.trangthai === "Nghỉ việc" ? "#eea236" : "#D3D3D3"}}
            onClick={() => handleActivate(record)}
            disabled={record.trangthai === "Đang làm việc"}
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
      <h2>Quản lý nhân viên</h2>

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
          <Select value={status} onChange={(value) => setStatus(value)} style={{ width: '250px', marginRight: "20px" }}>
            <Option value="Tất cả">Tất cả</Option>
            <Option value="Đang làm việc">Đang làm việc</Option>
            <Option value="Nghỉ việc">Nghỉ việc</Option>
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
        <h3 style={{ display: "inline-block", marginRight: "10px" }}>Danh sách nhân viên</h3>
        <Button type="primary" style={{ float: "right" }} icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />

      <Modal
        title={selectedRecord ? `Chỉnh sửa nhân viên ${selectedRecord.ten}` : "Thêm nhân viên"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            trangthai: 'Đang làm việc', // Default value for new records
          }}
        >
          <Form.Item
            label="Tên nhân viên"
            name="ten"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
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
            label="Ngày sinh"
            name="ngaysinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Chức vụ" name="chucvu">
            <Select>
              <Option value="Quản lý">Quản lý</Option>
              <Option value="Nhân viên">Nhân viên</Option>
              <Option value="Trưởng phòng">Trưởng phòng</Option>
              <Option value="Giám đốc">Giám đốc</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Trạng Thái" name="trangthai">
            <Select>
              <Option value="Đang làm việc">Đang làm việc</Option>
              <Option value="Nghỉ việc">Nghỉ việc</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;

