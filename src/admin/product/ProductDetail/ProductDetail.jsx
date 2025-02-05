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
  Tooltip,
} from "antd";
import { TiExport } from "react-icons/ti";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ModalEditSanPham from "./ModalEditSanPham.jsx";
import Breadcrumb from "../BreadCrumb.jsx";
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
  createProductDetailList,
  getAllProductDetailExportData,
} from "./ApiProductDetail.js";
import { FaEye, FaRegTrashCan } from "react-icons/fa6";
import clsx from "clsx";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { COLORS } from "../../../constants/constants..js";

const Product = () => {
  const { Title } = Typography;
  const [loading, setLoading] = useState(false);
  const [filterActice, setFilterActice] = useState(false);
  const [products, setProducts] = useState([]);
  const [exportdata, setexportdata] = useState([]);

  const [selectedProductDetail, setSelectedProductDetail] = useState();

  const [dataSelectBrand, setDataSelectBrand] = useState([]);
  const [dataSelectColor, setDataSelectColor] = useState([]);
  const [dataSelectGender, setDataSelectGender] = useState([]);
  const [dataSelectMaterial, setDataSelectMaterial] = useState([]);
  const [dataSelectProduct, setDataSelectProduct] = useState([]);
  const [dataSelectSize, setDataSelectSize] = useState([]);
  const [dataSelectSole, setDataSelectSole] = useState([]);
  const [dataSelectType, setDataSelectType] = useState([]);

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

  const [isExporting, setIsExporting] = useState(false); // Thêm flag kiểm soát xuất dữ liệu

  useEffect(() => {
    if (exportdata.length > 0 && isExporting) {
      exportToExcel(); // Chỉ gọi khi có dữ liệu và flag isExporting là true
      setIsExporting(false); // Reset lại trạng thái xuất sau khi đã xuất
      fetchProductsData();
    }
  }, [exportdata, isExporting]); // Theo dõi exportdata và isExporting

  const handleExportClick = async () => {
    try {
      const response = await getAllProductDetailExportData();
      console.log("Response from API:", response);

      setexportdata(response.data); // Cập nhật state exportdata
      setIsExporting(true); // Đánh dấu là đang xuất dữ liệu
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  // exporrt excel
  const exportToExcel = () => {
    if (exportdata.length === 0) {
      message.warning("Không có dữ liệu để xuất!");
      return;
    }

    // Chỉ chọn những trường quan trọng cần xuất ra Excel
    const exportData = exportdata.map((item) => ({
      ID: item.id,
      "Mã Code": item.code,
      "Tên Sản Phẩm": item.productName,
      "Thương Hiệu": item.brandName,
      "Loại Giày": item.typeName,
      "Màu Sắc": item.colorName,
      "Chất Liệu": item.materialName,
      "Kích Cỡ": item.sizeName,
      "Đế Giày": item.soleName,
      "Giới Tính": item.genderName,
      "Số Lượng": item.quantity,
      "Giá (VND)": item.price,
      "Trạng Thái":
        item.status === "HOAT_DONG" ? "Hoạt động" : "Ngừng hoạt động",
      "Cập Nhật Bởi": item.updateBy,
      "Ngày Cập Nhật": new Date(item.updateAt).toLocaleString("vi-VN"), // Chuyển timestamp thành ngày
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData); // Chuyển dữ liệu thành Sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách sản phẩm");

    // Xuất file Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    const timestamp = new Date()
      .toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/[^\w\s]/g, "")
      .replace(" ", "_"); // Loại bỏ dấu và thay ' ' bằng '_'
    saveAs(excelBlob, `Danh_sach_san_pham_${timestamp}.xlsx`);
  };

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts(pagination);
      console.log("Response from API:", response); // Log response để kiểm tra dữ liệu trả về
      setProducts(response.data);
      setTotalProducts(response.total);
      setexportdata(response.data);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const ExportAllData = async () => {
    setLoading(true);
    try {
      const response = await getAllProductDetailExportData();
      console.log("Response from API:", response); // Log response để kiểm tra dữ liệu trả về
      // setProducts(response.data);
      setexportdata(response.data);
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
      setexportdata(response.data);
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
      title: "#",
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => (
        <div>{index + 1 + (pagination.current - 1) * pagination.pageSize}</div>
      ),
      onCell: () => ({
        style: {
          width: "20px",
          height: "50px",
          lineHeight: "50px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",

      onCell: () => ({
        style: {
          width: "100px",
          height: "50px",
          lineHeight: "50px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Hãng",
      dataIndex: "brandName",
      key: "productName",

      onCell: () => ({
        style: {
          width: "200px",
          height: "50px",
          lineHeight: "50px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Loại giày",
      dataIndex: "typeName",
      key: "productName",

      onCell: () => ({
        style: {
          width: "100px",
          height: "50px",
          lineHeight: "50px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Màu sắc",
      dataIndex: "colorName",
      key: "productName",
      onCell: () => ({
        style: {
          width: "100px",
          height: "50px",
          lineHeight: "50px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Chất liệu",
      dataIndex: "materialName",
      key: "productName",
      onCell: () => ({
        style: {
          width: "100px",
          height: "50px",
          lineHeight: "50px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Kích cỡ",
      dataIndex: "sizeName",
      key: "productName",
      onCell: () => ({
        style: {
          width: "100px",
          height: "50px",
          lineHeight: "50px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Đế giày",
      dataIndex: "soleName",
      key: "productName",

      onCell: () => ({
        style: {
          width: "100px",
          height: "50px",
          lineHeight: "50px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Giới tính",
      dataIndex: "genderName",
      key: "productName",

      onCell: () => ({
        style: {
          width: "100px",
          height: "50px",
          lineHeight: "50px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "productName",
      onCell: () => ({
        style: {
          width: "100px",
          height: "50px",
          lineHeight: "50px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        if (price === null || price === undefined) return null; // Nếu không có dữ liệu, trả về null
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price);
      },
      onCell: () => ({
        style: {
          width: "100px",
          height: "50px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    },

    // {
    //   title: "Ngày cập nhật",
    //   dataIndex: "updateAt",
    //   key: "updateAt",
    //   width: "15rem",
    //   render: (text) => {
    //     // Kiểm tra xem ngày có hợp lệ không
    //     const date = new Date(text);
    //     if (isNaN(date.getTime())) {
    //       return ""; // Nếu không hợp lệ, trả về chuỗi trống
    //     }
    //     return date.toLocaleDateString(); // Nếu hợp lệ, trả về ngày đã format
    //   },
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        let color = status === "HOAT_DONG" ? "green" : "red";
        if (!status) {
          return null;
        }
        return (
          <Tag color={color} style={{ fontSize: "12px", padding: "5px 15px" }}>
            {status === "HOAT_DONG" ? "Hoạt động" : "Ngừng hoạt động"}{" "}
            {/* Hiển thị status với chữ in hoa */}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      width: "10rem",
      render: (_, record) => {
        if (!record.status || Object.keys(record).length === 0) {
          return null;
        }
        return (
          <>
            <Row gutter={[16, 16]}>
              <Tooltip title="Chỉnh sửa sản phẩm">
                <Button
                  onClick={() => {
                    handleGetProduct(record.id);
                  }}
                  icon={
                    <FaEdit
                      style={{
                        color: "green",
                        fontSize: "1.5rem",
                      }}
                    />
                  }
                  style={{ marginRight: "1rem" }}
                />
              </Tooltip>

              {/* <Popconfirm
                title="Xóa Hãng"
                description="Bạn có muốn xóa Sản phẩm này kh"
                okText="Xác nhận"
                cancelText="Hủy"
                onConfirm={() => handleDeleteProductDetail(record.id)}
              >
                <Button
                  icon={<FaRegTrashCan size={20} color="#FF4D4F" />}
                  className={`${styles.buttonDelete} ant-btn`}
                ></Button>
              </Popconfirm> */}
              <Tooltip title="Xem chi tiết sản phẩm">
                <Link to={`${record.id}`}>
                  <Button icon={<FaEye color="green" size={20} />} />
                </Link>
              </Tooltip>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <Card>
      <Title level={2}>Tất cả Sản phẩm chi tiết</Title>
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
                backgroundColor: `${COLORS.backgroundcolor}`,
                borderColor: "#4096FF",
                color: `${COLORS.color}`,
              }}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
        <Row>
          <Row gutter={[16, 16]}>
            <Col>
              <Select
                showSearch
                style={{
                  width: "10rem",
                }}
                placeholder="Tất cả sản phẩm"
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
                  { value: "", label: "Tất cả sản phẩm" },
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
                placeholder="Tất cả màu sắc"
                optionFilterProp="title"
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
                    label: (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "1.2rem",
                            height: "1.2rem",
                            backgroundColor: `${c.code}`,
                            borderRadius: "50%",
                            border: "1px solid #ccc",
                          }}
                        />
                        {c.colorName}
                      </div>
                    ),
                    title: c.colorName, // Dùng 'title' để lọc khi search
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
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: "16px" }}></Row>
        </Row>
        <Row>
          {/* <Link to={"add"}>
            <Button
              style={{
                backgroundColor: `${COLORS.backgroundcolor}`,
                borderColor: "#4096FF",
                color: `${COLORS.color}`,
              }}
              type="primary"
              onClick={showDrawer}
              icon={<PlusOutlined />}
            >
              Thêm sản phẩm
            </Button>
          </Link> */}

          <Popconfirm
            title="Chọn kiểu xuất"
            placement="right"
            onConfirm={handleExportClick}
            onCancel={exportToExcel}
            okText="Xuất tất cả sản phẩm"
            cancelText="Xuất trang hiện tại"
            okButtonProps={{
              style: {
                backgroundColor: `${COLORS.backgroundcolor}`,
                color: `${COLORS.color}`,
                border: "none",
                padding: "10px 20px",
              },
            }}
            cancelButtonProps={{
              style: {
                backgroundColor: `${COLORS.backgroundcolor}`,
                color: `${COLORS.color}`,
                border: "none",
                padding: "10px 20px",
              },
            }}
          >
            <Button
              style={{
                backgroundColor: `${COLORS.backgroundcolor}`,
                borderColor: "#4096FF",
                color: `${COLORS.color}`,
              }}
              type="primary"
              // onClick={handleExportClick}
            >
              <TiExport size={22} />
              Xuất Excel
            </Button>
          </Popconfirm>
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
          // className="custom-table"
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
      </div>
    </Card>
  );
};

export default Product;
