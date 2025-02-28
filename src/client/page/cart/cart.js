
import { v4 as uuidv4 } from "uuid";

const getDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = uuidv4(); // Tạo ID duy nhất
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};

const addToCart = (product) => {
  const deviceId = getDeviceId();
  let cart = JSON.parse(localStorage.getItem(`cart_${deviceId}`)) || [];
  cart.push(product);
  localStorage.setItem(`cart_${deviceId}`, JSON.stringify(cart));
};

// Khi người dùng mở lại trình duyệt
const getCart = () => {
  const deviceId = getDeviceId();
  return JSON.parse(localStorage.getItem(`cart_${deviceId}`)) || [];
};
