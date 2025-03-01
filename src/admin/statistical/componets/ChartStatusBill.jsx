import React, { useState } from "react";
import { Card, Button, Table, Row, Col, DatePicker } from "antd";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { FileExcelOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

// Dữ liệu sản phẩm theo từng loại thời gian
const productData = {
  day: [
    { key: 1, image: "🖼", name: "Converse Venom - Tím", quantity: 18, price: "950,000 đ", size: 41 },
    { key: 2, image: "🖼", name: "Kkkk - Xanh dương", quantity: 9, price: "100,000 đ", size: 40 },
  ],
  week: [
    { key: 1, image: "🖼", name: "Nike Air Max", quantity: 25, price: "1,200,000 đ", size: 42 },
    { key: 2, image: "🖼", name: "Adidas Superstar", quantity: 20, price: "900,000 đ", size: 40 },
  ],
  month: [
    { key: 1, image: "🖼", name: "Puma RS-X", quantity: 35, price: "1,400,000 đ", size: 43 },
    { key: 2, image: "🖼", name: "Reebok Classic", quantity: 30, price: "850,000 đ", size: 39 },
  ],
  year: [
    { key: 1, image: "🖼", name: "Balenciaga Triple S", quantity: 50, price: "10,000,000 đ", size: 44 },
    { key: 2, image: "🖼", name: "Gucci Rhyton", quantity: 45, price: "8,500,000 đ", size: 42 },
  ],
};

const chartData = {
  day: [
    { name: "Hoàn thành", value: 66.67, color: "#28a745" },
    { name: "Trả hàng", value: 33.33, color: "#8E44AD" },
  ],
  week: [
    { name: "Hoàn thành", value: 50, color: "#28a745" },
    { name: "Trả hàng", value: 30, color: "#8E44AD" },
    { name: "Đã hủy", value: 20, color: "#e74c3c" },
  ],
  month: [
    { name: "Hoàn thành", value: 70, color: "#28a745" },
    { name: "Trả hàng", value: 15, color: "#8E44AD" },
    { name: "Chờ xác nhận", value: 15, color: "#f39c12" },
  ],
  year: [
    { name: "Hoàn thành", value: 80, color: "#28a745" },
    { name: "Trả hàng", value: 10, color: "#8E44AD" },
    { name: "Đã hủy", value: 5, color: "#e74c3c" },
    { name: "Chờ giao hàng", value: 5, color: "#f39c12" },
  ],
};

const ChartStatusBill = () => {
  const [timeFilter, setTimeFilter] = useState("day"); // Bộ lọc thời gian mặc định
  const [customDate, setCustomDate] = useState(false);
  const [customRange, setCustomRange] = useState(null);

  // Khi chọn khoảng thời gian tùy chỉnh
  const handleCustomRangeChange = (dates) => {
    setCustomRange(dates);
  };

  // Xác định dữ liệu hiển thị
  const selectedData = customRange ? productData["month"] : productData[timeFilter]; // Giả sử custom dùng dữ liệu tháng
  const selectedChart = customRange ? chartData["month"] : chartData[timeFilter];

  // Cột của bảng sản phẩm
  const columns = [
    { title: "Ảnh", dataIndex: "image", key: "image" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Giá tiền", dataIndex: "price", key: "price" },
    { title: "Kích cỡ", dataIndex: "size", key: "size" },
  ];
  const getTitle = () => {
    if (customRange) {
      return "Sản phẩm bán chạy theo thời gian tùy chỉnh";
    }
    switch (timeFilter) {
      case "day":
        return "Sản phẩm bán chạy hôm nay";
      case "week":
        return "Sản phẩm bán chạy tuần này";
      case "month":
        return "Sản phẩm bán chạy tháng này";
      case "year":
        return "Sản phẩm bán chạy năm này";
      default:
        return "Sản phẩm bán chạy";
    }
  };

  return (
    <>
      <h2 style={{ color: "#2e95dd ", fontSize: 20, fontWeight: 'bold' }}>Thống kê sản phẩm bán chạy</h2>

      <Row gutter={[16, 16]}>

        <Col span={14}>
          <Card
            headStyle={{ color: "white ", background: "", fontSize: "18px", fontWeight: "bold" }}

            title={getTitle()} style={{ borderRadius: "8px", color: "orange ", background: "linear-gradient(180deg, #2e95dd, #ffbc74)" }}>
            <Table
              dataSource={selectedData}
              columns={columns}
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

          </Card>

        </Col>

        <Col span={10}>

          <Card
            headStyle={{ color: "white ", background: "linear-gradient(180deg, #2e95dd, #ffbc74)", fontSize: "18px", fontWeight: "bold" }}
            title="Biểu đồ trạng thái đơn hàng" style={{ borderRadius: "8px", background: "linear-gradient(180deg, #2e95dd, #ffbc74)" }}>
            <PieChart width={350} height={300}>
              <Pie data={selectedChart} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                {selectedChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Card>
        </Col>
      </Row>
      <div >

        <Card style={{ marginBottom: 16, background: "linear-gradient(180deg, #2e95dd, #ffbc74)" }}>
        <h2 style={{ color: "white ", fontSize: 20, fontWeight: 'bold' }}>Lọc sản phẩm bán chạy theo</h2>
        {["day", "week", "month", "year"].map((type) => (
            <Button
              key={type}
              type={timeFilter === type && !customRange ? "primary" : "default"}
              style={{
                marginRight: 8,
                background: "linear-gradient(180deg, #2e95dd, #ffbc74)",
                color: "white",

              }}

              onClick={() => {
                setTimeFilter(type);
                setCustomRange(null);
              }}
            >
              {type === "day" ? "NGÀY" : type === "week" ? "TUẦN" : type === "month" ? "THÁNG" : "NĂM"}
            </Button>
          ))}
          <Button
            type={customRange ? "primary" : "default"}
            style={{
              background: "linear-gradient(180deg, #2e95dd, #ffbc74)",
              color: "white",
            }}
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = customRange ? "orange" : "transparent")
            }
            onClick={() => setCustomDate(!customDate)}
          >
            TÙY CHỈNH
          </Button>
          {customDate && (
            <RangePicker style={{ marginLeft: 16 }} onChange={handleCustomRangeChange} />
          )}
          <Button type="default" icon={<FileExcelOutlined />} style={{ marginLeft: 16, background: "linear-gradient(180deg, #2e95dd, #ffbc74)", color: "white" }}>
            Xuất Excel
          </Button>
        </Card>

      </div>
    </>

  );
};

export default ChartStatusBill;
