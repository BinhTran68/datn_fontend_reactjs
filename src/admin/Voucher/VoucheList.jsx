import React, { useEffect, useState, useMemo } from 'react';
import { Space, Table, Input, DatePicker, Select, Card, Button, Modal, Form, message, Col, Row, theme, Tag, Radio, Spin, List, Switch, Tooltip } from 'antd';
import axios from 'axios';
import { baseUrl, convertStatusVoucher, ConvertvoucherType, ConvertdiscountType } from '../../helpers/Helpers.js';

import "./StatusSelector.css";
import { render } from 'react-dom';
import { EyeOutlined, EditOutlined, DeleteOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons';
import { FaEye } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;
const VoucherList = () => {
    const [value, setValue] = useState(1);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 5,
        total: 7
    });

    const convertToVietnamTime = (utcDate) => {
        if (!utcDate) return ""; // Kiểm tra nếu không có giá trị tránh lỗi
        return new Date(utcDate).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
      };
      
    
    const columns = (handleEdit, handleDelete, handleDetail) => [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            align: 'center',

            render: (text, record, index) => index + 1,
        },
        {
            title: 'Mã phiếu giảm giá',
            dataIndex: 'voucherCode',
            key: 'voucherCode',
            align: 'center',

        },
        {
            title: 'Tên phiếu giảm giá',
            dataIndex: 'voucherName',
            key: 'voucherName',
            align: 'center',

        },
        {
            title: 'Loại phiếu giảm giá',
            dataIndex: 'voucherType',
            key: 'voucherType',
            align: 'center',

            render: (text, record) => {
                let displayStatus = ConvertvoucherType(record.voucherType);
                let color = '';

                if (record.voucherType === 'PUBLIC') {
                    color = 'blue'; // Công khai (Màu xanh)
                } else if (record.voucherType === 'PRIVATE') {
                    color = 'purple'; // Riêng tư (Màu tím)
                }
                return (
                    <Tag color={color} style={{ padding: '5px 10px', borderRadius: '10px', fontWeight: 'bold' }}>
                        {displayStatus}
                    </Tag>
                );
            },
        },
        {
            title: 'Số lượng phiếu giảm giá',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',

        },
        {
            title: 'Giá trị giảm',
            dataIndex: 'discountValue',
            key: 'discountValue',
            align: 'center',

            render: (text, record) => {
                console.log("record.discountType:", record.discountType); // Debug
                console.log("text:", text); // Debug

                return (
                    <span>
                        {record.discountType === 'PERCENT'
                            ? `${record.discountValue} %`
                            : `${record.discountValue} đ`}
                    </span>
                );
            },
        }
        ,

        {
            title: 'Giá trị tối thiểu',
            dataIndex: 'billMinValue',
            key: 'billMinValue',
            align: 'center',

            render: (text) => text ? <span>{text.toLocaleString()} đ</span> : <span>0 đ</span>,
        },
        {
            title: 'Giá trị tối đa',    

            dataIndex: 'discountMaxValue',
            key: 'discountMaxValue',
            align: 'center',

            render: (text) => text ? <span>{text.toLocaleString()} đ</span> : <span>0 đ</span>,
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            align: 'center',
            render: (text) => (text ? convertToVietnamTime(text) : "Không có dữ liệu"),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            align: 'center',
            render: (text) => (text ? convertToVietnamTime(text) : "Không có dữ liệu"),
        },
        
        {
            title: 'Trạng thái',
            dataIndex: 'statusVoucher',
            key: 'statusVoucher',
            align: 'center',

            render: (_, record) => {
                let displayStatus = convertStatusVoucher(record.statusVoucher);
                let color =
                    record.statusVoucher === 'dang_kich_hoat' ? '#389e0d' :
                        record.statusVoucher === 'chua_kich_hoat' ? 'orange' :
                            'red';

                let backgroundColor =
                    record.statusVoucher === 'dang_kich_hoat' ? '#f6ffed' :
                        record.statusVoucher === 'chua_kich_hoat' ? '#fff4e6' :
                            '#fff1f0';

                return (
                    <div
                        style={{
                            cursor: 'pointer',
                            color: color,
                            border: `1px solid ${color}`,
                            borderRadius: '8px',
                            textAlign: 'center',
                            padding: '5px 10px',
                            display: 'inline-block',
                            backgroundColor: backgroundColor,
                            fontSize: '12px',
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
                    {record.statusVoucher !== 'ngung_kich_hoat' && (
                        <Button
                            icon={
                                <FaEdit
                                    style={{
                                        color: "#ff974d",
                                        marginRight: "-3",
                                        fontSize: "1.5rem",
                                    }}
                                />
                            }
                            onClick={() => handleEdit(record)}
                        />

                    )}

                    {/* Nút bật/tắt trạng thái */}

                    <Tooltip title="Thay đổi trạng thái">
            <Switch
                disabled={record.statusVoucher === "ngung_kich_hoat"}
                checked={record.statusVoucher === "dang_kich_hoat"}
                checkedChildren="Bật"
                unCheckedChildren="Tắt"
                onChange={(checked) => {
                    Modal.confirm({
                        title: "Xác nhận thay đổi trạng thái",
                        content: `Bạn có chắc chắn muốn ${checked ? "bật" : "tắt"} voucher này không?`,
                        okText: "Xác nhận",
                        cancelText: "Hủy",
                        onOk: async () => {
                            try {
                                const newStatus = checked ? "dang_kich_hoat" : "ngung_kich_hoat";
                                console.log("Trạng thái mới:", newStatus);

                                await switchVoucherStatus(record.id, { status: newStatus });
                                getPageVoucher();
                                message.success("Cập nhật trạng thái thành công");
                            } catch (error) {
                                message.error("Cập nhật trạng thái không thành công");
                            }
                        }
                    });
                }}
            />
        </Tooltip>



                    <Button
                        icon={<FaEye style={{
                            color: "#ff974d",
                            marginRight: -1,
                            fontSize: "1.3rem",
                        }} />}
                        onClick={() => handleDetail(record)}></Button>
                    <Button style={{

                        border: 'none',
                    }} danger onClick={() => handleDelete(record.id)}>Xóa</Button>
                </Space>
            ),
        },
    ];
    const [voucherData, setVoucherData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingVoucher, setEditingVoucher] = useState(null);
    const navigate = useNavigate();

    // Hàm switch
    const switchVoucherStatus = async (id, statusO) => {
        const { status } = statusO
        console.log("toi ham nay");

        try {
            const response = await axios.get("http://localhost:8080/api/admin/voucher/switchStatus", {
                params: { id, status }
            });
            console.log(response);

        } catch (error) {
            console.log(error);

            throw error;
        }
    };


    const style = {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    };


    // Fetching voucher data (you may want to keep this if it's not commented out)
    useEffect(() => {
        getPageVoucher();
    }, [pagination]);

    const getPageVoucher = async () => {
        const response = await axios.get(`${baseUrl}/api/admin/voucher/page?page=${pagination.page}&size=${pagination.size}`);
        const data = response.data.data;
        console.warn(data);

        const items = data.content.map((el) => {
            el.startDate = new Date(el.startDate);
            el.endDate = new Date(el.endDate);
            return el;
        });
        setVoucherData(items);
        console.log(items);


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
        navigate(`/admin/voucher/update/${record.id}`);
    };
    const handleDetail = (record) => {
        navigate(`/admin/voucher/detail/${record.id}`);
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
                await axios.put(`${baseUrl}/api/admin/voucher/update/${editingVoucher.id}`, values, value);
                message.success('Cập nhật phiếu giảm giá thành công!');
            }
            getPageVoucher();  // Fetch updated list
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Lỗi khi lưu trữ liệu!', error);
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
    // const onChange = (e) => {
    //     const selectedValue = e.target.value;
    //     setValue(selectedValue);
    // }
    const [voucherType, setVoucherType] = useState(0); // Mặc định là Công khai

    const onChange = (e) => {
        setVoucherType(e.target.value);
    };


    return (
        <>
            <h4>Bộ lọc </h4>
            <h4 style={{ paddingTop: '15px' }}>Danh sách phiếu giảm giá</h4>

            <Card>
                <Link to={"/admin/voucher/add"} >
                    <Button type="primary" icon={<PlusOutlined />}
                        onClick={handleAdd} style={{
                            marginBottom: '20px',
                            border: 'none',
                            backgroundColor: '#ff974d'
                        }}>
                        Thêm mới
                    </Button>
                </Link>


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
                    <Form form={form} layout="vertical">
                        <Form.Item name="voucherName" label="Tên phiếu giảm giá" rules={[{ required: true, message: 'Không được bỏ trống' }]}>
                            <Input placeholder="Nhập tên phiếu giảm giá" />
                        </Form.Item>
                        <Form.Item name="quantity" label="Số lượng" rules={[
                            { required: true, message: 'Không được bỏ trống' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || (Number(value) >= 1 && Number.isInteger(Number(value)))) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Số lượng phải là số nguyên lớn hơn hoặc bằng 1'));
                                },
                            }),
                        ]}>
                            <Input type="number" placeholder="Nhập số lượng" min={1} />
                        </Form.Item>

                        <Form.Item label="Giá trị giảm" required>
                            <Input.Group compact>
                                <Form.Item
                                    name="discountValue"
                                    noStyle
                                    dependencies={["discountType"]}
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const num = Number(value);
                                                const type = getFieldValue("discountType");

                                                if (!value) return Promise.reject(new Error('Không được bỏ trống'));

                                                if (type === "PERCENT" && (!Number.isInteger(num) || num < 1 || num > 80)) {
                                                    return Promise.reject(new Error('Giá trị giảm (%) phải từ 1 đến 80'));
                                                }

                                                if (num < 1) {
                                                    return Promise.reject(new Error('Giá trị giảm phải lớn hơn 0'));
                                                }

                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >
                                    <Input type="number" placeholder="Nhập giá trị giảm" style={{ width: '70%' }} />
                                </Form.Item>

                                <Form.Item name="discountType" noStyle rules={[{ required: true, message: 'Không được bỏ trống' }]}>
                                    <Select placeholder="Chọn loại giảm" style={{ width: '30%' }}>
                                        <Option value="PERCENT">%</Option>
                                        <Option value="MONEY">đ</Option>
                                    </Select>
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>


                        <Form.Item
                            name="billMinValue"
                            label="Giá trị tối thiểu"
                            rules={[
                                { required: true, message: 'Không được bỏ trống' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const maxValue = getFieldValue("discountMaxValue");
                                        if (value === undefined || value < 0 || !Number.isInteger(Number(value))) {
                                            return Promise.reject(new Error('Giá trị phải là số nguyên dương!'));
                                        }
                                        if (maxValue !== undefined && maxValue !== null && Number(value) >= Number(maxValue)) {
                                            return Promise.reject(new Error('Giá trị tối thiểu phải nhỏ hơn giá trị tối đa!'));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input type="number" placeholder="Nhập giá trị tối thiểu" suffix="đ" />
                        </Form.Item>

                        <Form.Item
                            name="discountMaxValue"
                            label="Giá trị tối đa"
                            dependencies={["billMinValue"]}
                            rules={[
                                { required: true, message: 'Không được bỏ trống' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const minValue = getFieldValue("billMinValue");
                                        if (value === undefined || value < 0 || !Number.isInteger(Number(value))) {
                                            return Promise.reject(new Error('Giá trị phải là số nguyên dương!'));
                                        }
                                        if (minValue !== undefined && minValue !== null && Number(value) <= Number(minValue)) {
                                            return Promise.reject(new Error('Giá trị tối đa phải lớn hơn giá trị tối thiểu!'));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input type="number" placeholder="Nhập giá trị tối đa" suffix="đ" />
                        </Form.Item>


                        <Form.Item
                            name="startDate"
                            label="Ngày bắt đầu"
                            rules={[
                                { required: true, message: 'Không được bỏ trống' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || !getFieldValue('endDate') || value.isBefore(getFieldValue('endDate'))) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Ngày bắt đầu không được vượt quá ngày kết thúc!'));
                                    },
                                }),
                            ]}
                        >
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="endDate"
                            label="Ngày kết thúc"
                            rules={[
                                { required: true, message: 'Không được bỏ trống' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || !getFieldValue('startDate') || value.isAfter(getFieldValue('startDate'))) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu!'));
                                    },
                                }),
                            ]}
                        >
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="voucherType" label="Loại phiếu giảm giá" rules={[{ required: true, message: 'Không được bỏ trống' }]}>
                            <Radio.Group onChange={onChange} value={voucherType} disabled>
                                <Radio value={"PUBLIC"}>Công khai</Radio>
                                <Radio value={"PRIVATE"}>Riêng tư</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </>

    );
};

export default VoucherList;