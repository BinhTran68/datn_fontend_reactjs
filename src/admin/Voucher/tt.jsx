import React, { useState } from "react";
import "./StatusSelector.css"; // Tạo file CSS để định dạng giao diện nếu cần

const StatusSelector = () => {
  const [status, setStatus] = useState("Đang kích hoạt");

  const statuses = [
    { label: "Đang kích hoạt", color: "green" },
    { label: "Ngừng kích hoạt", color: "red" },
    { label: "Chưa kích hoạt", color: "gray" },
  ];

  return (
    <div className="status-selector">
      <h3>Trạng Thái</h3>
      <div className="status-options">
        {statuses.map((item) => (
          <button
            key={item.label}
            className={`status-button ${
              status === item.label ? "active" : ""
            }`}
            style={{ backgroundColor: status === item.label ? item.color : "#ddd" }}
            onClick={() => setStatus(item.label)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusSelector;

// Tạo file CSS (StatusSelector.css) để định dạng
/**
.status-selector {
  text-align: center;
  font-family: Arial, sans-serif;
}

.status-options {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.status-button {
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  color: white;
}

.status-button.active {
  font-weight: bold;
  transform: scale(1.1);
}
**/
