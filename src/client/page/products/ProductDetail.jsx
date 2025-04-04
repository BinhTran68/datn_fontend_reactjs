import {
  Button,
  Card,
  Col,
  Flex,
  Image,
  Input,
  InputNumber,
  message,
  notification,
  Radio,
  Row,
  Space,
} from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { COLORS } from "../../../constants/constants";
import { FaCartPlus } from "react-icons/fa6";
import Title from "antd/es/skeleton/Title";
import PropProduct from "./PropProduct";
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import SizeChart from "./SizeChart";
import { FcBusinessman } from "react-icons/fc";
import { FcNext } from "react-icons/fc";
import {
  apiAddCart,
  apiGetColorsOfProduct,
  apigetProductDetail,
  apiGetSizesOfProduct,
  apiGetSizesOfProductAndColor,
  getAllProducthadViewsDesc,
} from "./api";
import { addToCart, clearCart, getCart } from "../cart/cart.js";
import GetProductDetail from "../../../admin/product/Product/GetProductDetail";
import { addToBill, clearBill } from "../cart/bill.js";
import { toast } from "react-toastify";
import CommentSection from "./CommentSection.jsx";
import { clearVoucher } from "../cart/voucher.js";

function ProductDetail() {
  const [searchParams] = useSearchParams(); // Lấy query parameters từ URL
  const { productId } = useParams();
  // const productId = searchParams.get("productId");
  const colorId = searchParams.get("colorId");
  const sizeId = searchParams.get("sizeId");
  // const products = {
  //   name: "Nike - Giày thời trang thể thao Nữ Air Max SC Women's Shoes",
  //   price: 50000,
  //   promotion: "giảm 20%",
  //   sale: "342",
  //   url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
  //   statusSale: "Best Sale",
  // };
  // const productDetail = {
  //   productName: "Giày Nike Wmns Air Jordan 1 Low ‘White Wolf Grey’ DC0774-105",
  //   image: [
  //     {
  //       url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
  //       publicId: "abc",
  //     },
  //     {
  //       url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
  //       publicId: "abc",
  //     },
  //     {
  //       url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
  //       publicId: "abc",
  //     },
  //     {
  //       url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
  //       publicId: "abc",
  //     },
  //     {
  //       url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
  //       publicId: "abc",
  //     },
  //   ],
  //   price: 200000,
  //   quantity: 12,
  //   colorName: "xanh",
  //   brandName: "Nike",
  //   sizeName: "20",
  //   materialName: "lether",
  //   typeName: "Nam",
  //   genderName: "Nam",
  //   soleName: "đế giày",
  //   description: "mô tả về giày",
  // };
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(Number(sizeId));
  const [color, setColor] = useState(Number(colorId));

  const [quantityAddCart, setQuantityAddCart] = useState(1);

  const [sizeChartModal, setSizeChartModal] = useState(false);
  const [getProductDetail, setGetProductDetail] = useState({});
  const [sizes, setSizes] = useState([]);
  const [sizesOfColor, setSizesOfColor] = useState([]);
  const [colors, setColors] = useState([]);
  const [productHadviewsDescs, setProductHadviewsDescs] = useState();
  const [PageProductHadviewsDescs, setPageProductHadviewsDescs] = useState({
    current: 1,
    pageSize: 6,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(id);
    console.log(
      "🛒 Đây là user hiện tại:",
      JSON.parse(localStorage.getItem(`user`)) || []
    );
    getProductDetails(productId, colorId, sizeId);
    getSizesOfProductAndColors(productId, colorId);
    getColorsOfProduct(productId);
    getSizesOfProduct(productId);
    getAllProductHadViewsDescs();
    clearBill();
    clearVoucher()
  }, [productId, colorId, sizeId]);
  // Khi thay đổi color, cập nhật danh sách size tương ứng
  useEffect(() => {
    const fetchSizesAndProductDetails = async () => {
      if (productId && color) {
        try {
          const sizesData = await getSizesOfProductAndColors(productId, color);

          if (Array.isArray(sizesData) && sizesData.length > 0) {
            setSize(sizesData[0].id); // Cập nhật size với giá trị đầu tiên trong danh sách
            await getProductDetails(productId, color, sizesData[0].id); // Gọi API sau khi đã có size
          } else {
            setSize(null); // Nếu không có size nào, reset size
          }
        } catch (error) {
          console.error("Error fetching sizes or product details:", error);
        }
      }
    };

    fetchSizesAndProductDetails();
  }, [color]);

  // Khi thay đổi size, cập nhật chi tiết sản phẩm
  useEffect(() => {
    if (productId && color && size) {
      getProductDetails(productId, color, size);
    }
  }, [size]);

  // Khi danh sách size của color thay đổi, chọn giá trị đầu tiên làm default
  useEffect(() => {
    if (sizesOfColor.length > 0) {
      setSize(sizesOfColor[0]?.id);
    }
  }, [sizesOfColor]);

  const getAllProductHadViewsDescs = async () => {
    setLoading(true);
    try {
      const response = await getAllProducthadViewsDesc(
        PageProductHadviewsDescs
      );
      console.log(
        "Response tất cá sản phẩm có view từ nhiều tới ít:",
        response
      ); // Log response để kiểm tra dữ liệu trả về
      setProductHadviewsDescs(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const getProductDetails = async (productId, colorId, sizeId) => {
    setLoading(true);
    try {
      const response = await apigetProductDetail(productId, colorId, sizeId);
      console.log("Response get product detail:", response); // Log response để kiểm tra dữ liệu trả về
      setGetProductDetail(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const getSizesOfProduct = async (productId) => {
    setLoading(true);
    try {
      const response = await apiGetSizesOfProduct(productId);
      console.log("Response get sizes:", response); // Log response để kiểm tra dữ liệu trả về
      setSizes(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const getSizesOfProductAndColors = async (productId, colorId) => {
    setLoading(true);
    try {
      const response = await apiGetSizesOfProductAndColor(productId, colorId);
      console.log("Response get sizes of product and color:", response); // Log response để kiểm tra dữ liệu trả về
      setSizesOfColor(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const getColorsOfProduct = async (productId) => {
    setLoading(true);
    try {
      const response = await apiGetColorsOfProduct(productId);
      console.log("Response get colors:", response); // Log response để kiểm tra dữ liệu trả về
      setColors(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const addProductToCart = async (productAddCart) => {
    setLoading(true);
    try {
      const response = await apiAddCart(productAddCart);
      console.log("Response add cart:", response); // Log response để kiểm tra dữ liệu trả về
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Content
        style={{
          backgroundColor: "white",
          paddingTop: "3rem",
          paddingBottom: "3rem",
        }}
      >
        <Row>
          <Col span={11}>
            <Row justify="center">
              <Col
                span={24}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Image
                  alt="Sản phẩm"
                  src={
                    getProductDetail?.image?.length > 0
                      ? getProductDetail.image[0]?.url
                      : "https://placehold.co/500x550?text=No+Image" // Ảnh placeholder nếu không có ảnh sản phẩm
                  }
                  style={{
                    height: "550px",
                    width: "500px",
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor:
                      getProductDetail?.image?.length > 0
                        ? "transparent"
                        : "#f5f5f5", // Nền xám nếu không có ảnh
                  }}
                />
              </Col>
              <Col
                span={24}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <Image.PreviewGroup>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {(getProductDetail.image?.length > 0
                      ? getProductDetail.image
                      : Array(5).fill(null)
                    )
                      .slice(0, 5) // Đảm bảo chỉ lấy tối đa 5 ảnh hoặc placeholder
                      .map((item, index) => (
                        <Image
                          key={index}
                          width={80}
                          height={90}
                          src={
                            item
                              ? item.url
                              : "https://placehold.co/80x90?text=No+Image"
                          } // Nếu không có ảnh, hiển thị placeholder
                          alt={item ? `Ảnh ${index + 1}` : "Không có ảnh"}
                          style={{
                            objectFit: "cover",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            backgroundColor: item ? "transparent" : "#f5f5f5", // Nền xám nhẹ nếu không có ảnh
                          }}
                        />
                      ))}
                  </div>
                </Image.PreviewGroup>
              </Col>
            </Row>
          </Col>
          <Col span={13} style={{ position: "relative", minHeight: "300px" }}>
            <Col span={24}>
              <h3>{getProductDetail.productName}</h3>
            </Col>
            <Col
              span={24}
              style={{
                backgroundColor: "#f3702110",
                color: `${COLORS.pending}`,
                padding: "20px",
                marginLeft: "1rem",
              }}
            >
              <h2>
                {getProductDetail.promotion?.discountValue ? (
                  <div>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 1, // Hiển thị tối thiểu 2 chữ số sau dấu phẩy
                      maximumFractionDigits: 1, // Giới hạn tối đa 2 chữ số sau dấu phẩy
                    }).format(
                      getProductDetail.price -
                        (getProductDetail.price *
                          getProductDetail.promotion?.discountValue) /
                          100
                    )}{" "}
                    <span
                      style={{
                        textDecoration: "line-through",
                        marginLeft: "8px",
                        fontSize: "1.5rem",
                        color: "GrayText",
                      }}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      }).format(getProductDetail.price)}
                    </span>
                    <sup style={{fontSize:"2rem", color:"red"}}>-{getProductDetail.promotion?.discountValue}%</sup>
                  </div>
                ) : (
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    // minimumFractionDigits: 1,
                    // maximumFractionDigits: 1,
                  }).format(getProductDetail.price)
                )}
              </h2>
            </Col>
            <Row gutter={[20, 30]}>
              <Col
                span={24}
                style={{
                  marginTop: "3rem",
                }}
              >
                <Row>
                  <Col span={6}>Vận chuyển</Col>
                  <Col span={18}>Giao hàng nhanh</Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={6}>Màu sắc</Col>
                  <Col span={18}>
                    <Col span={18}>
                      <Radio.Group
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      >
                        <Space>
                          {Array.isArray(colors) &&
                            colors.map((item) => (
                              <Radio.Button
                                key={item.id}
                                value={item.id}
                                style={{
                                  borderRadius: "10px",
                                  border: "1px solid #ccc",
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "8px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "1rem",
                                      height: "1rem",
                                      borderRadius: "50%",
                                      backgroundColor: item.code,
                                      border: "1px solid gray",
                                    }}
                                  />
                                  <span>{item.colorName}</span>
                                </div>
                              </Radio.Button>
                            ))}
                        </Space>
                      </Radio.Group>
                    </Col>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={6}>Kích cỡ</Col>
                  <Col span={18}>
                    <Radio.Group
                      value={size}
                      onChange={(e) => {
                        setSize(e.target.value);
                      }}
                    >
                      <Space>
                        {sizes.map((item) => (
                          <Radio.Button
                            key={item.id}
                            value={item.id}
                            disabled={
                              !sizesOfColor.some((size) => size.id === item.id)
                            } // Đúng logic disable
                            style={{
                              borderRadius: "10px",
                              border: "1px solid #ccc",
                            }}
                          >
                            {item.sizeName}
                          </Radio.Button>
                        ))}
                      </Space>
                    </Radio.Group>

                    <Col
                      style={{ cursor: "pointer", paddingTop: "1rem" }}
                      onClick={() => {
                        setSizeChartModal(true);
                      }}
                    >
                      Bảng quy Đổi kích cỡ <FcNext />
                    </Col>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={6}>Số lượng</Col>
                  <Col span={18}>
                    <InputNumber
                      defaultValue={1}
                      value={quantityAddCart}
                      min={1}
                      max={getProductDetail.quantity}
                      onChange={(value) => {
                        setQuantityAddCart(value); // Cập nhật state khi thay đổi số lượng
                      }}
                    />
                    <div>Số lượng còn: {getProductDetail.quantity}</div>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={6}>Ưu đãi, giảm giá</Col>
                  <Col span={18}>Vocher, giảm giá</Col>
                </Row>
              </Col>
              <Col
                style={{ position: "absolute", bottom: "0rem", width: "100%" }}
              >
                <Space>
                  {/* Nút "Thêm Vào Giỏ Hàng" */}
                  <Button
                    type="default"
                    style={{
                      color: `${COLORS.pending}`,
                      borderColor: `${COLORS.primary}`,
                      backgroundColor: `${COLORS.backgroundcolor2}`,
                      padding: "25px",
                    }}
                    onClick={async () => {
                      // clearCart()
                      const user = JSON.parse(localStorage.getItem(`user`));
                      if (quantityAddCart > getProductDetail.quantity) {
                        toast.warn(
                          "số lượng thêm vào giỏ hàng phải nhỏ hơn số lượng sản phẩm có"
                        );
                        return;
                      }
                      if (user) {
                        await addProductToCart({
                          customerId: user.id,
                          productDetailId: getProductDetail.id,
                          quantityAddCart: quantityAddCart,
                          price: getProductDetail.promotion?.discountValue
                            ? getProductDetail.price -
                              (getProductDetail.price *
                                getProductDetail.promotion.discountValue) /
                                100
                            : getProductDetail.price,
                          productName: `${getProductDetail.productName} [${getProductDetail.colorName}-${getProductDetail.sizeName}]`,
                          image: getProductDetail.image[0]?.url || "",
                        });
                        window.dispatchEvent(new Event("cartUpdated"));
                      } else {
                        addToCart({
                          productDetailId: getProductDetail.id,
                          quantityAddCart: quantityAddCart,
                          price: getProductDetail.promotion?.discountValue
                            ? getProductDetail.price -
                              (getProductDetail.price *
                                getProductDetail.promotion.discountValue) /
                                100
                            : getProductDetail.price,
                          productName: getProductDetail.productName,
                          image: getProductDetail.image[0]?.url || "",
                          sizeName: getProductDetail.sizeName,
                          colorName: getProductDetail.colorName,
                        });
                        window.dispatchEvent(new Event("cartUpdated"));
                      }

                      // notification.success({
                      //   message: "Success",
                      //   duration: 4,
                      //   pauseOnHover: false,
                      //   showProgress: true,
                      //   description: `Thêm vào giỏ hàng thành công!`,
                      // });
                      toast.success("Thêm vào giỏ hàng thành công!");
                      console.log(getCart());
                    }}
                  >
                    <FaCartPlus size={23} />
                    Thêm Vào Giỏ Hàng
                  </Button>

                  {/* Nút "Mua Ngay" */}
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: `${COLORS.primary}`,
                      borderColor: "#E44D26",
                      padding: "25px",
                    }}
                    onClick={() => {
                      if (quantityAddCart > getProductDetail.quantity) {
                        toast.warn(
                          "số lượng thêm vào giỏ hàng phải nhỏ hơn số lượng sản phẩm có"
                        );
                        return;
                      }
                      addToBill({
                        productDetailId: getProductDetail.id,
                        quantityAddCart: quantityAddCart,
                        price: getProductDetail.promotion?.discountValue
                        ? getProductDetail.price -
                          (getProductDetail.price *
                            getProductDetail.promotion.discountValue) /
                            100
                        : getProductDetail.price,                        productName: getProductDetail.productName,
                        image: getProductDetail.image[0]?.url || "",
                        sizeName: getProductDetail.sizeName,
                        colorName: getProductDetail.colorName,
                      });
                      navigate("/payment");
                      toast.success("xác nhận mua hàng");
                    }}
                  >
                    Mua Ngay
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
      <Content
        style={{ backgroundColor: "white", padding: "20px", marginTop: "1rem" }}
      >
        <Row>
          <Col
            span={24}
            style={{
              backgroundColor: `${COLORS.backgroundcolor2}`,
              padding: "15px",
              color: `${COLORS.pending}`,
            }}
          >
            CHI TIẾT SẢN PHẨM
          </Col>
          <Row span={24} style={{ marginLeft: "3rem", margin: "1rem" }}>
            <Col
              span={24}
              style={{
                marginTop: "1rem",
              }}
            >
              <Row>
                <Col span={6}>Tên giày</Col>
                <Col span={18}>{getProductDetail.brandName}</Col>
              </Row>
            </Col>
            <Col
              span={24}
              style={{
                marginTop: "1rem",
              }}
            >
              <Row>
                <Col span={6}>Loại giày</Col>
                <Col span={18}>{getProductDetail.typeName}</Col>
              </Row>
            </Col>
            <Col
              span={24}
              style={{
                marginTop: "1rem",
              }}
            >
              <Row>
                <Col span={6}>Thương hiệu</Col>
                <Col span={18}>{getProductDetail.brandName}</Col>
              </Row>
            </Col>
            <Col
              span={24}
              style={{
                marginTop: "1rem",
              }}
            >
              <Row>
                <Col span={6}>Màu sắc</Col>
                <Col span={18}>{getProductDetail.colorName}</Col>
              </Row>
            </Col>

            <Col
              span={24}
              style={{
                marginTop: "1rem",
              }}
            >
              <Row>
                <Col span={6}>Chất liệu</Col>
                <Col span={18}>{getProductDetail.materialName}</Col>
              </Row>
            </Col>
            <Col
              span={24}
              style={{
                marginTop: "1rem",
              }}
            >
              <Row>
                <Col span={6}>Đế giày</Col>
                <Col span={18}>{getProductDetail.soleName}</Col>
              </Row>
            </Col>
            <Col
              span={24}
              style={{
                marginTop: "1rem",
              }}
            >
              <Row>
                <Col span={6}>Số lượng</Col>
                <Col span={18}>{getProductDetail.quantity}</Col>
              </Row>
            </Col>
          </Row>
        </Row>
        <Row justify="center">
          <Col
            span={24}
            style={{
              backgroundColor: `${COLORS.backgroundcolor2}`,
              padding: "15px",
              color: `${COLORS.pending}`,
            }}
          >
            Mô TẢ SẢN PHẨM
          </Col>
          <Col style={{ marginLeft: "1rem", margin: "1rem" }}>
            {getProductDetail.description}
            ▶️ HƯỚNG DẪN SỬ DỤNG VÀ BẢO QUẢN GIÀY : Để đôi giày của bạn luôn bền
            đẹp và giữ được chất lượng lâu dài, vui lòng lưu ý một số hướng dẫn
            sau:
            <br /> 👉Giặt giày đúng cách: Tránh sử dụng các chất tẩy rửa mạnh
            như thuốc tẩy, thay vào đó bạn có thể sử dụng các nguyên liệu tự
            nhiên để làm sạch như vỏ chuối, sữa tươi, giấm… Giúp giày sạch sẽ mà
            không làm hư hại chất liệu.
            <br /> 👉Không ngâm giày quá lâu trong nước: Việc ngâm giày trong
            nước lâu có thể làm giảm độ bền của chất liệu, đặc biệt là các loại
            da, vải hay cao su.
            <br /> 👉Vệ sinh thường xuyên với sản phẩm sáng màu: Với các đôi
            giày có màu sáng, bạn nên vệ sinh giày thường xuyên để giữ màu sắc
            tươi mới và tránh vết bẩn bám lâu ngày khó làm sạch.
            <br /> 👉Cất giữ giày đúng cách: Tránh để giày ướt hoặc ẩm ướt khi
            cất giữ, vì điều này có thể gây mùi và làm giảm tuổi thọ của giày.
            Hãy để giày khô thoáng trước khi cất trong tủ.
            <br /> ▶️CHÍNH SÁCH BẢO HÀNH VÀ DỊCH VỤ CHĂM SÓC KHÁCH HÀNG Chúng
            tôi cam kết mang đến sự hài lòng tuyệt đối cho khách hàng với chính
            sách bảo hành và chăm sóc chu đáo:
            <br /> 👉Bảo hành 15 ngày: Bạn sẽ được bảo hành miễn phí trong 15
            ngày kể từ ngày nhận sản phẩm nếu giày bị lỗi từ nhà sản xuất hoặc
            không đúng mẫu mã. Miễn phí đổi trả: Nếu sản phẩm gặp phải sự cố như
            sai size, lỗi sản phẩm, chúng tôi sẽ hỗ trợ đổi trả hoàn toàn miễn
            phí. Chính sách đổi sản phẩm: Quý khách có thể đổi sản phẩm mới có
            giá trị tương đương hoặc cao hơn so với sản phẩm cũ, giúp bạn dễ
            dàng tìm được sản phẩm phù hợp hơn.
            <br /> 👉Chỉ đổi trả 1 lần: Mỗi sản phẩm chỉ có thể đổi trả 1 lần
            duy nhất, vì vậy hãy chắc chắn chọn lựa sản phẩm kỹ càng trước khi
            quyết định đổi.
            <br /> ▶️CẢM ƠN QUÝ KHÁCH Chúng tôi rất cảm ơn quý khách đã tin
            tưởng và ủng hộ shop. Đừng quên nhấn "Theo dõi" để cập nhật những
            sản phẩm mới nhất, ưu đãi hấp dẫn, cũng như thông tin giảm giá đặc
            biệt từ shop. Chúng tôi luôn sẵn sàng phục vụ và mang đến cho bạn
            những trải nghiệm mua sắm tuyệt vời!
          </Col>
        </Row>
      </Content>

      <Content
        style={{ backgroundColor: "white", padding: "20px", marginTop: "1rem" }}
      >
        <Row justify="center">
          <Col
            span={24}
            style={{
              backgroundColor: `${COLORS.backgroundcolor2}`,
              padding: "15px",
              color: `${COLORS.pending}`,
            }}
          >
            DÁNH GIÁ SẢN PHẨM
          </Col>
          <Col span={24}>
            <CommentSection id={getProductDetail.id} />
          </Col>
        </Row>
      </Content>

      <Content
        style={{ backgroundColor: "white", padding: "20px", marginTop: "1rem" }}
      >
        <Row justify="center">
          <Col
            span={24}
            style={{
              backgroundColor: "#FAFAFA",
              padding: "15px",
              color: `${COLORS.pending}`,
            }}
          >
            SẢN PHẨM NỔI BẬT
          </Col>
          <Col span={24}>
            <Row gutter={[5, 5]}>
              {productHadviewsDescs?.map((product, index) => (
                <Col
                  key={index}
                  span={4}
                  onClick={() => {
                    window.location.replace(
                      `/products/product-detail/${product.productId}?colorId=${product.colorId}&sizeId=${product.sizeId}`
                    );
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <PropProduct
                    product={{
                      name:
                        product.productName?.trim() || "Sản phẩm chưa có tên",
                      price: product.price ?? 0,
                      promotion:
                        product.promotionName === "Không có khuyến mãi"
                          ? null
                          : product.promotionName,
                      sale: product.sold ?? 0,
                      url: product.imageUrl || "https://placehold.co/100",
                      views: product.views ?? 0,
                      rate: product.rate ?? 5,
                    }}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Content>
      <SizeChart
        onOpen={sizeChartModal}
        onCancel={() => {
          setSizeChartModal(false);
        }}
      />
    </>
  );
}

export default ProductDetail;
