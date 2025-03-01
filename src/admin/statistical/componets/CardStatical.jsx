import React, { useState, useEffect } from "react";
import { Table, InputNumber, Card, Row, Col } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CalendarOutlined, RiseOutlined } from "@ant-design/icons";

// Component chính của trang Dashboard
const Dashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      {/* <GrowthChart /> */}

      <Row gutter={[16, 16]}>

        <Col span={12}>
          <LowStockProducts />
        </Col>

        <Col span={12}>
          <StatisticsSummary />
        </Col>
      </Row>

    </div>
  );
};

// Component danh sách sản phẩm sắp hết hàng
const LowStockProducts = () => {
  const [products, setProducts] = useState([]);
  const [threshold, setThreshold] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const mockData = [
        { key: 1, name: "Sản phẩm A", quantity: 5, price: 100000, size: "M" },
        { key: 2, name: "Sản phẩm B", quantity: 12, price: 200000, size: "L" },
        { key: 3, name: "Sản phẩm C", quantity: 8, price: 150000, size: "S" },
      ];
      setProducts(mockData.filter((item) => item.quantity <= threshold));
    };
    fetchData();
  }, [threshold]);

  const columns = [
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Giá tiền", dataIndex: "price", key: "price" },
    { title: "Kích cỡ", dataIndex: "size", key: "size" },
  ];

  return (
    <>
      <h2 style={{ color: "#2e95dd ", fontSize: 20, fontWeight: 'bold' }}>Thống kê sản phẩm sắp hết</h2>

      <Card
        headStyle={{ color: "white ", background: "linear-gradient(180deg, #2e95dd, #ffbc74)", fontSize: "18px", fontWeight: "bold" }}

        title="Danh sách sản phẩm sắp hết hàng" style={{ borderRadius: "10px", background: "linear-gradient(180deg, #2e95dd, #ffbc74)" }}>
        <InputNumber min={1} max={50} value={threshold} onChange={setThreshold} style={{ marginBottom: "10px" }} />
        <Table
          columns={columns} dataSource={products}
          pagination={{ pageSize: 5 }}
          style={{
            background: "white", // Nền cho toàn bộ bảng
            color: "white", // Màu chữ chung
          }}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    background: "linear-gradient(180deg, #2e95dd, #ffbc74)", // Màu nền header
                    color: "white", // Màu chữ header
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                />
              ),
            },
            body: {
              row: (props) => (
                <tr
                  {...props}
                  style={{
                    background: "white", // Gradient nền dòng
                    color: " #2e95dd", // Màu chữ trong bảng
                    fontWeight: 'bold',
                    textAlign: "center",

                  }}
                />
              ),
              cell: (props) => (
                <td
                  {...props}
                  style={{
                    color: "#2e95dd", // Màu chữ từng ô
                    borderColor: "white", // Đổi màu viền bảng
                    fontWeight: 'bold',
                    textAlign: "center",

                  }}
                />
              ),
            },
          }}
        />

      </Card>    </>

  );
};

// Component hiển thị thống kê tổng hợp
const StatisticsSummary = () => {
  const statistics = [
    { title: "Doanh thu tháng", value: "59.892.500 VND" },
    { title: "Doanh thu năm", value: "720.000.000 VND" },
    { title: "Sản phẩm tháng", value: "256 Sản phẩm" },
  ];

  return (
    <>
      <h2 style={{ color: "#2e95dd ", fontSize: 20, fontWeight: 'bold' }}>Thống kê tăng trưởng của cửa hàng</h2>

      <Card

        headStyle={{ color: "white ", background: "linear-gradient(180deg, #2e95dd, #ffbc74)", fontSize: "18px", fontWeight: "bold" }}

        title="Thống kê tổng hợp" style={{ borderRadius: "10px", background: "linear-gradient(180deg, #2e95dd, #ffbc74)" }}>
        <Row gutter={[16, 16]}>

          {statistics.map((item, index) => (
            <Col span={24} key={index}>
              <Card
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "linear-gradient(180deg, #2e95dd, #ffbc74)",
                  color: "#fff",
                  borderRadius: "8px",
                }}
                bodyStyle={{ padding: "16px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <CalendarOutlined style={{ fontSize: "20px", color: "#fff" }} />
                  <span style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>{item.title}</span>
                </div>
                <span style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>{item.value}</span>
                <RiseOutlined style={{ fontSize: "20px", color: "#00FF00" }} />
              </Card>
            </Col>
          ))}
        </Row>
      </Card></>
  );
};


export default Dashboard;