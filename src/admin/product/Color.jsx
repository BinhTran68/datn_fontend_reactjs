



import React, { useState } from 'react';
import { Table, Input, Button, Row, Col, Typography, Space, Empty, Modal, message, Select } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './Color.module.css';

const { Title } = Typography;
const { Option } = Select;

function Color() {
    const [data, setData] = useState([
        {
            key: '1',
            stt: 1,
            category: 'Đỏ',
            createdAt: '2023-05-20',
            status: 'Active',
        },
        {
            key: '2',
            stt: 2,
            category: 'Xanh',
            createdAt: '2023-05-21',
            status: 'Inactive',
        },
    ]);

    const [searchText, setSearchText] = useState('');
    const [editingRecord, setEditingRecord] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const handleAdd = () => {
        setEditingRecord({
            key: '',
            stt: data.length + 1,
            category: '',
            createdAt: new Date().toISOString().slice(0, 10),
            status: 'Active',
        });
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingRecord({ ...record });
        setModalVisible(true);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa màu sắc này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => {
                setData((prevData) => prevData.filter((item) => item.key !== record.key));
                message.success('Xóa màu sắc thành công');
            },
        });
    };

    const handleSave = () => {
        if (!editingRecord.category) {
            message.error('Vui lòng nhập tên màu sắc');
            return;
        }

        if (editingRecord.key) {
            setData((prevData) =>
                prevData.map((item) => (item.key === editingRecord.key ? editingRecord : item))
            );
            message.success('Cập nhật màu sắc thành công');
        } else {
            setData((prevData) => [
                ...prevData,
                { ...editingRecord, key: Date.now().toString() }
            ]);
            message.success('Thêm màu sắc thành công');
        }
        setModalVisible(false);
        setEditingRecord(null);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setEditingRecord(null);
    };

    const handleInputChange = (field, value) => {
        setEditingRecord((prevRecord) => ({
            ...prevRecord,
            [field]: value,
        }));
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: '10%',
        },
        {
            title: 'Màu sắc',
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
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const filteredData = data.filter((item) =>
        item.category.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <Title level={2} className={styles.title}>
                Danh sách màu sắc
            </Title>
            <Row gutter={[16, 16]} className={styles.searchRow}>
                <Col xs={24} sm={24} md={10} lg={10}>
                    <Input
                        placeholder="Nhập vào màu sắc của giày mà bạn muốn tìm!"
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
                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />,
                }}
                className={styles.table}
            />

            <Modal
                title={editingRecord?.key ? 'Sửa màu sắc' : 'Thêm màu sắc'}
                visible={modalVisible}
                onOk={handleSave}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                        <label>Tên màu sắc:</label>
                        <Input
                            placeholder="Nhập tên màu sắc"
                            value={editingRecord?.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Trạng thái:</label>
                        <Select
                            value={editingRecord?.status}
                            style={{ width: '100%' }}
                            onChange={(value) => handleInputChange('status', value)}
                        >
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
                    </div>
                    <div>
                        <label>Ngày tạo:</label>
                        <Input
                            type="date"
                            value={editingRecord?.createdAt}
                            onChange={(e) => handleInputChange('createdAt', e.target.value)}
                        />
                    </div>
                </Space>
            </Modal>
        </div>
    );
}

export default Color