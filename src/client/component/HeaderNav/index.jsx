import React from "react";
import stype from "../HeaderNav/HeaderNav.module.css";
import clsx from "clsx";

import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from "react-router-dom";
import {PiBellRinging} from "react-icons/pi";
import {AiOutlineGlobal} from "react-icons/ai";
import {MdOutlineAccountCircle} from "react-icons/md";
import {RiShoppingCartLine} from "react-icons/ri";
import {IoIosSearch} from "react-icons/io";

function Home() {
    return (
        <>
            <div className={"w-100"}>
                <p className="text-light text-center bg-black">
                    Authentic Shoes - Nhà sưu tầm và phân phối chính hãng các thương hiệu
                    thời trang quốc tế hàng đầu Việt Nam
                </p>
                <div className="d-flex justify-content-end gap-3 p-0">
                    <div>
                        <PiBellRinging size={23} style={{fontWeight: "bold"}}/> Thông báo
                    </div>
                    <div>
                        <AiOutlineGlobal size={23} style={{fontWeight: "bold"}}/> Tiếng Việt

                    </div>
                    <div>
                        <MdOutlineAccountCircle size={23} style={{fontWeight: "bold"}}/> Duycong192
                    </div>
                </div>
                <div className="row ">
                    <div className={clsx(stype.logo, "col-3 d-flex justify-content-end")}>
                        <img src="/img/logo.png" alt="mieu-ta-hinh-anh"/>
                    </div>
                    <div className={clsx(stype.navContent, "col-6 text-content d-flex align-items-center")}>
                        <div className="d-flex gap-3  ">
                            <div>
                                <Link to="/home" className="text-decoration-none text-black"> TRANC CHỦ</Link>
                            </div>
                            <div>
                                <a href="/" className="text-decoration-none text-black"> GIÀY</a>
                            </div>
                            <div>
                                <a href="/" className="text-decoration-none text-black"> LIÊN HỆ</a>
                            </div>
                            <div>
                                <a href="/" className="text-decoration-none text-black"> TRA CỨU</a>
                            </div>
                        </div>
                    </div>
                    <div
                        className={clsx(stype.loginAndCart, "col-3 d-flex justify-content-start d-flex align-items-center gap-3")}>
                        <div>
                            <IoIosSearch size={24} style={{fontWeight: "bold"}}/>
                        </div>
                        <div>
                            <RiShoppingCartLine size={24} style={{fontWeight: "bold"}}/>

                        </div>
                        <div>
                            <Link href="/" className="text-decoration-none text-black fw-normal" to={"/login"}> Đăng
                                Nhập</Link>
                            <Link href="/" className="text-decoration-none text-black fw-normal" to={"/register"}> Đăng
                                Kí</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
