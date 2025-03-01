// import HomePage from "../customer/component/pages/HomePage";
// import TrangChu from "../customer/component/product/TrangChu";
// import FilterProduct from "../customer/component/product/FilterProduct";
// import ProductDetail from "../customer/component/product/ProductDetail";
// import PreCheckout from "../customer/component/shopon/PreCheckout";
// import OrderConfirmation from "../customer/component/shopon/OrderConfirmation";
// import InvoiceLookup from "../customer/component/shopon/InvoiceLookup";
// import GioiThieu from "../customer/component/gioithieu/GioiThieu";
// import FailedPay from "../customer/component/shopon/FailedPay";
// import HandlePayment from "../customer/component/shopon/HandlePayment"
// import AccountInfo from "../customer/component/profile/AccountInfo";
import { Navigate } from "react-router-dom";
import HomePage from "../client/page/home/HomePage.jsx";
import Client from "../client/Client.jsx";
import  CartPage  from "../client/page/cart/CartPage.jsx";
import ProductsPage from "../client/page/products/ProductsPage.jsx";
import Test from "../client/page/TestComponent/Test.jsx";


// import Product from "../admin/product/product.jsx";
// import ProductManagement from "../admin/product/ProductManagement.jsx";
// import Sole from "../admin/product/sole.jsx";
// import Size from "../admin/product/Size.jsx";
// import Material from "../admin/product/Material.jsx";
// import Color from "../admin/product/Color.jsx";
// import Category from "../admin/product/Brand/Brand.jsx";

import Trademark from "../admin/product/Trademark.jsx";
import VoucheList from "../admin/Voucher/VoucheList.jsx";
import PromotionList from "../admin/Voucher/PromotionList.jsx";
import ContactFrom from "../admin/contact/ContactForm.jsx";
import CustomerProfile from "../admin/profile/CustomerProfile.jsx";



import Login from "../auth/auth/Login.jsx";
import Register from "../auth/auth/Register.jsx";
import PayMent from "../client/page/cart/PayMent.jsx";
import { i } from "framer-motion/client";

// luồng bán hàng client
import ProductDetail from "../client/page/products/ProductDetail.jsx";




const getRole = () => {
  const storedUserInfo = localStorage.getItem("userInfo");
  if (storedUserInfo) {
    const parsedUserInfo = JSON.parse(storedUserInfo);
    return parsedUserInfo?.vaiTro || null;
  }
  return null;
};

console.log(1)
const RoleRedirect = ({ element }) => {
  const role = getRole();

  if (role === "ROLE_ADMIN" || role === "ROLE_STAFF") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return element;
};

const CustomerRouters = {
  path: "/",
  element: <Client />,
  children: [
    {
      index: true,
      element: <RoleRedirect element={<HomePage />} />,
    },
    {
      path: "cart",
      element: <RoleRedirect element={<CartPage />} />,
    },
    {
      path: "test",
      element: <RoleRedirect element={<Test />} />,
    },
    {
      path: "payment",
      element: <RoleRedirect element={<PayMent />} />,
    },
    {
      path: "products",
      element: <RoleRedirect element={<ProductsPage />} />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "admin/login",
      element: <RoleRedirect element={<ProductsPage />} />,
    },
    {
      path: "register",
      element: <RoleRedirect element={<Register />} />,
    },
    
    {
      path: "admin/trademark",
      element: <RoleRedirect element={<Trademark />} />,
    },
    // luồng bán hàng
    {
      path: "products/product-detail/:id",
      element: <RoleRedirect element={<ProductDetail />} />,
    },
    {
      path: "contact",
      element: <RoleRedirect element={<ContactFrom />} />,
    },
    {
      path: "profile",
      element: <RoleRedirect element={<CustomerProfile />} />,
    },
   
  
  
    



    // {
    //   path: "filter",
    //   element: <RoleRedirect element={<FilterProduct />} />,
    // },
    // {
    //   path: "detail/:id",
    //   element: <RoleRedirect element={<ProductDetail />} />,
    // },
    // {
    //   path: "payment",
    //   element: <RoleRedirect element={<PreCheckout />} />,
    // },
    // {
    //   path: "infor-order",
    //   element: <RoleRedirect element={<OrderConfirmation />} />,
    // },
    // {
    //   path: "invoice-lookup",
    //   element: <RoleRedirect element={<InvoiceLookup />} />,
    // },
    // {
    //   path: "about",
    //   element: <RoleRedirect element={<GioiThieu />} />,
    // },
    // {
    //   path: "failed-pay",
    //   element: <RoleRedirect element={<FailedPay />} />,
    // },
    // {
    //   path: "hanlde-result-payment",
    //   element: <RoleRedirect element={<HandlePayment />} />,
    // },
    // {
    //   path: "profile",
    //   element: <RoleRedirect element={<AccountInfo />} />,
    // },
  ],
};

export default CustomerRouters;
