import React from 'react';
import { Button, Card, Select } from "antd";

const CustomerSelect = ({ customers, customer, onCustomerSelect }) => {
    console.log("customer", customer)
    return (
        <div>
            <Card>
                <div className={"d-flex justify-content-between align-items-center"}>
                    <h3>Thông tin khách hàng</h3>
                    <div className={"d-flex gap-5"}>
                        <Select
                            showSearch
                            style={{
                                width: 200,
                            }}
                            placeholder="Tìm kiếm khách hàng"
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                option?.label?.toLowerCase().includes(input.toLowerCase())
                            }
                            options={customers.map(c => ({
                                value: c.id,  // ID khách hàng
                                label: c.email,  // Hiển thị email, dùng để lọc
                            }))}
                            onSelect={(value) => {
                                const selectedCustomer = customers.find(c => c.id === value);
                                if (selectedCustomer) {
                                    onCustomerSelect(selectedCustomer);
                                }
                            }}
                        />

                        <Button type={"primary"}>
                            Thêm mới khách hàng
                        </Button>
                    </div>
                </div>

                <div className={"d-flex justify-content-center py-5"}>
                    {
                        customer ? <h4>{customer?.fullName}</h4> : <h4>Khách lẻ</h4>
                    }
                </div>

            </Card>
        </div>
    );
};

export default CustomerSelect;
