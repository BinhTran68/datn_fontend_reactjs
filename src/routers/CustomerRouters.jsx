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
import CartPage from "../client/page/cart/CartPage.jsx";
import ProductsPage from "../client/page/products/ProductsPage.jsx";
import Test from "../client/page/TestComponent/Test.jsx";
import PurchaseOrder from "../admin/PurchaseOrder/PurchaseOrder.jsx";
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
import ContactForm from "../admin/contact/ContactForm.jsx";
import CustomerProfile from "../admin/profile/CustomerProfile.jsx";
import ProductPolicyPage from "../admin/productpolicy/ProductPolicyPage.jsx";
import CustomerPolicyPage from "../admin/profile/CustomerPolicyPage.jsx";

import Login from "../auth/auth/Login.jsx";
import Register from "../auth/auth/Register.jsx";
import PayMent from "../client/page/cart/PayMent.jsx";
import { i } from "framer-motion/client";

// luồng bán hàng client
import ProductDetail from "../client/page/products/ProductDetail.jsx";
import { ProductProvider } from "../store/ProductContext.jsx";
import Success from "../client/page/cart/Success.jsx";

// const getRole = () => {
//   const storedUserInfo = localStorage.getItem("userInfo");
//   if (storedUserInfo) {
//     const parsedUserInfo = JSON.parse(storedUserInfo);
//     return parsedUserInfo?.vaiTro || null;
//   }
//   return null;
// };

console.log(1);
import UserLogin from "../client/UserLogin.jsx";
import React from "react";
import {getRole} from "../helpers/Helpers.js";
import PdfPrint from "../admin/PdfPrint.jsx";




const RoleRedirect = ({ element, allowRole }) => {
  const role = getRole();
  console.log(role)
  if (role === "ROLE_ADMIN" || role === "ROLE_STAFF" || role === "ROLE_MANAGER") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if(!allowRole) {
    return element;
  }
  if(allowRole && allowRole !== role) {
    return <Navigate to="/forbidden" replace/>;
  }
  return element;
};

const CustomerRouters = {
  path: "/",
  element: (
    <ProductProvider>
      <Client />
    </ProductProvider>
  ),
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
      element: <RoleRedirect element={<PayMent />}  />,
    },
    {
      path: "products",
      element: <RoleRedirect element={<ProductsPage />} />,
    },
    // {
    //   path: "login",
    //   element: <Login />,
    // },
    {
      path: "admin/login",
      element: <RoleRedirect element={<ProductsPage />}  />,
    },
    // {
    //   path: "register",
    //   element: <RoleRedirect element={<Register />} />,
    // },

    {
      path: "admin/trademark",
      element: <RoleRedirect element={<Trademark />} />,
    },

    {
      path: "products/product-detail/:productId",
      element: <RoleRedirect element={<ProductDetail />} />,
    },
    {
      path: "success",
      element: <RoleRedirect element={<Success />} />,
    },
    {
      path: "test/auth-user",
      element: <RoleRedirect element={<UserLogin/>} allowRole={"CUSTOMER"} />,
    },
    {
      path: "contact",
      element: <RoleRedirect element={<ContactForm />} />,
    },
    {
      path: "profile",
      element: <RoleRedirect element={<CustomerProfile />} />,
    },
    {
      path: "productpolicypage",
      element: <RoleRedirect element={<ProductPolicyPage />} />,
    },
    {
      path: "customerpolicypage",
      element: <RoleRedirect element={<CustomerPolicyPage />} />,
    },
    {
      path: "purchaseorder",
      element: <RoleRedirect element={<PurchaseOrder />} />,
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
