import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  Input,
  Button,
  List,
  Card,
  Space,
  Typography,
  Avatar,
  Col,
  Row,
} from "antd";

const { Title } = Typography;

const CommentSection = ({ id }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [comments, setComments] = useState([]);
  const [productId, setProductId] = useState(id);
  const [customerId, setCustomerId] = useState(user?.id);
  const [comment, setComment] = useState("");
  const stompClient = useRef(null);
  const commentsRef = useRef(null);
  useEffect(() => {
    setProductId(id);
    console.log("1 làn");
  }, [id]);
  useEffect(() => {
    fetchComments();
    connectWebSocket();
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [productId]);
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/comments/${productId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const connectWebSocket = () => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: (frame) => {
        console.log("✅ WebSocket Connected:", frame);
        stompClient.current.subscribe(
          `/topic/comments/${productId}`,
          (message) => {
            const newComment = JSON.parse(message.body);
            setComments((prevComments) => [...prevComments, newComment]);
          }
        );
      },
      onStompError: (frame) =>
        console.error("❌ STOMP Error:", frame.headers["message"]),
      onWebSocketClose: (event) => console.warn("⚠️ WebSocket Closed:", event),
      debug: (str) => console.log("🛠 WebSocket Debug:", str),
    });

    try {
      stompClient.current.activate();
    } catch (error) {
      console.error("❌ WebSocket Activation Error:", error);
    }
  };

  useEffect(() => {
    // Scroll to the latest comment
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [comments]);

  const sendComment = () => {
    if (
      comment.trim() &&
      stompClient.current &&
      stompClient.current.connected
    ) {
      const message = {
        customerId,
        comment,
      };
      // Send the comment to the server via STOMP
      stompClient.current.publish({
        destination: `/app/comment/${productId}`,
        body: JSON.stringify(message),
      });
      setComment(""); // Clear input after sending
    } else {
      console.warn("Cannot send comment: STOMP client not connected");
    }
  };

  return (
    <div style={{ padding: "20px", margin: "0 auto" }}>
      <Card style={{ marginTop: "20px" }}>
        <div
          ref={commentsRef}
          style={{ maxHeight: "300px", overflowY: "auto", padding: "10px" }}
        >
          <List
            dataSource={comments}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Row>
                      {" "}
                      <Col
                        span={1}
                        style={{
                          paddingRight: "10px",
                        }}
                      >
                        {" "}
                        <Avatar src={`${user?.avata}`} />
                      </Col>
                      <Col span={23}>
                        <strong>{item.fullName}</strong>{" "}
                        <span style={{ color: "#888" }}>
                          (
                          {new Date(item.createdAt).toLocaleString("vi-VN", {
                            timeZone: "Asia/Ho_Chi_Minh",
                          })}
                          )
                        </span>
                        <Col span={24} className="pt-2">
                          {item.comment}
                        </Col>
                      </Col>
                    </Row>
                  }
                />
              </List.Item>
            )}
          />
          {user?.id && (
            <Space style={{ width: "100%" }}>
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nội dung"
                maxLength={500}
                onPressEnter={sendComment}
                style={{
                  minWidth: "400px",
                }}
              />
              <Button type="primary" onClick={sendComment}>
                Bình luận
              </Button>
            </Space>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CommentSection;
