import React, { memo, useEffect } from "react";
import style from "../TestComponent/TestComponent.module.css";
import clsx from "clsx";
import styles from "./Product.module.css";

// import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaBolt,
  FaCartPlus,
  FaLocationDot,
  FaSquareFacebook,
  FaStar,
} from "react-icons/fa6";
import { FaFireAlt, FaPhoneAlt } from "react-icons/fa";
import { Button, Col, Flex, Rate, Row } from "antd";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function PropProduct({ product }) {
  const statusSaleContent =
    {
      Hot: (
        <>
          <FaFireAlt /> Hot
        </>
      ),
      "Best Sale": (
        <>
          <FaStar /> Best Sale
        </>
      ),
      "Flash Sale": (
        <>
          <FaBolt /> Flash Sale
        </>
      ),
    }[product.statusSale] || null;
  useEffect(() => {
    console.log("prop đã ren");
  });
  return (
    <>
      <div
        className={clsx("card", styles.productcard)}
        style={{
          height: "21rem",
          // height: "24rem",

          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <img
          src={product.url}
          alt=""
          className="card-img-top p-0"
          style={{
            objectFit: "contain", // Giữ tỉ lệ ảnh ban đầu
            height: "59%",
          }}
        />
        <div className="position-absolute top">
          {/* Hiển thị trạng thái sale nếu có */}
          {statusSaleContent && (
            <div
              className={styles.statusBadge}
              style={{
                fontSize: "0.7rem",
                fontWeight: "bold",
                background: "#FEEEEA",
                color: "#EE4D2D",
                marginLeft: "0.5rem",
                padding: "0.3rem",
                margin: "0.2rem",
              }}
            >
              {statusSaleContent}
            </div>
          )}
        </div>
        <div
          className="card-body"
          style={{
            padding: "0.5rem",
            paddingTop: "0rem",
          }}
        >
          <div
            className="card-title mb-3 "
            style={{
              fontSize: "1rem",
              height: "30%",
            }}
          >
            {product.name.length > 45
              ? product.name.slice(0, 45) + "..."
              : product.name}
          </div>

          <div
            style={{
              fontSize: "1rem",
            }}
          >
            <div>
              <span className="fw-bold fs-5 text-danger">
                {product.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
              <sup
                className="badge"
                style={{
                  fontSize: "0.7rem",
                  background: "#FEEEEA",
                  color: "#EE4D2D",
                  marginLeft: "0.5rem",
                }}
              >
                {product.promotion}
              </sup>
            </div>
          </div>
          <div><Rate value={product.rate} disabled style={{
              fontSize:"0.8rem",
              
            }}/></div>
          <div className="d-flex justify-content-between align-items-center">
            {/* <div className={style.stars}>
              &#9733;&#9733;&#9733;&#9733;&#9733;
            </div> */}
            
              
            <div style={{ fontSize: "0.8rem" }}>Đã bán: {product.sale}</div>
            <div style={{ fontSize: "0.8rem" }}>Lượt xem: {product.views}</div>
          </div>
          {/* 
          <Flex>
            <Col
              span={10}
              style={{
                padding: "0",
              }}
            >
              <Button type="primary" style={{ width: "100%", padding: "0" }}>
                Mua ngay
              </Button>
            </Col>
            <Col
              span={14}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "0",
              }}
            >
              <Button type="primary" style={{ width: "90%", padding: "0" }}>
                Thêm <FaCartPlus size={20} />
              </Button>
            </Col>
          </Flex> */}
        </div>
      </div>
    </>
  );
}
export default memo(PropProduct);
