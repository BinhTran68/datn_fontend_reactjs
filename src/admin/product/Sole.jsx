


import React, { useState } from 'react';
import { Table, Input, Button, Row, Col, Typography, Space, Empty, notification, Modal, Form, Input as AntInput, Select } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './Sole.module.css';

const { Title } = Typography;
const { Option } = Select;

function Sole() {
    // State để quản lý dữ liệu bảng
    const [data, setData] = useState([
        {
            key: 1,
            stt: 1,
            category: 'Chất liệu A',
            createdAt: '2025-01-07',
            status: 'Active',
        },
        {
            key: 2,
            stt: 2,
            category: 'Chất liệu B',
            createdAt: '2025-01-06',
            status: 'Inactive',
        },
    ]);
    
    // State để quản lý modal và dữ liệu chỉnh sửa
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [form] = Form.useForm();

    // State để tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // Cột của bảng
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: '10%',
        },
        {
            title: 'Chất liệu đế',
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
                <span
                    className={status === 'Active' ? styles.activeStatus : styles.inactiveStatus}
                >
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
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Button type="link" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record.key)}>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    // Handle thêm mới dữ liệu
    const handleAdd = () => {
        setIsEdit(false);
        form.resetFields();
        setIsModalVisible(true);
    };

    // Handle chỉnh sửa dữ liệu
    const handleEdit = (record) => {
        setIsEdit(true);
        setCurrentRecord(record);
        form.setFieldsValue({
            category: record.category,
            status: record.status,
        });
        setIsModalVisible(true);
    };

    // Handle thêm/sửa dữ liệu
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                if (isEdit && currentRecord) {
                    const updatedData = data.map((item) =>
                        item.key === currentRecord.key
                            ? { ...item, ...values }
                            : item
                    );
                    setData(updatedData);
                    notification.info({
                        message: 'Cập nhật thành công!',
                        description: `Chất liệu đế "${currentRecord.category}" đã được sửa.`,
                    });
                } else {
                    const newData = {
                        key: data.length + 1,
                        stt: data.length + 1,
                        ...values,
                        createdAt: new Date().toLocaleDateString(),
                    };
                    setData([...data, newData]);
                    notification.success({
                        message: 'Thêm mới thành công!',
                        description: 'Chất liệu đế mới đã được thêm vào danh sách.',
                    });
                }
                setIsModalVisible(false);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    // Handle đóng modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Xử lý xác nhận xóa
    const showDeleteConfirm = (key) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa?',
            content: 'Chất liệu đế này sẽ bị xóa vĩnh viễn.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                handleDelete(key);
            },
        });
    };

    // Handle xóa dữ liệu
    const handleDelete = (key) => {
        const updatedData = data.filter(item => item.key !== key);
        setData(updatedData);

        notification.error({
            message: 'Xóa thành công!',
            description: 'Chất liệu đế đã được xóa khỏi danh sách.',
        });
    };

    // Tìm kiếm dữ liệu
    const filteredData = data.filter(item => item.category.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className={styles.container}>
            <Title level={2} className={styles.title}>
                Danh sách chất liệu đế
            </Title>
            <Row gutter={[16, 16]} className={styles.searchRow}>
                <Col xs={24} sm={24} md={10} lg={10}>
                    <Input
                        placeholder="Nhập vào chất liệu đế của giày mà bạn muốn tìm!"
                        prefix={<SearchOutlined />}
                        allowClear
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Handle search term update
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

            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 10 }}
                locale={{
                    emptyText: (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Không có dữ liệu"
                        />
                    ),
                }}
                className={styles.table}
            />

            {/* Modal cho thêm và sửa */}
            <Modal
                title={isEdit ? 'Chỉnh sửa chất liệu đế' : 'Thêm mới chất liệu đế'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={isEdit ? 'Cập nhật' : 'Thêm mới'}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        status: 'Active',
                    }}
                >
                    <Form.Item
                        label="Chất liệu đế"
                        name="category"
                        rules={[{ required: true, message: 'Vui lòng nhập chất liệu đế!' }]}
                    >
                        <AntInput />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Active">Hoạt động</Option>
                            <Option value="Inactive">Không hoạt động</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Sole;
