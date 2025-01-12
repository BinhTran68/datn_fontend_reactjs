



import React, { useState } from 'react';
import { Table, Input, Button, Row, Col, Typography, Space, Empty, notification, Modal, Form, Select, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './Size.module.css';

const { Title } = Typography;
const { Option } = Select;

function Size() {
    const [data, setData] = useState([
        {
            key: '1',
            stt: '1',
            category: 'Size 38',
            createdAt: '2025-01-07',
            status: 'Active',
        },
        {
            key: '2',
            stt: '2',
            category: 'Size 40',
            createdAt: '2025-01-07',
            status: 'Inactive',
        },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);  // To store data of the item to be edited
    const [form] = Form.useForm(); // Create form instance for handling form data

    // Filter data based on the search input
    const filteredData = data.filter(item =>
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setIsEditMode(false);  // Reset to Add mode
        setCurrentItem(null);   // No item for editing
        setIsModalVisible(true); // Open modal
    };

    const handleEdit = (record) => {
        setIsEditMode(true);  // Set to Edit mode
        setCurrentItem(record);  // Set the item to edit
        setIsModalVisible(true); // Open modal
    };

    const handleDelete = (key) => {
        const newData = data.filter(item => item.key !== key);
        setData(newData);
        notification.success({
            message: 'Delete item',
            description: 'Successfully deleted the item.',
        });
    };

    const handleModalOk = (values) => {
        if (isEditMode) {
            const updatedData = data.map(item =>
                item.key === currentItem.key ? { ...item, ...values } : item
            );
            setData(updatedData);
            notification.success({
                message: 'Edit item',
                description: `Successfully updated to ${values.category}`,
            });
        } else {
            const newData = {
                key: (data.length + 1).toString(),
                stt: (data.length + 1).toString(),
                ...values,
                createdAt: new Date().toLocaleDateString(),
            };
            setData([...data, newData]);
            notification.success({
                message: 'Add new item',
                description: `Successfully added ${values.category}`,
            });
        }
        setIsModalVisible(false);  // Close modal after submitting
    };

    const handleModalCancel = () => {
        setIsModalVisible(false); // Close modal without saving
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: '10%',
        },
        {
            title: 'Kích cỡ',
            dataIndex: 'category',
            key: 'category',
            width: '30%',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '20%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            render: (status) => (
                <span className={status === 'Active' ? styles.activeStatus : styles.inactiveStatus}>
                    {status}
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm
                        title="Are you sure to delete?"
                        onConfirm={() => handleDelete(record.key)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <Title level={2} className={styles.title}>Danh sách kích cỡ</Title>

            {/* Search Input */}
            <Row gutter={[16, 16]} className={styles.searchRow}>
                <Col xs={24} sm={24} md={10} lg={10}>
                    <Input
                        placeholder="Nhập vào kích cỡ bạn muốn tìm!"
                        prefix={<SearchOutlined />}
                        allowClear
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col xs={24} sm={24} md={14} lg={14} style={{ textAlign: 'right' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className={styles.addButton}
                        onClick={handleAdd}
                    >
                        Thêm mới
                    </Button>
                </Col>
            </Row>

            {/* Table with actions */}
            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 10 }}
                locale={{
                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />,
                }}
                className={styles.table}
            />

            {/* Modal for Add/Edit */}
            <Modal
                title={isEditMode ? "Sửa kích cỡ" : "Thêm mới kích cỡ"}
                visible={isModalVisible}
                onOk={() => form.submit()}
                onCancel={handleModalCancel}
                okText={isEditMode ? "Lưu" : "Thêm"}
            >
                <Form
                    form={form} // Assign the form instance here
                    initialValues={isEditMode ? currentItem : { category: '', status: 'Active' }}
                    onFinish={handleModalOk}
                    layout="vertical"
                >
                    <Form.Item
                        name="category"
                        label="Kích cỡ"
                        rules={[{ required: true, message: 'Vui lòng nhập kích cỡ!' }]}
                    >
                        <Input placeholder="Nhập kích cỡ" />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Size;
