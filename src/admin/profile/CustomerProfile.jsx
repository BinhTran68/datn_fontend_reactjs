import React, { useState, useEffect } from 'react';
import styles from './CustomerProfile.module.css';

const CustomerProfile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    avatar: '',
    birthDate: '',
    gender: '',
    password: '',
    confirmPassword: '',
    // Thêm dữ liệu mới
    nickname: '',
    occupation: '',
    favoriteCategories: [],
    memberSince: '',
    loyaltyPoints: 0,
    shippingAddresses: [],
    orderHistory: [],
    preferredLanguage: 'Tiếng Việt',
    newsletter: true,
    verifiedAccount: false
  });
  
  const [editing, setEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine: '',
    city: '',
    district: '',
    postalCode: '',
    isDefault: false
  });
  
  // Danh sách các danh mục sản phẩm
  const categories = [
    'Thời trang nam', 'Thời trang nữ', 'Điện thoại', 'Máy tính',
    'Đồ gia dụng', 'Mỹ phẩm', 'Sách', 'Thực phẩm', 'Thể thao'
  ];
  
  // Giả lập lấy dữ liệu từ API
  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy thông tin người dùng
    setTimeout(() => {
      setProfile({
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0987654321',
        address: '123 Đường Lê Lợi',
        city: 'Hồ Chí Minh',
        country: 'Việt Nam',
        avatar: 'https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2020/10/meme-la-gi.jpg',
        birthDate: '1990-01-01',
        gender: 'Nam',
        password: '',
        confirmPassword: '',
        // Thêm dữ liệu mới
        nickname: 'Alex',
        occupation: 'Kỹ sư phần mềm',
        favoriteCategories: ['Điện thoại', 'Máy tính', 'Sách'],
        memberSince: '2023-01-15',
        loyaltyPoints: 2450,
        shippingAddresses: [
          {
            id: 1,
            addressLine: '123 Đường Lê Lợi, Phường Bến Nghé',
            city: 'Hồ Chí Minh',
            district: 'Quận 1',
            postalCode: '700000',
            isDefault: true
          },
          {
            id: 2,
            addressLine: '45 Đường Nguyễn Huệ, Phường Bến Nghé',
            city: 'Hồ Chí Minh',
            district: 'Quận 1',
            postalCode: '700000',
            isDefault: false
          }
        ],
        orderHistory: [
          {
            id: 'ORD123456',
            date: '2024-09-15',
            total: 2500000,
            status: 'Đã giao hàng',
            items: 3
          },
          {
            id: 'ORD123123',
            date: '2024-08-20',
            total: 1200000,
            status: 'Đã giao hàng',
            items: 2
          },
          {
            id: 'ORD122456',
            date: '2024-07-05',
            total: 3600000,
            status: 'Đã giao hàng',
            items: 5
          }
        ],
        preferredLanguage: 'Tiếng Việt',
        newsletter: true,
        verifiedAccount: true
      });
    }, 500);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleCategoryChange = (category) => {
    setProfile(prev => {
      const updatedCategories = [...prev.favoriteCategories];
      if (updatedCategories.includes(category)) {
        return {
          ...prev,
          favoriteCategories: updatedCategories.filter(cat => cat !== category)
        };
      } else {
        return {
          ...prev,
          favoriteCategories: [...updatedCategories, category]
        };
      }
    });
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Trong dự án thực tế, bạn sẽ tải lên file và lấy URL trả về
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const addShippingAddress = () => {
    if (!newAddress.addressLine || !newAddress.city) {
      setErrorMessage('Vui lòng nhập địa chỉ và thành phố');
      return;
    }
    
    const newId = profile.shippingAddresses.length > 0 
      ? Math.max(...profile.shippingAddresses.map(addr => addr.id)) + 1 
      : 1;
    
    const addressToAdd = {
      ...newAddress,
      id: newId
    };
    
    // Nếu địa chỉ mới là mặc định, cập nhật tất cả các địa chỉ khác
    let updatedAddresses = [...profile.shippingAddresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }
    
    setProfile(prev => ({
      ...prev,
      shippingAddresses: [...updatedAddresses, addressToAdd]
    }));
    
    // Reset form
    setNewAddress({
      addressLine: '',
      city: '',
      district: '',
      postalCode: '',
      isDefault: false
    });
    setAddingAddress(false);
    setSuccessMessage('Đã thêm địa chỉ mới thành công!');
    
    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const removeAddress = (id) => {
    setProfile(prev => ({
      ...prev,
      shippingAddresses: prev.shippingAddresses.filter(addr => addr.id !== id)
    }));
    
    setSuccessMessage('Đã xóa địa chỉ thành công!');
    
    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const setDefaultAddress = (id) => {
    setProfile(prev => ({
      ...prev,
      shippingAddresses: prev.shippingAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    }));
    
    setSuccessMessage('Đã cập nhật địa chỉ mặc định!');
    
    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu nếu đang cập nhật
    if (profile.password && profile.password !== profile.confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    // Giả lập lưu dữ liệu
    setTimeout(() => {
      setSuccessMessage('Thông tin hồ sơ đã được cập nhật thành công!');
      setErrorMessage('');
      setEditing(false);
      
      // Ẩn thông báo sau 3 giây
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1000);
  };
  
  // Format tiền tệ VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  
  // Format ngày tháng
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };
  
  // Tính toán độ dài thành viên
  const calculateMembershipDuration = () => {
    const memberDate = new Date(profile.memberSince);
    const today = new Date();
    const diffTime = Math.abs(today - memberDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} ngày`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng`;
    }
    
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    
    if (remainingMonths === 0) return `${years} năm`;
    return `${years} năm ${remainingMonths} tháng`;
  };
  
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>Hồ Sơ Khách Hàng</h1>
        <p>Quản lý thông tin cá nhân để bảo mật tài khoản</p>
      </div>
      
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className={styles.errorMessage}>
          {errorMessage}
        </div>
      )}
      
      <div className={styles.profileContent}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            <img
              src={profile.avatar || 'https://via.placeholder.com/150'}
              alt="Ảnh đại diện"
              className={styles.avatar}
            />
            {editing && (
              <div className={styles.avatarUpload}>
                <label htmlFor="avatar-upload" className={styles.uploadButton}>
                  <i className="fas fa-camera"></i>
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className={styles.fileInput}
                />
              </div>
            )}
          </div>
          <div className={styles.userInfo}>
            <h2>{profile.fullName}</h2>
            <p>{profile.email}</p>
            
            <div className={styles.userMeta}>
              <div className={styles.userMetaItem}>
                <span className={styles.metaLabel}>Thành viên:</span>
                <span className={styles.metaValue}>{calculateMembershipDuration()}</span>
              </div>
              <div className={styles.userMetaItem}>
                <span className={styles.metaLabel}>Điểm tích lũy:</span>
                <span className={styles.metaValue}>{profile.loyaltyPoints} điểm</span>
              </div>
              {profile.verifiedAccount && (
                <div className={styles.verifiedBadge}>
                  <i className="fas fa-check-circle"></i> Đã xác thực
                </div>
              )}
            </div>
            
            {!editing && (
              <button
                className={styles.editButton}
                onClick={() => setEditing(true)}
              >
                Chỉnh sửa hồ sơ
              </button>
            )}
          </div>
        </div>
        
        <div className={styles.tabContainer}>
          <div className={styles.tabButtons}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'personal' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <i className="fas fa-user"></i> Thông tin cá nhân
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'address' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('address')}
            >
              <i className="fas fa-map-marker-alt"></i> Địa chỉ
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'orders' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <i className="fas fa-shopping-bag"></i> Lịch sử đơn hàng
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'preferences' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <i className="fas fa-sliders-h"></i> Tùy chọn
            </button>
          </div>
          
          <form className={styles.profileForm} onSubmit={handleSubmit}>
            {/* Tab Thông tin cá nhân */}
            {activeTab === 'personal' && (
              <div className={styles.tabContent}>
                <div className={styles.formSection}>
                  <h3>Thông tin cá nhân</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Họ và tên</label>
                      <input
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Biệt danh</label>
                      <input
                        type="text"
                        name="nickname"
                        value={profile.nickname}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Ngày sinh</label>
                      <input
                        type="date"
                        name="birthDate"
                        value={profile.birthDate}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Giới tính</label>
                      <select
                        name="gender"
                        value={profile.gender}
                        onChange={handleChange}
                        disabled={!editing}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Nghề nghiệp</label>
                      <input
                        type="text"
                        name="occupation"
                        value={profile.occupation}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </div>
                
                <div className={styles.formSection}>
                  <h3>Địa chỉ chính</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Địa chỉ</label>
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Thành phố</label>
                      <input
                        type="text"
                        name="city"
                        value={profile.city}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Quốc gia</label>
                      <input
                        type="text"
                        name="country"
                        value={profile.country}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </div>
                
                {editing && (
                  <div className={styles.formSection}>
                    <h3>Bảo mật</h3>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Mật khẩu mới</label>
                        <input
                          type="password"
                          name="password"
                          value={profile.password}
                          onChange={handleChange}
                          placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Xác nhận mật khẩu</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={profile.confirmPassword}
                          onChange={handleChange}
                          placeholder="Xác nhận mật khẩu mới"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Tab Địa chỉ */}
            {activeTab === 'address' && (
              <div className={styles.tabContent}>
                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <h3>Danh sách địa chỉ giao hàng</h3>
                    {editing && (
                      <button 
                        type="button" 
                        className={styles.addButton}
                        onClick={() => setAddingAddress(true)}
                      >
                        <i className="fas fa-plus"></i> Thêm địa chỉ mới
                      </button>
                    )}
                  </div>
                  
                  {/* Form thêm địa chỉ mới */}
                  {editing && addingAddress && (
                    <div className={styles.newAddressForm}>
                      <h4>Thêm địa chỉ mới</h4>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Địa chỉ chi tiết</label>
                          <input
                            type="text"
                            name="addressLine"
                            value={newAddress.addressLine}
                            onChange={handleNewAddressChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Thành phố</label>
                          <input
                            type="text"
                            name="city"
                            value={newAddress.city}
                            onChange={handleNewAddressChange}
                            required
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Quận/Huyện</label>
                          <input
                            type="text"
                            name="district"
                            value={newAddress.district}
                            onChange={handleNewAddressChange}
                          />
                        </div>
                      </div>
                      
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Mã bưu điện</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={newAddress.postalCode}
                            onChange={handleNewAddressChange}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <div className={styles.checkboxGroup}>
                            <input
                              type="checkbox"
                              id="isDefault"
                              name="isDefault"
                              checked={newAddress.isDefault}
                              onChange={handleNewAddressChange}
                            />
                            <label htmlFor="isDefault">Đặt làm địa chỉ mặc định</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.addressFormButtons}>
                        <button 
                          type="button" 
                          className={styles.cancelButton}
                          onClick={() => setAddingAddress(false)}
                        >
                          Hủy
                        </button>
                        <button 
                          type="button" 
                          className={styles.saveButton}
                          onClick={addShippingAddress}
                        >
                          Thêm địa chỉ
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Danh sách địa chỉ */}
                  <div className={styles.addressList}>
                    {profile.shippingAddresses.length === 0 ? (
                      <p className={styles.emptyMessage}>Bạn chưa có địa chỉ giao hàng nào.</p>
                    ) : (
                      profile.shippingAddresses.map(address => (
                        <div key={address.id} className={styles.addressCard}>
                          <div className={styles.addressInfo}>
                            <p className={styles.addressLine}>{address.addressLine}</p>
                            <p className={styles.addressDetail}>
                              {address.district}, {address.city} {address.postalCode && `- ${address.postalCode}`}
                            </p>
                            {address.isDefault && (
                              <span className={styles.defaultBadge}>Mặc định</span>
                            )}
                          </div>
                          
                          {editing && (
                            <div className={styles.addressActions}>
                              {!address.isDefault && (
                                <button 
                                  type="button" 
                                  className={styles.setDefaultButton}
                                  onClick={() => setDefaultAddress(address.id)}
                                >
                                  Đặt mặc định
                                </button>
                              )}
                              <button 
                                type="button" 
                                className={styles.removeButton}
                                onClick={() => removeAddress(address.id)}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Tab Lịch sử đơn hàng */}
            {activeTab === 'orders' && (
              <div className={styles.tabContent}>
                <div className={styles.formSection}>
                  <h3>Lịch sử đơn hàng</h3>
                  
                  {profile.orderHistory.length === 0 ? (
                    <p className={styles.emptyMessage}>Bạn chưa có đơn hàng nào.</p>
                  ) : (
                    <div className={styles.orderTable}>
                      <table>
                        <thead>
                          <tr>
                            <th>Mã đơn hàng</th>
                            <th>Ngày đặt</th>
                            <th>Số sản phẩm</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {profile.orderHistory.map(order => (
                            <tr key={order.id}>
                              <td>{order.id}</td>
                              <td>{formatDate(order.date)}</td>
                              <td>{order.items}</td>
                              <td>{formatCurrency(order.total)}</td>
                              <td>
                                <span className={`${styles.orderStatus} ${styles[`status${order.status.replace(/\s+/g, '')}`]}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td>
                                <button 
                                  type="button" 
                                  className={styles.viewOrderButton}
                                >
                                  Xem chi tiết
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Tab Tùy chọn */}
            {activeTab === 'preferences' && (
              <div className={styles.tabContent}>
                <div className={styles.formSection}>
                  <h3>Danh mục yêu thích</h3>
                  <div className={styles.categoryList}>
                    {categories.map(category => (
                      <div key={category} className={styles.categoryItem}>
                        <input
                          type="checkbox"
                          id={`cat-${category}`}
                          checked={profile.favoriteCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          disabled={!editing}
                        />
                        <label htmlFor={`cat-${category}`}>{category}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={styles.formSection}>
                  <h3>Tùy chọn khác</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Ngôn ngữ ưa thích</label>
                      <select
                        name="preferredLanguage"
                        value={profile.preferredLanguage}
                        onChange={handleChange}
                        disabled={!editing}
                      >
                        <option value="Tiếng Việt">Tiếng Việt</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={profile.newsletter}
                      onChange={handleCheckboxChange}
                      disabled={!editing}
                    />
                    <label htmlFor="newsletter">Đăng ký nhận thông tin khuyến mãi qua email</label>
                  </div>
                </div>
              </div>
            )}
            
            {editing && (
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setEditing(false)}
                >
                  Hủy
                </button>
                <button type="submit" className={styles.saveButton}>
                  Lưu thay đổi
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;