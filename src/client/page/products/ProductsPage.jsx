import React, { useCallback, useEffect, useState, useRef } from "react";
import style from "../TestComponent/TestComponent.module.css";
import clsx from "clsx";
import styles from "./Product.module.css";
import PropProduct from "./PropProduct.jsx";
import { Content } from "antd/es/layout/layout.js";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  InputNumber,
  Layout,
  Menu,
  message,
  Pagination,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Space,
} from "antd";
import Sider from "antd/es/layout/Sider.js";
import { LaptopOutlined, NotificationOutlined, UserOutlined } from "@ant-design/icons";
import { COLORS } from "../../../constants/constants.js";
import {
  apiAddViewProduct,
  getAllProductHadCreatedAtDesc,
  getAllProducthadPromotion,
  getAllProducthadSoldDesc,
  getAllProducthadViewsDesc,
} from "./api.js";
import { FaFilter } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";
import FilterSelect from "./FilterSelect.jsx";
import {
  fetchDataSelectBrand,
  fetchDataSelectColor,
  fetchDataSelectGender,
  fetchDataSelectMaterial,
  fetchDataSelectProduct,
  fetchDataSelectSize,
  fetchDataSelectSole,
  fetchDataSelectType,
} from "../../../admin/product/ProductDetail/ApiProductDetail.js";

const url =
  "https://res.cloudinary.com/dieyhvcou/image/upload/v1742735758/5_1_b5fisz.png";
const products = [
  {
    name: "Nike - Giày thời trang thể thao Nữ Air Max SC Women's Shoes",
    price: 50000,
    promotion: "giảm 20%",
    sale: "342",
    url: url,
    statusSale: "Hot",
    rate: 5,
  },
  {
    name: "Nike - Giày thời trang thể thao Nữ Air Max SC Women's Shoes",
    price: 50000,
    promotion: "giảm 20%",
    sale: "342",
    url: url,
    statusSale: "Best Sale",
    rate: 4,
  },
  {
    name: "Nike - Giày thời trang thể thao Nữ Air Max SC Women's Shoes",
    price: 50000,
    promotion: "giảm 20%",
    sale: "342",
    url: url,
    statusSale: "Flash Sale",
    rate: 3,
  },
  {
    name: "Nike - Giày thời trang thể thao Nữ Air Max SC Women's Shoes",
    price: 50000,
    promotion: "giảm 20%",
    sale: "342",
    url: url,
    statusSale: "Flash Sale",
    rate: 3,
  },
];

const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `Danh mục ${key}`,
      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `danh mục con${subKey}`,
        };
      }),
    };
  }
);

function ProductsPage() {
  const [filteredData, setFilteredData] = useState({
    products: [],
    pagination: {},
    filters: {},
  });

  // State quản lý phân trang
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });

  const [dataSelectBrand, setDataSelectBrand] = useState([]);
  const [dataSelectColor, setDataSelectColor] = useState([]);
  const [dataSelectGender, setDataSelectGender] = useState([]);
  const [dataSelectMaterial, setDataSelectMaterial] = useState([]);
  const [dataSelectProduct, setDataSelectProduct] = useState([]);
  const [dataSelectSize, setDataSelectSize] = useState([]);
  const [dataSelectSole, setDataSelectSole] = useState([]);
  const [dataSelectType, setDataSelectType] = useState([]);
  const [requestSearch, setRequestSearch] = useState({
    name: "",
  });
  const [range, setRange] = useState([]); // Giá trị mặc định

  const [loading, setLoading] = useState(false);
  const [productHadSolDescs, setProductHadSolDescs] = useState();
  const [pageProductHadSolDescs, setPageProductHadSolDescs] = useState({
    current: 1,
    pageSize: 8,
  });

  // Sử dụng useRef để lưu giá trị pagination trước đó
  const prevPaginationRef = useRef(pagination);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataSelectBrand((await fetchDataSelectBrand()).data);
        setDataSelectProduct((await fetchDataSelectProduct()).data);
        setDataSelectType((await fetchDataSelectType()).data);
        setDataSelectColor((await fetchDataSelectColor()).data);
        setDataSelectMaterial((await fetchDataSelectMaterial()).data);
        setDataSelectSize((await fetchDataSelectSize()).data);
        setDataSelectSole((await fetchDataSelectSole()).data);
        setDataSelectGender((await fetchDataSelectGender()).data);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchData();
  }, []);

  // const getAllProductHadSoldDescs = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await getAllProducthadSoldDesc(pageProductHadSolDescs);
  //     console.log("Response tất cả sản phẩm có lượt bán từ nhiều tới ít:", response);
  //     setProductHadSolDescs(response.data);
  //   } catch (error) {
  //     message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const formatFiltersToString = (filters) => {
    const filterParts = [];

    if (filters.productId) {
      const product = dataSelectProduct.find((p) => p.id === filters.productId);
      filterParts.push(`Sản phẩm: ${product?.productName || "N/A"}`);
    }
    if (filters.brandId) {
      const brand = dataSelectBrand.find((b) => b.id === filters.brandId);
      filterParts.push(`Thương hiệu: ${brand?.brandName || "N/A"}`);
    }
    if (filters.typeId) {
      const type = dataSelectType.find((t) => t.id === filters.typeId);
      filterParts.push(`Loại giày: ${type?.typeName || "N/A"}`);
    }
    if (filters.colorId) {
      const color = dataSelectColor.find((c) => c.id === filters.colorId);
      filterParts.push(`Màu sắc: ${color?.colorName || "N/A"}`);
    }
    if (filters.materialId) {
      const material = dataSelectMaterial.find((m) => m.id === filters.materialId);
      filterParts.push(`Chất liệu: ${material?.materialName || "N/A"}`);
    }
    if (filters.sizeId) {
      const size = dataSelectSize.find((s) => s.id === filters.sizeId);
      filterParts.push(`Kích cỡ: ${size?.sizeName || "N/A"}`);
    }
    if (filters.soleId) {
      const sole = dataSelectSole.find((s) => s.id === filters.soleId);
      filterParts.push(`Đế giày: ${sole?.soleName || "N/A"}`);
    }
    if (filters.genderId) {
      const gender = dataSelectGender.find((g) => g.id === filters.genderId);
      filterParts.push(`Giới tính: ${gender?.genderName || "N/A"}`);
    }
    if (filters.minPrice !== null) {
      filterParts.push(`Giá tối thiểu: ${filters.minPrice?.toLocaleString()||0}`);
    }
    if (filters.maxPrice !== null) {
      filterParts.push(`Giá tối đa: ${filters.maxPrice?.toLocaleString()||0}`);
    }

    return filterParts.length > 0 ? filterParts.join(", ") : "Chưa có dữ liệu lọc";
  };
  const addViewProduct = async (productId) => {
    setLoading(true);
    try {
      const response = await apiAddViewProduct(productId);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = useCallback((data) => {
    setFilteredData(data);

    // Chỉ cập nhật pagination nếu totalPages hoặc totalElements thay đổi
    if (
      data?.pagination.totalPages !== pagination.totalPages ||
      data?.pagination.totalElements !== pagination.totalElements
    ) {
      setPagination((prev) => ({
        ...prev,
        totalPages: data?.pagination.totalPages || 0,
        totalElements: data?.pagination.totalElements || 0,
      }));
    }

    console.log("Dữ liệu lọc nhận được:", data);
  }, [pagination.totalPages, pagination.totalElements]); // Chỉ phụ thuộc vào totalPages và totalElements

  const handlePaginationChange = useCallback((newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  const onPageChange = (page, pageSize) => {
    handlePaginationChange({ current: page, pageSize });
  };

  return (
    <>
      <Content>
        <Layout>
          <Sider width={200} style={{ backgroundColor: "white" }}>
            <Content style={{ padding: "0.5rem" }}>
              <FilterSelect
                onFilter={handleFilter}
                onPaginationChange={handlePaginationChange}
                pagination={pagination}
                dataSelectProduct={dataSelectProduct}
                dataSelectBrand={dataSelectBrand}
                dataSelectType={dataSelectType}
                dataSelectColor={dataSelectColor}
                dataSelectMaterial={dataSelectMaterial}
                dataSelectSize={dataSelectSize}
                dataSelectSole={dataSelectSole}
                dataSelectGender={dataSelectGender}
              />
            </Content>
          </Sider>

          <Content style={{ padding: "0 0 0 7px", minHeight: 280 }}>
            <Card
              style={{ borderRadius: 0, marginBottom: "0.3rem" }}
              title={
                <Row
                  style={{
                    fontSize: "19px",
                    fontWeight: "normal",
                    backgroundColor: `${COLORS.backgroundcolor2}`,
                    padding: "10px",
                    margin: "1rem",
                    color: `${COLORS.pending}`,
                  }}
                >
                  SẢN PHẨM LỌC THEO: {formatFiltersToString(filteredData?.filters)}
                </Row>
              }
            >
              <Row gutter={[5, 5]} wrap>
                {filteredData.products.length > 0 ? (
                  filteredData.products.map((product, index) => (
                    <Col key={index} flex={"20%"}>
                      <Link
                        to={`/products/product-detail/${product.productId}?colorId=${product.colorId}&sizeId=${product.sizeId}`}
                        style={{
                          textDecoration: "none",
                          color: "black",
                          fontWeight: "normal",
                        }}
                        onClick={() => addViewProduct(product.productId)}
                      >
                        <PropProduct
                          product={{
                            name: product.productName?.trim() || "Sản phẩm chưa có tên",
                            price: product.price ?? 0,
                            promotion:
                              product.promotionName === "Không có khuyến mãi"
                                ? null
                                : product.promotionName,
                            sale: product.sold ?? 0,
                            url: product.imageUrl || "https://placehold.co/100",
                            views: product.views ?? 0,
                            rate: product.rate ?? 5,
                          }}
                        />
                      </Link>
                    </Col>
                  ))
                ) : (
                  <div>Không tìm thấy sản phẩm nào!</div>
                )}
              </Row>
            <Row className="p-3">
            <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.totalElements}
                onChange={onPageChange}
                showSizeChanger
                pageSizeOptions={["10", "20", "50"]}
              />
            </Row>
            </Card>

            <Card
              style={{ borderRadius: 0, marginBottom: "0.3rem" }}
              title={
                <Row
                  style={{
                    fontSize: "19px",
                    fontWeight: "normal",
                    backgroundColor: `${COLORS.backgroundcolor2}`,
                    padding: "10px",
                    margin: "1rem",
                    color: `${COLORS.pending}`,
                  }}
                >
                  SẢN PHẨM MỚI
                </Row>
              }
            >
              <Row gutter={[5, 5]}>
                {(products || []).map((product, index) => (
                  <Col key={index} flex={"20%"}>
                    <PropProduct product={product} />
                  </Col>
                ))}
              </Row>
            </Card>
          </Content>
        </Layout>
      </Content>
    </>
  );
}

export default ProductsPage;