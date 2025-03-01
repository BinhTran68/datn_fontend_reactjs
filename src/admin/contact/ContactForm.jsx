import React, { useState } from 'react';
import styles from './ContactForm.module.css';

function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    else if (name === 'phone') setPhone(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'content') setContent(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form đã được gửi:', { name, phone, email, content });
    setName('');
    setPhone('');
    setEmail('');
    setContent('');
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
  };

  return (
    <div className={styles.contactWrapper}>
      <div className={styles.contactContainer}>
        <div className={styles.storeInfoSection}>
          <div className={styles.storeImageContainer}>
            <img src="https://authentic-shoes.com/wp-content/uploads/2023/04/272082a52d9bd7c58e8a_63946c68e6714d38b63b68c9f6bd1ce6_2048x2048.webp" alt="Authentic Shoes Store" className={styles.storeImage} />
          </div>
          
          <div className={styles.storeDescription}>
            <h3>Authentic Shoes international</h3>
            <p>
              Được thành lập từ năm 2015, là chuỗi bán lẻ Sneaker, Streetwear và phụ kiện thời 
              trang chính hãng có thị phần số 1 Việt Nam với số lượt truy cập mua hàng tại 
              website <a href="https://authentic-shoes.com">authentic-shoes.com</a> lên tới trên 10.000 lượt mỗi ngày từ khắp 63 tỉnh 
              thành trên cả nước.
            </p>
            
            <h3>TỪ MỘT NHÀ SƯU TẦM SNEAKER</h3>
            <ul>
              <li>
                Biết được nhu cầu của người tiêu dùng Việt Nam luôn tìm kiếm những đôi giày 
                chất lượng, nhiều kiểu dáng, màu sắc mang màu sắc riêng và quan trọng nhất 
                là chúng phải 100% chính hãng. <span className={styles.brandName}>Authentic Shoes</span> đã ra đời.
              </li>
              <li>
                Xuất thân là một cửa hàng Online chuyên Order Sneaker của các thương hiệu 
                lớn như <a href="#">Nike</a>, <a href="#">Adidas</a> hay <a href="#">Puma</a>, <a href="#">MLB</a>... trên thế giới từ Mỹ, Anh Quốc, Pháp, 
                Nhật... Trải qua 4 năm hình thành và phát triển, <span className={styles.brandName}>Authentic Shoes</span> đã giải quyết 
                được phần nào mong muốn của người tiêu dùng. Nhưng đương nhiên họ không 
                dừng lại ở đó, Sneaker thôi là chưa đủ.
              </li>
            </ul>
          </div>
          
          <div className={styles.contactInfoSection}>
            <div className={styles.contactDetail}>
              <strong>ĐỊA CHỈ TRỤ SỞ:</strong> Tầng 4 72 Tây Sơn Đống Đa
            </div>
            <div className={styles.contactDetail}>
              <strong>SỐ ĐIỆN THOẠI:</strong> 078 5499555
            </div>
            <div className={styles.contactDetail}>
              <strong>EMAIL:</strong> <a href="mailto:Service@AutheticShoes.com">Service@AutheticShoes.com</a>
            </div>
            
            <div className={styles.mapContainer}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.607385611032!2d105.82279087498339!3d21.008699888699865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac8109765ba5%3A0xb3be79f8f64a59f9!2zNzIgUC4gVMOieSBTxqFuLCBLaMawxqFuZyBUaMaw4bujbmcsIMSQ4buRbmcgxJBhLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1708330547241!5m2!1svi!2s" 
                width="100%" 
                height="350" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Authentic Shoes location"
              ></iframe>
            </div>
            
            <div className={styles.additionalInfo}>
              <p>Tầng 4 số 70-72 Tây Sơn, Quận Đống Đa, Hà Nội, Việt Nam</p>
              <p>Phone: (098) 491 8486 – Fax: (098) 491 8486</p>
              <p>Tổng đài mua hàng: 0913576123</p>
              <p>Tổng đài CSKH: 0984918486</p>
              <p>Thời gian làm việc tổng đài CSKH: 8:30 – 17h30 (Thứ 2 – Thứ 7)</p>
            </div>
          </div>
        </div>
        
        <div className={styles.contactFormSection}>
          <div className={styles.formBox}>
            <h2>GỬI THÔNG TIN LIÊN HỆ</h2>
            <p className={styles.formDesc}>Quý khách vui lòng để lại thông tin liên hệ, AUTHENTIC SHOES sẽ liên hệ với quý khách trong thời gian sớm nhất.</p>
            
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Họ và tên <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Điện thoại <span className={styles.required}>*</span></label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  required
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email <span className={styles.required}>*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  placeholder="Nhập địa chỉ email"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="content">Nội dung <span className={styles.required}>*</span></label>
                <textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={handleChange}
                  rows="5"
                  required
                  placeholder="Nhập nội dung liên hệ"
                ></textarea>
              </div>
              <button type="submit" className={styles.submitButton}>GỬI THÔNG TIN</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;