import {
  Table,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Card,
  Pagination,
  message,
  Select,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import React, {
  useEffect,
  useState,
} from "react";
import {
  fetchDataSelectBrand,
  fetchProducts,
  fetchDataSelectColor,
  fetchDataSelectGender,
  fetchDataSelectProduct,
  fetchDataSelectMaterial,
  fetchDataSelectSole,
  fetchDataSelectSize,
  fetchDataSelectType,
  filterData,
  getAllProductDetailExportData,
  switchStatus,
} from "../../product/ProductDetail/ApiProductDetail.js";
import {productTableColumn} from "../columns/productTableColumn.jsx";
import {Client} from "@stomp/stompjs";
import { LOG } from "@zxing/library/esm/core/datamatrix/encoder/constants.js";

const ProductDetailModal = ({ 
                              handleOnAddProductToBill,
                              eventProductDetailChange,
                              products = [],
                              setProducts = () => {} // Thêm default function
                            }) => {
                              console.log("products", products)
  const { Title } = Typography;
  const [loading, setLoading] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [exportdata, setexportdata] = useState([]);

  // State cho filter data
  const [selectData, setSelectData] = useState({
    brands: [],
    colors: [],
    genders: [],
    materials: [],
    products: [],
    sizes: [],
    soles: [],
    types: []
  });

  const [totalProducts, setTotalProducts] = useState(0);
  const [requestFilter, setRequestFilter] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  });
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  // Load data ban đầu
  useEffect(() => {
    loadInitialData();
    setupWebSocket();
  }, []);

  // Effect cho filter và phân trang
  useEffect(() => {
    if (filterActive && Object.keys(requestFilter).length > 0) {
      loadFilteredData();
    } else {
      loadProducts();
    }
  }, [pagination, filterActive, requestFilter]);

  // Load tất cả data select
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [brands, colors, genders, materials, prods, sizes, soles, types] = 
        await Promise.all([
          fetchDataSelectBrand(),
          fetchDataSelectColor(),
          fetchDataSelectGender(),
          fetchDataSelectMaterial(), 
          fetchDataSelectProduct(),
          fetchDataSelectSize(),
          fetchDataSelectSole(),
          fetchDataSelectType()
        ]);

      setSelectData({
        brands: brands.data || [],
        colors: colors.data || [],
        genders: genders.data || [],
        materials: materials.data || [],
        products: prods.data || [],
        sizes: sizes.data || [],
        soles: soles.data || [],
        types: types.data || []
      });

      // Load sản phẩm sau khi có data select
      await loadProducts();
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu ban đầu");
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách sản phẩm
  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts(pagination);
      console.log("response", response)
      if (response && response.data) {
        setProducts(response.data);
        setTotalProducts(response.total || 0);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Load data đã filter
  const loadFilteredData = async () => {
    setLoading(true);
    try {
      const response = await filterData(pagination, requestFilter);
      if (response && response.data) {
        setProducts(response.data);
        setTotalProducts(response.total || 0);
      }
    } catch (error) {
      message.error("Lỗi khi lọc sản phẩm");
    } finally {
      setLoading(false);
    }
  };



  const setupWebSocket = () => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: { login: "guest", passcode: "guest" },
      reconnectDelay: 5000
    });

    stompClient.onConnect = () => {
      stompClient.subscribe("/topic/product-updates", (message) => {
        const updatedProduct = JSON.parse(message.body);
        eventProductDetailChange(updatedProduct);
        setProducts(prevProducts => 
          prevProducts.map(product =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
      });
    };

    stompClient.activate();
    return () => stompClient.deactivate();
  };

  // Config cho các filter
  const filterConfigs = [
    { key: 'products', placeholder: 'Tất cả sản phẩm', valueKey: 'productName' },
    { key: 'brands', placeholder: 'Tất cả thương hiệu', valueKey: 'brandName' },
    { key: 'types', placeholder: 'Tất cả loại giày', valueKey: 'typeName' },
    { key: 'colors', placeholder: 'Tất cả màu sắc', valueKey: 'colorName', hasColor: true },
    { key: 'materials', placeholder: 'Tất cả chất liệu', valueKey: 'materialName' },
    { key: 'sizes', placeholder: 'Tất cả kích cỡ', valueKey: 'sizeName' },
    { key: 'soles', placeholder: 'Tất cả đế giày', valueKey: 'soleName' },
    { key: 'genders', placeholder: 'Tất cả giới tính', valueKey: 'genderName' }
  ];

  return (
    <div>
      <h3>Danh sách sản phẩm</h3>
      <Card>
        <div className="d-flex justify-content-center gap-4 flex-column">
          {/* Search Input */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined />}
                allowClear
                onChange={(e) => {
                  const value = e.target.value;
                  setFilterActive(!!value);
                  setRequestFilter(prev => ({
                    ...prev,
                    keyword: value || undefined
                  }));
                }}
              />
            </Col>
          </Row>

          {/* Filter Selects */}
          <Row gutter={[16, 16]}>
            {filterConfigs.map((filter) => (
              <Col key={filter.key} xs={24} sm={12} md={6} lg={6}>
                <Select
                  showSearch
                  allowClear
                  style={{ width: "100%" }}
                  placeholder={filter.placeholder}
                  optionFilterProp="children"
                  onChange={(value) => {
                    setFilterActive(!!value);
                    setRequestFilter(prev => ({
                      ...prev,
                      [filter.valueKey]: value
                    }));
                  }}
                  options={[
                    { value: undefined, label: filter.placeholder },
                    ...(selectData[filter.key] || []).map((item) => ({
                      value: item[filter.valueKey],
                      label: filter.hasColor ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {item.code && (
                            <div
                              style={{
                                width: "1.2rem",
                                height: "1.2rem",
                                backgroundColor: item.code,
                                borderRadius: "50%",
                                border: "1px solid #ccc"
                              }}
                            />
                          )}
                          {item[filter.valueKey]}
                        </div>
                      ) : item[filter.valueKey]
                    }))
                  ]}
                />
              </Col>
            ))}
          </Row>

          {/* Products Table */}
          <Table
            columns={productTableColumn(pagination, handleOnAddProductToBill)}
            dataSource={products}
            loading={loading}
            pagination={false}
            rowKey="id"
            locale={{
              emptyText: "Không có dữ liệu"
            }}
          />

          {/* Pagination */}
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={totalProducts}
            onChange={(page, pageSize) => {
              setPagination({ current: page, pageSize });
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailModal;
