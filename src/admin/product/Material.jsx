import React from 'react';
import { Table, Input, Button, Row, Col, Typography, Space, Empty } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './Material.module.css';

const { Title } = Typography;

function Material() {
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
                    <Button type="link">Edit</Button>
                    <Button type="link" danger>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    // Sample data
    const data = []; // Replace this with your actual data

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
                        // Add your search handler here
                        // onChange={handleSearch}
                    />
                </Col>
                <Col xs={24} sm={24} md={14} lg={14} style={{ textAlign: 'right' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className={styles.addButton}
                        // Add your button handler here
                        // onClick={handleAdd}
                    >
                        Tìm kiếm
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={data}
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
        </div>
    );
}

export default Material;