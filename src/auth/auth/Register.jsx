import React, {useState} from "react";
import {motion} from "framer-motion";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import CustomInput from "../../client/component/CustomInput.jsx";
import {validateEmail} from "../../helpers/Helpers.js"; // Assuming you have a CustomInput component

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });


    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        handClearError()
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };


    const handClearError = () => {
        setErrors({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        })
    }

    const handleCheckValidate = () => {
        let isValid = true;

        // Reset lỗi trước khi kiểm tra
        const newErrors = {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        };

        if (!formData.username.trim()) {
            newErrors.username = "Tên đăng nhập không được để trống";
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
        console.log(handleCheckValidate())
        if (!handleCheckValidate()) {
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:8080/api/v1/auth/register",
                {
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password.trim(),
                }
            );

            const data = response.data;
            if (data.code === 1000) {
                navigate("/auth/login");
            } else {
                setErrorMessage("Failed to register. Please try again.");
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
        <div>
            <div className="d-flex align-items-center p-5 justify-content-center bg-light">
                <motion.div
                    initial={{opacity: 0, y: -50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="bg-white p-4 mb-5 rounded shadow w-100"
                    style={{maxWidth: "450px", width: "100%"}}
                >
                    <h2 className="text-center fw-bold mb-4">Create an Account</h2>

                    {/*{errorMessage && (*/}
                    {/*    <div className="alert alert-danger" role="alert">*/}
                    {/*      {errorMessage}*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    <form onSubmit={handleSubmit}>
                        <CustomInput
                            label="Tên đăng nhập"
                            type="text"
                            name="username"
                            error={errors.username}
                            value={formData.username}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                        <CustomInput
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            error={errors.email}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                        <CustomInput
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            error={errors.password}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                        <CustomInput
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            error={errors.confirmPassword}
                            onChange={handleInputChange}
                            disabled={loading}
                        />

                        <div className="d-grid mb-3">
                            <button
                                type="submit"
                                className="btn btn-dark"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                ) : (
                                    "Sign Up"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="text-center my-3">or</div>

                    <div className="d-grid mb-3">
                        <Link
                            to="/auth/login"
                            className="btn btn-outline-secondary text-decoration-none"
                        >
                            Already have an account? Log in
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
