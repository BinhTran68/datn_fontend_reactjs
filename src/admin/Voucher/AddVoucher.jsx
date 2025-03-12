import React, { useState, useEffect } from 'react';
import { Table, Input, DatePicker, Select, Card, Form, Spin, Alert, Col, Row, Radio, Button, Flex, Modal, message } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { color } from 'framer-motion';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { baseUrl, convertStatusVoucher, ConvertvoucherType, ConvertdiscountType } from '../../helpers/Helpers.js';




const { Option } = Select;


const columnsCustomers = [
    {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
        render: (_, __, index) => index + 1,
    },
    {
        title: 'Họ và tên',
        dataIndex: 'fullName',
        key: 'fullName',
    },
    {
        title: 'CCCD',
        dataIndex: 'citizenId',
        key: 'citizenId',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
    },
    {
        title: 'Ngày sinh',
        dataIndex: 'dateBirth',
        key: 'dateBirth',
    },

];

const AddVoucher = () => {
    const [form] = Form.useForm();
    const [value, setValue] = useState("PUBLIC");
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const navigate = useNavigate(); // Khởi tạo navigate
    const showConfirm = () => {
        Modal.confirm({
            title: "Xác nhận thêm phiếu giảm giá",
            content: "Bạn có chắc chắn muốn thêm phiếu giảm giá này không?",
            okText: "Xác nhận",

            okButtonProps: {
                style: {
                    backgroundColor: '#ff974d', // Nền cam
                    borderColor: '#ff974d', // Viền cam
                    color: '#fff', // Chữ trắng để dễ nhìn
                },
            },
            cancelText: "Hủy",
            centered: true,
            onOk: handleOk, // Gọi hàm handleOk khi nhấn xác nhận

        });
    }



    // const [editingVoucher, setEditingVoucher] = useState(null);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [isDetail, setIsDeatil] = useState(false);


    const start = () => {
        setLoading(true);
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    const onSelectChange = (newSelectedRowKeys) => {
        console.log("selectedRowKeys changed: ", newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedCustomers(newSelectedRowKeys);
    };

    useEffect(() => {
        if (value === "PRIVATE") {
            // Khi chọn "Riêng tư", cập nhật số lượng bằng số lượng khách hàng được chọn
            form.setFieldsValue({ quantity: selectedCustomers.length });
        }
    }, [selectedCustomers, value, form]);
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    // Gọi API lấy danh sách khách hàng
    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:8080/api/admin/customers/");
            setCustomers(response.data);
        } catch (err) {
            setError("Lỗi khi tải danh sách khách hàng!");
        }
        setLoading(false);
    };

    // Xử lý khi chọn loại phiếu giảm giá
    const onChange = (e) => {
        const selectedValue = e.target.value;
        setValue(selectedValue);

        if (selectedValue === "PRIVATE") {
            setShowTable(true); // Hiển thị bảng khi chọn "Riêng tư"
            fetchCustomers(); // Gọi API để lấy danh sách khách hàng
        } else {
            setShowTable(false); // Ẩn bảng nếu chọn "Công khai"
            setSelectedRowKeys([]); // Reset danh sách đã chọn khi chuyển sang công khai
            form.setFieldsValue({ quantity: '' });// Xóa số lượng khi chuyển sang công khai
        }
    };




    const handleOk = async () => {
        try {
            // Kiểm tra toàn bộ form
            await form.validateFields();

            // Lấy dữ liệu từ form
            const values = form.getFieldsValue();

            // Lấy danh sách email từ danh sách khách hàng đã chọn
            const selectedEmails = customers
                .filter((customer) => selectedCustomers.includes(customer.id))
                .map((customer) => customer.email);

            const requestData = {
                ...values,
                voucherType: value, // Truyền loại voucher (1: công khai, 2: riêng tư)
                gmailkh: selectedEmails, // Gửi danh sách email thay vì ID khách hàng
            };

            console.log("Dữ liệu gửi lên API:", requestData);

            await axios.post("http://localhost:8080/api/admin/voucher/add", requestData);
            message.success("Thêm mới phiếu giảm giá thành công!");

            form.resetFields();
            setSelectedRowKeys([]);
            setSelectedCustomers([]);
            navigate("/admin/vouchelist"); // Thay đổi đường dẫn theo cấu trúc của bạn

        } catch (error) {
            message.error("Lỗi khi lưu dữ liệu!");
        }
    };



    //     };
    return (
        <Row gutter={20}>
            <Col span={8}>
                <Card>
                    {/* <Modal title="Thêm mới phiếu giảm giá" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Xác nhận" cancelText="Hủy"> */}
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
                            <Input type="number" placeholder="Nhập số lượng" min={1} disabled={value === "PRIVATE"} />
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
                            <Radio.Group onChange={onChange} value={value}>
                                <Radio checked={true} value={"PUBLIC"}>Công khai</Radio>
                                <Radio value={"PRIVATE"}>Riêng tư</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                    {/* <Link to={"/admin/vouchelist"} > */}
                    <Button type="primary"
                        onClick={showConfirm}
                        style={{
                            marginBottom: '20px',
                            border: 'none',
                            backgroundColor: '#ff974d'
                        }}>
                        Thêm mới
                    </Button>
                    {/* </Link> */}
                    {/* </Modal> */}

                </Card>
            </Col>
            <Col span={16}>
                {/* Bảng khách hàng hiển thị khi chọn "Riêng tư" */}
                {showTable && (
                    <>

                        <Flex gap="middle" vertical>
                            {loading && <Spin style={{ marginTop: 10 }} />}
                            {error && <Alert message={error} type="error" showIcon style={{ marginTop: 10 }} />}
                            <Flex align="center" gap="middle">
                                <Button type="primary"
                                    onClick={() => {
                                        setSelectedRowKeys([]); // Xóa các ô đã tích
                                        fetchCustomers(); // Gọi API lấy lại danh sách khách hàng
                                    }}
                                    disabled={loading}
                                    loading={loading}
                                >
                                    Tải lại danh sách khách hàng
                                </Button>
                                {hasSelected ? `Đã chọn ${selectedRowKeys.length} khách hàng` : null}
                            </Flex>
                            <Table rowSelection={rowSelection} columns={columnsCustomers}
                                dataSource={customers} rowKey="id" style={{ marginTop: 20 }} />
                        </Flex>
                    </>
                )}
            </Col>
        </Row>
    );
};

export default AddVoucher;
