import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Carousel,
  Button,
  Input,
  Typography,
  Divider,
  Space,
  message,
  Avatar,
  Flex,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  RightOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import PropProduct from "../products/PropProduct";
import { COLORS } from "../../../constants/constants";
import { apiAddViewProduct, getAllProducthadSoldDesc } from "../products/api";

const { Title, Text, Paragraph } = Typography;

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [productHadSolDescs, setProductHadSolDescs] = useState([]);
  const [pageProductHadSolDescs, setPageProductHadSolDescs] = useState({
    current: 1,
    pageSize: 8,
  });

  useEffect(() => {
    getAllProductHadSoldDescs();
  }, []);

  const getAllProductHadSoldDescs = async () => {
    setLoading(true);
    try {
      const response = await getAllProducthadSoldDesc(pageProductHadSolDescs);
      console.log(
        "Response tất cá sản phẩm có lươt bán từ nhiều tới ít:",
        response
      );
      setProductHadSolDescs(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const addViewProduct = async (productId) => {
    setLoading(true);
    try {
      await apiAddViewProduct(productId);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "men", name: "Giày Nam" },
    { id: "women", name: "Giày Nữ" },
    { id: "sport", name: "Giày Thể Thao" },
    { id: "casual", name: "Giày Casual" },
    { id: "sale", name: "Khuyến Mãi" },
  ];

  const banners = [
    {
      id: 1,
      image:
        "https://salt.tikicdn.com/ts/tmp/59/24/36/cea1f55d81620d5767ca2b8c09794a95.jpg",
      title: "BỘ SƯU TẬP MỚI NHẤT",
      subtitle: "Khám phá các mẫu giày mới nhất mùa này",
      link: "/collections/new",
    },
    {
      id: 2,
      image: "https://i.ytimg.com/vi/CXSko9ySpyo/maxresdefault.jpg",
      title: "GIẢM GIÁ LÊN ĐẾN 50%",
      subtitle: "Ưu đãi đặc biệt cho các mẫu giày hot nhất",
      link: "/collections/sale",
    },
    {
      id: 3,
      image:
        "https://png.pngtree.com/thumb_back/fw800/background/20220929/pngtree-shoes-promotion-banner-background-image_1466238.jpg",
      title: "GIÀY THỂ THAO CHÍNH HÃNG",
      subtitle: "Đa dạng mẫu mã từ các thương hiệu nổi tiếng",
      link: "/collections/sport",
    },
  ];

  const blogs = [
    {
      id: 1,
      title: "5 Cách phối đồ với giày sneaker trắng",
      image:
        "https://img.freepik.com/free-photo/white-high-top-sneakers-unisex-footwear-fashion_53876-106036.jpg",
      date: "05/03/2025",
    },
    {
      id: 2,
      title: "Hướng dẫn chọn size giày chuẩn",
      image:
        "https://img.freepik.com/free-photo/measuring-foot-size-with-ruler_23-2149860438.jpg",
      date: "27/02/2025",
    },
    {
      id: 3,
      title: "Cách bảo quản giày thể thao đúng cách",
      image:
        "https://img.freepik.com/free-photo/sports-shoe-pair-design-casual-leather_1203-6400.jpg",
      date: "15/02/2025",
    },
  ];

  const brands = [
    {
      name: "Nike",
      image: "https://1000logos.net/wp-content/uploads/2021/11/Nike-Logo.png",
    },
    {
      name: "Adidas",
      image:
        "https://1000logos.net/wp-content/uploads/2019/06/Adidas-Logo-1991.jpg",
    },
    {
      name: "Puma",
      image: "https://1000logos.net/wp-content/uploads/2017/05/PUMA-logo.jpg",
    },
    {
      name: "Converse",
      image:
        "https://1000logos.net/wp-content/uploads/2021/04/Converse-logo.png",
    },
    {
      name: "Vans",
      image:
        "https://1000logos.net/wp-content/uploads/2020/07/Vans-Logo-2016.jpg",
    },
  ];

  // Create CSS classes for hover effects using React's inline styles
  const categoryCardStyle = {
    height: 200,
    overflow: "hidden",
    position: "relative",
    cursor: "pointer",
  };

  const categoryOverlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    transition: "all 0.3s ease",
  };

  const categoryButtonStyle = {
    marginTop: 20,
    backgroundColor: "#ff6600",
    borderColor: "#ff6600",
    opacity: 0,
    transform: "translateY(20px)",
    transition: "all 0.3s ease",
  };

  // Use local state to track hover state for each category card
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <Card bodyStyle={{ padding: 0 }}>
      {/* Banner Carousel */}
      <Carousel autoplay effect="fade" dots={{ className: "carousel-dots" }}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <div
              style={{
                height: 500,
                backgroundImage: `url(${banner.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                display: "flex",
                alignItems: "center",
                padding: "0 50px",
              }}
            >
              <div style={{ maxWidth: 500, color: "white" }}>
                <Title
                  level={2}
                  style={{
                    color: "white",
                    marginBottom: 10,
                    textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  {banner.title}
                </Title>
                <Paragraph
                  style={{
                    fontSize: 18,
                    marginBottom: 20,
                    textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  {banner.subtitle}
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  style={{ backgroundColor: "#ff6600", borderColor: "#ff6600" }}
                  href={banner.link}
                >
                  Xem ngay
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Featured Categories */}
      <div style={{ padding: "30px 24px" }}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card
              hoverable
              cover={
                <div
                  style={categoryCardStyle}
                  onMouseEnter={() => setHoveredCategory("men")}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <img
                    alt="Giày Nam"
                    src="https://tungluxury.com/wp-content/uploads/2023/02/giay-louis-vuitton-lv-trainer-54-damier-ebene-multi-like-auth-3.jpg"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      ...categoryOverlayStyle,
                      backgroundColor:
                        hoveredCategory === "men"
                          ? "rgba(0,0,0,0.6)"
                          : "rgba(0,0,0,0.4)",
                    }}
                  >
                    <Title
                      level={3}
                      style={{ color: "white", margin: 0, textAlign: "center" }}
                    >
                      Giày Nam
                    </Title>
                    <Button
                      type="primary"
                      style={{
                        ...categoryButtonStyle,
                        opacity: hoveredCategory === "men" ? 1 : 0,
                        transform:
                          hoveredCategory === "men"
                            ? "translateY(0)"
                            : "translateY(20px)",
                      }}
                      href="/collections/men"
                    >
                      Xem thêm
                    </Button>
                  </div>
                </div>
              }
              bodyStyle={{ display: "none" }}
            />
          </Col>
          <Col span={8}>
            <Card
              hoverable
              cover={
                <div
                  style={categoryCardStyle}
                  onMouseEnter={() => setHoveredCategory("women")}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <img
                    alt="Giày Nữ"
                    src="https://cf.shopee.vn/file/2b84a350c4819800e127af7a01e3c4cc"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      ...categoryOverlayStyle,
                      backgroundColor:
                        hoveredCategory === "women"
                          ? "rgba(0,0,0,0.6)"
                          : "rgba(0,0,0,0.4)",
                    }}
                  >
                    <Title
                      level={3}
                      style={{ color: "white", margin: 0, textAlign: "center" }}
                    >
                      Giày Nữ
                    </Title>
                    <Button
                      type="primary"
                      style={{
                        ...categoryButtonStyle,
                        opacity: hoveredCategory === "women" ? 1 : 0,
                        transform:
                          hoveredCategory === "women"
                            ? "translateY(0)"
                            : "translateY(20px)",
                      }}
                      href="/collections/women"
                    >
                      Xem thêm
                    </Button>
                  </div>
                </div>
              }
              bodyStyle={{ display: "none" }}
            />
          </Col>
          <Col span={8}>
            <Card
              hoverable
              cover={
                <div
                  style={categoryCardStyle}
                  onMouseEnter={() => setHoveredCategory("sport")}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <img
                    alt="Giày Thể Thao"
                    src="https://product.hstatic.net/200000174405/product/s6ip3iygk4_2feda4d717464f84a8946706f215a298.jpg"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      ...categoryOverlayStyle,
                      backgroundColor:
                        hoveredCategory === "sport"
                          ? "rgba(0,0,0,0.6)"
                          : "rgba(0,0,0,0.4)",
                    }}
                  >
                    <Title
                      level={3}
                      style={{ color: "white", margin: 0, textAlign: "center" }}
                    >
                      Giày Thể Thao
                    </Title>
                    <Button
                      type="primary"
                      style={{
                        ...categoryButtonStyle,
                        opacity: hoveredCategory === "sport" ? 1 : 0,
                        transform:
                          hoveredCategory === "sport"
                            ? "translateY(0)"
                            : "translateY(20px)",
                      }}
                      href="/collections/sport"
                    >
                      Xem thêm
                    </Button>
                  </div>
                </div>
              }
              bodyStyle={{ display: "none" }}
            />
          </Col>
        </Row>
      </div>

      {/* Promo Banners */}
      <div style={{ padding: "0 24px 30px" }}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card bordered>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="https://img.freepik.com/free-vector/free-shipping-concept-illustration_114360-1554.jpg"
                  alt="Free Shipping"
                  style={{ width: 60, height: 60, marginRight: 15 }}
                />
                <div>
                  <Title level={5} style={{ margin: "0 0 5px" }}>
                    Miễn phí vận chuyển
                  </Title>
                  <Text type="secondary">Cho đơn hàng từ 1.000.000₫</Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="https://img.freepik.com/free-vector/guarantee-concept-illustration_114360-10886.jpg"
                  alt="Authentic"
                  style={{ width: 60, height: 60, marginRight: 15 }}
                />
                <div>
                  <Title level={5} style={{ margin: "0 0 5px" }}>
                    Sản phẩm chính hãng
                  </Title>
                  <Text type="secondary">Cam kết 100% authentic</Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="https://img.freepik.com/free-vector/call-center-concept-illustration_114360-2211.jpg"
                  alt="Support"
                  style={{ width: 60, height: 60, marginRight: 15 }}
                />
                <div>
                  <Title level={5} style={{ margin: "0 0 5px" }}>
                    Hỗ trợ 24/7
                  </Title>
                  <Text type="secondary">Hotline: 0987 654 321</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Best Selling Products */}
      <div style={{ padding: "0 24px" }}>
      <Card
            title={
              <div
                style={{
                  fontSize: "19px",
                  fontWeight: "normal",
                  backgroundColor: `${COLORS.backgroundcolor2}`,
                  padding: "10px",
                  margin: "1rem",
                  color: `${COLORS.pending}`,
                }}
              >
                SẢN PHẨM BÁN CHẠY
              </div>
            }
            bordered={false}
          >
            <Row gutter={[16, 24]}>
              {productHadSolDescs?.map((product, index) => (
                <Col
                  key={index}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  xl={{ flex: "20%" }}  
                >
                  <Link
                    to={`/products/product-detail/${product.productId}?colorId=${product.colorId}&sizeId=${product.sizeId}`}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      fontWeight: "normal",
                      display: "block",
                      width: "100%",
                    }}
                    onClick={() => addViewProduct(product.productId)}
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
                  </Link>
                </Col>
              ))}
            </Row>
          </Card>
      </div>

      {/* Blog Posts */}
      <div style={{ padding: "30px 24px" }}>
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: 30,
            position: "relative",
          }}
        >
          Tin tức & Bài viết
          <div
            style={{
              position: "absolute",
              bottom: -10,
              left: "50%",
              width: 60,
              height: 3,
              backgroundColor: "#ff6600",
              transform: "translateX(-50%)",
            }}
          />
        </Title>
        <Row gutter={[24, 24]}>
          {blogs.map((blog) => (
            <Col key={blog.id} xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={
                  <div style={{ position: "relative", height: 200 }}>
                    <img
                      src={blog.image}
                      alt={blog.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: "#ff6600",
                        color: "white",
                        padding: "5px 10px",
                        fontSize: 12,
                      }}
                    >
                      {blog.date}
                    </div>
                  </div>
                }
              >
                <Card.Meta
                  title={<a href={`/blogs/${blog.id}`}>{blog.title}</a>}
                  description={
                    <a
                      href={`/blogs/${blog.id}`}
                      style={{
                        display: "inline-block",
                        color: "#ff6600",
                        fontWeight: 600,
                        marginTop: 5,
                      }}
                    >
                      Đọc tiếp
                    </a>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Brands */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "30px 24px",
          marginBottom: 30,
        }}
      >
        <Row gutter={[24, 24]} justify="space-between" align="middle">
          {brands.map((brand, index) => (
            <Col key={index} span={4}>
              <div style={{ textAlign: "center" }}>
                <img
                  src={brand.image}
                  alt={brand.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: 60,
                    filter: "grayscale(100%)",
                    opacity: 0.6,
                    transition: "all 0.3s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.filter = "grayscale(0)";
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.filter = "grayscale(100%)";
                    e.currentTarget.style.opacity = "0.6";
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Card>
  );
};

export default HomePage;
