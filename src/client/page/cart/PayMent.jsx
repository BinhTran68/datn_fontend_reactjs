import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "./PayMent.css";

const PayMent = () => {
    return (
        <>
            <div>
                pay ment
                <div class="row">
                    <div class="col-7">
                        <div class="container">
                            <p>Bạn có mã ưu đãi? <a href="#">Ấn vào đây để nhập mã</a></p><hr />
                            <h5>THÔNG TIN THANH TOÁN</h5>
                            <label for="fullname" >Họ và tên *</label><br />
                            <input class="col-12" type="text" id="fullname" placeholder="Nhập họ và tên" required></input><br />


                            <div class="row">
                                <div class="col-6">
                                    <label for="phone">Số điện thoại *</label><br />
                                    <input class="col-12" type="text" id="phone" placeholder="Nhập số điện thoại" required></input>
                                </div>
                                <div class="col-6">
                                    <label for="email">Địa chỉ email *</label><br />
                                    <input class="col-12" type="email" id="email" placeholder="Nhập địa chỉ email" required></input>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-6">
                                    <label for="city">Tỉnh/Thành phố *</label><br />
                                    <select id="city" required class="col-12">
                                        <option value="">Chọn Tỉnh/Thành phố</option>
                                        <option value="HaNoi">Hà Nội</option>
                                        {/* Add more options here */}
                                    </select>
                                </div>
                                <div class="col-6">
                                    <label for="district">Quận/Huyện *</label><br />
                                    <select id="district" required class="col-12">
                                        <option value="">Chọn Quận/Huyện</option>
                                        {/* Add more options here */}
                                    </select>
                                </div>
                            </div>


                            <label for="address">Địa chỉ *</label><br />
                            <textarea class="col-12" id="address" placeholder="Nhập địa chỉ cụ thể. Số nhà, tên đường..." required></textarea>

                            <h5>THÔNG TIN BỔ SUNG</h5>

                            <label for="note">Ghi chú đơn hàng (tùy chọn)</label><br />
                            <textarea class="col-12" id="note" placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."></textarea>

                        </div>
                    </div>






                    <div class="col-5"><br /><br />
                        <div class="order-box">
                            <h5>ĐƠN HÀNG CỦA BẠN</h5>
                            <table>
                                <thead>
                                    <tr>
                                        <th class="col-10">SẢN PHẨM</th>
                                        <th class="col-2">TẠM TÍNH</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Giày Nike Zoom Vapor Pro 2 HC White' DR6191-101-42 x 2</td>
                                        <td>7,000,000 ₫</td>
                                    </tr>
                                    <tr>
                                        <td class="total">Tổng</td>
                                        <td class="total">7,000,000 ₫</td>
                                    </tr>
                                </tbody>
                            </table>




                            <div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                                    <label class="form-check-label" for="flexRadioDefault1">
                                        Chuyển khoản ngân hàng
                                    </label>
                                    <p>Thực hiện thanh toán vào ngay tài khoản ngân hàng của Authentic Shoes. Vui lòng sử dụng Mã đơn hàng của bạn trong phần Nội dung thanh toán.</p>
                                    <img src="https://authentic-shoes.com/wp-content/uploads/2023/11/Screenshot-2023-11-24-at-23.19.42.png" alt="" width="419"/>
                                    
                                    <hr />
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked></input>
                                    <label class="form-check-label" for="flexRadioDefault2">
                                        Kiểm tra thanh toán
                                    </label><hr />
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" checked></input>
                                    <label class="form-check-label" for="flexRadioDefault1">
                                        Thẻ ATM/Visa/Master/JCB/QR Pay qua cổng VNPAY
                                    </label><hr />
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault4" checked></input>
                                    <label class="form-check-label" for="flexRadioDefault2">
                                        Fundiin - Mua trước trả sau 0% lãi suất
                                    </label>
                                </div>
                            </div><br/>


                            <a href="#" class="order-button">ĐẶT HÀNG</a>

                            <p class="note">Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng, tăng trải nghiệm sử dụng website, và cho các mục đích cụ thể khác đã được mô tả trong chính sách riêng tư của chúng tôi.</p>

                        </div>
                    </div>
                </div>



                <hr />
                <div>
                    <div class="row">
                        <div class="col-4">
                            <div>
                                <img src="https://authentic-shoes.com/wp-content/uploads/2023/04/ft-logo.webp" alt="" />
                            </div>
                            <p>Hộ Kinh Doanh Nghiêm Xuân Huy MST : 01E8027929
                                Authentic Shoes - Nhà sưu tầm và phân phối chính hãng các thương hiệu thời trang quốc tế hàng đầu Việt Nam</p>
                            <h5>HỆ THỐNG CỬA HÀNG</h5>
                            <p>Cơ sở 1: 561 Nguyễn Đình Chiểu Phường 2 - Quận3 - TP. Hồ Chí Minh</p>
                            <p>Hotline : 0786665444</p>
                            <p>Cở sở 2 : 70-72 Tây Sơn - Đống Đa - Hà Nội</p>
                            <p>Hotline : 0785499555</p>
                            <p>Service@AutheticShoes.com</p>
                            <p>ĐKKD: 01E8027929 - Cấp ngày: 01/06/2019 - Nơi cấp: Hà Nội</p>
                        </div>
                        <div class="col-4">
                            <h5>Về chúng tôi</h5><hr />
                            <p>Giới Thiệu</p>
                            <p>Tuyển Dụng</p>
                            <p>Dịch Vụ Spa, Sửa Giày</p>
                            <p>Tin Tức - Sự Kiện</p>
                            <p>Kết nối với chúng tôi</p><hr />
                        </div>
                        <div class="col-4">
                            <h5>Hỗ trợ khách hàng</h5><hr />
                            <p>Hướng dẫn mua hàng</p>
                            <p>Chính sách đổi trả và bảo hành</p>
                            <p>Chính Sách Thanh Toán</p>
                            <p>Điều khoản trang web</p>
                            <p>Chính sách bảo vệ thông tin cá nhân của người tiêu dùng</p>
                            <p>Vận chuyển và giao hàng</p>
                        </div>

                    </div>

                </div>

                <div class="absolute-footer dark medium-text-center small-text-center">
                    <div class="container clearfix">
                        <div class="footer-primary pull-left">
                            <div class="copyright-footer">
                                <span >© Bản quyền thuộc về Authentic Shoes</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </>
    )
}

export default PayMent
