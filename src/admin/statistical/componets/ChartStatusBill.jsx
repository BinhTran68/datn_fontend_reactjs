import React, { useState, useEffect, PureComponent } from "react";
import { Card, Button, Table, Row, Col, DatePicker } from "antd";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Tooltip, Legend, RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { FileExcelOutlined } from "@ant-design/icons";
import axios from "axios";
// import {convertBillStatusToString} from '../../helpers/Helpers.js';

const { RangePicker } = DatePicker;

const ChartStatusBill = () => {
  const [timeFilter, setTimeFilter] = useState("day");
  const [customRange, setCustomRange] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [tableTitle, setTableTitle] = useState("Thống kê sản phẩm bán chạy hôm nay");
  const [chartTitle, setChartTitle] = useState("Biểu đồ trạng thái đơn hàng hôm nay");
  const pageSize = 5; // Số lượng sản phẩm mỗi trang
  const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại
  const apiUrls = {
    day: "http://localhost:8080/api/admin/statistical/bestday",
    week: "http://localhost:8080/api/admin/statistical/bestweek",
    month: "http://localhost:8080/api/admin/statistical/bestmonth",
    year: "http://localhost:8080/api/admin/statistical/bestyear",
    custom: "http://localhost:8080/api/admin/statistical/best-custom",
  };

  const chartApiUrls = {
    day: "http://localhost:8080/api/admin/statistical/chartDay",
    week: "http://localhost:8080/api/admin/statistical/chartWeek",
    month: "http://localhost:8080/api/admin/statistical/chartMonth",
    year: "http://localhost:8080/api/admin/statistical/chartYear",
    custom: "http://localhost:8080/api/admin/statistical/chartCustom",
  }

  useEffect(() => {


    const fetchTableData = async () => {
      try {
        const url = customRange ? apiUrls.custom : apiUrls[timeFilter];
        const params = customRange
          ? { startDate: customRange[0].format("YYYY-MM-DD"), endDate: customRange[1].format("YYYY-MM-DD") }
          : {};

        console.log("Gọi API Table: ", url, params);
        const response = await axios.get(url, { params });

        if (response.data && Array.isArray(response.data.data)) {
          const formattedData = response.data.data.map((item, index) => ({
            key: index,
            productName: item.productName || "...",
            typeName: item.typeName || "...",
            colorName: item.colorName || "...",
            sizeName: item.sizeName || "...",
            genderName: item.genderName || "...",
            soleName: item.soleName || "...",
            price: item.price || 0,
            totalQuantitySold: item.totalQuantitySold || 0,
          }));

          setApiData(formattedData);
        } else {
          setApiData([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bảng từ API: ", error);
        setApiData([]);
      }
    };
    const fetchChartData = async () => {
      try {
        const url = customRange ? chartApiUrls.custom : chartApiUrls[timeFilter];
        const params = customRange
          ? { startDate: customRange[0].format("YYYY-MM-DD"), endDate: customRange[1].format("YYYY-MM-DD") }
          : {};

        console.log("Gọi API Biểu đồ: ", url, params);
        const response = await axios.get(url, { params });

        if (response.data && response.data.data) {
          const apiResponse = response.data.data;

          // Chuyển đổi object thành array
          const formattedChartData = Object.keys(apiResponse).map((key) => ({
            name: STATUS_LABELS[key.replace("Percent", "").toUpperCase()] || key.replace("Percent", ""),
            uv: apiResponse[key],
            fill: getColorByStatus(key.replace("Percent", "").toUpperCase()),
          }));

          setChartData(formattedChartData);
        } else {
          setChartData([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu biểu đồ từ API: ", error);
        setChartData([]);
      }
    };




    fetchTableData();
    fetchChartData();
  }, [timeFilter, customRange]);


  // Hàm lấy màu theo trạng thái
  const getColorByStatus = (status) => {
    const colorMap = {
      "CHOXACNHAN": "#8884d8",
      "DAXACNHAN": "green",
      "CHOVANCHUYEN": "purple",
      "DANGVANCHUYEN": "brown",
      "DATHANHTOAN": "yellow",
      "DAHOANTHANH": "orange",
      "DAHUY": "#ff8042",
      "TRAHANG": "#ff0000",
    };
    return colorMap[status] || "#ccc"; // Mặc định màu xám nếu không có trong danh sách
  };
  const STATUS_LABELS = {
    "CHOXACNHAN": "Chờ xác nhận",
    "DAXACNHAN": "Đã xác nhận",
    "CHOVANCHUYEN": "Chờ vận chuyển",
    "DANGVANCHUYEN": "Đang vận chuyển",
    "DATHANHTOAN": "Đã thanh toán",
    "DAHOANTHANH": "Đã hoàn thành",
    "DAHUY": "Đã hủy",
    "TRAHANG": "Trả hàng",
  };

  const handleCustomRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setCustomRange(dates);

      // Cập nhật tiêu đề theo ngày đã chọn
      const formattedTitle = `Thống kê sản phẩm bán chạy ${dates[0].format("DD/MM/YYYY")} - ${dates[1].format("DD/MM/YYYY")}`;
      setTableTitle(formattedTitle);
      setChartTitle(`Biểu đồ trạng thái đơn hàng ${dates[0].format("DD/MM/YYYY")} - ${dates[1].format("DD/MM/YYYY")}`);

    }
  };


  const handleFilterChange = (filterType, label) => {
    setTimeFilter(filterType);
    setCustomRange(null); // Đặt về null khi chọn bộ lọc khác
    setTableTitle(`Thống kê sản phẩm bán chạy ${label.toLowerCase()}`);
    setChartTitle(`Biểu đồ trạng thái đơn hàng ${label.toLowerCase()}`);

  };


  const columns = [
    //thiếu ảnh 
    { title: "Ảnh", dataIndex: "imageUrl", key: "imageUrl", align: "center", render: (url) => <img src={url} alt="Product" style={{ width: 50 }} /> },

    { title: "Tên sản phẩm", dataIndex: "productName", key: "productName", align: "center" },
    { title: "Loại giày", dataIndex: "typeName", key: "typeName", align: "center" },
    { title: "Màu sắc", dataIndex: "colorName", key: "colorName", align: "center" },
    { title: "Kích cỡ", dataIndex: "sizeName", key: "sizeName", align: "center" },
    { title: "Đế giày", dataIndex: "soleName", key: "soleName", align: "center" },
    { title: "Giới tính", dataIndex: "genderName", key: "genderName", align: "center" },
    { title: "Giá bán", dataIndex: "price", key: "price", align: "center" },
    { title: "Số lượng bán", dataIndex: "totalQuantitySold", key: "totalQuantitySold", align: "center" },
  ];


  return (
    <>
        <h2 style={{ color: "orange", fontSize: 25, fontWeight: "bold", marginBottom: 20,marginTop:30 }}>
        Thống kê số lượng sản phẩm bán chạy và biểu đồ trạng thái đơn hàng 
    </h2>   
    
    <Row gutter={[16, 16]} align="stretch">
  {/* Bảng thống kê sản phẩm */}
  <Col xs={24} md={14}>
    <Card 
      title={<span style={{ color: "white", fontSize: 16 }}>{tableTitle}</span>} 
      style={{ 
        background: "linear-gradient(180deg, orange, rgb(210, 209, 207))", 
        height: "100%" 
      }}
    >
      <div style={{
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        border:"1px solid #2e95dd"
      }}>
        <Table
          dataSource={apiData}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: apiData.length,
            onChange: (page) => setCurrentPage(page),
          }}
          bordered={false}
        />
      </div>
    </Card>
  </Col>

  {/* Biểu đồ trạng thái đơn hàng */}
  <Col xs={24} md={10}>
    <Card 
      title={<span style={{ color: "white", fontSize: 16 }}>{chartTitle}</span>} 
      style={{ 
        background: "linear-gradient(180deg, orange, rgb(210, 207, 207))", 
        height: "100%" 
      }}
    >
      <ResponsiveContainer width="100%" height={350}>
        {chartData.length > 0 ? (
          <RadarChart cx="50%" cy="50%" outerRadius="90%" data={chartData}>
            <PolarGrid stroke="gray" strokeWidth={1} />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 14, fill: "gold", fontWeight: "bold" }} />
            <PolarRadiusAxis tick={{ fontSize: 13, fill: "pink" }} />
            <Radar
              name="Trạng thái đơn hàng"
              dataKey="uv"
              stroke="#2e95dd"
              strokeWidth={2}
              fill="#2e95dd"
              fillOpacity={0.6}
            />
            <Legend
              formatter={(value) => STATUS_LABELS[value.toUpperCase()] || value}
              wrapperStyle={{ fontSize: 14, fontWeight: "bold" }}
              iconSize={15}
              layout="horizontal"
              verticalAlign="bottom"
              align="left"
            />
            <Tooltip />
          </RadarChart>
        ) : (
          <p style={{ textAlign: "center", color: "gray", fontSize: 16 }}>Không có dữ liệu để hiển thị</p>
        )}
      </ResponsiveContainer>
    </Card>
  </Col>

  {/* Nút lọc thời gian */}
  <Col span={24}>
    <Card 
      style={{ 
        marginBottom: 16, 
        background: "linear-gradient(180deg, orange, rgb(210, 209, 207))", 
        color: "white",
      }}
    >
      {[
        { label: "Hôm nay", value: "day" },
        { label: "Tuần này", value: "week" },
        { label: "Tháng này", value: "month" },
        { label: "Năm nay", value: "year" }
      ].map(({ label, value }) => (
        <Button
          key={value}
          type={timeFilter === value && !customRange ? "primary" : "default"}
          style={{
            marginRight: 8,
            background: "linear-gradient(180deg, orange, rgb(210, 209, 207))",
            color: "white",
          }}
          onClick={() => handleFilterChange(value, label)}
        >
          {label}
        </Button>
      ))}

      <Button
        style={{ marginLeft: 8, background: "linear-gradient(180deg, orange, rgb(210, 209, 207))", color: "white" }}
        type={customRange ? "primary" : "default"}
        onClick={() => setCustomRange([])}
      >
        TÙY CHỈNH
      </Button>
      {customRange && <RangePicker style={{ marginLeft: 16 }} onChange={handleCustomRangeChange} />}
    </Card>
  </Col>
</Row>

    
      
    </>
  );
};

export default ChartStatusBill;
