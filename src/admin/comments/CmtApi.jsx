import { useState, useEffect } from "react";
import { Table, Tag, Button, Space, message, Select, DatePicker, Input, Modal, Form, Row, Col, Checkbox } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;
const { TextArea } = Input;

// Sử dụng URL API cụ thể cho từng endpoint
const COMMENTS_API_URL_ALL = "http://localhost:8080/api/admin/comments/all";
const PRODUCTS_API_URL = "http://localhost:8080/api/products/unique";
const REPLY_API_URL = "http://localhost:8080/api/comments";

const Comments = () => {
    // State cho dữ liệu và loading
    const [allComments, setAllComments] = useState([]); // Lưu trữ tất cả comment từ API
    const [displayedComments, setDisplayedComments] = useState([]); // Comments đã được lọc
    const [loading, setLoading] = useState(false);
    
    // State cho bộ lọc
    const [statusFilter, setStatusFilter] = useState(null);
    const [ratingFilter, setRatingFilter] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [productFilter, setProductFilter] = useState(null);
    const [productSearch, setProductSearch] = useState("");
    const [showUnrepliedOnly, setShowUnrepliedOnly] = useState(false);
    
    // State cho modal reply
    const [replyModalVisible, setReplyModalVisible] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [replyForm] = Form.useForm();
    
    // State cho danh sách sản phẩm
    const [uniqueProducts, setUniqueProducts] = useState([]);

    // Lấy dữ liệu khi component mount
    useEffect(() => {
        fetchAllComments();
        fetchUniqueProducts();
    }, []);

    // Lấy tất cả comments từ API
    const fetchAllComments = async () => {
        setLoading(true);
        try {
            console.log("Đang gọi API lấy tất cả comments:", COMMENTS_API_URL_ALL);
            const response = await axios.get(COMMENTS_API_URL_ALL);
            
            // Xử lý dữ liệu trả về
            let commentsData = [];
            if (Array.isArray(response.data)) {
                commentsData = response.data;
            } else if (response.data && typeof response.data === 'object') {
                commentsData = Array.isArray(response.data.data) ? response.data.data : [];
            }
            
            setAllComments(commentsData);
            filterComments(commentsData);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bình luận:", error);
            message.error("Không thể tải danh sách bình luận");
            setAllComments([]);
            setDisplayedComments([]);
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh sách sản phẩm từ API
    const fetchUniqueProducts = async () => {
        try {
            console.log("Đang gọi API lấy danh sách sản phẩm:", PRODUCTS_API_URL);
            const response = await axios.get(PRODUCTS_API_URL);
            
            // Xử lý dữ liệu trả về
            let productsData = [];
            if (Array.isArray(response.data)) {
                productsData = response.data;
            } else if (response.data && typeof response.data === 'object') {
                productsData = Array.isArray(response.data.data) ? response.data.data : [];
            }
            
            setUniqueProducts(productsData);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            setUniqueProducts([]);
        }
    };

    // Lọc comments trên client-side
    const filterComments = (comments = allComments) => {
        const filtered = comments.filter(comment => {
            // Lọc theo đánh giá sao
            if (ratingFilter && comment.rate !== ratingFilter) {
                return false;
            }
            
            // Lọc theo tên sản phẩm
            if (productFilter) {
                let productName = '';
                if (typeof comment.productName === 'string') {
                    productName = comment.productName;
                } else if (comment.product && typeof comment.product === 'object') {
                    productName = comment.product.name || '';
                }
                
                if (productName !== productFilter) {
                    return false;
                }
            }
            
            // Lọc theo ngày
            if (startDate) {
                const commentDate = new Date(comment.commentDate);
                const filterDate = new Date(startDate.format('YYYY-MM-DD'));
                
                if (commentDate < filterDate) {
                    return false;
                }
            }
            
            // Lọc theo chưa trả lời
            if (showUnrepliedOnly && comment.userReply) {
                return false;
            }
            
            return true;
        });
        
        setDisplayedComments(filtered);
    };

    // Effect để tự động lọc khi các filter thay đổi
    useEffect(() => {
        filterComments();
    }, [ratingFilter, productFilter, startDate, showUnrepliedOnly]);

    // Xử lý trả lời bình luận
    const handleReply = (comment) => {
        setCurrentComment(comment);
        setReplyModalVisible(true);
        replyForm.resetFields();
    };

    // Gửi phản hồi đến API
    const submitReply = async () => {
        try {
            await replyForm.validateFields();
            const values = replyForm.getFieldsValue();
            
            setLoading(true);
            console.log(`Đang gửi phản hồi cho comment id: ${currentComment.id}`);
            
            await axios.post(`${REPLY_API_URL}/${currentComment.id}/reply`, {
                reply: values.reply
            });
            
            // Cập nhật phản hồi trong state
            const updatedComments = allComments.map(c => 
                c.id === currentComment.id 
                    ? { ...c, userReply: values.reply } 
                    : c
            );
            
            setAllComments(updatedComments);
            filterComments(updatedComments);
            
            setReplyModalVisible(false);
            message.success("Đã trả lời bình luận thành công!");
        } catch (error) {
            console.error("Lỗi khi trả lời bình luận:", error);
            message.error("Không thể trả lời bình luận");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý tìm kiếm sản phẩm
    const handleProductSearch = (value) => {
        setProductSearch(value);
    };

    // Lọc danh sách sản phẩm theo từ khóa tìm kiếm
    const getFilteredProducts = () => {
        if (!Array.isArray(uniqueProducts)) return [];
        
        if (!productSearch) return uniqueProducts;
        
        return uniqueProducts.filter(product => {
            if (typeof product === 'string') {
                return product.toLowerCase().includes(productSearch.toLowerCase());
            } else if (product && typeof product === 'object') {
                const productName = product.name || product.productName || '';
                return productName.toLowerCase().includes(productSearch.toLowerCase());
            }
            return false;
        });
    };

    // Chuyển đổi thời gian
    const convertToVietnamTime = (utcDate) => {
        if (!utcDate) return "Không có dữ liệu";
        try {
            return new Date(utcDate).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
        } catch (error) {
            console.error("Lỗi chuyển đổi thời gian:", error);
            return "Không có dữ liệu";
        }
    };
    
    // Cấu hình cột
    const columns = [
        { 
            title: 'STT', 
            align: 'center', 
            render: (_, __, index) => index + 1,
            width: 60
        },
        { 
            title: "Bình luận", 
            dataIndex: "comment",
            ellipsis: { showTitle: false },
            render: comment => comment || "Không có nội dung"
        },
        { 
            title: "Sản phẩm", 
            dataIndex: "productName",
            ellipsis: { showTitle: false },
            render: productName => productName || "Không xác định"
        },
        {
            title: "Ngày bình luận",
            dataIndex: "commentDate",
            render: text => convertToVietnamTime(text),
            width: 180
        },
        {
            title: "Đánh giá",
            dataIndex: "rate",
            align: 'center',
            render: rate => <Tag color="gold">{rate || 0} ⭐</Tag>,
            width: 100
        },
        {
            title: "Phản hồi",
            align: 'center',
            dataIndex: "userReply",
            ellipsis: { showTitle: false },
            render: reply => reply ? reply : <Tag color="blue">Chưa trả lời</Tag>,
            width: 150
        },
        {
            title: "Hành động",
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        type="default"
                        icon={<CommentOutlined />}
                        onClick={() => handleReply(record)}
                        title="Trả lời"
                    />
                </Space>
            ),
            width: 100
        },
    ];

    // Lọc sản phẩm cho dropdown
    const filteredProducts = getFilteredProducts();

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Lọc theo đánh giá"
                            onChange={setRatingFilter}
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
                            onChange={setProductFilter}
                            allowClear
                            showSearch
                            onSearch={handleProductSearch}
                            filterOption={false}
                            style={{ width: '100%' }}
                            notFoundContent="Không tìm thấy sản phẩm"
                        >
                            {filteredProducts.map((product, index) => {
                                let productName, productValue;
                                
                                if (typeof product === 'string') {
                                    productName = product;
                                    productValue = product;
                                } else if (product && typeof product === 'object') {
                                    productName = product.name || product.productName || 'Không xác định';
                                    productValue = product.id || product.productId || productName;
                                } else {
                                    return null;
                                }
                                
                                return (
                                    <Option key={`product-${index}`} value={productValue}>
                                        {productName}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <DatePicker 
                            onChange={setStartDate}
                            placeholder="Từ ngày"
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Checkbox 
                            checked={showUnrepliedOnly}
                            onChange={(e) => setShowUnrepliedOnly(e.target.checked)}
                        >
                            Chỉ hiển thị bình luận chưa trả lời
                        </Checkbox>
                    </Col>
                </Row>
            </div>
            <Table
                loading={loading}
                dataSource={displayedComments}
                columns={columns}
                rowKey={record => record.id || Math.random().toString(36).substr(2, 9)}
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'Không có dữ liệu bình luận' }}
            />

            {/* Modal trả lời bình luận */}
            <Modal
                title={`Trả lời bình luận: ${currentComment?.productName || 'Không xác định'}`}
                open={replyModalVisible}
                onOk={submitReply}
                onCancel={() => setReplyModalVisible(false)}
                confirmLoading={loading}
            >
                {currentComment && (
                    <div style={{ marginBottom: 16 }}>
                        <p><strong>Bình luận:</strong> {currentComment.comment || 'Không có nội dung'}</p>
                        <p><strong>Đánh giá:</strong> {currentComment.rate || 0} ⭐</p>
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