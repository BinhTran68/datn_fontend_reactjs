// App.js
import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";


import ForbiddenPage from "./ForbiddenPage.jsx";
import AdminRouters from "./routers/AdminRouters.jsx";
import CustomerRouters from "./routers/CustomerRouters.jsx";
import AuthRouters from "./routers/AuthRouter.jsx";

const router = createBrowserRouter([AdminRouters, CustomerRouters,AuthRouters,  {
    path: "/forbidden",
    element: <ForbiddenPage />,
},]);
const App = () => {
    return <RouterProvider router={router} />;
};

export default App;


