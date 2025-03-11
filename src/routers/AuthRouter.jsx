import Login from "../auth/auth/Login.jsx";
import Register from "../auth/auth/Register.jsx";
import ForgotPassword from "../auth/auth/ForgotPassword.jsx";
import LoginSuccess from "../auth/auth/LoginSuccess.jsx";
import ResetPassword from "../auth/auth/ResetPassword.jsx";
import LoginAdmin from "../auth/auth/LoginAdmin.jsx";
import ForgotPasswordAdmin from "../auth/auth/ForgotPasswordAdmin.jsx";


const AuthRouters = {
    path: "/",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "login-success",
        element: <LoginSuccess />,
      },      
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "login-admin",
        element: <LoginAdmin />,
      },
      {
        path: "forgot-password-admin",
        element: <ForgotPasswordAdmin />,
      },
    ],
};

export default AuthRouters;