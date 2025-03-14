import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, DatePicker, Tooltip } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
//#2e95dd
const { RangePicker } = DatePicker;

const cardStyles = {
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(3, 120, 255, 0.15)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    background: "white",
    color: "black",
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
        { wch: 165 },
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
                const response = await axios.get(`http://localhost:8080/api/admin/statistical/${type}`);
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
        { title: "Ngày", data: data.day, headStyle: { color: "black" } },
        { title: "Tuần", data: data.week, headStyle: { color: "balck" } },
        { title: "Tháng", data: data.month, headStyle: { color: "black" } },
        { title: "Năm", data: data.year, headStyle: { color: "black" } },
    ];

    return (
        <>
            {/* <h2 style={{ color: "orange", fontSize: 25, fontWeight: "bold", marginBottom: 20, marginTop: 40 }}>
                Thống kê doanh thu của cửa hàng
            </h2> */}
            <Row gutter={[16, 16]} justify="center">
                {cards.map((item, index) => (
                    <Col xs={24} sm={12} md={12} lg={6} key={index}>
                        <Card title={item.title} hoverable style={cardStyles} headStyle={item.headStyle}>
                            <h1 style={{ fontSize: "20px", textAlign: "left" }}>
                                {item.data?.totalRevenue ? item.data.totalRevenue.toLocaleString() : "..."} VNĐ
                            </h1>
                            <Row gutter={[8, 8]} justify="left" style={{ fontSize: "14px", fontWeight: "bold" }}>
                                <Col span={4} style={{ color: "#007bff" }}>
                                    <Tooltip title="Số lượng đơn">
                                        • {item?.data?.totalOrders || 0}
                                    </Tooltip>
                                </Col>
                                <Col span={4} style={{ color: "#28a745" }}>
                                    <Tooltip title="Số sản phẩm đã bán">
                                        • {item?.data?.totalProductsSold || 0}
                                    </Tooltip>
                                </Col>
                                <Col span={4} style={{ color: "#ffc107" }}>
                                    <Tooltip title="Đơn thành công">
                                        • {item?.data?.successfulOrders || 0}
                                    </Tooltip>
                                </Col>
                                <Col span={4} style={{ color: "#dc3545" }}>
                                    <Tooltip title="Đơn hủy">
                                        • {item?.data?.cancelledOrders || 0}
                                    </Tooltip>
                                </Col>
                                <Col span={4} style={{ color: "#6c757d" }}>
                                    <Tooltip title="Đơn hoàn">
                                        • {item?.data?.returnedOrders || 0}
                                    </Tooltip>
                                </Col>
                            </Row>

                        </Card>
                    </Col>
                ))}
            </Row>

            {customData && (
                <Row justify="center" style={{ marginTop: 20 }}>
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Card title={<span style={{ color: "black", textAlign: "center", display: "block" }}>Tùy chỉnh</span>} hoverable style={cardStyles}>
                            <h1 style={{ fontSize: "20px", textAlign: "center" }}>
                                {customData.totalRevenue.toLocaleString()} VNĐ
                            </h1>
                            <Row gutter={[8, 8]} justify="center" style={{ textAlign: "center", fontSize: "14px", fontWeight: "bold" }}>
                                <Col span={4} style={{ color: "#007bff" }}>
                                    <Tooltip title="Số lượng đơn">
                                        <span>• {customData.totalOrders || 0}</span>
                                    </Tooltip>
                                </Col>
                                <Col span={4} style={{ color: "#28a745" }}>
                                    <Tooltip title="Số sản phẩm đã bán">
                                        <span>• {customData.totalProductsSold || 0}</span>
                                    </Tooltip>
                                </Col>
                                <Col span={4} style={{ color: "#ffc107" }}>
                                    <Tooltip title="Đơn thành công">
                                        <span>• {customData.successfulOrders || 0}</span>
                                    </Tooltip>
                                </Col>
                                <Col span={4} style={{ color: "#dc3545" }}>
                                    <Tooltip title="Đơn hủy">
                                        <span>• {customData.cancelledOrders || 0}</span>
                                    </Tooltip>
                                </Col>
                                <Col span={4} style={{ color: "#6c757d" }}>
                                    <Tooltip title="Đơn hoàn">
                                        <span>• {customData.returnedOrders || 0}</span>
                                    </Tooltip>
                                </Col>
                            </Row>

                        </Card>
                    </Col>
                </Row>
            )}
        </>


    );
};

const DateFilter = ({ onSetCustomData, customData }) => {
    const [dateRange, setDateRange] = useState(null);

    const handleDateChange = async (dates) => {
        if (dates) {
            const startDate = dates[0].format("YYYY-MM-DD");
            const endDate = dates[1].format("YYYY-MM-DD");
            setDateRange({ startDate, endDate }); // Lưu khoảng thời gian đã chọn

            try {
                const response = await axios.get(`http://localhost:8080/api/admin/statistical/CustomDate?startDate=${startDate}&endDate=${endDate}`);
                onSetCustomData(response.data.data?.[0] || null);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu tùy chỉnh từ API:", error);
            }
        }
    };

    return (
        <Card style={{ textAlign: "left", marginBottom: 5, background: "white", color: "black", border: "none" }}>
            <h5 style={{ margin: -22 }}>Doanh thu</h5>
            <div style={{ display: "flex", justifyContent: "flex-end", color: "black" }}>

                <RangePicker onChange={handleDateChange}
                    style={{ width: "250px", height: "25px" }}
                />
            </div>
            {/* {dateRange && (
                <div style={{ marginTop: "10px", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>
                    Khoảng thời gian: {dateRange.startDate} → {dateRange.endDate}
                </div>
            )} */}
        </Card>
    );
};


const Dashboard = () => {
    const [customData, setCustomData] = useState(null);

    return (
        <div style={{ padding: "20px" }}>
            <DateFilter onSetCustomData={setCustomData} customData={customData} />
            <RevenueCards showCustomCard={!!customData} customData={customData} />
        </div>
    );
};

export default Dashboard;
