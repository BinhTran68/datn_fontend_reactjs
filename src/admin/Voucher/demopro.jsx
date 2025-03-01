import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, message, Card, Col, Row, Table, Spin, Alert, Checkbox } from 'antd';
import axios from 'axios';
import { baseUrl } from '../../helpers/Helpers.js';
import { useNavigate } from 'react-router-dom';

const AddPromotion = () => {
    const [form] = Form.useForm();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [selectedProductDetails, setSelectedProductDetails] = useState([]); // Danh sách chi tiết sản phẩm
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    // Lấy danh sách sản phẩm từ API
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:8080/api/productdetail/full");
            setProducts(response.data.data || []);
        } catch (error) {
            setError('Lỗi khi lấy danh sách sản phẩm!');
            message.error('Lỗi khi lấy danh sách sản phẩm!');
        }
        setLoading(false);
    };

    // Lấy danh sách chi tiết sản phẩm từ API
    const fetchProductDetails = async (productId, productName) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/productdetail/${productId}`);
            const details = response.data.data || [];
            return details.map(detail => ({ ...detail, parentProduct: productName }));
        } catch (error) {
            message.error(`Lỗi khi lấy chi tiết sản phẩm ${productName}!`);
            return [];
        }
    };

    // Xử lý checkbox chọn sản phẩm
    const handleProductCheckboxChange = async (product) => {
        setSelectedProducts((prev) => {
            const newSelected = { ...prev, [product.id]: !prev[product.id] };

            if (newSelected[product.id]) {
                // Gọi API để lấy chi tiết sản phẩm khi chọn
                fetchProductDetails(product.id, product.productName).then(details => {
                    setSelectedProductDetails((prevDetails) => [...prevDetails, ...details]);
                });
            } else {
                // Khi bỏ chọn, loại bỏ chi tiết sản phẩm tương ứng
                setSelectedProductDetails((prevDetails) =>
                    prevDetails.filter(detail => detail.parentProduct !== product.productName)
                );
            }

            return newSelected;
        });
    };

    // Gửi dữ liệu lên server
    const onFinish = async (values) => {
        const selectedProductIds = Object.keys(selectedProducts).filter(id => selectedProducts[id]);

        if (selectedProductIds.length === 0) {
            message.error('Vui lòng chọn ít nhất một sản phẩm!');
            return;
        }

        try {
            await axios.post(`${baseUrl}/api/admin/promotion/add`, {
                ...values,
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate.format('YYYY-MM-DD'),
                productIds: selectedProductIds,
            });
            message.success('Thêm đợt giảm giá thành công!');
            navigate('/admin/promotion');
        } catch (error) {
            message.error('Lỗi khi thêm đợt giảm giá!');
        }
    };

    // Cấu hình bảng sản phẩm
    const productColumns = [
        {
            title: '',
            dataIndex: 'select',
            key: 'select',
            render: (_, record) => (
                <Checkbox
                    checked={!!selectedProducts[record.id]}
                    onChange={() => handleProductCheckboxChange(record)}
                />
            ),
        },
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
        },
    ];

    // Cấu hình bảng chi tiết sản phẩm
    const detailColumns = [
        {
            title: 'Tên sản phẩm gốc',
            dataIndex: 'parentProduct',
            key: 'parentProduct',
        },
        {
            title: 'Tên chi tiết sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
        },
    ];

    return (
        <Row gutter={20}>
            {/* Form thêm đợt giảm giá */}
            <Col span={8}>
                <Card title="Thêm mới đợt giảm giá">
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item name="promotionName" label="Tên đợt giảm giá" rules={[{ required: true }]}> 
                            <Input placeholder="Nhập tên đợt giảm giá" />
                        </Form.Item>
                        <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true }]}> 
                            <Input type="number" placeholder="Nhập giá trị giảm" />
                        </Form.Item>
                        <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}> 
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}> 
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Lưu</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>

            {/* Bảng danh sách sản phẩm */}
            <Col span={16}>
                <Card title="Danh sách sản phẩm">
                    {loading && <Spin style={{ marginTop: 10 }} />}
                    {error && <Alert message={error} type="error" showIcon style={{ marginTop: 10 }} />}
                    <Table
                        columns={productColumns}
                        dataSource={products}
                        rowKey="id"
                        pagination={false}
                    />
                </Card>
            </Col>

            {/* Bảng chi tiết sản phẩm đã chọn */}
            {selectedProductDetails.length > 0 && (
                <Col span={24} style={{ marginTop: 20 }}>
                    <Card title="Chi tiết sản phẩm đã chọn">
                        <Table
                            columns={detailColumns}
                            dataSource={selectedProductDetails}
                            rowKey="id"
                            pagination={false}
                        />
                    </Card>
                </Col>
            )}
        </Row>
    );
};


const [form] = Form.useForm();
const { Title } = Typography;
const [loading, setLoading] = useState(false);
const [products, setProducts] = useState([]);
const [totalProducts, setTotalProducts] = useState(0);
const [selectedProducts, setSelectedProducts] = useState([]);
const [requestSearch, setRequestSearch] = useState({ name: "" });
const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

useEffect(() => {
    fetchProductsData();
}, [pagination, requestSearch]);

const fetchProductsData = async () => {
    setLoading(true);
    try {
        const { data, total } = requestSearch.name.trim()
            ? await searchNameProduct(pagination, requestSearch)
            : await fetchProducts(pagination);
            // console.log("API Response:", data); // Debug dữ liệu trả về từ API

        setProducts(data);
        setTotalProducts(total);
    } catch (error) {
        message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
        setLoading(false);
    }
};

const handleCheckboxChange = async (e, product) => {
    const isChecked = e.target.checked;
    setLoading(true);
    try {
        if (isChecked) {
            if (!selectedProducts.some(p => p.id === product.id)) {
                const productDetail = await getProduct(product.id);
                setSelectedProducts(prev => [...prev, productDetail.data]);
            }
        } else {
            setSelectedProducts(prev => prev.filter((p) => p.id !== product.id));
        }
    } catch (error) {
        message.error(error.message || "Lỗi khi tải chi tiết sản phẩm.");
    } finally {
        setLoading(false);
    }

    const columns = [
        {
            dataIndex: "select",
            key: "select",
            width: "5rem",
            render: (_, record) => record.id && (
                <Checkbox
                    checked={selectedProducts.some(p => p.id === record.id)}
                    onChange={(e) => handleCheckboxChange(e, record)}
                />
            ),
        },
        { title: "STT", dataIndex: "stt", key: "stt", width: "5rem", render: (_, __, index) => index + 1 },
        { title: "Tên Sản Phẩm", dataIndex: "productName", key: "productName", width: "20rem" },
        { title: "Số lượng", dataIndex: "totalQuantity", key: "totalQuantity", width: "20rem" },
    ];

    const selectedColumns = [
        {
            dataIndex: "select",
            key: "select",
            width: "5rem",
            render: (_, record) => record.id && (
                <Checkbox
                />
            ),
        },
        { title: "STT", dataIndex: "stt", key: "stt", render: (_, __, index) => index + 1 },
        { title: "Sản phẩm", dataIndex: "productName", key: "productName" },
        { title: "Hãng", dataIndex: "brandName", key: "brandName" },
        { title: "Loại giày", dataIndex: "typeName", key: "typeName" },
        { title: "Màu sắc", dataIndex: "colorName", key: "colorName" },
        { title: "Chất liệu", dataIndex: "materialName", key: "materialName" },
        { title: "Kích cỡ", dataIndex: "sizeName", key: "sizeName" },
        { title: "Đế giày", dataIndex: "soleName", key: "soleName" },
        { title: "Giới tính", dataIndex: "genderName", key: "genderName" },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    ];
};










<Row gutter={20}>
<Col span={8}>
    <Card title="Thêm mới đợt giảm giá">
        <Form form={form} layout="vertical">
            <Form.Item name="promotionName" label="Tên đợt giảm giá" rules={[{ required: true }]}>
                <Input placeholder="Nhập tên đợt giảm giá" />
            </Form.Item>
            <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true }]}>
                <Input type="number" placeholder="Nhập giá trị giảm" />
            </Form.Item>
            <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Lưu</Button>
            </Form.Item>
        </Form>
    </Card>
</Col>
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
        <Table
            columns={columns}
            dataSource={handleDataSource()} // Dữ liệu đã xử lý với dòng trống
            loading={loading}
            pagination={false} // Bỏ pagination trong Table
            locale={{
                emptyText: (
                    <div style={{ textAlign: "center" }}>
                        <p>No data</p>
                    </div>
                ),
            }}
        />                    <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={totalProducts}
            showSizeChanger
            pageSizeOptions={["3", "5", "10", "20"]}
            onChange={(page, pageSize) => setPagination({ current: page, pageSize })}
        />
    </Card>
    {/* <Card title="Sản Phẩm Đã Chọn">
        <Table columns={selectedColumns} dataSource={selectedProducts} rowKey="id" />
    </Card> */}
</Col>
</Row>







export default AddPromotion;
