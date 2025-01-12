import React from "react";
import {Navigate} from "react-router-dom";
import Dashboard from "../admin/dashboard/Dashboard.jsx";
import BillList from "../admin/dashboard/BillList.jsx";
import VoucheList from "../admin/Voucher/VoucheList.jsx";
import PromotionList from "../admin/Voucher/PromotionList.jsx";
import Admin from "../admin/Admin.jsx";
import SalesPage from "../admin/sales-page/Sales-page.jsx";
import Statistical from "../admin/statistical/Statistical.jsx";
import Category from "../admin/product/Category.jsx";
// import SanPham from "../admin/pages/product/SanPham";
// import DeGiay from "../admin/pages/product/DeGiay";
// import KichThuoc from "../admin/pages/product/KichThuoc";
// import ChatLieu from "../admin/pages/product/ChatLieu";
// import ThuongHieu from "../admin/pages/product/ThuongHieu";
// import MauSac from "../admin/pages/product/MauSac";
// import DanhMuc from "../admin/pages/product/DanhMuc";
// import BanHang from "../admin/pages/banhang/BanHang";
// import GiamGia from "../admin/pages/giamgia/GiamGia";
// import Nhanvien from "../admin/pages/taikhoan/Nhanvien";
// import KhachHang from "../admin/pages/taikhoan/KhachHang";
// import ThongKe from "../admin/pages/thongke/ThongKe";
// import SanPhamChiTiet from "../admin/pages/product/SanPhamChiTiet";
// import DotGiamGia from "../admin/pages/giamgia/DotGiamGia";
// import FormAddDotGiamGia from "../admin/component/giamgia/DrawerAdd";
// import ViewEditDotGiamGia from "../admin/component/giamgia/ViewEdit";
// import OrderManagement from "../admin/component/banhang/OrderManagement";
// import OrderDetail from "../admin/component/banhang/OrderDetail";
// import TongQuan from "../admin/pages/thongke/TongQuan";
// import Admin from "../admin/pages/Admin";

const getRole = () => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        return parsedUserInfo?.vaiTro || null;
    }
    return null;
};

const PrivateRoute = ({element, allowedRoles}) => {
    const role = getRole();
    // if (allowedRoles.includes(role)) {
    //   return element;
    // }

    if (true) {
        return element;
    }

    return <Navigate to="/forbidden" replace/>;
};

const AdminRouters = {
    path: "/admin",
    element: <Admin/>,
    children: [
        {
            path: "dashboard",
            element: <PrivateRoute element={<Dashboard/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "sales-page",
            element: <PrivateRoute element={<SalesPage/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "statistical",
            element: <PrivateRoute element={<Statistical/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "category",
            element: <PrivateRoute element={<Category/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {

            element: <PrivateRoute element={<Dashboard/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {

            element: <PrivateRoute element={<Dashboard/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        }, {

            element: <PrivateRoute element={<Dashboard/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        }, {

            element: <PrivateRoute element={<Dashboard/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },

        // {
        //   index: true,
        //   element: <PrivateRoute element={<BillList />} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />,
        // },

        {
            path: "billlist",
            element: <PrivateRoute element={<BillList/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "vouchelist",
            element: <PrivateRoute element={<VoucheList/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "promotionlist",
            element: <PrivateRoute element={<PromotionList/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },

    ],
};

export default AdminRouters;
