import {
  Button,
  Card,
  Col,
  Flex,
  Image,
  Input,
  InputNumber,
  Radio,
  Row,
  Space,
} from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useState } from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { COLORS } from "../../../constants/constants";
import { FaCartPlus } from "react-icons/fa6";
import Title from "antd/es/skeleton/Title";
import PropProduct from "../TestComponent/PropProduct";
import { Link } from "react-router-dom";
import SizeChart from "./SizeChart";
import { FcBusinessman } from "react-icons/fc";
import { FcNext } from "react-icons/fc";

function ProductDetail() {
  const products = {
    name: "Nike - Giày thời trang thể thao Nữ Air Max SC Women's Shoes",
    price: 50000,
    promotion: "giảm 20%",
    sale: "342",
    url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
    statusSale: "Best Sale",
  };
  const productDetail = {
    productName: "Giày Nike Wmns Air Jordan 1 Low ‘White Wolf Grey’ DC0774-105",
    image: [
      {
        url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
        publicId: "abc",
      },
      {
        url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
        publicId: "abc",
      },
      {
        url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
        publicId: "abc",
      },
      {
        url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
        publicId: "abc",
      },
      {
        url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
        publicId: "abc",
      },
    ],
    price: 200000,
    quantity: 12,
    colorName: "xanh",
    brandName: "Nike",
    sizeName: "20",
    materialName: "lether",
    typeName: "Nam",
    genderName: "Nam",
    soleName: "đế giày",
    description: "mô tả về giày",
  };
  const [size, setSize] = useState(null);
  const [sizeChartModal, setSizeChartModal] = useState(false);

  const sizes = [36, 36.5, 37.5, 38, 38.5];
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
                  src={productDetail.image[0]?.url}
                  style={{
                    height: "550px", // Kích thước cố định cho ảnh lớn
                    width: "500px", // Kích thước cố định cho ảnh lớn
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
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
                    {productDetail.image?.map((item, index) => (
                      <Image
                        key={index}
                        width={80} // Kích thước cố định cho ảnh nhỏ
                        height={90} // Kích thước cố định cho ảnh nhỏ
                        src={item.url}
                        alt={`Ảnh ${index + 1}`}
                        style={{
                          objectFit: "cover",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
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
              <h3>{productDetail.productName}</h3>
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
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                }).format(productDetail.price)}
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
                  <Col span={18}>Green</Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={6}>Kích cỡ</Col>
                  <Col span={18}>
                    <Radio.Group
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    >
                      <Space>
                        {sizes.map((item) => (
                          <Radio.Button
                            key={item}
                            value={item}
                            style={{
                              borderRadius: "10px",
                              //   padding: "8px 15px",
                              border: "1px solid #ccc",
                            }}
                          >
                            {item}
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
                    <InputNumber defaultValue={1} min={1} max={50} />
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
                <Col span={18}>{productDetail.brandName}</Col>
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
                <Col span={18}>{productDetail.typeName}</Col>
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
                <Col span={18}>{productDetail.brandName}</Col>
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
                <Col span={18}>{productDetail.colorName}</Col>
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
                <Col span={18}>{productDetail.materialName}</Col>
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
                <Col span={18}>{productDetail.soleName}</Col>
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
                <Col span={18}>{productDetail.quantity}</Col>
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
            {productDetail.description}
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
          <Col>
            Sougayilang X + 4 100M Dây câu PE bện siêu dòng Kéo tối đa 66LB Danh
            sách gói: 1pc dây câu Chi tiết sản phẩm: 1.Thương hiệu: Sougayilang
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
          <Col>
            <Row gutter={[16, 16]}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Col key={index} span={4}>
                  <PropProduct product={products} />
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
