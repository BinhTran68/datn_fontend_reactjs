import React from "react";
import {
  Input,
  Button,
  Select,
  Table,
  Space,
  Row,
  Col,
  Typography,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
// import styles from './Product.module.css'; // We will likely remove or significantly modify this

const { Title } = Typography;
const { Option } = Select;

const Product = () => {
  // Sample data for the table (replace with your actual data fetching)
  const data = []; // Initially empty, indicating "No data"

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text, record, index) => index + 1, // This will auto-generate STT
    },
    {
      title: "Tên giày",
      dataIndex: "tenGiay",
      key: "tenGiay",
    },
    {
      title: "Danh mục",
      dataIndex: "danhMuc",
      key: "danhMuc",
    },
    {
      title: "Thương hiệu",
      dataIndex: "thuongHieu",
      key: "thuongHieu",
    },
    {
      title: "Chất liệu vải",
      dataIndex: "chatLieuVai",
      key: "chatLieuVai",
    },
    {
      title: "Chất liệu đế",
      dataIndex: "chatLieuDe",
      key: "chatLieuDe",
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngayTao",
      key: "ngayTao",
    },
    {
      title: "Thao tác",
      key: "action",
      render: () => (
        <Space>
          <Button type="primary" size="small">
            Sửa
          </Button>
          <Button type="primary" danger size="small">
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {" "}
      {/* Added padding for better spacing */}
      <Title level={2} style={{ marginBottom: 24 }}>
        Danh sách Sản Phẩm
      </Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={18}>
          <Input
            placeholder="Nhập vào tên của giày mà bạn muốn tìm !"
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col span={6}>
          <Button type="primary" icon={<PlusOutlined />} block>
            Thêm mới
          </Button>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Space direction="vertical" size="small">
            <label style={{ fontWeight: "bold" }}>Thương hiệu</label>
            <Select
              defaultValue="all"
              style={{ width: "100%" }}
              placeholder="Chọn thương hiệu"
            >
              <Option value="all">Tất cả thương hiệu</Option>
              {/* Add other brand options here */}
            </Select>
          </Space>
        </Col>
        <Col span={6}>
          <Space direction="vertical" size="small">
            <label style={{ fontWeight: "bold" }}>Danh mục</label>
            <Select
              defaultValue="all"
              style={{ width: "100%" }}
              placeholder="Chọn danh mục"
            >
              <Option value="all">Tất cả danh mục</Option>
              {/* Add other category options here */}
            </Select>
          </Space>
        </Col>
        <Col span={6}>
          <Space direction="vertical" size="small">
            <label style={{ fontWeight: "bold" }}>Chất liệu vải</label>
            <Select
              defaultValue="all"
              style={{ width: "100%" }}
              placeholder="Chọn chất liệu vải"
            >
              <Option value="all">Tất cả chất liệu vải</Option>
              {/* Add other fabric material options here */}
            </Select>
          </Space>
        </Col>
        <Col span={6}>
          <Space direction="vertical" size="small">
            <label style={{ fontWeight: "bold" }}>Chất liệu đế</label>
            <Select
              defaultValue="all"
              style={{ width: "100%" }}
              placeholder="Chọn chất liệu đế"
            >
              <Option value="all">Tất cả chất liệu đế</Option>
              {/* Add other sole material options here */}
            </Select>
          </Space>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="stt" // You'll need a unique key for each row, adjust accordingly
        pagination={false} // Consider adding pagination if you have lots of data
        locale={{
          emptyText: (
            <div style={{ textAlign: "center" }}>
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25 45.8333C36.5057 45.8333 45.8333 36.5057 45.8333 25C45.8333 13.4943 36.5057 4.16667 25 4.16667C13.4943 4.16667 4.16667 13.4943 4.16667 25C4.16667 36.5057 13.4943 45.8333 25 45.8333Z" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.75 18.75L31.25 31.25" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M31.25 18.75L18.75 31.25" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              <p>No data</p>
            </div>
          ),
        }}
      />
      <Button
        type="primary"
        shape="circle"
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.077 2.588a.75.75 0 0 1 .846 0l5.25 4.5a.75.75 0 0 1 0 1.024l-5.25 4.5a.75.75 0 0 1-1.024-.088.75.75 0 0 1 .088-1.024L11.66 8.5H2.75a.75.75 0 0 1 0-1.5h8.91l-4.585-3.988a.75.75 0 0 1-.088-1.024Z"
              fill="currentColor"
            />
          </svg>
        }
        style={{ position: "fixed", bottom: 24, right: 24 }}
      />
    </div>
  );
};

export default Product;