import React from 'react'
// import Stype from "./CartPage.css"
import "./CartPage.css"
import "bootstrap/dist/css/bootstrap.min.css";


const CartPage = () => {
  return (
    <div >
      Cart
      <div class="">
        <div class="row">
          <div class="col-7 ">
            <div className="row container-fluid text-center">
              <div className="col-2">SẢN PHẨM</div>
              <div className="col-1"></div>
              <div className="col-3"></div>
              <div className="col-2">GIÁ</div>
              <div className="col-2">SỐ LƯỢNG</div>
              <div className="col-2">TẠM TÍNH</div>
            </div><hr></hr>
            <button type="button" class="btn-close" disabled aria-label="Close"></button>
            <hr />
            <a href="#" class="button">← TIẾP TỤC XEM SẢN PHẨM</a>
          </div>


          <div class="col-5">
            <div>
              Cộng giỏ hàng
            </div><hr></hr>
            <div>Tạm tính</div><hr></hr>
            <div>Tổng</div><hr></hr>

            <div>
              <div class="button-container ">
                <div class="button button-red col-4">
                  <h4>MUA NGAY</h4>
                  <h6>Giao Tận Nơi Hoặc</h6>
                  <h6>Nhận Tại Cửa Hàng</h6></div>
                <div class="button button-blue col-4">
                  <h4>TRẢ GÓP QUA THẺ</h4>
                  <h6>Visa, Master, JCB</h6></div>
                <div class="button button-yellow"><h4>MUA NGAY - TRẢ SAU</h4>
                  <img src="https://pc.baokim.vn/platform/img/icon-kredivo.svg " width="59px" height="20px"></img>
                  <img src="https://pc.baokim.vn/platform/img/home-paylater-ngang-small.svg" width="59px" height="20px" alt="" />
                </div>
              </div>
              <button class="checkout-button button alt wc-forward col-12">TIẾN HÀNH THANH TOÁN</button>

            </div><br />

            <div class="discount-code-section">
              <label for="discount-code" class="discount-code-label">Mã ưu đãi</label><hr /><br />
              <input type="text" id="discount-code" class="discount-code-input" placeholder="Mã ưu đãi"></input>
              <button class="buttond col-12">Áp dụng</button>

            </div>


          </div>
        </div>
      </div>
    </div>

  )
}

export default CartPage
