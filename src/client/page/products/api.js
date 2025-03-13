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

export const apigetProductDetail = async (productId, colorId, sizeId) => {
  try {
    const response = await api.get("/getproductdetail", {
      params: { productId: productId, colorId: colorId, sizeId: sizeId },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
    console.error(errorMessage);
    throw error;
  }
};

export const apiGetSizesOfProduct = async (productId) => {
    try {
      const response = await api.get("/findsizebyproductid", {
        params: { productId: productId},
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
      console.error(errorMessage);
      throw error;
    }
  };
  export const apiGetSizesOfProductAndColor = async (productId,colorId) => {
    try {
      const response = await api.get("/findsizebyproductidandcolorid", {
        params: { productId: productId,colorId: colorId},
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
      console.error(errorMessage);
      throw error;
    }
  };
  export const apiGetColorsOfProduct = async (productId) => {
    try {
      const response = await api.get("/findcolorbyproductid", {
        params: { productId: productId },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
      console.error(errorMessage);
      throw error;
    }
  };
  export const apiAddViewProduct = async (productId) => {
    try {
      const response = await api.get("/addviewproduct", {
        params: { productId: productId },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
      console.error(errorMessage);
      throw error;
    }
  };
  
  export const apiAddCart = async (productAddCart) => {
    try {
      const response = await api.post("/addcart",productAddCart);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
      console.error(errorMessage);
      throw error;
    }
  };