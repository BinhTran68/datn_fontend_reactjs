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
} from "antd";
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
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  searchNameProduct,
  existsByProductName,
} from "./ApiProductDetail.js";
import { FaRegTrashCan } from "react-icons/fa6";
import { RxUpdate } from "react-icons/rx";
import clsx from "clsx";
import { debounce } from "lodash";

const Product = () => {
  const { Title } = Typography;
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const [request, setRequest] = useState({
    productName: "",
    status: "HOAT_DONG",
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5, // Số dòng hiển thị mỗi trang
  });



  // validate cho create

  useEffect(() => {
    fetchProductsData();
  }, [pagination]);

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
  

  // thêm

  // xóa

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
            {status} {/* Hiển thị status với chữ in hoa */}
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
                <Button>
                  <RxUpdate size={20} color="primary" /> Cập nhật
                </Button>
              </Col>

              <Col>
                <Popconfirm
                  title="Xóa Hãng"
                  description="Bạn có muốn xóa Sản phẩmnày kh"
                  okText="Xác nhận"
                  cancelText="Hủy"
                >
                  <Button className={`${styles.buttonDelete} ant-btn`}>
                    <FaRegTrashCan size={20} color="#FF4D4F" /> xóa
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
                backgroundColor: "#90649C",
                borderColor: "#90649C",
                color: "#fff",
              }}
            >
              Tìm kiếm
            </Button>
          </Col>
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
          pageSizeOptions={["3", "5", "10", "20"]}
          onShowSizeChange={(current, pageSize) => {
            setPagination({
              current: 1, // Quay lại trang 1 khi thay đổi số lượng phần tử mỗi trang
              pageSize,
            });
            fetchProductsData(); // Gọi lại API để cập nhật dữ liệu phù hợp
          }}
          onChange={(page, pageSize) => {
            setPagination({ current: page, pageSize });
            fetchProductsData(); // Gọi lại API để cập nhật dữ liệu phù hợp
          }}
        />
        <h3>{products.id}1</h3>
      </div>
    </Card>
  );
};

export default Product;
