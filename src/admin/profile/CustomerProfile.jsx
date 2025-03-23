import React, { useState, useEffect } from 'react';
import styles from './CustomerProfile.module.css';

const CustomerProfile = () => {
  // State for customer information
  const [customerInfo, setCustomerInfo] = useState({
    personalInfo: {
      fullName: 'Nguyễn Văn A',
      dateOfBirth: '1990-01-01',
      gender: 'Nam',
      idNumber: '123456789012',
      address: 'Số 123, Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
      phone: '0901234567',
      email: 'nguyenvana@example.com',
    },
    financialInfo: {
      income: '15000000',
      spendingAverage: '2000000',
      paymentMethods: ['Tiền mặt', 'Thẻ tín dụng', 'Chuyển khoản'],
      bankAccounts: [
        { bank: 'VietcomBank', accountNumber: '1234567890' },
        { bank: 'BIDV', accountNumber: '0987654321' },
      ],
    },
    purchaseHistory: [
      {
        id: 'DH001',
        date: '2025-01-15',
        products: [
          { name: 'Nike Air Force 1', size: '42', color: 'Trắng', price: 2500000 },
          { name: 'Adidas Stan Smith', size: '41', color: 'Xanh', price: 1800000 },
        ],
        totalAmount: 4300000,
        status: 'Đã giao hàng',
      },
      {
        id: 'DH002',
        date: '2025-02-20',
        products: [
          { name: 'Puma Suede', size: '42', color: 'Đen', price: 1500000 },
        ],
        totalAmount: 1500000,
        status: 'Đã giao hàng',
      },
      {
        id: 'DH003',
        date: '2025-03-05',
        products: [
          { name: 'Converse Chuck Taylor', size: '42', color: 'Đỏ', price: 1200000 },
          { name: 'Vans Old Skool', size: '41', color: 'Đen', price: 1600000 },
        ],
        totalAmount: 2800000,
        status: 'Đang giao hàng',
      },
    ],
    feedback: [
      { date: '2025-01-20', product: 'Nike Air Force 1', rating: 5, comment: 'Sản phẩm chất lượng, rất hài lòng' },
      { date: '2025-02-25', product: 'Puma Suede', rating: 4, comment: 'Đẹp, nhưng hơi chật' },
    ],
    marketingInfo: {
      source: 'Facebook Ads',
      campaigns: ['Giảm giá mùa hè', 'Khuyến mãi tháng 3'],
      preferences: ['Giày thể thao', 'Giày da'],
    },
    contactInfo: {
      lastContact: '2025-03-10',
      contactMethod: 'Email',
      notes: 'Khách hàng quan tâm đến bộ sưu tập mới',
    },
    preferences: {
      brands: ['Nike', 'Adidas', 'Converse'],
      sizes: ['41', '42'],
      colors: ['Trắng', 'Đen', 'Xanh'],
      styles: ['Thể thao', 'Casual'],
      priceRange: '1000000-3000000',
    },
    customerSegment: {
      type: 'Khách hàng thân thiết',
      loyaltyPoints: 500,
      memberSince: '2024-01-01',
      tier: 'Vàng',
    },
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState('personal');

  // State for edit mode
  const [editMode, setEditMode] = useState(false);

  // State for form data in edit mode
  const [formData, setFormData] = useState({});

  // Initialize form data when entering edit mode
  useEffect(() => {
    if (editMode) {
      setFormData(customerInfo);
    }
  }, [editMode, customerInfo]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEditMode(false);
  };

  // Handle edit button click
  const handleEditClick = () => {
    setEditMode(true);
  };

  // Handle save button click
  const handleSaveClick = () => {
    setCustomerInfo(formData);
    setEditMode(false);
  };

  // Handle form input change
  const handleInputChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  // Handle nested form input change
  const handleNestedInputChange = (section, index, field, value) => {
    const updatedData = [...formData[section]];
    updatedData[index] = {
      ...updatedData[index],
      [field]: value,
    };
    
    setFormData({
      ...formData,
      [section]: updatedData,
    });
  };

  // Handle add new purchase
  const handleAddPurchase = () => {
    const newPurchase = {
      id: `DH${String(formData.purchaseHistory.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      products: [{ name: '', size: '', color: '', price: 0 }],
      totalAmount: 0,
      status: 'Đang xử lý',
    };
    
    setFormData({
      ...formData,
      purchaseHistory: [...formData.purchaseHistory, newPurchase],
    });
  };

  // Handle add new feedback
  const handleAddFeedback = () => {
    const newFeedback = {
      date: new Date().toISOString().split('T')[0],
      product: '',
      rating: 5,
      comment: '',
    };
    
    setFormData({
      ...formData,
      feedback: [...formData.feedback, newFeedback],
    });
  };

  // Handle add new payment method
  const handleAddPaymentMethod = () => {
    setFormData({
      ...formData,
      financialInfo: {
        ...formData.financialInfo,
        paymentMethods: [...formData.financialInfo.paymentMethods, ''],
      },
    });
  };

  // Handle add new bank account
  const handleAddBankAccount = () => {
    const newBankAccount = {
      bank: '',
      accountNumber: '',
    };
    
    setFormData({
      ...formData,
      financialInfo: {
        ...formData.financialInfo,
        bankAccounts: [...formData.financialInfo.bankAccounts, newBankAccount],
      },
    });
  };

  // Handle payment method input change
  const handlePaymentMethodChange = (index, value) => {
    const updatedPaymentMethods = [...formData.financialInfo.paymentMethods];
    updatedPaymentMethods[index] = value;
    
    setFormData({
      ...formData,
      financialInfo: {
        ...formData.financialInfo,
        paymentMethods: updatedPaymentMethods,
      },
    });
  };

  // Handle bank account input change
  const handleBankAccountChange = (index, field, value) => {
    const updatedBankAccounts = [...formData.financialInfo.bankAccounts];
    updatedBankAccounts[index] = {
      ...updatedBankAccounts[index],
      [field]: value,
    };
    
    setFormData({
      ...formData,
      financialInfo: {
        ...formData.financialInfo,
        bankAccounts: updatedBankAccounts,
      },
    });
  };

  // Handle product input change
  const handleProductChange = (purchaseIndex, productIndex, field, value) => {
    const updatedPurchases = [...formData.purchaseHistory];
    updatedPurchases[purchaseIndex].products[productIndex] = {
      ...updatedPurchases[purchaseIndex].products[productIndex],
      [field]: value,
    };
    
    // Recalculate total amount
    if (field === 'price') {
      const totalAmount = updatedPurchases[purchaseIndex].products.reduce(
        (sum, product) => sum + Number(product.price || 0),
        0
      );
      updatedPurchases[purchaseIndex].totalAmount = totalAmount;
    }
    
    setFormData({
      ...formData,
      purchaseHistory: updatedPurchases,
    });
  };

  // Handle add new product to purchase
  const handleAddProduct = (purchaseIndex) => {
    const updatedPurchases = [...formData.purchaseHistory];
    updatedPurchases[purchaseIndex].products.push({
      name: '',
      size: '',
      color: '',
      price: 0,
    });
    
    setFormData({
      ...formData,
      purchaseHistory: updatedPurchases,
    });
  };

  // Handle preference input change
  const handlePreferenceChange = (field, value) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [field]: value,
      },
    });
  };

  // Handle preference array input change
  const handlePreferenceArrayChange = (field, index, value) => {
    const updatedPreferences = [...formData.preferences[field]];
    updatedPreferences[index] = value;
    
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [field]: updatedPreferences,
      },
    });
  };

  // Handle add new preference item
  const handleAddPreferenceItem = (field) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [field]: [...formData.preferences[field], ''],
      },
    });
  };

  // Render personal information
  const renderPersonalInfo = () => {
    const { personalInfo } = editMode ? formData : customerInfo;
    
    return (
      <div className={styles.sectionContainer}>
        <h3 className={styles.sectionTitle}>Thông tin cá nhân</h3>
        <div className={styles.sectionContent}>
          {editMode ? (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Họ và tên:</label>
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ngày sinh:</label>
                <input
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Giới tính:</label>
                <select
                  value={personalInfo.gender}
                  onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Số CMND/CCCD:</label>
                <input
                  type="text"
                  value={personalInfo.idNumber}
                  onChange={(e) => handleInputChange('personalInfo', 'idNumber', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Địa chỉ:</label>
                <textarea
                  value={personalInfo.address}
                  onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Số điện thoại:</label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email:</label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Họ và tên:</span>
                <span className={styles.infoValue}>{personalInfo.fullName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ngày sinh:</span>
                <span className={styles.infoValue}>{personalInfo.dateOfBirth}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Giới tính:</span>
                <span className={styles.infoValue}>{personalInfo.gender}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Số CMND/CCCD:</span>
                <span className={styles.infoValue}>{personalInfo.idNumber}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Địa chỉ:</span>
                <span className={styles.infoValue}>{personalInfo.address}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Số điện thoại:</span>
                <span className={styles.infoValue}>{personalInfo.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{personalInfo.email}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render financial information
  const renderFinancialInfo = () => {
    const { financialInfo } = editMode ? formData : customerInfo;
    
    return (
      <div className={styles.sectionContainer}>
        <h3 className={styles.sectionTitle}>Thông tin tài chính</h3>
        <div className={styles.sectionContent}>
          {editMode ? (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Thu nhập hàng tháng (VND):</label>
                <input
                  type="number"
                  value={financialInfo.income}
                  onChange={(e) => handleInputChange('financialInfo', 'income', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Chi tiêu trung bình (VND):</label>
                <input
                  type="number"
                  value={financialInfo.spendingAverage}
                  onChange={(e) => handleInputChange('financialInfo', 'spendingAverage', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phương thức thanh toán:</label>
                <div className={styles.arrayInputs}>
                  {financialInfo.paymentMethods.map((method, index) => (
                    <div key={index} className={styles.arrayInputItem}>
                      <input
                        type="text"
                        value={method}
                        onChange={(e) => handlePaymentMethodChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className={styles.addButton} 
                    onClick={handleAddPaymentMethod}
                  >
                    + Thêm phương thức
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Tài khoản ngân hàng:</label>
                <div className={styles.arrayInputs}>
                  {financialInfo.bankAccounts.map((account, index) => (
                    <div key={index} className={styles.bankAccountItem}>
                      <input
                        type="text"
                        placeholder="Tên ngân hàng"
                        value={account.bank}
                        onChange={(e) => handleBankAccountChange(index, 'bank', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Số tài khoản"
                        value={account.accountNumber}
                        onChange={(e) => handleBankAccountChange(index, 'accountNumber', e.target.value)}
                      />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className={styles.addButton} 
                    onClick={handleAddBankAccount}
                  >
                    + Thêm tài khoản
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Thu nhập hàng tháng:</span>
                <span className={styles.infoValue}>
                  {Number(financialInfo.income).toLocaleString('vi-VN')} VND
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Chi tiêu trung bình:</span>
                <span className={styles.infoValue}>
                  {Number(financialInfo.spendingAverage).toLocaleString('vi-VN')} VND
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phương thức thanh toán:</span>
                <span className={styles.infoValue}>
                  {financialInfo.paymentMethods.join(', ')}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Tài khoản ngân hàng:</span>
                <div className={styles.bankAccountList}>
                  {financialInfo.bankAccounts.map((account, index) => (
                    <div key={index} className={styles.bankAccountInfo}>
                      {account.bank}: {account.accountNumber}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render purchase history
  const renderPurchaseHistory = () => {
    const { purchaseHistory } = editMode ? formData : customerInfo;
    
    return (
      <div className={styles.sectionContainer}>
        <h3 className={styles.sectionTitle}>Lịch sử mua hàng</h3>
        <div className={styles.sectionContent}>
          {editMode ? (
            <div className={styles.purchaseHistoryEdit}>
              {purchaseHistory.map((purchase, pIndex) => (
                <div key={pIndex} className={styles.purchaseItem}>
                  <div className={styles.purchaseHeader}>
                    <div className={styles.formGroup}>
                      <label>Mã đơn hàng:</label>
                      <input
                        type="text"
                        value={purchase.id}
                        onChange={(e) => handleNestedInputChange('purchaseHistory', pIndex, 'id', e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Ngày đặt hàng:</label>
                      <input
                        type="date"
                        value={purchase.date}
                        onChange={(e) => handleNestedInputChange('purchaseHistory', pIndex, 'date', e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Trạng thái:</label>
                      <select
                        value={purchase.status}
                        onChange={(e) => handleNestedInputChange('purchaseHistory', pIndex, 'status', e.target.value)}
                      >
                        <option value="Đang xử lý">Đang xử lý</option>
                        <option value="Đang giao hàng">Đang giao hàng</option>
                        <option value="Đã giao hàng">Đã giao hàng</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.productsContainer}>
                    <h4>Danh sách sản phẩm</h4>
                    {purchase.products.map((product, prodIndex) => (
                      <div key={prodIndex} className={styles.productItem}>
                        <div className={styles.formGroup}>
                          <label>Tên sản phẩm:</label>
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => handleProductChange(pIndex, prodIndex, 'name', e.target.value)}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Size:</label>
                          <input
                            type="text"
                            value={product.size}
                            onChange={(e) => handleProductChange(pIndex, prodIndex, 'size', e.target.value)}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Màu sắc:</label>
                          <input
                            type="text"
                            value={product.color}
                            onChange={(e) => handleProductChange(pIndex, prodIndex, 'color', e.target.value)}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Giá (VND):</label>
                          <input
                            type="number"
                            value={product.price}
                            onChange={(e) => handleProductChange(pIndex, prodIndex, 'price', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className={styles.addButton} 
                      onClick={() => handleAddProduct(pIndex)}
                    >
                      + Thêm sản phẩm
                    </button>
                  </div>
                  
                  <div className={styles.purchaseFooter}>
                    <div className={styles.formGroup}>
                      <label>Tổng tiền:</label>
                      <input
                        type="number"
                        value={purchase.totalAmount}
                        onChange={(e) => handleNestedInputChange('purchaseHistory', pIndex, 'totalAmount', e.target.value)}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                className={styles.addButton} 
                onClick={handleAddPurchase}
              >
                + Thêm đơn hàng
              </button>
            </div>
          ) : (
            <div className={styles.purchaseHistoryView}>
              {purchaseHistory.map((purchase, index) => (
                <div key={index} className={styles.purchaseCard}>
                  <div className={styles.purchaseCardHeader}>
                    <div className={styles.purchaseId}>Mã ĐH: {purchase.id}</div>
                    <div className={`${styles.purchaseStatus} ${styles[purchase.status.replace(/\s+/g, '').toLowerCase()]}`}>
                      {purchase.status}
                    </div>
                  </div>
                  <div className={styles.purchaseCardBody}>
                    <div className={styles.purchaseDate}>
                      <i className="far fa-calendar"></i> {purchase.date}
                    </div>
                    <div className={styles.purchaseProducts}>
                      {purchase.products.map((product, prodIndex) => (
                        <div key={prodIndex} className={styles.productLine}>
                          <span className={styles.productName}>{product.name}</span>
                          <span className={styles.productDetails}>
                            Size: {product.size} | Màu: {product.color}
                          </span>
                          <span className={styles.productPrice}>
                            {Number(product.price).toLocaleString('vi-VN')} VND
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.purchaseCardFooter}>
                    <div className={styles.purchaseTotal}>
                      Tổng tiền: <span>{Number(purchase.totalAmount).toLocaleString('vi-VN')} VND</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render feedback
  const renderFeedback = () => {
    const { feedback } = editMode ? formData : customerInfo;
    
    return (
      <div className={styles.sectionContainer}>
        <h3 className={styles.sectionTitle}>Đánh giá và phản hồi</h3>
        <div className={styles.sectionContent}>
          {editMode ? (
            <div className={styles.feedbackEdit}>
              {feedback.map((item, index) => (
                <div key={index} className={styles.feedbackItem}>
                  <div className={styles.formGroup}>
                    <label>Ngày đánh giá:</label>
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => handleNestedInputChange('feedback', index, 'date', e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Sản phẩm:</label>
                    <input
                      type="text"
                      value={item.product}
                      onChange={(e) => handleNestedInputChange('feedback', index, 'product', e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Đánh giá (1-5):</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={item.rating}
                      onChange={(e) => handleNestedInputChange('feedback', index, 'rating', e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nhận xét:</label>
                    <textarea
                      value={item.comment}
                      onChange={(e) => handleNestedInputChange('feedback', index, 'comment', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                className={styles.addButton} 
                onClick={handleAddFeedback}
              >
                + Thêm đánh giá
              </button>
            </div>
          ) : (
            <div className={styles.feedbackView}>
              {feedback.map((item, index) => (
                <div key={index} className={styles.feedbackCard}>
                  <div className={styles.feedbackHeader}>
                    <div className={styles.feedbackProduct}>{item.product}</div>
                    <div className={styles.feedbackDate}>{item.date}</div>
                  </div>
                  <div className={styles.feedbackBody}>
                    <div className={styles.feedbackRating}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < item.rating ? styles.starFilled : styles.starEmpty}>★</span>
                      ))}
                    </div>
                    <div className={styles.feedbackComment}>{item.comment}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render marketing information
  const renderMarketingInfo = () => {
    const { marketingInfo } = editMode ? formData : customerInfo;
    
    return (
      <div className={styles.sectionContainer}>
        <h3 className={styles.sectionTitle}>Thông tin tiếp thị</h3>
        <div className={styles.sectionContent}>
          {editMode ? (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Nguồn tiếp cận:</label>
                <input
                  type="text"
                  value={marketingInfo.source}
                  onChange={(e) => handleInputChange('marketingInfo', 'source', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Chiến dịch:</label>
                <div className={styles.arrayInputs}>
                  {marketingInfo.campaigns.map((campaign, index) => (
                    <div key={index} className={styles.arrayInputItem}>
                      <input
                        type="text"
                        value={campaign}
                        onChange={(e) => {
                          const updatedCampaigns = [...marketingInfo.campaigns];
                          updatedCampaigns[index] = e.target.value;
                          handleInputChange('marketingInfo', 'campaigns', updatedCampaigns);
                        }}
                      />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className={styles.addButton} 
                    onClick={() => {
                      handleInputChange('marketingInfo', 'campaigns', [...marketingInfo.campaigns, '']);
                    }}
                  >
                    + Thêm chiến dịch
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Sở thích:</label>
                <div className={styles.arrayInputs}>
                  {marketingInfo.preferences.map((preference, index) => (
                    <div key={index} className={styles.arrayInputItem}>
                      <input
                        type="text"
                        value={preference}
                        onChange={(e) => {
                          const updatedPreferences = [...marketingInfo.preferences];
                          updatedPreferences[index] = e.target.value;
                          handleInputChange('marketingInfo', 'preferences', updatedPreferences);
                        }}
                      />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className={styles.addButton} 
                    onClick={() => {
                      handleInputChange('marketingInfo', 'preferences', [...marketingInfo.preferences, '']);
                    }}
                  >
                    + Thêm sở thích
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Nguồn tiếp cận:</span>
                <span className={styles.infoValue}>{marketingInfo.source}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Chiến dịch:</span>
                <div className={styles.tagList}>
                  {marketingInfo.campaigns.map((campaign, index) => (
                    <span key={index} className={styles.tag}>{campaign}</span>
                  ))}
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Sở thích:</span>
                <div className={styles.tagList}>
                  {marketingInfo.preferences.map((preference, index) => (
                    <span key={index} className={styles.tag}>{preference}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render contact information
  const renderContactInfo = () => {
    const { contactInfo } = editMode ? formData : customerInfo;
    
    return (
      <div className={styles.sectionContainer}>
        <h3 className={styles.sectionTitle}>Thông tin liên hệ</h3>
        <div className={styles.sectionContent}>
          {editMode ? (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Liên hệ gần nhất:</label>
                <input
                  type="date"
                  value={contactInfo.lastContact}
                  onChange={(e) => handleInputChange('contactInfo', 'lastContact', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phương thức liên hệ:</label>
                <select
                  value={contactInfo.contactMethod}
                  onChange={(e) => handleInputChange('contactInfo', 'contactMethod', e.target.value)}
                >
                  <option value="Email">Email</option>
                  <option value="Điện thoại">Điện thoại</option>
                  <option value="Tin nhắn">Tin nhắn</option>
                  <option value="Trực tiếp">Trực tiếp</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Ghi chú:</label>
                <textarea
                  value={contactInfo.notes}
                  onChange={(e) => handleInputChange('contactInfo', 'notes', e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Liên hệ gần nhất:</span>
                <span className={styles.infoValue}>{contactInfo.lastContact}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phương thức liên hệ:</span>
                <span className={styles.infoValue}>{contactInfo.contactMethod}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ghi chú:</span>
                <span className={styles.infoValue}>{contactInfo.notes}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render preferences
  const renderPreferences = () => {
    const { preferences } = editMode ? formData : customerInfo;
    
    return (
      <div className={styles.sectionContainer}>
        <h3 className={styles.sectionTitle}>Sở thích và nhu cầu</h3>
        <div className={styles.sectionContent}>
          {editMode ? (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Thương hiệu yêu thích:</label>
                <div className={styles.arrayInputs}>
                  {preferences.brands.map((brand, index) => (
                    <div key={index} className={styles.arrayInputItem}>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => handlePreferenceArrayChange('brands', index, e.target.value)}
                      />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className={styles.addButton} 
                    onClick={() => handleAddPreferenceItem('brands')}
                  >
                    + Thêm thương hiệu
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Size:</label>
                <div className={styles.arrayInputs}>
                  {preferences.sizes.map((size, index) => (
                    <div key={index} className={styles.arrayInputItem}>
                      <input
                        type="text"
                        value={size}
                        onChange={(e) => handlePreferenceArrayChange('sizes', index, e.target.value)}
                      />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className={styles.addButton} 
                    onClick={() => handleAddPreferenceItem('sizes')}
                  >
                    + Thêm size
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Màu sắc yêu thích:</label>
                <div className={styles.arrayInputs}>
                  {preferences.colors.map((color, index) => (
                    <div key={index} className={styles.arrayInputItem}>
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => handlePreferenceArrayChange('colors', index, e.target.value)}
                      />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className={styles.addButton} 
                    onClick={() => handleAddPreferenceItem('colors')}
                  >
                    + Thêm màu sắc
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Phong cách:</label>
                <div className={styles.arrayInputs}>
                  {preferences.styles.map((style, index) => (
                    <div key={index} className={styles.arrayInputItem}>
                      <input
                        type="text"
                        value={style}
                        onChange={(e) => handlePreferenceArrayChange('styles', index, e.target.value)}
                      />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className={styles.addButton} 
                    onClick={() => handleAddPreferenceItem('styles')}
                  >
                    + Thêm phong cách
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Khoảng giá (VND):</label>
                <input
                  type="text"
                  value={preferences.priceRange}
                  onChange={(e) => handlePreferenceChange('priceRange', e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Thương hiệu yêu thích:</span>
                <div className={styles.tagList}>
                  {preferences.brands.map((brand, index) => (
                    <span key={index} className={styles.tag}>{brand}</span>
                  ))}
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Size:</span>
                <div className={styles.tagList}>
                  {preferences.sizes.map((size, index) => (
                    <span key={index} className={styles.tag}>{size}</span>
                  ))}
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Màu sắc yêu thích:</span>
                <div className={styles.tagList}>
                  {preferences.colors.map((color, index) => (
                    <span key={index} className={`${styles.tag} ${styles.colorTag}`} style={{backgroundColor: color.toLowerCase()}}>{color}</span>
                  ))}
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phong cách:</span>
                <div className={styles.tagList}>
                  {preferences.styles.map((style, index) => (
                    <span key={index} className={styles.tag}>{style}</span>
                  ))}
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Khoảng giá:</span>
                <span className={styles.infoValue}>{preferences.priceRange} VND</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render customer segment
  const renderCustomerSegment = () => {
    const { customerSegment } = editMode ? formData : customerInfo;
    
    return (
      <div className={styles.sectionContainer}>
        <h3 className={styles.sectionTitle}>Phân loại khách hàng</h3>
        <div className={styles.sectionContent}>
          {editMode ? (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Loại khách hàng:</label>
                <select
                  value={customerSegment.type}
                  onChange={(e) => handleInputChange('customerSegment', 'type', e.target.value)}
                >
                  <option value="Khách hàng mới">Khách hàng mới</option>
                  <option value="Khách hàng thân thiết">Khách hàng thân thiết</option>
                  <option value="Khách hàng VIP">Khách hàng VIP</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Điểm tích lũy:</label>
                <input
                  type="number"
                  value={customerSegment.loyaltyPoints}
                  onChange={(e) => handleInputChange('customerSegment', 'loyaltyPoints', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Khách hàng từ:</label>
                <input
                  type="date"
                  value={customerSegment.memberSince}
                  onChange={(e) => handleInputChange('customerSegment', 'memberSince', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Hạng thành viên:</label>
                <select
                  value={customerSegment.tier}
                  onChange={(e) => handleInputChange('customerSegment', 'tier', e.target.value)}
                >
                  <option value="Đồng">Đồng</option>
                  <option value="Bạc">Bạc</option>
                  <option value="Vàng">Vàng</option>
                  <option value="Kim cương">Kim cương</option>
                </select>
              </div>
            </div>
          ) : (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Loại khách hàng:</span>
                <span className={styles.infoValue}>{customerSegment.type}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Điểm tích lũy:</span>
                <span className={styles.infoValue}>{customerSegment.loyaltyPoints} điểm</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Khách hàng từ:</span>
                <span className={styles.infoValue}>{customerSegment.memberSince}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Hạng thành viên:</span>
                <span className={`${styles.infoValue} ${styles.memberTier} ${styles[customerSegment.tier.toLowerCase()]}`}>
                  {customerSegment.tier}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render the active tab content
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'financial':
        return renderFinancialInfo();
      case 'purchase':
        return renderPurchaseHistory();
      case 'feedback':
        return renderFeedback();
      case 'marketing':
        return renderMarketingInfo();
      case 'contact':
        return renderContactInfo();
      case 'preferences':
        return renderPreferences();
      case 'segment':
        return renderCustomerSegment();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Hồ Sơ Khách Hàng</h1>
        <div className={styles.actions}>
          {editMode ? (
            <button className={styles.saveButton} onClick={handleSaveClick}>
              <i className="fas fa-save"></i> Lưu
            </button>
          ) : (
            <button className={styles.editButton} onClick={handleEditClick}>
              <i className="fas fa-edit"></i> Chỉnh sửa
            </button>
          )}
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.customerSummary}>
            <div className={styles.customerAvatar}>
              <div className={styles.avatarPlaceholder}>
                {customerInfo.personalInfo.fullName.split(' ').map(name => name[0]).join('')}
              </div>
            </div>
            <div className={styles.customerName}>{customerInfo.personalInfo.fullName}</div>
            <div className={styles.customerDetails}>
              <div className={styles.customerPhone}>{customerInfo.personalInfo.phone}</div>
              <div className={styles.customerEmail}>{customerInfo.personalInfo.email}</div>
              <div className={`${styles.customerTier} ${styles[customerInfo.customerSegment.tier.toLowerCase()]}`}>
                {customerInfo.customerSegment.tier}
              </div>
            </div>
          </div>
          
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li 
                className={`${styles.navItem} ${activeTab === 'personal' ? styles.active : ''}`}
                onClick={() => handleTabChange('personal')}
              >
                <i className="fas fa-user"></i> Thông tin cá nhân
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === 'financial' ? styles.active : ''}`}
                onClick={() => handleTabChange('financial')}
              >
                <i className="fas fa-wallet"></i> Thông tin tài chính
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === 'purchase' ? styles.active : ''}`}
                onClick={() => handleTabChange('purchase')}
              >
                <i className="fas fa-shopping-bag"></i> Lịch sử mua hàng
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === 'feedback' ? styles.active : ''}`}
                onClick={() => handleTabChange('feedback')}
              >
                <i className="fas fa-comment"></i> Đánh giá & Phản hồi
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === 'marketing' ? styles.active : ''}`}
                onClick={() => handleTabChange('marketing')}
              >
                <i className="fas fa-bullhorn"></i> Thông tin tiếp thị
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === 'contact' ? styles.active : ''}`}
                onClick={() => handleTabChange('contact')}
              >
                <i className="fas fa-address-book"></i> Thông tin liên hệ
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === 'preferences' ? styles.active : ''}`}
                onClick={() => handleTabChange('preferences')}
              >
                <i className="fas fa-heart"></i> Sở thích & Nhu cầu
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === 'segment' ? styles.active : ''}`}
                onClick={() => handleTabChange('segment')}
              >
                <i className="fas fa-users"></i> Phân loại khách hàng
              </li>
            </ul>
          </nav>
        </div>
        
        <div className={styles.mainContent}>
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;