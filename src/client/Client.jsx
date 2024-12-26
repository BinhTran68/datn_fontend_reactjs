import React, { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import Navigation from "./component/Navigation.jsx";
import Footer from "./component/Footer.jsx";



const App = () => {
    const [searchValue, setSearchValue] = useState("");

    // useEffect(() => {
    //     // Gọi hàm clearGuestCart khi component được render
    //     clearGuestCart();
    // }, [clearGuestCart]); // Chỉ gọi lại nếu clearGuestCart thay đổi

    return (
        <div className="">
            <Navigation searchValue={searchValue} setSearchValue={setSearchValue}/>
                <div className="container">
                 <Outlet  context={{ searchValue }} />
                </div>
            <Footer />
        </div>
    );
};

export default App;
