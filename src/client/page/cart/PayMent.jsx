import React, { useState, useMemo, useEffect } from "react";
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
  Space,
} from "antd";
import { useForm, Controller, get } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
// import AddressSelector from "../../../admin/utils/AddressSelectorAntd";
import AddressSelectorGHN from "../../componetC/AddressSelectorGHN";
import { calculateShippingFee } from "../../componetC/apiGHN";
import moment from "moment/moment";
import { useProduct } from "../../../store/ProductContext";
import { clearBill, getBill } from "./bill";
import { formatVND } from "../../../helpers/Helpers";
import { useNavigate } from "react-router-dom";

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
  // city: yup.string().required("Vui lòng chọn tỉnh/thành phố."),
  // district: yup.string().required("Vui lòng chọn quận/huyện."),
  // address: yup.string().required("Vui lòng nhập địa chỉ."),
});

// Danh sách sản phẩm

// const productData = [
//   {
//     key: "1",
//     product: "Giày Nike Zoom Vapor Pro 2 HC White' DR6191-101-42 x 2",
//     price: "3,500,000 ₫",
//     quantity: 2,
//   },
//   {
//     key: "2",
//     product: "Áo Thể Thao Adidas Tiro 23 Competition",
//     price: "1,200,000 ₫",
//     quantity: 1,
//   },
// ];

// Hàm chuyển đổi giá từ string thành số
const parsePrice = (price) => {
  if (typeof price === "number") return price; // Nếu đã là số, trả về luôn
  if (!price || typeof price !== "string") return 0; // Nếu `price` null/undefined, trả về 0
  return Number(price.replace(/[^\d]/g, "")); // Xóa ký tự không phải số
};

const PayMent = () => {
  const navigate = useNavigate()
  const [currentBill, setCurrentBill] = useState(); // 1 mảng các sản phẩm
  const [productData, setProductData] = useState(getBill()); // 1 mảng các sản phẩm

  const [items, setItems] = useState([
    {
      key: "1",
      label: `Hóa đơn ${moment().format("HH:mm:ss")}`,
      productList: [],
      isSuccess: false,
      canPayment: false,
      customerInfo: null,
      payInfo: {
        paymentMethods: "cash",
        discount: 0,
        amount: 0,
      },
      closable: true,
      billCode: null,
      isShipping: false,
      isNewShippingInfo: false,
      shippingInfo: null,
      customerAddresses: [],
      addressShipping: null,
      detailAddressShipping: {
        provinceId: null,
        districtId: null,
        wardId: null,
        specificAddress: "",
      },
      recipientName: "", // Số điện thoại người nhận hàng
      recipientPhoneNumber: "", // Tên ngươi nhận
      shippingFee: 0,
    },
  ]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  // contexxt
  const { products } = useProduct(); // Lấy danh sách sản phẩm từ Context
  useEffect(() => {
    // setProductData(getBill());
    console.log("prodauct day nay", products);
    console.log("🛒 Đây là bill hiện tại:", getBill());
    return ()=>{
      clearBill()
    }
  }, []);

  const [paymentMethod, setPaymentMethod] = useState(null);
  const onAddressChange = async (
    selectedProvince,
    selectedDistrict,
    selectedWard,
    specificAddress
  ) => {
    let totalFee = 0;
    if (selectedWard != null) {
      totalFee = await calculateShippingFee({
        toWardCode: String(selectedWard),
        toDistrictId: selectedDistrict,
      });
    }
    setItems((prevItems) => ({
      ...prevItems,
      detailAddressShipping: {
        provinceId: selectedProvince,
        districtId: selectedDistrict,
        wardId: selectedWard,
        specificAddress: specificAddress ?? "",
      },
      shippingFee: totalFee,
    }));
  };

  const handleOnChangeShippingFee = (e) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === currentBill) {
          return {
            ...item,
            shippingFee: e.target.value,
          };
        }
        return item;
      })
    );
  };
  // Tính tổng tiền tự động
  const totalAmount = useMemo(() => {
    if (!productData || productData.length === 0) return 0; // Nếu chưa có dữ liệu, trả về 0
  
    return productData.reduce(
      (sum, item) => sum + parsePrice(item.price || 0) * (item.quantity || 1),
      0
    );
  }, [productData]);
  
  

  const columns = [
    {
      title: "SẢN PHẨM",
      dataIndex: "productName",
      key: "productName",
      render: (_, record) => (
        <Space>
          <img src={record.image} alt={record.productName} width={60} />
          {record.productName}[{record.colorName}-{record.sizeName}]
        </Space>
      ),
    },
    {
      title: "SỐ LƯỢNG",
      dataIndex: "quantityAddCart",
      key: "quantityAddCart",
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
    navigate("/success");

    reset(); // Reset form sau khi gửi
  };

  return (
    <Content style={{ backgroundColor: "white", padding: "20px" }}>
      <Row gutter={[20, 20]}>
        {/* Form thông tin khách hàng */}
        <Col span={12} style={{ padding: "1rem" }}>
          <Form
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
            id="paymentForm"
          >
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

            {/* <Form.Item
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
            </Form.Item> */}
          </Form>
          <h5>Chọn địa chỉ giao hàng</h5>
          <AddressSelectorGHN onAddressChange={onAddressChange} />
          Phí ship: {formatVND(parseInt(items?.shippingFee) || 0)}

          <Form.Item
              label="Lưu ý khi vận chuyển"
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
          </Col>

        {/* Thông tin đơn hàng */}
        <Col span={12} style={{ padding: "1rem", border: "1px solid #ddd" }}>
          <Title level={5}>ĐƠN HÀNG CỦA BẠN</Title>
          <Table
            columns={columns}
            dataSource={productData}
            pagination={false}
          />
          <Divider />
          <h3 style={{ textAlign: "right" }}>
            Tổng: {totalAmount?.toLocaleString()} ₫
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

          <Button type="primary" block onClick={handleSubmit(onSubmit)}>
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
