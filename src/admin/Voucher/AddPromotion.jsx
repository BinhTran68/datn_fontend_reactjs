import {
    Table, Input, Button, Row, Col, Typography, Card, Checkbox, Pagination, message
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

const AddPromotion = () => {
    const { Title } = Typography;
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [requestSearch, setRequestSearch] = useState({ name: "" });
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

    // Gọi API khi component render hoặc khi có thay đổi trong pagination hoặc requestSearch
    useEffect(() => {
        fetchProductsData();
    }, [pagination, requestSearch]);

    // API lấy danh sách sản phẩm
    const fetchProductsData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/productdetail/full", {
                params: {
                    page: pagination.current,
                    pageSize: pagination.pageSize,
                    name: requestSearch.name,
                },
            });
            setProducts(response.data.data);
            setTotalProducts(response.data.total);
        } catch (error) {
            message.error("Có lỗi xảy ra khi tải dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    // API lấy chi tiết sản phẩm theo tên
    // const fetchProductDetail = async (productName) => {
    //     try {
    //         const response = await axios.get(`http://localhost:8080/api/productdetail/name/${productName}`);
    //         if (response.data && response.data.data) {
    //             return response.data.data;
    //         } else {
    //             console.warn(`Không tìm thấy chi tiết sản phẩm cho: ${productName}`);
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi tải chi tiết sản phẩm:", error);
    //         message.error("Lỗi khi tải chi tiết sản phẩm.");
    //         return null;
    //     }
    // };


    // Xử lý chọn checkbox
    // const handleCheckboxChange = async (e, product) => {
    //     const isChecked = e.target.checked;
    
    //     if (isChecked) {
    //         setLoading(true);
    //         const productDetail = await fetchProductDetail(product.productName);
            
    //         if (productDetail) {
    //             setSelectedProducts((prev) => {
    //                 // Lọc ra các sản phẩm có cùng tên sản phẩm (nếu đã có)
    //                 const filteredProducts = prev.filter((p) => p.productName !== product.productName);
    //                 return [...filteredProducts, { ...product, ...productDetail }];
    //             });
    //         }
    //         setLoading(false);
    //     } else {
    //         // Khi bỏ chọn, xóa tất cả sản phẩm có cùng productName
    //         setSelectedProducts((prev) => prev.filter((p) => p.productName !== product.productName));
    //     }
    // };
    

    // useEffect(() => {
    //     console.log("Danh sách sản phẩm đã chọn:", selectedProducts);
    // }, [selectedProducts]);

    // Cấu hình cột cho bảng danh sách sản phẩm
    // const columns = [
    //     {
    //         dataIndex: "select",
    //         key: "select",
    //         width: "5rem",
    //         render: (_, record) => (
    //             <Checkbox
    //                 checked={selectedProducts.some((p) => p.id === record.id)}
    //                 onChange={(e) => handleCheckboxChange(e, record)}
    //             />
    //         ),
    //     },
    //     { title: "STT", dataIndex: "stt", key: "stt", width: "5rem", render: (_, __, index) => index + 1 },
    //     { title: "Tên Sản Phẩm", dataIndex: "productName", key: "productName", width: "20rem" },
    //     { title: "Số lượng", dataIndex: "totalQuantity", key: "totalQuantity", width: "20rem" },
    // ];

    // Cấu hình cột cho bảng danh sách sản phẩm đã chọn
    const columnsDetail = [
        { title: "STT", dataIndex: "stt", key: "stt", width: "5rem", render: (_, __, index) => index + 1 },
        { title: "Tên Sản Phẩm", dataIndex: "productName", key: "productName", width: "20rem" },
        { title: "Thương Hiệu", dataIndex: "brandName", key: "brandName", width: "15rem" },
        { title: "Loại", dataIndex: "typeName", key: "typeName", width: "15rem" },
        { title: "Màu Sắc", dataIndex: "colorName", key: "colorName", width: "10rem" },
        { title: "Chất Liệu", dataIndex: "materialName", key: "materialName", width: "15rem" },
        { title: "Kích Cỡ", dataIndex: "sizeName", key: "sizeName", width: "10rem" },
        { title: "Đế Giày", dataIndex: "soleName", key: "soleName", width: "15rem" },
        { title: "Giới Tính", dataIndex: "genderName", key: "genderName", width: "10rem" },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity", width: "10rem" },
        { title: "Trọng Lượng (kg)", dataIndex: "weight", key: "weight", width: "10rem" },
    ];

    return (
        <Row gutter={20}>
            <Col span={16}>
                <Card>
                    <Title level={2}>Sản Phẩm</Title>
                    <Row gutter={[16, 16]}>
                        <Col span={20}>
                            <Input
                                placeholder="Nhập vào tên sản phẩm bạn muốn tìm!"
                                prefix={<SearchOutlined />}
                                allowClear
                                value={requestSearch.name}
                                onChange={(e) => setRequestSearch({ name: e.target.value })}
                            />
                        </Col>
                        <Col span={4}>
                            <Button type="primary" icon={<SearchOutlined />} onClick={fetchProductsData}>
                                Tìm kiếm
                            </Button>
                        </Col>
                    </Row>
                    {/* Bảng danh sách sản phẩm */}
                    {/* <Table columns={columns} dataSource={products} loading={loading} pagination={false} rowKey="id" /> */}
                    <Table columns={columnsDetail} dataSource={products} rowKey="id" />

                    {/* Phân trang */}
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={totalProducts}
                        showSizeChanger
                        pageSizeOptions={["3", "5", "10", "20"]}
                        onChange={(page, pageSize) => setPagination({ current: page, pageSize })}
                    />
                </Card>
                {/* Bảng danh sách sản phẩm đã chọn */}
                <Card title="Sản Phẩm Đã Chọn">
                </Card>
            </Col>
        </Row>
    );
};

export default AddPromotion;
