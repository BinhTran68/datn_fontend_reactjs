import React, { useState, useEffect } from 'react';
import styles from './PurchaseOrder.module.css';

const PurchaseOrder = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [notifications, setNotifications] = useState({ show: false, message: '', type: '' });

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending_payment', label: 'Chờ thanh toán' },
    { id: 'to_ship', label: 'Vận chuyển' },
    { id: 'to_receive', label: 'Chờ giao hàng' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' },
    { id: 'return_refund', label: 'Trả hàng/Hoàn tiền' },
  ];

  // Mô phỏng việc lấy dữ liệu đơn hàng từ API
  useEffect(() => {
    setLoading(true);
    
    // Giả lập dữ liệu đơn hàng, trong thực tế sẽ được lấy từ API
    const mockOrders = [
      {
        id: '123456789',
        shop: { name: 'Shop TheHands', avatar: '/img/thehands.png' },
        status: 'pending_payment',
        statusText: 'Chờ thanh toán',
        date: '15/03/2025',
        items: [
          { image: 'https://tse3.mm.bing.net/th?id=OIP.H57ChPJ8v89UJhBnTvNHNwHaHa&pid=Api&P=0&h=180', name: 'Giày Nike Air Max 97', variation: 'size 42', price: 250000, quantity: 2 }
        ],
        totalPrice: 500000,
        actions: ['pay', 'cancel']
      },
      {
        id: '987654321',
        shop: { name: 'Shop TheHands', avatar: '/img/thehands.png' },
        status: 'to_ship',
        statusText: 'Đang chuẩn bị hàng',
        date: '14/03/2025',
        items: [
          { image: 'https://tse2.mm.bing.net/th?id=OIP.cpk9_S8aTREQUUppvmIpDgHaHa&pid=Api&P=0&h=180', name: 'Giày Adidas Ultraboost 22', variation: 'size 41', price: 350000, quantity: 1 }
        ],
        totalPrice: 350000,
        actions: ['contact_seller']
      },
      {
        id: '456789123',
        shop: { name: 'Shop TheHands', avatar: '/img/thehands.png' },
        status: 'to_receive',
        statusText: 'Đang giao hàng',
        date: '12/03/2025',
        items: [
          { image: 'https://tse4.mm.bing.net/th?id=OIP.8_TUH2z-6ZDSHlfei4xUYQHaHa&pid=Api&P=0&h=180', name: 'Giày Converse Chuck Taylor', variation: 'size 40', price: 280000, quantity: 1 },
          { image: 'https://tse2.mm.bing.net/th?id=OIP.cpk9_S8aTREQUUppvmIpDgHaHa&pid=Api&P=0&h=180', name: 'Giày Vans Old Skool', variation: 'size 39', price: 175000, quantity: 1 }
        ],
        totalPrice: 455000,
        actions: ['track']
      },
      {
        id: '741852963',
        shop: { name: 'Shop TheHands', avatar: '/img/thehands.png' },
        status: 'completed',
        statusText: 'Đã giao',
        date: '05/03/2025',
        items: [
          { image: 'https://tse3.mm.bing.net/th?id=OIP.-I3rfn3GZIbSQuA1vGiPTAHaHa&pid=Api&P=0&h=180', name: 'Giày Puma RS-X', variation: 'size 43', price: 220000, quantity: 1 }
        ],
        totalPrice: 220000,
        actions: ['rate', 'buy_again', 'contact_seller']
      },
      {
        id: '963258741',
        shop: { name: 'Shop TheHands', avatar: '/img/thehands.png' },
        status: 'cancelled',
        statusText: 'Đã hủy',
        date: '01/03/2025',
        items: [
          { image: 'https://tse4.mm.bing.net/th?id=OIP.jEvfyxNB_g23etbhZ3oMOwHaHa&pid=Api&P=0&h=180', name: 'Giày New Balance 574', variation: 'size 38', price: 160000, quantity: 2 }
        ],
        totalPrice: 320000,
        actions: ['buy_again', 'delete']
      },
      {
        id: '369258147',
        shop: { name: 'Shop TheHands', avatar: '/img/thehands.png' },
        status: 'return_refund',
        statusText: 'Đang xử lý hoàn tiền',
        date: '28/02/2025',
        items: [
          { image: 'https://tse3.mm.bing.net/th?id=OIP.SZAUp6tVY6OuMjvHk03I9gHaHa&pid=Api&P=0&h=180', name: 'Giày Asics Gel-Kayano 28', variation: 'size 42', price: 180000, quantity: 1 }
        ],
        totalPrice: 180000,
        actions: ['view_details']
      }
    ];
    

    // Lọc đơn hàng theo tab đang active
    setTimeout(() => {
      let filteredOrders = mockOrders;
      
      if (activeTab !== 'all') {
        filteredOrders = mockOrders.filter(order => order.status === activeTab);
      }
      
      // Lọc theo từ khóa tìm kiếm
      if (searchText) {
        filteredOrders = filteredOrders.filter(order => 
          order.id.includes(searchText) || 
          order.items.some(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
        );
      }
      
      // Lọc theo ngày
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
    }, 500); // Mô phỏng thời gian load
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

  // Hiển thị thông báo
  const showNotification = (message, type = 'success') => {
    setNotifications({
      show: true,
      message,
      type
    });
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotifications({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Xử lý thanh toán đơn hàng
  const handlePayment = (orderId) => {
    // Mô phỏng chuyển đến trang thanh toán
    showNotification(`Đang chuyển đến trang thanh toán cho đơn hàng #${orderId}`);
    
    // Trong thực tế, sẽ chuyển đến trang thanh toán hoặc hiển thị modal thanh toán
    console.log(`Thanh toán đơn hàng: ${orderId}`);
    
    // Cập nhật trạng thái đơn hàng sau khi thanh toán (trong thực tế sẽ được thực hiện sau khi thanh toán thành công)
    setTimeout(() => {
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'to_ship',
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

  // Xử lý hủy đơn hàng
  const handleCancelOrder = (orderId) => {
    // Hiển thị xác nhận trước khi hủy
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      // Trong thực tế, sẽ gọi API để hủy đơn hàng
      
      // Cập nhật trạng thái đơn hàng trong danh sách
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
      showNotification('Đơn hàng đã được hủy thành công');
    }
  };

  // Xử lý theo dõi đơn hàng
  const handleTrackOrder = (orderId) => {
    showNotification(`Đang mở trang theo dõi đơn hàng #${orderId}`);
    
    // Trong thực tế, sẽ chuyển đến trang theo dõi hoặc hiển thị modal theo dõi
    console.log(`Theo dõi đơn hàng: ${orderId}`);
    
    // Mô phỏng hiển thị popup thông tin theo dõi
    alert(`Thông tin vận chuyển đơn hàng #${orderId}:\n- Đơn hàng đang được vận chuyển\n- Dự kiến giao hàng: 1-2 ngày tới\n- Đơn vị vận chuyển: Giao Hàng Nhanh\n- Mã vận đơn: VN${Math.floor(Math.random() * 10000000)}`);
  };

  // Xử lý liên hệ với người bán
  const handleContactSeller = (orderId, shopName) => {
    showNotification(`Đang mở chat với ${shopName}`);
    
    // Trong thực tế, sẽ mở cửa sổ chat hoặc chuyển đến trang chat
    console.log(`Liên hệ với người bán: ${shopName}, Đơn hàng: ${orderId}`);
    
    // Mô phỏng hiển thị cửa sổ chat
    alert(`Đang kết nối với ${shopName}...\nVui lòng chờ trong giây lát.`);
  };

  // Xử lý đánh giá sản phẩm
  const handleRateProduct = (orderId) => {
    showNotification(`Đang mở form đánh giá cho đơn hàng #${orderId}`);
    
    // Trong thực tế, sẽ hiển thị form đánh giá
    console.log(`Đánh giá sản phẩm cho đơn hàng: ${orderId}`);
    
    // Mô phỏng hiển thị form đánh giá
    const rating = prompt('Đánh giá sản phẩm (1-5 sao):', '5');
    const comment = prompt('Nhận xét của bạn:', 'Sản phẩm rất tốt!');
    
    if (rating && comment) {
      showNotification('Cảm ơn bạn đã đánh giá sản phẩm!');
      
      // Cập nhật trạng thái đã đánh giá trong danh sách đơn hàng
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

  // Xử lý mua lại sản phẩm
  const handleBuyAgain = (orderId) => {
    // Tìm thông tin đơn hàng
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
      showNotification(`Đã thêm ${order.items.length} sản phẩm vào giỏ hàng`);
      
      // Trong thực tế, sẽ thêm sản phẩm vào giỏ hàng và chuyển đến trang giỏ hàng
      console.log(`Mua lại sản phẩm từ đơn hàng: ${orderId}`);
      
      // Mô phỏng thông báo thêm vào giỏ hàng
      const itemNames = order.items.map(item => item.name).join(', ');
      alert(`Đã thêm vào giỏ hàng:\n${itemNames}`);
    }
  };

  // Xử lý xóa đơn hàng
  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) {
      // Trong thực tế, sẽ gọi API để xóa đơn hàng
      
      // Xóa đơn hàng khỏi danh sách
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      
      showNotification('Đơn hàng đã được xóa thành công');
    }
  };

  // Xử lý xem chi tiết đơn hàng
  const handleViewDetails = (orderId) => {
    showNotification(`Đang mở trang chi tiết đơn hàng #${orderId}`);
    
    // Trong thực tế, sẽ chuyển đến trang chi tiết hoặc hiển thị modal chi tiết
    console.log(`Xem chi tiết đơn hàng: ${orderId}`);
    
    // Mô phỏng hiển thị thông tin chi tiết
    const order = orders.find(o => o.id === orderId);
    if (order) {
      let details = `Chi tiết đơn hàng #${orderId}:\n`;
      details += `Ngày đặt hàng: ${order.date}\n`;
      details += `Trạng thái: ${order.statusText}\n`;
      details += `Cửa hàng: ${order.shop.name}\n\n`;
      details += `Sản phẩm:\n`;
      
      order.items.forEach((item, index) => {
        details += `${index + 1}. ${item.name} - ${item.variation} x${item.quantity} - ${formatPrice(item.price)}\n`;
      });
      
      details += `\nTổng tiền: ${formatPrice(order.totalPrice)}`;
      
      alert(details);
    }
  };

  // Xử lý các hành động từ các button
  const handleActionClick = (action, orderId) => {
    // Tìm thông tin đơn hàng
    const order = orders.find(o => o.id === orderId);
    
    switch (action) {
      case 'pay':
        handlePayment(orderId);
        break;
      case 'cancel':
        handleCancelOrder(orderId);
        break;
      case 'track':
        handleTrackOrder(orderId);
        break;
      case 'contact_seller':
        handleContactSeller(orderId, order ? order.shop.name : '');
        break;
      case 'rate':
        handleRateProduct(orderId);
        break;
      case 'buy_again':
        handleBuyAgain(orderId);
        break;
      case 'delete':
        handleDeleteOrder(orderId);
        break;
      case 'view_details':
        handleViewDetails(orderId);
        break;
      default:
        console.log(`Hành động không được hỗ trợ: ${action}`);
    }
  };

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price).replace('₫', 'đ');
  };

  return (
    <div className={styles.container}>
      {/* Hiển thị thông báo */}
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
            placeholder="Tìm kiếm theo ID đơn hàng hoặc tên sản phẩm"
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
                  <img src={order.shop.avatar} alt={order.shop.name} className={styles.shopAvatar} />
                  <span className={styles.shopName}>{order.shop.name}</span>
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
                  <span className={styles.orderId}>Mã đơn hàng: {order.id}</span>
                </div>
                <div className={styles.orderTotal}>
                  <span className={styles.totalLabel}>Tổng số tiền:</span>
                  <span className={styles.totalPrice}>{formatPrice(order.totalPrice)}</span>
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