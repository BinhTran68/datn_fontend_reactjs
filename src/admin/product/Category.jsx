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
} from "antd";
import styles from "./Category.module.css";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  fetchBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../product/apibrand.js";
import { FaRegTrashCan } from "react-icons/fa6";
import { RxUpdate } from "react-icons/rx";
import clsx from "clsx";

const Category = () => {
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const { Title } = Typography;
  const [brands, setBrands] = useState([]);
  const [totalBrands, setTotalBrands] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [request, setRequest] = useState({
    brandName: "",
    status: "HOAT_DONG",
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5, // Số dòng hiển thị mỗi trang
  });
  const handleRequest = (e) => {
    const { name, value } = e.target;
    setRequest((prev) => ({
      ...prev,
      [name]: value, // Update the specific field in the state
    }));

    console.log(request);
  };
  // Hàm fetch dữ liệu brands
  useEffect(() => {
    fetchBrandsData();
  }, [pagination]);

  const fetchBrandsData = async () => {
    setLoading(true);
    try {
      const { data, total } = await fetchBrands(pagination);
      setBrands(data);
      setTotalBrands(total);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  const handleCreateBrand = async (brandData) => {
    try {
      setLoading(true);
      await createBrand(brandData);
      fetchBrandsData(); // Refresh data after creation
      message.success("Thương hiệu đã được tạo thành công!");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Có lỗi xảy ra khi tạo thương hiệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBrand = async (brandData) => {
    try {
      setLoading(true);
      await updateBrand(selectedBrand.id, brandData);
      setUpdateModalVisible(false);
      setSelectedBrand(null);
      fetchBrandsData(); // Refresh data after update
    } catch (error) {
      console.error(error);
      message.error(error.message || "Có lỗi xảy ra khi cập nhật thương hiệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (brandId) => {
    try {
      setLoading(true);
      await deleteBrand(brandId);
      fetchBrandsData(); // Refresh data after deletion
      message.success("Xóa thương hiệu thành công.");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Có lỗi xảy ra khi xóa thương hiệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDataSource = () => {
    const totalRows = pagination.pageSize;
    const dataLength = brands.length;
    const emptyRows = Math.max(totalRows - dataLength, 0);

    const emptyData = new Array(emptyRows).fill({}).map((_, index) => ({
      key: `empty-${index}`, // Thêm key duy nhất
    }));

    return [
      ...brands.map((brand, index) => ({ ...brand, key: brand.id || index })),
      ...emptyData,
    ];
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "5rem",
      render: (_, __, index) => (
        <div style={{ height: "2rem" }}>
          {index + 1 + (pagination.current - 1) * pagination.pageSize}
        </div>
      ),
    },
    {
      title: "Tên Hãng",
      dataIndex: "brandName",
      key: "brandName",
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
        // Nếu status là chuỗi, tiến hành hiển thị với màu sắc tương ứng
        let color = status === "HOAT_DONG" ? "green" : "volcano"; // Kiểm tra giá trị của status
        if (!status) {
          return null; // Không hiển thị gì khi status không có giá trị
        }
        return (
          <Tag color={color} style={{ fontSize: "14px", padding: "6px 12px" }}>
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
        // Kiểm tra nếu status là null hoặc record không có dữ liệu
        if (!record.status || Object.keys(record).length === 0) {
          return null; // Không hiển thị nút khi status là null hoặc không có dữ liệu
        }
        return (
          <>
            <Row gutter={[16, 16]}>
              <Col>
                <Button
                
                >
                  <RxUpdate size={20} color="primary" />
                </Button>
              </Col>

              <Col>
                <Button className={`${styles.buttonDelete} ant-btn`}>
                  <FaRegTrashCan size={20} color="#FF4D4F" />
                </Button>
              </Col>
            </Row>
          </>
        ); // Hiển thị nút "Sửa" nếu có dữ liệu và trạng thái hợp lệ
      },
    },
  ];

  const showModalCreate = () => setOpenCreate(true);
  const showModalUpadet = () => setOpenUpdate(true);

  const handleCreate = () => {
    setLoading(true);
    handleCreateBrand(request);
    setTimeout(() => {
      setLoading(false);
      setOpenCrea(false);
    }, 800);
  };

  const handleCancelCreate = () => setOpenCreate(false);
  const handleCancelUpadte = () => setOpenUpdate(false);

  return (
    <Card>
      <Title level={2}>Hãng</Title>
      <div className={"d-flex justify-content-center gap-4 flex-column"}>
        <Row gutter={[16, 16]}>
          <Col span={20}>
            <Input
              placeholder="Nhập vào tên hãng bạn muốn tìm!"
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>

          <Col span={4}>
            <Button type="primary" icon={<SearchOutlined />} block>
              Tìm kiếm
            </Button>
          </Col>
        </Row>

        <Row style={{ marginTop: 20 }}>
          <Button type="primary" onClick={showModalCreate}>
            Thêm Hãng
          </Button>
          <Modal
            open={openCreate}
            title="Thêm Hãng"
            onOk={handleCreate}
            onCancel={handleCancelCreate}
            footer={[
              <Button key="back" onClick={handleCancelCreate}>
                Hủy
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleCreate}
              >
                Xác nhận
              </Button>,
            ]}
          >
            <p>Nhập thông tin hãng mới...</p>

            <Form>
              <Input
                placeholder="Nhập tên hãng vào đây!"
                style={{ marginBottom: "1rem" }}
                value={request.brand} // Bind to 'brand' in state
                name="brandName" // Ensure 'name' matches the key in the state
                onChange={handleRequest} // Update state when input changes
                allowClear
              />

              <Radio.Group
                onChange={handleRequest} // Handle the status change
                value={request.status} // Bind to 'status' in state
                name="status" // Ensure 'name' matches the key in the state
               
              >
               <Row gutter={[1,1]}>

                <Col>
                <Radio.Button value="HOAT_DONG" className={clsx(request.status === "HOAT_DONG" ? styles.statushd:"", styles.statushdhv )}>HOẠT ĐỘNG</Radio.Button>
                
                </Col>

                <Col>
                <Radio.Button value="NGUNG_HOAT_DONG" className={clsx(request.status === "NGUNG_HOAT_DONG" ? styles.statusnhd:"", styles.statusnhdhv )}>
                  NGỪNG HOẠT ĐỘNG
                </Radio.Button>
                </Col>
               </Row>
              </Radio.Group>
            </Form>
          </Modal>
        </Row>

        <Table
          columns={columns}
          dataSource={handleDataSource()} // Dữ liệu đã xử lý với dòng trống
          loading={loading}
          pagination={false} // Bỏ pagination trong Table
          locale={{
            emptyText: (
              <div style={{ textAlign: "center" }}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    width: "50px",
                    height: "50px",
                    marginBottom: "10px",
                  }}
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                <p>No data</p>
              </div>
            ),
          }}
        />

        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={totalBrands}
          showSizeChanger
          pageSizeOptions={["3", "5", "10", "20"]}
          onShowSizeChange={(current, pageSize) => {
            setPagination({
              current: 1, // Quay lại trang 1 khi thay đổi số lượng phần tử mỗi trang
              pageSize,
            });
            fetchBrands(); // Gọi lại API để cập nhật dữ liệu phù hợp
          }}
          onChange={(page, pageSize) => {
            setPagination({ current: page, pageSize });
            fetchBrands(); // Gọi lại API để cập nhật dữ liệu phù hợp
          }}
        />
      </div>
    </Card>
  );
};

export default Category;
