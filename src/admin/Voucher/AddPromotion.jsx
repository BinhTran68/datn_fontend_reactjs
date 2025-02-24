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
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:8080/api/product/getallselect");
            setProducts(response.data.data || []);
        } catch (error) {
            setError('Lỗi khi lấy danh sách sản phẩm!');
            message.error('Lỗi khi lấy danh sách sản phẩm!');
        }
        setLoading(false);
    };
     // Gọi API lấy chi tiết sản phẩm khi mở rộng hàng
     const fetchProductDetails = async (productId) => {
        if (productDetails[productId]) return; // Nếu đã có dữ liệu thì không gọi API nữa

        setLoadingDetails((prev) => ({ ...prev, [productId]: true }));
        try {
            const response = await axios.get(`http://localhost:8080/api/productdetail?productId=${productId}`);
            setProductDetails((prev) => ({ ...prev, [productId]: response.data.data || [] }));
        } catch (error) {
            message.error(`Lỗi khi tải chi tiết sản phẩm cho ${productId}`);
        }
        setLoadingDetails((prev) => ({ ...prev, [productId]: false }));
    };
    // Xử lý checkbox chọn sản phẩm
    const handleProductCheckboxChange = (productId) => {
        setSelectedProducts((prev) => {
            const newSelected = { ...prev, [productId]: !prev[productId] };
            if (!newSelected[productId]) {
                setExpandedRowKeys(expandedRowKeys.filter(key => key !== productId));
            } else {
                setExpandedRowKeys([...expandedRowKeys, productId]);
                fetchProductDetails(productId); // Gọi API lấy chi tiết khi chọn sản phẩm
            }
            return newSelected;
        });
    };

    // Xử lý checkbox chọn chi tiết sản phẩm
    const handleDetailCheckboxChange = (productId, detailId) => {
        setSelectedProducts((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [detailId]: !prev[productId]?.[detailId],
            },
        }));
    };

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

    const productColumns = [
        {
            title: '',
            dataIndex: 'select',
            key: 'select',
            render: (_, record) => (
                <Checkbox
                    checked={!!selectedProducts[record.id]}
                    onChange={() => handleProductCheckboxChange(record.id)}
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
    ];

    const expandedRowRender = (record) => {
        const detailColumns = [
            {
                title: '',
                dataIndex: 'select',
                key: 'select',
                render: (_, detail) => (
                    <Checkbox
                        checked={!!selectedProducts[record.id]?.[detail.id]}
                        onChange={() => handleDetailCheckboxChange(record.id, detail.id)}
                    />
                ),
            },
            {
                title: 'Mã chi tiết',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: 'Tên chi tiết',
                dataIndex: 'detailName',
                key: 'detailName',
            },
        ];

        return <Table columns={detailColumns} dataSource={record.details} rowKey="id" pagination={false} />;
    };

    return (
        <Row gutter={20}>
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
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
            <Col span={16}>
                {loading && <Spin style={{ marginTop: 10 }} />}
                {error && <Alert message={error} type="error" showIcon style={{ marginTop: 10 }} />}
                <Button type="primary" onClick={fetchProducts} disabled={loading} loading={loading} style={{ marginBottom: 10 }}>
                    Tải lại danh sách sản phẩm
                </Button>
                <Table
                    columns={productColumns}
                    dataSource={products}
                    rowKey="id"
                    expandable={{
                        expandedRowRender,
                        expandedRowKeys,
                        onExpand: (expanded, record) => {
                            setExpandedRowKeys(expanded ? [...expandedRowKeys, record.id] : expandedRowKeys.filter(key => key !== record.id));
                        },
                    }}
                />
            </Col>
        </Row>
    );
};

export default AddPromotion;
