import React from "react";
import style from "../TestComponent/TestComponent.module.css";
import clsx from "clsx";

// import "bootstrap/dist/css/bootstrap.min.css";
import { FaCartPlus, FaLocationDot, FaSquareFacebook } from "react-icons/fa6";
import { FaFireAlt, FaPhoneAlt } from "react-icons/fa";
import { IoAdd, IoHeart, IoLogoYoutube, IoMail } from "react-icons/io5";
import { AiFillTikTok } from "react-icons/ai";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function PropProduct({product}) {
  return (
    <>
       <div className="card" style={{ height: "24rem" }}>
                <img
                  src="img/1.png"
                  alt=""
                  className="card-img-top p-0"
                  style={{
                    objectFit: "contain", // Giữ tỉ lệ ảnh ban đầu
                    height: "55%",
                  }}
                />
                <div className="position-absolute top">
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
                    Hot <FaFireAlt />
                  </div>
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

                  <div class="d-flex justify-content-between w-100 p-0">
                    
                      <div class="p-0 col-5">
                        <button
                          type="button"
                          class="btn text-white bg-black  p-1 w-100"
                        >
                          Mua ngay
                        </button>
                      </div>
                      <div class="p-0 col-6">
                        <button
                          type="button"
                          class="btn text-white bg-black  p-1 w-100"
                        >
                          Thêm <FaCartPlus size={20} />
                        </button>
                      </div>
                   
                  </div>
                </div>
              </div>
    </>
  );
}
export default PropProduct;
