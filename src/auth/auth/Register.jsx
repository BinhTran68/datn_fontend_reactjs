// import React, {useState} from "react";
// import {motion} from "framer-motion";
// import {Link, useNavigate} from "react-router-dom";
// import axios from "axios";
// import CustomInput from "../../client/component/CustomInput.jsx";
// import {validateEmail} from "../../helpers/Helpers.js"; // Assuming you have a CustomInput component

// const Register = () => {
//     const [formData, setFormData] = useState({
//         fullName: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//     });

//     const [errors, setErrors] = useState({
//         fullName: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//     });


//     const [loading, setLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const navigate = useNavigate();

//     const handleInputChange = (e) => {
//         handClearError()
//         const {name, value} = e.target;
//         setFormData({...formData, [name]: value});
//     };


//     const handClearError = () => {
//         setErrors({
//             fullName: "",
//             email: "",
//             password: "",
//             confirmPassword: "",
//         })
//     }

//     const handleCheckValidate = () => {
//         let isValid = true;

//         // Reset lỗi trước khi kiểm tra
//         const newErrors = {
//             fullName: "",
//             email: "",
//             password: "",
//             confirmPassword: "",
//         };

//         if (!formData.fullName.trim()) {
//             newErrors.fullName = "Tên đăng nhập không được để trống";
//             isValid = false;
//         }
//         if (!formData.email.trim()) {
//             newErrors.email = "Email không được để trống";
//             isValid = false;
//         } else if (!validateEmail(formData.email)) {
//             newErrors.email = "Email không hợp lệ";
//             isValid = false;
//         }
//         if (!formData.password.trim()) {
//             newErrors.password = "Vui lòng nhập mật khẩu";
//             isValid = false;
//         }
//         if (formData.password !== formData.confirmPassword) {
//             newErrors.confirmPassword = "Mật khẩu không khớp";
//             isValid = false;
//         }

//         setErrors(newErrors);
//         return isValid;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         setLoading(true);
//         console.log(handleCheckValidate())
//         if (!handleCheckValidate()) {
//             setLoading(false);
//             return;
//         }
//         try {
//             const response = await axios.post(
//                 "http://localhost:8080/api/authentication/register",
//                 {
//                     fullName: formData.fullName.trim(),
//                     email: formData.email.trim(),
//                     password: formData.password.trim(),
//                 }
//             );

//             const data = response.data;
//             if (data.code === 1000) {
//                 navigate("/auth/login");
//             } else {
//                 setErrorMessage("Failed to register. Please try again.");
//             }
//         } catch (error) {
//             setErrorMessage(
//                 error.response?.data?.message || "Something went wrong. Please try again."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div>
//             <div className="d-flex align-items-center p-5 justify-content-center bg-light">
//                 <motion.div
//                     initial={{opacity: 0, y: -50}}
//                     animate={{opacity: 1, y: 0}}
//                     transition={{duration: 0.5}}
//                     className="bg-white p-4 mb-5 rounded shadow w-100"
//                     style={{maxWidth: "450px", width: "100%"}}
//                 >
//                     <h2 className="text-center fw-bold mb-4">Create an Account</h2>

//                     {/*{errorMessage && (*/}
//                     {/*    <div className="alert alert-danger" role="alert">*/}
//                     {/*      {errorMessage}*/}
//                     {/*    </div>*/}
//                     {/*)}*/}

//                     <form onSubmit={handleSubmit}>
//                         <CustomInput
//                             label="Họ và tên"
//                             type="text"
//                             name="fullName"
//                             error={errors.fullName}
//                             value={formData.fullName}
//                             onChange={handleInputChange}
//                             disabled={loading}
//                         />
//                         <CustomInput
//                             label="Email"
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             error={errors.email}
//                             onChange={handleInputChange}
//                             disabled={loading}
//                         />
//                         <CustomInput
//                             label="Mật khẩu"
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             error={errors.password}
//                             onChange={handleInputChange}
//                             disabled={loading}
//                         />
//                         <CustomInput
//                             label="Nhập lại mật khẩu"
//                             type="password"
//                             name="confirmPassword"
//                             value={formData.confirmPassword}
//                             error={errors.confirmPassword}
//                             onChange={handleInputChange}
//                             disabled={loading}
//                         />

//                         <div className="d-grid mb-3">
//                             <button
//                                 type="submit"
//                                 className="btn btn-dark"
//                                 disabled={loading}
//                             >
//                                 {loading ? (
//                                     <span
//                                         className="spinner-border spinner-border-sm"
//                                         role="status"
//                                         aria-hidden="true"
//                                     ></span>
//                                 ) : (
//                                     "Sign Up"
//                                 )}
//                             </button>
//                         </div>
//                     </form>

//                     <div className="text-center my-3">or</div>

//                     <div className="d-grid mb-3">
//                         <Link
//                             to="/auth/login"
//                             className="btn btn-outline-secondary text-decoration-none"
//                         >
//                             Already have an account? Log in
//                         </Link>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };

// export default Register;




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Register.module.css";
import { validateEmail } from "../../helpers/Helpers.js";
import { COLORS } from "../../constants/constants.js";

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
            if (data.code === 1000) {
                navigate("/auth/login");
            } else {
                setErrorMessage("Đăng ký không thành công. Vui lòng thử lại.");
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <div className={styles.leftPanel}>
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
                    
                    <div className={styles.loginLink}>
                        <p>Đã có tài khoản?</p>
                        <Link to="/auth/login" className={styles.loginButtonLink}>
                            Đăng nhập
                        </Link>
                    </div>
                </div>

                <div className={styles.rightPanel}>
                    <div className={styles.socialContainer}>
                        <h2 className={styles.socialTitle}>Đăng nhập</h2>
                        <p className={styles.socialSubtitle}>bằng tài khoản mạng xã hội</p>
                        
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;