import { useState,useEffect  } from "react";
import { Input, Badge, Dropdown, Avatar,Menu,Button } from "antd";
import {
    UserOutlined,
    ShoppingCartOutlined,
    SearchOutlined,
    HistoryOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";





const Navigation = ({ searchValue, setSearchValue }) => {
    const [isOpenDrawer, setOpenDrawer] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});

    const showDrawer = () => {
        setOpenDrawer(true);
    };

    const handleSearchEnter = () => {
        if (searchValue.trim()) {
            navigate(`/filter?search=${encodeURIComponent(searchValue)}`);
        } else {
            navigate("/filter");
        }
    };

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchValue(value);

        if (value.trim()) {
            try {
                // Gọi API với tham số tìm kiếm
                const response = await getAllSanPhamByCustomerFilterApi({
                    tenSanPham: value,
                });
                const filteredSuggestions = response.data.content;
                const locProduct = filteredSuggestions.filter(
                    (product) => product.soLuongSanPhamChiTiet > 0
                );
                setSuggestions(locProduct);
                setDropdownVisible(true);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu từ API:", error);
                setSuggestions([]);
                setDropdownVisible(false);
            }
        } else {
            setDropdownVisible(false);
        }
    };

    const handleItemClick = (id) => {
        navigate(`/detail/${id}`);
        setDropdownVisible(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        setIsLoggedIn(false);
        navigate("/auth/login");
    };

    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            setUserInfo(parsedUserInfo);
        }
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        setIsLoggedIn(!!accessToken);
    }, []);

    const userMenu = (
        <Menu>
            <Menu.Item key="profile">
                <Link to="/profile">
                    <UserOutlined /> Hồ sơ
                </Link>
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
                <LogoutOutlined /> Đăng xuất
            </Menu.Item>
        </Menu>
    );

    const cartCount = 5;

    return (
        <div>
            <p className="bg-dark text-white text-center py-2 mb-0 small">
                3HST Shoes - Nhà sưu tầm và phân phối chính hãng các thương hiệu thời
                trang quốc tế hàng đầu Việt Nam
            </p>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        <img
                            src="\src\assets\images\logo9.png"
                            alt="Logo"
                            className="me-2"
                            style={{ height: "40px" }}
                        />
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className="collapse navbar-collapse justify-content-between"
                        id="navbarNav"
                    >
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/sanpham" className="nav-link">
                                    Trang Chủ
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/filter" className="nav-link">
                                    Sản Phẩm
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about" className="nav-link">
                                    Giới Thiệu
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/invoice-lookup" className="nav-link">
                                    Tra cứu đơn hàng
                                </Link>
                            </li>
                        </ul>
                        <div className="d-flex align-items-center">
                            <Dropdown
                                overlay={
                                    <Menu>
                                        {suggestions.length > 0 ? (
                                            suggestions.map((item) => (
                                                <Menu.Item
                                                    key={item.id}
                                                    onClick={() =>
                                                        handleItemClick(item.id)
                                                    }
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={item.hinhAnh}
                                                            alt={item.name}
                                                            className="me-2"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                            }}
                                                        />
                                                        <div>
                                                            <p className="mb-0 fw-bold">
                                                                {item.tenSanPham}
                                                            </p>
                                                            <p className="mb-0 text-muted">
                                                                {item.giaHienThi}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Menu.Item>
                                            ))
                                        ) : (
                                            <Menu.Item disabled>
                                                Không tìm thấy sản phẩm
                                            </Menu.Item>
                                        )}
                                    </Menu>
                                }
                                visible={isDropdownVisible}
                                onVisibleChange={(visible) =>
                                    setDropdownVisible(visible)
                                }
                                placement="bottomCenter"
                            >
                                <Input
                                    prefix={<SearchOutlined />}
                                    placeholder="Tìm kiếm"
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    onPressEnter={handleSearchEnter}
                                    style={{ width: "200px" }}
                                />
                            </Dropdown>
                            <Badge count={cartCount} className="ms-3">
                                <ShoppingCartOutlined
                                    onClick={() => setOpenDrawer(true)}
                                    style={{
                                        fontSize: "24px",
                                        cursor: "pointer",
                                    }}
                                />
                            </Badge>
                            {isLoggedIn ? (
                                <Dropdown overlay={userMenu} className="ms-3">
                                    <Avatar
                                        src={userInfo.avatar}
                                        icon={<UserOutlined />}
                                    />
                                </Dropdown>
                            ) : (
                                <Link to="/auth/
" className="ms-3">
                                    <Button type="primary">Đăng nhập</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navigation;

