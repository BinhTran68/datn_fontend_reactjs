import React, { useEffect, useState } from "react";
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
import { getCart, getDeviceId, removeFromCart } from "./cart";

const { Title, Text } = Typography;

const CartPage = () => {
  const [quantities, setQuantities] = useState([1, 1, 1]);
  const [discountCode, setDiscountCode] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [products, setProducts] = useState(getCart());
  useEffect(() => {
    const handleStorageChange = () => {
      setProducts(getCart()); // Cập nhật UI khi có thay đổi trong giỏ hàng
    };
  
    window.addEventListener("storage", handleStorageChange);
  
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  const discountCodes = {
    SALE10: { type: "percent", value: 0.1 }, // 10% discount
    SALE20: { type: "percent", value: 0.2 }, // 20% discount
    FIXED100: { type: "fixed", value: 100000 }, // 100,000 VND fixed discount
    FIXED200: { type: "fixed", value: 200000 }, // 200,000 VND fixed discount
  };

  const handleRemoveFromCart = (productDetailId) => {
    // Lọc bỏ sản phẩm đã xóa khỏi giỏ hàng
    const updatedProducts = products.filter(
      (product) => product.productDetailId !== productDetailId
    );
  
    setProducts(updatedProducts); // Cập nhật lại danh sách sản phẩm
    localStorage.setItem(`cart_${getDeviceId()}`, JSON.stringify(updatedProducts));
    window.dispatchEvent(new Event("storage"));

    // Cập nhật lại danh sách sản phẩm đã chọn
    // láy những sp ko giống với sp đã xóa và set lại
    const updatedSelectedKeys = selectedRowKeys.filter(
      (index) => products[index]?.productDetailId !== productDetailId
    );
    setSelectedRowKeys(updatedSelectedKeys);
  
  };
  
  const handleQuantityChange = (index, value) => {
    if (value < 1) return; // Đảm bảo không có số lượng nhỏ hơn 1
  
    const updatedProducts = [...products];
    updatedProducts[index].quantityAddCart = value;
  
    setProducts(updatedProducts); // Cập nhật state
    localStorage.setItem(`cart_${getDeviceId()}`, JSON.stringify(updatedProducts)); // Lưu lại vào localStorage
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
    (acc, index) => acc + products[index]?.quantityAddCart * products[index]?.price,
    0
  );

  const calculateDiscountedTotal = () => {
    let discountedTotal;
    console.log(discountType);
    console.log(getCart());
    

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
          <img src={record.image} alt={record.productName} width={60} />
          <Text>
            {record.productName}[{record.colorName}-{record.sizeName}]
          </Text>
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
            onClick={() => handleQuantityChange(index, Math.max(1, record.quantityAddCart - 1))}
          />
          <InputNumber
            min={1}
            value={record.quantityAddCart}
            onChange={(value) => handleQuantityChange(index, value)}
            style={{ width: "50px" }}
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(index, record.quantityAddCart + 1)}
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
          {(record.price * record.quantityAddCart).toLocaleString()} đ
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
                  onConfirm={() => {
                    handleRemoveFromCart(record.productDetailId);
                  }}
                >
                  <Button>
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
                  MUA HÀNG
                </Button>
                {/* <Button
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
                </Button> */}
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
