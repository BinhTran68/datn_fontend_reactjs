import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from './Product.module.css';


const Product = () => {
    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.title}>Danh sách Sản Phẩm</h1>

                <div class="row">
                    <div class="col-10">
                        <div className={styles.searchBarContainer}>

                            <input
                                type="text"
                                placeholder="Nhập vào tên của giày mà bạn muốn tìm !"
                                className={styles.searchBar}

                            />
                        </div>
                    </div>
                    <div class="col-2"><button className={styles.addButton} >
                        <span className={styles.plusIcon}>+</span> Thêm mới
                    </button></div>

                  

                </div>

                <div className={styles.filterContainer}>
                    <div className={styles.filterItem}>
                        <label className={styles.filterLabel}>Thương hiệu</label>
                        <select className={styles.select}>
                            <option>Tất cả thương hiệu</option>
                            {/* Add other brand options here */}
                        </select>
                    </div>
                    <div className={styles.filterItem}>
                        <label className={styles.filterLabel}>Danh mục</label>
                        <select className={styles.select}>
                            <option>Tất cả danh mục</option>
                            {/* Add other category options here */}
                        </select>
                    </div>
                    <div className={styles.filterItem}>
                        <label className={styles.filterLabel}>Chất liệu vải</label>
                        <select className={styles.select}>
                            <option>Tất cả chất liệu vải</option>
                            {/* Add other fabric material options here */}
                        </select>
                    </div>
                    <div className={styles.filterItem}>
                        <label className={styles.filterLabel}>Chất liệu đế</label>
                        <select className={styles.select}>
                            <option>Tất cả chất liệu đế</option>
                            {/* Add other sole material options here */}
                        </select>
                    </div>

                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.tableHeader}>STT</th>
                            <th className={styles.tableHeader}>Tên giày</th>
                            <th className={styles.tableHeader}>Danh mục</th>
                            <th className={styles.tableHeader}>Thương hiệu</th>
                            <th className={styles.tableHeader}>Chất liệu vải</th>
                            <th className={styles.tableHeader}>Chất liệu đế</th>
                            <th className={styles.tableHeader}>Trạng thái</th>
                            <th className={styles.tableHeader}>Ngày tạo</th>
                            <th className={styles.tableHeader}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/*  Replace this with actual data rendering */}
                        <tr>
                            <td colSpan="9" className={styles.noData}>
                                <div className={styles.noDataIcon}>
                                    {/*  You can use an actual icon here, this is just a placeholder */}
                                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M25 45.8333C36.5057 45.8333 45.8333 36.5057 45.8333 25C45.8333 13.4943 36.5057 4.16667 25 4.16667C13.4943 4.16667 4.16667 13.4943 4.16667 25C4.16667 36.5057 13.4943 45.8333 25 45.8333Z" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M18.75 18.75L31.25 31.25" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M31.25 18.75L18.75 31.25" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p>No data</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button className={styles.floatingActionButton}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.077 2.588a.75.75 0 0 1 .846 0l5.25 4.5a.75.75 0 0 1 0 1.024l-5.25 4.5a.75.75 0 0 1-1.024-.088.75.75 0 0 1 .088-1.024L11.66 8.5H2.75a.75.75 0 0 1 0-1.5h8.91l-4.585-3.988a.75.75 0 0 1-.088-1.024Z" fill="currentColor" />
                    </svg>
                </button>
            </div>

        </>

    )
}

export default Product


