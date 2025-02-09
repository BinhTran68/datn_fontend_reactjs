import React from 'react';
import {Avatar, Button, Card, Collapse, Form, Input, List, Select} from "antd";
import {FaTicketAlt} from "react-icons/fa";
import {MdOutlineDonutLarge} from "react-icons/md";
import {AiFillCreditCard} from "react-icons/ai";
import {Typography} from "antd";
import voucher_image from "../../../../public/img/voucher_image.png"
import {convertDate, formatVND} from "../../../helpers/Helpers.js";

const {Text} = Typography;


const SalePaymentInfo = ({amount, handleCustomerMoneyChange, customerMoney, change, vouchers}) => {
    console.log(vouchers)
    return (
        <>
            <Card>
                <h3>Thông tin thanh toán</h3>
                <hr/>
                <div className={"row"}>
                    <div className={"col-md-6"}>
                        Hello
                    </div>
                    <div className={"col-md-6"}>
                        <div className={"py-2"}>
                            <Collapse
                                expandIconPosition={"end"}
                                items={[{
                                    key: '1',
                                    label: (
                                        <div className={"d-flex justify-content-between align-items-center"}>
                                            <span className={"d-flex gap-3 align-items-center"}><FaTicketAlt/> Phiếu giảm giá</span>
                                            <span className={"bold"}>Chọn hoặc nhập mã giảm giá </span>
                                        </div>
                                    ),
                                    children: (
                                        <div className={""} style={{}}>
                                            <List

                                                itemLayout="horizontal"
                                                dataSource={vouchers}
                                                renderItem={(item, index) => (
                                                    <List.Item
                                                        actions={[
                                                            <Button
                                                                type={"primary"}
                                                                onClick={() => {

                                                                }}>Chọn</Button>
                                                        ]}
                                                    >

                                                        <List.Item.Meta
                                                            avatar={<img width={55} src={voucher_image}
                                                                         alt={"img voucher"}/>}
                                                            title={<a href="https://ant.design">{item?.voucherName}</a>}
                                                            description={

                                                                <div>
                                                                    <div>
                                                                        Số lượng : {item?.quantity ?? 0}
                                                                    </div>
                                                                    <div>
                                                                        Ngày hết hạn : {convertDate(item.endDate)}
                                                                    </div>
                                                                    <div>
                                                                        Gía trị giảm
                                                                        : {item?.discountValue && item.voucherType === "MONEY" ? formatVND(item.discountValue) : (item.discountValue + "%")}
                                                                    </div>
                                                                </div>
                                                            }
                                                        />
                                                    </List.Item>
                                                )}
                                            />

                                        </div>
                                    )
                                }]}
                            />
                        </div>
                        <Form layout="vertical">
                            <Form.Item label="Tạm tính">
                                <Text strong>{amount.toLocaleString()} đ</Text>
                            </Form.Item>
                            <Form.Item label="Giảm giá">
                                <Text strong>0 đ</Text>
                            </Form.Item>
                            <Form.Item label="Tổng tiền">
                                <Text strong style={{color: "red"}}>{amount.toLocaleString()} đ</Text>
                            </Form.Item>
                            <Form.Item label="Tiền khách đưa">
                                <Input
                                    type="number"
                                    placeholder="Nhập số tiền"
                                    onChange={handleCustomerMoneyChange}
                                    value={customerMoney}
                                    suffix="VNĐ"
                                />
                            </Form.Item>
                            {customerMoney < amount && (
                                <Text type="danger">Vui lòng nhập đủ tiền khách đưa!</Text>
                            )}
                            <Form.Item label="Tiền thừa">
                                <Text strong>{change > 0 ? change.toLocaleString() : 0} đ</Text>
                            </Form.Item>
                            <Form.Item label="Chọn phương thức thanh toán">
                                <Select defaultValue="cash" style={{width: "100%"}}>
                                    <Option value="cash">
                                        <MdOutlineDonutLarge/> Tiền mặt
                                    </Option>
                                    <Option value="bank">
                                        <AiFillCreditCard/> Chuyển khoản
                                    </Option>
                                    <Option value="both">
                                        <MdOutlineDonutLarge/> Tiền mặt & <AiFillCreditCard/> Chuyển khoản
                                    </Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" block disabled={customerMoney < amount}>
                                    Thanh toán
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Card>

        </>
    );
};

export default SalePaymentInfo;