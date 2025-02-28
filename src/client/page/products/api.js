import { message } from "antd";
import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:8080/api/client",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getAllProductHadCreatedAtDesc = async (pagination) => {
  const { current, pageSize } = pagination;
  try {
    const response = await api.get("/getallproducthadviewsdesc", {
      params: { page: current, size: pageSize },
    });
    const { data, meta } = response.data;
    return { data, total: meta?.totalElement || 0 };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    throw error;
  }
};

export const getAllProducthadSoldDesc = async (pagination) => {
  const { current, pageSize } = pagination;
  try {
    const response = await api.get("/getallproducthadsoledesc", {
      params: { page: current, size: pageSize },
    });
    const { data, meta } = response.data;
    return { data, total: meta?.totalElement || 0 };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    throw error;
  }
};
export const getAllProducthadPromotion = async (pagination) => {
  const { current, pageSize } = pagination;
  try {
    const response = await api.get("/getallproducthadpromotion", {
      params: { page: current, size: pageSize },
    });
    const { data, meta } = response.data;
    return { data, total: meta?.totalElement || 0 };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    throw error;
  }
};

export const getAllProducthadViewsDesc = async (pagination) => {
  const { current, pageSize } = pagination;
  try {
    const response = await api.get("/getallproducthadviewsdesc", {
      params: { page: current, size: pageSize },
    });
    const { data, meta } = response.data;
    return { data, total: meta?.totalElement || 0 };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    throw error;
  }
};
