import React, { useEffect, useMemo, useState } from 'react';
import { Space, Table, Input, DatePicker, Select, Card, Button, Modal, Form, message } from 'antd';
import axios from 'axios';
import { baseUrl } from '../../helpers/Helpers.js';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const columns = (handleEdit, handleDelete) => [
    {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'stt',
        dataIndex: 'id',
        key: 'id',
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
        key: 'startDate',
    },
    {
        title: 'Ngày kết thúc',
        dataIndex: 'endDate',
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

                <Button onClick={() => handleEdit(record.id)}>Chỉnh sửa</Button>
                <Button danger onClick={() => handleDelete(record.id)}>Xóa</Button>
            </Space>
        ),
    },
];

const VoucheList = () => {
    const [voucherData, setVoucherData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingVoucher, setEditingVoucher] = useState(null);

    // const fetchVouchers = async () => {
    //     try {
    //         const response = await axios.get(`${baseUrl}/api/voucher/hien`);
    //         setVoucherData(response.data.data);
    //     } catch (error) {
    //         message.error('Lỗi khi tải danh sách phiếu giảm giá!');
    //     }
    // };

    // useEffect(() => {
    //     fetchVouchers();
    // }, []);

    const handleAdd = () => {
        setEditingVoucher(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingVoucher(record);
        setIsModalOpen(true);
        form.setFieldsValue(record);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseUrl}/api/voucher/delete/${id}`);
            setPagination({...pagination, page: 0})
            getPageVoucher();
            message.success('Xóa phiếu giảm giá thành công!');

        } catch (error) {
            message.error('Lỗi khi xóa phiếu giảm giá!');
        }
    };

    const handleOk = async () => {
        try {
            const values = form.getFieldsValue();
            if (editingVoucher) {
                // Sửa
                await axios.put(`${baseUrl}/api/voucher/update/${editingVoucher.id}`, values);
                message.success('Cập nhật phiếu giảm giá thành công!');
            } else {
                // Thêm
                await axios.post(`${baseUrl}/api/voucher/add`, values);
                message.success('Thêm mới phiếu giảm giá thành công!');
            }
            getPageVoucher();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Lỗi khi lưu trữ liệu!');
        }
    };
    //phân 
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    const [pagination, setPagination] = useState({
        page: 0,
        size: 5,
        total: 7
    })
    function handleOnChangeTable(paginationTable) {
        setPagination({
            ...pagination,
            page: paginationTable.current - 1, // Trang hiện tại
            size: paginationTable.pageSize, // Số mục mỗi trang
        });
    }




    useEffect(() => {
        getPageVoucher()
    }, [pagination]);

    const getPageVoucher = async () => {
        const response = await axios.get(`${baseUrl}/api/voucher/page?page=${pagination.page}&size=${pagination.size}`);
        const data = response.data.data;
        setVoucherData(data.content);
        // Chỉ cập nhật pagination nếu có thay đổi trong dữ liệu
        const newPagination = {
            page: data.number,
            size: data.size,
            total: data.totalElements
        };
        console.log("new ", newPagination);
        
        // Kiểm tra xem pagination có thay đổi hay không trước khi set lại
        if (
            pagination.page !== newPagination.page ||
            pagination.size !== newPagination.size ||
            pagination.total !== newPagination.total
        ) {
            setPagination(newPagination);
        }
    };
    return (
        <Card>
            <h4>Danh sách phiếu giảm giá</h4>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: '20px' }}>
+            </Button>
            <Table columns={columns(handleEdit, handleDelete)} dataSource={voucherData} rowKey="id"
               pagination={{
                current: pagination.page  +  1,
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
                        <DatePicker format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
                        <DatePicker format="DD/MM/YYYY" />
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

export default VoucheList;
