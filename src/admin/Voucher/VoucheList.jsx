import React, { useEffect, useState } from 'react';
import { Space, Table, Input, DatePicker, Select, Card, Button, Modal, Form, message } from 'antd';
import axios from 'axios';
import { baseUrl } from '../../helpers/Helpers.js';
import moment from 'moment';

const { Option } = Select;

const columns = (handleEdit, handleDelete) => [
    {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'Mã phiếu giảm giá',
        dataIndex: 'voucherCode',
        key: 'voucherCode',
    },
    {
        title: 'Loại phiếu giảm giá',
        dataIndex: 'voucherType',
        key: 'voucherType',
    },
    {
        title: 'Giá trị giảm giá(%)',
        dataIndex: 'discountValue',
        key: 'discountValue',
    },
    {
        title: 'Ngày bắt đầu',
        dataIndex: 'startDate',
        render: (text) => new Date(text).toLocaleDateString(),
        key: 'startDate',
    },
    {
        title: 'Ngày kết thúc',
        dataIndex: 'endDate',
        render: (text) => new Date(text).toLocaleDateString(),
        key: 'endDate',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Thao tác',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Button onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
                <Button danger onClick={() => handleDelete(record.id)}>Xóa</Button>
            </Space>
        ),
    },
];

const VoucherList = () => {
    const [voucherData, setVoucherData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingVoucher, setEditingVoucher] = useState(null);

    const [pagination, setPagination] = useState({
        page: 0,
        size: 5,
        total: 7
    });

    // Fetching voucher data (you may want to keep this if it's not commented out)
    useEffect(() => {
        getPageVoucher();
    }, [pagination]);

    const getPageVoucher = async () => {
        const response = await axios.get(`${baseUrl}/api/voucher/page?page=${pagination.page}&size=${pagination.size}`);
        const data = response.data.data;

        const items = data.content.map((el) => {
            el.startDate = new Date(el.startDate);
            el.endDate = new Date(el.endDate);
            return el;
        });
        setVoucherData(items);

        const newPagination = {
            page: data.number,
            size: data.size,
            total: data.totalElements
        };

        // Update pagination only if there's a change
        if (
            pagination.page !== newPagination.page ||
            pagination.size !== newPagination.size ||
            pagination.total !== newPagination.total
        ) {
            setPagination(newPagination);
        }
    };

    const handleAdd = () => {
        setEditingVoucher(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingVoucher(record);
        setIsModalOpen(true);
        form.setFieldsValue({
            ...record,
            startDate: moment(record.startDate),  // Use moment for startDate
            endDate: moment(record.endDate)       // Use moment for endDate
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseUrl}/api/voucher/delete/${id}`);
            message.success('Xóa phiếu giảm giá thành công!');
            getPageVoucher();  // Fetch updated list
        } catch (error) {
            message.error('Lỗi khi xóa phiếu giảm giá!');
        }
    };

    const handleOk = async () => {
        try {
            const values = form.getFieldsValue();
            if (editingVoucher) {
                // Edit existing voucher
                await axios.put(`${baseUrl}/api/voucher/update/${editingVoucher.id}`, values);
                message.success('Cập nhật phiếu giảm giá thành công!');
            } else {
                // Add new voucher
                await axios.post(`${baseUrl}/api/voucher/add`, values);
                message.success('Thêm mới phiếu giảm giá thành công!');
            }
            getPageVoucher();  // Fetch updated list
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Lỗi khi lưu trữ liệu!');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleOnChangeTable = (paginationTable) => {
        setPagination({
            ...pagination,
            page: paginationTable.current - 1, // Update current page
            size: paginationTable.pageSize, // Update page size
        });
    };

    return (
        <Card>
            <h4>Danh sách phiếu giảm giá</h4>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: '20px' }}>
                Thêm mới
            </Button>
            <Table
                columns={columns(handleEdit, handleDelete)}
                dataSource={voucherData}
                rowKey="id"
                pagination={{
                    current: pagination.page + 1,
                    pageSize: pagination.size,
                    total: pagination.total
                }}
                onChange={handleOnChangeTable}
            />
            <Modal
                title={editingVoucher ? 'Chỉnh sửa phiếu giảm giá' : 'Thêm mới phiếu giảm giá'}
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="voucherCode" label="Mã phiếu giảm giá" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="voucherType" label="Loại phiếu giảm giá" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="discountValue" label="Giá trị giảm giá" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
                        <DatePicker value={editingVoucher ? moment(editingVoucher.startDate) : null} />
                    </Form.Item>
                    <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
                        <DatePicker value={editingVoucher ? moment(editingVoucher.endDate) : null} />
                    </Form.Item>
                    <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                        <Select>
                            <Option value="HOAT_DONG">Hoạt động</Option>
                            <Option value="NGUNG_HOAT_DONG">Tạm ngưng</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default VoucherList;
