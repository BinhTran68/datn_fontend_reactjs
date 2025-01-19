import React from "react";
import {Navigate} from "react-router-dom";
import Dashboard from "../admin/dashboard/Dashboard.jsx";

import VoucheList from "../admin/Voucher/VoucheList.jsx";
import PromotionList from "../admin/Voucher/PromotionList.jsx";
import AddPromotion from "../admin/Voucher/AddPromotion.jsx";
import Admin from "../admin/Admin.jsx";
import SalesPage from "../admin/sales-page/Sales-page.jsx";
import Statistical from "../admin/statistical/Statistical.jsx";

// thuoc tinh sp
import Brand from "../admin/product/Brand/Brand.jsx";
import Color from "../admin/product/Color/Color.jsx";
import Gender from "../admin/product/Gender/Gender.jsx";
import Material from "../admin/product/Material/Material.jsx";
import Product from "../admin/product/Product/Product.jsx";
import Size from "../admin/product/Size/Size.jsx";
import Sole from "../admin/product/Sole/Sole.jsx";
import Type from "../admin/product/Type/Type.jsx";
// import Product from "../admin/product/ProductComponent/Product.jsx";
import ProductDetail from "../admin/product/ProductDetail/ProductDetail.jsx"

import AddCustomer from "../customer/AddCustomer.jsx";
import AddressFormModal from "../customer/AddressFormModal.jsx";
import AddressModal from "../customer/AddressModal.jsx";
import Customer from "../customer/Customer.jsx";
import UpdateCustomerForm from "../customer/UpdateCustomerForm.jsx";
import {App} from "antd";
import Abc from "../customer/Abc.jsx";

import BillDetail from "../admin/bill/BillDetail.jsx";
import BillList from "../admin/bill/BillList.jsx";

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
            path: "brand",
            element: <PrivateRoute element={<Brand/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "color",
            element: <PrivateRoute element={<Color/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "gender",
            element: <PrivateRoute element={<Gender/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "material",
            element: <PrivateRoute element={<Material/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "product",
            element: <PrivateRoute element={<Product/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "size",
            element: <PrivateRoute element={<Size/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "sole",
            element: <PrivateRoute element={<Sole/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "type",
            element: <PrivateRoute element={<Type/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "productdetail",
            element: <PrivateRoute element={<ProductDetail/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
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
            path: "bill",
            element: <PrivateRoute element={<BillList/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "bill/bill-detail/:id",
            element: <PrivateRoute element={<BillDetail/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "vouchelist",
            element: <PrivateRoute element={<VoucheList/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "PromotionList",
            element: <PrivateRoute element={<PromotionList/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "promotion/add",
            element: <PrivateRoute element={<AddPromotion/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "addCustomer",
            element: <PrivateRoute element={<AddCustomer/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "addressFormModal",
            element: <PrivateRoute element={<AddressFormModal/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "adressModal",
            element: <PrivateRoute element={<AddressModal/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "customer",
            element: <PrivateRoute element={<Customer/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "updateCustomerForm",
            element: <PrivateRoute element={<UpdateCustomerForm/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "app",
            element: <PrivateRoute element={<App/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },
        {
            path: "abc",
            element: <PrivateRoute element={<Abc/>} allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}/>,
        },

    ],
};

export default AdminRouters;
