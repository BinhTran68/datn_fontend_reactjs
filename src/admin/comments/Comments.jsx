import { useState, useEffect } from "react";
import {
  Table, Tag, Button, Space, Select, DatePicker, Input, Modal, Form, Row, Col, Checkbox, Collapse, Pagination,
} from "antd";
import { CommentOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  fetchAllComments,
  submitReply,
  deleteComment,
  connectWebSocket,
  publishWebSocketMessage,
} from "./commentService";

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [groupedComments, setGroupedComments] = useState({});
  const [expandedProducts, setExpandedProducts] = useState([]);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [replyForm] = Form.useForm();
  const [stompClient, setStompClient] = useState(null);
  const [starFilter, setStarFilter] = useState(null);
  const [notRepliedOnly, setNotRepliedOnly] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [productPagination, setProductPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [productOptions, setProductOptions] = useState([]);
  const [productFilter, setProductFilter] = useState(null);
  const [globalPagination, setGlobalPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [currentPage1, setCurrentPage1] = useState(1); // State lưu trang hiện tại


  const handleProductTableChange = (productId, pagination) => {
    setProductPagination(prev => ({
      ...prev,
      [productId]: pagination
    }));
  };

  const groupCommentsByProduct = (comments, productPagination = {}) => {
    const grouped = {};
    comments.forEach((comment) => {
      if (!grouped[comment.productId]) {
        grouped[comment.productId] = {
          productId: comment.productId,
          productName: comment.productName,
          comments: [],
          totalComments: 0,
          averageRating: 0,
          unrepliedCount: 0,
        };
      }
      grouped[comment.productId].comments.push(comment);
      grouped[comment.productId].totalComments++;
      if (!comment.adminReply) grouped[comment.productId].unrepliedCount++;
    });

    Object.keys(grouped).forEach((productId) => {
      const product = grouped[productId];
      product.averageRating =
        product.comments.reduce((sum, c) => sum + c.rate, 0) /
        product.totalComments;
    });

    return grouped;
  };

  const fetchProductNames = async (keyword = "") => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/comments/productName?keyword=${encodeURIComponent(keyword)}`
      );
      const result = await response.json();
      if (Array.isArray(result.data)) {
        setProductOptions(result.data);
      } else {
        toast.error("Dữ liệu tên sản phẩm không đúng định dạng");
      }
    } catch (err) {
      toast.error("Không thể tải danh sách sản phẩm");
    }
  };
  
  const applyFilters = () => {
    let filteredComments = [...comments];

    if (starFilter !== null) {
      filteredComments = filteredComments.filter((c) => c.rate === starFilter);
    }
    if (productFilter) {
      filteredComments = filteredComments.filter((c) =>
        c.productName?.toLowerCase().includes(productFilter.toLowerCase())
      );
    }
    
    if (notRepliedOnly) {
      filteredComments = filteredComments.filter((c) => !c.adminReply);
    }

    const filteredGroups = groupCommentsByProduct(filteredComments);
    
    // Phân trang cho danh sách sản phẩm
    const startIndex = (globalPagination.current - 1) * globalPagination.pageSize;
    const endIndex = startIndex + globalPagination.pageSize;
    const paginatedGroups = {};
    
    Object.keys(filteredGroups)
      .slice(startIndex, endIndex)
      .forEach(key => {
        paginatedGroups[key] = filteredGroups[key];
      });

    setGroupedComments(paginatedGroups);
    setGlobalPagination(prev => ({
      ...prev,
      total: Object.keys(filteredGroups).length
    }));
  };

  useEffect(() => {
    fetchComments(pagination.current - 1, pagination.pageSize);
  }, [pagination.current, pagination.pageSize, sortOrder]);
  
  useEffect(() => {
    fetchComments(pagination.current - 1, pagination.pageSize);
    const client = connectWebSocket(
      () => fetchComments(pagination.current - 1, pagination.pageSize),
      (data) => console.log("WebSocket message:", data)
    );
    setStompClient(client);
    return () => client?.deactivate();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [globalPagination.current, starFilter, notRepliedOnly, comments, productFilter]);

  const fetchComments = async (page = 0, pageSize = 10) => {
    setLoading(true);
    try {
      const result = await fetchAllComments(page, pageSize, sortOrder);
      if (!Array.isArray(result.content)) {
        toast.error("Dữ liệu API không đúng định dạng!");
        return;
      }
      const formattedData = result.content.map((item) => ({
        id: item.id,
        fullName: item.fullName || "Khách hàng ẩn danh",
        comment: item.comment || "Không có bình luận",
        productName: item.productName || "Không có sản phẩm",
        productId: item.productId,
        customerEmail: item.customerEmail || "Không có email",
        createdAt: item.createdAt || new Date().toISOString(),
        rate: item.rate || 0,
        adminReply:
          typeof item.adminReply === "string"
            ? item.adminReply
            : Array.isArray(item.adminReply) && item.adminReply.length > 0
              ? typeof item.adminReply[0] === "object"
                ? item.adminReply[0].comment
                : item.adminReply[0]
              : "",
      }));
      setComments(formattedData);
      setGroupedComments(groupCommentsByProduct(formattedData));
      setPagination({
        current: result.currentPage + 1,
        pageSize: result.pageSize,
        total: result.totalElements,
      });
    } catch (error) {
      toast.error(`Không thể tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (comment) => {
    setCurrentComment(comment);
    setReplyModalVisible(true);
    replyForm.resetFields();
  };

  const handleSubmitReply = async () => {
    try {
      const values = await replyForm.validateFields();
      await submitReply(currentComment.id, values.adminReply);
      publishWebSocketMessage(
        stompClient,
        `/topic/comments/${currentComment.productId}`,
        {
          parentId: currentComment.id,
          comment: values.adminReply,
          timestamp: new Date().toISOString(),
        }
      );
      setReplyModalVisible(false);
      toast.success("Phản hồi đã được gửi!");
      fetchComments(pagination.current - 1, pagination.pageSize);
    } catch (error) {
      toast.error(error.message || "Không thể gửi phản hồi!");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      toast.success("Xóa bình luận thành công!");
      fetchComments();
    } catch (error) {
      toast.error(error.message || "Không thể xóa bình luận!");
    }
  };

  const convertToVietnamTime = (utcDate) => {
    return utcDate
      ? new Date(utcDate).toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
      })
      : "Không có dữ liệu";
  };

  const commentColumns = [
    { 
      title: "STT", 
      align: "center", 
      width: 50, 
      render: (_, __, index) => {
        const currentPage = productPagination[_.productId]?.current || 1;
        return (currentPage - 1) * 1 + index + 1;
      }
    },
    
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{ color: "#666", fontSize: "12px" }}>
            {record.customerEmail}
          </div>
        </div>
      ),
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      ellipsis: true,
      render: (text) => <span style={{ whiteSpace: "normal" }}>{text}</span>,
    },
    {
      title: "Ngày bình luận",
      dataIndex: "createdAt",
      width: 130,
      render: convertToVietnamTime,
    },
    {
      title: "Đánh giá",
      dataIndex: "rate",
      align: "center",
      width: 100,
      render: (rate) => <Tag color="gold">{rate} ⭐</Tag>,
    },
    {
      title: "Phản hồi",
      dataIndex: "adminReply",
      ellipsis: true,
      render: (adminReply) =>
        adminReply && adminReply.trim() ? (
          <span style={{ color: "orange", whiteSpace: "normal" }}>
            {adminReply}
          </span>
        ) : (
          <Tag color="blue">Chưa trả lời</Tag>
        ),
    },
    {
      title: "Hành động",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            icon={<CommentOutlined />}
            onClick={() => handleReply(record)}
          />
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter && sorter.field === "createdAt") {
      const order = sorter.order === "descend" ? "desc" : "asc";
      setSortOrder(order);
    }
    fetchComments(pagination.current - 1, pagination.pageSize);
  };

  const renderStars = (count) =>
    Array(count)
      .fill()
      .map((_, i) => (
        <span key={i} style={{ color: "gold" }}>
          ⭐
        </span>
      ));

  const starCounts = [0, 0, 0, 0, 0];
  comments.forEach(
    (c) => c.rate >= 1 && c.rate <= 5 && starCounts[c.rate - 1]++
  );

  const handleGlobalPageChange = (page) => {
    setGlobalPagination(prev => ({ 
      ...prev, 
      current: page 
    }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          marginBottom: 16,
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo đánh giá"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) =>
                setStarFilter(value === "all" ? null : parseInt(value))
              }
              defaultValue="all"
            >
              <Option value="all">Tất cả ({comments.length})</Option>
              {[5, 4, 3, 2, 1].map((r) => (
                <Option key={r} value={r}>
                  {renderStars(r)} ({starCounts[r - 1]})
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              showSearch
              placeholder="Lọc theo tên sản phẩm"
              allowClear
              style={{ width: "100%" }}
              onSearch={fetchProductNames}
              onFocus={() => fetchProductNames()}
              onChange={(value) => setProductFilter(value || null)}
              filterOption={false}
            >
              {productOptions.map(option => (
                <option key={option.productName} value={option.productName}>
                  {option.productName}
                </option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Sắp xếp theo ngày"
              style={{ width: "100%" }}
              value={sortOrder}
              onChange={(value) => setSortOrder(value)}
            >
              <Option value="desc">Mới nhất trước</Option>
              <Option value="asc">Cũ nhất trước</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Checkbox
              checked={notRepliedOnly}
              onChange={(e) => setNotRepliedOnly(e.target.checked)}
            >
              Chưa trả lời
            </Checkbox>
          </Col>
        </Row>
      </div>

      {Object.keys(groupedComments).length > 0 ? (
        <>
          <Collapse
            activeKey={expandedProducts}
            onChange={setExpandedProducts}
            expandIcon={({ isActive }) =>
              isActive ? <UpOutlined /> : <DownOutlined />
            }
            style={{
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            {Object.values(groupedComments).map((product) => (
              <Panel
                key={product.productId}
                header={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <strong>{product.productName}</strong> (
                      {product.totalComments} bình luận)
                    </span>
                    <span>
                      <Tag color="gold">{product.averageRating.toFixed(1)} ⭐</Tag>
                      {product.unrepliedCount > 0 && (
                        <Tag color="blue">
                          {product.unrepliedCount} chưa trả lời
                        </Tag>
                      )}
                    </span>
                  </div>
                }
              >
                <Table
                  dataSource={product.comments}
                  columns={commentColumns}
                  rowKey="id"
                  pagination={{
                    ...productPagination[product.productId],
                    pageSize: 5,
                    showSizeChanger: false,
                    showQuickJumper: true,
                    locale: {
                      jump_to: 'Đến trang',
                      page: ''
                    },
                    showTotal: false,
                    position: ['bottomCenter']
                  }}
                  loading={loading}
                  onChange={(pagination) => handleProductTableChange(product.productId, pagination)}
                />
              </Panel>
            ))}
          </Collapse>

          <div style={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            marginTop: "16px",
            display: "flex",
            justifyContent: "center"
          }}>
            <Pagination
              current={globalPagination.current}
              pageSize={globalPagination.pageSize}
              total={globalPagination.total}
              onChange={handleGlobalPageChange}
              showSizeChanger={false}
              showQuickJumper={true}
              locale={{
                jump_to: 'Đến trang',
                page: ''
              }}
            />
          </div>
        </>
      ) : (
        <div style={{
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <p>{loading ? "Đang tải..." : "Không có dữ liệu bình luận"}</p>
        </div>
      )}

      <Modal
        title={`Trả lời bình luận của: ${currentComment?.fullName}`}
        open={replyModalVisible}
        onOk={handleSubmitReply}
        onCancel={() => setReplyModalVisible(false)}
      >
        {currentComment && (
          <div style={{ marginBottom: 16 }}>
            <p>
              <strong>Email:</strong> {currentComment.customerEmail}
            </p>
            <p>
              <strong>Bình luận:</strong> {currentComment.comment}
            </p>
            <p>
              <strong>Đánh giá:</strong> {currentComment.rate} ⭐
            </p>
            {currentComment.adminReply && (
              <p>
                <strong>Phản hồi hiện tại:</strong> {currentComment.adminReply}
              </p>
            )}
          </div>
        )}
        <Form form={replyForm}>
          <Form.Item
            name="adminReply"
            label="Phản hồi"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <TextArea rows={4} placeholder="Nhập nội dung phản hồi..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Comments;
