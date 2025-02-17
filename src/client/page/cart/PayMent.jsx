import React, { useState, useMemo } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Row,
  Col,
  Table,
  Divider,
  Radio,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

const { Option } = Select;

// Schema validation
const schema = yup.object().shape({
  fullname: yup.string().required("Vui lòng nhập họ và tên."),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại.")
    .matches(/^\d{10,11}$/, "Số điện thoại không hợp lệ"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email."),
  city: yup.string().required("Vui lòng chọn tỉnh/thành phố."),
  district: yup.string().required("Vui lòng chọn quận/huyện."),
  address: yup.string().required("Vui lòng nhập địa chỉ."),
});

// Danh sách sản phẩm
const productData = [
  {
    key: "1",
    product: "Giày Nike Zoom Vapor Pro 2 HC White' DR6191-101-42 x 2",
    price: "3,500,000 ₫",
    quantity: 2,
  },
  {
    key: "2",
    product: "Áo Thể Thao Adidas Tiro 23 Competition",
    price: "1,200,000 ₫",
    quantity: 1,
  },
];

// Hàm chuyển đổi giá từ string thành số
const parsePrice = (price) => Number(price.replace(/[^\d]/g, "")); // Loại bỏ ký tự không phải số

const PayMent = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [paymentMethod, setPaymentMethod] = useState(null);

  // Tính tổng tiền tự động
  const totalAmount = useMemo(() => {
    return productData.reduce(
      (sum, item) => sum + parsePrice(item.price) * item.quantity,
      0
    );
  }, []);

  const columns = [
    {
      title: "SẢN PHẨM",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "SỐ LƯỢNG",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "TẠM TÍNH",
      dataIndex: "price",
      key: "price",
      align: "right",
    },
  ];

  const onSubmit = (data) => {
    console.log("Dữ liệu gửi đi:", data);
    message.success("Đặt hàng thành công!");
    reset(); // Reset form sau khi gửi
  };

  return (
    <Content style={{ backgroundColor: "white", padding: "20px" }}>
      <Row gutter={[20, 20]}>
        {/* Form thông tin khách hàng */}
        <Col span={12} style={{padding:"1rem"}}>
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)} id="paymentForm">
            <Form.Item
              label="Họ và tên"
              validateStatus={errors.fullname ? "error" : ""}
              help={errors.fullname?.message}
            >
              <Controller
                name="fullname"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Nhập họ và tên" />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              validateStatus={errors.phone ? "error" : ""}
              help={errors.phone?.message}
            >
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Nhập số điện thoại" />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              validateStatus={errors.email ? "error" : ""}
              help={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Nhập email" />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Tỉnh/Thành phố"
              validateStatus={errors.city ? "error" : ""}
              help={errors.city?.message}
            >
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Chọn Tỉnh/Thành phố">
                    <Option value="HaNoi">Hà Nội</Option>
                    <Option value="HoChiMinh">TP. Hồ Chí Minh</Option>
                  </Select>
                )}
              />
            </Form.Item>

            <Form.Item
              label="Quận/Huyện"
              validateStatus={errors.district ? "error" : ""}
              help={errors.district?.message}
            >
              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Chọn Quận/Huyện">
                    <Option value="1">Quận 1</Option>
                    <Option value="2">Quận 2</Option>
                  </Select>
                )}
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              validateStatus={errors.address ? "error" : ""}
              help={errors.address?.message}
            >
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    placeholder="Nhập địa chỉ cụ thể"
                  />
                )}
              />
            </Form.Item>

          
          </Form>
        </Col>

        {/* Thông tin đơn hàng */}
        <Col span={12} style={{padding:"1rem", border:"1px solid #ddd"}}>
          <Title level={5}>ĐƠN HÀNG CỦA BẠN</Title>
          <Table
            columns={columns}
            dataSource={productData}
            pagination={false}
          />
          <Divider />
          <h3 style={{ textAlign: "right" }}>
            Tổng: {totalAmount.toLocaleString()} ₫
          </h3>

          <Divider />

          <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)}>
            <div>
              <Radio value="bankTransfer">Chuyển khoản ngân hàng</Radio>
              <Paragraph type="secondary">
                Thực hiện thanh toán vào tài khoản ngân hàng. Vui lòng sử dụng
                Mã đơn hàng trong nội dung thanh toán.
              </Paragraph>
            </div>
            <img
              src="https://authentic-shoes.com/wp-content/uploads/2023/11/Screenshot-2023-11-24-at-23.19.42.png"
              alt="Bank transfer"
              width="300"
            />
            <div>
              <Radio value="cashOnDelivery">Kiểm tra thanh toán</Radio>
            </div>

            <div>
              <Radio value="creditCard">
                Thẻ ATM/Visa/Master/JCB/QR Pay qua cổng VNPAY
              </Radio>
            </div>
          </Radio.Group>

          <Button type="primary" block onClick={handleSubmit(onSubmit)} >
            ĐẶT HÀNG
          </Button>

          <Paragraph type="secondary">
            Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng và tăng
            trải nghiệm sử dụng website.
          </Paragraph>
        </Col>
      </Row>
    </Content>
  );
};

export default PayMent;
