import { useState, useEffect } from "react";
import { Table, Tag, Button, Space, Popconfirm, message, Select } from "antd";
import { CheckOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const { Option } = Select;

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        // Giả lập API lấy dữ liệu
        const data = [
            { id: 1, comment: "Sản phẩm rất tốt!", status: "CHO_DUYET", rate: 5 },
            { id: 2, comment: "Không hài lòng lắm", status: "DA_DUYET", rate: 3 },
            { id: 3, comment: "Giao hàng nhanh", status: "CHO_DUYET", rate: 4 },
        ];
        setComments(data);
    };

    const handleApprove = () => {
        setComments(
            comments.map((c) =>
                selectedRowKeys.includes(c.id) ? { ...c, status: "DA_DUYET" } : c
            )
        );
        setSelectedRowKeys([]);
        message.success("Duyệt thành công!");
    };

    const handleHide = (id) => {
        setComments(
            comments.map((c) => (c.id === id ? { ...c, status: "DA_AN" } : c))
        );
        message.success("Đã ẩn bình luận!");
    };

    const columns = [
        {
            title: "Bình luận",
            dataIndex: "comment",
        },
        {
            title: "Đánh giá",
            dataIndex: "rate",
            render: (rate) => <Tag color="gold">{rate} ⭐</Tag>,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status) => {
                const color =
                    status === "CHO_DUYET"
                        ? "volcano"
                        : status === "DA_DUYET"
                            ? "green"
                            : "gray";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Space>
                    {record.status === "CHO_DUYET" && (
                        <Popconfirm
                            title="Duyệt bình luận này?"
                            onConfirm={() => handleApprove([record.id])}
                        >
                            <Button type="primary" icon={<CheckOutlined />} />
                        </Popconfirm>
                    )}
                    <Popconfirm
                        title="Ẩn bình luận này?"
                        onConfirm={() => handleHide(record.id)}
                    >
                        <Button danger icon={<EyeInvisibleOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Select
                    placeholder="Lọc theo trạng thái"
                    onChange={setStatusFilter}
                    allowClear
                >
                    <Option value="CHO_DUYET">Chờ Duyệt</Option>
                    <Option value="DA_DUYET">Đã Duyệt</Option>
                    <Option value="DA_AN">Đã Ẩn</Option>
                </Select>
                <Button
                    type="primary"
                    onClick={handleApprove}
                    disabled={selectedRowKeys.length === 0}
                >
                    Duyệt {selectedRowKeys.length} bình luận
                </Button>
            </Space>
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                    getCheckboxProps: (record) => ({
                        disabled: record.status !== "CHO_DUYET",
                    }),
                }}
                dataSource={comments.filter((c) => !statusFilter || c.status === statusFilter)}
                columns={columns}
                rowKey="id"
            />
        </div>
    );
};

export default Comments;
