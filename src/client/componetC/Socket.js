import { useRef } from "react";
import { Client } from "@stomp/stompjs";

export const useWebSocket = (sub, onMessageReceived) => {
  const stompClient = useRef(null);

  const connectWS = () => {
    if (stompClient.current) {
      console.warn("⚠️ WebSocket already connected.");
      return;
    }

    if (!sub) {
      console.error("❌ WebSocket Error: Subscription topic is required!");
      return;
    }

    const socket = new WebSocket("ws://localhost:8080/ws");
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: (frame) => {
        console.log("✅ WebSocket Connected in hook:", frame);

        // Đăng ký vào topic tùy chỉnh
        stompClient.current.subscribe(sub, (message) => {
          const newMsg = message.body;
          console.log(`📩 New Message from ${sub}:`, newMsg);

          // Gọi callback để xử lý tin nhắn mới
          if (onMessageReceived) {
            onMessageReceived(newMsg);
          }
        });
      },
      onStompError: (frame) =>
        console.error("❌ STOMP Error:", frame.headers["message"]),
      onWebSocketClose: (event) => console.warn("⚠️ WebSocket Closed:", event),
      debug: (str) => console.log("🛠 WebSocket Debug:", str),
    });

    stompClient.current.activate();
  };

  const disconnectWS = () => {
    if (stompClient.current) {
      stompClient.current.deactivate();
      stompClient.current = null;
      console.log("❎ WebSocket Disconnected");
    }
  };

  return { connectWS, disconnectWS };
};
