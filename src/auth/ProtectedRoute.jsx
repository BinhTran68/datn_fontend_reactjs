import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "./useAuthStore";

const ProtectedRoute = ({ role, children }) => {
    const user = useAuthStore((state) => state.user);

    console.log(user);
    // Nếu không có người dùng (chưa đăng nhập)
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Kiểm tra vai trò của người dùng
    if (user.role !== role) {
        return <Navigate to="/unauthorized" />;
    }

    // Nếu vai trò hợp lệ, render nội dung được bảo vệ
    return children;
};

export default ProtectedRoute;
