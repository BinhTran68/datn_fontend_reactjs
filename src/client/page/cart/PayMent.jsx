import React, { useState } from 'react';
import styles from './PayMent.module.css';

const PayMent = () => {
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra các trường bắt buộc
        const newErrors = {};
        if (!fullname) newErrors.fullname = 'Vui lòng nhập họ và tên.';
        if (!phone) newErrors.phone = 'Vui lòng nhập số điện thoại.';
        if (!email) newErrors.email = 'Vui lòng nhập email.';
        if (!city) newErrors.city = 'Vui lòng chọn tỉnh/thành phố.';
        if (!district) newErrors.district = 'Vui lòng chọn quận/huyện.';
        if (!address) newErrors.address = 'Vui lòng nhập địa chỉ.';
        if (!paymentMethod) newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSuccessMessage(''); // Xóa thông báo thành công nếu có lỗi
            return;
        }

        // Xử lý thanh toán nếu không có lỗi
        setSuccessMessage('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');

        // Reset form sau khi thành công
        setFullname('');
        setPhone('');
        setEmail('');
        setCity('');
        setDistrict('');
        setAddress('');
        setNote('');
        setPaymentMethod('');
        setErrors({});
    };

    return (
        <div>
            <div className="row">
                <div className="col-7">
                    <div className={styles.container}>
                        <p>Bạn có mã ưu đãi? <a href="#">Ấn vào đây để nhập mã</a></p><hr />
                        <h5>THÔNG TIN THANH TOÁN</h5>
                        <label htmlFor="fullname">Họ và tên *</label><br />
                        <input
                            className={styles.input}
                            type="text"
                            id="fullname"
                            placeholder="Nhập họ và tên"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                        {errors.fullname && <p className={styles.error}>{errors.fullname}</p>}<br />

                        <div className="row">
                            <div className="col-6">
                                <label htmlFor="phone">Số điện thoại *</label><br />
                                <input
                                    className={styles.input}
                                    type="text"
                                    id="phone"
                                    placeholder="Nhập số điện thoại"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                {errors.phone && <p className={styles.error}>{errors.phone}</p>}
                            </div>
                            <div className="col-6">
                                <label htmlFor="email">Địa chỉ email *</label><br />
                                <input
                                    className={styles.input}
                                    type="email"
                                    id="email"
                                    placeholder="Nhập địa chỉ email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <p className={styles.error}>{errors.email}</p>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <label htmlFor="city">Tỉnh/Thành phố *</label><br />
                                <select
                                    id="city"
                                    className={styles.select}
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                >
                                    <option value="">Chọn Tỉnh/Thành phố</option>
                                    <option value="HaNoi">Hà Nội</option>
                                </select>
                                {errors.city && <p className={styles.error}>{errors.city}</p>}
                            </div>
                            <div className="col-6">
                                <label htmlFor="district">Quận/Huyện *</label><br />
                                <select
                                    id="district"
                                    className={styles.select}
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                >
                                    <option value="">Chọn Quận/Huyện</option>
                                    <option value="1">a</option>
                                </select>
                                {errors.district && <p className={styles.error}>{errors.district}</p>}
                            </div>
                        </div>

                        <label htmlFor="address">Địa chỉ *</label><br />
                        <textarea
                            className={styles.textarea}
                            id="address"
                            placeholder="Nhập địa chỉ cụ thể. Số nhà, tên đường..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        ></textarea>
                        {errors.address && <p className={styles.error}>{errors.address}</p>}

                        <h5>THÔNG TIN BỔ SUNG</h5>

                        <label htmlFor="note">Ghi chú đơn hàng (tùy chọn)</label><br />
                        <textarea
                            className={styles.textarea}
                            id="note"
                            placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        ></textarea>

                    </div>
                </div>

                <div className="col-5"><br /><br />
                    <div className={styles.orderBox}>
                        <h5>ĐƠN HÀNG CỦA BẠN</h5>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className="col-10">SẢN PHẨM</th>
                                    <th className="col-2">TẠM TÍNH</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Giày Nike Zoom Vapor Pro 2 HC White' DR6191-101-42 x 2</td>
                                    <td>7,000,000 ₫</td>
                                </tr>
                                <tr>
                                    <td className={styles.total}>Tổng</td>
                                    <td className={styles.total}>7,000,000 ₫</td>
                                </tr>
                            </tbody>
                        </table>

                        <div>
                            <div className={styles.formCheck}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentMethod"
                                    id="flexRadioDefault1"
                                    onChange={() => setPaymentMethod('bankTransfer')}
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    Chuyển khoản ngân hàng
                                </label>
                                <p>Thực hiện thanh toán vào ngay tài khoản ngân hàng của Authentic Shoes. Vui lòng sử dụng Mã đơn hàng của bạn trong phần Nội dung thanh toán.</p>
                                <img src="https://authentic-shoes.com/wp-content/uploads/2023/11/Screenshot-2023-11-24-at-23.19.42.png" alt="" width="419" />
                                <hr />
                            </div>
                            <div className={styles.formCheck}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentMethod"
                                    id="flexRadioDefault2"
                                    onChange={() => setPaymentMethod('cashOnDelivery')}
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                    Kiểm tra thanh toán
                                </label><hr />
                            </div>
                            <div className={styles.formCheck}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentMethod"
                                    id="flexRadioDefault3"
                                    onChange={() => setPaymentMethod('creditCard')}
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault3">
                                    Thẻ ATM/Visa/Master/JCB/QR Pay qua cổng VNPAY
                                </label><hr />
                            </div>
                            <div className={styles.formCheck}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentMethod"
                                    id="flexRadioDefault4"
                                    onChange={() => setPaymentMethod('installment')}
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault4">
                                    Fundiin - Mua trước trả sau 0% lãi suất
                                </label>
                            </div>
                        </div><br />

                        <button onClick={handleSubmit} className={styles.orderButton}>ĐẶT HÀNG</button>

                        {successMessage && <p className={styles.success}>{successMessage}</p>} {/* Hiển thị thông báo thanh toán thành công ngay tại đây */}

                        <p className={styles.note}>Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng, tăng trải nghiệm sử dụng website, và cho các mục đích cụ thể khác đã được mô tả trong chính sách riêng tư của chúng tôi.</p>

                    </div>
                </div>
            </div>

            <br />
        </div>
    );
}

export default PayMent;