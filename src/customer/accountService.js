export const genStringAccountStatus = (status) => {
    if (status === 1) {
        return "Hoạt động"
    }
    if (status === 2) {
        return "Đã khóa"
    }
    if (status === 3) {
        return "Chưa kích hoạt"
    }
    return "Chưa kích hoạt"
}