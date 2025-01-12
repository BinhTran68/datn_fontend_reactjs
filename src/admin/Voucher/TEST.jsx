// import React, { useEffect, useState } from 'react';
// import { Space, Table, Input, DatePicker, Select, Card, Button, Modal, Form, message } from 'antd';
// import axios from 'axios';
// import { baseUrl } from '../../helpers/Helpers.js';

// const { Search } = Input;
// const { RangePicker } = DatePicker;
// const { Option } = Select;

// const columns = (handleEdit, handleDelete) => [
//     {
//         title: '#',
//         dataIndex: 'id',
//         key: 'id',
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
//         title: 'Giá trị giảm giá',
//         dataIndex: 'discountValue',
//         key: 'discountValue',
//     },
//     {
//         title: 'Ngày bắt đầu',
//         dataIndex: 'startDate',
//         key: 'startDate',
//     },
//     {
//         title: 'Ngày kết thúc',
//         dataIndex: 'endDate',
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
//                 <Button onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
//                 <Button danger onClick={() => handleDelete(record.id)}>Xóa</Button>
//             </Space>
//         ),
//     },
// ];

// const VoucheList = () => {
//     const [voucherData, setVoucherData] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [form] = Form.useForm();
//     const [editingVoucher, setEditingVoucher] = useState(null);

//     const fetchVouchers = async () => {
//         try {
//             const response = await axios.get(`${baseUrl}/api/voucher/hien`);
//             setVoucherData(response.data.data);
//         } catch (error) {
//             message.error('Lỗi khi tải danh sách phiếu giảm giá!');
//         }
//     };

//     useEffect(() => {
//         fetchVouchers();
//     }, []);

//     const handleAdd = () => {
//         setEditingVoucher(null);
//         setIsModalOpen(true);
//     };

//     const handleEdit = (record) => {
//         setEditingVoucher(record);
//         setIsModalOpen(true);
//         form.setFieldsValue(record);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`${baseUrl}/api/voucher/delete/${id}`);
//             message.success('Xóa phiếu giảm giá thành công!');
//             fetchVouchers();
//         } catch (error) {
//             message.error('Lỗi khi xóa phiếu giảm giá!');
//         }
//     };

//     const handleOk = async () => {
//         try {
//             const values = form.getFieldsValue();
//             if (editingVoucher) {
//                 // Update voucher
//                 await axios.put(`${baseUrl}/api/voucher/update/${editingVoucher.id}`, values);
//                 message.success('Cập nhật phiếu giảm giá thành công!');
//             } else {
//                 // Add new voucher
//                 await axios.post(`${baseUrl}/api/voucher/add`, values);
//                 message.success('Thêm mới phiếu giảm giá thành công!');
//             }
//             fetchVouchers();
//             setIsModalOpen(false);
//             form.resetFields();
//         } catch (error) {
//             message.error('Lỗi khi lưu dữ liệu!');
//         }
//     };

//     const handleCancel = () => {
//         setIsModalOpen(false);
//         form.resetFields();
//     };

//     return (
//         <Card>
//             <h4>Danh sách phiếu giảm giá</h4>
//             <Button type="primary" onClick={handleAdd} style={{ marginBottom: '20px' }}>
//                 Thêm mới phiếu giảm giá
//             </Button>
//             <Table columns={columns(handleEdit, handleDelete)} dataSource={voucherData} rowKey="id" />

//             <Modal
//                 title={editingVoucher ? 'Chỉnh sửa phiếu giảm giá' : 'Thêm mới phiếu giảm giá'}
//                 visible={isModalOpen}
//                 onOk={handleOk}
//                 onCancel={handleCancel}
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item name="voucherCode" label="Mã phiếu giảm giá" rules={[{ required: true }]}>
//                         <Input />
//                     </Form.Item>
//                     <Form.Item name="voucherType" label="Loại phiếu giảm giá" rules={[{ required: true }]}>
//                         <Input />
//                     </Form.Item>
//                     <Form.Item name="discountValue" label="Giá trị giảm giá" rules={[{ required: true }]}>
//                         <Input />
//                     </Form.Item>
//                     <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
//                         <DatePicker format="DD/MM/YYYY" />
//                     </Form.Item>
//                     <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
//                         <DatePicker format="DD/MM/YYYY" />
//                     </Form.Item>
//                     <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
//                         <Select>
//                             <Option value="HOAT_DONG">Hoạt động</Option>
//                             <Option value="NGUNG_HOAT_DONG">Tạm ngưng</Option>
//                         </Select>
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </Card>
//     );
// };

// export default VoucheList;
// import React, { useEffect, useState } from 'react';
// import { Space, Table, Input, DatePicker, Select, Card, Button, Modal, Form, message } from 'antd';
// import axios from 'axios';
// import { baseUrl } from '../../helpers/Helpers.js';
// import moment from 'moment';

// const { Search } = Input;
// const { RangePicker } = DatePicker;
// const { Option } = Select;

// const columns = (handleEdit, handleDelete) => [
//     {
//         title: 'STT',
//         dataIndex: 'stt',
//         key: 'stt',
//         render: (text, record, index) => index + 1,
//     },
//     {
//         title: 'Mã phiếu giảm giá',
//         dataIndex: 'promotionCode',
//         key: 'promotionCode',
//     },
//     {
//         title: 'Tên phiếu giảm giá',
//         dataIndex: 'promotionName',
//         key: 'promotionName',
//     },
//     {
//         title: 'Loại giảm giá',
//         dataIndex: 'promotionType',
//         key: 'promotionType',
//     },
//     {
//         title: 'Giá trị giảm',
//         dataIndex: 'discountValue',
//         key: 'discountValue',
//     },
//     {
//         title: 'Ngày bắt đầu',
//         dataIndex: 'startDate',
//         key: 'startDate',
//         render: (text) => text ? moment(text).format('DD/MM/YYYY') : '',
//     },
//     {
//         title: 'Ngày kết thúc',
//         dataIndex: 'endDate',
//         key: 'endDate',
//         render: (text) => text ? moment(text).format('DD/MM/YYYY') : '',
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
//                 <Button onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
//                 <Button danger onClick={() => handleDelete(record.id)}>Xóa</Button>
//             </Space>
//         ),
//     },
// ];

// const PromotionList = () => {
//     const [promotionData, setPromotionData] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [form] = Form.useForm();
//     const [editingPromotion, setEditingPromotion] = useState(null);

//     const handleAdd = () => {
//         setEditingPromotion(null);
//         setIsModalOpen(true);
//     };

//     const handleEdit = (record) => {
//         const mappedRecord = {
//             promotionCode: record.promotionCode,
//             promotionName: record.promotionName,
//             promotionType: record.promotionType,
//             discountValue: record.discountValue,
//             startDate: record.startDate ? moment(record.startDate) : null,
//             endDate: record.endDate ? moment(record.endDate) : null,
//             status: record.status,
//         };
//         setEditingPromotion(record);
//         setIsModalOpen(true);
//         form.setFieldsValue(mappedRecord);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`${baseUrl}/api/promotion/delete/${id}`);
//             message.success('Xóa đợt giảm giá thành công!');
//             getPagePromotion(); // Cập nhật lại danh sách sau khi xóa
//         } catch (error) {
//             message.error('Lỗi khi xóa đợt giảm giá!');
//         }
//     };

//     const handleOk = async () => {
//         try {
//             const values = form.getFieldsValue();
//             const mappedValues = {
//                 ...values,
//                 startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
//                 endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
//             };
//             if (editingPromotion) {
//                 // Sửa
//                 await axios.put(`${baseUrl}/api/promotion/update/${editingPromotion.id}`, mappedValues);
//                 message.success('Cập nhật đợt giảm giá thành công!');
//             } else {
//                 // Thêm mới
//                 await axios.post(`${baseUrl}/api/promotion/add`, mappedValues);
//                 message.success('Thêm mới phiếu giảm giá thành công!');
//             }
//             setIsModalOpen(false);
//             form.resetFields();
//             getPagePromotion(); // Cập nhật lại danh sách sau khi thêm/sửa
//         } catch (error) {
//             message.error('Lỗi khi lưu dữ liệu!');
//         }
//     };

//     const handleCancel = () => {
//         setIsModalOpen(false);
//         form.resetFields();
//     };

//     const [pagination, setPagination] = useState({
//         page: 0,
//         size: 10,
//         total: 0,
//     });

//     const handleOnChangeTable = (paginationTable) => {
//         setPagination({
//             ...pagination,
//             page: paginationTable.current - 1,
//             size: paginationTable.pageSize,
//         });
//     };

//     useEffect(() => {
//         getPagePromotion();
//     }, [pagination]);

//     const getPagePromotion = async () => {
//         try {
//             const response = await axios.get(`${baseUrl}/api/promotion/page?page=${pagination.page}&size=${pagination.size}`);
//             const data = response.data.data;
//             const mappedData = data.content.map(item => ({
//                 ...item,
//                 key: item.id,
//             }));
//             setPromotionData(mappedData);

//             setPagination({
//                 page: data.number,
//                 size: data.size,
//                 total: data.totalElements,
//             });
//         } catch (error) {
//             message.error('Lỗi khi lấy dữ liệu!');
//         }
//     };

//     return (
//         <Card>
//             <h4>Danh sách đợt giảm giá</h4>
//             <Button type="primary" onClick={handleAdd} style={{ marginBottom: '20px' }}>
//                 +
//             </Button>

//             <Table
//                 columns={columns(handleEdit, handleDelete)}
//                 dataSource={promotionData}
//                 rowKey="id"
//                 pagination={{
//                     current: pagination.page + 1,
//                     pageSize: pagination.size,
//                     total: pagination.total,
//                 }}
//                 onChange={handleOnChangeTable}
//             />
//             <Modal
//                 title={editingPromotion ? 'Chỉnh sửa đợt giảm giá' : 'Thêm mới đợt giảm giá'}
//                 open={isModalOpen}
//                 onOk={handleOk}
//                 onCancel={handleCancel}
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item name="promotionCode" label="Mã đợt giảm giá" rules={[{ required: true }]}>
//                         <Input />
//                     </Form.Item>
//                     <Form.Item name="promotionName" label="Tên đợt giảm giá" rules={[{ required: true }]}>
//                         <Input />
//                     </Form.Item>
//                     <Form.Item name="promotionType" label="Loại đợt giảm giá" rules={[{ required: true }]}>
//                         <Input />
//                     </Form.Item>
//                     <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true }]}>
//                         <Input />
//                     </Form.Item>
//                     <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
//                         <DatePicker format="DD/MM/YYYY" />
//                     </Form.Item>
//                     <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
//                         <DatePicker format="DD/MM/YYYY" />
//                     </Form.Item>
//                     <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
//                         <Select>
//                             <Option value="HOAT_DONG">Hoạt động</Option>
//                             <Option value="NGUNG_HOAT_DONG">Tạm ngưng</Option>
//                         </Select>
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </Card>
//     );
// };

// export default PromotionList;

