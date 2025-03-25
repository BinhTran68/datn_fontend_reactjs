import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./component/Footer";
import HeaderNav from "./component/HeaderNav/HeaderNav.jsx";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Client } from "@stomp/stompjs";

const App = () => {
  const [stompClient, setStompClient] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const connectWebSocket = () => {
    console.log("🔍 WebSocket Debug: Đang kết nối...");

    const socket = new WebSocket("ws://localhost:8080/ws"); // Không dùng SockJS
    const client = new Client({
      webSocketFactory: () => socket, // Dùng WebSocket API thay vì SockJS
      reconnectDelay: 5000, // Tự động thử kết nối lại sau 5s

      onConnect: (frame) => {
        console.log("✅ WebSocket Connected:", frame);

        // Đăng ký lắng nghe thông báo
        client.subscribe("/topic/global-notifications", (message) => {
          console.log("📩 Nhận thông báo:", message.body);
          setNotifications((prev) => [...prev, message.body]);
          setNotificationCount((prev) => prev + 1);
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame.headers["message"]);
      },

      onWebSocketClose: (event) => {
        console.warn("⚠️ WebSocket Closed:", event);
      },

      debug: (str) => {
        console.log("🛠 WebSocket Debug:", str);
      }
    });

    try {
      client.activate();
      setStompClient(client);
      console.log("🚀 WebSocket Client đang chạy...");
    } catch (error) {
      console.error("❌ WebSocket Activation Error:", error);
    }
  };

  // 📌 Gửi thông báo từ client
  const sendGlobalNotification = (message) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/global-notification",
        body: message,
      });
    } else {
      console.warn("⚠️ WebSocket chưa kết nối, không thể gửi tin nhắn.");
    }
  };

  // useEffect(() => {
  //   connectWebSocket();
  //   return () => stompClient?.deactivate();
  // }, []);

  return (
    <Layout>
      <Content style={{ backgroundColor: "white" }}>
        <HeaderNav 
          notifications={notifications}
          notificationCount={notificationCount}
          onSendGlobalNotification={sendGlobalNotification}
        />
      </Content>
      <Content>
        <div className="container">
          <Outlet />
        </div>
      </Content>
      <Content style={{ backgroundColor: "white" }}>
        <Footer />
      </Content>
    </Layout>
  );
};

export default App;
