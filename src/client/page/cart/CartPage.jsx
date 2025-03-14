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
  notification,
  Select,
} from "antd";
import styles from "./CartPage.module.css";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { VscTag } from "react-icons/vsc";
import { COLORS } from "../../../constants/constants";
import { Content } from "antd/es/layout/layout";
import { FaRegTrashCan } from "react-icons/fa6";
import { getCart, getDeviceId, removeFromCart } from "./cart";
import { addToBill, clearBill, getBill } from "./bill";
import { useProduct } from "../../../store/ProductContext";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { set, size } from "lodash";
import axios from "axios";
import {
  apiFindVoucherValid,
  apiSetQuantityCart,
  apiVoucherBest,
} from "./apiCart";
import { addToVoucher } from "./voucher";
import { LuTicket } from "react-icons/lu";

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const { updateProducts } = useProduct();
  const [selectedRitem, setSelecteditem] = useState([]);
  const [voucherValid, setVoucherValid] = useState([]);
  const [voucherBests, setVoucherBest] = useState([]);

  const [discountCode, setDiscountCode] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [products, setProducts] = useState(getCart());
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  ); // Lấy user từ localStorage
  const [pageCart, setPageCart] = useState({
    current: 1,
    pageSize: 10,
  });
  useEffect(() => {
    vouchersValid();
    voucherBest();
  }, [selectedRowKeys]);
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart();
    };

    // Đăng ký sự kiện khi localStorage thay đổi hoặc giỏ hàng cập nhật
    window.addEventListener("storage", handleCartUpdate);
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Fetch ngay khi component mount
    fetchCart();

    return () => {
      window.removeEventListener("storage", handleCartUpdate);
      window.removeEventListener("cartUpdated", handleCartUpdate);

      console.log("Thêm vào bill khi unmount", getBill());
      // clearBill(); // Nếu cần xóa bill khi unmount
    };
  }, [user?.id, pageCart.current, pageCart.pageSize]); // Depend vào user.id & phân trang
  const fetchCart = async () => {
    if (user?.id) {
      // Đảm bảo user có id
      try {
        const response = await axios.get(
          "http://localhost:8080/api/client/getallcartforcustomerid",
          {
            params: {
              customerId: user.id,
              page: pageCart.current,
              size: pageCart.pageSize,
            },
          }
        );

        setProducts(response.data?.data || []); // Nếu không có data, trả về mảng rỗng
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setProducts([]); // Đảm bảo không bị crash giao diện
      }
    } else {
      setProducts(getCart()); // Lấy từ localStorage nếu chưa đăng nhập
    }
  };
  const vouchersValid = async () => {
    try {
      const res = await apiFindVoucherValid({ customerId: user?.id });
      setVoucherValid(res.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    }
  };
  const voucherBest = async () => {
    try {
      const res = await apiVoucherBest({
        customerId: user?.id,
        totalBillMoney: totalSelectedPrice,
      });
      setVoucherBest(res.data);
      setDiscountCode(res.data?.voucher?.id);
      setDiscount(0);
      setAppliedDiscount("");
      console.log("vocher", res.data?.voucher?.id);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    }
  };
  const deleteItemInCart = async (cartDetailId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/client/delete/${cartDetailId}`
      );
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi khi xóa", error);
    }
  };
  const handleRemoveFromCart = (productDetailId) => {
    // Lọc bỏ sản phẩm đã xóa khỏi giỏ hàng
    const updatedProducts = products.filter(
      (product) => product.productDetailId !== productDetailId
    );

    setProducts(updatedProducts); // Cập nhật lại danh sách sản phẩm
    localStorage.setItem(
      `cart_${getDeviceId()}`,
      JSON.stringify(updatedProducts)
    );
    window.dispatchEvent(new Event("cartUpdated"));

    // Cập nhật lại danh sách sản phẩm đã chọn
    // láy những sp ko giống với sp đã xóa và set lại
    const updatedSelectedKeys = selectedRowKeys.filter(
      (index) => products[index]?.productDetailId !== productDetailId
    );
    setSelectedRowKeys(updatedSelectedKeys);
  };

  const handleQuantityChange = async (index, value) => {
    if (value < 1) return; // Đảm bảo không có số lượng nhỏ hơn 1
    if (user) {
      try {
        try {
          console.log("ddddddddddddđ", products);

          const res = await apiSetQuantityCart({
            cartDetailid: products[index]?.cartDetailId,
            quantity: value,
          });
          console.log("số lượng ", res);
          fetchCart();
        } catch (error) {
          message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
        }
      } catch (error) {}
    } else {
      const updatedProducts = [...products];
      updatedProducts[index].quantityAddCart = value;

      setProducts(updatedProducts); // Cập nhật state
      localStorage.setItem(
        `cart_${getDeviceId()}`,
        JSON.stringify(updatedProducts)
      ); // Lưu lại vào localStorage
    }
  };

  const applyDiscount = () => {
    const selectedVoucher = voucherValid.find((v) => v.id === discountCode);
    if (!selectedVoucher) {
      setDiscount(0);
      setAppliedDiscount(null);
      message.error("Mã giảm giá không hợp lệ!");
      return;
    }
    console.log("ádsadsadsads", selectedVoucher);

    const {
      voucherCode,
      discountValue,
      discountType,
      discountMaxValue,
      billMinValue,
    } = selectedVoucher;
    if (totalSelectedPrice < billMinValue) {
      message.error(
        "Giá trị đơn hàng chưa đạt mức tối thiểu để áp dụng voucher!"
      );
      return;
    }

    let discountAmount = 0;
    if (discountType === "PERCENT") {
      discountAmount = (totalSelectedPrice * discountValue) / 100;
      discountAmount = Math.min(discountAmount, discountMaxValue);
      setDiscountType("PERCENT");
    } else if (discountType === "MONEY") {
      discountAmount = Math.min(discountValue, totalSelectedPrice);
      setDiscountType("MONEY");
    }

    setDiscount(discountAmount);
    console.log("diacount giảm giA", discount);

    setAppliedDiscount(
      `Mã ${voucherCode} - Giảm ${discountAmount.toLocaleString()} đ`
    );
    message.success("Mã giảm giá đã được áp dụng!");
  };

  const totalSelectedPrice = selectedRowKeys.reduce(
    (acc, index) =>
      acc + products[index]?.quantityAddCart * products[index]?.price,
    0
  );

  const calculateDiscountedTotal = () => totalSelectedPrice - discount;
  const discountedTotal = calculateDiscountedTotal();

  useEffect(() => {
    if (selectedRowKeys.length === 0) return; // Nếu không có hàng nào được chọn, không làm gì cả

    // Tìm những sản phẩm có key nằm trong selectedRowKeys
    const selectedItems = products.filter((_, index) =>
      selectedRowKeys.includes(index)
    );
    setSelecteditem(selectedItems);
    console.log(
      "🔍 Danh sách sản phẩm được chọn:",
      selectedItems,
      selectedRowKeys
    );
  }, [selectedRowKeys]);

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
          <img
            src={
              record.image
                ? record.image
                : "https://placehold.co/10x10?text=No+Image"
            }
            alt={"anhsp"}
            width={60}
          />
          <Text>
            {record.colorName
              ? `${record.productName}[${record.colorName}-${record.sizeName}]`
              : `${record.productName}`}
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
            onClick={() =>
              handleQuantityChange(
                index,
                Math.max(1, record.quantityAddCart - 1)
              )
            }
          />
          <InputNumber
            min={1}
            max={100}
            value={record.quantityAddCart}
            onChange={(value) => handleQuantityChange(index, value)}
            style={{ width: "50px" }}
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() =>
              handleQuantityChange(index, record.quantityAddCart + 1)
            }
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
                    if (user?.id) {
                      deleteItemInCart(record.cartDetailId);
                    } else {
                      handleRemoveFromCart(record.productDetailId);
                    }
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
              <Text style={{fontWeight:"bold"}}>Giỏ hàng</Text>
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
              <p style={{ minHeight: "25px" }}>
                <Text type={appliedDiscount ? "success" : undefined}>
                  {appliedDiscount || ""}
                </Text>
              </p>

              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    // handleButtonClick("Mua ngay thành công!");
                    if (selectedRitem.length > 0) {
                      const vocher = {
                        voucherId: discountCode || null, // ID của voucher nếu có
                        totalAfterDiscount: discountedTotal, // Tổng tiền sau giảm giá
                        discountValue: discount || null,
                        note: appliedDiscount || null,
                      };

                      updateProducts(selectedRitem);
                      addToBill(selectedRitem);
                      addToVoucher(vocher);
                      navigate("/payment");
                      toast.success("xác nhận mua hàng");
                    } else {
                      toast.warn("chưa chọn sản phẩm nào");
                    }
                  }}
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
                <Row gutter={1} justify={"space-between"}>
                  <Col>
                    {" "}
                    <LuTicket
                      size={29}
                      style={{ color: `${COLORS.primary}` }}
                    />
                  </Col>
                  <Col>
                    {" "}
                    <Select
                      showSearch
                      style={{ width: "100%", minWidth: 300 }} // Mở rộng ô chọn
                      placeholder="Chọn voucher"
                      optionLabelProp="label"
                      value={discountCode}
                      dropdownStyle={{ width: "auto", minWidth: 400 }} // Mở rộng dropdown
                      onChange={(value) => {
                        setDiscountCode(value);
                        console.log("diacadiecode", discountCode);
                      }}
                    >
                      {voucherValid?.map((item) => (
                        <Select.Option
                          key={item.id}
                          value={item.id}
                          label={item.voucherCode}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              height: "120px",
                            }}
                          >
                            {/* Ảnh thương hiệu */}
                            <div className={styles.coupon}>
                              <img
                                src={
                                  item.image ||
                                  "https://down-vn.img.susercontent.com/file/vn-11134004-7ras8-m4re2imocx9s72.webp"
                                }
                                alt={item.voucherCode}
                                style={{ width: "70px" }}
                              />
                            </div>

                            {/* Thông tin voucher */}
                            <div>
                              <strong>{item.voucherCode}</strong>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 12,
                                  color: "#888",
                                }}
                              >
                                Giảm {item.discountValue} {item.discountType} -{" "}
                                <br />
                                Tối đa {item.discountMaxValue}đ
                              </p>
                              <Text type="success">
                                Đơn tối thiểu {item.billMinValue} đ
                              </Text>
                              <p>
                                <Text type="warning">
                                  Số lượng {item.quantity}
                                </Text>
                              </p>
                            </div>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>

                  <Button type="primary" onClick={applyDiscount}>
                    Áp dụng
                  </Button>
                </Row>
                <div>
                  {" "}
                  <Text type="success" className="pt-10">
                    {voucherBests.note}
                  </Text>
                </div>
              </Content>
            </Content>
          </Col>
        </Row>
      </Content>
    </div>
  );
};

export default CartPage;
