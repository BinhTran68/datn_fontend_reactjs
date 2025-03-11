import React, {useEffect, useState} from 'react';
import {
    Badge,
    Button,
    Card,
    message, Modal,
    Table,
    Tabs,
} from "antd";
import {toast} from "react-toastify";
import {salesColumns} from "./columns/columns.jsx";
import {fetchProducts} from "../product/ProductDetail/ApiProductDetail.js";
import CustomerSelect from "./component/CustomerSelect.jsx";
import axios from "axios";
import moment from "moment/moment.js";
import SalePaymentInfo from "./component/SalePaymentInfo.jsx";
import {baseUrl, calculateShippingFee, generateAddressString} from "../../helpers/Helpers.js";
import {printBillService} from "../bill/services/printBillService.js";
import {postChangeQuantityProduct} from "./billService.js";
import axiosInstance from "../../utils/axiosInstance.js";
import ProductDetailModal from "./component/ProductDetailModal.jsx";
import printJS from 'print-js';

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
            handleCloseTab(targetKey);
        }
        if (action === "add") {
            handleOnCreateBill();
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
        // Chờ đợi sau 0.5s thì gửi api về server để cập nhật số lượng sản phẩm
        const timeout = setTimeout(async () => {
            try {
                await postChangeQuantityProduct(products);
                // Có thể thêm thông báo thành công nếu cần
                // toast.success("Cập nhật số lượng thành công");
            } catch (error) {
                // Xử lý lỗi và thông báo cho người dùng
                toast.error("Lỗi khi cập nhật số lượng sản phẩm");
                console.error("Error updating product quantities:", error);
            }
        }, 500);

        // Cleanup function để tránh memory leak
        return () => clearTimeout(timeout);
    }, [products]); // Sửa lại dependency array



    const handleOnAddProductToBill = (record) => {
        if (!currentBill) {
            toast.warning("Vui lòng chọn hóa đơn trước khi thêm sản phẩm");
            return;
        }

        if (record.quantity <= 0) {
            toast.warning("Sản phẩm đã hết hàng");
                return;
        }
        
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === currentBill) {
                    const existingProduct = item.productList?.find(p => p.id === record.id);

                    let updatedProductList;
                    if (existingProduct) {
                        // Kiểm tra số lượng trước khi tăng
                        if (existingProduct.quantityInCart >= record.quantity) {
                            toast.warning(`Số lượng sản phẩm không đủ, tối đa ${record.quantity}`);
                            return item;
                        }
                        // Tăng số lượng nếu sản phẩm đã có
                        updatedProductList = item.productList.map(p =>
                            p.id === record.id ? {...p, quantityInCart: p.quantityInCart + 1} : p
                        );
                    } else {
                        // Thêm sản phẩm mới
                        updatedProductList = [...(item.productList || []), {...record, quantityInCart: 1}];
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

                    // Cập nhật số lượng sản phẩm trong kho
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
                    ));

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
        // Nếu customer là null (trường hợp xóa selection)
        if (!customer) {
            setItems((prevItems) =>
                prevItems.map((item) => {
                    if (item.key === currentBill) {
                        return {
                            ...item,
                            customerInfo: null,
                            customerAddresses: [],
                            recipientName: '',
                            recipientPhoneNumber: '',
                            addressShipping: null,
                            detailAddressShipping: {
                                provinceId: null,
                                districtId: null,
                                wardId: null,
                                specificAddress: ''
                            },
                            isNewShippingInfo: false,
                            feeShipping: 0
                        };
                    }
                    return item;
                })
            );
            return;
        }

        // Trường hợp chọn khách hàng
        try {
            let customerAddresses = await Promise.all(
                customer.addresses?.map(async (ca) => {
                    const addressString = await generateAddressString(
                        ca.provinceId,
                        ca.districtId,
                        ca.wardId,
                        ca.specificAddress
                    );
                    return {
                        value: ca.id,
                        label: addressString,
                        details: ca // Lưu thông tin chi tiết của địa chỉ
                    };
                }) || []
            );

            // Thêm option "Khác" vào cuối danh sách địa chỉ
            customerAddresses.push({
                value: "other",
                label: "Địa chỉ khác"
            });

            setItems((prevItems) =>
                prevItems.map((item) => {
                    if (item.key === currentBill) {
                        return {
                            ...item,
                            customerInfo: customer,
                            customerAddresses: customerAddresses,
                            recipientName: customer.fullName || '',
                            recipientPhoneNumber: customer.phoneNumber || '',
                            // Nếu khách hàng có địa chỉ, set địa chỉ đầu tiên làm mặc định
                            addressShipping: customer.addresses?.[0]?.id || null,
                            detailAddressShipping: customer.addresses?.[0] ? {
                                provinceId: customer.addresses[0].provinceId,
                                districtId: customer.addresses[0].districtId,
                                wardId: customer.addresses[0].wardId,
                                specificAddress: customer.addresses[0].specificAddress
                            } : {
                                provinceId: null,
                                districtId: null,
                                wardId: null,
                                specificAddress: ''
                            },
                            isNewShippingInfo: false
                        };
                    }
                    return item;
                })
            );
        } catch (error) {
            console.error("Lỗi khi xử lý địa chỉ khách hàng:", error);
            // Có thể thêm thông báo lỗi cho người dùng ở đây
            message.error("Có lỗi xảy ra khi tải thông tin địa chỉ khách hàng");
        }
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
                        isShipping: isChecked,
                        shippingFee: 0
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
        try {
            const id = items.find((item) => item.key === currentBill)?.billCode;
            
            if (!id) {
                toast.error("Không tìm thấy mã hóa đơn");
                return;
            }

            const result = await printBillService(id);
            
            // Tạo Blob và URL
            const pdfBlob = new Blob([result], {type: 'application/pdf'});
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Tạo một div container cho PDF viewer
            const printContainer = document.createElement('div');
            printContainer.style.position = 'fixed';
            printContainer.style.top = '0';
            printContainer.style.left = '0';
            printContainer.style.width = '100%';
            printContainer.style.height = '100%';
            printContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
            printContainer.style.zIndex = '9999';
            printContainer.style.display = 'flex';
            printContainer.style.justifyContent = 'center';
            printContainer.style.alignItems = 'center';

            // Tạo PDF viewer
            const pdfViewer = document.createElement('embed');
            pdfViewer.src = pdfUrl;
            pdfViewer.type = 'application/pdf';
            pdfViewer.style.width = '80%';
            pdfViewer.style.height = '80%';

            // Thêm nút đóng
            const closeButton = document.createElement('button');
            closeButton.innerHTML = 'Đóng';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.padding = '5px 10px';
            closeButton.style.cursor = 'pointer';

            // Thêm nút in
            const printButton = document.createElement('button');
            printButton.innerHTML = 'In';
            printButton.style.position = 'absolute';
            printButton.style.top = '10px';
            printButton.style.right = '80px';
            printButton.style.padding = '5px 10px';
            printButton.style.cursor = 'pointer';

            // Thêm sự kiện cho nút đóng
            closeButton.onclick = () => {
                document.body.removeChild(printContainer);
                URL.revokeObjectURL(pdfUrl);
            };

            // Thêm sự kiện cho nút in
            printButton.onclick = () => {
                const printWindow = window.open(pdfUrl, '_blank');
                if (printWindow) {
                    printWindow.addEventListener('load', () => {
                        printWindow.print();
                    });
                } else {
                    toast.warning("Vui lòng cho phép mở popup để in hóa đơn");
                }
            };

            // Thêm các phần tử vào container
            printContainer.appendChild(pdfViewer);
            printContainer.appendChild(closeButton);
            printContainer.appendChild(printButton);
            document.body.appendChild(printContainer);

        } catch (error) {
            console.error("Lỗi khi in hóa đơn:", error);
            toast.error("Có lỗi xảy ra khi in hóa đơn");
        }
    };

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

    const onAddressSelected = async (e) => {
        const addressId = e.target.value
        let detailAddress = null;
        let feeShipping = 0;
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
        console.log("detailAddress", detailAddress)
        
        if(detailAddress?.wardId && detailAddress?.districtId){
             feeShipping = await calculateShippingFee({
                toWardCode: String(detailAddress?.wardId),
                toDistrictId: Number(detailAddress?.districtId)
            })
        }
        
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === currentBill) {
                    return {
                        ...item,
                        addressShipping: addressId,
                        isNewShippingInfo: addressId === "other",
                        detailAddressShipping: detailAddress,
                        shippingFee: feeShipping
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

    const  eventProductDetailChange = (value) => {
        setItems(prevItems => 
            prevItems.map(item => {
                // Kiểm tra trong từng hóa đơn
                const existingProductIndex = item.productList.findIndex(p => p.id === value.id);
                console.log("existingProductIndex", existingProductIndex)
                if (existingProductIndex !== -1) {
                    // Nếu sản phẩm đã tồn tại trong hóa đơn
                    const updatedProductList = [...item.productList];
                    updatedProductList[existingProductIndex] = {
                        ...value,
                        quantityInCart: item.productList[existingProductIndex].quantityInCart
                    };
                    toast.success("Sản phẩm vừa được cập nhật")
                    // Tính lại tổng tiền
                    const newTotalAmount = calculateTotalAmount({productList: updatedProductList});
                    
                    // Tìm và áp dụng lại voucher nếu có
                    const bestVoucher = findBestVoucher(newTotalAmount);
                    const discountAmount = bestVoucher
                        ? bestVoucher.discountType === "PERCENT"
                            ? (newTotalAmount * bestVoucher.discountValue) / 100
                            : bestVoucher.discountValue
                        : 0;
    
                    const newTotalAfterDiscount = Math.max(0, newTotalAmount - discountAmount);

                    return {
                        ...item,
                        productList: updatedProductList,
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
    }

    const handleCloseTab = async (targetKey) => {
        try {
            // Tìm bill đang đóng
            const closingBill = items.find(item => item.key === targetKey);
            
            if (!closingBill) return;

            // Nếu chưa thanh toán và có sản phẩm trong bill
            if (!closingBill.isSuccess && closingBill.productList.length > 0) {
                // Hoàn trả số lượng về server
                const restoreQuantityPayload = closingBill.productList.map(product => ({
                    id: product.id,
                    quantity: product.quantityInCart || 0
                }));

                await axiosInstance.post('/api/admin/bill/restore-quantity', restoreQuantityPayload);

                // Cập nhật lại state products local
                setProducts(prevProducts => 
                    prevProducts.map(product => {
                        const returnProduct = closingBill.productList.find(p => p.id === product.id);
                        if (returnProduct) {
                            return {
                                ...product,
                                quantity: product.quantity + (returnProduct.quantityInCart || 0)
                            };
                        }
                        return product;
                    })
                );
            }

            // Xóa bill khỏi danh sách
            setItems(items.filter(item => item.key !== targetKey));

        } catch (error) {
            console.error("Error when closing bill:", error);
            toast.error("Có lỗi xảy ra khi đóng hóa đơn");
        }
    };

    return (
        <div className={"d-flex flex-column gap-3"}>
            <Modal
                open={open}
                width={"75%"}
                onOk={handleOk}
                onCancel={handleCancel}
            >

                <ProductDetailModal
                    handleOnAddProductToBill={handleOnAddProductToBill}
                    eventProductDetailChange={eventProductDetailChange}
                    products={products}
                    setProducts={setProducts}
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
