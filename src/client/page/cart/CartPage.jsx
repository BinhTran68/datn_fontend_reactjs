// import React, { useState } from 'react';
// import styles from './CartPage.module.css';

// const CartPage = () => {
//   const [quantity, setQuantity] = useState(1);
//   const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
//   const [isPaymentStep, setIsPaymentStep] = useState(false);
//   const [customerInfo, setCustomerInfo] = useState({
//     gender: 'Anh',
//     name: '',
//     phone: '',
//     email: '',
//     address: '',
//     deliveryOption: 'Giao hàng tận nhà',
//     note: '',
//   });

//   // Dữ liệu sản phẩm
//   const product = {
//     name: 'Giày Adidas Stan Smith Fairway M20324 - 36',
//     price: 2100000,
//     image: 'https://authentic-shoes.com/wp-content/uploads/2023/04/8880_01.jpg_c2f0a7080647417eb4a17324fed9919f-768x343.jpeg'
//   };

//   const totalPrice = product.price * quantity;

//   const paymentMethods = [
//     {
//       id: 'vietqr',
//       name: 'Quét mã chuyển khoản VietQR',
//       description: 'Ghi nhận giao dịch tức thì. QR được chấp nhận bởi 40+ Ngân hàng và 4 Ví điện tử.',
//       icon: '💳'
//     },
//     {
//       id: 'atm',
//       name: 'Thẻ ATM',
//       description: '',
//       icon: '🏧'
//     },
//     {
//       id: 'credit',
//       name: 'Thẻ Visa, MasterCard, JCB',
//       description: '',
//       icon: '💳'
//     },
//     {
//       id: 'cod',
//       name: 'Giao hàng thu tiền (COD)',
//       description: '',
//       icon: '🚚'
//     },
//     {
//       id: 'bank',
//       name: 'Tài khoản ngân hàng',
//       description: 'Chấp nhận bởi MB Bank, PVcom Bank',
//       icon: '🏦'
//     }
//   ];

//   const increaseQuantity = () => setQuantity(quantity + 1);
//   const decreaseQuantity = () => {
//     if (quantity > 1) setQuantity(quantity - 1);
//   };

//   const handleButtonClick = (message) => {
//     alert(message);
//   };

//   const handleBuyNowClick = () => {
//     setIsCheckoutModalVisible(true);
//     setIsPaymentStep(false);
//   };

//   const handleCloseCheckoutModal = () => {
//     setIsCheckoutModalVisible(false);
//     setIsPaymentStep(false);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerInfo(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleDeliveryOptionChange = (e) => {
//     setCustomerInfo(prevState => ({
//       ...prevState,
//       deliveryOption: e.target.value,
//     }));
//   };

//   const handleSubmit = () => {
//     // Validate form
//     if (!customerInfo.name || !customerInfo.phone || !customerInfo.email || 
//         (customerInfo.deliveryOption === 'Giao hàng tận nhà' && !customerInfo.address)) {
//       alert('Vui lòng điền đầy đủ thông tin bắt buộc');
//       return;
//     }
//     setIsPaymentStep(true);
//   };

//   const handleBackToInfo = () => {
//     setIsPaymentStep(false);
//   };

//   return (
//     <div>
//       <h2>Cart</h2>
//       <div className="">
//         <div className="row">
//           <div className="col-md-8">
//             <div className={`row container-fluid text-center`}>
//               <div className="col-2">SẢN PHẨM</div>
//               <div className="col-1"></div>
//               <div className="col-3"></div>
//               <div className="col-2">GIÁ</div>
//               <div className="col-2">SỐ LƯỢNG</div>
//               <div className="col-2">TẠM TÍNH</div>
//             </div><hr />
//             <div className="row align-items-center">
//               <div className="col-2">
//                 <img src={product.image} alt={product.name} width="60" />
//               </div>
//               <div className="col-4">
//                 <p>{product.name}</p>
//               </div>
//               <div className="col-2">
//                 <strong>{product.price.toLocaleString()} đ</strong>
//               </div>
//               <div className="col-2 d-flex align-items-center">
//                 <button onClick={decreaseQuantity} className="btn btn-sm btn-outline-secondary">-</button>
//                 <input type="text" value={quantity} readOnly className="form-control text-center mx-2" style={{ width: '40px' }} />
//                 <button onClick={increaseQuantity} className="btn btn-sm btn-outline-secondary">+</button>
//               </div>
//               <div className="col-2">
//                 <strong>{totalPrice.toLocaleString()} đ</strong>
//               </div>
//             </div>
//             <hr />
//             <a href="#" className={styles.button}>← TIẾP TỤC XEM SẢN PHẨM</a>
//           </div>

//           <div className="col-md-4">
//             <div>
//               <h4>Cộng giỏ hàng</h4>
//             </div><hr />
//             <div>Tạm tính: {totalPrice.toLocaleString()} đ</div><hr />
//             <div>Tổng: {totalPrice.toLocaleString()} đ</div><hr />

//             <div className={styles.buttonContainer}>
//               <button
//                 className={`${styles.button} ${styles.buttonRed} col-4 mb-2`}
//                 onClick={handleBuyNowClick}
//               >MUA NGAY</button>
//               <button
//                 className={`${styles.button} ${styles.buttonBlue} col-4 mb-2`}
//                 onClick={() => handleButtonClick('Chọn trả góp qua thẻ!')}
//               >TRẢ GÓP QUA THẺ</button>
//               <button
//                 className={`${styles.button} ${styles.buttonYellow} col-4 mb-2`}
//                 onClick={() => handleButtonClick('Mua ngay - Trả sau thành công!')}
//               >MUA NGAY - TRẢ SAU</button>
//             </div>
//             <button
//               className={`${styles.checkoutButton} col-12`}
//               onClick={() => handleButtonClick('Tiến hành thanh toán!')}
//             >TIẾN HÀNH THANH TOÁN</button>
//             <br />

//             <div className={styles.discountCodeSection}>
//               <label htmlFor="discount-code" className={styles.discountCodeLabel}>Mã ưu đãi</label><hr /><br />
//               <input type="text" id="discount-code" className={styles.discountCodeInput} placeholder="Mã ưu đãi" />
//               <button
//                 className={`${styles.buttond} col-12`}
//                 onClick={() => handleButtonClick('Áp dụng mã ưu đãi!')}
//               >Áp dụng</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isCheckoutModalVisible && (
//         <div className={`${styles.modalOverlay} ${isCheckoutModalVisible ? styles.modalOverlayShow : ''}`}>
//           <div className={`${styles.modalContent} ${isCheckoutModalVisible ? styles.modalContentShow : ''}`}>
//             <div className={styles.modalHeader}>
//               <h3>{isPaymentStep ? 'Chọn hình thức thanh toán' : 'Thông tin thanh toán'}</h3>
//               <span className={styles.closeButton} onClick={handleCloseCheckoutModal}>&times;</span>
//             </div>
            
//             {!isPaymentStep ? (
//               // Form thông tin khách hàng
//               <div className={styles.modalBody}>
//                 <div className="row mb-3 align-items-center">
//                   <div className="col-2">
//                     <img src={product.image} alt={product.name} width="60" />
//                   </div>
//                   <div className="col-8">
//                     <p className="mb-0">{product.name}</p>
//                     <p className="mb-0">Số lượng: {quantity}</p>
//                     <p className="mb-0">Giá: {totalPrice.toLocaleString()} đ</p>
//                   </div>
//                 </div>
//                 <hr />
//                 <h4>Thông tin khách hàng</h4>
//                 <div className="mb-3">
//                   <label className="me-3">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Anh"
//                       checked={customerInfo.gender === 'Anh'}
//                       onChange={handleChange}
//                     />{' '}
//                     Anh
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Chị"
//                       checked={customerInfo.gender === 'Chị'}
//                       onChange={handleChange}
//                     />{' '}
//                     Chị
//                   </label>
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="name" className="form-label">Họ và tên*</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="name"
//                     name="name"
//                     value={customerInfo.name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="phone" className="form-label">Số điện thoại*</label>
//                   <input
//                     type="tel"
//                     className="form-control"
//                     id="phone"
//                     name="phone"
//                     value={customerInfo.phone}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="email" className="form-label">Email*</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="email"
//                     name="email"
//                     value={customerInfo.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="alert alert-info" role="alert">
//                   <i className="bi bi-envelope-fill me-2"></i> Thông tin đơn hàng sẽ được gửi qua email. Nhà cung cấp sẽ liên hệ với bạn qua số điện thoại.
//                 </div>
//                 <hr />
//                 <h4>Yêu cầu nhận hàng</h4>
//                 <div className="mb-3">
//                   <label className="me-3">
//                     <input
//                       type="radio"
//                       name="deliveryOption"
//                       value="Giao hàng tận nhà"
//                       checked={customerInfo.deliveryOption === 'Giao hàng tận nhà'}
//                       onChange={handleDeliveryOptionChange}
//                     />{' '}
//                     Giao hàng tận nhà
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       name="deliveryOption"
//                       value="Nhận tại cửa hàng"
//                       checked={customerInfo.deliveryOption === 'Nhận tại cửa hàng'}
//                       onChange={handleDeliveryOptionChange}
//                     />{' '}
//                     Nhận tại cửa hàng
//                   </label>
//                 </div>
//                 {customerInfo.deliveryOption === 'Giao hàng tận nhà' && (
//                   <div className="mb-3">
//                     <label htmlFor="address" className="form-label">Địa chỉ nhận hàng*</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="address"
//                       name="address"
//                       value={customerInfo.address}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                 )}
//                 <div className="mb-3">
//                   <label htmlFor="note" className="form-label">Ghi chú cho người bán</label>
//                   <textarea
//                     className="form-control"
//                     id="note"
//                     name="note"
//                     value={customerInfo.note}
//                     onChange={handleChange}
//                   ></textarea>
//                 </div>
//               </div>
//             ) : (
//               // Trang chọn phương thức thanh toán
//               <div className={styles.modalBody}>
//                 <button onClick={handleBackToInfo} className="btn btn-link mb-4">
//                   ← Quay lại
//                 </button>

//                 <div className="bg-light p-3 rounded mb-4">
//                   <p className="mb-1">Mã đơn hàng: SLSEXW10</p>
//                   <p className="mb-1">Người nhận hàng: {customerInfo.gender} {customerInfo.name}, {customerInfo.phone}</p>
//                   <p className="mb-0">Địa chỉ nhận hàng: {customerInfo.address || 'Nhận tại cửa hàng'}</p>
//                 </div>

//                 <div className="payment-methods">
//                   {paymentMethods.map((method) => (
//                     <div
//                       key={method.id}
//                       className="border rounded p-3 mb-3 cursor-pointer hover:border-primary"
//                       onClick={() => handleButtonClick(`Đã chọn phương thức thanh toán: ${method.name}`)}
//                     >
//                       <div className="d-flex align-items-center">
//                         <span className="me-3 fs-4">{method.icon}</span>
//                         <div>
//                           <h5 className="mb-1">{method.name}</h5>
//                           {method.description && (
//                             <p className="mb-0 small text-muted">{method.description}</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-4 pt-3 border-top">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div className="small">
//                     <a href="#" className="text-decoration-none me-3">Điều khoản sử dụng</a>
//                       <a href="#" className="text-decoration-none me-3">Câu hỏi thường gặp</a>
//                       <a href="#" className="text-decoration-none">Chính sách bảo mật</a>
//                     </div>
//                     <button className="btn btn-success">
//                       Hỗ trợ trực tuyến
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className={styles.modalFooter}>
//               {!isPaymentStep ? (
//                 <button className="btn btn-primary" onClick={handleSubmit}>Tiếp tục</button>
//               ) : null}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartPage;



    




import React, { useState, useEffect } from 'react';
import { Steps, Button, Radio, Form, Input, Select, Alert, Divider } from 'antd';
import styles from './CartPage.module.css';

const CartPage = () => {
  // ----------------------------
  // 1. Các state chính
  // ----------------------------
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    gender: 'Anh',
    name: '',
    phone: '',
    email: '',
    province: null,
    district: null, // new state for district
    ward: null, // new state for ward
    deliveryOption: 'Giao hàng tận nhà',
    note: '',
  });
  const [form] = Form.useForm();
  const [discountCode, setDiscountCode] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Giày Adidas Stan Smith Fairway M20324 - 36',
      price: 2100000,
      quantity: 1,
      image:
        'https://authentic-shoes.com/wp-content/uploads/2023/04/8880_01.jpg_c2f0a7080647417eb4a17324fed9919f-768x343.jpeg',
    },
    {
      id: 2,
      name: 'Giày Nike Wmns Air Jordan 1 Low ‘White Wolf Grey’ DC0774-105',
      price: 2500000,
      quantity: 2,
      image:
        'https://authentic-shoes.com/wp-content/uploads/2023/04/776547_01.jpg_79fdea599edb49e4ace83698f93f26e1-768x386.jpeg',
    },
  ]);
  const paymentMethods = [
    {
      id: 'momo',
      name: 'Thanh toán qua Momo',
      description: 'Thanh toán nhanh qua ví Momo',
      icon: 'https://cdn.30shine.com/Icons/Payment/momo.png',
    },
    {
      id: 'zalopay',
      name: 'Thanh toán qua ZaloPay',
      description: 'Thanh toán nhanh qua ZaloPay',
      icon: 'https://cdn.30shine.com/Icons/Payment/zalopay.png',
    },
    {
      id: 'vietqr',
      name: 'Quét mã VietQR',
      description: 'Ghi nhận giao dịch tức thì. Hỗ trợ 40+ ngân hàng.',
      icon: '💳',
    },
    {
      id: 'mbbank',
      name: 'Chuyển khoản MB Bank',
      description: 'Chuyển khoản thủ công tới MB Bank',
      icon: '🏦',
    },
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng (COD)',
      description: 'Thanh toán khi nhận hàng',
      icon: '🚚',
    },
  ];
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]); // new state for districts
  const [wards, setWards] = useState([]); // new state for wards
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false); // loading districts state
  const [loadingWards, setLoadingWards] = useState(false); // loading wards state


  // ----------------------------
  // 2. Fetch API data
  // ----------------------------
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await fetch('https://provinces.open-api.vn/api/?depth=1');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Could not fetch provinces:", error);
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!customerInfo.province) {
        setDistricts([]);
        return;
      }
      setLoadingDistricts(true);
      try {
        // Find the selected province object
        const selectedProvince = provinces.find(p => p.name === customerInfo.province);
        if (!selectedProvince) {
          setDistricts([]);
          return;
        }
        const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDistricts(data.districts);
      } catch (error) {
        console.error("Could not fetch districts:", error);
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [customerInfo.province, provinces]); // Refetch districts when province changes

  useEffect(() => {
    const fetchWards = async () => {
      if (!customerInfo.district) {
        setWards([]);
        return;
      }
      setLoadingWards(true);
      try {
        // Find the selected district object
        const selectedDistrict = districts.find(d => d.name === customerInfo.district);
        if (!selectedDistrict) {
          setWards([]);
          return;
        }
        const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWards(data.wards);
      } catch (error) {
        console.error("Could not fetch wards:", error);
      } finally {
        setLoadingWards(false);
      }
    };

    fetchWards();
  }, [customerInfo.district, districts]); // Refetch wards when district changes


  // ----------------------------
  // 3. Tính toán tiền
  // ----------------------------
  const productTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingFee =
    customerInfo.deliveryOption === 'Giao hàng tận nhà' ? 30000 : 0;

  const finalTotal = productTotal + shippingFee - discountValue;

  // ----------------------------
  // 4. Xử lý sự kiện
  // ----------------------------
  // Tăng/giảm số lượng từng sản phẩm
  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Xoá một sản phẩm khỏi giỏ
  const handleRemoveItem = (itemId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ?')) {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  // Khi nhấn MUA NGAY
  const handleBuyNowClick = () => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng trống, không thể MUA NGAY!');
      return;
    }
    setIsCheckoutModalVisible(true);
    setCurrent(0);
    setSelectedPaymentMethod(null);

    // Đặt giá trị mặc định cho form
    form.setFieldsValue({
      gender: customerInfo.gender,
      name: customerInfo.name,
      phone: customerInfo.phone,
      email: customerInfo.email,
      province: customerInfo.province,
      district: customerInfo.district, // set district default value
      ward: customerInfo.ward, // set ward default value
      deliveryOption: customerInfo.deliveryOption,
      note: customerInfo.note,
    });
  };

  // Đóng modal
  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalVisible(false);
    setCurrent(0);
    setSelectedPaymentMethod(null);
  };

  // Form thay đổi thông tin
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Chuyển giữa giao hàng / nhận tại shop
  const handleDeliveryOptionChange = (e) => {
    setCustomerInfo((prev) => ({
      ...prev,
      deliveryOption: e.target.value,
    }));
  };

  const handleProvinceChange = (value) => {
    setCustomerInfo(prev => ({ ...prev, province: value, district: null, ward: null })); // Reset district and ward when province changes
    form.setFieldsValue({ district: null, ward: null }); // Clear district and ward fields in form
  };

  const handleDistrictChange = (value) => {
    setCustomerInfo(prev => ({ ...prev, district: value, ward: null })); // Reset ward when district changes
    form.setFieldsValue({ ward: null }); // Clear ward field in form
  };


  const handleWardChange = (value) => {
    setCustomerInfo(prev => ({ ...prev, ward: value }));
  };

  // Bước 1 -> Bước 2
  const handleSubmitCheckoutInfo = () => {
    form.validateFields()
      .then(values => {
        // Cập nhật thông tin khách hàng
        setCustomerInfo({
          ...customerInfo,
          ...values
        });
        // Tiến đến bước tiếp theo
        setCurrent(1);
      })
      .catch(errorInfo => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  // Bước 2: Chọn phương thức -> sang Bước 3
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setCurrent(2);
  };

  // Quay lại bước trước
  const handlePrev = () => {
    setCurrent(current - 1);
  };

  // Xác nhận thanh toán (bước 3)
  const handleConfirmPayment = () => {
    if (!selectedPaymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }
    alert(
      `Bạn đã chọn thanh toán qua: ${selectedPaymentMethod.name}.\nTổng thanh toán: ${finalTotal.toLocaleString()} đ.`
    );
    // Gọi API, xử lý đơn hàng, vv...
    handleCloseCheckoutModal();
  };

  // Áp dụng mã giảm giá (giả lập)
  const handleApplyDiscountCode = () => {
    const code = discountCode.trim().toUpperCase();
    if (!code) {
      alert('Bạn chưa nhập mã ưu đãi!');
      return;
    }
    // Ví dụ một số mã demo
    if (code === 'AUTHENTIC') {
      // Mã "AUTHENTIC" => giảm 5% trên productTotal
      const discountAmount = productTotal * 0.05;
      setDiscountValue(discountAmount);
      alert(
        `Áp dụng mã "AUTHENTIC" – giảm ${discountAmount.toLocaleString()} đ!`
      );
    } else if (code === 'FREESHIP') {
      if (shippingFee > 0) {
        setDiscountValue(shippingFee);
        alert('Áp dụng mã "FREESHIP" – giảm 30.000 đ phí ship!');
      } else {
        alert(
          'Mã "FREESHIP" chỉ áp dụng khi chọn Giao hàng tận nhà!'
        );
      }
    } else if (code === 'GIAM50K') {
      const discountAmount = 50000;
      setDiscountValue(discountAmount);
      alert('Áp dụng mã "GIAM50K" – giảm 50.000 đ!');
    } else {
      alert('Mã ưu đãi không hợp lệ!');
    }
  };

  // Các bước trong quy trình thanh toán
  const steps = [
    {
      title: 'Thông tin',
      content: (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            gender: customerInfo.gender,
            name: customerInfo.name,
            phone: customerInfo.phone,
            email: customerInfo.email,
            province: customerInfo.province,
            district: customerInfo.district,
            ward: customerInfo.ward,
            deliveryOption: customerInfo.deliveryOption,
            note: customerInfo.note,
          }}
        >
          {/* Tóm tắt giỏ hàng */}
          <h5>Giỏ hàng ({cartItems.length} sản phẩm)</h5>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} × {item.quantity} ={' '}
                {(item.price * item.quantity).toLocaleString()} đ
              </li>
            ))}
          </ul>
          <p>
            Tạm tính: {productTotal.toLocaleString()} đ,
            Phí ship: {shippingFee.toLocaleString()} đ,
            Giảm giá: {discountValue.toLocaleString()} đ
          </p>
          <Divider />
          <h4>Thông tin khách hàng</h4>

          <Form.Item name="gender" label="Giới tính">
            <Radio.Group>
              <Radio value="Anh">Anh</Radio>
              <Radio value="Chị">Chị</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="name"
            label="Họ và Tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Alert
            message="Thông tin đơn hàng sẽ gửi qua email; chúng tôi sẽ liên hệ lại qua số điện thoại."
            type="info"
            showIcon
            style={{ marginBottom: '20px' }}
          />

          <Divider />
          <h4>Yêu cầu nhận hàng</h4>

          <Form.Item name="deliveryOption" label="Hình thức nhận hàng">
            <Radio.Group onChange={(e) => setCustomerInfo(prev => ({ ...prev, deliveryOption: e.target.value }))}>
              <Radio value="Giao hàng tận nhà">Giao hàng tận nhà</Radio>
              <Radio value="Nhận tại cửa hàng">Nhận tại cửa hàng</Radio>
            </Radio.Group>
          </Form.Item>

          {form.getFieldValue('deliveryOption') === 'Giao hàng tận nhà' && (
            <>
              <Form.Item
                name="province"
                label="Tỉnh/Thành phố"
                rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố!' }]}
              >
                <Select
                  placeholder="Chọn Tỉnh/Thành phố"
                  loading={loadingProvinces}
                  onChange={handleProvinceChange}
                >
                  {provinces.map(province => (
                    <Select.Option key={province.code} value={province.name}>
                      {province.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="district"
                label="Quận/Huyện"
                rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện!' }]}
                >
                <Select
                  placeholder="Chọn Quận/Huyện"
                  loading={loadingDistricts}
                  onChange={handleDistrictChange}
                  disabled={!customerInfo.province} // Disable if no province selected
                >
                  {districts.map(district => (
                    <Select.Option key={district.code} value={district.name}>
                      {district.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="ward"
                label="Phường/Xã"
                rules={[{ required: true, message: 'Vui lòng chọn Phường/Xã!' }]}
              >
                <Select
                  placeholder="Chọn Phường/Xã"
                  loading={loadingWards}
                  onChange={handleWardChange}
                  disabled={!customerInfo.district} // Disable if no district selected
                >
                  {wards.map(ward => (
                    <Select.Option key={ward.code} value={ward.name}>
                      {ward.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Thanh toán',
      content: (
        <div>
          <div className="bg-light p-3 rounded mb-3">
            <p className="mb-1">Giỏ hàng: {cartItems.length} sản phẩm</p>
            <p className="mb-1">
              Người nhận: {customerInfo.gender} {customerInfo.name},{' '}
              {customerInfo.phone}
            </p>
            <p className="mb-0">
              {customerInfo.deliveryOption === 'Nhận tại cửa hàng'
                ? 'Nhận tại cửa hàng'
                : `Địa chỉ: ${customerInfo.ward}, ${customerInfo.district}, ${customerInfo.province}`} {/* Show full address */}
            </p>
            <p style={{ marginTop: '8px' }}>
              Tạm tính: {productTotal.toLocaleString()} đ
              <br />
              Phí ship: {shippingFee.toLocaleString()} đ
              <br />
              Giảm giá: {discountValue.toLocaleString()} đ
              <br />
              <strong>
                Tổng: {finalTotal.toLocaleString()} đ
              </strong>
            </p>
          </div>
          <h5>Vui lòng chọn một phương thức thanh toán:</h5>

          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded p-3 mb-3 ${selectedPaymentMethod?.id === method.id ? 'border-primary' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => handlePaymentMethodSelect(method)}
            >
              {method.icon.startsWith('http') ? (
                <img
                  src={method.icon}
                  alt={method.name}
                  width="40"
                  className="me-3"
                />
              ) : (
                <span className="me-3 fs-4">{method.icon}</span>
              )}
              <strong>{method.name}</strong> –{' '}
              <em>{method.description}</em>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Xác nhận',
      content: (
        <div>
          <div className="bg-light p-3 rounded mb-3">
            <p className="mb-1">Mã đơn hàng: SLSEXW10</p>
            <p className="mb-1">
              Người nhận: {customerInfo.gender} {customerInfo.name},{' '}
              {customerInfo.phone}
            </p>
            <p className="mb-0">
              {customerInfo.deliveryOption === 'Nhận tại cửa hàng'
                ? 'Nhận tại cửa hàng'
                : `Địa chỉ: ${customerInfo.ward}, ${customerInfo.district}, ${customerInfo.province}`} {/* Show full address */}
            </p>
            <p style={{ marginTop: '8px' }}>
              Phí ship: {shippingFee.toLocaleString()} đ
              <br />
              Giảm giá: {discountValue.toLocaleString()} đ
              <br />
              <strong>
                Tổng thanh toán: {finalTotal.toLocaleString()} đ
              </strong>
            </p>
          </div>

          <h4>Thanh toán qua {selectedPaymentMethod?.name}</h4>

          {selectedPaymentMethod?.id === 'momo' && (
            <div>
              <p>Vui lòng mở ứng dụng Momo, quét mã hoặc nhập SĐT để chuyển tiền...</p>
              <img
                src="https://static.mservice.io/img/logo-momo.png"
                alt="Momo"
                width="100"
              />
            </div>
          )}
          {selectedPaymentMethod?.id === 'zalopay' && (
            <div>
              <p>Quét mã QR ZaloPay hoặc bấm link thanh toán...</p>
              <img
                src="https://cdn.30shine.com/Icons/Payment/zalopay.png"
                alt="ZaloPay"
                width="100"
              />
            </div>
          )}
          {selectedPaymentMethod?.id === 'vietqr' && (
            <div style={{ textAlign: 'center' }}>
              <p>Quét mã VietQR dưới đây, được hỗ trợ bởi 40+ ngân hàng.</p>
              <div
                style={{
                  border: '1px dashed #aaa',
                  padding: '20px',
                  margin: '0 auto',
                  display: 'inline-block',
                }}
              >
                [Mã QR VietQR giả lập]
              </div>
            </div>
          )}
          {selectedPaymentMethod?.id === 'mbbank' && (
            <div>
              <p>Chuyển khoản vào tài khoản MB Bank:</p>
              <p>
                <strong>STK:</strong> 0123456789
                <br />
                <strong>Chủ tài khoản:</strong> CÔNG TY ABC
              </p>
            </div>
          )}
          {selectedPaymentMethod?.id === 'cod' && (
            <div>
              <p>
                Bạn sẽ thanh toán khi nhận hàng (COD). Nhân viên giao
                hàng sẽ thu tiền mặt.
              </p>
            </div>
          )}
        </div>
      ),
    },
  ];

  // ----------------------------
  // 5. Render UI
  // ----------------------------
  return (
    <div className="container mt-4">
      <h2>Giỏ hàng của bạn</h2>
      <br />

      {/* Danh sách sản phẩm */}
      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống!</p>
      ) : (
        <div className="row">
          <div className="col-md-8">
            {/* Header bảng */}
            <div className="row container-fluid text-center fw-bold">
              <div className="col-2">Sản phẩm</div>
              <div className="col-4"></div>
              <div className="col-2">Giá</div>
              <div className="col-2">Số lượng</div>
              <div className="col-2">Tạm tính</div>
            </div>
            <hr />

            {/* Mỗi item */}
            {cartItems.map((item) => (
              <div key={item.id}>
                <div className="row align-items-center py-2">
                  <div className="col-2">
                    <img src={item.image} alt={item.name} width="60" />
                  </div>
                  <div className="col-4">
                    <p className="mb-0 fw-semibold">{item.name}</p>
                    <button
                      className="btn btn-sm btn-link text-danger p-0"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Xoá
                    </button>
                  </div>
                  <div className="col-2">
                    <strong>{item.price.toLocaleString()} đ</strong>
                  </div>
                  <div className="col-2 d-flex align-items-center">
                    <button
                      onClick={() => handleDecreaseQuantity(item.id)}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      readOnly
                      className="form-control text-center mx-2"
                      style={{ width: '40px' }}
                    />
                    <button
                      onClick={() => handleIncreaseQuantity(item.id)}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      +
                    </button>
                  </div>
                  <div className="col-2">
                    <strong>
                      {(item.price * item.quantity).toLocaleString()} đ
                    </strong>
                  </div>
                </div>
                <hr />
              </div>
            ))}

            <a href="#" className={styles.button}>
              ← Tiếp tục xem sản phẩm
            </a>
          </div>

          {/* Cột phải: tóm tắt */}
          <div className="col-md-4">
            <h4>Cộng giỏ hàng</h4>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Tạm tính sản phẩm</span>
              <strong>{productTotal.toLocaleString()} đ</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Phí ship</span>
              <strong>{shippingFee.toLocaleString()} đ</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Giảm giá</span>
              <strong>{discountValue.toLocaleString()} đ</strong>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <strong>Tổng thanh toán</strong>
              <strong>{finalTotal.toLocaleString()} đ</strong>
            </div>
            <hr />

            <div className={styles.buttonContainer}>
              <button
                className={`${styles.button} ${styles.buttonRed} col-4 mb-2`}
                onClick={handleBuyNowClick}
              >
                Mua ngay
              </button>
              <button
                className={`${styles.button} ${styles.buttonBlue} col-4 mb-2`}
                onClick={() => alert('Chọn trả góp qua thẻ!')}
              >
                Trả góp
              </button>
              <button
                className={`${styles.button} ${styles.buttonYellow} col-4 mb-2`}
                onClick={() => alert('Mua ngay - Trả sau!')}
              >
                Trả sau
              </button>
            </div>
            <button
              className={`${styles.checkoutButton} col-12`}
              onClick={() => alert('Tiến hành thanh toán!')}
            >
              Tiến hành thanh toán
            </button>
            <br />

            <div className={styles.discountCodeSection}>
              <label
                htmlFor="discount-code"
                className={styles.discountCodeLabel}
              >
                Mã ưu đãi
              </label>
              <hr />
              <br />
              <input
                type="text"
                id="discount-code"
                className={styles.discountCodeInput}
                placeholder="Nhập mã ưu đãi"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button
                className={`${styles.buttond} col-12`}
                onClick={handleApplyDiscountCode}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal checkout với Steps của Ant Design */}
      {isCheckoutModalVisible && (
        <div className={`${styles.modalOverlay} ${styles.modalOverlayShow}`}>
          <div className={`${styles.modalContent} ${styles.modalContentShow}`} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h3>Thanh toán đơn hàng</h3>
              <span className={styles.closeButton} onClick={handleCloseCheckoutModal}>
                &times;
              </span>
            </div>

            <div className={styles.modalBody}>
              {/* Steps của Ant Design */}
              <Steps current={current} style={{ marginBottom: '30px' }}>
                <Steps.Step title="Thông tin người nhận" />
                <Steps.Step title="Phương thức thanh toán" />
                <Steps.Step title="Xác nhận thanh toán" />
              </Steps>

              {/* Nội dung của từng bước */}
              <div className="steps-content" style={{ minHeight: '300px' }}>
                {steps[current].content}
              </div>

              {/* Các nút điều hướng */}
              <div className="steps-action" style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                {current > 0 && (
                  <Button style={{ marginRight: '8px' }} onClick={handlePrev}>
                    Quay lại
                  </Button>
                )}

                {current === 0 && (
                  <Button type="primary" onClick={handleSubmitCheckoutInfo}>
                    Tiếp tục
                  </Button>
                )}

                {current === 2 && (
                  <Button type="primary" onClick={handleConfirmPayment}>
                    Xác nhận thanh toán
                  </Button>
                )}

                {current === 1 && (
                  <div style={{ textAlign: 'right' }}>
                    <p className="text-muted">Vui lòng chọn một phương thức thanh toán để tiếp tục</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;