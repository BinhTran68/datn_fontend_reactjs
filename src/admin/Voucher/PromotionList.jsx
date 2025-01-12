import React, { useEffect, useState } from 'react';
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
        title: 'Mã phiếu giảm giá',
        dataIndex: 'promotionCode',
        key: 'promotionCode',
    },
    {
        title: 'Tên phiếu giảm giá',
        dataIndex: 'promotionName',
        key: 'promotionName',
    },
    {
        title: 'Loại giảm giá',
        dataIndex: 'promotionType',
        key: 'promotionType',
    },
    {
        title: 'Giá trị giảm',
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

const data = [
    {
        key: '1',
        ten: 'Giảm giá tháng 12',
        ma: 'Đợt 1',
        hinhthuc: 'trực tiếp vào sản phẩm',
        giatrigiam: '10%',
        giatritt: '100k',
        giatritd: '300k',
        ngaybatdau: '12/12/2024',
        ngayketthuc: '31/12/2024',
        trangthai: 'Hoạt động',


    },

];

const PromotionList = () => {
    const [promotionData, setPromotionData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingPromotion, setEditingPromotion] = useState(null);

    // const onSearch = (value) => {
    //     console.log('Search value:', value);
    // };

    // const handleDateChange = (dates, dateStrings) => {
    //     console.log('Selected dates:', dates);
    //     console.log('Formatted dates:', dateStrings);
    //     setDates(dateStrings);
    // };

    // const handleStatusChange = (value) => {
    //     console.log('Selected status:', value);
    //     setStatus(value);
    // };
    // const defaultUrl = `${baseUrl}/api/promotion/hien`;
    // const [activeTab, setActiveTab] = useState('all');
    // const [url, setUrl] = useState(defaultUrl);

    // useEffect(() => {
    //     console.log("promotion");
    //     getPromotion();
    // }, [url]);
    // const getPromotion = async () => {
    //     const response = await axios.get(url)
    //     setPromotionData(response.data.data)
    // }
    const handleAdd = () => {
        setEditingPromotion(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingPromotion(record);
        setIsModalOpen(true);
        form.setFieldsValue(record);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseUrl}/api/promotion/delete/${id}`);
            message.success('Xóa đợt giảm giá thành công!');

        } catch (error) {
            message.error('Lỗi khi xóa đợt giảm giá!');
        }
    };

    const handleOk = async () => {
        try {
            const values = form.getFieldsValue();
            if (editingPromotion) {
                // Sửa
                await axios.put(`${baseUrl}/api/promotion/update/${editingPromotion.id}`, values);
                message.success('Cập nhật đợt giảm giá thành công!');
            } else {
                // Thêm 
                await axios.post(`${baseUrl}/api/promotion/add`, values);
                message.success('Thêm mới phiếu giảm giá thành công!');
            }
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Lỗi khi lưu trữ liệu!');
        }
    };
    //phân trang
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    const [pagination, setPagination] = useState({
        page: 0,
        size: 1,
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
        getPagePromotion()
    }, [pagination]);

    const getPagePromotion = async () => {
        const response = await axios.get(`${baseUrl}/api/promotion/page?page=${pagination.page}&size=${pagination.size}`);
        const data = response.data.data;
        setPromotionData(data.content);


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
            <h4>Danh sách đợt giảm giá</h4>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: '20px' }}>
                +
            </Button>


            <Table columns={columns(handleEdit, handleDelete)} dataSource={promotionData} rowKey="id"
                pagination={{
                    current: pagination.page + 1,
                    pageSize: pagination.size,
                    total: pagination.total
                }}
                onChange={handleOnChangeTable}
            />
            <Modal
                            title={editingPromotion ? 'Chỉnh sửa đợt giảm giá' : 'Thêm mới đợt giảm giá'}
                            visible={isModalOpen}
                            onOk={handleOk}
                            onCancel={handleCancel}
                        >
                            <Form form={form} layout="vertical">
                                <Form.Item name="promotionCode" label="Mã đợt giảm giá" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="promotionName" label="Tên đợt giảm giá" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="promotionType" label="Loại đợt giảm giá" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true }]}>
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

export default PromotionList;
