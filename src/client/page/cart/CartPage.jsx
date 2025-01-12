import React, { useState } from 'react';
import styles from './CartPage.module.css';  // Import CSS Module

const CartPage = () => {
  const [quantity, setQuantity] = useState(1);

  // Dữ liệu sản phẩm
  const product = {
    name: 'Giày Adidas Stan Smith Fairway M20324 - 36',
    price: 2100000,
    image: 'https://authentic-shoes.com/wp-content/uploads/2023/04/8880_01.jpg_c2f0a7080647417eb4a17324fed9919f-768x343.jpeg'
  };




  const totalPrice = product.price * quantity;

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleButtonClick = (message) => {
    alert(message);
  };

  return (
    <div>
      <h2>Cart</h2>
      <div className="">
        <div className="row">
          <div className="col-8">
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
                <button onClick={decreaseQuantity}>-</button>
                <input type="text" value={quantity} readOnly className="text-center mx-2" style={{ width: '40px' }} />
                <button onClick={increaseQuantity}>+</button>
              </div>
              <div className="col-2">
                <strong>{totalPrice.toLocaleString()} đ</strong>
              </div>
            </div>
            <hr />
            <a href="#" className={styles.button}>← TIẾP TỤC XEM SẢN PHẨM</a>
          </div>

          <div className="col-4">
            <div>
              <h4>Cộng giỏ hàng</h4>
            </div><hr />
            <div>Tạm tính: {totalPrice.toLocaleString()} đ</div><hr />
            <div>Tổng: {totalPrice.toLocaleString()} đ</div><hr />

            <div className={styles.buttonContainer}>
              <button
                className={`${styles.button} ${styles.buttonRed} col-4`}
                onClick={() => handleButtonClick('Mua ngay thành công!')}
              >MUA NGAY</button>
              <button
                className={`${styles.button} ${styles.buttonBlue} col-4`}
                onClick={() => handleButtonClick('Chọn trả góp qua thẻ!')}
              >TRẢ GÓP QUA THẺ</button>
              <button
                className={`${styles.button} ${styles.buttonYellow} col-4`}
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
    </div>

  )
}

export default CartPage;