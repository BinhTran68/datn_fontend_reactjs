
import React, { useState } from 'react';
import { Row, Col, Select, Button, Table, Typography, notification, Modal, Form, Input, InputNumber } from 'antd';
import styles from './ProductManagement.module.css';

const { Option } = Select;
const { Title } = Typography;

function ProductManagement() {
  // Initial mock data for the table
  const initialData = [
    {
      key: '1',
      productName: 'giày',
      image: 'image1.jpg',
      color: 'Đỏ',
      size: 'M',
      quantity: 20,
      originalPrice: 200000,
      salePrice: 150000,
      status: 'Còn hàng',
    },
    {
      key: '2',
      productName: 'Giày thể thao',
      image: 'image2.jpg',
      color: 'Trắng',
      size: 'L',
      quantity: 15,
      originalPrice: 500000,
      salePrice: 400000,
      status: 'Còn hàng',
    },
  ];

  // State for table data and modals
  const [dataSource, setDataSource] = useState(initialData);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Handle Add Product button click
  const handleAddProduct = () => {
    setIsAddModalVisible(true);
  };

  // Handle Edit Product button click
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditModalVisible(true);
  };

  // Handle Delete Product button click
  const handleDeleteProduct = (key) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      onOk: () => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
        notification.success({
          message: 'Xóa sản phẩm thành công!',
          description: 'Sản phẩm đã được xóa khỏi danh sách.',
        });
      },
    });
  };

  // Handle form submission for adding new product
  const handleAddProductSubmit = (values) => {
    const newProduct = {
      key: (dataSource.length + 1).toString(),
      ...values,
    };
    setDataSource([...dataSource, newProduct]);
    setIsAddModalVisible(false);
    notification.success({
      message: 'Thêm sản phẩm mới thành công!',
      description: 'Sản phẩm mới đã được thêm vào danh sách.',
    });
  };

  // Handle form submission for editing product
  const handleEditProductSubmit = (values) => {
    const updatedData = dataSource.map((item) =>
      item.key === editingProduct.key ? { ...item, ...values } : item
    );
    setDataSource(updatedData);
    setIsEditModalVisible(false);
    setEditingProduct(null);
    notification.success({
      message: 'Chỉnh sửa sản phẩm thành công!',
      description: 'Sản phẩm đã được cập nhật.',
    });
  };

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
    },
    {
      title: 'Tên màu',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Tên kích thước',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Số lượng còn lại',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Giá gốc',
      dataIndex: 'originalPrice',
      key: 'originalPrice',
    },
    {
      title: 'Giá khuyến mãi',
      dataIndex: 'salePrice',
      key: 'salePrice',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => handleEditProduct(record)}>Sửa</Button>
          <Button type="link" onClick={() => handleDeleteProduct(record.key)}>Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Title level={1}>Quản lý sản phẩm chi tiết</Title>
      <Row gutter={16}>
        <Col span={16}>
          <label htmlFor="brand">Sản phẩm</label>
          <Select id="brand" style={{ width: '100%' }}>
            <Option value="">Tất cả sản phẩm</Option>
          </Select>
        </Col>
        <Col span={8}>
          <div className={styles.addButtonContainer}>
            <Button type="primary" className={styles.addButton} onClick={handleAddProduct}>
              + Thêm mới sản phẩm chi tiết
            </Button>
          </div>
        </Col>
      </Row>

      <div className={styles.filters}>
        <div className={styles.filter}>
          <label htmlFor="brand">Thương hiệu</label>
          <Select id="brand">
            <Option value="">Tất cả thương hiệu</Option>
          </Select>
        </div>
        <div className={styles.filter}>
          <label htmlFor="category">Danh mục</label>
          <Select id="category">
            <Option value="">Tất cả danh mục</Option>
          </Select>
        </div>
        <div className={styles.filter}>
          <label htmlFor="fabric">Chất liệu vải</label>
          <Select id="fabric">
            <Option value="">Tất cả chất vải</Option>
          </Select>
        </div>
        <div className={styles.filter}>
          <label htmlFor="sole">Chất liệu đế</label>
          <Select id="sole">
            <Option value="">Tất cả chất đế</Option>
          </Select>
        </div>
      </div>

      <Table columns={columns} dataSource={dataSource} locale={{ emptyText: 'Không có dữ liệu' }} />
      <div className={styles.watermark}></div>

      {/* Add Product Modal */}
      <Modal
        title="Thêm sản phẩm mới"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddProductSubmit}>
          <Form.Item label="Tên sản phẩm" name="productName" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Màu" name="color" rules={[{ required: true, message: 'Vui lòng nhập màu sản phẩm' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Kích thước" name="size" rules={[{ required: true, message: 'Vui lòng nhập kích thước' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Giá gốc" name="originalPrice" rules={[{ required: true, message: 'Vui lòng nhập giá gốc' }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Giá khuyến mãi" name="salePrice" rules={[{ required: true, message: 'Vui lòng nhập giá khuyến mãi' }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Select>
              <Option value="Còn hàng">Còn hàng</Option>
              <Option value="Hết hàng">Hết hàng</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        title="Chỉnh sửa sản phẩm"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={editingProduct}
          onFinish={handleEditProductSubmit}
        >
          <Form.Item label="Tên sản phẩm" name="productName" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Màu" name="color" rules={[{ required: true, message: 'Vui lòng nhập màu sản phẩm' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Kích thước" name="size" rules={[{ required: true, message: 'Vui lòng nhập kích thước' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Giá gốc" name="originalPrice" rules={[{ required: true, message: 'Vui lòng nhập giá gốc' }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Giá khuyến mãi" name="salePrice" rules={[{ required: true, message: 'Vui lòng nhập giá khuyến mãi' }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Select>
              <Option value="Còn hàng">Còn hàng</Option>
              <Option value="Hết hàng">Hết hàng</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ProductManagement;
