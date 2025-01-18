import { message } from "antd";
import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchProducts = async (pagination) => {
  const { current, pageSize } = pagination;

  try {
    const response = await api.get("/productdetail", {
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

export const fetchDataSelectBrand = async () => {
  try {
    const response = await api.get("/brand/getallselect", {});

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    message.error(error.response?.data?.message);
    throw error;
  }
};

export const fetchDataSelectColor = async () => {
  try {
    const response = await api.get("/color/getallselect", {});

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    message.error(error.response?.data?.message);
    throw error;
  }
};
export const fetchDataSelectGender = async () => {
  try {
    const response = await api.get("/gender/getallselect", {});

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    message.error(error.response?.data?.message);
    throw error;
  }
};
export const fetchDataSelectMaterial = async () => {
  try {
    const response = await api.get("/material/getallselect", {});

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    message.error(error.response?.data?.message);
    throw error;
  }
};
export const fetchDataSelectProduct = async () => {
  try {
    const response = await api.get("/product/getallselect", {});

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    message.error(error.response?.data?.message);
    throw error;
  }
};
export const fetchDataSelectSize = async () => {
  try {
    const response = await api.get("/size/getallselect", {});

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    message.error(error.response?.data?.message);
    throw error;
  }
};
export const fetchDataSelectSole = async () => {
  try {
    const response = await api.get("/sole/getallselect", {});

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    message.error(error.response?.data?.message);
    throw error;
  }
};
export const fetchDataSelectType = async () => {
  try {
    const response = await api.get("/type/getallselect", {});

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    message.error(error.response?.data?.message);
    throw error;
  }
};
export const searchNameProduct = async (pagination, paramName) => {
  const { current, pageSize } = pagination; // Trích xuất current và pageSize từ pagination
  const { name } = paramName;
  try {
    const response = await api.get("/product/search", {
      params: {
        page: current,
        size: pageSize,
        name: name,
      },
    });

    const { data, meta } = response.data; // Trích xuất data và meta từ response
    return {
      data,
      total: meta?.totalElement || 0,
    }; // Trả về dữ liệu và tổng số phần tử
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    throw error;
  }
};

export const createProductDetail = async (request) => {
  try {
    const response = await api.post("/productdetail/add", request);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tạo thương hiệu.";
    console.error(errorMessage);
    message.error(error.response?.data?.message);
    throw error;
  }
};

export const existsByProductName = async (productName) => {
  try {
    const response = await api.get("product/existsbyproductname", {
      params: {
        productName,
      },
    });
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tạo thương hiệu.";
    console.error(errorMessage);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  console.log(productId);
  console.log(productData);
  
  try {
    const response = await api.put(`/productdetail/update/${productId}`, productData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Có lỗi xảy ra khi cập nhật thương hiệu.";
    console.error(errorMessage);
    message.error(errorMessage);
    throw error;
  }
};

export const deleteProductDetail = async (productId) => {
  try {
    await api.delete(`/productdetail/${productId}`);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi xóa thương hiệu.";
    console.error(errorMessage);
    throw error;
  }
};
export const getProduct = async (productId) => {
  try {
    const response = await api.get(`/productdetail/${productId}`);
    return response.data; // Assuming you want to return the fetched data
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi get thương hiệu.";
    console.error(errorMessage);
    throw new Error(errorMessage); // It's a good practice to throw a new error with a clear message
  }
};
