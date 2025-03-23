import React, { useEffect, useState,useCallback } from 'react';
import { Space, Table, Input, DatePicker, Select, Card, Button, Modal, Form, message, Row, Col, theme,Tooltip,Switch,InputNumber } from 'antd';
import axios from 'axios';
import { baseUrl, convertStatusVoucher, ConvertvoucherType, ConvertdiscountType } from '../../helpers/Helpers.js';
import { Link, useNavigate } from 'react-router-dom';
const { Search } = Input;
const { Option } = Select;
import {SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons';
import { FaEye,FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { debounce } from "lodash"; // Thêm debounce để tránh gọi API liên tục


const PromotionList = () => {
    const convertToVietnamTime = (utcDate) => {
        if (!utcDate) return ""; // Kiểm tra nếu không có giá trị tránh lỗi
        return new Date(utcDate).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
      };
      
    const columns = (handleEdit, handleDelete,handleDetail,switchPromotionStatus) => [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1, // ✅ Tính STT theo trang hiện tại
        },
        {
            title: 'Mã đợt giảm giá',
            dataIndex: 'promotionCode',
            key: 'promotionCode',
        },
        {
            title: 'Tên đợt giảm giá',
            dataIndex: 'promotionName',
            key: 'promotionName',
        },
    
        {
            title: 'Giá trị giảm',
            dataIndex: 'discountValue',
            key: 'discountValue',
            render: (text, record) => {
                return record.discountType === 'PERCENT' ? `${text}%` : `${text} %`;
            },
        },
    
    
    
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            render: (text) => (text ? convertToVietnamTime(text) : "Không có dữ liệu"),
            key: 'startDate',
    
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            render: (text) => (text ? convertToVietnamTime(text) : "Không có dữ liệu"),
            key: 'endDate',
    
        },
        {
            title: 'Trạng thái',
            dataIndex: 'statusPromotion',
            key: 'statusPromotion',
            align: 'center',
    
            render: (_, record) => {
                let displayStatus = convertStatusVoucher(record.statusPromotion);
                let color =
                    record.statusPromotion === 'dang_kich_hoat' ? '#389e0d' :
                        record.statusPromotion === 'chua_kich_hoat' ? 'orange' :
                            'red';
    
                let backgroundColor =
                    record.statusPromotion === 'dang_kich_hoat' ? '#f6ffed' :
                        record.statusPromotion === 'chua_kich_hoat' ? '#fff4e6' :
                            '#fff1f0';
    
                return (
                    <div
                        style={{
                            cursor: 'pointer',
                            color: color,
                            border: `1px solid ${color}`,
                            borderRadius: '8px',
                            textAlign: 'center',
                            padding: '5px 10px',
                            display: 'inline-block',
                            backgroundColor: backgroundColor,
                            fontSize: '10px',
                        }}
                    >
                        {displayStatus}
                    </div>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                           <Space size="middle">
                               {record.statusPromotion !== 'ngung_kich_hoat' && (
                                             <Tooltip title="Chỉnh sửa">
                                                 <FaEdit
                                                     style={{ color: "#ff974d", fontSize: "1.2rem", cursor: "pointer" }}
                                                     onClick={() => handleEdit(record)}
                                                 />
                                             </Tooltip>
                                         )}
           
                               {/* Nút bật/tắt trạng thái */}
           
                               <Tooltip title="Thay đổi trạng thái">
                       <Switch
                           disabled={record.statusPromotion === "ngung_kich_hoat"}
                           checked={record.statusPromotion === "dang_kich_hoat"}
                           checkedChildren="Bật"
                           unCheckedChildren="Tắt"
                           size='small'
                           onChange={(checked) => {
                               Modal.confirm({
                                   title: "Xác nhận thay đổi trạng thái",
                                   content: `Bạn có chắc chắn muốn ${checked ? "bật" : "tắt"} promotion này không?`,
                                   okText: "Xác nhận",
                                   cancelText: "Hủy",
                                   onOk: async () => {
                                       try {
                                           const newStatus = checked ? "dang_kich_hoat" : "ngung_kich_hoat";
                                           console.log("Trạng thái mới:", newStatus);
           
                                           await switchPromotionStatus(record.id, { status: newStatus });
                                           getPagePromotion();
                                           message.success("Cập nhật trạng thái thành công");
                                       } catch (error) {
                                           message.error("Cập nhật trạng thái không thành công");
                                       }
                                   }
                               });
                           }}
                       />
                   </Tooltip>
           
           
           
                              <Tooltip title="Xem chi tiết">
                                             <FaEye
                                                 style={{ color: "#ff974d", fontSize: "1.2rem", cursor: "pointer" }}
                                                 onClick={() => handleDetail(record)}
                                             />
                                         </Tooltip>
                             
                                         {/* <Tooltip title="Xóa">
                                             <FaTrash
                                                 style={{ color: "#ff4d4f", fontSize: "1.2rem", cursor: "pointer" }}
                                                 onClick={() => handleDelete(record.id)}
                                             />
                                         </Tooltip> */}
                           </Space>
                       ),
                   },
    ];
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại
    const pageSize = 5; // Số lượng sản phẩm mỗi trang

    const [promotionData, setPromotionData] = useState([]);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({
        page: 0,
        size: 5,
        total: 7
    });

    // Hàm phân trang
    function handleOnChangeTable(paginationTable) {
        setPagination({
            ...pagination,
            page: paginationTable.current - 1, // Trang hiện tại
            size: paginationTable.pageSize, // Số mục mỗi trang
        });
    }
    const switchPromotionStatus = async (id, statusO) => {
        const { status } = statusO
        console.log("toi ham nay");

        try {
            const response = await axios.get("http://localhost:8080/api/admin/promotion/switchStatus", {
                params: { id, status }
            });
            console.log(response);

        } catch (error) {
            console.log(error);

            throw error;
        }
    };

    const handleEdit = (record) => {
        navigate(`/admin/promotion/update/${record.id}`);

    };
    const handleDetail = (record) => {
        navigate(`/admin/promotion/detail/${record.id}`);
    };
    // Hàm khi ấn nút "Xóa"
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseUrl}/api/admin/promotion/delete/${id}`);
            message.success('Xóa đợt giảm giá thành công!');
            getPagePromotion(); // Gọi lại API để cập nhật danh sách
        } catch (error) {
            message.error('Lỗi khi xóa đợt giảm giá!');
        }
    };
    
    // Hàm lấy dữ liệu phân trang
    useEffect(() => {
        getPagePromotion();
    }, [pagination]);

    // Hàm lấy trang dữ liệu khuyến mãi
    const getPagePromotion = async () => {
        const response = await axios.get(`${baseUrl}/api/admin/promotion/page?page=${pagination.page}&size=${pagination.size}`);
        const data = response.data.data;
        const items = data.content.map((el) => {
            el.startDate = new Date(el.startDate);
            el.endDate = new Date(el.endDate);
            return el;
        });
        setPromotionData(items);

        // Cập nhật pagination nếu có thay đổi trong dữ liệu
        const newPagination = {
            page: data.number,
            size: data.size,
            total: data.totalElements
        };

        // Kiểm tra xem pagination có thay đổi hay không trước khi set lại
        if (
            pagination.page !== newPagination.page ||
            pagination.size !== newPagination.size ||
            pagination.total !== newPagination.total
        ) {
            setPagination(newPagination);
        }
    };

    const [voucherData, setVoucherData] = useState([]);

    const { RangePicker } = DatePicker;
    const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
    const [loading, setLoading] = useState(false);
const [searchValue, setSearchValue] = useState(""); // Giữ giá trị nhập

    const searchPromtion = async (promotionName) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/api/admin/promotion/search/byName`, {
                params: { promotionName } // Sử dụng params để tránh lỗi encode URL
            });

            if (response.data?.data) {
                setPromotionData(response.data.data); // Cập nhật danh sách promotion
            } else {
                setPromotionData([]); // Trả về mảng rỗng nếu không có dữ liệu
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm phiếu giảm giá:", error);
            message.error("Có lỗi xảy ra khi tìm kiếm.");
        } finally {
            setLoading(false);
        }
    };
    const debouncedSearch = useCallback(
        debounce((value) => {
            if (value.trim()) { // Tránh tìm kiếm chuỗi rỗng
                searchPromtion(value);
            } else {
                getPagePromotion(); // Nếu rỗng, tải lại danh sách promotion mặc định
            }
        }, 1000),
        []
    );

    useEffect(() => {
        console.log("Danh sách promotion sau khi cập nhật:", promotionData);
    }, [promotionData]);



    const AdvancedSearchForm = () => {
        return (
            <Card>
                <Form layout="vertical">
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item label="Tên đợt giảm giá">
                                <Input
                                    placeholder="Nhập tên đợt giảm giá"
                                    prefix={<SearchOutlined />}
                                    allowClear
                                    onChange={(e) => debouncedSearch(e.target.value)    
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        );
    };

    return (

        <>
          <h4>Bộ lọc</h4>
            <AdvancedSearchForm onFilterChange={(newFilters) => {
            }} />
            <h4 style={{ paddingTop: '15px' }}>Danh sách đợt giảm giá</h4>

            <Card>
                <Link to={"/admin/promotion/add"} >
                     <Button type="primary" icon={<PlusOutlined />}
                        style={{
                            marginBottom: '20px',
                            border: 'none',
                            backgroundColor: '#ff974d'
                        }}>
                        Thêm mới
                    </Button>
                </Link>



                <Table columns={columns(handleEdit, handleDelete,handleDetail,switchPromotionStatus)} dataSource={promotionData} rowKey="id"
                    pagination={{
                        current: pagination.page + 1,
                        pageSize: pagination.size,
                        total: pagination.total
                    }}
                    onChange={handleOnChangeTable}
                />
            </Card>
        </>
    );
};

export default PromotionList;
