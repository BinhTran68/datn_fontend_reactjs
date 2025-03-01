import React, { useState } from 'react';
import styles from './CartPage.module.css';

const CartPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    gender: 'Anh',
    name: '',
    phone: '',
    email: '',
    address: '',
    deliveryOption: 'Giao hàng tận nhà',
    note: '',
  });

  // Dữ liệu sản phẩm
  const product = {
    name: 'Giày Adidas Stan Smith Fairway M20324 - 36',
    price: 2100000,
    image: 'https://authentic-shoes.com/wp-content/uploads/2023/04/8880_01.jpg_c2f0a7080647417eb4a17324fed9919f-768x343.jpeg'
  };

  const totalPrice = product.price * quantity;

  const paymentMethods = [
    {
      id: 'vietqr',
      name: 'Quét mã chuyển khoản VietQR',
      description: 'Ghi nhận giao dịch tức thì. QR được chấp nhận bởi 40+ Ngân hàng và 4 Ví điện tử.',
      icon: '💳'
    },
    {
      id: 'atm',
      name: 'Thẻ ATM',
      description: '',
      icon: '🏧'
    },
    {
      id: 'credit',
      name: 'Thẻ Visa, MasterCard, JCB',
      description: '',
      icon: '💳'
    },
    {
      id: 'cod',
      name: 'Giao hàng thu tiền (COD)',
      description: '',
      icon: '🚚'
    },
    {
      id: 'bank',
      name: 'Tài khoản ngân hàng',
      description: 'Chấp nhận bởi MB Bank, PVcom Bank',
      icon: '🏦'
    }
  ];

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleButtonClick = (message) => {
    alert(message);
  };

  const handleBuyNowClick = () => {
    setIsCheckoutModalVisible(true);
    setIsPaymentStep(false);
  };

  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalVisible(false);
    setIsPaymentStep(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDeliveryOptionChange = (e) => {
    setCustomerInfo(prevState => ({
      ...prevState,
      deliveryOption: e.target.value,
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email || 
        (customerInfo.deliveryOption === 'Giao hàng tận nhà' && !customerInfo.address)) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setIsPaymentStep(true);
  };

  const handleBackToInfo = () => {
    setIsPaymentStep(false);
  };

  return (
    <div>
      <h2>Cart</h2>
      <div className="">
        <div className="row">
          <div className="col-md-8">
            <div className={`row container-fluid text-center`}>
              <div className="col-2">SẢN PHẨM</div>
              <div className="col-1"></div>
              <div className="col-3"></div>
              <div className="col-2">GIÁ</div>
              <div className="col-2">SỐ LƯỢNG</div>
              <div className="col-2">TẠM TÍNH</div>
            </div><hr />
            <div className="row align-items-center">
              <div className="col-2">
                <img src={product.image} alt={product.name} width="60" />
              </div>
              <div className="col-4">
                <p>{product.name}</p>
              </div>
              <div className="col-2">
                <strong>{product.price.toLocaleString()} đ</strong>
              </div>
              <div className="col-2 d-flex align-items-center">
                <button onClick={decreaseQuantity} className="btn btn-sm btn-outline-secondary">-</button>
                <input type="text" value={quantity} readOnly className="form-control text-center mx-2" style={{ width: '40px' }} />
                <button onClick={increaseQuantity} className="btn btn-sm btn-outline-secondary">+</button>
              </div>
              <div className="col-2">
                <strong>{totalPrice.toLocaleString()} đ</strong>
              </div>
            </div>
            <hr />
            <a href="#" className={styles.button}>← TIẾP TỤC XEM SẢN PHẨM</a>
          </div>

          <div className="col-md-4">
            <div>
              <h4>Cộng giỏ hàng</h4>
            </div><hr />
            <div>Tạm tính: {totalPrice.toLocaleString()} đ</div><hr />
            <div>Tổng: {totalPrice.toLocaleString()} đ</div><hr />

            <div className={styles.buttonContainer}>
              <button
                className={`${styles.button} ${styles.buttonRed} col-4 mb-2`}
                onClick={handleBuyNowClick}
              >MUA NGAY</button>
              <button
                className={`${styles.button} ${styles.buttonBlue} col-4 mb-2`}
                onClick={() => handleButtonClick('Chọn trả góp qua thẻ!')}
              >TRẢ GÓP QUA THẺ</button>
              <button
                className={`${styles.button} ${styles.buttonYellow} col-4 mb-2`}
                onClick={() => handleButtonClick('Mua ngay - Trả sau thành công!')}
              >MUA NGAY - TRẢ SAU</button>
            </div>
            <button
              className={`${styles.checkoutButton} col-12`}
              onClick={() => handleButtonClick('Tiến hành thanh toán!')}
            >TIẾN HÀNH THANH TOÁN</button>
            <br />

            <div className={styles.discountCodeSection}>
              <label htmlFor="discount-code" className={styles.discountCodeLabel}>Mã ưu đãi</label><hr /><br />
              <input type="text" id="discount-code" className={styles.discountCodeInput} placeholder="Mã ưu đãi" />
              <button
                className={`${styles.buttond} col-12`}
                onClick={() => handleButtonClick('Áp dụng mã ưu đãi!')}
              >Áp dụng</button>
            </div>
          </div>
        </div>
      </div>

      {isCheckoutModalVisible && (
        <div className={`${styles.modalOverlay} ${isCheckoutModalVisible ? styles.modalOverlayShow : ''}`}>
          <div className={`${styles.modalContent} ${isCheckoutModalVisible ? styles.modalContentShow : ''}`}>
            <div className={styles.modalHeader}>
              <h3>{isPaymentStep ? 'Chọn hình thức thanh toán' : 'Thông tin thanh toán'}</h3>
              <span className={styles.closeButton} onClick={handleCloseCheckoutModal}>&times;</span>
            </div>
            
            {!isPaymentStep ? (
              // Form thông tin khách hàng
              <div className={styles.modalBody}>
                <div className="row mb-3 align-items-center">
                  <div className="col-2">
                    <img src={product.image} alt={product.name} width="60" />
                  </div>
                  <div className="col-8">
                    <p className="mb-0">{product.name}</p>
                    <p className="mb-0">Số lượng: {quantity}</p>
                    <p className="mb-0">Giá: {totalPrice.toLocaleString()} đ</p>
                  </div>
                </div>
                <hr />
                <h4>Thông tin khách hàng</h4>
                <div className="mb-3">
                  <label className="me-3">
                    <input
                      type="radio"
                      name="gender"
                      value="Anh"
                      checked={customerInfo.gender === 'Anh'}
                      onChange={handleChange}
                    />{' '}
                    Anh
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Chị"
                      checked={customerInfo.gender === 'Chị'}
                      onChange={handleChange}
                    />{' '}
                    Chị
                  </label>
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Họ và tên*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Số điện thoại*</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email*</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="alert alert-info" role="alert">
                  <i className="bi bi-envelope-fill me-2"></i> Thông tin đơn hàng sẽ được gửi qua email. Nhà cung cấp sẽ liên hệ với bạn qua số điện thoại.
                </div>
                <hr />
                <h4>Yêu cầu nhận hàng</h4>
                <div className="mb-3">
                  <label className="me-3">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="Giao hàng tận nhà"
                      checked={customerInfo.deliveryOption === 'Giao hàng tận nhà'}
                      onChange={handleDeliveryOptionChange}
                    />{' '}
                    Giao hàng tận nhà
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="Nhận tại cửa hàng"
                      checked={customerInfo.deliveryOption === 'Nhận tại cửa hàng'}
                      onChange={handleDeliveryOptionChange}
                    />{' '}
                    Nhận tại cửa hàng
                  </label>
                </div>
                {customerInfo.deliveryOption === 'Giao hàng tận nhà' && (
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Địa chỉ nhận hàng*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="note" className="form-label">Ghi chú cho người bán</label>
                  <textarea
                    className="form-control"
                    id="note"
                    name="note"
                    value={customerInfo.note}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            ) : (
              // Trang chọn phương thức thanh toán
              <div className={styles.modalBody}>
                <button onClick={handleBackToInfo} className="btn btn-link mb-4">
                  ← Quay lại
                </button>

                <div className="bg-light p-3 rounded mb-4">
                  <p className="mb-1">Mã đơn hàng: SLSEXW10</p>
                  <p className="mb-1">Người nhận hàng: {customerInfo.gender} {customerInfo.name}, {customerInfo.phone}</p>
                  <p className="mb-0">Địa chỉ nhận hàng: {customerInfo.address || 'Nhận tại cửa hàng'}</p>
                </div>

                <div className="payment-methods">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="border rounded p-3 mb-3 cursor-pointer hover:border-primary"
                      onClick={() => handleButtonClick(`Đã chọn phương thức thanh toán: ${method.name}`)}
                    >
                      <div className="d-flex align-items-center">
                        <span className="me-3 fs-4">{method.icon}</span>
                        <div>
                          <h5 className="mb-1">{method.name}</h5>
                          {method.description && (
                            <p className="mb-0 small text-muted">{method.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="small">
                    <a href="#" className="text-decoration-none me-3">Điều khoản sử dụng</a>
                      <a href="#" className="text-decoration-none me-3">Câu hỏi thường gặp</a>
                      <a href="#" className="text-decoration-none">Chính sách bảo mật</a>
                    </div>
                    <button className="btn btn-success">
                      Hỗ trợ trực tuyến
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.modalFooter}>
              {!isPaymentStep ? (
                <button className="btn btn-primary" onClick={handleSubmit}>Tiếp tục</button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;














