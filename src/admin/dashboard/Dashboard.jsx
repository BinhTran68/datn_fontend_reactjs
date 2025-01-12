import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Typography, Card, Space } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";


const { Title, Text } = Typography;

const Dashboard = () => {
    const [data, setData] = useState([
        { label: "Chờ Xác Nhận", value: 0 },
        { label: "Chờ Lấy Hàng", value: 0 },
        { label: "Đang giao hàng", value: 0 },
        { label: "Sản Phẩm Hết Hàng", value: 0 },
    ]);
    const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));

    // const fetchData = useCallback(async () => {
    //     try {
    //         const res = await getViecCanLamApi();
    //         console.log("res", res);
    //         if (res.code === 1000) {
    //             const transformedData = [
    //                 { label: "Chờ Xác Nhận", value: res.data.donChoXacNhan },
    //                 { label: "Chờ Lấy Hàng", value: res.data.donChoLayHang },
    //                 { label: "Đang giao hàng", value: res.data.donDangGiaoHang },
    //                 { label: "Sản Phẩm Hết Hàng", value: res.data.sanPhamHetHang },
    //             ];
    //             setData(transformedData);
    //         }
    //     } catch (error) {
    //         console.log("Failed to fetch data: ", error);
    //     }
    // }, []);
    //
    // useEffect(() => {
    //     fetchData();
    //
    //     const interval = setInterval(() => {
    //         setCurrentTime(moment().format("HH:mm:ss"));
    //     }, 1000);
    //
    //     return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    // }, [fetchData]);

    return (
        <div style={{padding: "20px",}}>
            <Row justify="space-between" align="middle">
                <Col>
                    <Title level={3}>Danh sách việc cần làm</Title>
                </Col>

            </Row>

            <Row gutter={[16, 16]} style={{marginTop: "20px"}}>
                {data.map((item, index) => (
                    <Col xs={24} sm={12} md={6} key={index}>
                        <Link
                            to={
                                index === 3 // Nếu là item thứ 4
                                    ? "/admin/sanphamchitiet"
                                    : "/admin/order-management" // 3 item đầu
                            }
                        >
                            <Card
                                bordered={false}
                                style={{
                                    textAlign: "center",
                                    border: "1px solid #f0f0f0",
                                    borderRadius: "8px",
                                }}
                            >
                                <Title
                                    level={4}
                                    style={{marginBottom: "10px", color: "#1890ff"}}
                                >
                                    {item.value}
                                </Title>
                                <Text>{item.label}</Text>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>

            <Row style={{marginTop: "20px", justifyContent: "center", textAlign: "center"}}>
                <Col>
                    <Space direction="vertical" align="center">
                        <Text style={{fontSize: "36px", fontWeight: "bold"}}>
                            {currentTime}
                        </Text>
                        <Text style={{fontSize: "18px"}}>
                            {moment().format("dddd, DD/MM/YYYY")}
                        </Text>
                    </Space>
                </Col>
            </Row>
            <Row style={{marginTop: "20px", justifyContent: "center", textAlign: "center"}}>
                <Col>
                    {/*<img*/}
                    {/*    src={logo}*/}
                    {/*    alt="Logo"*/}
                    {/*    style={{ width: "150px", height: "auto" }}*/}
                    {/*/>*/}
                </Col>
            </Row>


            <div className="row h-100">
                <div className="col-lg-5 col-12">
                    <div id="auth-left">
                        <div className="auth-logo">
                            <a href="index.html"><img src="assets/images/logo/logo.png" alt="Logo"/></a>
                        </div>
                        <h1 className="auth-title">Sign Up</h1>
                        <p className="auth-subtitle mb-5">Input your data to register to our website.</p>

                        <form action="index.html">
                            <div className="form-group position-relative has-icon-left mb-4">
                                <input type="text" className="form-control form-control-xl" placeholder="Email"/>
                                <div className="form-control-icon">
                                    <i className="bi bi-envelope"></i>
                                </div>
                            </div>
                            <div className="form-group position-relative has-icon-left mb-4">
                                <input type="text" className="form-control form-control-xl" placeholder="Username"/>
                                <div className="form-control-icon">
                                    <i className="bi bi-person"></i>
                                </div>
                            </div>
                            <div className="form-group position-relative has-icon-left mb-4">
                                <input type="password" className="form-control form-control-xl" placeholder="Password"/>
                                <div className="form-control-icon">
                                    <i className="bi bi-shield-lock"></i>
                                </div>
                            </div>
                            <div className="form-group position-relative has-icon-left mb-4">
                                <input type="password" className="form-control form-control-xl"
                                       placeholder="Confirm Password"/>
                                <div className="form-control-icon">
                                    <i className="bi bi-shield-lock"></i>
                                </div>
                            </div>
                            <button className="btn btn-primary btn-block btn-lg shadow-lg mt-5">Sign Up</button>
                        </form>
                        <div className="text-center mt-5 text-lg fs-4">
                            <p className='text-gray-600'>Already have an account? <a href="auth-login.html"
                                                                                     className="font-bold">Log
                                in</a>.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-7 d-none d-lg-block">
                    <div id="auth-right">

                    </div>
                </div>
            </div>


            <div className="page-heading">
                <div className="page-title">
                    <div className="row">
                        <div className="col-12 col-md-6 order-md-1 order-last">
                            <h3>CKEditor </h3>
                            <p className="text-subtitle text-muted">For user to check they list</p>
                        </div>
                        <div className="col-12 col-md-6 order-md-2 order-first">
                            <nav aria-label="breadcrumb" className="breadcrumb-header float-start float-lg-end">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="index.html">Dashboard</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">CKEditor</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Classic Editor</h4>
                                </div>
                                <div className="card-body">
                                    <div id="editor">
                                        <p>This is some sample content.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </div>
    );
};

export default Dashboard;
