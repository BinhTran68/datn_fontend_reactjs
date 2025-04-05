import { useState, useEffect } from "react";
import { Table, Tag, Button, Space, message, Select, DatePicker, Input, Modal, Form, Row, Col, Checkbox } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import { Client } from "@stomp/stompjs";

const { Option } = Select;
const { TextArea } = Input;

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [replyModalVisible, setReplyModalVisible] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [replyForm] = Form.useForm();
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        fetchComments();
        connectWebSocket();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []);

    const connectWebSocket = () => {
        const socket = new WebSocket("ws://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: (frame) => {
                console.log("✅ WebSocket Connected:", frame);
            },
            onStompError: (frame) => console.error("❌ STOMP Error:", frame.headers["message"]),
            onWebSocketClose: (event) => console.warn("⚠️ WebSocket Closed:", event),
            debug: (str) => console.log("🛠 WebSocket Debug:", str),
        });

        try {
            client.activate();
            setStompClient(client);
        } catch (error) {
            console.error("❌ WebSocket Activation Error:", error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/admin/comments/all");
    
            if (!response.ok) {
                throw new Error(`Lỗi: ${response.status}`);
            }
    
            const result = await response.json();
            console.log("D 123:", result);
    
            const commentsData = result?.data || result || [];
    
            if (!Array.isArray(commentsData)) {
                console.error("API không trả về danh sách bình luận:", commentsData);
                message.error("Dữ liệu API không đúng định dạng!");
                return;
            }
    
            const formattedData = commentsData.map((item, index) => ({
                id: item.id || index + 1,
                fullName: item.fullName || "Khách hàng ẩn danh",
                comment: item.comment || "Không có bình luận",
                productName: item.productName || "Không có sản phẩm",
                productId: item.productId || null,
                customerEmail: item.customerEmail || "Không có tài khoản",
                commentDate: item.createdAt
                    ? new Date(item.createdAt).toISOString().split("T")[0]
                    : "Không có ngày",
                createdAt: item.createdAt || new Date().toISOString(),
                rate: item.rate || 5,
                userReply: item.adminReply || null,
                replies: item.replies || [], // Include replies
            }));
    
            console.log("Dữ liệu sau khi format:", formattedData);
            setComments(formattedData);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu bình luận:", error);
            message.error(`Không thể tải dữ liệu: ${error.message}`);
        }
    };

    const handleReply = (comment) => {
        setCurrentComment(comment);
        setReplyModalVisible(true);
        replyForm.resetFields();
    };

    const submitReply = async () => {
        try {
            const values = await replyForm.validateFields();
            const requestBody = {
                parentId: currentComment.id,  // Gửi kèm ID bình luận gốc
                comment: values.reply,
                createdAt: new Date().toISOString(),
                isAdmin: true,
                fullName: "Admin",
            };
    
            const response = await fetch("http://localhost:8080/api/admin/comments/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
    
            if (!response.ok) throw new Error("Lỗi khi gửi phản hồi");
            
            const responseData = await response.json();
            
             // Sau khi phản hồi được lưu, cập nhật lại danh sách bình luận
        setComments(prevComments => 
            prevComments.map(comment =>
                comment.id === currentComment.id 
                    ? { 
                        ...comment, 
                        userReply: values.reply,  // Cập nhật phản hồi
                        replies: [...(comment.replies || []), responseData]  // Cập nhật danh sách phản hồi
                    }
                    : comment
            )
        );
    
                   // Gửi thông qua WebSocket để cập nhật ngay lập tức trên các client khác
        if (stompClient && stompClient.connected) {
            if (currentComment.productId) {
                stompClient.publish({
                    destination: `/topic/comments/${currentComment.productId}`,
                    body: JSON.stringify({
                        id: responseData.id,
                        parentId: currentComment.id,
                        comment: values.reply,
                        createdAt: new Date().toISOString(),
                        fullName: "Admin",
                        isAdmin: true
                    })
                });
            }

            stompClient.publish({
                destination: `/topic/admin-replies`,
                body: JSON.stringify({
                    id: responseData.id,
                    parentId: currentComment.id,
                    comment: values.reply,
                    createdAt: new Date().toISOString(),
                    fullName: "Admin",
                    isAdmin: true
                })
            });
        }

        setReplyModalVisible(false);
        message.success("Phản hồi đã được gửi!");
        } catch (error) {
            console.error("Lỗi khi phản hồi:", error);
            message.error(error.message || "Không thể gửi phản hồi!");
        }
    };
    
    // Chuyển đổi thời gian
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
    
            message.success("Xóa bình luận thành công!");
            
            // Cập nhật danh sách bình luận sau khi xóa
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error("Lỗi khi xóa bình luận:", error);
            message.error(error.message || "Không thể xóa bình luận!");
        }
    };

    const columns = [
        {
            title: 'STT',
            align: 'center',
            render: (_, __, index) => index + 1,
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
            dataIndex: "commentDate",
            render: text => convertToVietnamTime(text),
        },
        {
            title: "Đánh giá",
            dataIndex: "rate",
            render: (rate) => <Tag color="gold">{rate} ⭐</Tag>,
        },
        {
            title: "Phản hồi",
            dataIndex: "userReply",
            render: (reply) => (reply ? reply : <Tag color="blue">Chưa trả lời</Tag>),
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

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Lọc theo đánh giá"
                            allowClear
                            style={{ width: '100%' }}
                        >
                            <Option value={5}>5 ⭐</Option>
                            <Option value={4}>4 ⭐</Option>
                            <Option value={3}>3 ⭐</Option>
                            <Option value={2}>2 ⭐</Option>
                            <Option value={1}>1 ⭐</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Lọc theo sản phẩm"
                            allowClear
                            showSearch
                            style={{ width: '100%' }}
                        >
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <DatePicker
                            placeholder="Từ ngày"
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Checkbox>
                            Chưa trả lời
                        </Checkbox>
                    </Col>
                </Row>
            </div>
            <Table
                dataSource={comments}
                columns={columns}
                rowKey={(record) => record.id || record.commentDate || Math.random().toString(36).substring(7)}
            />

            <Modal
                title={`Trả lời bình luận của: ${currentComment?.fullName}`}
                open={replyModalVisible}
                onOk={submitReply}
                onCancel={() => setReplyModalVisible(false)}
            >
                {currentComment && (
                    <div style={{ marginBottom: 16 }}>
                        <p><strong>Email:</strong> {currentComment.customerEmail || 'Không có nội dung'}</p>
                        <p><strong>Bình luận:</strong> {currentComment.comment || 'Không có nội dung'}</p>
                        <p><strong>Đánh giá:</strong> {currentComment.rate} ⭐</p>
                    </div>
                )}
                <Form form={replyForm}>
                    <Form.Item
                        name="reply"
                        label="Phản hồi"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi' }]}
                    >
                        <TextArea rows={4} placeholder="Nhập nội dung phản hồi..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Comments;



import { useState, useEffect } from "react";
import { Table, Tag, Button, Space, message, Select, DatePicker, Input, Modal, Form, Row, Col, Checkbox } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import { Client } from "@stomp/stompjs";

const { Option } = Select;
const { TextArea } = Input;

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [replyModalVisible, setReplyModalVisible] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [replyForm] = Form.useForm();
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        fetchComments();
        connectWebSocket();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []);

    // const connectWebSocket = () => {
    //     const socket = new WebSocket("ws://localhost:8080/ws");
    //     const client = new Client({
    //         webSocketFactory: () => socket,
    //         reconnectDelay: 5000,
    //         onConnect: (frame) => {
    //             console.log("✅ WebSocket Connected:", frame);
    //             // Subscribe to updates on comments
    //             client.subscribe("/topic/comments", (message) => {
    //                 const newComment = JSON.parse(message.body);
    //                 setComments((prevComments) => {
    //                     // Handle adding new comment or updating an existing one
    //                     return [...prevComments, newComment];
    //                 });
    //             });
    //             // Subscribe to admin replies
    //             client.subscribe("/topic/admin-replies", (message) => {
    //                 const adminReply = JSON.parse(message.body);
    //                 setComments((prevComments) => {
    //                     return prevComments.map((comment) => {
    //                         if (comment.id === adminReply.parentId) {
    //                             return {
    //                                 ...comment,
    //                                 replies: [...comment.replies, adminReply]
    //                             };
    //                         }
    //                         return comment;
    //                     });
    //                 });
    //             });
    //         },
    //         onStompError: (frame) => console.error("❌ STOMP Error:", frame.headers["message"]),
    //         onWebSocketClose: (event) => console.warn("⚠️ WebSocket Closed:", event),
    //         debug: (str) => console.log("🛠 WebSocket Debug:", str),
    //     });

    //     try {
    //         client.activate();
    //         setStompClient(client);
    //     } catch (error) {
    //         console.error("❌ WebSocket Activation Error:", error);
    //     }
    // };
    const connectWebSocket = () => {
        const socket = new WebSocket("ws://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/comments/${productId}`, (message) => {
                    const newComment = JSON.parse(message.body);
    
                    setComments((prevComments) => {
                        return prevComments.map((comment) => {
                            if (comment.id === newComment.parentId) {
                                return {
                                    ...comment,
                                    replies: [...(comment.replies || []), newComment],
                                };
                            }
                            return comment;
                        });
                    });
                });
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
            console.log("D 123:", result);
    
            const commentsData = result?.data || result || [];
    
            if (!Array.isArray(commentsData)) {
                console.error("API không trả về danh sách bình luận:", commentsData);
                message.error("Dữ liệu API không đúng định dạng!");
                return;
            }
    
            const formattedData = commentsData.map((item, index) => ({
                id: item.id || index + 1,
                fullName: item.fullName || "Khách hàng ẩn danh",
                comment: item.comment || "Không có bình luận",
                productName: item.productName || "Không có sản phẩm",
                productId: item.productId || null,
                customerEmail: item.customerEmail || "Không có tài khoản",
                commentDate: item.createdAt
                    ? new Date(item.createdAt).toISOString().split("T")[0]
                    : "Không có ngày",
                createdAt: item.createdAt || new Date().toISOString(),
                rate: item.rate || 5,
                userReply: item.adminReply || null,
                replies: item.replies || [], // Include replies
            }));
    
            console.log("Dữ liệu sau khi format:", formattedData);
            setComments(formattedData);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu bình luận:", error);
            message.error(`Không thể tải dữ liệu: ${error.message}`);
        }
    };

    const handleReply = (comment) => {
        setCurrentComment(comment);
        setReplyModalVisible(true);
        replyForm.resetFields();
    };

// const submitReply = async () => {
//     try {
//         const values = await replyForm.validateFields();
//         const requestBody = {
//             parentId: currentComment.id,
//             comment: values.reply,
//             createdAt: new Date().toISOString(),
//             isAdmin: true,
//             fullName: "Admin",
//         };

//         const response = await fetch("http://localhost:8080/api/admin/comments/reply", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(requestBody),
//         });

//         if (!response.ok) throw new Error("Lỗi khi gửi phản hồi");

//         const responseData = await response.json();

//         // Cập nhật UI ngay lập tức
//         setComments((prevComments) =>
//             prevComments.map((comment) =>
//                 comment.id === currentComment.id
//                     ? {
//                         ...comment,
//                         replies: [...(comment.replies || []), responseData.data],
//                     }
//                     : comment
//             )
//         );

//         // Gửi qua WebSocket
//         if (stompClient && stompClient.connected) {
//             stompClient.publish({
//                 destination: `/topic/admin-replies`,
//                 body: JSON.stringify(responseData.data),
//             });
//         }

//         setReplyModalVisible(false);
//         message.success("Phản hồi đã được gửi!");
//     } catch (error) {
//         console.error("Lỗi khi phản hồi:", error);
//         message.error(error.message || "Không thể gửi phản hồi!");
//     }
// };

    
    // Chuyển đổi thời gian
    const submitReply = async () => {
        try {
            const values = await replyForm.validateFields();
            const requestBody = {
                parentId: currentComment.id,
                comment: values.reply,
            };
    
            const response = await fetch("http://localhost:8080/api/admin/comments/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
    
            if (!response.ok) throw new Error("Lỗi khi gửi phản hồi");
    
            const responseData = await response.json();
            const replyData = responseData.data;
    
            // Cập nhật UI ngay lập tức
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === currentComment.id
                        ? { ...comment, replies: [...(comment.replies || []), replyData] }
                        : comment
                )
            );
    
            // Gửi phản hồi qua WebSocket
            if (stompClient && stompClient.connected) {
                stompClient.publish({
                    destination: `/topic/comments/${currentComment.productId}`,
                    body: JSON.stringify(replyData),
                });
            }
    
            // Đóng modal
            setReplyModalVisible(false);
            message.success("Phản hồi đã được gửi!");
    
        } catch (error) {
            console.error("Lỗi khi phản hồi:", error);
            message.error(error.message || "Không thể gửi phản hồi!");
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
    
            message.success("Xóa bình luận thành công!");
            
            // Cập nhật danh sách bình luận sau khi xóa
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error("Lỗi khi xóa bình luận:", error);
            message.error(error.message || "Không thể xóa bình luận!");
        }
    };

    const columns = [
        {
            title: 'STT',
            align: 'center',
            render: (_, __, index) => index + 1,
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
            dataIndex: "commentDate",
            render: text => convertToVietnamTime(text),
        },
        {
            title: "Đánh giá",
            dataIndex: "rate",
            render: (rate) => <Tag color="gold">{rate} ⭐</Tag>,
        },
        {
            title: "Phản hồi",
            dataIndex: "userReply",
            render: (reply) => (reply ? reply : <Tag color="blue">Chưa trả lời</Tag>),
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

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Lọc theo đánh giá"
                            allowClear
                            style={{ width: '100%' }}
                        >
                            <Option value={5}>5 ⭐</Option>
                            <Option value={4}>4 ⭐</Option>
                            <Option value={3}>3 ⭐</Option>
                            <Option value={2}>2 ⭐</Option>
                            <Option value={1}>1 ⭐</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Lọc theo sản phẩm"
                            allowClear
                            showSearch
                            style={{ width: '100%' }}
                        >
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <DatePicker
                            placeholder="Từ ngày"
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Checkbox>
                            Chưa trả lời
                        </Checkbox>
                    </Col>
                </Row>
            </div>
            <Table
                dataSource={comments}
                columns={columns}
                rowKey={(record) => record.id || record.commentDate || Math.random().toString(36).substring(7)}
            />

            <Modal
                title={`Trả lời bình luận của: ${currentComment?.fullName}`}
                open={replyModalVisible}
                onOk={submitReply}
                onCancel={() => setReplyModalVisible(false)}
            >
                {currentComment && (
                    <div style={{ marginBottom: 16 }}>
                        <p><strong>Email:</strong> {currentComment.customerEmail || 'Không có nội dung'}</p>
                        <p><strong>Bình luận:</strong> {currentComment.comment || 'Không có nội dung'}</p>
                        <p><strong>Đánh giá:</strong> {currentComment.rate} ⭐</p>
                    </div>
                )}
                <Form form={replyForm}>
                    <Form.Item
                        name="reply"
                        label="Phản hồi"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi' }]}>
                        <TextArea rows={4} placeholder="Nhập nội dung phản hồi..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Comments;
