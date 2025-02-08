import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    message, Modal,
    Pagination,
    Select,
    Table,
    Tabs,
    Typography
} from "antd";
import {toast} from "react-toastify";
import {salesColumns} from "./columns/columns.jsx";
import {fetchProducts} from "../product/ProductDetail/ApiProductDetail.js";
import CustomerSelect from "./component/CustomerSelect.jsx";
import axios from "axios";
import moment from "moment/moment.js";
import {productTableColumn} from "./columns/productTableColumn.jsx";
import SalePaymentInfo from "./component/SalePaymentInfo.jsx";
const {Title, Text} = Typography;
const {Option} = Select;

const SalesPage = () => {
    const [items, setItems] = useState([
        {
            key: "1",
            label: "Hóa đơn 1",
            productList: [],
            customerInfo: null,
            payInfo: {}
        },
    ]);

    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5, // Số dòng hiển thị mỗi trang
    });
    const [currentBill, setCurrentBill] = useState() // 1 mảng các sản phẩm
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setOpen(false);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    const fetchProductsData = async () => {
        try {
            const response = await fetchProducts(pagination);
            console.log("Response from API:", response); // Log response để kiểm tra dữ liệu trả về
            setProducts(response.data);

        } catch (error) {
            message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu.");
        } finally {

        }
    };
    useEffect(() => {
        setCurrentBill("1")
        fetchProductsData()
        getAllCustomer()
    }, []);

    const handleCustomerMoneyChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setItems(prevItems =>
            prevItems.map(item =>
                item.key === currentBill
                    ? {
                        ...item,
                        payInfo: {
                            ...item.payInfo,
                            customerMoney: value,
                            change: value - (item.payInfo.amount || 0)
                        }
                    }
                    : item
            )
        );
    };


    const handleOnCreateBill = () => {
        if (items.length >= 10) {
            toast.warning("Đạt giới hạn hóa đơn")
            return;
        }
        const newKey = (items.length + 1).toString(); // Tạo key mới cho hóa đơn
        const newItem = {
            key: newKey,
            label: `Hóa đơn ${newKey}`,
            productList: [],
        };

        setItems([...items, newItem]);
    };


    const handleOnAddProductToBill = (record) => {
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === currentBill) {
                    const existingProduct = item.productList.find(p => p.key === record.key);

                    if (existingProduct) {
                        alert("Sản phẩm đã có trong giỏ hàng!");
                    } else {
                        const updatedProductList = [...item.productList, {...record, quantityInCart: 1}];

                        return {
                            ...item,
                            productList: updatedProductList,
                            payInfo: {
                                ...item.payInfo,
                                amount: calculateTotalAmount({ productList: updatedProductList }),
                                change: (item.payInfo.customerMoney || 0) - calculateTotalAmount({ productList: updatedProductList })
                            }
                        };
                    }
                }
                return item;
            })
        );
    };


    const getAllCustomer = () => {
        axios.get('http://localhost:8080/api/customers/')
            .then((response) => {
                const fetchedData = response.data.map((item, index) => ({
                    key: index + 1,
                    id: item.id,
                    avatar: item.avatar,
                    fullName: item.fullName,
                    CitizenId: item.citizenId,
                    phoneNumber: item.phoneNumber,
                    dateBirth: moment(item.dateBirth).format('YYYY-MM-DD HH:mm:ss'),
                    status: item.status === 1 ? 'Kích hoạt' : 'Khóa',
                    email: item.email,
                    gender: item.gender === 1 ? 'Nam' : 'Nữ',
                    addresses: item.addresses,
                    password: item.password
                }));
                setCustomers(fetchedData);
            })
            .catch((error) => console.error('Error fetching data:', error));
    };
    const handleDataSource = () => {
        const totalRows = pagination.pageSize;
        const dataLength = products.length;
        const emptyRows = Math.max(totalRows - dataLength, 0);

        const emptyData = new Array(emptyRows).fill({}).map((_, index) => ({
            key: `empty-${index}`, // Thêm key duy nhất
        }));
        return [
            ...products.map((product, index) => ({
                ...product,
                key: product.id || index,
            })),
            ...emptyData,
        ];
    };

    const handleRemoveProduct = (product) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.key === currentBill
                    ? {
                        ...item,
                        productList: item.productList.filter(p => p.key !== product.key),
                        payInfo: {
                            ...item.payInfo,
                            amount: calculateTotalAmount({ productList: item.productList.filter(p => p.key !== product.key) }),
                            change: (item.payInfo.customerMoney || 0) - calculateTotalAmount({ productList: item.productList.filter(p => p.key !== product.key) })
                        }
                    }
                    : item
            )
        );
    };


    const handleQuantityChange = (value, product) => {
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === currentBill) {
                    const updatedProductList = item.productList.map(p =>
                        p.key === product.key ? {...p, quantityInCart: value} : p
                    );

                    return {
                        ...item,
                        productList: updatedProductList,
                        payInfo: {
                            ...item.payInfo,
                            amount: calculateTotalAmount({ productList: updatedProductList }), // Cập nhật tổng tiền
                            change: (item.payInfo.customerMoney || 0) - calculateTotalAmount({ productList: updatedProductList })
                        }
                    };
                }
                return item;
            })
        );
    };

    const onCustomerSelect = (customer) => {
        console.log("customer nhận được", customer)
        setItems(prevItems => prevItems.map((item) => {
            if (item.key === currentBill) {
                return {...item, customerInfo: customer}
            }
            return item;
        }))
    }

    // Hàm tính tổng tiền giỏ hàng
    const calculateTotalAmount = (bill) => {
        return bill.productList.reduce((total, product) => {
            return total + (product.price * (product.quantityInCart || 1));
        }, 0);
    };


    return (
        <div className={"d-flex flex-column gap-3"}>
            <Modal
                open={open}
                width={"75%"}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <h3>Danh sách sản phẩm</h3>
                <hr/>
                <Table
                    columns={productTableColumn(pagination, handleOnAddProductToBill)}
                    dataSource={handleDataSource()} // Dữ liệu đã xử lý với dòng trống
                    pagination={false} // Bỏ pagination trong Table
                    locale={{
                        emptyText: (
                            <div style={{textAlign: "center"}}>
                                <p>No data</p>
                            </div>
                        ),
                    }}
                    // className="custom-table"
                />
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    onShowSizeChange={(current, pageSize) => {
                        setPagination({
                            current: 1, // Quay lại trang 1 khi thay đổi số lượng phần tử mỗi trang
                            pageSize,
                        });
                    }}
                    onChange={(page, pageSize) => {
                        setPagination({current: page, pageSize});
                        // fetchProductsData(); // Gọi lại API để cập nhật dữ liệu phù hợp
                    }}
                />
            </Modal>
            <div>
                <Button
                    type={"primary"}
                    onClick={handleOnCreateBill}>
                    Tạo hóa đơn
                </Button>
            </div>


            <Card>
                <div className={"d-flex justify-content-between"}>
                    <h3>Danh sách hóa đơn</h3>

                    <div className={"d-flex gap-3"}>
                        <Button
                            type={"primary"}
                            onClick={handleOnCreateBill}>
                            QR Code
                        </Button>

                        <Button
                            type={"primary"}
                            onClick={showModal}>
                            Thêm sản phẩm
                        </Button>
                    </div>

                </div>
                <hr/>
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    onChange={(key) => setCurrentBill(key)}
                />
                <Table
                    dataSource={items.find(item => item.key === currentBill)?.productList || []}
                    columns={salesColumns(handleRemoveProduct, handleQuantityChange)}/>
            </Card>
            <CustomerSelect customers={customers}
                            customer={items.find(item => item.key === currentBill)?.customerInfo || null}
                            onCustomerSelect={onCustomerSelect}/>
            <div>
            </div>
            <SalePaymentInfo
                amount={items.find(item => item.key === currentBill)?.payInfo?.amount || 0}
                change={items.find(item => item.key === currentBill)?.payInfo?.change || 0}
                customerMoney={items.find(item => item.key === currentBill)?.payInfo?.customerMoney || ""}
                handleCustomerMoneyChange={handleCustomerMoneyChange}
            />
        </div>
    );
};
export default SalesPage;
