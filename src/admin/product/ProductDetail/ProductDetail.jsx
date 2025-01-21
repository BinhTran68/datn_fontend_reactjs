import {
  Table,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Card,
  Modal,
  Pagination,
  message,
  Tag,
  Form,
  Space,
  Radio,
  Flex,
  Grid,
  Popconfirm,
  Drawer,
  Select,
  InputNumber,
  notification,
} from "antd";
import ModalEditSanPham from "./ModalEditSanPham.jsx";
import styles from "./ProductDetail.module.css";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import axios from "axios";
import {
  fetchDataSelectBrand,
  fetchProducts,
  updateProduct,
  deleteProductDetail,
  getProduct,
  searchNameProduct,
  existsByProductName,
  fetchDataSelectColor,
  fetchDataSelectGender,
  fetchDataSelectProduct,
  fetchDataSelectMaterial,
  fetchDataSelectSole,
  fetchDataSelectSize,
  fetchDataSelectType,
  createProductDetail,
  filterData,
} from "./ApiProductDetail.js";
import { FaRegTrashCan } from "react-icons/fa6";
import { RxUpdate } from "react-icons/rx";
import clsx from "clsx";
import { debounce, filter, set } from "lodash";
import TextArea from "antd/es/input/TextArea.js";
import { FaEdit } from "react-icons/fa";
// import DrawerAdd from "./Drawer.jsx";
import ProductDetailDrawer from "./ProductDetailDrawer.jsx";

const Product = () => {
  const { Title } = Typography;
  const [loading, setLoading] = useState(false);
  const [filterActice, setFilterActice] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductDetail, setSelectedProductDetail] = useState();

  const [dataSelectBrand, setDataSelectBrand] = useState([]);
  const [idBrand, setIdBrand] = useState();
  const [dataSelectColor, setDataSelectColor] = useState([]);
  const [idColor, setIdColor] = useState();
  const [dataSelectGender, setDataSelectGender] = useState([]);
  const [idGender, setIdGender] = useState();
  const [dataSelectMaterial, setDataSelectMaterial] = useState([]);
  const [idMaterial, setIdMaterial] = useState();
  const [dataSelectProduct, setDataSelectProduct] = useState([]);
  const [idProduct, setIdProduct] = useState();
  const [dataSelectSize, setDataSelectSize] = useState([]);
  const [idSize, setIdSize] = useState();
  const [dataSelectSole, setDataSelectSole] = useState([]);
  const [idSole, setIdSole] = useState();
  const [dataSelectType, setDataSelectType] = useState([]);
  const [idType, setIdType] = useState();

  const [totalProducts, setTotalProducts] = useState(0);
  const [request, setRequest] = useState({
    status: "HOAT_DONG",
  });
  const [requestFilter, setRequestFilter] = useState();
  const [requestUpdate, setRequestUpdate] = useState({
    productName: null,
    brandName: null,
    typeName: null,
    colorName: null,
    materialName: null,
    sizeName: null,
    soleName: null,
    genderName: null,
    status: null,
    sortByQuantity: null,
    sortByPrice: null,
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5, // Số dòng hiển thị mỗi trang
  });
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // validate cho create

  useEffect(() => {
    if (filterActice) {
      fetchfilterData(pagination, requestFilter);
    } else {
      fetchProductsData();
    }

    fetchDataBrand();
    fetchDataColor();
    fetchDataGender();
    fetchDataMaterial();
    fetchDataProduct();
    fetchDataSize();
    fetchDataSole();
    fetchDataType();
  }, [pagination, openUpdate, open]);
  useEffect(() => {
    if (requestFilter !== undefined) {
      // Chỉ gọi fetchfilterData khi requestFilter đã thay đổi
      fetchfilterData(pagination, requestFilter);
    }
  }, [requestFilter]); // Theo dõi sự thay đổi của requestFilter

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts(pagination);
      console.log("Response from API:", response); // Log response để kiểm tra dữ liệu trả về
      setProducts(response.data);
      setTotalProducts(response.total);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const fetchfilterData = async () => {
    setLoading(true);
    try {
      const response = await filterData(pagination, requestFilter);
      console.log("Response from API:", response); // Log response để kiểm tra dữ liệu trả về
      setProducts(response.data);
      setTotalProducts(response.total);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const fetchDataBrand = async () => {
    setLoading(true);
    try {
      const response = await fetchDataSelectBrand();
      console.log("Response from API brand:", response); // Log response để kiểm tra dữ liệu trả về
      setDataSelectBrand(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const fetchDataColor = async () => {
    setLoading(true);
    try {
      const response = await fetchDataSelectColor();
      console.log("Response from API color:", response); // Log response để kiểm tra dữ liệu trả về
      setDataSelectColor(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const fetchDataGender = async () => {
    setLoading(true);
    try {
      const response = await fetchDataSelectGender();
      console.log("Response from API gender:", response); // Log response để kiểm tra dữ liệu trả về
      setDataSelectGender(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDataProduct = async () => {
    setLoading(true);
    try {
      const response = await fetchDataSelectProduct();
      console.log("Response from API product:", response); // Log response để kiểm tra dữ liệu trả về
      setDataSelectProduct(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const fetchDataMaterial = async () => {
    setLoading(true);
    try {
      const response = await fetchDataSelectMaterial();
      console.log("Response from API material:", response); // Log response để kiểm tra dữ liệu trả về
      setDataSelectMaterial(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDataSize = async () => {
    setLoading(true);
    try {
      const response = await fetchDataSelectSize();
      console.log("Response from API size:", response); // Log response để kiểm tra dữ liệu trả về
      setDataSelectSize(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDataSole = async () => {
    setLoading(true);
    try {
      const response = await fetchDataSelectSole();
      console.log("Response from API Sole:", response); // Log response để kiểm tra dữ liệu trả về
      setDataSelectSole(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDataType = async () => {
    setLoading(true);
    try {
      const response = await fetchDataSelectType();
      console.log("Response from API type:", response); // Log response để kiểm tra dữ liệu trả về
      setDataSelectType(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  // thêm
  const handleCreateProductDetail = async (productData) => {
    try {
      setLoading(true);
      console.log(request);
      await createProductDetail(productData);
      setFilterActice(false);
      fetchProductsData(); // Refresh data after creation
      message.success("Tạo chi tiết sản phẩm thành công!");
      setRequest({
        status: "HOAT_DONG",
      });
    } catch (error) {
      console.error(error);
      message.error(
        error.message || "Có lỗi xảy ra khi tạo chi tiết sản phẩm."
      );
    } finally {
      setLoading(false);
      // Đặt lại request, giữ nguyên status

      setOpen(false);
    }
  };

  // xóa

  const handleDeleteProductDetail = useCallback(async (productId) => {
    try {
      setLoading(true);
      await deleteProductDetail(productId);
      if (filterActice) {
        fetchfilterData(pagination, requestFilter);
      } else {
        fetchProductsData();
      }
      notification.success({
        message: "Success",
        duration: 3,
        pauseOnHover: false,
        showProgress: true,
        description: `Xóa sản phẩm thành công !`,
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: error.message || "Có lỗi xảy ra khi xóa.",
        duration: 3,
        pauseOnHover: false,
        showProgress: true,
        description: `Xóa sản phẩm không thành công !`,
      });
      // message.error(error.message || "Có lỗi xảy ra khi xóa thương hiệu.");
    } finally {
      setLoading(false);
    }
  });

  const handleGetProduct = useCallback(
    async (productId) => {
      setLoading(true);
      try {
        const productData = await getProduct(productId);
        setSelectedProductDetail(productData.data);
        console.log(selectedProductDetail);
        setOpenUpdate(true); // Hiển thị modal
      } catch (error) {
        message.error(
          error.message || "Có lỗi xảy ra khi tải thông tin thương hiệu."
        );
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    },
    [] // Dependency list để tránh re-define hàm không cần thiết
  );
  const handleConfirmUpdate = async (id, req) => {
    // setLoading(true);
    console.log(id + "đay la id");

    try {
      await updateProduct(id, req);
      console.log("đã chạy tới dayd");

      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Cập nhật sản phẩm  thành công!`,
      });
      setOpenUpdate(false); // setCurrentPage(1);
      // await fetchProductsData();
    } catch (error) {
      console.error("Failed to update san pham", error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Failed to update san pham",
      });
    } finally {
      // setLoading(false);
    }
  };
  const handleDataSource = () => {
    const totalRows = pagination.pageSize;
    const dataLength = products.length;
    const emptyRows = Math.max(totalRows - dataLength, 0);

    const emptyData = new Array(emptyRows).fill({}).map((_, index) => ({
      key: `empty-${index}`, // Thêm key duy nhất
    }));

    return [
      ...products.map((product, index) => ({
        ...product,
        key: product.id || index,
      })),
      ...emptyData,
    ];
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "1rem",
      render: (_, __, index) => (
        <div style={{ height: "2rem" }}>
          {index + 1 + (pagination.current - 1) * pagination.pageSize}
        </div>
      ),
    },
    {
      title: "Tên Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      width: "20rem",
    },
    {
      title: "Tên Hãng",
      dataIndex: "brandName",
      key: "productName",
      width: "20rem",
    },
    {
      title: "Tên Loại giày",
      dataIndex: "typeName",
      key: "productName",
      width: "20rem",
    },
    {
      title: "Tên Màu sắc",
      dataIndex: "colorName",
      key: "productName",
      width: "20rem",
    },
    {
      title: "Tên Chất liệu",
      dataIndex: "materialName",
      key: "productName",
      width: "20rem",
    },
    {
      title: "Tên Kích cỡ",
      dataIndex: "sizeName",
      key: "productName",
      width: "20rem",
    },
    {
      title: "Tên Đế giày",
      dataIndex: "soleName",
      key: "productName",
      width: "20rem",
    },
    {
      title: "Giới tính",
      dataIndex: "genderName",
      key: "productName",
      width: "20rem",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "productName",
      width: "20rem",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "productName",
      width: "20rem",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updateAt",
      key: "updateAt",
      width: "15rem",
      render: (text) => {
        // Kiểm tra xem ngày có hợp lệ không
        const date = new Date(text);
        if (isNaN(date.getTime())) {
          return ""; // Nếu không hợp lệ, trả về chuỗi trống
        }
        return date.toLocaleDateString(); // Nếu hợp lệ, trả về ngày đã format
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15rem",
      render: (_, { status }) => {
        let color = status === "HOAT_DONG" ? "green" : "red";
        if (!status) {
          return null;
        }
        return (
          <Tag color={color} style={{ fontSize: "12px", padding: "5px 15px" }}>
            {status==="HOAT_DONG"?"Hoạt động":"Ngừng hoạt động"} {/* Hiển thị status với chữ in hoa */}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",

      render: (_, record) => {
        if (!record.status || Object.keys(record).length === 0) {
          return null;
        }
        return (
          <>
            <Row gutter={[16, 16]}>
              <Col>
                <Button
                  style={{ width: "8rem" }}
                  onClick={() => {
                    handleGetProduct(record.id);
                  }}
                  icon={
                    <FaEdit
                      style={{
                        color: "green",
                        marginRight: 8,
                        fontSize: "1.5rem",
                      }}
                    />
                  }
                >
                  Cập nhật
                </Button>
              </Col>

              <Col>
                <Popconfirm
                  title="Xóa Hãng"
                  description="Bạn có muốn xóa Sản phẩm này kh"
                  okText="Xác nhận"
                  cancelText="Hủy"
                  onConfirm={() => handleDeleteProductDetail(record.id)}
                >
                  <Button
                    style={{ width: "8rem" }}
                    icon={<FaRegTrashCan size={20} color="#FF4D4F" />}
                    className={`${styles.buttonDelete} ant-btn`}
                  >
                    xóa
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <Card>
      <Title level={2}>Sản Phẩm</Title>
      <div className={"d-flex justify-content-center gap-4 flex-column"}>
        <Row gutter={[16, 16]}>
          <Col span={20}>
            <Input
              placeholder="Nhập vào tên Sản phẩmbạn muốn tìm!"
              prefix={<SearchOutlined />}
              allowClear
              name="name"
            />
          </Col>

          <Col span={4}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              // onClick={searchName}
              style={{
                backgroundColor: "#4096FF",
                borderColor: "#4096FF",
                color: "#fff",
              }}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
        <Row>
          <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
            Thêm Chi tiết sản phẩm
          </Button>
          <ProductDetailDrawer
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleCreateProductDetail}
            request={request}
            setRequest={setRequest}
            dataSelectProduct={dataSelectProduct}
            dataSelectBrand={dataSelectBrand}
            dataSelectGender={dataSelectGender}
            dataSelectMaterial={dataSelectMaterial}
            dataSelectType={dataSelectType}
            dataSelectSole={dataSelectSole}
            dataSelectColor={dataSelectColor}
            dataSelectSize={dataSelectSize}
          />

          <ModalEditSanPham
            handleClose={() => {
              setOpenUpdate(false);
            }}
            isOpen={openUpdate}
            title={"Sản phẩm"}
            getProductDetail={selectedProductDetail}
            handleSubmit={handleConfirmUpdate}
            dataType={dataSelectType}
            dataBrand={dataSelectBrand}
            dataMaterial={dataSelectMaterial}
            dataSole={dataSelectSole}
            dataColor={dataSelectColor}
            dataGender={dataSelectGender}
            dataProduct={dataSelectProduct}
            dataSize={dataSelectSize}
          />
        </Row>
        <Row>
          <Row gutter={[16, 16]}>
            <Col>
              <Select
                showSearch
                style={{
                  width: "10rem",
                }}
                placeholder="chọn sản phẩm"
                optionFilterProp="label"
                // filterSort={(optionA, optionB) =>
                //   (optionA?.label ?? "")
                //     .toLowerCase()
                //     .localeCompare((optionB?.label ?? "").toLowerCase())
                // }

                // value={request.productId}
                onChange={(value) => {
                  setPagination({ current: 1, pageSize: pagination.pageSize });
                  setFilterActice(true);
                  setRequestFilter((prev) => ({
                    ...prev,
                    productName: value, // Cập nhật giá trị nhập vào
                  }));
                }}
                options={[
                  { value: "", label: "chọn sản phẩm..." },
                  ...dataSelectProduct?.map((p) => ({
                    value: p.productName,
                    label: p.productName,
                  })),
                ]}
              />
            </Col>
            <Col>
              <Select
                showSearch
                style={{
                  width: "10rem",
                }}
                placeholder="Tất cả Thương hiệu"
                optionFilterProp="label"
                // filterSort={(optionA, optionB) =>
                //   (optionA?.label ?? "")
                //     .toLowerCase()
                //     .localeCompare((optionB?.label ?? "").toLowerCase())
                // }

                // value={dataSelectBrand.id}
                onChange={(value) => {
                  setFilterActice(true);
                  setPagination({ current: 1, pageSize: pagination.pageSize });
                  setRequestFilter((prev) => ({
                    ...prev,
                    brandName: value, // Cập nhật giá trị nhập vào
                  }));
                  console.log(requestFilter);
                }}
                options={[
                  { value: "", label: "Tất cả thương hiệu" },
                  ...dataSelectBrand?.map((p) => ({
                    value: p.brandName,
                    label: p.brandName,
                  })),
                ]}
              />
            </Col>

            <Col>
              <Select
                showSearch
                style={{
                  width: "10rem",
                }}
                placeholder="Tất cả giới tính"
                optionFilterProp="label"
                // filterSort={(optionA, optionB) =>
                //   (optionA?.label ?? "")
                //     .toLowerCase()
                //     .localeCompare((optionB?.label ?? "").toLowerCase())
                // }

                value={dataSelectGender.id}
                onChange={(value) => {
                  setFilterActice(true);
                  setPagination({ current: 1, pageSize: pagination.pageSize });
                  setRequestFilter((prev) => ({
                    ...prev,
                    genderName: value, // Cập nhật giá trị nhập vào
                  }));
                  console.log(requestFilter);
                }}
                options={[
                  { value: "", label: "Tất cả giới tính" },
                  ...dataSelectGender?.map((g) => ({
                    value: g.genderName,
                    label: g.genderName,
                  })),
                ]}
              />
            </Col>
            <Col>
              <Select
                showSearch
                style={{
                  width: "10rem",
                }}
                placeholder="Tất cả chất liệu"
                optionFilterProp="label"
                // filterSort={(optionA, optionB) =>
                //   (optionA?.label ?? "")
                //     .toLowerCase()
                //     .localeCompare((optionB?.label ?? "").toLowerCase())
                // }

                value={dataSelectMaterial.id}
                onChange={(value) => {
                  setFilterActice(true);
                  setPagination({ current: 1, pageSize: pagination.pageSize });
                  setRequestFilter((prev) => ({
                    ...prev,
                    materialName: value, // Cập nhật giá trị nhập vào
                  }));
                  console.log(requestFilter);
                }}
                options={[
                  { value: "", label: "Tất cả chất liệu" },
                  ...dataSelectMaterial?.map((m) => ({
                    value: m.materialName,
                    label: m.materialName,
                  })),
                ]}
              />
            </Col>
            <Col>
              <Select
                showSearch
                style={{
                  width: "10rem",
                }}
                placeholder="Tất cả loại giày"
                optionFilterProp="label"
                // filterSort={(optionA, optionB) =>
                //   (optionA?.label ?? "")
                //     .toLowerCase()
                //     .localeCompare((optionB?.label ?? "").toLowerCase())
                // }

                value={dataSelectType.id}
                onChange={(value) => {
                  setFilterActice(true);
                  setPagination({ current: 1, pageSize: pagination.pageSize });
                  setRequestFilter((prev) => ({
                    ...prev,
                    typeName: value, // Cập nhật giá trị nhập vào
                  }));
                  console.log(requestFilter);
                }}
                options={[
                  { value: "", label: "Tất cả loại giày" },
                  ...dataSelectType?.map((g) => ({
                    value: g.typeName,
                    label: g.typeName,
                  })),
                ]}
              />
            </Col>

            <Col>
              <Select
                showSearch
                style={{
                  width: "10rem",
                }}
                placeholder="Tất cả loại đế giày"
                optionFilterProp="label"
                // filterSort={(optionA, optionB) =>
                //   (optionA?.label ?? "")
                //     .toLowerCase()
                //     .localeCompare((optionB?.label ?? "").toLowerCase())
                // }

                value={dataSelectSole.id}
                onChange={(value) => {
                  setFilterActice(true);
                  setPagination({ current: 1, pageSize: pagination.pageSize });
                  setRequestFilter((prev) => ({
                    ...prev,
                    soleName: value, // Cập nhật giá trị nhập vào
                  }));
                  console.log(request);
                }}
                options={[
                  { value: "", label: "Tất cả loại đế giày" },
                  ...dataSelectSole?.map((s) => ({
                    value: s.soleName,
                    label: s.soleName,
                  })),
                ]}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            <Col>
              <Select
                showSearch
                style={{
                  width: "10rem",
                }}
                placeholder="Tất cả màu sắc"
                optionFilterProp="label"
                // filterSort={(optionA, optionB) =>
                //   (optionA?.label ?? "")
                //     .toLowerCase()
                //     .localeCompare((optionB?.label ?? "").toLowerCase())
                // }

                value={dataSelectColor.id}
                onChange={(e) => {
                  setFilterActice(true);
                  setPagination({ current: 1, pageSize: pagination.pageSize });
                  setRequestFilter((prev) => ({
                    ...prev,
                    colorName: e, // Cập nhật giá trị nhập vào
                  }));
                  console.log(requestFilter);
                }}
                options={[
                  { value: "", label: "Tất cả màu sắc" },
                  ...dataSelectColor?.map((c) => ({
                    value: c.colorName,
                    label: c.colorName,
                  })),
                ]}
              />
            </Col>
            <Col>
              <Select
                showSearch
                style={{
                  width: "10rem",
                }}
                placeholder="Tất cả kích cỡ"
                optionFilterProp="label"
                // filterSort={(optionA, optionB) =>
                //   (optionA?.label ?? "")
                //     .toLowerCase()
                //     .localeCompare((optionB?.label ?? "").toLowerCase())
                // }

                value={dataSelectSize.id}
                onChange={(value) => {
                  setFilterActice(true);
                  setPagination({ current: 1, pageSize: pagination.pageSize });
                  setRequestFilter((prev) => ({
                    ...prev,
                    sizeName: value, // Cập nhật giá trị nhập vào
                  }));
                  console.log(requestFilter);
                }}
                options={[
                  { value: "", label: "Tất cả kích cỡ" },
                  ...dataSelectSize?.map((s) => ({
                    value: s.sizeName,
                    label: s.sizeName,
                  })),
                ]}
              />
            </Col>
          </Row>
        </Row>

        <Table
          columns={columns}
          dataSource={handleDataSource()} // Dữ liệu đã xử lý với dòng trống
          loading={loading}
          pagination={false} // Bỏ pagination trong Table
          locale={{
            emptyText: (
              <div style={{ textAlign: "center" }}>
                <p>No data</p>
              </div>
            ),
          }}
        />

        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={totalProducts}
          showSizeChanger
          pageSizeOptions={["1", "5", "10", "20"]}
          onShowSizeChange={(current, pageSize) => {
            setPagination({
              current: 1, // Quay lại trang 1 khi thay đổi số lượng phần tử mỗi trang
              pageSize,
            });
          }}
          onChange={(page, pageSize) => {
            setPagination({ current: page, pageSize });
            // fetchProductsData(); // Gọi lại API để cập nhật dữ liệu phù hợp
          }}
        />
        <h3>{products.id}1</h3>
      </div>
    </Card>
  );
};

export default Product;
