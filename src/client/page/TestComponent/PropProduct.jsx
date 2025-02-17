import React from "react";
import style from "../TestComponent/TestComponent.module.css";
import clsx from "clsx";

// import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaBolt,
  FaCartPlus,
  FaLocationDot,
  FaSquareFacebook,
  FaStar,
} from "react-icons/fa6";
import { FaFireAlt, FaPhoneAlt } from "react-icons/fa";
import { Button, Col, Flex, Row } from "antd";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function PropProduct({ product }) {
  return (
    <>
      <div className="card" style={{ height: "24rem" }}>
        <img
          src={product.url}
          alt=""
          className="card-img-top p-0"
          style={{
            objectFit: "contain", // Giữ tỉ lệ ảnh ban đầu
            height: "55%",
          }}
        />
        <div className="position-absolute top">
          {product?.statusSale && (
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                background: "#FEEEEA",
                color: "#EE4D2D",
                marginLeft: "0.5rem",
                padding: "0.3rem",
                margin: "0.2rem",
              }}
            >
              {product.statusSale === "Hot" && (
                <>
                  Hot <FaFireAlt />
                </>
              )}
              {product.statusSale === "Best Sale" && (
                <>
                  Best Sale <FaStar />
                </>
              )}
              {product.statusSale === "Flash Sale" && (
                <>
                  Flash Sale <FaBolt />
                </>
              )}
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
            className="card-title mb-2 "
            style={{
              fontSize: "1rem",
              height: "35%",
            }}
          >
            {product.name}
          </div>

          <div
            style={{
              fontSize: "1rem",
            }}
          >
            <div>
              <span className="fw-bold fs-5 text-danger">{product.price}</span>
              <span
                class="badge"
                style={{
                  fontSize: "0.7rem",
                  background: "#FEEEEA",
                  color: "#EE4D2D",
                  marginLeft: "0.5rem",
                }}
              >
                {product.promotion}
              </span>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div className={style.stars}>
              &#9733;&#9733;&#9733;&#9733;&#9733;
            </div>
            <div className="" style={{ fontSize: "0.8rem" }}>
              Đã bán: {product.sale}
            </div>
          </div>

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
          </Flex>
        </div>
      </div>
    </>
  );
}
export default PropProduct;
