import React, { useState, useEffect } from 'react';
import styles from './PurchaseOrder.module.css';

const PurchaseOrder = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [notifications, setNotifications] = useState({ show: false, message: '', type: '' });

  // Define status mapping
  const statusMapping = {
    'CHO_XAC_NHAN': { id: 'pending_confirmation', label: 'Chờ xác nhận', actions: ['cancel'] },
    'CHO_THANH_TOAN': { id: 'pending_payment', label: 'Chờ thanh toán', actions: ['pay', 'cancel'] },
    'DANG_CHUAN_BI': { id: 'preparing', label: 'Đang chuẩn bị hàng', actions: ['contact_seller'] },
    'DANG_GIAO': { id: 'to_receive', label: 'Đang giao hàng', actions: ['track'] },
    'DA_GIAO': { id: 'completed', label: 'Đã giao', actions: ['rate', 'buy_again', 'contact_seller'] },
    'DA_HUY': { id: 'cancelled', label: 'Đã hủy', actions: ['buy_again', 'delete'] },
    'HOAN_TRA': { id: 'return_refund', label: 'Trả hàng/Hoàn tiền', actions: ['view_details'] }
  };

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending_confirmation', label: 'Chờ xác nhận' },
    { id: 'pending_payment', label: 'Chờ thanh toán' },
    { id: 'preparing', label: 'Chuẩn bị hàng' },
    { id: 'to_receive', label: 'Đang giao hàng' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' },
    { id: 'return_refund', label: 'Trả hàng/Hoàn tiền' },
  ];

  // Fetch orders from API
  useEffect(() => {
    setLoading(true);
    
    // In real application, this would be an API call
    const fetchOrders = async () => {
      try {
        // Mock API response based on the provided format
        const mockApiResponse = [
          {
            "code": 200,
            "message": "lấy trạng thái hóa đơn",
            "data": {
              "id": 75,
              "billCode": "HD-71D2F28A",
              "discountMoney": 2.5,
              "shipMoney": 120000.0,
              "totalMoney": 15.5,
              "moneyAfter": 120015.5,
              "shippingAddress": 43,
              "customerName": "Nguyễn Văn A",
              "numberPhone": "0912345678",
              "email": "nguyenvana@example.com",
              "typeBill": "ONLINE",
              "notes": "",
              "status": "CHO_THANH_TOAN",
              "voucher": "VC006",
              "payment": null,
              "createDate": "15/03/2025",
              "billDetailResponse": [
                {
                  "productDetailId": 108,
                  "productName": "Giày Nike Air Max 97",
                  "size": "42",
                  "quantity": 1,
                  "price": 250000.0,
                  "image": "https://res.cloudinary.com/dieyhvcou/image/upload/v1741853661/5_2_wq2fqc.png"
                },
                {
                  "productDetailId": 109,
                  "productName": "Giày Adidas Ultraboost 22",
                  "size": "41",
                  "quantity": 2,
                  "price": 350000.0,
                  "image": "https://res.cloudinary.com/dieyhvcou/image/upload/v1741853647/1_2_tej4ju.png"
                }
              ]
            }
          },
          {
            "code": 200,
            "message": "lấy trạng thái hóa đơn",
            "data": {
              "id": 76,
              "billCode": "HD-82E3F39B",
              "discountMoney": 0,
              "shipMoney": 90000.0,
              "totalMoney": 280000.0,
              "moneyAfter": 370000.0,
              "shippingAddress": 44,
              "customerName": "Trần Thị B",
              "numberPhone": "0987654321",
              "email": "tranthib@example.com",
              "typeBill": "ONLINE",
              "notes": "",
              "status": "DANG_CHUAN_BI",
              "voucher": null,
              "payment": null,
              "createDate": "14/03/2025",
              "billDetailResponse": [
                {
                  "productDetailId": 110,
                  "productName": "Giày Converse Chuck Taylor",
                  "size": "40",
                  "quantity": 1,
                  "price": 280000.0,
                  "image": "https://res.cloudinary.com/dieyhvcou/image/upload/v1741853661/5_2_wq2fqc.png"
                }
              ]
            }
          },
          {
            "code": 200,
            "message": "lấy trạng thái hóa đơn",
            "data": {
              "id": 77,
              "billCode": "HD-93F4G40C",
              "discountMoney": 5000.0,
              "shipMoney": 85000.0,
              "totalMoney": 455000.0,
              "moneyAfter": 535000.0,
              "shippingAddress": 45,
              "customerName": "Lê Văn C",
              "numberPhone": "0923456789",
              "email": "levanc@example.com",
              "typeBill": "ONLINE",
              "notes": "",
              "status": "DANG_GIAO",
              "voucher": "VC008",
              "payment": null,
              "createDate": "12/03/2025",
              "billDetailResponse": [
                {
                  "productDetailId": 111,
                  "productName": "Giày Vans Old Skool",
                  "size": "39",
                  "quantity": 1,
                  "price": 175000.0,
                  "image": "https://res.cloudinary.com/dieyhvcou/image/upload/v1741853647/1_2_tej4ju.png"
                },
                {
                  "productDetailId": 112,
                  "productName": "Giày Puma RS-X",
                  "size": "43",
                  "quantity": 1,
                  "price": 280000.0,
                  "image": "https://res.cloudinary.com/dieyhvcou/image/upload/v1741853661/5_2_wq2fqc.png"
                }
              ]
            }
          },
          {
            "code": 200,
            "message": "lấy trạng thái hóa đơn",
            "data": {
              "id": 78,
              "billCode": "HD-04G5H51D",
              "discountMoney": 0,
              "shipMoney": 70000.0,
              "totalMoney": 220000.0,
              "moneyAfter": 290000.0,
              "shippingAddress": 46,
              "customerName": "Phạm Thị D",
              "numberPhone": "0934567890",
              "email": "phamthid@example.com",
              "typeBill": "ONLINE",
              "notes": "",
              "status": "DA_GIAO",
              "voucher": null,
              "payment": null,
              "createDate": "05/03/2025",
              "billDetailResponse": [
                {
                  "productDetailId": 113,
                  "productName": "Giày New Balance 574",
                  "size": "38",
                  "quantity": 1,
                  "price": 220000.0,
                  "image": "https://res.cloudinary.com/dieyhvcou/image/upload/v1741853647/1_2_tej4ju.png"
                }
              ]
            }
          },
          {
            "code": 200,
            "message": "lấy trạng thái hóa đơn",
            "data": {
              "id": 79,
              "billCode": "HD-15H6I62E",
              "discountMoney": 10000.0,
              "shipMoney": 75000.0,
              "totalMoney": 320000.0,
              "moneyAfter": 385000.0,
              "shippingAddress": 47,
              "customerName": "Hoàng Văn E",
              "numberPhone": "0945678901",
              "email": "hoangvane@example.com",
              "typeBill": "ONLINE",
              "notes": "",
              "status": "DA_HUY",
              "voucher": "VC010",
              "payment": null,
              "createDate": "01/03/2025",
              "billDetailResponse": [
                {
                  "productDetailId": 114,
                  "productName": "Giày Asics Gel-Kayano 28",
                  "size": "42",
                  "quantity": 2,
                  "price": 160000.0,
                  "image": "https://res.cloudinary.com/dieyhvcou/image/upload/v1741853661/5_2_wq2fqc.png"
                }
              ]
            }
          },
          {
            "code": 200,
            "message": "lấy trạng thái hóa đơn",
            "data": {
              "id": 80,
              "billCode": "HD-26I7J73F",
              "discountMoney": 0,
              "shipMoney": 65000.0,
              "totalMoney": 180000.0,
              "moneyAfter": 245000.0,
              "shippingAddress": 48,
              "customerName": "Ngô Thị F",
              "numberPhone": "0956789012",
              "email": "ngothif@example.com",
              "typeBill": "ONLINE",
              "notes": "",
              "status": "HOAN_TRA",
              "voucher": null,
              "payment": null,
              "createDate": "28/02/2025",
              "billDetailResponse": [
                {
                  "productDetailId": 115,
                  "productName": "Giày Brooks Ghost 14",
                  "size": "42",
                  "quantity": 1,
                  "price": 180000.0,
                  "image": "https://res.cloudinary.com/dieyhvcou/image/upload/v1741853647/1_2_tej4ju.png"
                }
              ]
            }
          }
        ];

        // Transform API response to our order format
        const transformedOrders = mockApiResponse.map(response => {
          const orderData = response.data;
          const statusInfo = statusMapping[orderData.status] || { 
            id: 'unknown', 
            label: 'Không xác định', 
            actions: ['view_details'] 
          };
          
          return {
            id: orderData.id,
            billCode: orderData.billCode,
            status: statusInfo.id,
            statusText: statusInfo.label,
            date: orderData.createDate || 'N/A',
            customerName: orderData.customerName,
            email: orderData.email,
            phone: orderData.numberPhone,
            discountMoney: orderData.discountMoney || 0,
            shipMoney: orderData.shipMoney || 0,
            totalMoney: orderData.totalMoney || 0,
            moneyAfter: orderData.moneyAfter || 0,
            voucher: orderData.voucher,
            items: orderData.billDetailResponse.map(item => ({
              id: item.productDetailId,
              image: item.image,
              name: item.productName,
              variation: `size ${item.size}`,
              price: item.price,
              quantity: item.quantity
            })),
            actions: statusInfo.actions
          };
        });

        // Filter orders based on active tab
        let filteredOrders = transformedOrders;
        
        if (activeTab !== 'all') {
          filteredOrders = transformedOrders.filter(order => order.status === activeTab);
        }
        
        // Filter by search text
        if (searchText) {
          filteredOrders = filteredOrders.filter(order => 
            order.billCode.toLowerCase().includes(searchText.toLowerCase()) || 
            order.items.some(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
          );
        }
        
        // Filter by date
        if (dateFilter !== 'all') {
          const today = new Date();
          const monthAgo = new Date();
          monthAgo.setMonth(today.getMonth() - 1);
          
          if (dateFilter === 'recent') {
            filteredOrders = filteredOrders.filter(order => {
              const orderDate = new Date(order.date.split('/').reverse().join('-'));
              return orderDate >= monthAgo;
            });
          }
        }
        
        setOrders(filteredOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        showNotification('Đã xảy ra lỗi khi tải dữ liệu đơn hàng', 'error');
        setLoading(false);
      }
    };

    // Simulate API call delay
    setTimeout(() => {
      fetchOrders();
    }, 500);
  }, [activeTab, searchText, dateFilter]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotifications({
      show: true,
      message,
      type
    });
    
    // Auto hide notification after 3 seconds
    setTimeout(() => {
      setNotifications({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle payment
  const handlePayment = (orderId, billCode) => {
    showNotification(`Đang chuyển đến trang thanh toán cho đơn hàng #${billCode}`);
    
    // In real application, would redirect to payment page or show payment modal
    console.log(`Thanh toán đơn hàng: ${billCode}`);
    
    // Update order status after payment (in real app, this would happen after successful payment)
    setTimeout(() => {
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'preparing',
            statusText: 'Đang chuẩn bị hàng',
            actions: ['contact_seller']
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      showNotification('Thanh toán thành công!');
    }, 2000);
  };

  // Handle cancel order
  const handleCancelOrder = (orderId, billCode) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      // In real app, would call API to cancel order
      
      // Update order status in list
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'cancelled',
            statusText: 'Đã hủy',
            actions: ['buy_again', 'delete']
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      showNotification(`Đơn hàng ${billCode} đã được hủy thành công`);
    }
  };

  // Handle track order
  const handleTrackOrder = (orderId, billCode) => {
    showNotification(`Đang mở trang theo dõi đơn hàng #${billCode}`);
    
    // In real app, would redirect to tracking page or show tracking modal
    console.log(`Theo dõi đơn hàng: ${billCode}`);
    
    // Simulate showing tracking information
    alert(`Thông tin vận chuyển đơn hàng #${billCode}:\n- Đơn hàng đang được vận chuyển\n- Dự kiến giao hàng: 1-2 ngày tới\n- Đơn vị vận chuyển: Giao Hàng Nhanh\n- Mã vận đơn: VN${Math.floor(Math.random() * 10000000)}`);
  };

  // Handle contact seller
  const handleContactSeller = (orderId, billCode) => {
    showNotification(`Đang mở chat với người bán về đơn hàng ${billCode}`);
    
    // In real app, would open chat window or redirect to chat page
    console.log(`Liên hệ với người bán về đơn hàng: ${billCode}`);
    
    // Simulate showing chat window
    alert(`Đang kết nối với nhân viên hỗ trợ...\nVui lòng chờ trong giây lát.`);
  };

  // Handle rate product
  const handleRateProduct = (orderId, billCode) => {
    showNotification(`Đang mở form đánh giá cho đơn hàng #${billCode}`);
    
    // In real app, would show rating form
    console.log(`Đánh giá sản phẩm cho đơn hàng: ${billCode}`);
    
    // Simulate showing rating form
    const rating = prompt('Đánh giá sản phẩm (1-5 sao):', '5');
    const comment = prompt('Nhận xét của bạn:', 'Sản phẩm rất tốt!');
    
    if (rating && comment) {
      showNotification('Cảm ơn bạn đã đánh giá sản phẩm!');
      
      // Update order status in list
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            actions: order.actions.filter(action => action !== 'rate').concat(['buy_again', 'contact_seller'])
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
    }
  };

  // Handle buy again
  const handleBuyAgain = (orderId, billCode) => {
    // Find order info
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
      showNotification(`Đã thêm ${order.items.length} sản phẩm vào giỏ hàng`);
      
      // In real app, would add products to cart and redirect to cart page
      console.log(`Mua lại sản phẩm từ đơn hàng: ${billCode}`);
      
      // Simulate adding to cart notification
      const itemNames = order.items.map(item => item.name).join(', ');
      alert(`Đã thêm vào giỏ hàng:\n${itemNames}`);
    }
  };

  // Handle delete order
  const handleDeleteOrder = (orderId, billCode) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) {
      // In real app, would call API to delete order
      
      // Remove order from list
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      
      showNotification(`Đơn hàng ${billCode} đã được xóa thành công`);
    }
  };

  // Handle view order details
  const handleViewDetails = (orderId, billCode) => {
    showNotification(`Đang mở trang chi tiết đơn hàng #${billCode}`);
    
    // In real app, would redirect to details page or show details modal
    console.log(`Xem chi tiết đơn hàng: ${billCode}`);
    
    // Simulate showing details
    const order = orders.find(o => o.id === orderId);
    if (order) {
      let details = `Chi tiết đơn hàng #${billCode}:\n`;
      details += `Ngày đặt hàng: ${order.date}\n`;
      details += `Trạng thái: ${order.statusText}\n`;
      details += `Khách hàng: ${order.customerName}\n`;
      details += `Số điện thoại: ${order.phone}\n`;
      details += `Email: ${order.email}\n\n`;
      details += `Sản phẩm:\n`;
      
      order.items.forEach((item, index) => {
        details += `${index + 1}. ${item.name} - ${item.variation} x${item.quantity} - ${formatPrice(item.price)}\n`;
      });
      
      details += `\nTiền hàng: ${formatPrice(order.totalMoney)}`;
      details += `\nPhí vận chuyển: ${formatPrice(order.shipMoney)}`;
      details += `\nGiảm giá: ${formatPrice(order.discountMoney)}`;
      details += `\nTổng tiền: ${formatPrice(order.moneyAfter)}`;
      
      alert(details);
    }
  };

  // Handle action button clicks
  const handleActionClick = (action, orderId) => {
    // Find order info
    const order = orders.find(o => o.id === orderId);
    const billCode = order ? order.billCode : '';
    
    switch (action) {
      case 'pay':
        handlePayment(orderId, billCode);
        break;
      case 'cancel':
        handleCancelOrder(orderId, billCode);
        break;
      case 'track':
        handleTrackOrder(orderId, billCode);
        break;
      case 'contact_seller':
        handleContactSeller(orderId, billCode);
        break;
      case 'rate':
        handleRateProduct(orderId, billCode);
        break;
      case 'buy_again':
        handleBuyAgain(orderId, billCode);
        break;
      case 'delete':
        handleDeleteOrder(orderId, billCode);
        break;
      case 'view_details':
        handleViewDetails(orderId, billCode);
        break;
      default:
        console.log(`Hành động không được hỗ trợ: ${action}`);
    }
  };

  // Return appropriate button based on action type
  const getActionButton = (action, orderId) => {
    switch (action) {
      case 'pay':
        return <button className={styles.buttonPrimary} onClick={() => handleActionClick('pay', orderId)}>Thanh toán</button>;
      case 'cancel':
        return <button className={styles.buttonOutline} onClick={() => handleActionClick('cancel', orderId)}>Hủy đơn hàng</button>;
      case 'track':
        return <button className={styles.buttonPrimary} onClick={() => handleActionClick('track', orderId)}>Theo dõi đơn hàng</button>;
      case 'contact_seller':
        return <button className={styles.buttonOutline} onClick={() => handleActionClick('contact_seller', orderId)}>Liên hệ người bán</button>;
      case 'rate':
        return <button className={styles.buttonPrimary} onClick={() => handleActionClick('rate', orderId)}>Đánh giá</button>;
      case 'buy_again':
        return <button className={styles.buttonOutline} onClick={() => handleActionClick('buy_again', orderId)}>Mua lại</button>;
      case 'delete':
        return <button className={styles.buttonOutline} onClick={() => handleActionClick('delete', orderId)}>Xóa</button>;
      case 'view_details':
        return <button className={styles.buttonOutline} onClick={() => handleActionClick('view_details', orderId)}>Xem chi tiết</button>;
      default:
        return null;
    }
  };

  // Format price with Vietnamese currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price).replace('₫', 'đ');
  };

  return (
    <div className={styles.container}>
      {/* Show notification */}
      {notifications.show && (
        <div className={`${styles.notification} ${styles[notifications.type]}`}>
          {notifications.message}
        </div>
      )}
      
      <div className={styles.header}>
        <h1>Đơn Mua</h1>
      </div>
      
      <div className={styles.tabContainer}>
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      
      <div className={styles.filterContainer}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm"
            className={styles.searchInput}
            value={searchText}
            onChange={handleSearch}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
        
        <div className={styles.dateFilter}>
          <select 
            className={styles.selectInput}
            value={dateFilter}
            onChange={handleDateFilterChange}
          >
            <option value="all">Tất cả ngày</option>
            <option value="recent">1 tháng gần đây</option>
          </select>
        </div>
      </div>
      
      <div className={styles.ordersList}>
        {loading ? (
          <div className={styles.loading}>Đang tải đơn hàng...</div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>
            <img src="/api/placeholder/100/100" alt="Empty" className={styles.emptyImg} />
            <p>Không tìm thấy đơn hàng nào</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.shopInfo}>
                  <span className={styles.shopName}>Shop TheHands</span>
                </div>
                <div className={styles.orderStatus}>
                  <span className={styles.orderStatusText}>{order.statusText}</span>
                </div>
              </div>
              
              <div className={styles.divider}></div>
              
              {order.items.map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemDetails}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemVariation}>Phân loại: {item.variation}</div>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                      <span className={styles.itemQuantity}>x{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className={styles.divider}></div>
              
              <div className={styles.orderFooter}>
                <div className={styles.orderMeta}>
                  <span className={styles.orderDate}>Ngày đặt hàng: {order.date}</span>
                  <span className={styles.orderId}>Mã đơn hàng: {order.billCode}</span>
                </div>
                <div className={styles.orderTotal}>
                  <span className={styles.totalLabel}>Tổng số tiền:</span>
                  <span className={styles.totalPrice}>{formatPrice(order.moneyAfter)}</span>
                </div>
                <div className={styles.orderActions}>
                  {order.actions.map((action, index) => (
                    <span key={index} className={styles.actionButton}>
                      {getActionButton(action, order.id)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PurchaseOrder;