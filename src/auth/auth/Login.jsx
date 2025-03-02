// import React, {useState} from "react";
// import {motion} from "framer-motion";
// import {Link, useNavigate} from "react-router-dom";
// import axios from "axios";
// import CustomInput from "../../client/component/CustomInput.jsx";
// import {Input} from "antd";


// const Login = () => {
//     const [formData, setFormData] = useState({ email: "", password: "" });
//     const [loading, setLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const navigate = useNavigate();

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setErrorMessage("");

//         try {
//             const response = await axios.post(
//                 "http://localhost:8080/api/authentication/login",
//                 {
//                     email: formData.email.trim(),
//                     password: formData.password.trim(),
//                 }
//             );
//             if (response.status === 200) {
//                 console.log(response)
//                 const data = response.data;
//                 localStorage.setItem("token", data.token);
//                 localStorage.setItem("user", JSON.stringify(data.customer));
//                 navigate("/");
//             } else {
//                 setErrorMessage("Invalid login credentials. Please try again.");
//             }
//         } catch (error) {
//             setErrorMessage(
//                 error.response?.data?.message || "Something went wrong. Please try again."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleGoogleLogin = () => {
//         console.log("Google login clicked");
//     };

//     return (
//         <div>
//             <div className="d-flex align-items-center p-5 justify-content-center bg-light">
//                 <motion.div
//                     initial={{ opacity: 0, y: -50 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                     className="bg-white p-4  mb-5 rounded shadow w-100"
//                     style={{ maxWidth: "400px", width: "100%" }}
//                 >
//                     <h2 className="text-center fw-bold mb-4">Welcome Back!</h2>

//                     {errorMessage && (
//                         <div className="alert alert-danger" role="alert">
//                             {errorMessage}
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit}>

//                         <CustomInput
//                             label="Tên đăng nhập"
//                             type="text"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleInputChange}
//                             disabled={loading}
//                         />
//                         <CustomInput
//                             label="Password"
//                             type="password"
//                             name="password"
//                             value={formData.password}
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
//                                     "Log in"
//                                 )}
//                             </button>
//                         </div>
//                     </form>

//                     <div className="text-center">
//                         <Link to="/auth/forgot-password" className="text-decoration-none">
//                             Forgot Password?
//                         </Link>
//                     </div>

//                     <div className="text-center my-3">or</div>

//                     <div className="d-grid mb-3">
//                         <Link
//                             to="/auth/register"
//                             className="btn btn-outline-secondary text-decoration-none"
//                         >
//                             Register Account
//                         </Link>
//                     </div>

//                     <div className="d-grid">
//                         <button
//                             type="button"
//                             className="btn btn-outline-secondary"
//                             onClick={handleGoogleLogin}
//                             disabled={loading}
//                         >
//                             <Link
//                                 to="https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:8080/api/v1/auth/oauth/google&response_type=code&client_id=949623093363-hhnb82n3djt2h4ovguvmqdk714rnihqv.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline"
//                                 className="text-decoration-none"
//                             >
//                                 Continue with Google
//                             </Link>
//                         </button>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };

// export default Login;





import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

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

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <div className={styles.leftPanel}>
                    <img 
                        src="http://localhost:5173/public/img/thehands.png" 
                        alt="Logo" 
                        className={styles.logo} 
                    />
                    <h2 className={styles.title}>Log in</h2>
                    <p className={styles.subtitle}>to your account</p>

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
                                placeholder="username"
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
                                placeholder="password"
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
                                "LOG IN"
                            )}
                        </button>
                        
                        <div className={styles.forgotPassword}>
                            <Link to="/auth/forgot-password">
                                Forgot password?
                            </Link>
                        </div>
                    </form>
                </div>

                <div className={styles.rightPanel}>
                    <div className={styles.socialContainer}>
                        <h2 className={styles.socialTitle}>Sign in</h2>
                        <p className={styles.socialSubtitle}>with one of your social profiles</p>
                        
                        <div className={styles.orDivider}>or</div>
                        
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
                            <p>Don't have an account?</p>
                            <Link to="/auth/register" className={styles.signupButton}>
                                sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;