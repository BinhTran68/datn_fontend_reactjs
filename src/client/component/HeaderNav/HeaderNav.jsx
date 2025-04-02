import React, {useEffect, useRef, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiBellRinging } from "react-icons/pi";
import { BsCart2 } from "react-icons/bs";
import { COLORS } from "../../../constants/constants.js";
import { FaChalkboardUser } from "react-icons/fa6";
import {
  Badge,
  Button,
  Col,
  Drawer,
  Flex,
  Image,
  Input,
  List,
  Popover,
  Row,
  Menu,
  Avatar,
  Modal,
  Space,
  Tooltip,
} from "antd";
import { SearchOutlined, RobotOutlined } from "@ant-design/icons";
import { getCart } from "../../page/cart/cart";
import axios from "axios";
import {FaXmark} from "react-icons/fa6";
import {FaUserAstronaut} from "react-icons/fa";
import { Client } from "@stomp/stompjs";
import { apiGetNoti } from "./header.js";
import SockJS from "sockjs-client";

function HeaderNav() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [cartCount, setCartCount] = useState(getCart().length);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isAIModalVisible, setIsAIModalVisible] = useState(false);
  const navigate = useNavigate();

  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const vitegeminiurl = import.meta.env.VITE_GEMINI_URL;

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [stompClient, setStompClient] = useState(null);

  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: "Xin chào quý khách. Chúng tôi có thể hỗ trợ gì cho bạn" }
  ]);

  const messagesEndRef = useRef(null);

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;

    // Thêm câu hỏi của người dùng vào lịch sử trò chuyện
    setChatHistory((prev) => [...prev, { sender: "user", text: aiQuestion }]);
    const userQuestion = aiQuestion;
    setAiQuestion(""); // Xóa ô nhập liệu

    const aiQuestionPrev = aiQuestion;

    setAiQuestion("")
    try {
      const res = await axios.post(
          vitegeminiurl,
          {
            contents: [{ parts: [{ text: userQuestion }] }],
          },
          { headers: { "Content-Type": "application/json" } }
      );

      const aiReply = res.data.candidates[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";
      setAiResponse(aiReply);

      // Thêm phản hồi từ AI vào lịch sử trò chuyện
      setChatHistory((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (error) {
      console.error("Lỗi khi gọi Gemini API:", error);
      const errorMessage = "Xin lỗi, AI đang gặp sự cố. Vui lòng thử lại sau!";
      setAiResponse(errorMessage);
      setChatHistory((prev) => [...prev, { sender: "ai", text: errorMessage }]);
    }
  };

  // Fetch cart
  const fetchCart = async () => {
    if (user) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/client/getallcartforcustomeridnopage`,
          {
            params: { customerId: user.id },
          }
        );
        setCartCount(response.data.data.length);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setCartCount(0);
      }
    } else {
      setCartCount(getCart().length);
    }
  };

  // Fetch notifications

  const fetchNotifications = async () => {
    try {
        const response = await apiGetNoti(user?.id);
        if (response.code === 200) {
          const unreadNotifications = response.data.filter(
            (noti) => !noti.isRead
          );
          setNotifications(response.data); // Lưu tất cả thông báo
          setNotificationCount(unreadNotifications.length); // Chỉ đếm chưa đọc
        } else {
          console.error("Lỗi khi lấy thông báo:", response.status);
          setNotifications([]);
          setNotificationCount(0);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
        setNotifications([]);
        setNotificationCount(0);
      }

  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.get(
        `http://localhost:8080/api/notifications/read/${notificationId}`
      );
      setNotifications((prev) =>
        prev.map((noti) =>
          noti.id === notificationId ? { ...noti, isRead: true } : noti
        )
      );
      setNotificationCount((prev) => prev - 1); // Giảm số lượng chưa đọc
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
    }
  };

  // WebSocket connection

  const connectWebSocket = () => {
    // const socket = new SockJS("http://localhost:8080/ws"); // Dùng SockJS

    const socket = new WebSocket("ws://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: (frame) => {
        console.log("✅ WebSocket Connected:", frame);
        client.subscribe(
          "/topic/global-notifications/" + user?.id,
          (message) => {
            const newNotification = JSON.parse(message.body);
            fetchNotifications();
          }
        );
      },
      onStompError: (frame) =>
        console.error("❌ STOMP Error:", frame.headers["message"]),
      onWebSocketClose: (event) => console.warn("⚠️ WebSocket Closed:", event),
      debug: (str) => console.log("🛠 WebSocket Debug:", str),
    });
    try {
      client.activate();
      setStompClient(client);
    } catch (error) {
      console.error("❌ WebSocket Activation Error:", error);
    }
  };

  const disconnectWebSocket = () => {
    if (stompClient && stompClient.connected) {
      stompClient.deactivate();
      setStompClient(null);
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (user) {
      connectWebSocket();
    }
    return () => disconnectWebSocket();
  }, [user,cartCount]);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const handleCartChange = () => fetchCart();
    window.addEventListener("cartUpdated", handleCartChange);
    return () => window.removeEventListener("cartUpdated", handleCartChange);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/login");
  };

  const menuItems = [
    { key: "home", label: "TRANG CHỦ", path: "/" },
    { key: "products", label: "SẢN PHẨM", path: "/products" },
    { key: "bestseller", label: "SẢN PHẨM BÁN CHẠY", path: "/test" },
    { key: "contact", label: "LIÊN HỆ", path: "/contact" },
    { key: "support", label: "HỖ TRỢ", path: "/contact" },
    { key: "order-tracking", label: "TRA CỨU ĐƠN HÀNG", path: "/searchbill" },
  ];

  const settingsOptions = user
    ? [
        { key: "profile", label: "Hồ sơ" },
        { key: "purchaseorder", label: "Đơn hàng của tôi" },
        { key: "change-password", label: "Đổi mật khẩu" },
        { key: "logout", label: "Đăng xuất" },
      ]
    : [
        { key: "login", label: "Đăng nhập" },
        { key: "register", label: "Đăng ký" },
      ];

  const handleMenuClick = (key) => {
    if (key === "logout") handleLogout();
    else navigate(`/${key}`);
    setDrawerVisible(false);
  };

  const notificationContent = (
    <div style={{ width: 300, maxHeight: 400, overflowY: "auto" }}>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            onClick={() => !item.isRead && markAsRead(item.id)}
            style={{
              cursor: item.isRead ? "default" : "pointer",
              backgroundColor: item.isRead
                ? "transparent"
                : `${COLORS.backgroundcolor2}`,
              color: item.isRead ? "#888" : "#000",
            }}
          >
            <div>
              <div>{item.content}</div>
              <small>
                {new Date(item.createdAt).toLocaleString("vi-VN", {
                  timeZone: "Asia/Ho_Chi_Minh",
                })}
              </small>
            </div>
          </List.Item>
        )}
        locale={{ emptyText: "Không có thông báo nào" }}
      />
    </div>
  );

  const content = (
    <List
      dataSource={settingsOptions}
      renderItem={(item) => (
        <List.Item
          onClick={() => handleMenuClick(item.key)}
          style={{ cursor: "pointer" }}
        >
          {item.label}
        </List.Item>
      )}
    />
  );


  const  handleOnCloseAskAI = () => {
    console.log("dfsadas")
    setIsAIModalVisible(false)
  }


  return (
    <div className="header-container">
      {/* Top bar */}
      <div className="top-bar" style={{ backgroundColor: "#F37021" }}>
        <div className="container-fluid px-4 py-0 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <Link
              to="/store-system"
              className="text-white text-decoration-none"
            >
              <i className="fas fa-store me-1"></i> Hệ thống cửa hàng
            </Link>
            <span className="text-white">|</span>
            <Link to="/contact" className="text-white text-decoration-none">
              Tư vấn: 1800 6928
            </Link>
          </div>
          <div>
            <Button type="link" className="text-white">
              Tải ứng dụng
            </Button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header py-1" style={{ backgroundColor: "white" }}>
        <div className="container-fluid px-4">
          <Row align="middle" gutter={16}>
            <Col xs={24} md={4}>
              <Link to="/" className="logo d-flex justify-content-center">
                <img
                  src="/img/thehands.png"
                  alt="TheHands"
                  style={{ height: "80px", objectFit: "contain" }}
                />
              </Link>
            </Col>
            <Col xs={24} md={14}>
              <Input.Search
                placeholder="Tìm tên sản phẩm..."
                size="large"
                enterButton={
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#F37021",
                      borderColor: "#F37021",
                    }}
                  >
                    <SearchOutlined />
                  </Button>
                }
                className="search-input"
              />
              <div className="quick-links mt-2 d-none d-md-flex gap-3">
                {["Giày Nike", "Giày Adidas", "Giày Puma", "Giày thể thao"].map(
                  (tag) => (
                    <Link
                      key={tag}
                      to={`/search?q=${tag}`}
                      className="quick-link"
                      style={{ color: "#666", fontSize: "13px" }}
                    >
                      {tag}
                    </Link>
                  )
                )}
              </div>
            </Col>
            <Col xs={24} md={6}>
              <Flex justify="flex-end" align="center" gap={"middle"}>
                <Tooltip title="Trợ lý ảo TheHands">
                  <Button
                    type="primary"
                    icon={<FaUserAstronaut size={22} />}
                    onClick={() => setIsAIModalVisible(true)}
                    style={{
                      position: "fixed",
                      bottom: "100px",
                      right: "20px",
                      width: "60px",
                      height: "60px",
                      backgroundColor: `${COLORS.primary}`,
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      zIndex: 1000,
                    }}
                  ></Button>
                </Tooltip>
                {user ? (
                  <>

                    <Popover content={content} trigger="click">
                      <div
                        className="user-info d-flex align-items-center gap-2  py-1"
                        style={{ cursor: "pointer" }}
                      >
                        <Avatar
                          src={
                            user.avatar ||
                            "https://placehold.co/500x550?text=No+Image"
                          }
                          style={{ width: 35, height: 35 }}
                        />
                        <span style={{ fontSize: "14px", color: "#333" }}>
                          {user.fullName}
                        </span>
                      </div>
                    </Popover>
                    <Popover
                      content={notificationContent}
                      trigger="click"
                      title="Thông báo"
                    >
                      <Badge
                        count={notificationCount}
                        className="notification-badge"
                      >
                        <PiBellRinging
                          size={22}
                          style={{ cursor: "pointer", color: "#666" }}
                        />
                      </Badge>
                    </Popover>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="login-btn"
                    style={{ color: "#F37021" }}
                  >
                    Đăng nhập
                  </Link>
                )}
                <Badge count={cartCount}>
                  <Link to="/cart">
                    <BsCart2
                      style={{ fontSize: 24, cursor: "pointer", color: "#666" }}
                    />
                  </Link>
                </Badge>
              </Flex>
            </Col>
          </Row>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="category-nav py-1 border-top border-bottom">
        <div className="container-fluid px-4">
          <Menu
            mode="horizontal"
            className="border-0 d-flex justify-content-center"
            style={{ backgroundColor: "transparent" }}
          >
            {menuItems.map((item) => (
              <Menu.Item
                key={item.key}
                style={{
                  borderBottom: "none",
                  margin: "0 15px",
                  padding: "0 10px",
                  fontSize: "14px",
                }}
              >
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <div className="mobile-menu">
          <div className="mb-4">
            <Input.Search placeholder="Tìm kiếm..." enterButton size="small" className="p-0" />
          </div>
          {user && (
            <div className="user-info mb-4 d-flex align-items-center gap-2">
              <Image
                preview={false}
                src={
                  user.avatar || "https://placehold.co/500x550?text=No+Image"
                }
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
              <div>
                <div className="fw-bold">{user.fullName}</div>
                <small className="text-muted">{user.email}</small>
              </div>
            </div>
          )}
          <Menu mode="vertical" className="border-0">
            {menuItems.map((item) => (
              <Menu.Item
                key={item.key}
                onClick={() => {
                  navigate(item.path);
                  setDrawerVisible(false);
                }}
              >
                {item.label}
              </Menu.Item>
            ))}
            {settingsOptions.map((item) => (
              <Menu.Item
                key={item.key}
                onClick={() => handleMenuClick(item.key)}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </Drawer>

      <Drawer
        // closeIcon={<span style={{ fontSize: 20, position: "absolute", right: 25, top: 20 }}>
        //           <FaXmark />
        //     </span>}
        closable={false}
        placement="bottom"
        title={
          <div className={"d-flex gap-2 align-items-center"}>
            <div>
              <FaUserAstronaut color={"#F37021"} size={26} />
            </div>
            <div>Trợ lý ảo TheHands</div>
          </div>
        }
        onClose={handleOnCloseAskAI}
        open={isAIModalVisible}
        mask={false}
        height={430}
        extra={
          <Space>
            <Button onClick={handleOnCloseAskAI}>
              <FaXmark size={18} />
            </Button>
          </Space>
        }
        contentWrapperStyle={{
          width: 360,
          position: "fixed",
          right: 20,
          bottom: 12,
          left: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflowY: "auto",
          }}
        >
          <div style={{ flex: 1, padding: "2px", overflowY: "auto" }}>
            {chatHistory.map((msg, index) => (
              <div key={index} className={"d-flex w-100 gap-2"}>
                <strong>
                  {msg.sender === "user" ? (
                    <FaChalkboardUser size={26} color={"#F37021"} />
                  ) : (
                    <FaUserAstronaut color={"#F37021"} size={26} />
                  )}
                </strong>
                <div
                  style={{
                    padding: "10px",
                    backgroundColor:
                      msg.sender === "user" ? "#d1e7dd" : "#f5f5f5",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <Input.TextArea
            rows={2}
            placeholder="Nhập câu hỏi của bạn..."
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onPressEnter={handleAskAI}
            style={{ marginBottom: "10px" }}
          />
          <Button
            type="primary"
            onClick={handleAskAI}
            style={{
              backgroundColor: "#F37021",
              borderColor: "#F37021",
            }}
          >
            Gửi câu hỏi
          </Button>
        </div>
      </Drawer>

    </div>
  );
}

// Styles (unchanged)
const styles = `
.header-container {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo img {
  transition: all 0.3s ease;
}

.logo img:hover {
  transform: scale(1.05);
}

.search-input .ant-input {
  border-radius: 4px;
  border: 2px solid #F37021;
}

.search-input .ant-input:focus {
  border-color: #F37021;
  box-shadow: none;
}

.search-input .ant-btn {
  height: 40px;
  border-radius: 0 4px 4px 0;
}

.quick-link:hover {
  color: #F37021 !important;
}

.user-info {
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s;
}

.user-info:hover {
  background: rgba(243, 112, 33, 0.1);
}

.banner-section {
  background-color: #F37021;
}

.category-nav {
  background-color: #fff;
  border-color: #eee !important;
}

.ant-menu-horizontal > .ant-menu-item:hover,
.ant-menu-horizontal > .ant-menu-item-active {
  color: #F37021 !important;
  border-bottom: 2px solid #F37021 !important;
}

@media (max-width: 768px) {
  .main-header {
    padding: 10px 0;
  }
  
  .search-input {
    margin: 10px 0;
  }
}
`;

export default HeaderNav;
