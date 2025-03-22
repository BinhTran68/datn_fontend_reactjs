import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Typography, Card, Space, Statistic } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import { ShoppingCartOutlined, DollarOutlined, UserOutlined, ShoppingOutlined } from '@ant-design/icons';
import AddressSelector from "./AddressSelector.jsx";
import AddressSelectorAntd from "./AddressSelectorAntd.jsx";
import {generateAddressString} from "../../helpers/Helpers.js";
import Statistical from "../statistical/Statistical.jsx";

const { Title, Text } = Typography;

const Dashboard = () => {
    const [data, setData] = useState([
        { label: "Chờ Xác Nhận", value: 0 },
        { label: "Chờ Lấy Hàng", value: 0 },
        { label: "Đang giao hàng", value: 0 },
        { label: "Sản Phẩm Hết Hàng", value: 0 },
    ]);
    const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));
    const [topProducts, setTopProducts] = useState([]);
    const [statistics, setStatistics] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0
    });

    const [address, setAddress] = useState({
        provinceId: null,
        districtId: null,
        wardId: null,
        specificAddress: '',
    });

    const [addressText, setAddressText] = useState('')

    const handleAddressChange =   (provinceId, districtId, wardId, specificAddress) => {
        setAddress({
            provinceId,
            districtId,
            wardId,
            specificAddress,
        });
        console.log('Updated Address:', {
            provinceId,
            districtId,
            wardId,
            specificAddress,
        });

    };

    // Fetch dashboard data
    useEffect(() => {
        // TODO: Replace with actual API calls
        setStatistics({
            totalRevenue: 1500000000,
            totalOrders: 150,
            totalCustomers: 89,
            totalProducts: 200
        });

        setTopProducts([
            { name: "Nike Air Max", sales: 50 },
            { name: "Adidas Ultraboost", sales: 45 },
            { name: "Jordan 1", sales: 40 },
            { name: "Converse Chuck 70s", sales: 35 }
        ]);

        const interval = setInterval(() => {
            setCurrentTime(moment().format("HH:mm:ss"));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard-container" style={{ padding: '24px' }}>
            <Title level={2}>Tổng Quan Hệ Thống</Title>
            <Text>Thời gian hiện tại: {currentTime}</Text>
            
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng Doanh Thu"
                            value={statistics.totalRevenue}
                            prefix={<DollarOutlined />}
                            suffix="VNĐ"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng Đơn Hàng"
                            value={statistics.totalOrders}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Khách Hàng"
                            value={statistics.totalCustomers}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Sản Phẩm"
                            value={statistics.totalProducts}
                            prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} md={12}>
                    <Card title="Trạng Thái Đơn Hàng">
                        {data.map((item, index) => (
                            <div key={index} style={{ marginBottom: '16px' }}>
                                <Text>{item.label}: </Text>
                                <Text strong>{item.value}</Text>
                            </div>
                        ))}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Top Sản Phẩm Bán Chạy">
                        {topProducts.map((product, index) => (
                            <div key={index} style={{ marginBottom: '16px' }}>
                                <Text>{product.name}: </Text>
                                <Text strong>{product.sales} đơn</Text>
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginTop: '24px' }}>
                <Col span={24}>
                    <Card title="Thống Kê Chi Tiết">
                        <Statistical />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
