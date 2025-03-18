import { message } from "antd";
import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:8080/api/client",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const apiGetAddressDefaut = async (req) => {
  const { customerId } = req;

  try {
    const response = await api.get("/getadressdefault", {
      params: { customerId: customerId },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    throw error;
  }
};
