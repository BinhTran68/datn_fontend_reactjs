import React from "react";
import stype from "../HeaderNav/HeaderNav.module.css";
import clsx from "clsx";

// import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { PiBellRinging } from "react-icons/pi";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineAccountCircle } from "react-icons/md";
import { RiShoppingCartLine } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { COLORS } from "../../../constants/constants.js";
import { Badge, Button, Col, Flex, Input, Row, Space } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import Nav from "../Nav/index.jsx";
import { ceil } from "lodash";

function Home() {
  return (
    <>
      <div className={"w-100"}>
        <p
          className="text-light text-center "
          style={{
            backgroundColor: `${COLORS.primary}`,
          }}
        >
          Thehands shop - Nhà sưu tầm và phân phối chính hãng các thương hiệu
          thời trang quốc tế hàng đầu Việt Nam
        </p>
        <Row gutter={[5, 5]} align={"middle"}>
          <Col span={6}></Col>
          <Col span={12}>
            <Row justify="center" gutter={[16, 16]}>
              <Col>
                <Input
                  placeholder="Nhập vào tên giày muốn tìm!"
                  prefix={<SearchOutlined />}
                  allowClear
                  name="name"
                  style={{ width: "40rem", height: "2.5rem" }} // Đặt chiều rộng cho Input
                />
              </Col>
              <Col className="p-0">
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ height: "2.5rem", width: "2.5rem" }}
                ></Button>
              </Col>
            </Row>
          </Col>

          <Col span={6}>
            <Flex justify="flex-end" align="center" gutter={[10, 10]}>
              <Col>
                <Space style={{ cursor: "pointer" }}>
                  <Badge count={5}>
                    <PiBellRinging size={20} style={{ fontWeight: "bold" }} />
                  </Badge>
                  <span style={{ fontSize: "0.9rem" }}>Thông báo</span>
                </Space>
              </Col>
              <Col>
                <Space>
                  <AiOutlineGlobal size={20} style={{ fontWeight: "bold" }} />
                  <span style={{ fontSize: "0.9rem" }}>Tiếng Việt</span>
                </Space>
              </Col>
              <Col>
                <Link
                  href="/"
                  className="text-decoration-none text-black fw-normal"
                  to="/login"
                >
                  Đăng Nhập
                </Link>
              </Col>
              <Col>
                <Link
                  href="/"
                  className="text-decoration-none text-black fw-normal"
                  to="/register"
                >
                  Đăng Kí
                </Link>
              </Col>
            </Flex>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
