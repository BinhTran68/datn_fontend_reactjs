import styles from './Sole.module.css';

function Sole() {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Danh sách Chất liệu đế</h2>
            <label htmlFor="search" className={styles.searchLabel}>Tìm kiếm</label>
            <div class="row">
                <div class="col-10">
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            id="search"
                            placeholder="Nhập vào chất liệu đế của giày mà bạn muốn tìm !"
                            className={styles.searchInput}
                        />
                    </div>
                </div>
                <div class="col-2">
                <button className={styles.addButton} >
                    <span className={styles.plusIcon}>+</span> Tìm kiếm
                </button>
                </div>

                
            </div>


            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Loại đế</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="5" className={styles.noData}>
                            <div className={styles.noDataIcon}>
                                {/* You can add an actual icon here if you have one */}
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="12" y1="18" x2="12" y2="12"></line>
                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                </svg>
                            </div>
                            No data
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Sole;