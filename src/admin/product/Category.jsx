import React, { useState } from 'react';
import { Table, Input, Button, Row, Col, Typography, Card, Space, Modal, Form, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Category = () => {
    const [searchText, setSearchText] = useState('');
    const [dataSource, setDataSource] = useState([
        { key: '1', stt: 1, danhMuc: 'Electronics', ngayTao: '2023-01-01', trangThai: 'Active' },
        { key: '2', stt: 2, danhMuc: 'Fashion', ngayTao: '2023-02-15', trangThai: 'Active' },
        { key: '3', stt: 3, danhMuc: 'Books', ngayTao: '2023-03-20', trangThai: 'Inactive' },
    ]);
    const [editingKey, setEditingKey] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
        },
        {
            title: 'Danh mục',
            dataIndex: 'danhMuc',
            key: 'danhMuc',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Tìm danh mục"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Tìm
                        </Button>
                        <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => record.danhMuc.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
        },
        {
            title: 'Thao tác',
            key: 'thaoTac',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)}>Xóa</Button>
                </Space>
            ),
        },
    ];

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        const filteredData = dataSource.filter(entry =>
            entry.danhMuc.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setDataSource(e.target.value ? filteredData : [...dataSource]);
    };

    const handleAdd = () => {
        setIsModalVisible(true);
        form.resetFields();
        setEditingKey('');
    };

    const handleEdit = (record) => {
        setIsModalVisible(true);
        form.setFieldsValue(record);
        setEditingKey(record.key);
    };

    const handleDelete = (key) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa danh mục này?',
            onOk() {
                const newData = dataSource.filter((item) => item.key !== key);
                setDataSource(newData);
                message.success('Xóa danh mục thành công!');
            },
        });
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            const newData = [...dataSource];
            if (editingKey) {
                const index = newData.findIndex((item) => item.key === editingKey);
                if (index > -1) {
                    newData.splice(index, 1, { ...newData[index], ...values });
                    setDataSource(newData);
                    message.success('Cập nhật danh mục thành công!');
                } else {
                    newData.push({ ...values, key: Date.now().toString(), stt: dataSource.length + 1 });
                    setDataSource(newData);
                    message.success('Thêm mới danh mục thành công!');
                }
            } else {
                newData.push({ ...values, key: Date.now().toString(), stt: dataSource.length + 1 });
                setDataSource(newData);
                message.success('Thêm mới danh mục thành công!');
            }
            setIsModalVisible(false);
            setEditingKey('');
        }).catch((info) => {
            console.log('Validate Failed:', info);
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingKey('');
    };

    return (
        <Card style={{ padding: '20px' }}>
            <Title level={2}>Danh sách danh mục</Title>
            <div className="d-flex justify-content-center gap-5 flex-column">
                <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                    <Col span={16}>
                        <Input
                            placeholder="Nhập vào danh mục mà bạn muốn tìm!"
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={handleSearch}
                            allowClear
                        />
                    </Col>
                    <Col span={8}>
                        <Button type="primary" icon={<PlusOutlined />} block onClick={handleAdd}>
                            Thêm mới
                        </Button>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={dataSource}
                    locale={{
                        emptyText: 'Không có dữ liệu'
                    }}
                />

                <Modal
                    title={editingKey ? "Sửa danh mục" : "Thêm mới danh mục"}
                    visible={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                >
                    <Form
                        form={form}
                        layout="vertical"
                    >
                        <Form.Item
                            label="Danh mục"
                            name="danhMuc"
                            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Ngày tạo"
                            name="ngayTao"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày tạo!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Trạng thái"
                            name="trangThai"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Card>
    );
}

export default Category;