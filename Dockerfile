# Stage 1: Build ứng dụng React với Vite
FROM node:18 AS build

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React
RUN npm run build

# Stage 2: Chạy ứng dụng React với Nginx
FROM nginx:alpine

# Sao chép build output từ bước trước vào thư mục Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose cổng 80
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]