import {Table, Input, Button, Row, Col, Typography, Card} from 'antd';
import {SearchOutlined, PlusOutlined} from '@ant-design/icons';

const Category = () => {
    const {Title} = Typography;

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
        },
        {
            title: 'Danh mục',
            dataIndex: 'danhMuc',
            key: 'danhMuc',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
        },
        {
            title: 'Thao tác',
            dataIndex: 'thaoTac',
            key: 'thaoTac',
            render: () => <Button type="link">Sửa</Button>,
        },
    ];

    const data = []; // Dữ liệu của bảng, hiện tại để trống

    return (
        <Card style={{padding: '20px'}}>
            <Title level={2}>Danh sách danh mục</Title>
            <div className={"d-flex justify-content-center gap-5 flex-column"}>
                <Row gutter={[16, 16]} style={{marginBottom: '20px'}}>
                    <Col span={20}>
                        <Input
                            placeholder="Nhập vào chất liệu đế của giày mà bạn muốn tìm!"
                            prefix={<SearchOutlined/>}
                            allowClear
                        />
                    </Col>
                    <Col span={4}>
                        <Button type="primary" icon={<PlusOutlined/>} block>
                            Tìm kiếm
                        </Button>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={data}
                    locale={{
                        emptyText: (
                            <div style={{textAlign: 'center'}}>
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{width: '50px', height: '50px', marginBottom: '10px'}}
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

            </div>

        </Card>
    );
}

export default Category;