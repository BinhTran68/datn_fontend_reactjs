import React, {useEffect, useState} from 'react';
import {
    Badge,
    Button,
    Card,
    message, Modal,
    Pagination,
    Table,
    Tabs,
} from "antd";
import {toast} from "react-toastify";
import {salesColumns} from "./columns/columns.jsx";
import {fetchProducts} from "../product/ProductDetail/ApiProductDetail.js";
import CustomerSelect from "./component/CustomerSelect.jsx";
import axios from "axios";
import moment from "moment/moment.js";
import {productTableColumn} from "./columns/productTableColumn.jsx";
import SalePaymentInfo from "./component/SalePaymentInfo.jsx";
import {baseUrl, calculateShippingFee, generateAddressString} from "../../helpers/Helpers.js";
import {printBillService} from "../bill/services/printBillService.js";
import {LiaStackExchange} from "react-icons/lia";
import {postChangeQuantityProduct} from "./billService.js";
import axiosInstance from "../../utils/axiosInstance.js";

const SalesPage = () => {
    const [items, setItems] = useState([
        {
            key: "1",
            itemName: ` Hóa đơn ${moment().format("HH:mm:ss")}`,
            label: (
                <span>
                     Hóa đơn {moment().format("HH:mm:ss")} <Badge showZero={true} className={"mb-2"} count={0}
                                                                  offset={[5, -5]}/>
                </span>
            ),
            productList: [],
            isSuccess: false,
            canPayment: false,
            customerInfo: null,
            payInfo: {
                paymentMethods: "cash",
                discount: 0,
                amount: 0,
            },
            closable: true,
            billCode: null,
            isShipping: false,
            isNewShippingInfo: false,
            shippingInfo: null,
            customerAddresses: [],
            addressShipping: null,
            detailAddressShipping: {
                provinceId: null,
                districtId: null,
                wardId: null,
                specificAddress: '',
            },
            recipientName: '',  // Số điện thoại người nhận hàng
            recipientPhoneNumber: '', // Tên ngươi nhận
            shippingFee: 0
        },
    ]);

    const onEditTab = (targetKey, action) => {
        if (action === "remove") {
            setItems(items.filter((item) => item.key !== targetKey));
        }
        if (action === "add") {
            handleOnCreateBill()
        }
    };



    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5, // Số dòng hiển thị mỗi trang
    });
    const [currentBill, setCurrentBill] = useState() // 1 mảng các sản phẩm
    const [open, setOpen] = useState(false);
    const [vouchers, setVouchers] = useState()
    const [selectedVouchers, setSelectedVouchers] = useState({});

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
        getAllVoucher()
        getCurrentUserLogin()
    }, []);

    const getCurrentUserLogin = async () => {
        const response = await axiosInstance.get("/api/authentication/user-info")
        console.log("response", response)
    }

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


    const handleCashCustomerMoneyChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setItems(prevItems =>
            prevItems.map(item =>
                item.key === currentBill
                    ? {
                        ...item,
                        payInfo: {
                            ...item.payInfo,
                            cashCustomerMoney: value,
                            customerMoney: value + (item.payInfo?.bankCustomerMoney || 0),
                            change: (value + (item.payInfo?.bankCustomerMoney || 0)) - (item.payInfo?.amount || 0)
                        }
                    }
                    : item
            )
        );
    };


    const handleBankCustomerMoneyChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setItems(prevItems =>
            prevItems.map(item =>
                item.key === currentBill
                    ? {
                        ...item,
                        payInfo: {
                            ...item.payInfo,
                            bankCustomerMoney: value,
                            customerMoney: value + (item.payInfo?.cashCustomerMoney || 0),
                            change: (value + (item.payInfo?.cashCustomerMoney || 0)) - (item.payInfo?.amount || 0)
                        }
                    }
                    : item
            )
        );
    };


    useEffect(() => {
        setItems(prevItems => {
            const newItems = prevItems.map(item => {
                const totalAmount = item.payInfo?.amount || 0;
                const customerMoney = item.payInfo?.customerMoney || 0;
                const canPay = totalAmount > 0 && customerMoney >= totalAmount && !item.isSuccess;

                return {
                    ...item,
                    canPayment: canPay
                };
            });
            // So sánh mảng cũ và mới, nếu giống nhau thì không cập nhật state
            const isSame = prevItems.every((item, index) => item.canPayment === newItems[index].canPayment);
            return isSame ? prevItems : newItems;
        });
    }, [items]);

    const handleOnCreateBill = () => {
        if (items.length >= 10) {
            toast.warning("Đạt giới hạn hóa đơn")
            return;
        }
        const newKey = (items.length + 1).toString(); // Tạo key mới cho hóa đơn
        const timestamp = moment().format("HH:mm:ss"); // Lấy thời gian hiện tại (giờ:phút:giây)
        const newItem = {
            key: newKey,
            itemName: ` Hóa đơn ${moment().format("HH:mm:ss")}`,
            label: (
                <span>
                     Hóa đơn {timestamp} <Badge showZero={true} className={"mb-2"} count={
                    0
                } offset={[5, -5]}/>
                </span>
            ),
            productList: [],
        };
        setItems([...items, newItem]);
    };

    useEffect(() => {
        // Chờ đợi sau 0.5 thì gửi api về server trừ đi product bên trong.
        const timeout = setTimeout(() => {
            postChangeQuantityProduct(products)
        }, 500);

        return () => clearTimeout(timeout); // Dọn dẹp timeout nếu `products` thay đổi trước khi 0.5s trôi qua
    }, products)



    const handleOnAddProductToBill = (record) => {
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === currentBill) {
                    const existingProduct = item.productList.find(p => p.key === record.key);

                    let updatedProductList;
                    if (existingProduct) {
                        // Tăng số lượng nếu sản phẩm đã có
                        updatedProductList = item.productList.map(p =>
                            p.key === record.key ? {...p, quantityInCart: p.quantityInCart + 1} : p
                        );
                    } else {
                        // Thêm sản phẩm mới
                        updatedProductList = [...item.productList, {...record, quantityInCart: 1}];
                    }

                    // Tính tổng tiền mới sau khi thêm sản phẩm
                    const newTotalAmount = calculateTotalAmount({productList: updatedProductList});

                    // Tìm voucher tốt nhất
                    const bestVoucher = findBestVoucher(newTotalAmount);

                    // Áp dụng voucher nếu có
                    const discountAmount = bestVoucher
                        ? bestVoucher.discountType === "PERCENT"
                            ? (newTotalAmount * bestVoucher.discountValue) / 100
                            : bestVoucher.discountValue
                        : 0;

                    const newTotalAfterDiscount = Math.max(0, newTotalAmount - discountAmount);

                    setSelectedVouchers(prev => ({
                        ...prev,
                        [currentBill]: bestVoucher
                    }));

                    // Gọi api về trừ số lượng trong kho đồng thời tìm kiếm trừ ở table


                    setProducts(prevProducts => prevProducts.map(
                        (product) => {
                            if (product.id === record.id) {
                                return {
                                    ...product,
                                    quantity: product.quantity - 1
                                }
                            }
                            return product
                        }
                    ))

                    return {
                        ...item,
                        productList: updatedProductList,
                        label: (
                            <span>
                                  {item.itemName} <Badge showZero={true} className={"mb-2"}
                                                         count={updatedProductList.length ?? 0}/>
                              </span>
                        ),

                        payInfo: {
                            ...item.payInfo,
                            amount: newTotalAfterDiscount,
                            discount: discountAmount,
                            change: ((item.payInfo?.cashCustomerMoney || 0) + (item.payInfo?.bankCustomerMoney || 0)) - newTotalAfterDiscount
                        }
                    };
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
                            amount: calculateTotalAmount({productList: item.productList.filter(p => p.key !== product.key)}),
                            change: (item.payInfo.customerMoney || 0) - calculateTotalAmount({productList: item.productList.filter(p => p.key !== product.key)})
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
                    const updatedProductList = item.productList.map(p => {
                            if (p.key === product.key) {
                                if (value >= product.quantity) {
                                    toast.warning(`Số lượng sản phẩm không đủ, tối đa ${product.quantity}`)
                                    return {...p, quantityInCart: product.quantity}
                                }
                                return {...p, quantityInCart: value}
                            }
                            return p
                        }
                    );
                    return {
                        ...item,
                        productList: updatedProductList,
                        payInfo: {
                            ...item.payInfo,
                            amount: calculateTotalAmount({productList: updatedProductList}), // Cập nhật tổng tiền
                            change: (item.payInfo.customerMoney || 0) - calculateTotalAmount({productList: updatedProductList})
                        }
                    };
                }
                return item;
            })
        );
    };

    const initShipping = {
        provinceId: null,
        districtId: null,
        wardId: null,
        specificAddress: null,
    }

    const onCustomerSelect = async (customer) => {
        // Hàm trợ giúp để lấy các trường địa chỉ một cách an toàn
        let customerAddresses = await Promise.all(customer?.addresses?.map(async (ca) => {
            return {
                value: ca.id,
                label: await generateAddressString(ca.provinceId, ca.districtId, ca.wardId, ca.specificAddress),
            };
        }));
        customerAddresses.push({
            value: "other",
            label: "Khác"
        })
        // Cập nhật thông tin khách hàng và địa chỉ giao hàng cho hóa đơn hiện tại
        setItems((prevItems) =>
            prevItems.map((item) => {
                    if (item.key === currentBill) {
                        return {
                            ...item, customerInfo: customer,
                            customerAddresses: customerAddresses,
                            recipientName: customer?.fullName,
                            recipientPhoneNumber: customer?.phoneNumber
                        }
                    }

                    return item // Các mục khác giữ nguyên
                }
            )
        );
    };


    // Hàm tính tổng tiền giỏ hàng
    const calculateTotalAmount = (bill) => {
        return bill.productList.reduce((total, product) => {
            return total + (product.price * (product.quantityInCart || 1));
        }, 0);
    };

    const getAllVoucher = () => {
        axios.get(`${baseUrl}/api/admin/voucher/hien`).then((res) => {
            setVouchers(res.data.data)
            console.log(res.data)
        })
    }


    const handleOnSelectedVoucher = (voucher) => {
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === currentBill) {
                    // Kiểm tra xem voucher hiện tại có phải voucher đã chọn không
                    if (selectedVouchers[currentBill]?.id === voucher.id) {
                        toast.warning("Voucher này đã được chọn!");
                        return item;
                    }

                    // Tính lại tổng số tiền gốc của sản phẩm (chưa áp dụng voucher nào)
                    const originalTotal = calculateTotalAmount(item);

                    // Tính giá trị giảm giá dựa trên tổng số tiền gốc
                    const discountAmount =
                        voucher.discountType === "PERCENT"
                            ? (originalTotal * voucher.discountValue) / 100
                            : voucher.discountValue;

                    // Tính số tiền mới sau khi áp dụng voucher
                    const newTotal = Math.max(0, originalTotal - discountAmount);
                    return {
                        ...item,
                        payInfo: {
                            ...item.payInfo,
                            amount: newTotal,
                            discount: discountAmount,
                            change: ((item.payInfo?.cashCustomerMoney || 0) + (item.payInfo?.bankCustomerMoney || 0)) - newTotal
                        }
                    };
                }
                return item;
            })
        );

        // Cập nhật voucher đã chọn cho hóa đơn hiện tại
        setSelectedVouchers(prev => ({
            ...prev,
            [currentBill]: voucher
        }));
    };


    const handleCheckIsShipping = (e) => {
        const isChecked = e.target.checked;
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === currentBill) {
                    return {
                        ...item,
                        isShipping: isChecked
                    };
                }
                return item;
            })
        );

    }

    const handleChangePaymentMethod = (value) => {
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === currentBill) {

                    return {
                        ...item,
                        payInfo: {
                            ...item.payInfo,
                            paymentMethods: value,
                            customerMoney: 0,
                            cashCustomerMoney: 0,
                            bankCustomerMoney: 0,
                            change: 0
                        }
                    };
                }
                return item;
            })
        );
    }

    const handleOnPayment = async () => {
        try {
            const bill = items.find(item => item.key === currentBill);
            if (!bill) {
                toast.error("Không tìm thấy hóa đơn hiện tại.");
                return;
            }
            const payload = {
                customerId: bill.customerInfo?.id || null,
                customerMoney: bill.payInfo?.customerMoney || 0,
                cashCustomerMoney: bill.payInfo?.cashCustomerMoney || 0,
                bankCustomerMoney: bill.payInfo?.bankCustomerMoney || 0,
                isCashAndBank: !!(bill.payInfo?.cashCustomerMoney && bill.payInfo?.bankCustomerMoney),
                discountMoney: bill.payInfo?.discount || 0,
                shipMoney: bill.isShipping ? bill.shippingFee || 0 : 0,
                totalMoney: bill.payInfo?.amount || 0,
                moneyAfter: (bill.payInfo?.amount || 0) - (bill.payInfo?.discount || 0),
                completeDate: null, // Có thể cập nhật nếu cần
                confirmDate: new Date().toISOString(),
                desiredDateOfReceipt: null,
                shipDate: null,
                shippingAddressId: bill.addressShipping?.id || bill.customerInfo?.addresses?.[0]?.id || null,
                numberPhone: bill.recipientPhoneNumber || bill.customerInfo?.phoneNumber || "",
                email: bill.customerInfo?.email || "",
                typeBill: "OFFLINE", // Hoặc "ONLINE" tùy vào logic của bạn
                notes: "",
                status: "DA_HOAN_THANH", // Có thể thay đổi trạng thái hóa đơn
                voucherId: selectedVouchers[currentBill]?.id || null,
                isShipping: bill.isShipping || false,
                recipientName: bill.recipientName || "",
                recipientPhoneNumber: bill.recipientPhoneNumber || "",
                shippingFee: bill.shippingFee || 0,
                address: {
                    provinceId: bill.detailAddressShipping?.provinceId || null,
                    districtId: bill.detailAddressShipping?.districtId || null,
                    wardId: bill.detailAddressShipping?.wardId || null,
                    specificAddress: bill.detailAddressShipping?.specificAddress || "",
                },
                billDetailRequests: bill.productList.map(product => ({
                    price: product.price,
                    productDetailId: product.id,
                    quantity: product.quantityInCart
                }))
            };


            const response = await axiosInstance.post(`/api/admin/bill/create`, payload);
            if (response.status === 200) {
                setItems(prevItems =>
                    prevItems.map(item => {
                        if (item.key === currentBill) {

                            return {
                                ...item,
                                isSuccess: true,
                                billCode: response.data?.billCode
                            };
                        }
                        return item;
                    })
                );
                toast.success("Tạo hóa đơn thành công!");

            } else {
                toast.error("Tạo hóa đơn thất bại!");
            }
        } catch (error) {

            toast.error("Có lỗi xảy ra khi tạo hóa đơn.");
        }
    };

    const findBestVoucher = (totalAmount) => {
        if (!vouchers || vouchers.length === 0) return null;

        let bestVoucher = null;
        let maxDiscount = 0;

        vouchers.forEach(voucher => {
            const discount =
                voucher.discountType === "PERCENT"
                    ? (totalAmount * voucher.discountValue) / 100
                    : voucher.discountValue;

            if (discount > maxDiscount) {
                maxDiscount = discount;
                bestVoucher = voucher;
            }
        });

        return bestVoucher;
    };

    const handleOnPrintBill = async () => {
        // GỌI HÀM IN HÓA ĐƠN
        const id = items.find((item) => item.key === currentBill).billCode;

        if (id) {
            const result = await printBillService(id)
            const pdfBlob = new Blob([result], {type: 'application/pdf'});
            console.log(pdfBlob)
            const pdfUrl = URL.createObjectURL(pdfBlob);

            const newTab = window.open(pdfUrl, "_blank"); // Mở tab mới với PDF
            if (newTab) {
                newTab.onload = () => {
                    newTab.print(); // Tự động in
                };
            } else {
                alert("Hãy cho phép mở popup để in PDF!");
            }
        }
    }

    const onAddressChange = async (selectedProvince, selectedDistrict, selectedWard, specificAddress) => {
        let totalFee = items.find((item) => item.key === currentBill).shippingFee ?? 0
        const isCurrentWard = !!items.find((item) => item.key === currentBill && item.detailAddressShipping.wardId === selectedWard);
        console.log("isCurrentWard", isCurrentWard); // true hoặc false
        if (selectedWard && !isCurrentWard) {
            const total =
                await calculateShippingFee({
                toWardCode: String(selectedWard),
                toDistrictId: selectedDistrict
            });
            console.log(total)
            totalFee = total
        }
        setItems((prevItems) =>
            prevItems.map((item) => {
                    if (item.key === currentBill) {
                        return {
                            ...item,
                            detailAddressShipping: {
                                provinceId: selectedProvince,
                                districtId: selectedDistrict,
                                wardId: selectedWard,
                                specificAddress: specificAddress ?? "",
                            },
                            shippingFee: totalFee

                        }
                    }

                    return item // Các mục khác giữ nguyên
                }
            )
        );
    }

    const onAddressSelected = (e) => {
        const addressId = e.target.value
        let detailAddress = null;
        // tìm customer
        // lấy ra địa chỉ nè
        const customer = items.find((item) => item.key === currentBill)?.customerInfo
        if (customer && customer?.addresses) {
            const address = customer.addresses.find((ads) => ads.id === addressId)
            detailAddress = {
                provinceId: address?.provinceId,
                districtId: address?.districtId,
                wardId: address?.wardId,
                specificAddress: address?.specificAddress,
            }
        }

        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === currentBill) {
                    return {
                        ...item,
                        addressShipping: addressId,
                        isNewShippingInfo: addressId === "other",
                        detailAddressShipping: detailAddress
                    };
                }
                return item;
            })
        );
    }

    const handleOnChangerRecipientPhoneNumber = (e) => {
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === currentBill) {
                    return {
                        ...item,
                        recipientPhoneNumber: e.target.value
                    };
                }
                return item;
            })
        );
    }

    const handleOnChangerRecipientName = (e) => {

        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === currentBill) {
                    return {
                        ...item,
                        recipientName: e.target.value
                    };
                }
                return item;
            })
        );
    }

    const handleOnChangeShippingFee = (e) => {
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === currentBill) {
                    return {
                        ...item,
                        shippingFee: e.target.value
                    };
                }
                return item;
            })
        );
    }

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
                    type="editable-card"
                    onEdit={onEditTab}
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
                vouchers={vouchers}
                handleOnSelectedVoucher={handleOnSelectedVoucher}
                amount={items.find(item => item.key === currentBill)?.payInfo?.amount || 0}
                isShipping={items.find(item => item.key === currentBill)?.isShipping || false}
                change={items.find(item => item.key === currentBill)?.payInfo?.change || 0}
                customerMoney={items.find(item => item.key === currentBill)?.payInfo?.customerMoney || 0}
                handleCustomerMoneyChange={handleCustomerMoneyChange}
                selectedVouchers={selectedVouchers[currentBill]}
                discount={items.find(item => item.key === currentBill)?.payInfo?.discount || 0}
                handleCheckIsShipping={handleCheckIsShipping}
                paymentMethods={items.find(item => item.key === currentBill)?.payInfo?.paymentMethods || "bank"}
                handleChangePaymentMethod={handleChangePaymentMethod}
                handleCashCustomerMoneyChange={handleCashCustomerMoneyChange}
                handleBankCustomerMoneyChange={handleBankCustomerMoneyChange}
                bankCustomerMoney={items.find(item => item.key === currentBill)?.payInfo?.bankCustomerMoney || 0}
                cashCustomerMoney={items.find(item => item.key === currentBill)?.payInfo?.cashCustomerMoney || 0}
                handleOnPayment={handleOnPayment}
                isSuccess={items.find(item => item.key === currentBill)?.isSuccess}
                handleOnPrintBill={handleOnPrintBill}
                canPayment={items.find((item) => item.key === currentBill)?.canPayment}
                addressShipping={items.find((item) => item.key === currentBill)?.addressShipping}
                onAddressChange={onAddressChange}
                customerAddresses={items.find((item) => item.key === currentBill)?.customerAddresses}
                onAddressSelected={onAddressSelected}
                recipientPhoneNumber={items.find((item) => item.key === currentBill)?.recipientPhoneNumber}
                recipientName={items.find((item) => item.key === currentBill)?.recipientName}
                isNewShippingInfo={items.find((item) => item.key === currentBill)?.isNewShippingInfo}
                detailAddressShipping={items.find((item) => item.key === currentBill)?.detailAddressShipping}
                customerInfo={items.find((item) => item.key === currentBill)?.customerInfo}
                shippingFee={items.find((item) => item.key === currentBill)?.shippingFee}
                handleOnChangeShippingFee={handleOnChangeShippingFee}
                handleOnChangerRecipientName={handleOnChangerRecipientName}
                handleOnChangerRecipientPhoneNumber={handleOnChangerRecipientPhoneNumber}
            />
        </div>
    );
};
export default SalesPage;
