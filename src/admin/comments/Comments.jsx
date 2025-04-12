import { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Select,
  DatePicker,
  Input,
  Modal,
  Form,
  Row,
  Col,
  Checkbox,
  Collapse,
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

  const groupCommentsByProduct = (comments) => {
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

  const applyFilters = () => {
    // Lấy lại dữ liệu gốc từ comments và áp dụng bộ lọc
    let filteredComments = [...comments];

    // Lọc theo sao
    if (starFilter !== null) {
      filteredComments = filteredComments.filter((c) => c.rate === starFilter);
    }

    // Lọc theo trạng thái chưa trả lời
    if (notRepliedOnly) {
      filteredComments = filteredComments.filter((c) => !c.adminReply);
    }

    // Nhóm lại dữ liệu sau khi lọc
    const filteredGroups = groupCommentsByProduct(filteredComments);
    setGroupedComments(filteredGroups);
  };

  useEffect(() => {
    fetchComments();
    const client = connectWebSocket(
      () => fetchComments(),
      (data) => console.log("WebSocket message:", data)
    );
    setStompClient(client);
    return () => client?.deactivate();
  }, []);

  useEffect(() => applyFilters(), [starFilter, notRepliedOnly, comments]);

  const fetchComments = async () => {
    try {
      const commentsData = await fetchAllComments();
      if (!Array.isArray(commentsData)) {
        toast.error("Dữ liệu API không đúng định dạng!");
        return;
      }
      const formattedData = commentsData.map((item) => ({
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
    } catch (error) {
      toast.error(`Không thể tải dữ liệu: ${error.message}`);
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
      fetchComments();
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
    { title: "STT", align: "center", width: 50, render: (_, __, i) => i + 1 },
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
      //   width: 200,
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
      //   width: 200,
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
          <Button
            type="primary"
            danger
            onClick={() => handleDeleteComment(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

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

  return (
    <div>
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
          {/* <Col xs={24} sm={12} md={6}>
            <DatePicker
              placeholder="Từ ngày"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
            />
          </Col> */}
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
              pagination={false}
            />
          </Panel>
        ))}
      </Collapse>

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
            <TextArea
              onPressEnter={handleSubmitReply}
              rows={4}
              placeholder="Nhập nội dung phản hồi..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Comments;
