import React, { useState } from 'react';
import styles from './searchbill.module.css';
import { FaSearch, FaShoppingBag, FaTruck, FaRegCreditCard, FaRegCalendarAlt, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaUser, FaCheck, FaInfoCircle } from 'react-icons/fa';

const SearchBill = () => {
  const [billId, setBillId] = useState('');
  const [billData, setBillData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sample bill data array updated to match API response format
  const billsDatabase = [
    {
      id: 75,
      billCode: "HD-71D2F28A",
      discountMoney: 2.5,
      shipMoney: 120000.0,
      totalMoney: 15.5,
      moneyAfter: 120015.5,
      shippingAddress: 43,
      customerName: "Nguyễn Văn A",
      numberPhone: "0912345678",
      email: "nguyenvana@example.com",
      typeBill: "ONLINE",
      notes: "",
      status: "CHO_XAC_NHAN",
      voucher: "VC006",
      payment: null,
      billDetailResponse: [
        {
          productDetailId: 108,
          quantity: 1,
          price: 10.0,
          image: "https://res.cloudinary.com/dieyhvcou/image/upload/v1741853661/5_2_wq2fqc.png"
        },
        {
          productDetailId: 109,
          quantity: 2,
          price: 4.0,
          image: "https://res.cloudinary.com/dieyhvcou/image/upload/v1741853647/1_2_tej4ju.png"
        }
      ],
      createdDate: '18/03/2025',
      orderDate: '18/03/2025',
      deliveryDate: '20/03/2025',
      paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    },
    {
      id: 76,
      billCode: "HD-82E3G39B",
      discountMoney: 150000.0,
      shipMoney: 0.0,
      totalMoney: 1750000.0,
      moneyAfter: 1600000.0,
      shippingAddress: 44,
      customerName: "Trần Thị B",
      numberPhone: "0912345678",
      email: "tranthib@example.com",
      typeBill: "ONLINE",
      notes: "Để hàng tại lễ tân",
      status: "DANG_GIAO_HANG",
      voucher: "WELCOME15",
      payment: "Chuyển khoản ngân hàng",
      billDetailResponse: [
        {
          productDetailId: 110,
          quantity: 2,
          price: 550000.0,
          image: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw9f21972f/images/d_08/M9166_D_08X1.jpg?sw=406"
        },
        {
          productDetailId: 111,
          quantity: 1,
          price: 650000.0,
          image: "https://images.vans.com/is/image/Vans/VN000D3HY28-HERO?$583x583$"
        }
      ],
      createdDate: '17/03/2025',
      orderDate: '17/03/2025',
      deliveryDate: '19/03/2025',
      paymentMethod: 'Chuyển khoản ngân hàng',
    },
    {
      id: 77,
      billCode: "HD-93F4H47C",
      discountMoney: 0.0,
      shipMoney: 30000.0,
      totalMoney: 2300000.0,
      moneyAfter: 2330000.0,
      shippingAddress: 45,
      customerName: "Lê Văn C",
      numberPhone: "0978123456",
      email: "levanc@example.com",
      typeBill: "ONLINE",
      notes: "",
      status: "CHO_XAC_NHAN",
      voucher: null,
      payment: "Ví điện tử MoMo",
      billDetailResponse: [
        {
          productDetailId: 112,
          quantity: 1,
          price: 2300000.0,
          image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/f39abfb8-10c1-4d11-8e7b-24398b06d4f6/air-jordan-1-mid-shoes-SQf7DM.png"
        }
      ],
      createdDate: '16/03/2025',
      orderDate: '16/03/2025',
      deliveryDate: 'Dự kiến 20/03/2025',
      paymentMethod: 'Ví điện tử MoMo',
    },
    {
      id: 78,
      billCode: "HD-04G5I56D",
      discountMoney: 30000.0,
      shipMoney: 30000.0,
      totalMoney: 3560000.0,
      moneyAfter: 3560000.0,
      shippingAddress: 46,
      customerName: "Phạm Thị D",
      numberPhone: "0909876543",
      email: "phamthid@example.com",
      typeBill: "ONLINE",
      notes: "",
      status: "DA_HUY",
      voucher: "FREESHIP",
      payment: "Thẻ tín dụng/ghi nợ",
      billDetailResponse: [
        {
          productDetailId: 113,
          quantity: 1,
          price: 1850000.0,
          image: "https://balenciaga.dam.kering.com/m/1f8606c189baad3f/Large-533882W2CA11000_F.jpg?v=1"
        },
        {
          productDetailId: 114,
          quantity: 1,
          price: 1710000.0,
          image: "https://media.gucci.com/style/DarkGray_Center_0_0_1200x1200/1586322303/598527_AYOV0_9072_001_100_0000_Light-Mens-Ace-GG-sneaker.jpg"
        }
      ],
      createdDate: '15/03/2025',
      orderDate: '15/03/2025',
      deliveryDate: 'Đã hủy',
      paymentMethod: 'Thẻ tín dụng/ghi nợ',
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulating API call with setTimeout
    setTimeout(() => {
      const foundBill = billsDatabase.find(bill => bill.billCode.toLowerCase() === billId.toLowerCase());
      
      if (foundBill) {
        setBillData(foundBill);
        setIsLoading(false);
      } else if (billId.trim() === '') {
        // If empty, show the first bill
        setBillData(billsDatabase[0]);
        setIsLoading(false);
      } else {
        setError('Không tìm thấy hóa đơn với mã này');
        setBillData(null);
        setIsLoading(false);
      }
    }, 800);
  };

  // Convert API status codes to display text
  const getStatusText = (statusCode) => {
    switch (statusCode) {
      case 'CHO_XAC_NHAN':
        return 'Chờ xác nhận';
      case 'DANG_XU_LY':
        return 'Đang xử lý';
      case 'DANG_GIAO_HANG':
        return 'Đang giao hàng';
      case 'DA_GIAO_HANG':
        return 'Đã giao hàng';
      case 'DA_HUY':
        return 'Đã hủy';
      default:
        return statusCode;
    }
  };

  // Function to determine status class for styling
  const getStatusClass = (status) => {
    switch (status) {
      case 'CHO_XAC_NHAN':
        return styles.statusPending;
      case 'DANG_XU_LY':
        return styles.statusProcessing;
      case 'DANG_GIAO_HANG':
        return styles.statusShipping;
      case 'DA_GIAO_HANG':
        return styles.statusDelivered;
      case 'DA_HUY':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  // Function to determine status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'CHO_XAC_NHAN':
        return <FaInfoCircle />;
      case 'DANG_XU_LY':
        return <FaShoppingBag />;
      case 'DANG_GIAO_HANG':
        return <FaTruck />;
      case 'DA_GIAO_HANG':
        return <FaCheck />;
      case 'DA_HUY':
        return <FaInfoCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  // Calculate product item total price
  const calculateItemTotal = (price, quantity) => {
    return price * quantity;
  };

  return (
    <div className={styles.searchBillContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Tra cứu đơn hàng</h1>
        <p className={styles.pageSubtitle}>Kiểm tra thông tin và trạng thái đơn hàng của bạn</p>
      </div>
      
      <div className={styles.searchForm}>
        <form onSubmit={handleSearch}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Nhập mã hóa đơn của bạn (ví dụ: HD-71D2F28A)"
                value={billId}
                onChange={(e) => setBillId(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button type="submit" className={styles.searchButton}>
              Tìm kiếm
            </button>
          </div>
        </form>
        <div className={styles.searchTips}>
          <p>Gợi ý: Nhập mã hóa đơn HD-71D2F28A, HD-82E3G39B, HD-93F4H47C hoặc HD-04G5I56D</p>
        </div>
      </div>

      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang tìm kiếm hóa đơn...</p>
        </div>
      )}
      
      {error && <div className={styles.error}>{error}</div>}

      {billData && (
        <div className={styles.billContainer}>
          <div className={styles.billHeader}>
            <div className={styles.billHeaderLeft}>
              <h2>Hóa đơn #{billData.billCode}</h2>
              <div className={styles.billMeta}>
                <div className={styles.metaItem}>
                  <FaRegCalendarAlt className={styles.metaIcon} />
                  <span>Ngày đặt: {billData.orderDate}</span>
                </div>
                <div className={styles.metaItem}>
                  <FaTruck className={styles.metaIcon} />
                  <span>Giao hàng: {billData.deliveryDate}</span>
                </div>
              </div>
            </div>
            <div className={styles.billHeaderRight}>
              <span className={`${styles.statusBadge} ${getStatusClass(billData.status)}`}>
                {getStatusIcon(billData.status)} {getStatusText(billData.status)}
              </span>
            </div>
          </div>

          <div className={styles.billProgressContainer}>
            <div className={styles.billProgress}>
              <div className={`${styles.progressStep} ${billData.status !== 'DA_HUY' ? styles.progressActive : ''}`}>
                <div className={styles.progressIcon}>
                  <FaShoppingBag />
                </div>
                <div className={styles.progressText}>Đặt hàng</div>
              </div>
              <div className={`${styles.progressLine} ${(billData.status !== 'CHO_XAC_NHAN' && billData.status !== 'DA_HUY') ? styles.progressActive : ''}`}></div>
              <div className={`${styles.progressStep} ${(billData.status !== 'CHO_XAC_NHAN' && billData.status !== 'DA_HUY') ? styles.progressActive : ''}`}>
                <div className={styles.progressIcon}>
                  <FaCheck />
                </div>
                <div className={styles.progressText}>Xác nhận</div>
              </div>
              <div className={`${styles.progressLine} ${(billData.status === 'DANG_GIAO_HANG' || billData.status === 'DA_GIAO_HANG') ? styles.progressActive : ''}`}></div>
              <div className={`${styles.progressStep} ${(billData.status === 'DANG_GIAO_HANG' || billData.status === 'DA_GIAO_HANG') ? styles.progressActive : ''}`}>
                <div className={styles.progressIcon}>
                  <FaTruck />
                </div>
                <div className={styles.progressText}>Đang giao</div>
              </div>
              <div className={`${styles.progressLine} ${billData.status === 'DA_GIAO_HANG' ? styles.progressActive : ''}`}></div>
              <div className={`${styles.progressStep} ${billData.status === 'DA_GIAO_HANG' ? styles.progressActive : ''}`}>
                <div className={styles.progressIcon}>
                  <FaCheck />
                </div>
                <div className={styles.progressText}>Hoàn thành</div>
              </div>
            </div>
          </div>

          <div className={styles.billDetails}>
            <div className={styles.detailSection}>
              <h3>
                <FaUser className={styles.sectionIcon} />
                Thông tin khách hàng
              </h3>
              <div className={styles.detailContent}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Người nhận:</span>
                  <span className={styles.detailValue}>{billData.customerName}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <FaEnvelope className={styles.inlineIcon} /> Email:
                  </span>
                  <span className={styles.detailValue}>{billData.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <FaPhoneAlt className={styles.inlineIcon} /> Số điện thoại:
                  </span>
                  <span className={styles.detailValue}>{billData.numberPhone}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <FaMapMarkerAlt className={styles.inlineIcon} /> Địa chỉ ID:
                  </span>
                  <span className={styles.detailValue}>{billData.shippingAddress}</span>
                </div>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>
                <FaRegCreditCard className={styles.sectionIcon} />
                Thông tin thanh toán
              </h3>
              <div className={styles.detailContent}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Phương thức:</span>
                  <span className={styles.detailValue}>{billData.payment || 'Chưa thanh toán'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Loại đơn:</span>
                  <span className={styles.detailValue}>{billData.typeBill}</span>
                </div>
                {billData.voucher && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Voucher:</span>
                    <span className={styles.detailValue}>
                      <span className={styles.voucherCode}>{billData.voucher}</span>
                      <span className={styles.voucherDiscount}>-{billData.discountMoney.toLocaleString()}đ</span>
                    </span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Ghi chú:</span>
                  <span className={styles.detailValue}>{billData.notes || 'Không có'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.productSection}>
            <h3>
              <FaShoppingBag className={styles.sectionIcon} />
              Sản phẩm đã mua
            </h3>
            <div className={styles.productList}>
              {billData.billDetailResponse.map((product) => (
                <div key={product.productDetailId} className={styles.productItem}>
                  <div className={styles.productImage}>
                    <img src={product.image} alt={`Sản phẩm ${product.productDetailId}`} />
                  </div>
                  <div className={styles.productInfo}>
                    <h4>Sản phẩm ID: {product.productDetailId}</h4>
                    <div className={styles.productPriceInfo}>
                      <span className={styles.productPrice}>{product.price.toLocaleString()}đ</span>
                      <span className={styles.productQuantity}>x{product.quantity}</span>
                    </div>
                  </div>
                  <div className={styles.productTotal}>
                    {calculateItemTotal(product.price, product.quantity).toLocaleString()}đ
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.billSummary}>
            <div className={styles.summaryRow}>
              <span>Tổng tiền hàng:</span>
              <span>{billData.totalMoney.toLocaleString()}đ</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Phí vận chuyển:</span>
              <span>{billData.shipMoney.toLocaleString()}đ</span>
            </div>
            {billData.discountMoney > 0 && (
              <div className={styles.summaryRow}>
                <span>Giảm giá:</span>
                <span className={styles.discountAmount}>-{billData.discountMoney.toLocaleString()}đ</span>
              </div>
            )}
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Tổng thanh toán:</span>
              <span>{billData.moneyAfter.toLocaleString()}đ</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBill;