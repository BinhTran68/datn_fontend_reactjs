import React from 'react';
import { Button, Card, Select, Row, Col, Descriptions, Avatar, Tag } from "antd";
import { UserAddOutlined, PhoneOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

const CustomerSelect = ({ customers, customer, onCustomerSelect }) => {
    return (
        <Card>
            <div className={"d-flex justify-content-between align-items-center mb-4"}>
                <h3>Thông tin khách hàng</h3>
                <div className={"d-flex gap-3"}>
                    <Select
                        showSearch
                        allowClear
                        style={{
                            width: 300,
                        }}
                        placeholder="Tìm kiếm theo tên, email, số điện thoại"
                        optionFilterProp="label"
                        value={customer?.id || null}
                        filterOption={(input, option) => {
                            const customer = customers.find(c => c.id === option.value);
                            return (
                                customer?.fullName?.toLowerCase().includes(input.toLowerCase()) ||
                                customer?.email?.toLowerCase().includes(input.toLowerCase()) ||
                                customer?.phoneNumber?.includes(input)
                            );
                        }}
                        options={customers.map(c => ({
                            value: c.id,
                            label: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Avatar src={c.avatar} size="small">
                                        {c.fullName?.charAt(0)}
                                    </Avatar>
                                    <div>
                                        <div>{c.fullName}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            {c.phoneNumber} | {c.email}
                                        </div>
                                    </div>
                                </div>
                            ),
                        }))}
                        onChange={(value) => {
                            if (!value) {
                                onCustomerSelect(null);
                            }
                        }}
                        onSelect={(value) => {
                            const selectedCustomer = customers.find(c => c.id === value);
                            if (selectedCustomer) {
                                onCustomerSelect(selectedCustomer);
                            }
                        }}
                    />

                    <Button type="primary" icon={<UserAddOutlined />}>
                        Thêm mới khách hàng
                    </Button>
                </div>
            </div>

            <div className="customer-info-container" style={{ padding: '20px 0' }}>
                {customer ? (
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                <Avatar 
                                    src={customer.avatar} 
                                    size={64}
                                    style={{ backgroundColor: '#1890ff' }}
                                >
                                    {customer.fullName?.charAt(0)}
                                </Avatar>
                                <div>
                                    <h2 style={{ margin: 0 }}>{customer.fullName}</h2>
                                    <Tag color={customer.status === 1 ? 'green' : 'red'}>
                                        {customer.status === 1 ? 'Đang hoạt động' : 'Đã khóa'}
                                    </Tag>
                                </div>
                            </div>
                        </Col>
                        <Col span={24}>
                            <Descriptions bordered size="small">
                                <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>} span={1}>
                                    {customer.phoneNumber}
                                </Descriptions.Item>
                                <Descriptions.Item label={<><MailOutlined /> Email</>} span={2}>
                                    {customer.email}
                                </Descriptions.Item>
                                <Descriptions.Item label={<><IdcardOutlined /> CCCD/CMT</>} span={1}>
                                    {customer.CitizenId}
                                </Descriptions.Item>
                                <Descriptions.Item label="Giới tính" span={1}>
                                    {customer.gender === 1 ? 'Nam' : 'Nữ'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày sinh" span={1}>
                                    {customer.dateBirth}
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                ) : (
                    <div className="text-center py-5">
                        <Avatar size={64} icon={<UserAddOutlined />} />
                        <h4 style={{ marginTop: '16px' }}>Khách lẻ</h4>
                        <p style={{ color: '#666' }}>Chọn khách hàng hoặc thêm mới khách hàng</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default CustomerSelect;
