import { Badge, Col, Row } from "antd";
import { Link } from "react-router-dom";
import React from "react";
import { BsCart2 } from "react-icons/bs";

function Nav() {
  return (
    <>
      <Row
        style={{
          backgroundColor: "white",
          marginBottom: "0.2rem",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          padding: "10px 0", // Adjust padding as needed
        }}
      >
        <Col
          span={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/img/thehands.png"
            alt="mieu-ta-hinh-anh"
            className="img-fluid logo-icon p-0"
          />
        </Col>
        <Col
          span={14}
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <Link
            to="/home"
            className="text-decoration-none text-black"
            style={{ margin: "0 10px" }}
          >
            TRANG CHỦ
          </Link>
          <Link
            to="/products"
            className="text-decoration-none text-black"
            style={{ margin: "0 10px" }}
          >
            SẢN PHẨM
          </Link>
          <Link
            to="/contact"
            className="text-decoration-none text-black"
            style={{ margin: "0 10px" }}
          >
            LIÊN HỆ
          </Link>
        </Col>
        <Col
          span={6}
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            paddingRight: "2rem",
          }}
        >
          <Row gutter={[20, 20]}>
            <Col>
              <Badge count={10}>
                <BsCart2 style={{cursor:"pointer"}} size={22}/>
              </Badge>
             {/* <span style={{fontSize:"15px"}}> Giỏ hàng</span> */}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default Nav;
