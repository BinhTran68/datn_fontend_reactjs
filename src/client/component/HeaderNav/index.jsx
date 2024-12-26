import React from "react";
import stype from "../HeaderNav/HeaderNav.module.css";
import clsx from "clsx";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "bootstrap";

function Home() {
  return (
    <>
      <div className={clsx(stype.header, "container-fluid ")}>
        <p className="text-light text-center bg-black">
          Authentic Shoes - Nhà sưu tầm và phân phối chính hãng các thương hiệu
          thời trang quốc tế hàng đầu Việt Nam
        </p>
        <div className="row ">
          <div className={clsx(stype.logo, "col-3 d-flex justify-content-end")}>
          <img src="/img/logo.png" alt="mieu-ta-hinh-anh" />
          </div>
          <div className={clsx(stype.navContent, "col-6 text-content d-flex align-items-center")}>
            <div className="d-flex gap-3  ">
              <div >
                <a href="/" className="text-decoration-none text-black"> TRANC CHỦ</a>
              </div>
              <div>
                <a href="/" className="text-decoration-none text-black"> GIÀY</a>
              </div>
              <div>
                <a href="/" className="text-decoration-none text-black"> LIÊN HỆ</a>
              </div>
              <div>
                <a href="/" className="text-decoration-none text-black"> TRA CỨU</a>
              </div>
            </div>
          </div>
          <div className={clsx(stype.loginAndCart, "col-3 d-flex justify-content-start d-flex align-items-center")}>
            <div>
              <img className="w-50" src="/img/Search.png"/>
            </div>
            <div>
              <img className="w-50" src="/img/cart.png"></img>
            </div>
            <div>
            <a href="/" className="text-decoration-none text-black"> Đăng Nhập</a>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
