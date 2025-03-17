

// HomePage.jsx
import React, { useState , useEffect } from 'react';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'men', name: 'Giày Nam' },
    { id: 'women', name: 'Giày Nữ' },
    { id: 'sport', name: 'Giày Thể Thao' },
    { id: 'casual', name: 'Giày Casual' },
    { id: 'sale', name: 'Khuyến Mãi' }
  ];

  const featuredProducts = [
    { 
      id: 1, 
      name: 'Giày Nike Air Max', 
      price: '2.490.000₫', 
      oldPrice: '3.200.000₫', 
      image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/7fbc5e94-8d49-4730-a280-f19d3cfad0b0/air-max-90-shoes-N8MLr4.png', 
      category: 'sport', 
      isNew: true, 
      isSale: true 
    },
    { 
      id: 2, 
      name: 'Giày Adidas Ultra Boost', 
      price: '2.790.000₫', 
      oldPrice: '3.500.000₫', 
      image: 'https://cf.shopee.vn/file/8c4bdfcb1341fe0db77ad6e1677a0c3b', 
      category: 'sport', 
      isNew: false, 
      isSale: true 
    },
    { 
      id: 3, 
      name: 'Giày Converse Classic', 
      price: '1.590.000₫', 
      oldPrice: '', 
      image: 'https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw456d6503/images/a_107/M9166_A_107X1.jpg', 
      category: 'casual', 
      isNew: true, 
      isSale: false 
    },
    { 
      id: 4, 
      name: 'Giày Vans Old Skool', 
      price: '1.690.000₫', 
      oldPrice: '', 
      image: 'https://cf.shopee.vn/file/e65e148ce6a9eef57621921f41cf66ef', 
      category: 'casual', 
      isNew: false, 
      isSale: false 
    },
    { 
      id: 5, 
      name: 'Giày Thể Thao Puma', 
      price: '1.890.000₫', 
      oldPrice: '2.300.000₫', 
      image: 'https://cf.shopee.vn/file/sg-11134201-22100-1wjvs3odqyiv54', 
      category: 'sport', 
      isNew: false, 
      isSale: true 
    },
    { 
      id: 6, 
      name: 'Giày Cao Gót Elegance', 
      price: '1.350.000₫', 
      oldPrice: '', 
      image: 'https://cf.shopee.vn/file/28ad9c6c06615339b2109efefa0c8eeb', 
      category: 'women', 
      isNew: true, 
      isSale: false 
    },
    { 
      id: 7, 
      name: 'Giày Tây Nam Oxford', 
      price: '2.150.000₫', 
      oldPrice: '', 
      image: 'https://tse1.mm.bing.net/th?id=OIP.mmKYtRHklyCBEVguNWdcqQHaHa&pid=Api&P=0&h=180', 
      category: 'men', 
      isNew: false, 
      isSale: false 
    },
    { 
      id: 8, 
      name: 'Giày Lười Nam', 
      price: '1.450.000₫', 
      oldPrice: '1.800.000₫', 
      image: 'https://tse3.mm.bing.net/th?id=OIP.5yNcgb_V44HGbp0A6Xh9iQHaHa&pid=Api&P=0&h=180', 
      category: 'men', 
      isNew: false, 
      isSale: true 
    },
  ];

  const banners = [
    { 
      id: 1, 
      image: 'https://salt.tikicdn.com/ts/tmp/59/24/36/cea1f55d81620d5767ca2b8c09794a95.jpg', 
      title: 'BỘ SƯU TẬP MỚI NHẤT', 
      subtitle: 'Khám phá các mẫu giày mới nhất mùa này', 
      link: '/collections/new' 
    },
    { 
      id: 2, 
      image: 'https://i.ytimg.com/vi/CXSko9ySpyo/maxresdefault.jpg', 
      title: 'GIẢM GIÁ LÊN ĐẾN 50%', 
      subtitle: 'Ưu đãi đặc biệt cho các mẫu giày hot nhất', 
      link: '/collections/sale' 
    },
    { 
      id: 3, 
      image: 'https://png.pngtree.com/thumb_back/fw800/background/20220929/pngtree-shoes-promotion-banner-background-image_1466238.jpg', 
      title: 'GIÀY THỂ THAO CHÍNH HÃNG', 
      subtitle: 'Đa dạng mẫu mã từ các thương hiệu nổi tiếng', 
      link: '/collections/sport' 
    },
  ];

  const blogs = [
    { 
      id: 1, 
      title: '5 Cách phối đồ với giày sneaker trắng', 
      image: 'https://img.freepik.com/free-photo/white-high-top-sneakers-unisex-footwear-fashion_53876-106036.jpg', 
      date: '05/03/2025' 
    },
    { 
      id: 2, 
      title: 'Hướng dẫn chọn size giày chuẩn', 
      image: 'https://img.freepik.com/free-photo/measuring-foot-size-with-ruler_23-2149860438.jpg', 
      date: '27/02/2025' 
    },
    { 
      id: 3, 
      title: 'Cách bảo quản giày thể thao đúng cách', 
      image: 'https://img.freepik.com/free-photo/sports-shoe-pair-design-casual-leather_1203-6400.jpg', 
      date: '15/02/2025' 
    },
  ];

  const filteredProducts = featuredProducts.filter(product => 
    (activeCategory === 'all' || product.category === activeCategory) &&
    (product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={styles.container}>
      
      {/* Slider/Banner */}
     <div className={styles.bannerSlider}>
        {banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`${styles.mainBanner} ${index === currentBannerIndex ? styles.active : ''}`} 
            style={{ backgroundImage: `url(${banner.image})` }}
          >
            <div className={styles.bannerContent}>
              <h2>{banner.title}</h2>
              <p>{banner.subtitle}</p>
              <a href={banner.link} className={styles.bannerBtn}>Xem ngay</a>
            </div>
          </div>
        ))}
        <div className={styles.bannerDots}>
          {banners.map((_, index) => (
            <span 
              key={index} 
              className={index === currentBannerIndex ? styles.activeDot : ''}
              onClick={() => setCurrentBannerIndex(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Featured Categories */}
      <div className={styles.featuredCategories}>
        <div className={styles.categoryBox}>
          <img src="https://tungluxury.com/wp-content/uploads/2023/02/giay-louis-vuitton-lv-trainer-54-damier-ebene-multi-like-auth-3.jpg" alt="Giày Nam" />
          <h3>Giày Nam</h3>
          <a href="/collections/men">Xem thêm</a>
        </div>
        <div className={styles.categoryBox}>
          <img src="https://cf.shopee.vn/file/2b84a350c4819800e127af7a01e3c4cc" alt="Giày Nữ" />
          <h3>Giày Nữ</h3>
          <a href="/collections/women">Xem thêm</a>
        </div>
        <div className={styles.categoryBox}>
          <img src="https://product.hstatic.net/200000174405/product/s6ip3iygk4_2feda4d717464f84a8946706f215a298.jpg" alt="Giày Thể Thao" />
          <h3>Giày Thể Thao</h3>
          <a href="/collections/sport">Xem thêm</a>
        </div>
      </div>

      {/* Promo Banners */}
      <div className={styles.promoBanners}>
        <div className={styles.promoBanner}>
          <img src="https://img.freepik.com/free-vector/free-shipping-concept-illustration_114360-1554.jpg" alt="Free Shipping" />
          <div className={styles.promoContent}>
            <h3>Miễn phí vận chuyển</h3>
            <p>Cho đơn hàng từ 1.000.000₫</p>
          </div>
        </div>
        <div className={styles.promoBanner}>
          <img src="https://img.freepik.com/free-vector/guarantee-concept-illustration_114360-10886.jpg" alt="Authentic" />
          <div className={styles.promoContent}>
            <h3>Sản phẩm chính hãng</h3>
            <p>Cam kết 100% authentic</p>
          </div>
        </div>
        <div className={styles.promoBanner}>
          <img src="https://img.freepik.com/free-vector/call-center-concept-illustration_114360-2211.jpg" alt="Support" />
          <div className={styles.promoContent}>
            <h3>Hỗ trợ 24/7</h3>
            <p>Hotline: 0987 654 321</p>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className={styles.featuredProducts}>
        <h2 className={styles.sectionTitle}>Sản phẩm nổi bật</h2>
        
        <div className={styles.productFilters}>
          <ul>
            {categories.map(category => (
              <li 
                key={category.id}
                className={activeCategory === category.id ? styles.active : ''}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.productGrid}>
          {filteredProducts.map(product => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImg}>
                <img src={product.image} alt={product.name} />
                {product.isNew && <span className={styles.newBadge}>New</span>}
                {product.isSale && <span className={styles.saleBadge}>Sale</span>}
                <div className={styles.productActions}>
                  <button className={styles.quickView}><i className="fas fa-eye"></i></button>
                  <button className={styles.addToCart}><i className="fas fa-shopping-cart"></i></button>
                  <button className={styles.addToWishlist}><i className="fas fa-heart"></i></button>
                </div>
              </div>
              <div className={styles.productInfo}>
                <h3><a href={`/products/${product.id}`}>{product.name}</a></h3>
                <div className={styles.productPrice}>
                  <span className={styles.currentPrice}>{product.price}</span>
                  {product.oldPrice && <span className={styles.oldPrice}>{product.oldPrice}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.viewAll}>
          <a href="/collections/all" className={styles.viewAllBtn}>Xem tất cả sản phẩm</a>
        </div>
      </div>

      {/* Testimonials */}
    
      

      {/* Blog Posts */}
      <div className={styles.blogPosts}>
        <h2 className={styles.sectionTitle}>Tin tức & Bài viết</h2>
        <div className={styles.blogGrid}>
          {blogs.map(blog => (
            <div key={blog.id} className={styles.blogCard}>
              <div className={styles.blogImg}>
                <img src={blog.image} alt={blog.title} />
                <span className={styles.blogDate}>{blog.date}</span>
              </div>
              <div className={styles.blogInfo}>
                <h3><a href={`/blogs/${blog.id}`}>{blog.title}</a></h3>
                <a href={`/blogs/${blog.id}`} className={styles.readMore}>Đọc tiếp</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className={styles.brands}>
        <div className={styles.brandsWrapper}>
          <div className={styles.brandItem}>
            <img src="https://1000logos.net/wp-content/uploads/2021/11/Nike-Logo.png" alt="Nike" />
          </div>
          <div className={styles.brandItem}>
            <img src="https://1000logos.net/wp-content/uploads/2019/06/Adidas-Logo-1991.jpg" alt="Adidas" />
          </div>
          <div className={styles.brandItem}>
            <img src="https://1000logos.net/wp-content/uploads/2017/05/PUMA-logo.jpg" alt="Puma" />
          </div>
          <div className={styles.brandItem}>
            <img src="https://1000logos.net/wp-content/uploads/2021/04/Converse-logo.png" alt="Converse" />
          </div>
          <div className={styles.brandItem}>
            <img src="https://1000logos.net/wp-content/uploads/2020/07/Vans-Logo-2016.jpg" alt="Vans" />
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default HomePage;