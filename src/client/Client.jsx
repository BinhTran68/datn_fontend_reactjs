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
        <div>
            <Navigation searchValue={searchValue} setSearchValue={setSearchValue}/>
             <Outlet  context={{ searchValue }} />
            <Footer />
        </div>
    );
};

export default App;
