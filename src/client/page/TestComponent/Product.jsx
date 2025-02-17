import React from "react";
import style from "../TestComponent/TestComponent.module.css";
import clsx from "clsx";

// import "bootstrap/dist/css/bootstrap.min.css";
import PropProduct from "./PropProduct.jsx";
import { Content } from "antd/es/layout/layout.js";
import { Card, Col, Flex, Layout, Menu, Row, Slider, Space } from "antd";
import Sider from "antd/es/layout/Sider.js";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { COLORS } from "../../../constants/constants.js";

const product = {
  name: "Nike - Giày thời trang thể thao Nữ Air Max SC Women's Shoes",
  price: 50000,
  promotion: "giảm 20%",
  sale: "342",
  url: "https://res.cloudinary.com/dieyhvcou/image/upload/v1739012023/1-removebg-preview_m7nq8q.png",
  statusSale: "Flash Sale",
};

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
  return (
    <>
      <Content>
        <Layout>
          <Sider width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{
                height: "100%",
              }}
              items={items2}
            />
          </Sider>
          <Content
            style={{
              padding: "0 0 0 12px",
              minHeight: 280,
            }}
          >
            <Card
              title={
                <Row
                  style={{
                    fontSize: "19px",
                    fontWeight: "normal",
                    backgroundColor: `${COLORS.backgroundcolor2}`,
                    padding: "10px",
                    margin: "1rem",
                    color:`${COLORS.pending}`
                  }}
                >
                  SẢN PHẨM BÁN CHẠY
                </Row>
              }
            >
              <Row gutter={[16, 16]}>
                {Array.from({ length: 10 }).map((_, index) => (
                  <Col key={index} span={6}>
                    <PropProduct product={product} />
                  </Col>
                ))}
              </Row>
            </Card>
            <Card
              title={
                <Row
                  style={{
                    fontSize: "19px",
                    fontWeight: "normal",
                    backgroundColor: `${COLORS.backgroundcolor2}`,
                    padding: "10px",
                    margin: "1rem",
                    color:`${COLORS.pending}`

                  }}
                >
                  SẢN PHẨM ĐANG GIẢM GIÁ
                </Row>
              }
            >
              <Row gutter={[16, 16]}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Col key={index} span={6}>
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
