// App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import ProtectedRoute from "./auth/ProtectedRoute";
import LoginPage from "./public/LoginPage";
import UnauthorizedPage from "./public/UnauthorizedPage";
import UserPage from "./client/UserPage";
import useAuthStore from "./auth/useAuthStore";

function App() {
    const login = useAuthStore((state) => state.login);

    // Mô phỏng đăng nhập cho mục đích kiểm tra
    const handleTestLogin = () => {

    };

    return (
        <Router>

            <Routes>
                {/* Trang public */}
                <Route path="/login" element={<LoginPage />} />

                 Trang client
                <Route path="/user" element={<ProtectedRoute role="client"><UserPage /></ProtectedRoute>} />

                {/* Trang không có quyền */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
        </Router>
    );
}

export default App;
