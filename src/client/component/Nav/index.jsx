import { Badge, Col, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { BsCart2 } from "react-icons/bs";
import { getCart } from "../../page/cart/cart";

function Nav() {
  const [cartCount, setCartCount] = useState(getCart().length);
  const navigate = useNavigate(); // Gọi useNavigate trong component

  useEffect(() => {
    const handleStorageChange = () => {
      setCartCount(getCart().length);
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <Row
        style={{
          backgroundColor: "white",
          marginBottom: "0.2rem",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          padding: "10px 0",
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
            <Col onClick={()=>{
              navigate("/cart")
            }}>
              <Badge count={cartCount}>
                <BsCart2 style={{ cursor: "pointer" }} size={22} />
              </Badge>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default Nav;
