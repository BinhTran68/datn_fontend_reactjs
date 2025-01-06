import React from 'react';
import styles from './ProductManagement.module.css';

function ProductManagement() {
    return (
        <div className={styles.container}>
            <h1>Quản lý sản phẩm chi tiết</h1>
            <div class="row">
                <div class="col-8">

                    <label htmlFor="brand">Sản phẩm</label>
                    <select id="brand">
                        <option value="">Tất cả sản phẩm</option>
                    </select>

                </div>
                <div class="col-4"><br />
                    <div class="col-12">
                        <div className={styles.addButtonContainer}>
                            <button className={styles.addButton}>+ Thêm mới sản phẩm chi tiết</button>
                        </div>

                    </div>
                </div>

            </div>



            <div>
                <div className={styles.filters}>

                    <div className={styles.filter} >
                        <label htmlFor="brand">Thương hiệu</label>
                        <select id="brand">
                            <option value="">Tất cả thương hiệu</option>
                        </select>
                    </div>
                    <div className={styles.filter}>
                        <label htmlFor="category">Danh mục</label>
                        <select id="category">
                            <option value="">Tất cả danh mục</option>
                        </select>
                    </div>
                    <div className={styles.filter} >
                        <label htmlFor="fabric">Chất liệu vải</label>
                        <select id="fabric">
                            <option value="">Tất cả chất vải</option>
                        </select>
                    </div>
                    <div className={styles.filter} >
                        <label htmlFor="sole">Chất liệu đế</label>
                        <select id="sole">
                            <option value="">Tất cả chất đế</option>
                        </select>
                    </div>
                </div>

            </div>


            <table>
                <thead>
                    <tr>
                        <th>Tên sản phẩm</th>
                        <th>Hình ảnh</th>
                        <th>Tên màu</th>
                        <th>Tên kích thước</th>
                        <th>Số lượng còn lại</th>
                        <th>Giá gốc</th>
                        <th>Giá khuyến mãi</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="9" className={styles.noData}>
                            <div className={styles.noDataIcon}></div>
                            <p>No data</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className={styles.watermark}></div>
        </div>
    );
}

export default ProductManagement;