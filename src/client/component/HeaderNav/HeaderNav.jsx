import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiBellRinging } from "react-icons/pi";
import { AiOutlineGlobal } from "react-icons/ai";
import { BsCart2 } from "react-icons/bs";
import { COLORS } from "../../../constants/constants.js";
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
  Space,
  Menu,
  Avatar,
  Modal,
} from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  MenuOutlined,
  UserOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { getCart } from "../../page/cart/cart";
import axios from "axios";

function HeaderNav() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [cartCount, setCartCount] = useState(getCart().length);
  const [open, setOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isAIModalVisible, setIsAIModalVisible] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const navigate = useNavigate();

  // Fetch giỏ hàng
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

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const handleCartChange = () => {
      fetchCart();
    };
    window.addEventListener("cartUpdated", handleCartChange);
    return () => {
      window.removeEventListener("cartUpdated", handleCartChange);
    };
  }, []);

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
    { key: "order-tracking", label: "TRA CỨU ĐƠN HÀNG", path: "/contact" },
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
    if (key === "logout") {
      handleLogout();
    } else {
      navigate(`/${key}`);
    }
    setOpen(false);
    setDrawerVisible(false);
  };

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

  // Hàm xử lý gửi câu hỏi tới AI
  const handleAskAI = async () => {
    try {
      // Tạm thời để mock response
      setAiResponse("Đây là câu trả lời từ AI...");
      // TODO: Tích hợp API AI thực tế ở đây
    } catch (error) {
      console.error("Lỗi khi hỏi AI:", error);
    }
  };

  return (
    <div className="header-container">
      {/* Top bar */}
      <div className="top-bar py-2" style={{ backgroundColor: "#F37021" }}>
        <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
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
      <div className="main-header py-3" style={{ backgroundColor: "white" }}>
        <div className="container-fluid px-4">
          <Row align="middle" gutter={16}>
            <Col xs={24} md={4}>
              <Link to="/" className="logo d-flex justify-content-center">
                <img
                  src="/img/thehands.png"
                  alt="TheHands"
                  style={{ height: "120px", objectFit: "contain" }}
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
              <Flex justify="flex-end" align="center" gap="middle">
                <Button
                  type="primary"
                  icon={<RobotOutlined />}
                  onClick={() => setIsAIModalVisible(true)}
                  style={{
                    backgroundColor: "#F37021",
                    borderColor: "#F37021",
                    marginRight: "10px",
                  }}
                >
                  Hỏi AI
                </Button>
                {user ? (
                  <>
                    <Badge count={5} className="notification-badge">
                      <PiBellRinging
                        size={22}
                        style={{ cursor: "pointer", color: "#666" }}
                      />
                    </Badge>
                    <Popover content={content} trigger="click">
                      <div className="user-info d-flex align-items-center gap-2 px-2 py-1">
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
      <nav className="category-nav py-2 border-top border-bottom">
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

      {/* Banner Section */}
      <div className="banner-section">
        <div className="container-fluid px-4">
          <Flex align="center" justify="center" className="py-2">
            <span
              className="text-white"
              style={{ fontSize: 18, fontWeight: 500 }}
            >
              THEHANDS HUNTER THẾ HỆ MỚI
            </span>
          </Flex>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <div className="mobile-menu">
          {/* Mobile Search */}
          <div className="mb-4">
            <Input.Search placeholder="Tìm kiếm..." enterButton size="large" />
          </div>

          {/* Mobile User Info */}
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

          {/* Mobile Menu Items */}
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

      {/* Modal AI Chat */}
      <Modal
        title="Hỏi đáp với AI"
        open={isAIModalVisible}
        onCancel={() => setIsAIModalVisible(false)}
        footer={null}
        width={700}
      >
        <div style={{ marginBottom: "20px" }}>
          <Input.TextArea
            rows={4}
            placeholder="Nhập câu hỏi của bạn..."
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
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

        {aiResponse && (
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <h4>Phản hồi từ AI:</h4>
            <p>{aiResponse}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Update styles
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
