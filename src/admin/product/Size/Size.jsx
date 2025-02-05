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
import styles from "./Size.module.css";
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
  fetchSizes,
  createSize,
  updateSize,
  deleteSize,
  getSize,
  searchNameSize,
  existsBySizeName,
} from "./ApiSize.js";
import { FaRegTrashCan } from "react-icons/fa6";
import { RxUpdate } from "react-icons/rx";
import clsx from "clsx";
import { debounce } from "lodash";
import { FaEdit } from "react-icons/fa";
import { COLORS } from "../../../constants/constants..js";

const Size = () => {
  const { Title } = Typography;
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isActiveUpdate, setIsActiveUpdate] = useState(true);
  const [sizes, setSizes] = useState([]);
  const [totalSizes, setTotalSizes] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [requestSearch, setRequestSearch] = useState({
    name: "",
  });

  const [request, setRequest] = useState({
    sizeName: "",
    status: "HOAT_DONG",
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5, // Số dòng hiển thị mỗi trang
  });
  const error = useRef(null);
  const errorUpdate = useRef(null);

  const handleRequest = async (e) => {
    const { name, value } = e.target;
    setRequest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // validate cho create
  const [errorMessage, setErrorMessage] = useState("");

  useLayoutEffect(() => {
    if (!/^[\p{L}\p{N}\s]{1,20}$/u.test(request.sizeName)) {
      setErrorMessage(
        "Tên Kích cỡlà chữ, số tối đa 20 ký tự, và không chứa ký tự đặc biệt"
      );
      setIsActive(false);
    } else if (request.sizeName.trim() === "") {
      setErrorMessage("Không được để trống");
      setIsActive(false);
    } else {
      setErrorMessage("Hợp lệ !!!");
      setIsActive(true);
    }
  }, [request.sizeName]);

  const [errorMessageUpdate, setErrorMessageUpdate] = useState("");

  useLayoutEffect(() => {
    if (!/^[\p{L}\p{N}\s]{1,20}$/u.test(request.sizeName)) {
      setErrorMessageUpdate(
        "Tên Kích cỡlà chữ, số tối đa 20 ký tự, và không chứa ký tự đặc biệt"
      );
      setIsActiveUpdate(false);
    } else if (request.sizeName.trim() === "") {
      setErrorMessageUpdate("Không được để trống");
      setIsActiveUpdate(false);
    } else {
      setErrorMessageUpdate("Hợp lệ !!!");
      setIsActiveUpdate(true);
    }
  }, [request.sizeName]);
  // Hàm fetch dữ liệu sizes
  useEffect(() => {
    fetchSizesData();
  }, [pagination]);

  const fetchSizesData = async () => {
    setLoading(true);
    try {
      const { data, total } = requestSearch.name.trim()
        ? await searchNameSize(pagination, requestSearch)
        : await fetchSizes(pagination);
      setSizes(data);
      setTotalSizes(total);
      console.log(requestSearch.name + "đây là search");
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const searchName = async () => {
    setLoading(true);
    setPagination((prev) => ({ ...prev, current: 1 }));
    try {
      const { data, total } = await searchNameSize(pagination, requestSearch);
      setSizes(data);
      setTotalSizes(total);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };
  // thêm
  const handleCreateSize = async (sizeData) => {
    try {
      setLoading(true);
      console.log(request);
      await createSize(sizeData);

      setRequestSearch({ name: "" });
      setPagination({ current: 1, pageSize: pagination.pageSize });

      fetchSizesData(); // Refresh data after creation
      message.success("Thương hiệu đã được tạo thành công!");
    } catch (error) {
      console.error(error);
      //   message.error(error.message || "Có lỗi xảy ra khi tạo thương hiệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSize = useCallback(async (sizeData) => {
    try {
      setLoading(true);

      await updateSize(selectedSize.data.id, sizeData);
      console.log(selectedSize.data.id);
      setSelectedSize(null);
      setOpenUpdate(false);
      message.success("Cập nhật Kích cỡthành công");
      fetchSizesData(); // Refresh data after update
    } catch (error) {
      console.error(error);
      message.error(error.message || "Có lỗi xảy ra khi cập nhật thương hiệu.");
    } finally {
      setLoading(false);
    }
  });

  // xóa
  const handleDeleteSize = useCallback(async (sizeId) => {
    try {
      setLoading(true);
      await deleteSize(sizeId);
      fetchSizesData(); // Refresh data after deletion
      message.success("Xóa thương hiệu thành công.");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Có lỗi xảy ra khi xóa thương hiệu.");
    } finally {
      setLoading(false);
    }
  });
  const handleGetSize = useCallback(
    async (sizeId) => {
      setLoading(true);
      try {
        const sizeData = await getSize(sizeId);
        setSelectedSize(sizeData);
        console.log(sizeData);

        setRequest({
          sizeName: sizeData.data.sizeName,
          status: sizeData.data.status,
        }); // Cập nhật form với thông tin từ API

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

  const handleDataSource = () => {
    const totalRows = pagination.pageSize;
    const dataLength = sizes.length;
    const emptyRows = Math.max(totalRows - dataLength, 0);

    const emptyData = new Array(emptyRows).fill({}).map((_, index) => ({
      key: `empty-${index}`, // Thêm key duy nhất
    }));

    return [
      ...sizes.map((size, index) => ({ ...size, key: size.id || index })),
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
      title: "Tên Size",
      dataIndex: "sizeName",
      key: "sizeName",
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
      render: (_, record) => {
        if (!record.id || Object.keys(record).length === 0) {
          return null;
        }
        return (
          <>
            <Row gutter={[16, 16]}>
              <Col>
                <Button
                  icon={
                    <FaEdit
                      style={{
                        color: "green",
                        marginRight: 8,
                        fontSize: "1.5rem",
                      }}
                    />
                  }
                  onClick={() => handleGetSize(record.id)}
                >
                  Cập nhật
                </Button>
              </Col>

              <Col>
                <Popconfirm
                  title="Xóa Hãng"
                  description="Bạn có muốn xóa Kích cỡnày kh"
                  okText="Xác nhận"
                  cancelText="Hủy"
                  onConfirm={() => handleDeleteSize(record.id)}
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

  const handleCreate = () => {
    setLoading(true);
    handleCreateSize(request);

    setTimeout(() => {
      setLoading(false);
      setOpenCreate(false);
      setRequest({
        sizeName: "",
        status: "HOAT_DONG",
      });
    }, 800);
  };
  const handleUpdate = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOpenUpdate(false);
    }, 800);
  };

  return (
    <Card>
      <Title level={2}>Kích cỡ</Title>
      <div className={"d-flex justify-content-center gap-4 flex-column"}>
        <Row gutter={[16, 16]}>
          <Col span={20}>
            <Input
              placeholder="Nhập vào tên Kích cỡbạn muốn tìm!"
              prefix={<SearchOutlined />}
              allowClear
              name="name"
              value={requestSearch.name}
              onChange={(e) => {
                setRequestSearch((prev) => ({
                  ...prev,
                  name: e.target.value, // Cập nhật giá trị nhập vào
                }));
              }}
            />
          </Col>

          <Col span={4}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={searchName}
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

        <Row style={{ marginTop: 20 }}>
          <Button
            type="primary"
            onClick={() => {
              setOpenCreate(true);
            }}
            style={{
              backgroundColor: `${COLORS.backgroundcolor}`,
              borderColor: "#4096FF",
              color: `${COLORS.color}`,
            }}
          >
            Thêm Kích cỡ
          </Button>
          <Modal
            open={openCreate}
            title="Thêm Kích cỡ"
            onOk={handleCreate}
            onCancel={() => {
              setOpenCreate(false);
            }}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  setOpenCreate(false);
                }}
              >
                Hủy
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleCreate}
                disabled={!isActive}
              >
                Xác nhận
              </Button>,
            ]}
          >
            <p>Nhập thông tin Kích cỡmới...</p>
            <Form>
              <Input
                placeholder="Nhập tên Kích cỡvào đây!"
                style={{ marginBottom: "0.3rem" }}
                value={request.sizeName}
                name="sizeName"
                onChange={handleRequest}
                allowClear
              />
              <div style={{ color: isActive ? "green" : "red" }}>
                {errorMessage}
              </div>
            </Form>
          </Modal>
          <Modal
            open={openUpdate}
            title="Sửa Hãng"
            onOk={handleUpdate}
            onCancel={() => {
              setOpenUpdate(false);
              setRequest({
                sizeName: "",
                status: "HOAT_DONG",
              });
            }}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  setOpenUpdate(false);
                }}
              >
                Hủy
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={() => handleUpdateSize(request)}
                disabled={!isActiveUpdate}
              >
                Xác nhận
              </Button>,
            ]}
          >
            <p>Nhập thông tin Muốn sửa...</p>

            <Form>
              <Input
                placeholder="Nhập tên Kích cỡvào đây!"
                style={{ marginBottom: "0.3rem" }}
                value={request.sizeName} // Bind to 'size' in state
                name="sizeName" // Ensure 'name' matches the key in the state
                onChange={handleRequest} // Update state when input changes
                allowClear
              />
              <div style={{ color: isActiveUpdate ? "green" : "red" }}>
                {errorMessageUpdate}
              </div>

              <Radio.Group
                onChange={handleRequest} // Handle the status change
                value={request.status} // Bind to 'status' in state
                name="status" // Ensure 'name' matches the key in the state
              >
                <Row gutter={[1, 1]}>
                  <Col>
                    <Radio.Button
                      value="HOAT_DONG"
                      className={clsx(
                        request.status === "HOAT_DONG" ? styles.statushd : "",
                        styles.statushdhv
                      )}
                    >
                      HOẠT ĐỘNG
                    </Radio.Button>
                  </Col>

                  <Col>
                    <Radio.Button
                      value="NGUNG_HOAT_DONG"
                      className={clsx(
                        request.status === "NGUNG_HOAT_DONG"
                          ? styles.statusnhd
                          : "",
                        styles.statusnhdhv
                      )}
                    >
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
                <p>No data</p>
              </div>
            ),
          }}
        />

        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={totalSizes}
          showSizeChanger
          pageSizeOptions={["3", "5", "10", "20"]}
          onShowSizeChange={(current, pageSize) => {
            setPagination({
              current: 1, // Quay lại trang 1 khi thay đổi số lượng phần tử mỗi trang
              pageSize,
            });
            fetchSizesData(); // Gọi lại API để cập nhật dữ liệu phù hợp
          }}
          onChange={(page, pageSize) => {
            setPagination({ current: page, pageSize });
            fetchSizesData(); // Gọi lại API để cập nhật dữ liệu phù hợp
          }}
        />
      </div>
    </Card>
  );
};

export default Size;
