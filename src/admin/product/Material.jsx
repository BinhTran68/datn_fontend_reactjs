


import React, { useState } from 'react';
import { Table, Input, Button, Row, Col, Typography, Space, Empty, Modal, Form, Select, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './Material.module.css';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

function Material() {
    const [data, setData] = useState([
        {
            key: '1',
            stt: 1,
            category: 'Cotton',
            createdAt: '2023-10-26',
            status: 'Active',
        },
        {
            key: '2',
            stt: 2,
            category: 'Polyester',
            createdAt: '2023-10-27',
            status: 'Inactive',
        },
        {
            key: '3',
            stt: 3,
            category: 'Linen',
            createdAt: '2023-10-28',
            status: 'Active',
        },
    ]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null); // Store record being edited
    const [form] = Form.useForm();

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const filteredData = data.filter(item =>
        item.category.toLowerCase().includes(searchText.toLowerCase())
    );

    const showModal = () => {
        setIsModalVisible(true);
        setEditingRecord(null); // Reset editing record when adding new item
        form.resetFields(); // Reset form fields
    };

    const handleEdit = (record) => {
        setIsModalVisible(true);
        setEditingRecord(record);
        form.setFieldsValue(record); // Set form values for edit
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDelete = (key) => {
        setData(data.filter(item => item.key !== key));
        message.success('Xóa chất liệu vải thành công!');
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const newRecord = {
                ...values,
                key: editingRecord ? editingRecord.key : String(Date.now()), // Use existing key if editing, else generate a new one
                stt: editingRecord ? editingRecord.stt : data.length + 1,
                createdAt: editingRecord ? editingRecord.createdAt : moment().format('YYYY-MM-DD'),
            };

            if (editingRecord) {
                setData(data.map(item => item.key === editingRecord.key ? newRecord : item));
                message.success('Sửa chất liệu vải thành công!');
            } else {
                setData([...data, newRecord]);
                message.success('Thêm chất liệu vải thành công!');
            }

            setIsModalVisible(false);
            form.resetFields();
            setEditingRecord(null);
        }).catch(info => {
            console.log('Validate Failed:', info);
            message.error('Lỗi khi thêm/sửa chất liệu vải!');
        });
    };

    // Define table columns
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: '10%',
        },
        {
            title: 'Chất liệu vải',
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
                    className={
                        status === 'Active' ? styles.activeStatus : styles.inactiveStatus
                    }
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
                    <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.key)}>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <Title level={2} className={styles.title}>
                Danh sách chất liệu vải
            </Title>
            <Row gutter={[16, 16]} className={styles.searchRow}>
                <Col xs={24} sm={24} md={10} lg={10}>
                    <Input
                        placeholder="Nhập vào chất liệu đế của giày mà bạn muốn tìm!"
                        prefix={<SearchOutlined />}
                        allowClear
                        className={styles.searchInput}
                        onChange={handleSearch}
                    />
                </Col>
                <Col xs={24} sm={24} md={14} lg={14} style={{ textAlign: 'right' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className={styles.addButton}
                        onClick={showModal}
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

            <Modal
                title={editingRecord ? "Sửa chất liệu vải" : "Thêm chất liệu vải"}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Chất liệu vải"
                        name="category"
                        rules={[{ required: true, message: 'Vui lòng nhập chất liệu vải!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select>
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Material;