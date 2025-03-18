import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";
import { COLORS } from "../../constants/constants.js";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        
        if (token && user) {
            navigate("/");
        }

        // Reset scroll position when navigating to this page
        window.scrollTo(0, 0);
    }, [navigate, location]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post(
                "http://localhost:8080/api/authentication/login",
                {
                    email: formData.email.trim(),
                    password: formData.password.trim(),
                }
            );
            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.customer));
                window.dispatchEvent(new Event("cartUpdated"));
                navigate("/");
            } else {
                setErrorMessage("Invalid login credentials. Please try again.");
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRedirectToRegister = (e) => {
        e.preventDefault();
        // Add a class to trigger exit animation
        document.querySelector(`.${styles.container}`).classList.add('exit');
        
        // Wait for animation to complete before navigating
        setTimeout(() => {
            navigate("/register");
        }, 300);
    };

    return (
        <div className={styles.container}>
            <div className={styles.singleColumnContainer}>
                <img
                    src="/img/thehands.png"
                    alt="Logo"
                    className={styles.logo}
                />
                <h2 className={styles.title}>Đăng nhập</h2>
                <p className={styles.subtitle}>vào tài khoản của bạn</p>

                {errorMessage && (
                    <div className={styles.errorMessage}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Tên đăng nhập"
                            className={styles.input}
                            disabled={loading}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Mật khẩu"
                            className={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className={styles.spinner}></span>
                        ) : (
                            "ĐĂNG NHẬP"
                        )}
                    </button>

                    <div className={styles.forgotPassword}>
                        <Link to="/auth/forgot-password">
                            Quên mật khẩu?
                        </Link>
                    </div>
                </form>

                <div className={styles.orDivider}>hoặc</div>
                
                <div className={styles.socialButtons}>
                    <a href="#" className={`${styles.socialButton} ${styles.facebook}`}>
                        <span>f</span>
                    </a>
                    <a href="#" className={`${styles.socialButton} ${styles.twitter}`}>
                        <span>t</span>
                    </a>
                    <a
                        href="https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:8080/api/v1/auth/oauth/google&response_type=code&client_id=949623093363-hhnb82n3djt2h4ovguvmqdk714rnihqv.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline"
                        className={`${styles.socialButton} ${styles.google}`}
                    >
                        <span>G+</span>
                    </a>
                </div>

                <div className={styles.signupLink}>
                    <p>Chưa có tài khoản?</p>
                    <Link to="/register" className={styles.signupButton} onClick={handleRedirectToRegister}>
                        Đăng ký
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;