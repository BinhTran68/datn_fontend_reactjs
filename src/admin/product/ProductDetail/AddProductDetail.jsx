import React, { useEffect, useState } from "react";
import {
  Drawer,
  Row,
  Col,
  Select,
  InputNumber,
  Input,
  Button,
  Space,
  Card,
  Table,
  Form,
  Upload,
  notification,
} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  createProductDetailList,
  fetchDataSelectBrand,
  fetchDataSelectColor,
  fetchDataSelectGender,
  fetchDataSelectMaterial,
  fetchDataSelectProduct,
  fetchDataSelectSize,
  fetchDataSelectSole,
  fetchDataSelectType,
} from "./ApiProductDetail";
import { IoAddCircleOutline, IoAddCircleSharp } from "react-icons/io5";
import { MdAdd, MdAddBox, MdAddCircleOutline } from "react-icons/md";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { createProduct } from "../Product/ApiProduct";
import ModalAddProduct from "../Product/ModalAddProduct";
import { createSize } from "../Size/ApiSize";
import { createColor } from "../Color/ApiColor";
import { createBrand } from "../Brand/apibrand";
import { createSole } from "../Sole/ApiSole";
import { createType } from "../Type/ApiType";
import { createMaterial } from "../Material/ApiMaterial";
import { createGender } from "../Gender/ApiGender";
import { Navigate, useNavigate } from "react-router-dom";
import Breadcrumb from "../BreadCrumb";

const { TextArea } = Input;

const ProductDetailDrawer = () => {
  const navigate = useNavigate();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [value, setValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [colors, setColors] = useState([]); // Khởi tạo với mảng rỗng để tránh lỗi
  const [sizes, setSizes] = useState([]);
  const [color, setColor] = useState([]); // Khởi tạo với mảng rỗng để tránh lỗi
  const [size, setSize] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState([]);
  const [form] = Form.useForm();

  // modal
  const [openCreateProduct, setOpenCreateProduct] = useState(false);

  const [loading, setLoading] = useState(false);
  const [filterActice, setFilterActice] = useState(false);
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
  // them nhanh khi nhap
  const [searchProduct, setSearchProduct] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [searchColor, setSearchColor] = useState("");
  const [searchGender, setSearchGender] = useState("");
  const [searchMaterial, setSearchMaterial] = useState("");
  const [searchSole, setSearchSole] = useState("");
  const [searchSize, setSearchSize] = useState("");
  const [searchType, setSearchType] = useState("");

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
  // thêm nhanh
  const handleCreateProduct = async (productData) => {
    try {
      setLoading(true);
      console.log(request);
      await createProduct(productData);
      fetchDataProduct();
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm sản phẩm  thành công!`,
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Failed to update san pham",
      });
    } finally {
      setLoading(false);
      setOpenCreateProduct(false);
    }
  };

  const handleCreateSize = async (data) => {
    try {
      setLoading(true);
      await createSize(data);
      fetchDataSize();
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm Kích cỡ  thành công!`,
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Thêm kích cỡ thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateColor = async (data) => {
    try {
      setLoading(true);
      await createColor(data);
      fetchDataColor();
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm Màu sắc thành công!`,
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Thêm Màu sắc thất bại",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCreateBrand = async (data) => {
    try {
      setLoading(true);
      await createBrand(data);
      fetchDataBrand();
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm Thương hiệu thành công!`,
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Thêm Thương hiệu thất bại",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCreateSole = async (data) => {
    try {
      setLoading(true);
      await createSole(data);
      fetchDataSole();
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm Đế giày thành công!`,
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Thêm Đế giày thất bại",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCreateType = async (data) => {
    try {
      setLoading(true);
      await createType(data);
      fetchDataType();
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm Loại giày thành công!`,
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Thêm Loại giày thất bại",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCreateMaterial = async (data) => {
    try {
      setLoading(true);
      await createMaterial(data);
      fetchDataMaterial();
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm Chất liệu thành công!`,
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Thêm Chất liệu thất bại",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCreateGenDer = async (data) => {
    try {
      setLoading(true);
      await createGender(data);
      fetchDataGender();
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm Giới tính thành công!`,
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: "Thêm Giới Tính thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts(dataSelectProduct);
    setSizes(dataSelectSize);
    setColors(dataSelectColor);

    fetchDataBrand();
    fetchDataColor();
    fetchDataGender();
    fetchDataMaterial();
    fetchDataProduct();
    fetchDataSize();
    fetchDataSole();
    fetchDataType();
  }, [color, size, product, openCreateProduct]);

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

  const handleCreateProductDetail = async (tableData) => {
    try {
      setLoading(true);
      console.log(request);
      await createProductDetailList(tableData);
      // setFilterActice(false);
      // fetchProductsData(); // Refresh data after creation
      notification.success({
        message: "Success",
        duration: 4,
        pauseOnHover: false,
        showProgress: true,
        description: `Thêm sản phẩm  thành công!`,
      });
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
      setLoading(false);
      // Đặt lại request, giữ nguyên status

      setOpen(false);
    }
  };
  const resetFrom = () => {
    generateTableData(color, size, product);
    setTableData([]);
    setRequest((prev) => ({
      ...prev,
      productId: dataSelectProduct[0]?.id || null,
      brandId: dataSelectBrand[0]?.id || null,
      genderId: dataSelectGender[0]?.id || null,
      materialId: dataSelectMaterial[0]?.id || null,
      typeId: dataSelectType[0]?.id || null,
      soleId: dataSelectSole[0]?.id || null,
    }));
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setHasSelected(newSelectedRowKeys.length > 0);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleTableDataChange = (field, value) => {
    const updatedData = tableData.map((item) => ({ ...item, [field]: value }));
    setTableData(updatedData); // Cập nhật lại state
    console.log(tableData);
  };

  const handleInputChange = (key, dataIndex, value) => {
    const numericValue = parseFloat(value);

    // Kiểm tra nếu giá trị âm
    if (numericValue < 0) {
      notification.error({
        message: "Lỗi nhập liệu",
        description: `${
          dataIndex === "soLuong" ? "Số lượng" : "Giá"
        } không được nhỏ hơn 0`,
        duration: 3,
      });
      return; // Dừng xử lý khi phát hiện giá trị âm
    }
    const updatedData = tableData.map((item) => {
      if (item.key === key) {
        return { ...item, [dataIndex]: numericValue };
      }
      return item;
    });
    setTableData(updatedData);
    console.log(tableData);
  };
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
    },

    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (text, record) => (
        <Input
          type="number"
          min={0}
          value={record.quantity}
          defaultValue={text}
          onChange={(e) =>
            handleInputChange(record.key, "quantity", e.target.value)
          }
          suffix={<span>Đôi</span>}
        />
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (text, record) => (
        <Input
          type="number"
          min={0}
          defaultValue={text}
          value={record.price}
          onChange={(e) =>
            handleInputChange(record.key, "price", e.target.value)
          }
          suffix={<span>VNĐ</span>}
        />
      ),
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
      render: (text, record) => (
        <Input
          type="number"
          min={0}
          defaultValue={text}
          value={record.weight}
          onChange={(e) =>
            handleInputChange(record.key, "weight", e.target.value)
          }
          suffix={<span>Kg</span>}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (text, record) => (
        <Button type="primary" danger onClick={() => handleDelete(record.key)}>
          Xóa
        </Button>
      ),
    },
  ];
  const generateTableData = (
    selectedColors,
    selectedSizes,
    selectedProduct
  ) => {
    const newData = [];

    selectedColors.forEach((color) => {
      const colorItem = colors.find((item) => item.id === color);
      const productItem = products.find((item) => item.id === selectedProduct);
      if (!productItem) {
        console.log(products);

        console.error("Không tìm thấy sản phẩm với id:", selectedProduct);
        return; // Dừng nếu không tìm thấy sản phẩm
      }
      const variants = selectedSizes.map((size) => {
        const sizeItem = sizes.find((item) => item.id === size); // Sửa lỗi

        return {
          key: `${color}-${size}`,
          colorId: color,
          sizeId: size,
          productId: product, //selectedProduct.id,
          productName: `${productItem.productName} [ ${sizeItem.sizeName}-${colorItem.colorName} ]`,
          quantity: 0,
          price: 0,
          image: "",
          status: 1,
          color: color, // Thêm trường color để nhóm các dòng cùng màu
          // mỗi biến thể khi render ra đều có các thuộc tính
          brandId: request.brandId || null,
          materialId: request.materialId || null,
          genderId: request.genderId || null,
          typeId: request.typeId || null,
          soleId: request.soleId || null,
          description: request.description || null,
        };
      });

      console.log(tableData);
      console.log(productItem);

      newData.push(...variants);
    });

    setTableData(newData);
  };
  const handleColorChange = (selectedColors) => {
    setColor(selectedColors);
    console.log("color đã chọn" + color);

    generateTableData(selectedColors, size, product);
  };

  const handleSizeChange = (selectedSizes) => {
    setSize(selectedSizes);
    generateTableData(color, selectedSizes, product);
  };
  const handleProductChange = (selectedProduct) => {
    setProduct(selectedProduct);
    generateTableData(color, size, selectedProduct);
    console.log(selectedProduct);
  };
  const handleDelete = (key) => {
    const updatedData = tableData.filter((item) => item.key !== key); // Lọc bỏ dòng có key tương ứng
    setTableData(updatedData); // Cập nhật lại dữ liệu
  };
  const groupedData = color.map((colorId) => ({
    colorName: dataSelectColor.find((c) => c.id === colorId)?.colorName,
    rows: tableData.filter((row) => row.colorId === colorId),
  }));
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card
          style={{
            marginBottom: "1rem",
          }}
        >
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Breadcrumb />
            </Col>
            <Col>
              <h6>Thông tin cơ bản</h6>
            </Col>
            <Col span={24}>
              <div>Tên sản phẩm</div>

              <Row gutter={[5, 0]}>
                <Col>
                  <Select
                    showSearch
                    style={{ width: "15rem" }}
                    placeholder="Chọn sản phẩm"
                    optionFilterProp="label"
                    value={request.productId}
                    onSearch={(value) => setSearchProduct(value)} // Lưu giá trị tìm kiếm
                    notFoundContent={
                      <a
                        onClick={() =>
                          handleCreateProduct({ productName: searchProduct })
                        }
                        style={{ padding: 0, color: "black" }}
                      >
                        Thêm nhanh: {searchProduct}
                      </a>
                    }
                    onChange={handleProductChange}
                    options={dataSelectProduct?.map((p) => ({
                      value: p.id,
                      label: p.productName,
                    }))}
                  />
                </Col>
                <Col>
                  {/* <Button
                      style={{ padding: 0, backgroundColor: "green" }}
                      onClick={() => setOpenCreateProduct(true)}
                    >
                      <MdAdd size={25} color="white" />
                    </Button> */}
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <div>Mô tả</div>
              <ReactQuill
                theme="snow"
                value={request.description}
                placeholder="Mô tả tối đa 200 từ"
                onChange={(value) => {
                  setRequest((prev) => ({
                    ...prev,
                    description: value,
                  }));

                  handleTableDataChange("description", value);
                }}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline"],
                    [false, false],
                  ],
                }}
              />
            </Col>
          </Row>
        </Card>
        <Card>
          <Row>
            <Col span={24}>
              <h6>Thuộc tính</h6>
            </Col>
            <Col span={8}>
              <Row gutter={[5, 0]}>
                <div>Thương hiệu</div>
                <Col>
                  <Select
                    showSearch
                    style={{ width: "9rem" }}
                    placeholder="Chọn thương hiệu"
                    optionFilterProp="label"
                    value={request.brandId}
                    onSearch={(value) => setSearchBrand(value)} // Lưu giá trị tìm kiếm
                    notFoundContent={
                      <a
                        onClick={() =>
                          handleCreateBrand({ brandName: searchBrand })
                        }
                        style={{ padding: 0, color: "black" }}
                      >
                        Thêm nhanh: {searchBrand}
                      </a>
                    }
                    onChange={(value) => {
                      setRequest((prev) => ({
                        ...prev,
                        brandId: value,
                      }));

                      handleTableDataChange("brandId", value);
                    }}
                    options={dataSelectBrand?.map((b) => ({
                      value: b.id,
                      label: b.brandName,
                    }))}
                  />
                </Col>
                <Col>
                  {/* <Button style={{ padding: 0, backgroundColor: "green" }}>
                      <MdAdd size={25} color="white" />
                    </Button> */}
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <div>Giới tính</div>

              <Row gutter={[5, 0]}>
                <Col>
                  <Select
                    showSearch
                    style={{ width: "9rem" }}
                    placeholder="Chọn giới tính"
                    optionFilterProp="label"
                    value={request.genderId}
                    onSearch={(value) => setSearchGender(value)} // Lưu giá trị tìm kiếm
                    notFoundContent={
                      <a
                        onClick={() =>
                          handleCreateGenDer({ genderName: searchGender })
                        }
                        style={{ padding: 0, color: "black" }}
                      >
                        Thêm nhanh: {searchGender}
                      </a>
                    }
                    onChange={(value) => {
                      setRequest((prev) => ({
                        ...prev,
                        genderId: value,
                      }));

                      handleTableDataChange("genderId", value);
                    }}
                    options={dataSelectGender?.map((g) => ({
                      value: g.id,
                      label: g.genderName,
                    }))}
                  />
                </Col>
                <Col>
                  {/* <Button style={{ padding: 0, backgroundColor: "green" }}>
                      <MdAdd size={25} color="white" />
                    </Button> */}
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <div>Chất liệu</div>

              <Row gutter={[5, 0]}>
                <Col>
                  <Select
                    showSearch
                    style={{ width: "9rem" }}
                    placeholder="Chọn chất liệu"
                    optionFilterProp="label"
                    value={request.materialId}
                    onSearch={(value) => setSearchMaterial(value)} // Lưu giá trị tìm kiếm
                    notFoundContent={
                      <a
                        onClick={() =>
                          handleCreateMaterial({
                            materialName: searchMaterial,
                          })
                        }
                        style={{ padding: 0, color: "black" }}
                      >
                        Thêm nhanh: {searchMaterial}
                      </a>
                    }
                    onChange={(value) => {
                      setRequest((prev) => ({
                        ...prev,
                        materialId: value,
                      }));

                      handleTableDataChange("materialId", value);
                    }}
                    options={dataSelectMaterial?.map((m) => ({
                      value: m.id,
                      label: m.materialName,
                    }))}
                  />
                </Col>
                <Col>
                  {/* <Button style={{ padding: 0, backgroundColor: "green" }}>
                      <MdAdd size={25} color="white" />
                    </Button> */}
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <div>Loại giày</div>

              <Row gutter={[5, 0]}>
                <Col>
                  <Select
                    showSearch
                    style={{ width: "9rem" }}
                    placeholder="Chọn loại giày"
                    optionFilterProp="label"
                    value={request.typeId}
                    onSearch={(value) => setSearchType(value)} // Lưu giá trị tìm kiếm
                    notFoundContent={
                      <a
                        onClick={() =>
                          handleCreateType({ typeName: searchType })
                        }
                        style={{ padding: 0, color: "black" }}
                      >
                        Thêm nhanh: {searchType}
                      </a>
                    }
                    onChange={(value) => {
                      setRequest((prev) => ({
                        ...prev,
                        typeId: value,
                      }));

                      handleTableDataChange("typeId", value);
                    }}
                    options={dataSelectType?.map((t) => ({
                      value: t.id,
                      label: t.typeName,
                    }))}
                  />
                </Col>
                <Col>
                  {/* <Button style={{ padding: 0, backgroundColor: "green" }}>
                      <MdAdd size={25} color="white" />
                    </Button> */}
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <div>Loại đế giày</div>

              <Row gutter={[5, 0]}>
                <Col>
                  <Select
                    showSearch
                    style={{ width: "9rem" }}
                    placeholder="Chọn loại đế giày"
                    optionFilterProp="label"
                    value={request.soleId}
                    onSearch={(value) => setSearchSole(value)} // Lưu giá trị tìm kiếm
                    notFoundContent={
                      <a
                        onClick={() =>
                          handleCreateSole({ soleName: searchSole })
                        }
                        style={{ padding: 0, color: "black" }}
                      >
                        Thêm nhanh: {searchSole}
                      </a>
                    }
                    onChange={(value) => {
                      setRequest((prev) => ({
                        ...prev,
                        soleId: value,
                      }));

                      handleTableDataChange("soleId", value);
                    }}
                    options={dataSelectSole?.map((s) => ({
                      value: s.id,
                      label: s.soleName,
                    }))}
                  />
                </Col>
                <Col>
                  {/* <Button style={{ padding: 0, backgroundColor: "green" }}>
                      <MdAdd size={25} color="white" />
                    </Button> */}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={[0, 15]} style={{ marginTop: "16px" }}>
            <Col span={12}>
              <div>Màu sắc</div>

              <Row gutter={[5, 0]}>
                <Col>
                  <Select
                    mode="multiple"
                    showSearch
                    style={{ width: "15rem" }}
                    placeholder="Chọn màu sắc"
                    value={request.colorId}
                    onSearch={(value) => setSearchColor(value)} // Lưu giá trị tìm kiếm
                    notFoundContent={
                      <a
                        onClick={() =>
                          handleCreateColor({ colorName: searchColor })
                        }
                        style={{ padding: 0, color: "black" }}
                      >
                        Thêm nhanh: {searchColor}
                      </a>
                    }
                    optionFilterProp="label"
                    // value={request.colorId}
                    onChange={handleColorChange}
                    options={dataSelectColor?.map((c) => ({
                      value: c.id,
                      label: c.colorName,
                    }))}
                  />
                </Col>
                <Col>
                  {/* <Button style={{ padding: 0, backgroundColor: "green" }}>
                      <MdAdd size={25} color="white" />
                    </Button> */}
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <div>Kích cỡ</div>

              <Row gutter={[5, 0]}>
                <Col>
                  <Select
                    mode="multiple"
                    showSearch
                    style={{ width: "15rem" }}
                    placeholder="Chọn kích cỡ"
                    optionFilterProp="label"
                    value={request.sizeId}
                    onSearch={(value) => setSearchSize(value)} // Lưu giá trị tìm kiếm
                    notFoundContent={
                      <a
                        onClick={() =>
                          handleCreateSize({ sizeName: searchSize })
                        }
                        style={{ padding: 0, color: "black" }}
                      >
                        Thêm nhanh: {searchSize}
                      </a>
                    }
                    onChange={handleSizeChange}
                    options={dataSelectSize?.map((s) => ({
                      value: s.id,
                      label: s.sizeName,
                    }))}
                  />
                </Col>
                <Col>
                  {/* <Button style={{ padding: 0, backgroundColor: "green" }}>
                      <MdAdd size={25} color="white" />
                    </Button> */}
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={12}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col>
                {tableData.length > 0 && (
                  <Button
                    onClick={() => {
                      handleCreateProductDetail(tableData);
                      resetFrom();
                      navigate(-1);
                    }}
                    type="primary"
                  >
                    Lưu thông tin
                  </Button>
                )}
              </Col>
              {groupedData.map((group) => (
                <Col span={24} key={group.colorName}>
                  <Card title={`Sản phẩm chi tiết: ${group.colorName}`}>
                    <Table
                      rowSelection={rowSelection}
                      columns={columns}
                      dataSource={group.rows}
                      pagination={false}
                      rowKey="key"
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Col>

      <ModalAddProduct
        open={openCreateProduct}
        onCreate={handleCreateProduct}
        onCancel={() => setOpenCreateProduct(false)}
      />
    </Row>
  );
};

export default ProductDetailDrawer;
