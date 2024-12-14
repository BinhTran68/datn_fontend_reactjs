import {create} from 'zustand'

// Tạo store Zustand
const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null, // Khởi tạo từ localStorage

    login: (userData) => {
        localStorage.setItem('user', JSON.stringify(userData)); // Lưu vào localStorage
        set({ user: userData });
    },

    // Hàm đăng xuất
    logout: () => set({user: null}),

    // Lấy vai trò của người dùng
    getRole: () => {
        const user = useAuthStore.getState().user; // Truy cập trạng thái `user`
        return user?.role || 'guest'; // Nếu chưa đăng nhập, trả về "guest"
    },

    // Kiểm tra vai trò admin
    isAdmin: () => {
        const role = useAuthStore.getState().getRole();
        return role === 'admin';
    },

    // Kiểm tra vai trò client
    isClient: () => {
        const role = useAuthStore.getState().getRole();
        return role === 'client';
    },
}));

export default useAuthStore;
