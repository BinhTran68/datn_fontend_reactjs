import { useState, useEffect } from "react";
import { Table, Tag, Button, Space, message, Select, DatePicker, Input, Modal, Form, Row, Col, Checkbox } from "antd";
import { CommentOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import { Client } from "@stomp/stompjs";
import {toast} from "react-toastify";


const { Option } = Select;
const { TextArea } = Input;

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]);
    const [replyModalVisible, setReplyModalVisible] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [replyForm] = Form.useForm();
    const [stompClient, setStompClient] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [starFilter, setStarFilter] = useState(null);
    const [notRepliedOnly, setNotRepliedOnly] = useState(false);
    const [sortOrder, setSortOrder] = useState("descend"); // descend: mới nhất lên đầu (mặc định)
    const [productOptions, setProductOptions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    
    // Apply filters function
    const applyFilters = () => {
        let result = [...comments];
        
        // Filter by star rating if selected
        if (starFilter !== null) {
            result = result.filter(comment => comment.rate === starFilter);
        }
        
        // Filter by not replied if checkbox is checked
        if (notRepliedOnly) {
            result = result.filter(comment => {
                return !comment.adminReply || 
                       (typeof comment.adminReply === 'string' && comment.adminReply.trim() === '');
            });
        }
        
        setFilteredComments(result);
    };
    useEffect(() => {
        fetchProductList();
    }, []);
    const fetchProductList = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/admin/comments/productName");
            const response = await res.json();
            
            // Extract data array from response
            const data = response.data || [];
    
            if (Array.isArray(data)) {
                setProductOptions(data);
            } else {
                console.error("API không trả về mảng sản phẩm:", data);
            }
        } catch (err) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", err);
        }
    };
    
    const fetchFilteredComments = async (productName, createdAt) => {
        try {
            let query = "http://localhost:8080/api/admin/comments/search";
            const params = [];
    
            if (productName) {
                params.push(`productName=${encodeURIComponent(productName)}`);
            }
            if (createdAt) {
                params.push(`createdAt=${createdAt}`);
                        }
    
            if (params.length > 0) {
                query += `?${params.join("&")}`;
            }
    
            const res = await fetch(query);
            const result = await res.json();
            const data = result.data || result;
    
            const formattedData = data.map((item) => ({
                id: item.id,
                fullName: item.fullName || "Khách hàng ẩn danh",
                comment: item.comment || "Không có bình luận",
                productName: item.productName || "Không có sản phẩm",
                productId: item.productId,
                customerEmail: item.customerEmail || "Không có email",
                createdAt: item.createdAt || new Date().toISOString(),
                rate: item.rate || 0,
                adminReply: typeof item.adminReply === 'string' ? item.adminReply :
                    (Array.isArray(item.adminReply) && item.adminReply.length > 0 ?
                        (typeof item.adminReply[0] === 'object' ? item.adminReply[0].comment : item.adminReply[0])
                        : '')
            }));
    
            setComments(formattedData);
            setFilteredComments(formattedData);
        } catch (err) {
            console.error("Lỗi khi lọc bình luận:", err);
            toast.error("Không thể lọc bình luận.");
        }
    };
    useEffect(() => {
        const timestamp = selectedDate ? new Date(selectedDate).getTime() : null;
        fetchFilteredComments(selectedProduct, timestamp);
    }, [selectedProduct, selectedDate]);
    

    // Apply filters whenever filter criteria changes
    useEffect(() => {
        applyFilters();
    }, [starFilter, notRepliedOnly, comments]);

    const columns = [
        {
            title: "STT",
            align: "center",
            render: (_, record) => filteredComments.findIndex(item => item.id === record.id) + 1,
        },
        {
            title: "Bình luận",
            dataIndex: "comment",
        },
        {
            title: "Sản phẩm",
            dataIndex: "productName",
        },
        {
            title: "Ngày bình luận",
            dataIndex: "createdAt",
            render: text => convertToVietnamTime(text),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            sortOrder: sortOrder,
            columnTitle: (
                <span title={sortOrder === "ascend" 
                    ? "Sắp xếp: Cũ nhất → Mới nhất" 
                    : "Sắp xếp: Mới nhất → Cũ nhất"}>
                    Ngày bình luận
                </span>
            ),
            onHeaderCell: () => ({
                onClick: () => {
                    setSortOrder(prevSortOrder => prevSortOrder === "ascend" ? "descend" : "ascend");
                },
            }),
        },
        
        
        {
            title: "Đánh giá",
            dataIndex: "rate",
            render: (rate) => <Tag color="gold">{rate} ⭐</Tag>,
        },
        {
            title: "Phản hồi",
            dataIndex: "adminReply",
            render: (adminReply) => {
                // Kiểm tra nếu adminReply có giá trị và không rỗng
                if (adminReply && typeof adminReply === 'string' && adminReply.trim() !== '') {
                    // Hiển thị adminReply dưới dạng chuỗi
                    return (
                        <div style={{ marginBottom: 8 }}>
                            <span style={{ color: "orange" }}>{adminReply}</span>
                        </div>
                    );
                }
                // Nếu chưa có phản hồi, hiển thị "Chưa trả lời"
                return <Tag color="blue">Chưa trả lời</Tag>;
            },
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Space>
                    <Button
                        type="default"
                        icon={<CommentOutlined />}
                        onClick={() => handleReply(record)}
                        title="Trả lời"
                    />
                    <Button
                        type="primary"
                        danger
                        onClick={() => deleteComment(record.id)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        fetchComments();
        connectWebSocket();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []);

    // Effect to reload data when changes are detected
    useEffect(() => {
        if (hasChanges) {
            fetchComments();
            setHasChanges(false);
        }
    }, [hasChanges]);

    const connectWebSocket = () => {
        const socket = new WebSocket("ws://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("WebSocket connected!");
            
                // Nhận các sự kiện chung (ví dụ: client gửi bình luận, xóa...)
                client.subscribe(`/topic/comments`, (message) => {
                    console.log("WebSocket message received:", toast.body);
                    setHasChanges(true);
                });
            
                // Nhận phản hồi từ admin cho mọi sản phẩm
                client.subscribe(`/topic/admin-replies/*`, (message) => {
                    try {
                        const data = JSON.parse(toast.body);
                        console.log("Received admin reply:", data);
            
                        if (data.parentId && data.comment) {
                            setComments((prevComments) =>
                                prevComments.map((comment) =>
                                    comment.id === data.parentId
                                        ? { ...comment, adminReply: data.comment }
                                        : comment
                                )
                            );
                        }
                    } catch (error) {
                        console.error("Error processing admin reply:", error);
                    }
                });
            }
            ,
            onDisconnect: () => {
                console.log("WebSocket disconnected!");
            },
            onError: (err) => {
                console.error("WebSocket error:", err);
            },
        });

        client.activate();
        setStompClient(client);
    };

    const fetchComments = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/admin/comments/all");

            if (!response.ok) {
                throw new Error(`Lỗi: ${response.status}`);
            }

            const result = await response.json();

            // Check for data structure - handle both direct array or data property
            const commentsData = result.data || result;

            if (!Array.isArray(commentsData)) {
                console.error("API không trả về mảng bình luận:", commentsData);
                toast.error("Dữ liệu API không đúng định dạng!");
                return;
            }

            // Format the data consistently, keeping adminReply as a string
            const formattedData = commentsData.map((item) => ({
                id: item.id,
                fullName: item.fullName || "Khách hàng ẩn danh",
                comment: item.comment || "Không có bình luận",
                productName: item.productName || "Không có sản phẩm",
                productId: item.productId,
                customerEmail: item.customerEmail || "Không có email",
                createdAt: item.createdAt || new Date().toISOString(),
                rate: item.rate || 0,
                // Just keep the adminReply as a string if it exists
                adminReply: typeof item.adminReply === 'string' ? item.adminReply :
                    (Array.isArray(item.adminReply) && item.adminReply.length > 0 ?
                        (typeof item.adminReply[0] === 'object' ? item.adminReply[0].comment : item.adminReply[0])
                        : '')
            }));

            setComments(formattedData);
            setFilteredComments(formattedData); // Mặc định hiển thị tất cả
            console.log("Formatted comments data:", formattedData);

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu bình luận:", error);
            toast.error(`Không thể tải dữ liệu: ${error.message}`);
        }
    };

    const handleReply = (comment) => {
        setCurrentComment(comment);
        setReplyModalVisible(true);
        replyForm.resetFields();
    };

    // In Comments.js (admin component) - modify the submitReply function:
    const submitReply = async () => {
        try {
            const values = await replyForm.validateFields();
            const requestBody = {
                parentId: currentComment.id,
                comment: values.adminReply,
            };

            const response = await fetch("http://localhost:8080/api/admin/comments/reply", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error("Lỗi khi gửi phản hồi");

            const responseData = await response.json();

           
            // In Comments.js (admin component):
            stompClient.publish({
                destination: `/topic/admin-replies/${currentComment.productId}`,
                body: JSON.stringify({
                    parentId: currentComment.id,
                    comment: values.adminReply,
                    timestamp: new Date().toISOString()
                }),
            });

           
            
            setReplyModalVisible(false);
            toast.success("Phản hồi đã được gửi!");

            // Update local state
            setComments(prevComments => {
                return prevComments.map(comment => {
                    if (comment.id === currentComment.id) {
                        return {
                            ...comment,
                            adminReply: values.adminReply
                        };
                    }
                    return comment;
                });
            });
        } catch (error) {
            console.error("Lỗi khi phản hồi:", error);
            toast.error(error.message || "Không thể gửi phản hồi!");
        }
    };

    const convertToVietnamTime = (utcDate) => {
        if (!utcDate) return "Không có dữ liệu";
        try {
            const date = new Date(utcDate);
            if (isNaN(date.getTime())) {
                return "Không hợp lệ";
            }
            return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
        } catch (error) {
            console.error("Lỗi chuyển đổi thời gian:", error);
            return "Không có dữ liệu";
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/comments/${commentId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Lỗi API: ${response.status}`);
            }

            toast.success("Xóa bình luận thành công!");

            // Cập nhật UI ngay lập tức
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));

            // Thông báo cho các client khác biết có comment bị xóa
            if (stompClient && stompClient.connected) {
                stompClient.publish({
                    destination: `/topic/comments`,
                    body: JSON.stringify({ action: "delete", commentId }),
                });
            }
        } catch (error) {
            console.error("Lỗi khi xóa bình luận:", error);
            toast.error(error.message || "Không thể xóa bình luận!");
        }
    };

    // Tạo biểu tượng sao cho combobox
    const renderStars = (count) => {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push(<span key={i} style={{ color: 'gold' }}>⭐</span>);
        }
        return stars;
    };

    // Xử lý thay đổi bộ lọc sao
    const handleStarFilterChange = (value) => {
        setStarFilter(value === "all" ? null : parseInt(value));
    };

    // Xử lý thay đổi checkbox "Chưa trả lời"
    const handleNotRepliedChange = (e) => {
        setNotRepliedOnly(e.target.checked);
    };

    // Tính số lượng bình luận theo từng mức đánh giá sao
    const starCounts = [0, 0, 0, 0, 0]; // [1 star, 2 stars, 3 stars, 4 stars, 5 stars]
    comments.forEach(comment => {
        if (comment.rate >= 1 && comment.rate <= 5) {
            starCounts[comment.rate - 1]++;
        }
    });

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Select 
                            placeholder="Lọc theo đánh giá" 
                            allowClear 
                            style={{ width: "100%" }}
                            onChange={handleStarFilterChange}
                            defaultValue="all"
                        >
                            <Option value="all">Tất cả ({comments.length})</Option>
                            <Option value="5">{renderStars(5)} ({starCounts[4]})</Option>
                            <Option value="4">{renderStars(4)} ({starCounts[3]})</Option>
                            <Option value="3">{renderStars(3)} ({starCounts[2]})</Option>
                            <Option value="2">{renderStars(2)} ({starCounts[1]})</Option>
                            <Option value="1">{renderStars(1)} ({starCounts[0]})</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
    <Select
        placeholder="Lọc theo sản phẩm"
        allowClear
        showSearch
        style={{ width: "100%" }}
        onChange={(value) => setSelectedProduct(value || null)}
    >
        {productOptions.map((product, idx) => (
            <Option key={idx} value={product.productName || product.name}>
                {product.productName || product.name}
            </Option>
        ))}
    </Select>
</Col>

<Col xs={24} sm={12} md={6}>
    <DatePicker
        placeholder="Từ ngày"
        style={{ width: "100%" }}
        format="DD/MM/YYYY" 
        onChange={(date) => {
            if (date) {
                const dateObj = date.toDate();
                setSelectedDate(dateObj);
            } else {
                setSelectedDate(null);
            }
        }}
    />
</Col>

                    <Col xs={24} sm={12} md={6}>
                        <Checkbox checked={notRepliedOnly} onChange={handleNotRepliedChange}>
                            Chưa trả lời
                        </Checkbox>
                    </Col>
                </Row>
            </div>
            <Table
    dataSource={filteredComments}
    columns={columns}
    rowKey={(record) => record.id || record.createdAt || Math.random().toString(36).substring(7)}
    locale={{
        triggerAsc: "Bình luận cũ nhất",
        triggerDesc: "Bình luận mới nhất",
        cancelSort: "Bình luận cũ nhất",
    }}
/>


            <Modal
                title={`Trả lời bình luận của: ${currentComment?.fullName}`}
                open={replyModalVisible}
                onOk={submitReply}
                onCancel={() => setReplyModalVisible(false)}
            >
                {currentComment && (
                    <div style={{ marginBottom: 16 }}>
                        <p>
                            <strong>Email:</strong> {currentComment.customerEmail || "Không có nội dung"}
                        </p>
                        <p>
                            <strong>Bình luận:</strong> {currentComment.comment || "Không có nội dung"}
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
                        rules={[{ required: true, message: "Vui lòng nhập nội dung phản hồi" }]}
                    >
                        <TextArea rows={4} placeholder="Nhập nội dung phản hồi..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Comments;

