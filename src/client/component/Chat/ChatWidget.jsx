import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  Button,
  Input,
  List,
  Card,
  Space,
  Modal,
  Row,
  Col,
  Avatar,
  Typography,
  Flex,
} from "antd";
import { MessageOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { COLORS } from "../../../constants/constants";

const { Text } = Typography;

const ChatWidget = ({ customerId, staffId, senderType }) => {
  const [isChatOpen, setIsChatOpen] = useState(false); // Trạng thái mở/đóng Modal
  const [showMessages, setShowMessages] = useState(false); // Trạng thái hiển thị tin nhắn hay danh sách
  const [messages, setMessages] = useState([]); // Danh sách tin nhắn
  const [newMessage, setNewMessage] = useState(""); // Tin nhắn mới
  const [conversationId, setConversationId] = useState(null); // ID của cuộc trò chuyện hiện tại
  const [conversations, setConversations] = useState([]); // Danh sách cuộc trò chuyện (cho STAFF)
  const [staffList, setStaffList] = useState([]); // Danh sách staff (cho CUSTOMER)
  const stompClient = useRef(null);
  const messagesRef = useRef(null);

  // Lấy danh sách cuộc trò chuyện (cho STAFF) hoặc danh sách staff (cho CUSTOMER) khi mở Modal
  useEffect(() => {
    if (!isChatOpen) return;

    const fetchData = async () => {
      try {
        if (senderType === "STAFF") {
          // Lấy danh sách tất cả cuộc trò chuyện của staff
          const response = await axios.get(
            `http://localhost:8080/api/conversations/staff/${staffId}`
          );
          setConversations(response.data);
          console.log("Danh sách cuộc trò chuyện của staff:", response.data);
        } else {
          // Lấy danh sách staff cho customer
          const response = await axios.get("http://localhost:8080/api/conversations/staff");
          setStaffList(response.data);
          console.log("Danh sách staff:", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [isChatOpen, customerId, staffId, senderType]);

  // Kết nối WebSocket và lấy lịch sử tin nhắn khi chọn cuộc trò chuyện
  useEffect(() => {
    if (!conversationId) return;

    // Lấy lịch sử tin nhắn
    axios
      .get(`http://localhost:8080/api/messages/${conversationId}`)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => console.error("Lỗi khi lấy tin nhắn:", error));

    // Kết nối WebSocket
    const socket = new WebSocket("http://localhost:8080/ws");
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: (frame) => {
        console.log("✅ WebSocket Connected:", frame);
        stompClient.current.subscribe(
          `/topic/messages/${conversationId}`,
          (message) => {
            const newMsg = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, newMsg]);
          }
        );
      },
      onStompError: (frame) =>
        console.error("❌ STOMP Error:", frame.headers["message"]),
      onWebSocketClose: (event) => console.warn("⚠️ WebSocket Closed:", event),
      debug: (str) => console.log("🛠 WebSocket Debug:", str),
    });

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [conversationId]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Gửi tin nhắn
  const sendMessage = () => {
    if (
      newMessage.trim() &&
      stompClient.current &&
      stompClient.current.connected
    ) {
      const message = {
        conversationId,
        senderType: senderType,
        senderId: senderType === "CUSTOMER" ? customerId : staffId,
        content: newMessage,
        status: "SENT",
      };
      stompClient.current.publish({
        destination: `/app/message/${conversationId}`,
        body: JSON.stringify(message),
      });
      setNewMessage("");
    }
  };

  // Chọn cuộc trò chuyện (cho STAFF) hoặc tạo/lấy cuộc trò chuyện (cho CUSTOMER)
  const selectConversation = async (id) => {
    try {
      if (senderType === "STAFF") {
        // Nếu là STAFF, id là conversationId
        setConversationId(id);
      } else {
        // Nếu là CUSTOMER, id là staffId, kiểm tra hoặc tạo cuộc trò chuyện
        const response = await axios.post(
          "http://localhost:8080/api/conversations",
          {
            customerId,
            staffId: id,
          }
        );
        setConversationId(response.data.id);
      }
      setShowMessages(true);
      setMessages([]); // Xóa tin nhắn cũ khi chuyển cuộc trò chuyện
    } catch (error) {
      console.error("Lỗi khi chọn/tạo cuộc trò chuyện:", error);
    }
  };

  // Quay lại danh sách
  const goBackToList = () => {
    setShowMessages(false);
    setConversationId(null);
    setMessages([]);
  };

  return (
    <>
      {/* Hình tròn ở góc phải bên dưới */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
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
        onClick={() => setIsChatOpen(true)}
      >
        <MessageOutlined style={{ color: "white", fontSize: "24px" }} />
      </div>

      {/* Modal */}
      <Modal
        title={
          showMessages ? (
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={goBackToList}
                style={{ marginRight: "10px" }}
              />
              Hỗ Trợ Khách Hàng
            </Space>
          ) : senderType === "STAFF" ? (
            "Danh Sách Cuộc Trò Chuyện"
          ) : (
            "Danh Sách Nhân Viên Hỗ Trợ"
          )
        }
        open={isChatOpen}
        onCancel={() => {
          setIsChatOpen(false);
          setShowMessages(false);
          setConversationId(null);
          setMessages([]);
        }}
        footer={null}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          top: "auto",
          left: "auto",
          width: "400px",
        }}
        styles={{
          body: { padding: "10px", maxHeight: "400px", overflowY: "auto" },
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {/* Hiển thị danh sách cuộc trò chuyện (cho STAFF) hoặc danh sách staff (cho CUSTOMER) */}
          {!showMessages && (
            <List
              dataSource={senderType === "STAFF" ? conversations : staffList}
              renderItem={(item) => (
                <List.Item
                  onClick={() =>
                    selectConversation(senderType === "STAFF" ? item.id : item.id)
                  }
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <Space>
                    <Avatar>
                      {senderType === "STAFF"
                        ? item.customer?.fullName?.charAt(0)
                        : item.fullName?.charAt(0) || "U"}
                    </Avatar>
                    <div>
                      <Text strong>
                        {senderType === "STAFF"
                          ? item.customer?.fullName
                          : item.fullName || "Nhân viên"}
                      </Text>
                      <br />
                      {senderType === "STAFF" && (
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          {item?.lastMessage || "Chưa có tin nhắn"}
                        </Text>
                      )}
                    </div>
                  </Space>
                </List.Item>
              )}
            />
          )}

          {/* Hiển thị danh sách tin nhắn */}
          {showMessages && (
            <>
              <div
                ref={messagesRef}
                style={{
                  flex: 1,
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "10px",
                }}
              >
                <List
                  dataSource={messages}
                  renderItem={(msg) => (
                    <List.Item
                      style={{
                        display: "flex",
                        justifyContent:
                          msg.senderType === senderType
                            ? "flex-end"
                            : "flex-start",
                      }}
                    >
                      <Card
                        style={{
                          maxWidth: "70%",
                          backgroundColor:
                            msg.senderType === senderType
                              ? `${COLORS.backgroundcolor2}`
                              : "#f5f5f5",
                          borderRadius: "10px",
                        }}
                      >
                        <p style={{ margin: 0 }}>{msg.content}</p>
                        <span style={{ fontSize: "12px", color: "#888" }}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>

              {/* Ô nhập tin nhắn */}
              <Flex gap={10} style={{ marginTop: "10px", width: "100%" }}>
                <Input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn của bạn"
                  onPressEnter={sendMessage}
                  style={{width:"100%"}}
                />
                <Button type="primary" onClick={sendMessage}>
                  Gửi
                </Button>
              </Flex>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ChatWidget;