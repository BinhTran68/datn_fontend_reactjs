import React from "react";
import stype from "../HeaderNav/HeaderNav.module.css";
import clsx from "clsx";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Home() {
  return (
    <>
      <div className={clsx(stype.footer, "container  border-top border-2 p-3")}>
        <div className="d-flex gap-3 justify-content-between">
          <div
            className={clsx(
              stype.contact,
              "col-6 d-flex flex-column justify-content-start"
            )}
          >
            <div>
              <img src="/img/logo.png" alt="mieu-ta-hinh-anh" />
            </div>
            <div>
              <p>
                Hộ Kinh Doanh Nghiêm Xuân Huy MST : 01E8027929 Authentic Shoes -
                Nhà sưu tầm và phân phối chính hãng các thương hiệu thời trang
                quốc tế hàng đầu Việt Nam
              </p>
            </div>
            <div className="d-flex flex-column gap-3">
              <div>
                <h4>HỆ THỐNG CỬA HÀNG</h4>
              </div>
              <div className="d-flex align-items-center">
                <div>
                  <img className="w-50" src="/img/location.png" />
                </div>
                <div className="col-10">
                  Cơ sở 1: 561 Nguyễn Đình Chiểu Phường 2 - Quận3 - TP. Hồ Chí
                  Minh
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div>
                  <img className="w-50" src="/img/phone.png" />
                </div>
                <div className="col-10">0961302699</div>
              </div>
              <div className="d-flex align-items-center">
                <div>
                  <img className="w-50" src="/img/mail.png" />
                </div>
                <div className="col-10">duycongib192@gmail.com</div>
              </div>
              <div>
                ĐKKD: 01E8027929 - Cấp ngày: 01/06/2019 - Nơi cấp: Hà Nội
              </div>
            </div>
          </div>
          <div
            className={clsx(stype.infor, "col-3  d-flex  flex-column gap-3")}
          >
            <div>
              <h4>VỀ CHÚNG TÔI</h4>
            </div>
            <div>
              <a href="#" className="text-decoration-none text-black fw-normal">
                Giới Thiệu
              </a>
            </div>
            <div>
              <a href="#" className="text-decoration-none text-black fw-normal">
                Tuyển Dụng
              </a>
            </div>
            <div>
              <a href="#" className="text-decoration-none text-black fw-normal">
                Dịch Vụ Spa, Sửa Giày
              </a>
            </div>
            <div>
              <a href="#" className="text-decoration-none text-black fw-normal">
                Tin Tức-Sự Kiện
              </a>
            </div>
            <div>
              <p>Kết Nối Với Chúng Tôi</p>
              <div className="row gap-0 align-items-center">
                <div className="col-2">
                  <a>
                    <img className="w-75 " src="/img/inta.png" />
                  </a>
                </div>
                <div className="col-2">
                  <a>
                    <img className="w-75" src="/img/facebook.png" />
                  </a>
                </div>
                <div className="col-2">
                  <a>
                    <img className="w-75" src="/img/youtube.png" />
                  </a>
                </div>
                <div className="col-2">
                  <a>
                    <img className="w-75" src="/img/tiktok.png" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div
            className={clsx(
              stype.support,
              "col-3 d-flex  d-flex flex-column gap-3"
            )}
          >
            <div>
              <h4>HỖ TRỢ KHÁCH HÀNG</h4>
            </div>
            <div>
              <a href="#" className="text-decoration-none text-black fw-normal">
                Hướng Dẫn Mua hàng
              </a>
            </div>
            <div>
              <a href="#" className="text-decoration-none text-black fw-normal">
                Chính Sách Đổi Trả Và Bảo Hành
              </a>
            </div>
            <div>
              <a href="#" className="text-decoration-none text-black fw-normal">
                Chính Sách Thanh Toán
              </a>
            </div>
            <div>
              <a href="#" className="text-decoration-none text-black fw-normal">
                Chính Sách Bảo Mật Thông Tin Khách Hàng
              </a>
            </div>
            <div>
              <a href="#" className="text-decoration-none text-black fw-normal ">
                Chính Sách Vận Chuyển Và Giao Hàng
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
