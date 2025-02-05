

import React, { useState } from "react";
import { Table, Input, Button, Modal, Form, Input as AntInput, Select } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "antd/dist/reset.css"; // Import Ant Design CSS

const Product = () => {
    // Dữ liệu mẫu
    const initialProducts = [
        {
            id: 1,
            name: "Nike Air Max",
            category: "Giày thể thao",
            brand: "Nike",
            fabricMaterial: "Vải canvas",
            soleMaterial: "Cao su",
            status: "Còn hàng",
            size: "42",  // Added size field
            createdDate: "2024-01-06"
        },
        {
            id: 2,
            name: "Adidas Ultraboost",
            category: "Giày chạy bộ",
            brand: "Adidas",
            fabricMaterial: "Vải dệt",
            soleMaterial: "EVA",
            status: "Còn hàng",
            size: "40",  // Added size field
            createdDate: "2024-01-06"
        }
    ];

    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // Xử lý tìm kiếm
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filteredProducts = initialProducts.filter(product =>
            product.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setProducts(filteredProducts);
    };

    // Xử lý thêm mới
    const handleAdd = () => {
        setIsEdit(false);
        setCurrentProduct(null);
        setIsModalVisible(true);
    };

    // Xử lý sửa
    const handleEdit = (id) => {
        const product = products.find(item => item.id === id);
        setIsEdit(true);
        setCurrentProduct(product);
        setIsModalVisible(true);
    };

    // Xử lý lưu sản phẩm (thêm mới hoặc sửa)
    const handleSave = (values) => {
        if (isEdit) {
            // Cập nhật sản phẩm
            const updatedProducts = products.map(product =>
                product.id === currentProduct.id ? { ...product, ...values } : product
            );
            setProducts(updatedProducts);

            // Hiển thị thông báo sửa thành công
            Modal.success({
                title: 'Cập nhật thành công',
                content: 'Sản phẩm đã được cập nhật thành công!',
            });
        } else {
            // Thêm mới sản phẩm
            const newProduct = { ...values, id: products.length + 1, createdDate: new Date().toLocaleDateString() };
            setProducts([...products, newProduct]);

            // Hiển thị thông báo thêm thành công
            Modal.success({
                title: 'Thêm mới thành công',
                content: 'Sản phẩm đã được thêm mới thành công!',
            });
        }
        setIsModalVisible(false);
    };

    // Xử lý xóa
    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Xóa sản phẩm',
            content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            onOk() {
                const newProducts = products.filter(product => product.id !== id);
                setProducts(newProducts);
                Modal.success({
                    content: 'Đã xóa sản phẩm thành công!',
                });
            },
            onCancel() {
                console.log('Hủy xóa sản phẩm');
            },
        });
    };

    // Cột của bảng
    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên giày',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Thương hiệu',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Chất liệu vải',
            dataIndex: 'fabricMaterial',
            key: 'fabricMaterial',
        },
        {
            title: 'Chất liệu đế',
            dataIndex: 'soleMaterial',
            key: 'soleMaterial',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Size',  // Added Size column
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button 
                        type="link" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record.id)}
                    />
                    <Button 
                        type="link" 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDelete(record.id)}
                    />
                </span>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Danh sách Sản Phẩm</h1>

            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                <Input
                    placeholder="Nhập vào tên của giày mà bạn muốn tìm!"
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ width: '80%' }}
                />
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={handleAdd}
                >
                    Thêm mới
                </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={products} 
                rowKey="id"
                locale={{
                    emptyText: (
                        <div style={{ textAlign: 'center' }}>
                            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M25 45.8333C36.5057 45.8333 45.8333 36.5057 45.8333 25C45.8333 13.4943 36.5057 4.16667 25 4.16667C13.4943 4.16667 4.16667 13.4943 4.16667 25C4.16667 36.5057 13.4943 45.8333 25 45.8333Z" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M18.75 18.75L31.25 31.25" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M31.25 18.75L18.75 31.25" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p>Không có dữ liệu</p>
                        </div>
                    )
                }}
            />

            {/* Modal Form Thêm/Sửa sản phẩm */}
            <Modal
                title={isEdit ? 'Sửa sản phẩm' : 'Thêm mới sản phẩm'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    initialValues={currentProduct}
                    onFinish={handleSave}
                    layout="vertical"
                >
                    <Form.Item
                        label="Tên giày"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên giày!' }]}
                    >
                        <AntInput />
                    </Form.Item>
                    <Form.Item
                        label="Danh mục"
                        name="category"
                        rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}
                    >
                        <AntInput />
                    </Form.Item>
                    <Form.Item
                        label="Thương hiệu"
                        name="brand"
                        rules={[{ required: true, message: 'Vui lòng nhập thương hiệu!' }]}
                    >
                        <AntInput />
                    </Form.Item>
                    <Form.Item
                        label="Chất liệu vải"
                        name="fabricMaterial"
                        rules={[{ required: true, message: 'Vui lòng nhập chất liệu vải!' }]}
                    >
                        <AntInput />
                    </Form.Item>
                    <Form.Item
                        label="Chất liệu đế"
                        name="soleMaterial"
                        rules={[{ required: true, message: 'Vui lòng nhập chất liệu đế!' }]}
                    >
                        <AntInput />
                    </Form.Item>
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng nhập trạng thái!' }]}
                    >
                        <Select>
                            <Select.Option value="Còn hàng">Còn hàng</Select.Option>
                            <Select.Option value="Hết hàng">Hết hàng</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Size"
                        name="size"  // Added size field
                        rules={[{ required: true, message: 'Vui lòng nhập size!' }]}
                    >
                        <AntInput />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Product;
