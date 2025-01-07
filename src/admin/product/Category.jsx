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
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const Category = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { Title } = Typography;
  const [brands, setBrands] = useState([]);
  const [totalBrands, setTotalBrands] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5, // Số dòng hiển thị mỗi trang
  });

  // Hàm fetch dữ liệu brands
  const fetchBrands = useCallback(async () => {
    const token = localStorage.getItem("token");
    const { current, pageSize } = pagination;

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/brand", {
        params: { page: current, size: pageSize },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data, meta } = response.data;
      setBrands(data || []);
      setTotalBrands(meta?.totalElement || 0);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  useEffect(() => {
    fetchBrands(); // Fetch khi component mount hoặc khi pagination thay đổi
  }, [pagination]);

  const handleDataSource = () => {
    const totalRows = pagination.pageSize; // Tổng số dòng cần hiển thị
    const dataLength = brands.length; // Số dòng dữ liệu hiện tại
    const emptyRows = Math.max(totalRows - dataLength, 0); // Đảm bảo không âm

    // Thêm các dòng trống nếu dữ liệu ít hơn số dòng cần thiết
    const emptyData = new Array(emptyRows).fill({}); // Tạo các dòng trống
    return [...brands, ...emptyData]; // Kết hợp dữ liệu với các dòng trống
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
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => {
        // Kiểm tra nếu record không có dữ liệu
        const isEmptyRow = Object.keys(record).length === 0;
        return isEmptyRow ? null : <Button type="link">Sửa</Button>;
      },
    },
  ];

  const showModal = () => setOpen(true);

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 800);
  };

  const handleCancel = () => setOpen(false);

  return (
    <Card style={{ padding: "20px" }}>
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
          <Button type="primary" onClick={showModal}>
            Thêm Hãng
          </Button>
          <Modal
            open={open}
            title="Thêm Hãng"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Hủy
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleOk}
              >
                Xác nhận
              </Button>,
            ]}
          >
            <p>Nhập thông tin hãng mới...</p>
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
