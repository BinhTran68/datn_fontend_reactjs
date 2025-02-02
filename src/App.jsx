// App.js
import "./App.css";


import { createBrowserRouter, RouterProvider } from "react-router-dom";


import ForbiddenPage from "./ForbiddenPage.jsx";
import AdminRouters from "./routers/AdminRouters.jsx";
import CustomerRouters from "./routers/CustomerRouters.jsx";
import AuthRouters from "./routers/AuthRouter.jsx";
import {Bounce, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ConfigProvider} from "antd"; // Import CSS của react-toastify
{/* <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet"></link> proppins */}





const router = createBrowserRouter([AdminRouters, CustomerRouters,AuthRouters,  {
    path: "/forbidden",
    element: <ForbiddenPage />,
},]);
const App = () => {
    return (
        <>
            {/* ToastContainer được đặt ở đây */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

            {/* RouterProvider để quản lý các route */}

            <ConfigProvider
                theme={{
                    token: {

                    },
                }}
            >
                <RouterProvider router={router} />

            </ConfigProvider>
        </>
    );
};

export default App;


