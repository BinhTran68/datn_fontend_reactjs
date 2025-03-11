import React, { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import Footer from "./component/Footer";
import HeaderNav from "./component/HeaderNav/HeaderNav.jsx";
import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Nav from "./component/Nav/Nav.jsx";
import { ProductProvider } from "../store/ProductContext";
// import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [searchValue, setSearchValue] = useState("");

  // useEffect(() => {
  //     // Gọi hàm clearGuestCart khi component được render
  //     clearGuestCart();
  // }, [clearGuestCart]); // Chỉ gọi lại nếu clearGuestCart thay đổi

  return (
    <div className="">
      <Layout>
        <Content
          style={{
            backgroundColor: "white",
          }}
        >
          <HeaderNav />
        </Content>
        <Content>
          <div className="">
            {/*<Nav/>*/}
            <Outlet />
          </div>
        </Content>
        <Content
          style={{
            backgroundColor: "white",
          }}
        >
          <Footer />
        </Content>
      </Layout>
    </div>
  );
};

export default App;
