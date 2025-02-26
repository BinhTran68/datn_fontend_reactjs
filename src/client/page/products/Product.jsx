import React, { useEffect, useState } from "react";
import style from "../TestComponent/TestComponent.module.css";
import clsx from "clsx";
import styles from "./Product.module.css";

// import "bootstrap/dist/css/bootstrap.min.css";
import PropProduct from "./PropProduct.jsx";
import { Content } from "antd/es/layout/layout.js";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  InputNumber,
  Layout,
  Menu,
  message,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Space,
} from "antd";
import Sider from "antd/es/layout/Sider.js";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { COLORS } from "../../../constants/constants.js";
import {
  getAllProductHadCreatedAtDesc,
  getAllProducthadPromotion,
  getAllProducthadSoldDesc,
  getAllProducthadViewsDesc,
} from "./api.js";
import { FaFilter } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";

const products = [
  {
    name: "Nike - Giày thời trang thể thao Nữ Air Max SC Women's Shoes",
    price: 50000,
    promotion: "giảm 20%",
    sale: "342",
    url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
    statusSale: "Hot",
    rate: 5,
  },
  {
    name: "Nike - Giày thời trang thể thao Nữ Air Max SC Women's Shoes",
    price: 50000,
    promotion: "giảm 20%",
    sale: "342",
    url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
    statusSale: "Best Sale",
    rate: 4,
  },
  {
    name: "Nike - Giày thời trang thể thao Nữ Air Max SC Women's Shoes",
    price: 50000,
    promotion: "giảm 20%",
    sale: "342",
    url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
    statusSale: "Flash Sale",
    rate: 3,
  },
  {
    name: "Nike - Giày thời trang thể thao Nữ Air Max SC Women's Shoes",
    price: 50000,
    promotion: "giảm 20%",
    sale: "342",
    url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
    statusSale: "Flash Sale",
    rate: 3,
  },
];

const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `Danh mục ${key}`,
      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `danh mục con${subKey}`,
        };
      }),
    };
  }
);

function Product() {
  const [range, setRange] = useState([]); // Giá trị mặc định

  const [loading, setLoading] = useState(false);
  // productHadCreatedAtDescs
  const [productHadCreatedAtDescs, setProductHadCreatedAtDescs] = useState();
  const [pagePeoductHadCreatedAtDesc, setPagePeoductHadCreatedAtDesc] =
    useState({
      current: 1,
      pageSize: 8,
    });
  //
  // productHadCreatedAtDescs
  const [productHadviewsDescs, setProductHadviewsDescs] = useState();
  const [PageProductHadviewsDescs, setPageProductHadviewsDescs] = useState({
    current: 1,
    pageSize: 8,
  });
  //
  // productHadCreatedAtDescs
  const [productHadPromotions, setProductHadPromotions] = useState();
  const [pageProductHadPromotion, setPageProductHadPromotion] = useState({
    current: 1,
    pageSize: 8,
  });
  //
  // productHadCreatedAtDescs
  const [productHadSolDescs, setProductHadSolDescs] = useState();
  const [pageProductHadSolDescs, setPageProductHadSolDescs] = useState({
    current: 1,
    pageSize: 8,
  });
  //

  useEffect(() => {
    getAllProductHadcreateAtDescS();
    getAllProducthadPromotions();
    getAllProductHadSoldDescs();
  }, []);
  useEffect(() => {
    console.log("product ren");
  }, []);

  const getAllProductHadcreateAtDescS = async () => {
    setLoading(true);
    try {
      const response = await getAllProductHadCreatedAtDesc(
        pagePeoductHadCreatedAtDesc
      );
      console.log("Response tất cá sản phẩm mới nhất theo ngày tạo:", response); // Log response để kiểm tra dữ liệu trả về
      setProductHadCreatedAtDescs(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

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
  const getAllProducthadPromotions = async () => {
    setLoading(true);
    try {
      const response = await getAllProducthadPromotion(pageProductHadPromotion);
      console.log("Response tất cá sản phẩm nằm trong đợt giảm giá:", response); // Log response để kiểm tra dữ liệu trả về
      setProductHadPromotions(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const getAllProductHadSoldDescs = async () => {
    setLoading(true);
    try {
      const response = await getAllProducthadSoldDesc(pageProductHadSolDescs);
      console.log(
        "Response tất cá sản phẩm có lươt bán từ nhiều tới ít:",
        response
      ); // Log response để kiểm tra dữ liệu trả về
      setProductHadSolDescs(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Content>
        <Layout>
          <Sider width={200} style={{ backgroundColor: "white" }}>
            {/* <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{
                height: "100%",
              }}
              items={items2}
            /> */}
            <Content
              style={{
                padding: "0.5rem",
                // color: `${COLORS.pending}`,
              }}
            >
              <Flex vertical gap={10}>
                <Space>
                  <FiFilter /> BỘ LỌC TÌM KIẾM
                </Space>
                Thương hiệu
                <Select />
                Chất liệu
                <Select />
                Màu sắc
                <Select />
                Loại để
                <Select />
                Loại giày
                <Select />
                <Divider />
                Khoảng giá
                <Slider
                  range
                  min={0}
                  max={5000000}
                  step={100}
                  value={range}
                  onChange={setRange}
                />
                {/* InputNumber */}
                <Flex gutter={5}>
                  <Col>
                    <InputNumber
                      placeholder="Tù"
                      min={0}
                      max={5000000}
                      step={10000}
                      value={range[0]}
                      onChange={(value) => setRange([value, range[1]])}
                    />
                  </Col>
                  <Col>
                    <InputNumber
                      placeholder="Đến"
                      min={0}
                      max={5000000}
                      step={10000}
                      value={range[1]}
                      onChange={(value) => setRange([range[0], value])}
                    />
                  </Col>
                </Flex>
                <Button type="primary">Áp dụng</Button>
                <Divider />
                Đánh giá
                <Radio.Group
                  // value={value}
                  defaultValue={1}
                  options={[
                    {
                      value: 1,
                      label: (
                        <Rate
                          style={{
                            fontSize: "1rem",
                          }}
                          disabled
                          value={5}
                        />
                      ),
                    },
                    {
                      value: 2,
                      label: (
                        <Rate
                          style={{
                            fontSize: "1rem",
                          }}
                          disabled
                          value={4}
                        />
                      ),
                    },
                    {
                      value: 3,
                      label: (
                        <Rate
                          style={{
                            fontSize: "1rem",
                          }}
                          disabled
                          value={3}
                        />
                      ),
                    },
                  ]}
                />
                <Divider />
                Dịch vụ, khuyến mãi
                <Radio.Group
                  // value={value}
                  defaultValue={1}
                  options={[
                    { value: 1, label: "Đang khuyến mại" },
                    { value: 2, label: "Free ship" },
                    { value: 3, label: "Bán chạy" },
                  ]}
                />
              </Flex>
            </Content>
          </Sider>
          <Content
            style={{
              padding: "0 0 0 7px",
              minHeight: 280,
            }}
          >
            <Card
              style={{
                borderRadius: 0,
                marginBottom: "0.3rem",
              }}
              title={
                <Row
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
                </Row>
              }
            >
              <Row gutter={[5, 5]} wrap>
                {productHadSolDescs?.map((product, index) => (
                  <Col key={index} flex="20%">
                    <Link
                      to={`/products/product-detail/${product.productId}?colorId=${product.colorId}&sizeId=${product.sizeId}`}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontWeight: "normal",
                      }}
                    >
                      <PropProduct
                        product={{
                          name:
                            product.productName?.trim() ||
                            "Sản phẩm chưa có tên",
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
            <Card
              style={{
                borderRadius: 0,
                marginBottom: "0.3rem",
              }}
              title={
                <Row
                  style={{
                    fontSize: "19px",
                    fontWeight: "normal",
                    backgroundColor: `${COLORS.backgroundcolor2}`,
                    padding: "10px",
                    margin: "1rem",
                    color: `${COLORS.pending}`,
                  }}
                >
                  SẢN PHẨM ĐANG GIẢM GIÁ
                </Row>
              }
            >
              <Row gutter={[5, 5]}>
                {(productHadPromotions || []).map((product, index) => (
                  <Col key={index} flex={"20%"}>
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
                        url: product.imageUrl || "https://placehold.co/600x400",
                        views: product.views ?? 0,
                        rate: product.rate ?? 4,
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
            <Card
              style={{
                borderRadius: 0,
                marginBottom: "0.3rem",
              }}
              title={
                <Row
                  style={{
                    fontSize: "19px",
                    fontWeight: "normal",
                    backgroundColor: `${COLORS.backgroundcolor2}`,
                    padding: "10px",
                    margin: "1rem",
                    color: `${COLORS.pending}`,
                  }}
                >
                  SẢN PHẨM MỚI
                </Row>
              }
            >
              <Row gutter={[5, 5]}>
                {(products || []).map((product, index) => (
                  <Col key={index} flex={"20%"}>
                    <PropProduct product={product} />
                  </Col>
                ))}
              </Row>
            </Card>
          </Content>
        </Layout>
      </Content>
    </>
  );
}

export default Product;
