import React, { useEffect, useState, useMemo } from 'react';
import { Space, Table, Input, DatePicker, Select, Card, Button, Modal, Form, message, Col, Row, theme } from 'antd';
import axios from 'axios';
import { baseUrl, convertStatusVoucher } from '../../helpers/Helpers.js';
import useUrlBuilders from './hooks/useURLS.jsx';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import "./StatusSelector.css";
import { render } from 'react-dom';
import { EyeOutlined, EditOutlined, DeleteOutlined, RedoOutlined,PlusOutlined } from '@ant-design/icons';
import {FaEye} from "react-icons/fa6";
import {FaEdit} from "react-icons/fa";
import {COLORS} from "../../constants/constants.js";



const { Option } = Select;

//table
const columns = (handleEdit, handleDelete, handleDetail) => [
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
        title: ' Tên loại phiếu giảm giá',
        dataIndex: 'voucherType',
        key: 'voucherType',
    },
    {
        title: 'Số lượng phiếu giảm giá',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Giá trị giảm giá(VNĐ)',
        dataIndex: 'discountValue',
        key: 'discountValue',
    },
    {
        title: 'Đơn tối thiểu(VNĐ)',
        dataIndex: 'billMinValue',
        key: 'billMinValue',
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
        dataIndex: 'statusVoucher',
        key: 'statusVoucher',
        render: (_, record) => {
            let displayStatus = convertStatusVoucher(record.statusVoucher);
            let color =
                record.statusVoucher === 'dang_kich_hoat' ? '#52c41a' :
                    record.statusVoucher === 'chua_kich_hoat' ? 'orange' :
                        '#FF0033';

            return (
                <div
                    style={{
                        cursor: 'pointer',
                        color: 'white',
                        backgroundColor: color,
                        borderRadius: '10px',
                        textAlign: 'center',
                        padding: '5px 10px',
                        display: 'inline-block',
                    }}
                >
                    {displayStatus}
                </div>
            );
        },
    },
    ,
    {
        title: 'Thao tác',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Button
                    icon={
                        <FaEdit
                            style={{
                                color: `${COLORS.primary}`,
                                // marginRight: 8,
                                fontSize: "1.5rem",
                            }}
                        />
                    }
                    onClick={() => handleEdit(record)}

                >
                </Button>
                {/* <Button
                    icon={<DeleteOutlined />}
                    danger onClick={() => handleDelete(record.id)}></Button> */}

                <Button
                    icon={<FaEye color={"green"} size={20} />}
                     onClick={() => handleDetail(record)}></Button>
            </Space>
        ),
    },
];

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
                    <Form.Item name="voucherCode" label="Mã phiếu giảm giá">
                        <Input placeholder="Nhập mã phiếu giảm giá" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="voucherType" label="Tên phiếu giảm giá">
                        <Input placeholder="Nhập Tên phiếu giảm giá" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="discountValue" label="Giá trị giảm giá (VNĐ)">
                        <Input placeholder="Nhập giá trị giảm" />
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
                    <Form.Item name="statusVoucher" label="Trạng thái">
                        <Select placeholder="Chọn trạng thái">
                            <Option value="dang_kich_hoat">Đang kích hoạt</Option>
                            <Option value="ngung_kich_hoat">Ngừng kích hoạt</Option>
                            <Option value="chua_kich_hoat">Chưa kích hoạt</Option>

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
                        {/* <Button type="primary" htmlType="submit" style={{

                            border: 'none',
                        }}>
                            Lọc
                        </Button> */}
                        <Button
                            icon={<RedoOutlined />}
                            onClick={() => {
                                form.resetFields();
                            }}
                            style={{ color: 'white', borderRadius: '20px', backgroundColor: '#52c41a', borderColor: '#52c41a' }}


                        >

                        </Button>
                        {/* <a
                            style={{ fontSize: 12 }}
                            onClick={() => {
                                setExpand(!expand);
                            }}
                        >
                            <DownOutlined rotate={expand ? 180 : 0} /> {expand ? 'Thu gọn' : 'Mở rộng'}
                        </a> */}
                    </Space>
                </div>
            </Form>
        </Card>
    );
};

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
        const response = await axios.get(`${baseUrl}/api/admin/voucher/page?page=${pagination.page}&size=${pagination.size}`);
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
        setIsDeatil(false)
        setIsEdit(false)
        setEditingVoucher(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingVoucher(record);
        setIsEdit(true)
        setIsModalOpen(true);
        form.setFieldsValue({
            ...record,
            startDate: moment(record.startDate),  // Use moment for startDate
            endDate: moment(record.endDate)       // Use moment for endDate
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseUrl}/api/admin/voucher/delete/${id}`);
            message.success('Xóa phiếu giảm giá thành công!');
            getPageVoucher();  // Fetch updated list
        } catch (error) {
            message.error('Lỗi khi xóa phiếu giảm giá!');
        }
    };
    const [isDetail, setIsDeatil] = useState(false);
    const [isEdit, setIsEdit] = useState(false);


    const handleDetail = (record) => {
        setIsDeatil(true)
        setIsEdit(false)
        setEditingVoucher(record);
        setIsModalOpen(true);
        form.setFieldsValue({
            ...record,
            startDate: moment(record.startDate),  // Use moment for startDate
            endDate: moment(record.endDate)       // Use moment for endDate
        });
        // try {
        //     const response = await axios.get(`${baseUrl}/api/admin/voucher/detail/${id}`);
        //     setDetailVoucher(response.data);  // Lưu thông tin chi tiết
        //     setIsDetailModalOpen(true);  // Mở modal chi tiết
        // } catch (error) {
        //     message.error('Lỗi khi lấy chi tiết phiếu giảm giá!');
        // }
    };

    const handleOk = async () => {
        if (isDetail) {
            setIsModalOpen(false);
            return
        }
        try {
            const value = await form.validateFields(); 
            const values = form.getFieldsValue();
            if (editingVoucher) {
                // Edit existing voucher
                await axios.put(`${baseUrl}/api/admin/voucher/update/${editingVoucher.id}`, values,value);
                message.success('Cập nhật phiếu giảm giá thành công!');
            } else {
                // Add new voucher
                await axios.post(`${baseUrl}/api/admin/voucher/add`, values,value);
                message.success('Thêm mới phiếu giảm giá thành công!');
            }
            getPageVoucher();  // Fetch updated list
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Lỗi khi lưu trữ liệu!',error);
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
    // MÃ THÊM: Xử lý tìm kiếm
    const handleSearch = (values) => {
        console.log('Search Values:', values);
    }
    return (
        <>
            <h4>Bộ lọc </h4>

            {/* MÃ THÊM: Thêm AdvancedSearchForm */}
            <AdvancedSearchForm onSearch={handleSearch} />
            <h4 style={{ paddingTop: '15px' }}>Danh sách phiếu giảm giá</h4>

            <Card>
                <Button type="primary" icon={<PlusOutlined />}
                    onClick={handleAdd} style={{
                        marginBottom: '20px',
                        border: 'none',
                         backgroundColor: '#52c41a'
                    }}>
                    Thêm mới
                </Button>

                <Table
                    columns={columns(handleEdit, handleDelete, handleDetail)}
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
                    title={isEdit ? 'Chỉnh sửa phiếu giảm giá' : (isDetail ? "Chi tiết" : 'Thêm mới phiếu giảm giá')}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Xác nhận"
                    cancelText="Hủy"
                    okButtonProps={{
                        style: {

                            border: 'none',
                            // fontFamily: 'Poppins',
                        },
                    }}
                    cancelButtonProps={{
                        style: {

                            border: 'none',
                            // fontFamily: 'Poppins',
                        },
                    }}
                //màu label={<span style={{ color: '#1A3353', fontFamily: 'Poppins' }}>Mã phiếu giảm giá</span>}

                >
                    <Form form={form} layout="vertical" style={{ font: 'poppins' }}>
                        {/* <Form.Item name="voucherCode" label="Mã đợt giảm giá" rules={[{ required: true,message:'Không được bỏ trống' }]}>
                            <Input disabled={isDetail} />
                        </Form.Item> */}
                        <Form.Item name="voucherType" label="Tên phiếu giảm giá" rules={[{ required: true ,message:'Không được bỏ trống'}]}>
                            <Input placeholder="Nhập tên phiếu giảm giá" />
                        </Form.Item>
                        <Form.Item name="quantity" label="Số lượng đợt giảm giá" rules={[{ required: true ,message:'Không được bỏ trống'}]}>
                            <Input placeholder="Nhập số lượng  giảm giá" />
                        </Form.Item>
                        <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true,message:'Không được bỏ trống' }]}>
                            <Input placeholder="Nhập giá trị giảm giá"     suffix="VNĐ"/>
                        </Form.Item>
                        <Form.Item name="billMinValue" label="Đơn tối thiểu" rules={[{ required: true,message:'Không được bỏ trống' }]}>
                            <Input placeholder="Nhập giá trị giảm giá tối thiểu"     suffix="VNĐ" />
                        </Form.Item>
                        <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true ,message:'Không được bỏ trống'}]}>
                            <DatePicker placeholder="Nhập thời gian" format="DD/MM/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true,message:'Không được bỏ trống' }]}>
                            <DatePicker placeholder="Nhập thời gian"  format="DD/MM/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        {/* <Form.Item name="statusVoucher" label="Trạng thái" rules={[{ required: true }]}>
                            <Select defaultValue={"dang_kich_hoat"}  >
                                <Option value="dang_kich_hoat">Đang kích hoạt</Option>
                                <Option value="ngung_kich_hoat">Ngừng kích hoạt</Option>
                                <Option value="chua_kich_hoat">Chưa kích hoạt</Option>
                            </Select>
                        </Form.Item> */}
                    </Form>
                </Modal>
            </Card>
        </>

    );
};

export default VoucherList;