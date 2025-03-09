import React from 'react';
import {Avatar, Button, Card, Checkbox, Col, Collapse, Form, Input, List, Row, Select, Space} from "antd";
import {FaCheck, FaCheckCircle, FaTicketAlt} from "react-icons/fa";
import {MdOutlineDonutLarge} from "react-icons/md";
import {AiFillCreditCard} from "react-icons/ai";
import {Typography} from "antd";
import voucher_image from "../../../../public/img/voucher_image.png"
import {convertDate, formatVND, generateAddressString} from "../../../helpers/Helpers.js";
import {SiCheckio} from "react-icons/si";
import {COLORS} from "../../../constants/constants.js";
import AddressSelectorAntd from "../../utils/AddressSelectorAntd.jsx";
import {  Radio } from 'antd';

const {Text} = Typography;

const style = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
};


const SalePaymentInfo = ({
                             amount,
                             handleCustomerMoneyChange,
                             customerMoney,
                             change,
                             vouchers,
                             handleOnSelectedVoucher,
                             discount,
                             selectedVouchers,
                             isShipping,
                             handleCheckIsShipping,
                             handleChangePaymentMethod,
                             paymentMethods,
                             handleBankCustomerMoneyChange,
                             handleCashCustomerMoneyChange,
                             cashCustomerMoney,
                             bankCustomerMoney,
                             handleOnPayment,
                             isSuccess,
                             handleOnPrintBill,
                             canPayment,
                             onAddressChange,
                             onAddressSelected,
                             customerAddresses,
                             addressShipping,
                             recipientName,
                             recipientPhoneNumber,
                             isNewShippingInfo,
                             detailAddressShipping,
                            customerInfo,
                             handleOnChangerRecipientPhoneNumber,
                             handleOnChangerRecipientName,
                             shippingFee,
                             handleOnChangeShippingFee
                         }) => {
    console.log("shippingFee", shippingFee)
    return (
        <>

            <Checkbox checked={isShipping} value={isShipping} onChange={handleCheckIsShipping}>
                Giao hàng
            </Checkbox>

            <Card>
                <h3 style={{ marginBottom: '16px' }}>Thông tin giao hàng</h3>
                <hr />
                <Form layout="vertical">
                    {isShipping && (
                        <Form.Item name="address">
                            <Radio.Group
                                style={style}
                                onChange={onAddressSelected}
                                value={addressShipping}
                                options={customerAddresses}
                            />
                        </Form.Item>
                    )}

                    {isShipping && (
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Tên người nhận">
                                    <Input value={recipientName}
                                           onChange={handleOnChangerRecipientName}
                                           placeholder="Nhập tên người nhận" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Số điện thoại người nhận">
                                    <Input value={recipientPhoneNumber}
                                           onChange={handleOnChangerRecipientPhoneNumber}
                                           type="text" placeholder="Nhập số điện thoại" />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    {isShipping && ( isNewShippingInfo || !customerInfo ) && (
                        <div style={{ marginBottom: '24px' }}>
                            <Form.Item >
                                <h5>Chọn địa chỉ giao hàng</h5>
                                <AddressSelectorAntd onAddressChange={onAddressChange} />
                            </Form.Item>
                        </div>
                    )}

                    {isShipping && (
                        <Form.Item label="Phí vận chuyển">
                            <Input
                                type="number"
                                min={0}
                                placeholder="Nhập số tiền"
                                onChange={handleOnChangeShippingFee}
                                value={parseInt(shippingFee)}
                                suffix="VNĐ"
                            />
                        </Form.Item>
                    )}
                </Form>
            </Card>
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
                                defaultActiveKey={['1', '2']}
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
                                                            (
                                                                selectedVouchers?.id === item.id ?
                                                                    <FaCheckCircle size={25}
                                                                                   color={`${COLORS.success}`}/> :
                                                                    <Button
                                                                        type={"primary"}
                                                                        onClick={() => {
                                                                            handleOnSelectedVoucher(item)
                                                                        }}>Chọn</Button>
                                                            )


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
                                                                        : {item?.discountValue && item.discountType === "MONEY" ? formatVND(item.discountValue) : (item.discountValue + "%")}
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
                        <Form layout="vertical" onFinish={handleOnPayment}>
                            <Form.Item label="Tạm tính">
                                <Text strong>{formatVND((amount + discount))}</Text>
                            </Form.Item>
                            <Form.Item label="Giảm giá">
                                <Text strong>{formatVND(discount)}</Text>
                            </Form.Item>
                            <Form.Item label="Tổng tiền">
                                <Text strong style={{color: "red"}}>{formatVND(amount)}</Text>
                            </Form.Item>
                            <Form.Item label="Chọn phương thức thanh toán">
                                <Select onChange={handleChangePaymentMethod} value={paymentMethods} defaultValue="cash"
                                        style={{width: "100%"}}>
                                    <Option value="cash">
                                        <MdOutlineDonutLarge/> Tiền mặt
                                    </Option>
                                    <Option value="bank">
                                        <AiFillCreditCard/> Chuyển khoản
                                    </Option>
                                    <Option value="cashAndBank">
                                        <MdOutlineDonutLarge/> Tiền mặt & <AiFillCreditCard/> Chuyển khoản
                                    </Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                hidden={paymentMethods !== "cash" && paymentMethods !== "cashAndBank"}
                                label="Tiền mặt khách đưa"
                            >
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="Nhập số tiền"
                                    onChange={handleCashCustomerMoneyChange}
                                    value={parseInt(cashCustomerMoney)}
                                    suffix="VNĐ"
                                />
                            </Form.Item>

                            <Form.Item
                                hidden={paymentMethods !== "bank" && paymentMethods !== "cashAndBank"}
                                label="Tiền khách chuyển khoản"
                            >
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="Nhập số tiền"
                                    onChange={handleBankCustomerMoneyChange}
                                    value={parseInt(bankCustomerMoney)}
                                    suffix="VNĐ"
                                />
                            </Form.Item>
                            {customerMoney < amount && (
                                <Text type="danger">Vui lòng nhập đủ tiền khách đưa!</Text>
                            )}
                            <Form.Item label="Tiền thừa">
                                <Text strong>{change > 0 ? change.toLocaleString() : 0} đ</Text>
                            </Form.Item>

                            <Form.Item>
                                <Checkbox checked={isShipping} value={isShipping} onChange={handleCheckIsShipping}>
                                    Giao hàng
                                </Checkbox>
                            </Form.Item>

                            <Form.Item hidden={isSuccess}>
                                <Button onClick={handleOnPayment} type="primary" block
                                        disabled={!canPayment}>
                                    Thanh toán
                                </Button>
                            </Form.Item>

                            <Form.Item hidden={!isSuccess}>
                                <Button onClick={handleOnPrintBill} type="primary"
                                        block>
                                    In hóa đơn
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