// import React, { useEffect, useState } from 'react';
// import { Space, Table, Input, DatePicker, Select, Card, Button, Modal, Form, message, Col, Row, theme } from 'antd';
// import axios from 'axios';
// import { baseUrl } from '../../helpers/Helpers.js';
// import moment from 'moment';
// import { DownOutlined } from '@ant-design/icons';

// const { Option } = Select;

// //table
// const columns = (handleEdit, handleDelete, handleDetail) => [
//     {
//         title: 'STT',
//         dataIndex: 'stt',
//         key: 'stt',
//         render: (text, record, index) => index + 1,
//     },
//     {
//         title: 'Mã phiếu giảm giá',
//         dataIndex: 'voucherCode',
//         key: 'voucherCode',
//     },
//     {
//         title: 'Loại phiếu giảm giá',
//         dataIndex: 'voucherType',
//         key: 'voucherType',
//     },
//     {
//         title: 'Giá trị giảm giá(%)',
//         dataIndex: 'discountValue',
//         key: 'discountValue',
//     },
//     {
//         title: 'Ngày bắt đầu',
//         dataIndex: 'startDate',
//         render: (text) => new Date(text).toLocaleDateString(),
//         key: 'startDate',
//     },
//     {
//         title: 'Ngày kết thúc',
//         dataIndex: 'endDate',
//         render: (text) => new Date(text).toLocaleDateString(),
//         key: 'endDate',
//     },
//     {
//         title: 'Trạng thái',
//         dataIndex: 'status',
//         key: 'status',
//     },
//     {
//         title: 'Thao tác',
//         key: 'action',
//         render: (_, record) => (
//             <Space size="middle">
//                 <Button style={{
//                     backgroundColor: '#80C4E9',
//                     color: 'white',
//                     border: 'none',
//                 }} onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
//                 <Button style={{
//                     backgroundColor: '#80C4E9',
//                     color: 'white',
//                     border: 'none',
//                 }} danger onClick={() => handleDelete(record.id)}>Xóa</Button>
//                 <Button style={{
//                     backgroundColor: '#80C4E9',
//                     color: 'white',
//                     border: 'none',
//                 }} danger onClick={() => handleDetail(record)}>...</Button>
//             </Space>
//         ),
//     },
// ];
// // MÃ THÊM: Advanced Search Form
// const AdvancedSearchForm = ({ onSearch }) => {
//     const { token } = theme.useToken();
//     const [form] = Form.useForm();
//     const [expand, setExpand] = useState(false);

//     const formStyle = {
//         maxWidth: 'none',
//         background: token.colorFillAlter,
//         borderRadius: token.borderRadiusLG,
//         padding: 24,

//     };

//     const getFields = () => {

//         return (
//             <>
//                 <Col span={8}>
//                     <Form.Item name="voucherCode" label="Mã phiếu giảm giá">
//                         <Input placeholder="Nhập mã phiếu giảm giá" />
//                     </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                     <Form.Item name="voucherType" label="Loại phiếu giảm giá">
//                         <Input placeholder="Nhập loại phiếu giảm giá" />
//                     </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                     <Form.Item name="discountValue" label="Giá trị giảm giá (%)">
//                         <Input placeholder="Nhập giá trị giảm" />
//                     </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                     <Form.Item name="startDate" label="Ngày bắt đầu">
//                         <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
//                     </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                     <Form.Item name="endDate" label="Ngày kết thúc">
//                         <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
//                     </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                     <Form.Item name="status" label="Trạng thái">
//                         <Select placeholder="Chọn trạng thái">
//                             <Option value="HOAT_DONG">Hoạt động</Option>
//                             <Option value="NGUNG_HOAT_DONG">Tạm ngưng</Option>
//                         </Select>
//                     </Form.Item>
//                 </Col>
//             </>
//         );
//     };

//     const onFinish = (values) => {
//         onSearch(values);
//     };
//     return (
//         <Card >
//             <Form form={form} name="advanced_search" style={{ formStyle }}
//                 onFinish={onFinish} layout="vertical">
//                 <Row gutter={24}>{getFields()}</Row>
//                 <div style={{ textAlign: 'right' }}>
//                     <Space size="small">
//                         <Button type="primary" htmlType="submit" style={{
//                             backgroundColor: '#80C4E9',
//                             color: 'white',
//                             border: 'none',
//                         }}>
//                             Lọc
//                         </Button>
//                         <Button
//                             onClick={() => {
//                                 form.resetFields();
//                             }}
//                             style={{
//                                 backgroundColor: '#80C4E9',
//                                 color: 'white',
//                                 border: 'none',
//                             }}
//                         >
//                             Xóa
//                         </Button>
//                         {/* <a
//                             style={{ fontSize: 12 }}
//                             onClick={() => {
//                                 setExpand(!expand);
//                             }}
//                         >
//                             <DownOutlined rotate={expand ? 180 : 0} /> {expand ? 'Thu gọn' : 'Mở rộng'}
//                         </a> */}
//                     </Space>
//                 </div>
//             </Form>
//         </Card>
//     );
// };

// const VoucherList = () => {
//     const [voucherData, setVoucherData] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [form] = Form.useForm();
//     const [editingVoucher, setEditingVoucher] = useState(null);

//     const [pagination, setPagination] = useState({
//         page: 0,
//         size: 5,
//         total: 7
//     });

//     // Fetching voucher data (you may want to keep this if it's not commented out)
//     useEffect(() => {
//         getPageVoucher();
//     }, [pagination]);

//     const getPageVoucher = async () => {
//         const response = await axios.get(`${baseUrl}/api/admin/voucher/page?page=${pagination.page}&size=${pagination.size}`);
//         const data = response.data.data;

//         const items = data.content.map((el) => {
//             el.startDate = new Date(el.startDate);
//             el.endDate = new Date(el.endDate);
//             return el;
//         });
//         setVoucherData(items);

//         const newPagination = {
//             page: data.number,
//             size: data.size,
//             total: data.totalElements
//         };

//         // Update pagination only if there's a change
//         if (
//             pagination.page !== newPagination.page ||
//             pagination.size !== newPagination.size ||
//             pagination.total !== newPagination.total
//         ) {
//             setPagination(newPagination);
//         }
//     };

//     const handleAdd = () => {
//         setIsDeatil(false)
//         setIsEdit(false)
//         setEditingVoucher(null);
//         setIsModalOpen(true);
//     };

//     const handleEdit = (record) => {
//         setEditingVoucher(record);
//         setIsEdit(true)
//         setIsModalOpen(true);
//         form.setFieldsValue({
//             ...record,
//             startDate: moment(record.startDate),  // Use moment for startDate
//             endDate: moment(record.endDate)       // Use moment for endDate
//         });
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`${baseUrl}/api/admin/voucher/delete/${id}`);
//             message.success('Xóa phiếu giảm giá thành công!');
//             getPageVoucher();  // Fetch updated list
//         } catch (error) {
//             message.error('Lỗi khi xóa phiếu giảm giá!');
//         }
//     };
//     const [isDetail, setIsDeatil] = useState(false);
//     const [isEdit, setIsEdit] = useState(false);


//     const handleDetail = (record) => {
//         setIsDeatil(true)
//         setIsEdit(false)
//         setEditingVoucher(record);
//         setIsModalOpen(true);
//         form.setFieldsValue({
//             ...record,
//             startDate: moment(record.startDate),  // Use moment for startDate
//             endDate: moment(record.endDate)       // Use moment for endDate
//         });
//         // try {
//         //     const response = await axios.get(`${baseUrl}/api/admin/voucher/detail/${id}`);
//         //     setDetailVoucher(response.data);  // Lưu thông tin chi tiết
//         //     setIsDetailModalOpen(true);  // Mở modal chi tiết
//         // } catch (error) {
//         //     message.error('Lỗi khi lấy chi tiết phiếu giảm giá!');
//         // }
//     };

//     const handleOk = async () => {
//         if(isDetail) {
//             setIsModalOpen(false);
//             return
//         }
//         try {
//             const values = form.getFieldsValue();
//             if (editingVoucher) {
//                 // Edit existing voucher
//                 await axios.put(`${baseUrl}/api/admin/voucher/update/${editingVoucher.id}`, values);
//                 message.success('Cập nhật phiếu giảm giá thành công!');
//             } else {
//                 // Add new voucher
//                 await axios.post(`${baseUrl}/api/admin/voucher/add`, values);
//                 message.success('Thêm mới phiếu giảm giá thành công!');
//             }
//             getPageVoucher();  // Fetch updated list
//             setIsModalOpen(false);
//             form.resetFields();
//         } catch (error) {
//             message.error('Lỗi khi lưu trữ liệu!');
//         }
//     };

//     const handleCancel = () => {
//         setIsModalOpen(false);
//         form.resetFields();
//     };

//     const handleOnChangeTable = (paginationTable) => {
//         setPagination({
//             ...pagination,
//             page: paginationTable.current - 1, // Update current page
//             size: paginationTable.pageSize, // Update page size
//         });
//     };
//     // MÃ THÊM: Xử lý tìm kiếm
//     const handleSearch = (values) => {
//         console.log('Search Values:', values);
//     }
//     return (
//         <>
//             <h4>Bộ lọc </h4>

//             {/* MÃ THÊM: Thêm AdvancedSearchForm */}
//             <AdvancedSearchForm onSearch={handleSearch} />
//             <h4 style={{ paddingTop: '15px' }}>Danh sách phiếu giảm giá</h4>

//             <Card>
//                 <Button type="primary" onClick={handleAdd} style={{
//                     marginBottom: '20px', backgroundColor: '#80C4E9',
//                     color: 'white',
//                     border: 'none',
//                 }}>
//                     Thêm mới
//                 </Button>

//                 <Table
//                     columns={columns(handleEdit, handleDelete, handleDetail)}
//                     dataSource={voucherData}
//                     rowKey="id"
//                     pagination={{
//                         current: pagination.page + 1,
//                         pageSize: pagination.size,
//                         total: pagination.total
//                     }}
//                     onChange={handleOnChangeTable}

//                 />
//                 <Modal
//                     title={isEdit ? 'Chỉnh sửa phiếu giảm giá' : (isDetail ? "Chi tiết"  : 'Thêm mới phiếu giảm giá')}
//                     open={isModalOpen}
//                     onOk={handleOk}
//                     onCancel={handleCancel}
//                     okText="Xác nhận"
//                     cancelText="Hủy"
//                     okButtonProps={{
//                         style: {
//                             backgroundColor: '#80C4E9',
//                             color: 'white',
//                             border: 'none',
//                             // fontFamily: 'Poppins',
//                         },
//                     }}
//                     cancelButtonProps={{
//                         style: {
//                             backgroundColor: '#80C4E9',
//                             color: 'white',
//                             border: 'none',
//                             // fontFamily: 'Poppins',
//                         },
//                     }}
//                 //màu label={<span style={{ color: '#1A3353', fontFamily: 'Poppins' }}>Mã phiếu giảm giá</span>}

//                 >
//                     <Form form={form} layout="vertical" style={{ font: 'poppins' }}>
//                         <Form.Item name="voucherCode" label="Mã đợt giảm giá" rules={[{ required: true }]}>
//                             <Input disabled={isDetail} />
//                         </Form.Item>
//                         <Form.Item name="voucherType" label="Tên đợt giảm giá" rules={[{ required: true }]}>
//                             <Input />
//                         </Form.Item>
//                         <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true }]}>
//                             <Input />
//                         </Form.Item>
//                         <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
//                             <DatePicker format="DD/MM/YYYY" />
//                         </Form.Item>
//                         <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
//                             <DatePicker format="DD/MM/YYYY" />
//                         </Form.Item>
//                         <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
//                             <Select>
//                                 <Option value="HOAT_DONG">Hoạt động</Option>
//                                 <Option value="NGUNG_HOAT_DONG">Tạm ngưng</Option>
//                             </Select>
//                         </Form.Item>
//                     </Form>
//                 </Modal>

                
//             </Card>
//         </>

//     );
// };

// export default VoucherList;






import React, { useEffect, useState } from 'react';
import { Space, Table, Input, DatePicker, Select, Card, Button, Modal, Form, message, Col, Row, theme } from 'antd';
import axios from 'axios';
import { baseUrl } from '../../helpers/Helpers.js';
import moment from 'moment';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

// Table columns
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
        title: 'Loại phiếu giảm giá',
        dataIndex: 'voucherType',
        key: 'voucherType',
    },
    {
        title: 'Giá trị giảm giá (%)',
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
        render: (text) => (
            <Button
                type={text === 'Kích hoạt' ? 'primary' : 'default'}
                disabled
                style={{
                    borderRadius: '20px',
                    padding: '6px 12px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    backgroundColor: text === 'HOAT_DONG' ? '#4CAF50' : '#f44336',
                    color: 'white'
                }}
            >
                {text}
            </Button>
        ),
    },
    {
        title: 'Thao tác',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Button
                    type="primary"
                    icon={<EditOutlined  />}
                    onClick={() => handleEdit(record)}
                    style={{ borderRadius: '20px', backgroundColor: '#1890ff', color: 'white' }}

                />
                <Button
                    type="danger"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record.id)}
                    style={{ borderRadius: '20px', color:"#FF0000", border: '1px solid red'}}

                />
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => handleDetail(record)}
                    style={{ borderRadius: '20px', backgroundColor: '#52c41a',color:'white'}}

                />
            </Space>
        ),
    },
];

// Advanced Search Form
const AdvancedSearchForm = ({ onSearch }) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const getFields = () => (
        <>
            <Col span={8}>
                <Form.Item name="voucherCode" label="Mã phiếu giảm giá">
                    <Input placeholder="Nhập mã phiếu giảm giá" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name="voucherType" label="Loại phiếu giảm giá">
                    <Input placeholder="Nhập loại phiếu giảm giá" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name="discountValue" label="Giá trị giảm giá (%)">
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
                <Form.Item name="status" label="Trạng thái">
                    <Select placeholder="Chọn trạng thái">
                        <Option value="HOAT_DONG">Hoạt động</Option>
                        <Option value="NGUNG_HOAT_DONG">Tạm ngưng</Option>
                    </Select>
                </Form.Item>
            </Col>
        </>
    );

    const onFinish = (values) => {
        onSearch(values);
    };

    return (
        <Card>
            <Form form={form} name="advanced_search" onFinish={onFinish} layout="vertical">
                <Row gutter={24}>{getFields()}</Row>
                <div style={{ textAlign: 'right' }}>
                    <Space size="small">
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SearchOutlined />}
                            style={{
                                backgroundColor: '#4096FF',
                                color: 'white',
                                border: 'none',
                            }}
                        >
                            Lọc
                        </Button>
                        <Button
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                form.resetFields();
                            }}
                            style={{
                                backgroundColor: '#ff4d4f',
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

// Main component
const VoucherList = () => {
    const [voucherData, setVoucherData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [pagination, setPagination] = useState({ page: 0, size: 5, total: 7 });
    const [isDetail, setIsDeatil] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        getPageVoucher();
    }, [pagination]);

    const getPageVoucher = async () => {
        const response = await axios.get(`${baseUrl}/api/admin/voucher/page?page=${pagination.page}&size=${pagination.size}`);
        const data = response.data.data;

        const items = data.content.map((el) => ({
            ...el,
            startDate: new Date(el.startDate),
            endDate: new Date(el.endDate),
        }));
        setVoucherData(items);

        setPagination({
            page: data.number,
            size: data.size,
            total: data.totalElements,
        });
    };

    const handleAdd = () => {
        setIsDeatil(false);
        setIsEdit(false);
        setEditingVoucher(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingVoucher(record);
        setIsEdit(true);
        setIsModalOpen(true);
        form.setFieldsValue({
            ...record,
            startDate: moment(record.startDate),
            endDate: moment(record.endDate),
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseUrl}/api/admin/voucher/delete/${id}`);
            message.success('Xóa phiếu giảm giá thành công!');
            getPageVoucher();
        } catch {
            message.error('Lỗi khi xóa phiếu giảm giá!');
        }
    };

    const handleDetail = (record) => {
        setIsDeatil(true);
        setEditingVoucher(record);
        setIsModalOpen(true);
        form.setFieldsValue({
            ...record,
            startDate: moment(record.startDate),
            endDate: moment(record.endDate),
        });
    };

    const handleOk = async () => {
        if (isDetail) {
            setIsModalOpen(false);
            return;
        }
        try {
            const values = form.getFieldsValue();
            if (editingVoucher) {
                await axios.put(`${baseUrl}/api/admin/voucher/update/${editingVoucher.id}`, values);
                message.success('Cập nhật phiếu giảm giá thành công!');
            } else {
                await axios.post(`${baseUrl}/api/admin/voucher/add`, values);
                message.success('Thêm mới phiếu giảm giá thành công!');
            }
            getPageVoucher();
            setIsModalOpen(false);
            form.resetFields();
        } catch {
            message.error('Lỗi khi lưu dữ liệu!');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleOnChangeTable = (paginationTable) => {
        setPagination({
            ...pagination,
            page: paginationTable.current - 1,
            size: paginationTable.pageSize,
        });
    };

    const handleSearch = (values) => {
        console.log('Search Values:', values);
    };

    return (
        <>
            <h4>Bộ lọc</h4>
            <AdvancedSearchForm onSearch={handleSearch} />
            <h4 style={{ paddingTop: '15px' }}>Danh sách phiếu giảm giá</h4>
            <Card>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    style={{
                        marginBottom: '20px',
                        backgroundColor: '#4096FF',
                        color: 'white',
                        border: 'none',
                    }}
                >
                    Thêm mới
                </Button>
                <Table
                    columns={columns(handleEdit, handleDelete, handleDetail)}
                    dataSource={voucherData}
                    rowKey="id"
                    pagination={{
                        current: pagination.page + 1,
                        pageSize: pagination.size,
                        total: pagination.total,
                    }}
                    onChange={handleOnChangeTable}
                />
                <Modal
                    title={
                        isEdit ? (
                            <>
                                <EditOutlined /> Chỉnh sửa phiếu giảm giá
                            </>
                        ) : isDetail ? (
                            <>
                                <EyeOutlined /> Chi tiết phiếu giảm giá
                            </>
                        ) : (
                            <>
                                <PlusOutlined /> Thêm mới phiếu giảm giá
                            </>
                        )
                    }
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Xác nhận"
                    cancelText="Hủy"
                    okButtonProps={{
                        style: { backgroundColor: '#80C4E9', color: 'white', border: 'none' },
                    }}
                    cancelButtonProps={{
                        style: { backgroundColor: '#80C4E9', color: 'white', border: 'none' },
                    }}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="voucherCode" label="Mã phiếu giảm giá" rules={[{ required: true }]}>
                            <Input disabled={isDetail} />
                        </Form.Item>
                        <Form.Item name="voucherType" label="Loại phiếu giảm giá" rules={[{ required: true }]}>
                            <Input disabled={isDetail} />
                        </Form.Item>
                        <Form.Item name="discountValue" label="Giá trị giảm giá (%)" rules={[{ required: true }]}>
                            <Input disabled={isDetail} />
                        </Form.Item>
                        <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
                            <DatePicker format="DD/MM/YYYY" disabled={isDetail} />
                        </Form.Item>
                        <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
                            <DatePicker format="DD/MM/YYYY" disabled={isDetail} />
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                            <Select disabled={isDetail}>
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

export default VoucherList;
