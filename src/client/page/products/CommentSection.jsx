import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { Input, Button, List, Card, Space, Typography, Avatar, Col, Row, message, Select } from "antd";
import { Rate } from "antd";
import { EditOutlined, FilterOutlined } from "@ant-design/icons";
import {toast} from "react-toastify";


const { Title } = Typography;
const { Option } = Select;

const CommentSection = ({ id }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [productId, setProductId] = useState(id);
  const [customerId, setCustomerId] = useState(user?.id);
  const [comment, setComment] = useState("");
  const stompClient = useRef(null);
  const commentsRef = useRef(null);
  const [hasCommented, setHasCommented] = useState(false);
  const [rate, setRate] = useState(5);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRate, setEditRate] = useState(5);
  const [starFilter, setStarFilter] = useState(0); // 0 means show all comments
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setProductId(id);
  }, [id]);

  useEffect(() => {
    fetchComments(); // fetch dữ liệu mỗi khi id sản phẩm thay đổi
    connectWebSocket(); // cũng kết nối WebSocket cho đúng sản phẩm
    return () => {
      if (stompClient.current) stompClient.current.deactivate();
    };
  }, [productId]);


  useEffect(() => {
    // Filter comments when starFilter or comments change
    if (starFilter === 0) {
      setFilteredComments(comments);
    } else {
      setFilteredComments(comments.filter(comment => comment.rate === starFilter));
    }
  }, [starFilter, comments]);

  const fetchComments = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/comments/all");
      if (!response.ok) throw new Error(`Lỗi: ${response.status}`);

      const result = await response.json();
      const commentsData = result?.data || result || [];

      if (!Array.isArray(commentsData)) {
        console.error("API không trả về danh sách bình luận:", commentsData);
        toast.error("Dữ liệu API không đúng định dạng!");
        return;
      }

      const formattedData = commentsData
        .map((item, index) => ({
          id: item.id || index + 1,
          fullName: item.fullName || "Khách hàng ẩn danh",
          comment: item.comment || "Không có bình luận",
          productId: item.productId || null,
          customerEmail: item.customerEmail || "Không có tài khoản",
          createdAt: item.createdAt || new Date().toISOString(),
          rate: item.rate || 5,
          adminReply: item.adminReply || "",
          replies: item.replies || []
        }))
        .filter(item => item.productId === productId); // 🧠 lọc theo sản phẩm

      setComments(formattedData);
      setFilteredComments(formattedData);


      setComments(formattedData);
      setFilteredComments(formattedData);

      // Kiểm tra nếu user hiện tại đã bình luận sản phẩm này
      if (customerId) {
        const hasCommented = formattedData.some(comment => comment.customerEmail === user?.email);
        setHasCommented(hasCommented);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu bình luận:", error);
      toast.error(`Không thể tải dữ liệu: ${error.message}`);
    }
  };

  const connectWebSocket = () => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to the comments topic
        client.subscribe(`/topic/comments/${productId}`, (message) => {
          const updatedComment = JSON.parse(toast.body);
          console.log("Received updated comment:", updatedComment);  // Debug to check the data

          setComments((prevComments) =>
            prevComments.map((c) =>
              c.id === updatedComment.id ? { ...c, comment: updatedComment.comment, rate: updatedComment.rate } : c
            )
          );
        });

        // Subscribe to admin replies - FIXED IMPLEMENTATION
        // In CommentSection.js - modify the WebSocket connection:
        client.subscribe(`/topic/comments`, (message) => {
          try {
            const data = JSON.parse(toast.body);

            // Kiểm tra nếu đây là một cập nhật từ admin
            if (data.parentId && data.comment) {
              setComments((prevComments) =>
                prevComments.map((comment) =>
                  comment.id === data.parentId
                    ? { ...comment, adminReply: data.comment }
                    : comment
                )
              );
            }

            // Xử lý xóa bình luận nếu có
            if (data.action === "delete" && data.commentId) {
              setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== data.commentId)
              );
            }
          } catch (error) {
            console.error("Lỗi khi xử lý WebSocket message:", error);
          }
        });

        // Additional subscription specifically for admin replies - to handle different message formats
        client.subscribe(`/topic/admin-replies/${productId}`, (message) => {
          try {
            const replyData = JSON.parse(toast.body);
            console.log("Received from admin-replies topic:", replyData);

            // Check for different possible structures
            if ((replyData.parentId || replyData.commentId) && replyData.productId === productId) {
              const commentId = replyData.parentId || replyData.commentId;
              const replyContent = replyData.comment || replyData.content || replyData.text || replyData.reply || "";

              setComments((prevComments) =>
                prevComments.map((comment) =>
                  comment.id === commentId
                    ? { ...comment, adminReply: replyContent }
                    : comment
                )
              );
            }
          } catch (error) {
            console.error("Lỗi khi xử lý phản hồi admin từ topic chuyên dụng:", error);
          }
        });

        client.subscribe(`/topic/new-comments/${productId}`, (message) => {
          try {
            const newComment = JSON.parse(toast.body);
            console.log("Received new comment:", newComment);

            // Gửi thông báo về admin ngay lập tức
            stompClient.current.publish({
              destination: `/app/admin/new-comment/${productId}`,
              body: JSON.stringify(newComment),
            });

            if (isSubmitting) {
              toast.success("Bình luận đã được gửi thành công!");
              setIsSubmitting(false);

              // Thêm bình luận mới vào danh sách
              // Trong `/topic/new-comments/${productId}`
              if (newComment.productId === productId) {
                const commentToAdd = {
                  id: newComment.id || Date.now(),
                  fullName: user?.fullName || "Khách hàng ẩn danh",
                  comment: newComment.comment,
                  productId: productId,
                  customerEmail: user?.email || "anonymous@example.com",
                  createdAt: newComment.createdAt || new Date().toISOString(),
                  rate: newComment.rate,
                  adminReply: "",
                  replies: [],
                };

                setComments(prev => [...prev, commentToAdd]);
                setHasCommented(true);
              }


              setComments(prevComments => [...prevComments, commentToAdd]);
              setHasCommented(true);
            }
          } catch (error) {
            console.error("Lỗi khi xử lý bình luận mới:", error);
          }
        });

      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        toast.error("Có lỗi kết nối với máy chủ bình luận!");
        if (isSubmitting) {
          setIsSubmitting(false);
        }
      }
    });

    client.activate();
    stompClient.current = client;
  };

  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [filteredComments]);

  const sendComment = () => {
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận!");
      return;
    }

    if (stompClient.current && stompClient.current.connected) {
      // Lưu trữ các giá trị hiện tại trước khi reset
      const commentText = comment;
      const rateValue = rate;
      const newCommentId = Date.now(); // Tạo ID tạm thời

      // Reset form ngay lập tức để tạo cảm giác phản hồi nhanh
      setComment("");
      setRate(5);
      setIsSubmitting(true);

      // Thêm comment mới vào state ngay lập tức để hiển thị
      const optimisticComment = {
        id: newCommentId,
        fullName: user?.fullName || "Khách hàng ẩn danh",
        comment: commentText,
        productId: productId,
        customerEmail: user?.email || "anonymous@example.com",
        createdAt: new Date().toISOString(),
        rate: rateValue,
        adminReply: "", // Initialize with empty admin reply
        replies: [],
        isPending: true // Đánh dấu là đang chờ xác nhận từ server
      };

      setComments(prevComments => [...prevComments, optimisticComment]);
      setHasCommented(true);

      const commentMessage = {
        customerId,
        comment: commentText,
        rate: rateValue,
        createdAt: new Date().toISOString(),
      };

      try {
        stompClient.current.publish({
          destination: `/app/comment/${productId}`,
          body: JSON.stringify(commentMessage),
        });

        // Giảm timeout xuống và thêm logic cập nhật comment
        setTimeout(() => {
          if (isSubmitting) {
            setIsSubmitting(false);
            toast.success("Bình luận đã được gửi thành công!");

            // Cập nhật trạng thái isPending nếu không nhận được phản hồi từ server
            setComments(prevComments =>
              prevComments.map(c =>
                c.id === newCommentId ? { ...c, isPending: false } : c
              )
            );
          }
        }, 2000); // Giảm từ 5000ms xuống 2000ms
      } catch (error) {
        console.error("Lỗi khi gửi bình luận:", error);

        // Xóa comment optimistic nếu gặp lỗi
        setComments(prevComments => prevComments.filter(c => c.id !== newCommentId));
        setHasCommented(false);

        toast.error("Không thể gửi bình luận: " + error.message);
        setIsSubmitting(false);
      }
    } else {
      console.warn("Không thể gửi bình luận: STOMP client chưa kết nối");
      toast.error("Không thể kết nối đến máy chủ bình luận. Vui lòng thử lại sau.");
    }
  };

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString("vi-VN");
    } catch (error) {
      return timeString;
    }
  };

  const averageRate = comments.length > 0
    ? (comments.reduce((sum, c) => sum + c.rate, 0) / comments.length).toFixed(1)
    : "0";

  const totalReviews = comments.length;

  // Tính số lượng bình luận theo từng mức đánh giá sao
  const starCounts = [0, 0, 0, 0, 0]; // [1 star, 2 stars, 3 stars, 4 stars, 5 stars]
  comments.forEach(comment => {
    if (comment.rate >= 1 && comment.rate <= 5) {
      starCounts[comment.rate - 1]++;
    }
  });

  const editComment = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.comment);
    setEditRate(comment.rate);
  };
  const saveEditedComment = () => {
    if (!editText.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận!");
      return;
    }

    if (stompClient.current && stompClient.current.connected) {
      const updatedComment = {
        customerId,
        comment: editText,
        rate: editRate,
        parentId: editingComment,
        updatedAt: null // Đảm bảo updatedAt là null

      };

      try {
        stompClient.current.publish({
          destination: `/app/comment/update/${productId}`, // Gửi thông báo tới server
          body: JSON.stringify(updatedComment),
        });

        // Cập nhật UI ngay sau khi gửi request
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === editingComment
              ? { ...comment, comment: editText, rate: editRate }
              : comment
          )
        );

        // Gửi thông báo cho admin ngay lập tức
        stompClient.current.publish({
          destination: `/app/admin/update/${productId}`, // Gửi thông báo cập nhật tới admin
          body: JSON.stringify({ commentId: editingComment, comment: editText, rate: editRate }),
        });

        setEditingComment(null);
        setEditText("");
        setEditRate(5);
        toast.success("Bình luận đã được cập nhật thành công!");
      } catch (error) {
        console.error("Lỗi khi gửi cập nhật:", error);
        toast.error("Không thể cập nhật bình luận: " + error.message);
      }
    } else {
      console.warn("Không thể gửi cập nhật: STOMP client chưa kết nối");
      toast.error("Kết nối WebSocket không ổn định!");
    }
  };


  const handleFilterChange = (value) => {
    setStarFilter(Number(value));
  };

  // Tạo biểu tượng sao cho các tùy chọn trong combobox
  const renderStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(<span key={i} style={{ color: 'gold' }}>⭐</span>);
    }
    return stars;
  };

  // Admin reply component - Enhanced to handle empty/falsy values better
  const AdminReply = ({ reply }) => {
    // Extra validation to ensure we don't render empty replies
    if (!reply || reply === "" || reply === "undefined" || reply === "null") return null;

    return (
      <div
        style={{
          backgroundColor: '#e6f7ff',
          padding: '10px 15px',
          borderRadius: '8px',
          marginTop: '10px',
          marginBottom: '10px'
        }}
      >
        <Row>
          <Col span={1}>
            <Avatar style={{ backgroundColor: '#fa8c16' }}>A</Avatar>
          </Col>
          <Col span={23}>
            <div>
              {/* <span style={{ color: "#888", marginLeft: "10px" }}> Khách hàng đã chỉnh sửa bình luận của họ lúc:{formatTime(new Date().toISOString())}</span> */}

              <strong style={{ color: 'black' }}>Trả lời từ người bán</strong>
            </div>
            <div style={{ marginTop: '5px', color: 'black' }}>{reply}</div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", margin: "0 auto" }}>
      <Card style={{ marginTop: "20px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Space direction="horizontal">
                <Title level={4}>Đánh giá trung bình: {averageRate}/5⭐</Title>
                <span style={{color:'black'}}>({totalReviews} đánh giá)</span>
              </Space>
            </Col>
            <Col>
              <Space>
                <FilterOutlined />
                <span style={{color:'black'}}>Lọc theo: </span>
                <Select
                  defaultValue="0"
                  style={{ width: 160 }}
                  onChange={handleFilterChange}
                  dropdownMatchSelectWidth={false}
                >
                  <Option value="0">Tất cả ({totalReviews})</Option>
                  <Option value="5">
                    {renderStars(5)} ({starCounts[4]})
                  </Option>
                  <Option value="4">
                    {renderStars(4)} ({starCounts[3]})
                  </Option>
                  <Option value="3">
                    {renderStars(3)} ({starCounts[2]})
                  </Option>
                  <Option value="2">
                    {renderStars(2)} ({starCounts[1]})
                  </Option>
                  <Option value="1">
                    {renderStars(1)} ({starCounts[0]})
                  </Option>
                </Select>
              </Space>
            </Col>
          </Row>

          <div ref={commentsRef} style={{ maxHeight: "300px", overflowY: "auto", padding: "10px" }}>
            <List
              dataSource={filteredComments}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Row>
                        <Col span={1}><Avatar src={user?.avatar || 'https://via.placeholder.com/40'} /></Col>
                        <Col span={23}>
                          <strong>{item.fullName}</strong>
                          <span style={{ color: "black" }}> ({formatTime(item.createdAt)})</span>
                          <span style={{ color: "gold", marginLeft: "10px" }}>
                            {renderStars(item.rate)}
                          </span>
                        </Col>
                      </Row>
                    }
                    description={
                      <>
                        {editingComment === item.id ? (
                          <Space direction="vertical" style={{ width: "100%", marginTop: "10px" }}>
                            <Rate value={editRate} onChange={setEditRate} />
                            <Input.TextArea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              maxLength={500}
                              rows={4}
                            />
                            <Space>
                              <Button type="primary" onClick={saveEditedComment}>Lưu</Button>
                              <Button onClick={() => setEditingComment(null)}>Hủy</Button>
                            </Space>
                          </Space>
                        ) : (
                          <>
                            <p style={{color:'black'}}>{item.comment}</p>
                            {/* Display admin reply with enhanced component */}
                            <AdminReply reply={item.adminReply} />
                          </>
                        )}
                      </>
                    }
                  />
                  {item.customerEmail === user?.email && (
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => editComment(item)}
                      style={{ float: "right",color:'orange', marginBottom: "130px" }}
                    />
                  )}
                </List.Item>
              )}
              locale={{ emptyText: starFilter === 0 ? "Chưa có đánh giá nào" : `Không có đánh giá ${starFilter} sao nào` }}
            />

            {user?.id && !hasCommented && (
              <Space direction="vertical" style={{ width: "100%", marginTop: "20px" }}>
                <Rate value={rate} onChange={setRate} />
                <Input.TextArea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập bình luận..."
                  maxLength={500}
                  rows={3}
                  style={{ minWidth: "400px" }}
                />
                <Button
                  type="primary"
                  onClick={sendComment}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Bình luận"}
                </Button>
              </Space>
            )}

            {hasCommented && <p style={{ color: "red", marginTop: "10px" }}>Bạn đã bình luận sản phẩm này!</p>}
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default CommentSection;
