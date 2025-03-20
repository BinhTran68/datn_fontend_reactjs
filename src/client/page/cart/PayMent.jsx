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
  Switch,
  Flex,
} from "antd";
import { LuTicket } from "react-icons/lu";
import { useForm, Controller, get, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
// import AddressSelector from "../../../admin/utils/AddressSelectorAntd";
import AddressSelectorGHN from "../../componetC/AddressSelectorGHN";
import {
  calculateShippingFee,
  generateAddressString,
} from "../../componetC/apiGHN";
import moment from "moment/moment";
import { useProduct } from "../../../store/ProductContext";
import { clearBill, getBill } from "./bill";
import { formatVND } from "../../../helpers/Helpers";
import { useNavigate } from "react-router-dom";
import { FcAbout, FcShipped } from "react-icons/fc";
import { apiCreateBillClient } from "./payment";
import { clearVoucher, getVoucher } from "./voucher";
import { COLORS } from "../../../constants/constants";
import { removeBillFromCart } from "./cart";
import { FaLocationDot } from "react-icons/fa6";
import { apiGetAddressDefaut } from "./apiPayment";

const { Option } = Select;

// Schema validation

const schema = yup.object().shape({
  fullName: yup.string().required("Vui lòng nhập họ và tên."),
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
  // notes: yup.string()("Vui lòng nhập lưu ý khi giao hàng."),
});

// Hàm chuyển đổi giá từ string thành số
const parsePrice = (price) => {
  if (typeof price === "number") return price; // Nếu đã là số, trả về luôn
  if (!price || typeof price !== "string") return 0; // Nếu `price` null/undefined, trả về 0
  return Number(price.replace(/[^\d]/g, "")); // Xóa ký tự không phải số
};

const PayMent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  ); // Lấy user từ localStorage
  const [billDone, setBillDone] = useState(); // 1 mảng các sản phẩm
  const [loading, setLoading] = useState(false); // 1 mảng các sản phẩm
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [fullAddress, setFullAddress] = useState("Đang tải...");
  const [productData, setProductData] = useState(getBill()); // 1 mảng các sản phẩm
  const [voucher, setVoucher] = useState(getVoucher()); // 1 mảng các sản phẩm
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [bill, setbill] = useState({
    paymentMethodsType: "COD",
    customerId: null,
    customerMoney: null,
    discountMoney: 0,
    totalMoney: 0,
    moneyAfter: 0,
    desiredDateOfReceipt: null,
    shipDate: null,
    shippingAddressId: null,
    email: "string",
    notes: "string",
    voucherId: 0,
    recipientName: "string",
    recipientPhoneNumber: "string",
    shipMoney: 0,
    address: {
      provinceId: "string",
      districtId: "string",
      wardId: "string",
      isAddressDefault: true,
      specificAddress: "string",
    },
    billDetailRequests: getBill().map((item) => ({
      productDetailId: item.productDetailId,
      quantity: item.quantityAddCart, // Đảm bảo đúng field
      price: item.price,
      image: item.image,
    })),
  });
  useEffect(() => {
    console.log("🏠 Địa chỉ đã chọn:", selectedAddress);
  }, [selectedAddress]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phoneNumber || "",
      email: user?.email || "",
      notes: user?.address || "",
    },
  });
  // contexxt
  const { products } = useProduct(); // Lấy danh sách sản phẩm từ Context
  useEffect(() => {
    // setProductData(getBill());
    console.log("prodauct day nay", products);
    console.log("🛒 Đây là bill hiện tại:", getBill());
    console.log("🛒 vocher:", getVoucher());

    console.log("🛒 Đây là user hiện tại:", user || []);

    return () => {
      clearBill();
      clearVoucher();
    };
  }, []);

  useEffect(() => {
    if (user) {
      getAddressDf(user?.id);
    }
  }, [user]);

  useEffect(() => {
    setbill((prev) => ({
      ...prev,
      totalMoney: totalAmountNoship,
      moneyAfter: totalAmount,
    }));
  }, [bill?.shipMoney]);
  const getAddressDf = async (id) => {
    try {
      console.log("🔍 Gọi API lấy địa chỉ mặc định với ID:", id);
      const res = await apiGetAddressDefaut({ customerId: id });
      console.log("✅ Dữ liệu địa chỉ mặc định:", res);

      if (!res.data) {
        message.warning("Không tìm thấy địa chỉ mặc định!");
        return;
      }
      const newAddress = {
        provinceId: res.data?.provinceId || "",
        districtId: res.data?.districtId || "",
        wardId: res.data?.wardId || "",
        specificAddress: res.data?.specificAddress || "",
      };

      setSelectedAddress(newAddress);
      const totalFee = await calculateShippingFee({
        toWardCode: String(newAddress?.wardId),
        toDistrictId: Number(newAddress?.districtId),
      });
      setbill((prevbill) => ({
        ...prevbill,
        detailAddressShipping: newAddress,
        shipMoney: totalFee,
      }));
      generateAddressString(
        newAddress.provinceId,
        newAddress.districtId,
        newAddress.wardId,
        newAddress.specificAddress ?? ""
      ).then((address) => {
        setFullAddress(address);
      });

      console.log("📌 Địa chỉ mặc định sau khi cập nhật:", newAddress);
    } catch (error) {
      console.error("❌ Lỗi khi lấy địa chỉ mặc định:", error);
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

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

    const newAddress = {
      provinceId: selectedProvince,
      districtId: selectedDistrict,
      wardId: selectedWard,
      specificAddress: specificAddress ?? "",
    };

    setSelectedAddress(newAddress); // Lưu địa chỉ được chọn

    setbill((prevbill) => ({
      ...prevbill,
      detailAddressShipping: newAddress,
      shipMoney: totalFee,
    }));
    generateAddressString(
      selectedProvince,
      selectedDistrict,
      selectedWard,
      specificAddress ?? ""
    ).then((address) => {
      setFullAddress(address);
    });
  };

  const handlePaymentMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setPaymentMethod(selectedMethod);
    setbill((prev) => ({
      ...prev,
      paymentMethod: selectedMethod, // Cập nhật vào bill
    }));
  };
  // taohoas dơn
  const createBillClient = async () => {
    setLoading(true);
    try {
      const response = await apiCreateBillClient(bill);
      console.log("Response hóa dơn tạo:", response); // Log response để kiểm tra dữ liệu trả về
      setBillDone(response.data);
      return response.data;
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tạo hóa đơn.");
    } finally {
      setLoading(false);
    }
  };
  // Tính tổng tiền tự động
  const totalAmount = useMemo(() => {
    if (!productData || productData.length === 0) return 0; // Nếu chưa có dữ liệu, trả về 0

    let sum = productData.reduce(
      (sum, item) =>
        sum + parsePrice(item.price || 0) * (item.quantityAddCart || 1),
      0
    );
    sum =
      sum +
      parseFloat(bill?.shipMoney) -
      parseFloat(voucher[0]?.discountValue || 0);
    return sum;
  }, [productData, bill?.shipMoney]);
  const totalAmountNoship = useMemo(() => {
    if (!productData || productData.length === 0) return 0; // Nếu chưa có dữ liệu, trả về 0

    let sum = productData.reduce(
      (sum, item) =>
        sum + parsePrice(item.price || 0) * (item.quantityAddCart || 1),
      0
    );
    sum = sum - parseFloat(voucher[0]?.discountValue || 0);
    return sum;
  }, [productData, bill?.shipMoney]);
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
      title: "ĐƠN GIÁ",
      dataIndex: "price",
      key: "price",
      align: "right",
    },
    {
      title: "TẠM TÍNH",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (_, record) => (
        <Space>{record.price * record.quantityAddCart}đ</Space>
      ),
    },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = (data) => {
    if (
      !selectedAddress ||
      !selectedAddress.provinceId ||
      !selectedAddress.districtId ||
      !selectedAddress.wardId
    ) {
      message.error("Vui lòng chọn địa chỉ giao hàng trước khi đặt hàng!");
      return;
    }
    setbill((prev) => ({
      ...prev,
      recipientName: data.fullName,
      recipientPhoneNumber: data.phone,
      email: data.email,
      notes: data.notes,
      paymentMethodsType: paymentMethod, // Thêm phương thức thanh toán vào dữ liệu gửi đi
      customerId: user?.id || null,
      voucherId: voucher[0]?.voucherId,
      discountMoney: voucher[0]?.discountValue,
      // discountMoney: voucher[0]?.totalAfterDiscount,
    }));

    setIsSubmitting(true); // Đánh dấu đang submit
  };

  // Khi bill cập nhật xong thì gọi onSubmit
  useEffect(() => {
    const handleOrder = async () => {
      if (isSubmitting && productData.length > 0) {
        switch (paymentMethod) {
          case "ZALO_PAY": {
            console.log("✅ Bill sau khi cập nhật:", bill);
            setIsSubmitting(false); // Reset lại
            message.success("Đặt hàng thành công!");

            try {
              const data = await createBillClient();
              if (user) {
                if (data) {
                  window.location.href = data; // Chuyển hướng người dùng ngay lập tức
                } else {
                  alert("Lỗi khi tạo đơn hàng!");
                }
              } else {
                navigate("/warn-veritify");
              }
            } catch (error) {
              console.error("Lỗi khi tạo đơn hàng:", error);
              message.error("Đặt hàng thất bại!");
            }
            break;
          }

          default:
            console.log("✅ Bill sau khi cập nhật:", bill);
            setIsSubmitting(false);
            removeBillFromCart(productData);
            createBillClient();
            if (user) {
              message.success("Đặt hàng thành công!");
              navigate(
                `/success?status=1&&amount=${bill.moneyAfter}&&apptransid=ShipCod`
              );
            } else {
              navigate("/warn-veritify");
            }
        }
      } else if (productData.length <= 0 && isSubmitting) {
        message.warning("Không có sản phẩm!");
      }
    };

    handleOrder();
  }, [bill, isSubmitting]);

  const onSubmit = (data) => {
    console.log("Dữ liệu gửi đi:", data);
    console.log("đơn hàng đặt", bill);

    navigate(
      `/success?status=1&&amount=${bill.moneyAfter}&&apptransid=ShipCod`
    );

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
              label="Họ và tên người nhận"
              validateStatus={errors.fullName ? "error" : ""}
              help={errors.fullName?.message}
            >
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Nhập họ và tên" />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại người nhận"
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
              label="Email người nhận"
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
          </Form>
          <h5>Chọn địa chỉ nhận hàng</h5>
          {/* <AddressSelectorGHN onAddressChange={onAddressChange} /> */}

          <AddressSelectorGHN
            onAddressChange={onAddressChange}
            provinceId={selectedAddress?.provinceId || ""}
            districtId={selectedAddress?.districtId || ""}
            wardId={selectedAddress?.wardId || ""}
            specificAddressDefault={selectedAddress?.specificAddress || ""}
          />

          <Form.Item
            label="Lưu ý khi vận chuyển"
            validateStatus={errors.notes ? "error" : ""}
            help={errors.notes?.message}
          >
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  placeholder="Nhập lưu ý khi giao hàng"
                  maxLength={200}
                  minLength={0}
                />
              )}
            />
          </Form.Item>
        </Col>

        {/* Thông tin đơn hàng */}
        <Col span={12} style={{ padding: "1rem", border: "1px solid #ddd" }}>
          <Title level={5}>ĐƠN HÀNG CỦA BẠN</Title>
          <p>
            <FcAbout size={25} /> Anh/Chị: {watch("fullName")} , sdt:{" "}
            {watch("phone")}
          </p>
          <p>
            <FaLocationDot size={25} style={{ color: "#bd1727" }} />
            Địa chỉ nhận hàng: {fullAddress}{" "}
          </p>
          <Table
            columns={columns}
            dataSource={productData}
            pagination={false}
          />
          <Flex justify="space-between">
            <Col>
              <FcShipped size={27} /> Phí vận chuyển (GHN):{" "}
            </Col>
            + {formatVND(parseInt(bill?.shipMoney) || 0)}
          </Flex>

          {voucher.length > 0 && voucher[0].note && (
            <Flex justify="space-between">
              <Col>
                <LuTicket size={27} style={{ color: `${COLORS.primary}` }} />
                Voucher: {voucher[0].note}
              </Col>
              - {voucher[0].discountValue} đ
            </Flex>
          )}
          <Divider />
          <h3 style={{ textAlign: "right" }}>
            Tổng hóa đơn: {totalAmount?.toLocaleString()} ₫
          </h3>
          <Divider />
          <Radio.Group
            onChange={handlePaymentMethodChange}
            value={paymentMethod}
          >
            <div>
              <Radio value="ZALO_PAY">ZaloPay</Radio>
              <Paragraph type="secondary">
                Thực hiện thanh toán bằng ứng dụng zalo pay.
              </Paragraph>
            </div>
            {/* <img
              src="https://authentic-shoes.com/wp-content/uploads/2023/11/Screenshot-2023-11-24-at-23.19.42.png"
              alt="Bank transfer"
              width="300"
            /> */}

            <div>
              <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
            </div>
          </Radio.Group>
          <Button type="primary" block onClick={handleSubmit(handleFormSubmit)}>
            ĐẶT HÀNG
          </Button>
          <Paragraph type="secondary">
            Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng và tăng
            trải nghiệm sử dụng website. khi ấn đặt hàng chắc chắn rằng bạn đã
            đồng ý với <a style={{ color: "blue" }}> Chính sách mua hàng </a>
            của cửa hàng
          </Paragraph>
        </Col>
      </Row>
    </Content>
  );
};

export default PayMent;
