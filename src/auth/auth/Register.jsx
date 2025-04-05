import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./Register.module.css";
import { validateEmail } from "../../helpers/Helpers.js";
import { COLORS } from "../../constants/constants.js";
import {toast} from "react-toastify";
import log from "eslint-plugin-react/lib/util/log.js";

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Reset scroll position when navigating to this page
        window.scrollTo(0, 0);
    }, [navigate, location]);

    const handleInputChange = (e) => {
        handClearError();
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handClearError = () => {
        setErrors({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
    };

    const handleCheckValidate = () => {
        let isValid = true;

        const newErrors = {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        };

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Tên đăng nhập không được để trống";
            isValid = false;
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống";
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Email không hợp lệ";
            isValid = false;
        }
        if (!formData.password.trim()) {
            newErrors.password = "Vui lòng nhập mật khẩu";
            isValid = false;
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu không khớp";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (!handleCheckValidate()) {
            setLoading(false);
            return;
        }
        
        try {
            const response = await axios.post(
                "http://localhost:8080/api/authentication/register",
                {
                    fullName: formData.fullName.trim(),
                    email: formData.email.trim(),
                    password: formData.password.trim(),
                }
            );

            const data = response.data;
            toast.success("Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản!")
            navigate("/")
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRedirectToLogin = (e) => {
        e.preventDefault();
        // Add a class to trigger exit animation
        document.querySelector(`.${styles.container}`).classList.add('exit');
        
        // Wait for animation to complete before navigating
        setTimeout(() => {
            navigate("/login");
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
                <h2 className={styles.title}>Đăng ký</h2>
                <p className={styles.subtitle}>tạo tài khoản của bạn</p>

                {errorMessage && (
                    <div className={styles.errorMessage}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Họ và tên"
                            className={errors.fullName ? `${styles.input} ${styles.inputError}` : styles.input}
                            disabled={loading}
                        />
                        {errors.fullName && <div className={styles.errorText}>{errors.fullName}</div>}
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className={errors.email ? `${styles.input} ${styles.inputError}` : styles.input}
                            disabled={loading}
                        />
                        {errors.email && <div className={styles.errorText}>{errors.email}</div>}
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Mật khẩu"
                            className={errors.password ? `${styles.input} ${styles.inputError}` : styles.input}
                            disabled={loading}
                        />
                        {errors.password && <div className={styles.errorText}>{errors.password}</div>}
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Nhập lại mật khẩu"
                            className={errors.confirmPassword ? `${styles.input} ${styles.inputError}` : styles.input}
                            disabled={loading}
                        />
                        {errors.confirmPassword && <div className={styles.errorText}>{errors.confirmPassword}</div>}
                    </div>

                    <button
                        type="submit"
                        className={styles.signupButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className={styles.spinner}></span>
                        ) : (
                            "ĐĂNG KÝ"
                        )}
                    </button>
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
                
                <div className={styles.loginLink}>
                    <p>Đã có tài khoản?</p>
                    <Link to="/login" className={styles.loginButtonLink} onClick={handleRedirectToLogin}>
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;