import { Button, Layout, theme, Card, Badge, Avatar, Popover, List } from "antd";

// import MenuList from "../component/sidebar/MenuList";
import { useEffect, useState } from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import MenuList from "./dashboard/MenuList.jsx";
import BillList from "./bill/BillList.jsx";
import img from "./../../public/img/thehands.png";
import { COLORS } from "../constants/constants.js";
import ChatWidget from "../client/component/Chat/ChatWidget.jsx";
import { useWebSocket } from "../client/componetC/Socket.js";

const { Header, Sider } = Layout;

function Admin() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
console.log("dây la use nè ",user);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  useEffect(() => {
    const handleUserChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("storage", handleUserChange);
    return () => {
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };
 const [messages, setMessages] = useState([]);

  // Hàm xử lý tin nhắn từ WebSocket
  const handleNewMessage = (newMsg) => {
    console.log("📨 Nhận tin nhắn bên ngoài:", newMsg);
    setMessages((prev) => [...prev, newMsg]);
  };
  const { connectWS, disconnectWS } = useWebSocket(
    "/topic/anou",
    handleNewMessage
  );

  useEffect(() => {
    connectWS(); // Kết nối WebSocket khi component mount

    return () => {
      disconnectWS(); // Ngắt kết nối khi component unmount
    };
  }, []);
  return (
    <Layout>
      <Sider
        width={230}
        collapsed={collapse}
        collapsible
        trigger={null}
        theme={darkTheme ? "dark" : "light"}
        className="sidebar min-vh-100"
      >
        <div className={"d-flex justify-content-center mt-5"}>
          <img 
            width={collapse ? 50 : 200}
            src={img} 
            alt="" 
            style={{ 
              transition: 'width 0.3s ease',
              objectFit: 'contain' 
            }}
          />
        </div>
        <MenuList darkTheme={darkTheme} />
        {/*<ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />*/}
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff",
            boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            type="text"
            className="toggle"
            onClick={() => setCollapse(!collapse)}
            icon={collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />

          <div style={{ display: "flex", alignItems: "center" }}>
            {user ? (
              <>
                <div
                  style={{
                    textAlign: "right",
                    marginRight: "10px",
                    lineHeight: "1.5",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      display: "block",
                    }}
                  >
                    {user.fullName}
                  </span>
                  <span style={{ color: "#888", fontSize: "14px" }}>
                    {user.role === "ROLE_ADMIN" 
                      ? "Chủ cửa hàng" 
                      : user.role === "ROLE_MANAGER" 
                      ? "Quản lý" 
                      : user.role === "ROLE_STAFF_SALE" 
                      ? "Nhân viên bán hàng"
                      : "Nhân viên"}
                  </span>
                </div>
                <Popover 
                  content={
                    <List>
                      <List.Item onClick={handleLogout} style={{ cursor: "pointer" }}>
                        Đăng xuất
                      </List.Item>
                    </List>
                  } 
                  trigger="click"
                >
                  <Avatar 
                    size={40} 
                    src={user.avatar ?? "https://t4.ftcdn.net/jpg/02/27/45/09/360_F_227450952_KQCMShHPOPebUXklULsKsROk5AvN6H1H.jpg"}
                    style={{ cursor: "pointer" }}
                  />
                </Popover>
              </>
            ) : (
              <Link to="/login">
                <Button type="primary" style={{ backgroundColor: '#F37021', borderColor: '#F37021' }}>
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>
        </Header>
        <Content>
          <div style={{ padding: "20px" }}>
            <Outlet />
            <ChatWidget  staffId={user?.id} senderType={"STAFF"} anou={messages}/>

          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Admin;
