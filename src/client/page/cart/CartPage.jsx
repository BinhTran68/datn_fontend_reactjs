import React, { useState } from "react";
import {
  Table,
  Button,
  InputNumber,
  Typography,
  Input,
  Space,
  message,
  Col,
  Row,
  Flex,
  Popconfirm,
} from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { VscTag } from "react-icons/vsc";
import { COLORS } from "../../../constants/constants";
import { Content } from "antd/es/layout/layout";
import { FaRegTrashCan } from "react-icons/fa6";

const { Title, Text } = Typography;

const CartPage = () => {
  const [quantities, setQuantities] = useState([1, 1, 1]);
  const [discountCode, setDiscountCode] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  const discountCodes = {
    SALE10: { type: "percent", value: 0.1 }, // 10% discount
    SALE20: { type: "percent", value: 0.2 }, // 20% discount
    FIXED100: { type: "fixed", value: 100000 }, // 100,000 VND fixed discount
    FIXED200: { type: "fixed", value: 200000 }, // 200,000 VND fixed discount
  };

  const products = [
    {
      name: "Giày Adidas Stan Smith Fairway M20324 - 36",
      price: 2100000,
      image:
        "https://authentic-shoes.com/wp-content/uploads/2023/04/8880_01.jpg_c2f0a7080647417eb4a17324fed9919f-768x343.jpeg",
    },
    {
      name: "Giày Nike Air Force 1 '07 LV8",
      price: 2300000,
      image: "https://example.com/nike-af1.jpg",
    },
    {
      name: "Giày Puma RS-X Bold",
      price: 1800000,
      image: "https://example.com/puma-rsx.jpg",
    },
  ];

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
  };

  const handleButtonClick = (msg) => {
    message.success(msg);
  };

  const applyDiscount = () => {
    const discountInfo = discountCodes[discountCode];
    console.log(discountInfo);

    if (discountInfo) {
      if (discountInfo.type === "percent") {
        setDiscount(discountInfo.value);
        setDiscountType(discountInfo.type);
        setAppliedDiscount(
          `${discountCode} - Giảm ${discountInfo.value * 100}%`
        );
        message.success(
          `Mã giảm giá ${discountInfo.value * 100}% đã được áp dụng!`
        );
      } else if (discountInfo.type === "fixed") {
        const fixedDiscount = discountInfo.value;
        setDiscount(discountInfo.value);
        setDiscountType(discountInfo.type);

        setAppliedDiscount(
          `${discountCode} - Giảm ${fixedDiscount.toLocaleString()} đ`
        );
        message.success(
          `Mã giảm giá ${fixedDiscount.toLocaleString()} đ đã được áp dụng!`
        );
      }
    } else {
      setDiscount(0);
      setAppliedDiscount(null);
      message.error("Mã giảm giá không hợp lệ!");
    }
  };

  const totalSelectedPrice = selectedRowKeys.reduce(
    (acc, index) => acc + quantities[index] * products[index].price,
    0
  );

  const calculateDiscountedTotal = () => {
    let discountedTotal;
    console.log(discountType);

    if (discountType === "percent") {
      // Nếu có giảm giá theo phần trăm
      discountedTotal = totalSelectedPrice * (1 - discount);
    } else if (discountType === "fixed") {
      // Nếu có mã giảm giá cố định

      discountedTotal = totalSelectedPrice - discount;
    } else {
      // Nếu không có giảm giá
      discountedTotal = totalSelectedPrice;
    }

    return discountedTotal;
  };

  // Gọi hàm để tính discountedTotal
  const discountedTotal = calculateDiscountedTotal();

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  const columns = [
    {
      title: "SẢN PHẨM",
      dataIndex: "product",
      key: "product",
      render: (_, record) => (
        <Space>
          <img src={record.image} alt={record.name} width={60} />
          <Text>{record.name}</Text>
        </Space>
      ),
    },
    {
      title: "GIÁ",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <Text strong>{record.price.toLocaleString()} đ</Text>
      ),
    },
    {
      title: "SỐ LƯỢNG",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record, index) => (
        <Flex gap={0.8}>
          <Button
            icon={<MinusOutlined />}
            onClick={() =>
              handleQuantityChange(index, Math.max(1, quantities[index] - 1))
            }
          />
          <InputNumber
            min={1}
            value={quantities[index]}
            onChange={(value) => handleQuantityChange(index, value)}
            style={{ width: "50px" }}
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(index, quantities[index] + 1)}
          />
        </Flex>
      ),
    },
    {
      title: "TẠM TÍNH",
      dataIndex: "total",
      key: "total",
      render: (_, record, index) => (
        <Text strong>
          {(record.price * quantities[index]).toLocaleString()} đ
        </Text>
      ),
    },
    {
      title: "#",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => {
        // if (!record.id || Object.keys(record).length === 0) {
        //   return null;
        // }
        return (
          <>
            <Row gutter={[16, 16]}>
              <Col>
                <Popconfirm
                  title="Xóa Hãng"
                  description="Bạn có muốn xóa Màu sắc này kh"
                  okText="Xác nhận"
                  cancelText="Hủy"
                  //  onConfirm={() => handleDeleteColor(record.id)}
                >
                  <Button >
                    <FaRegTrashCan size={20} color="#FF4D4F" /> xóa
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Content style={{ backgroundColor: "white" }}>
        <Row gutter={[16, 16]} style={{ padding: "20px" }}>
          <Col span={16}>
            <Content>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={products.map((product, index) => ({
                  ...product,
                  key: index,
                }))}
                pagination={false}
              />
            </Content>
          </Col>
          <Col span={8}>
            <Content style={{ padding: "1rem", borderLeft: "1px solid #ddd" }}>
              <p>
                Tạm tính:{" "}
                <strong>{totalSelectedPrice.toLocaleString()} đ</strong>
              </p>
              <p>
                Tổng sau giảm giá:{" "}
                <strong>{discountedTotal.toLocaleString()} đ</strong>
              </p>
              {appliedDiscount && (
                <p>
                  <Text type="success">{appliedDiscount}</Text>
                </p>
              )}
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  block
                  onClick={() => handleButtonClick("Mua ngay thành công!")}
                >
                  MUA NGAY
                </Button>
                <Button
                  type="dashed"
                  block
                  onClick={() => handleButtonClick("Chọn trả góp qua thẻ!")}
                >
                  TRẢ GÓP QUA THẺ
                </Button>
                <Button
                  type="default"
                  block
                  onClick={() =>
                    handleButtonClick("Mua ngay - Trả sau thành công!")
                  }
                >
                  MUA NGAY - TRẢ SAU
                </Button>
                <Button
                  type="default"
                  block
                  onClick={() => handleButtonClick("Tiến hành thanh toán!")}
                >
                  TIẾN HÀNH THANH TOÁN
                </Button>
              </Space>
              <Content
                title="Mã ưu đãi"
                style={{
                  marginTop: "1rem",
                }}
              >
                <Space>
                  <VscTag size={22} style={{ color: `${COLORS.pending}` }} />
                  <Input
                    placeholder="Nhập mã ưu đãi"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <Button type="primary" onClick={applyDiscount}>
                    Áp dụng
                  </Button>
                </Space>
              </Content>
            </Content>
          </Col>
        </Row>
      </Content>
    </div>
  );
};

export default CartPage;
