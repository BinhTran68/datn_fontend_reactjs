import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, DatePicker } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
//#2e95dd
const { RangePicker } = DatePicker;

const cardStyles = {
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(3, 120, 255, 0.15)" ,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    background: "linear-gradient(180deg, orange, rgb(210, 209, 207))",
    color: "white",
    backgroundSize: "200% 200%",
};

const exportToExcel = (data, dateRange, fileName = "RevenueReport.xlsx") => {
    if (!data || !dateRange) {
        console.warn("Không có dữ liệu để xuất.");
        return;
    }
    const { startDate, endDate } = dateRange;

    const worksheetData = [
        [`Doanh thu`, `Từ ${startDate} đến ${endDate}`], // Tiêu đề chính
        [],
        [
            "Tổng doanh thu (VNĐ)",
            "Tổng số đơn",
            "Số sản phẩm đã bán",
            "Đơn thành công",
            "Đơn hủy",
            "Đơn hoàn",
        ], // Hàng tiêu đề chi tiết
        [
            data.totalRevenue || 0,
            data.totalOrders || 0,
            data.totalProductsSold || 0,
            data.successfulOrders || 0,
            data.cancelledOrders || 0,
            data.returnedOrders || 0,
        ], // Dữ liệu thực tế
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    // Căn chỉnh độ rộng cột
    worksheet["!cols"] = [
        { wch: 20 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "DoanhThu");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, fileName);
};

const RevenueCards = ({ showCustomCard, customData }) => {
    const [data, setData] = useState({ day: null, week: null, month: null, year: null });

    useEffect(() => {
        const fetchData = async (type) => {
            try {
                const response = await axios.get(`http://localhost:8080/api/statistical/${type}`);
                setData(prevState => ({
                    ...prevState,
                    [type.toLowerCase()]: response.data.data?.[0] || {
                        totalRevenue: 0,
                        totalOrders: 0,
                        totalProductsSold: 0,
                        successfulOrders: 0,
                        cancelledOrders: 0,
                        returnedOrders: 0
                    }
                }));
            } catch (error) {
                console.error(`Lỗi khi lấy dữ liệu từ API (${type}):`, error);
            }
        };

        ["Day", "Week", "Month", "Year"].forEach(fetchData);
    }, []);

    const cards = [
        { title: "Hôm nay", data: data.day, headStyle: { color: "white" } },
        { title: "Tuần này", data: data.week, headStyle: { color: "white" } },
        { title: "Tháng này", data: data.month, headStyle: { color: "white" } },
        { title: "Năm nay", data: data.year, headStyle: { color: "white" } },
    ];

    return (
<>
<h2 style={{ color: "orange", fontSize: 25, fontWeight: "bold", marginBottom: 20,marginTop:40 }}>
        Thống kê doanh thu của cửa hàng
    </h2>
    <Row gutter={[16, 16]} justify="center">
        {cards.map((item, index) => (
            <Col xs={24} sm={12} md={12} lg={12} key={index}>
                <Card title={item.title} hoverable style={cardStyles} headStyle={item.headStyle}>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>
                        {item.data?.totalRevenue ? item.data.totalRevenue.toLocaleString() : "..."} VNĐ
                    </h1>
                    <Row gutter={[8, 8]} justify="space-between">
                        <Col span={5}><strong>Số lượng đơn</strong><br />{item?.data?.totalOrders || 0}</Col>
                        <Col span={5}><strong>Sản phẩm</strong><br />{item?.data?.totalProductsSold || 0}</Col>
                        <Col span={5}><strong>Đơn thành công</strong><br />{item?.data?.successfulOrders || 0}</Col>
                        <Col span={5}><strong>Đơn hủy</strong><br />{item?.data?.cancelledOrders || 0}</Col>
                        <Col span={5}><strong>Đơn hoàn</strong><br />{item?.data?.returnedOrders || 0}</Col>
                    </Row>
                </Card>
            </Col>
        ))}
    </Row>

    {customData && (
        <Row justify="center" style={{ marginTop: 20 }}>
            <Col xs={24} sm={24} md={24} lg={24}>
                <Card title={<span style={{ color: "white", textAlign: "center", display: "block" }}>Tùy chỉnh</span>} hoverable style={cardStyles}>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>
                        {customData.totalRevenue.toLocaleString()} VNĐ
                    </h1>
                    <Row gutter={[8, 8]} justify="space-around">
                        <Col span={4}><strong>Số lượng đơn</strong><br />{customData.totalOrders || 0}</Col>
                        <Col span={4}><strong>Sản phẩm</strong><br />{customData.totalProductsSold || 0}</Col>
                        <Col span={4}><strong>Đơn thành công</strong><br />{customData.successfulOrders || 0}</Col>
                        <Col span={4}><strong>Đơn hủy</strong><br />{customData.cancelledOrders || 0}</Col>
                        <Col span={4}><strong>Đơn hoàn</strong><br />{customData.returnedOrders || 0}</Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    )}
</>

    
    );
};

const DateFilter = ({ onSetCustomData, customData }) => {
    const [showRangePicker, setShowRangePicker] = useState(false);
    const [dateRange, setDateRange] = useState(null);

    const handleDateChange = async (dates) => {
        if (dates) {
            const startDate = dates[0].format("YYYY-MM-DD");
            const endDate = dates[1].format("YYYY-MM-DD");
            setDateRange({ startDate, endDate }); // Lưu khoảng thời gian đã chọn

            try {
                const response = await axios.get(`http://localhost:8080/api/statistical/CustomDate?startDate=${startDate}&endDate=${endDate}`);
                onSetCustomData(response.data.data?.[0] || null);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu tùy chỉnh từ API:", error);
            }
        }
    };
    const handleExportExcel = () => {
    if (!customData || !dateRange) {
        console.warn("Không có dữ liệu để xuất.");
        return;
    }
    const { startDate, endDate } = dateRange;
    exportToExcel(customData, { startDate, endDate }, `DoanhThu_${startDate}_to_${endDate}.xlsx`);
};

    return (
        <Card style={{ marginBottom: 16, background: "linear-gradient(180deg, orange, rgb(210, 209, 207))", color: "white" }}>
            <Button type="default" style={{ marginLeft: 8, background: "linear-gradient(180deg, orange, rgb(210, 209, 207))", color: "white" }} onClick={() => setShowRangePicker(!showRangePicker)}>
                TÙY CHỈNH
            </Button>
            {showRangePicker && (
                <RangePicker style={{ marginLeft: 16 }} onChange={handleDateChange} />
            )}
            {/* <Button type="default" icon={<FileExcelOutlined />} style={{ marginLeft: 16, background: "linear-gradient(180deg, orange,rgb(210, 209, 207))", color: "white" }}
                onClick={handleExportExcel}
            >
                Xuất Excel
            </Button> */}

        </Card>
    );
};

const Dashboard = () => {
    const [customData, setCustomData] = useState(null);

    return (
        <div style={{ padding: "20px" }}>
            <RevenueCards showCustomCard={!!customData} customData={customData} />
            <DateFilter onSetCustomData={setCustomData} customData={customData} />
        </div>
    );
};

export default Dashboard;
