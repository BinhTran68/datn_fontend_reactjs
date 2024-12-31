import React from 'react';
import { Row, Col, Select, Button, Table, Typography } from 'antd';
import styles from './ProductManagement.module.css';

const { Option } = Select;
const { Title } = Typography;

function ProductManagement() {
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
            <Button type="primary" className={styles.addButton}>
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

      <Table columns={columns} dataSource={[]} locale={{ emptyText: 'No data' }} />
      <div className={styles.watermark}></div>
    </div>
  );
}

export default ProductManagement;