import React, { useEffect, useState } from 'react';
import { Space, Table, Input, DatePicker, Select, Card, Button, Modal, Form, message, Row, Col, theme } from 'antd';
import axios from 'axios';
import { baseUrl } from '../../helpers/Helpers.js';
import moment from 'moment';
import { Link } from 'react-router-dom';
const { Search } = Input;
const { Option } = Select;

const columns = (handleEdit, handleDelete) => [
    {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'Mã đợt giảm giá',
        dataIndex: 'promotionCode',
        key: 'promotionCode',
    },
    {
        title: 'Tên đợt giảm giá',
        dataIndex: 'promotionName',
        key: 'promotionName',
    },
    {
        title: 'Loại đợt giảm giá',
        dataIndex: 'promotionType',
        key: 'promotionType',
    },
    {
        title: 'Giá trị giảm(%)',
        dataIndex: 'discountValue',
        key: 'discountValue',
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
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
                <Button style={{
                    backgroundColor: '#80C4E9',
                    color: 'white',
                    border: 'none',
                }} onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
                <Button style={{
                    backgroundColor: '#80C4E9',
                    color: 'white',
                    border: 'none',
                }} danger onClick={() => handleDelete(record.id)}>Xóa</Button>
            </Space>
        ),
    },
];
// MÃ THÊM: Advanced Search Form
const AdvancedSearchForm = ({ onSearch }) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [expand, setExpand] = useState(false);

    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,

    };

    const getFields = () => {

        return (
            <>
                <Col span={8}>
                    <Form.Item name="promotionCode" label="Mã đợt giảm giá">
                        <Input placeholder="Nhập mã đợt giảm giá" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="promotionName" label="Tên đợt giảm giá">
                        <Input placeholder="Nhập tên đợt giảm giá" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="promotionType" label="Loại đợt giảm giá">
                        <Input placeholder="Nhập đợt loại  giảm" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="discountValue" label="Giá trị giảm">
                        <Input placeholder="Nhập giá trị giảm" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="quantity" label="Số lượng">
                        <Input placeholder="Nhập số lượng" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="startDate" label="Ngày bắt đầu">
                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="endDate" label="Ngày kết thúc">
                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="status" label="Trạng thái">
                        <Select placeholder="Chọn trạng thái">
                            <Option value="HOAT_DONG">Hoạt động</Option>
                            <Option value="NGUNG_HOAT_DONG">Tạm ngưng</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </>
        );
    };

    const onFinish = (values) => {
        onSearch(values);
    };
    return (
        <Card >
            <Form form={form} name="advanced_search" style={{ formStyle }}
                onFinish={onFinish} layout="vertical">
                <Row gutter={24}>{getFields()}</Row>
                <div style={{ textAlign: 'right' }}>
                    <Space size="small">
                        <Button type="primary" htmlType="submit" style={{
                            backgroundColor: '#80C4E9',
                            color: 'white',
                            border: 'none',
                        }}>
                            Lọc
                        </Button>
                        <Button
                            onClick={() => {
                                form.resetFields();
                            }}
                            style={{
                                backgroundColor: '#80C4E9',
                                color: 'white',
                                border: 'none',
                            }}
                        >
                            Xóa
                        </Button>
                    </Space>
                </div>
            </Form>
        </Card>
    );
};



const PromotionList = () => {
    const [promotionData, setPromotionData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingPromotion, setEditingPromotion] = useState(null);

    const [pagination, setPagination] = useState({
        page: 0,
        size: 5,
        total: 7
    });

    // Hàm phân trang
    function handleOnChangeTable(paginationTable) {
        setPagination({
            ...pagination,
            page: paginationTable.current - 1, // Trang hiện tại
            size: paginationTable.pageSize, // Số mục mỗi trang
        });
    }

    // Hàm khi ấn nút "Thêm"
    // const handleAdd = () => {
    //     setEditingPromotion(null);
    //     setIsModalOpen(true);
    // };

    // Hàm khi ấn nút "Chỉnh sửa"
    const handleEdit = (record) => {
        setEditingPromotion(record);
        setIsModalOpen(true);
        form.setFieldsValue({
            ...record,
            startDate: moment(record.startDate), // Sử dụng moment cho startDate
            endDate: moment(record.endDate) // Sử dụng moment cho endDate
        });
    };

    // Hàm khi ấn nút "Xóa"
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseUrl}/api/admin/promotion/delete/${id}`);
            message.success('Xóa đợt giảm giá thành công!');
        } catch (error) {
            message.error('Lỗi khi xóa đợt giảm giá!');
        }
    };

    // Hàm khi ấn nút "OK" trong Modal
    const handleOk = async () => {
        try {
            const values = form.getFieldsValue();
            if (editingPromotion) {
                // Cập nhật dữ liệu
                await axios.put(`${baseUrl}/api/admin/promotion/update/${editingPromotion.id}`, values);
                message.success('Cập nhật đợt giảm giá thành công!');
            } 
            getPagePromotion();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Lỗi khi lưu trữ liệu!');
        }
    };

    // Hàm khi ấn nút "Hủy" trong Modal
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    // Hàm lấy dữ liệu phân trang
    useEffect(() => {
        getPagePromotion();
    }, [pagination]);

    // Hàm lấy trang dữ liệu khuyến mãi
    const getPagePromotion = async () => {
        const response = await axios.get(`${baseUrl}/api/admin/promotion/page?page=${pagination.page}&size=${pagination.size}`);
        const data = response.data.data;
        const items = data.content.map((el) => {
            el.startDate = new Date(el.startDate);
            el.endDate = new Date(el.endDate);
            return el;
        });
        setPromotionData(items);

        // Cập nhật pagination nếu có thay đổi trong dữ liệu
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


    // MÃ THÊM: Xử lý tìm kiếm
    const handleSearch = (values) => {

        console.log('Search Values:', values);
    }
    return (

        <>
            <h4>Bộ lọc </h4>

            {/* MÃ THÊM: Thêm AdvancedSearchForm */}
            <AdvancedSearchForm onSearch={handleSearch} />
            <h4 style={{ paddingTop: '15px' }}>Danh sách đợt giảm giá</h4>

            <Card>
                <Link to={"/admin/promotion/add"} >
                    <Button type="primary"
                     style={{
                        marginBottom: '20px', backgroundColor: '#80C4E9',
                        color: 'white',
                        border: 'none',
                    }}>
                        Thêm mới
                    </Button>
                </Link>



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
                    okText="Xác nhận"
                    cancelText="Hủy"
                    okButtonProps={{
                        style: {
                            backgroundColor: '#80C4E9',
                            color: 'white',
                            border: 'none',
                            // fontFamily: 'Poppins',
                        },
                    }}
                    cancelButtonProps={{
                        style: {
                            backgroundColor: '#80C4E9',
                            color: 'white',
                            border: 'none',
                            // fontFamily: 'Poppins',
                        },
                    }}
                //màu label={<span style={{ color: '#1A3353', fontFamily: 'Poppins' }}>Mã phiếu giảm giá</span>}

                >
                    <Form form={form} layout="vertical"  >
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
                        <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
                            <DatePicker format="DD/MM/YYYY"  style={{ width: '100%' }}/>
                        </Form.Item>
                        <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
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
        </>
    );
};

export default PromotionList;
