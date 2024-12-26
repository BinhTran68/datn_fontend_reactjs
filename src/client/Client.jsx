import React, { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import Footer from "./component/Footer";
import HeaderNav from "./component/HeaderNav";



const App = () => {
    const [searchValue, setSearchValue] = useState("");

    // useEffect(() => {
    //     // Gọi hàm clearGuestCart khi component được render
    //     clearGuestCart();
    // }, [clearGuestCart]); // Chỉ gọi lại nếu clearGuestCart thay đổi

    return (
        <div className="">
            {/* <Navigation searchValue={searchValue} setSearchValue={setSearchValue}/> */}

            <HeaderNav/>
                <div className="container">
                 {/* <Outlet  context={{ searchValue }} /> */}
                 <Outlet/>
                </div>
            <Footer />
        </div>
    );
};

export default App;
