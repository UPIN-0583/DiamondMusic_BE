# DiamondMusic Backend

Backend API cho ứng dụng DiamondMusic được xây dựng với Node.js, Express và PostgreSQL (Neon Database).

## 🚀 Công nghệ sử dụng

- **Node.js** & **Express** - Server framework
- **PostgreSQL** (Neon Database) - Database
- **Cloudinary** - Lưu trữ media (ảnh, audio)
- **JWT** - Authentication
- **bcrypt** - Mã hóa mật khẩu

## 📋 Yêu cầu hệ thống

- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn
- Tài khoản Neon Database
- Tài khoản Cloudinary

## 🛠️ Cài đặt

### Bước 1: Clone repository (nếu chưa có)

```bash
git clone <repository-url>
cd DiamondMusic_BE
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình biến môi trường

1. Tạo file `.env` từ file mẫu:

   ```bash
   copy .env.example .env
   ```

2. Mở file `.env` và điền thông tin của bạn:

   ```
   PORT=5000

   # PostgreSQL Database (Neon)
   PGUSER=your_database_user
   PGPASSWORD=your_database_password
   PGHOST=your_database_host
   PGDATABASE=your_database_name

   # Cloudinary
   CLOUD_NAME=your_cloudinary_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret

   # JWT
   JWT_SECRET=your_jwt_secret_key
   ```

### Bước 4: Chạy server

**Development mode (với nodemon - tự động restart khi có thay đổi):**

```bash
npm run dev
```

**Production mode:**

```bash
node server.js
```

Server sẽ chạy tại: `http://localhost:5000`

## 📁 Cấu trúc thư mục

```
DiamondMusic_BE/
├── config/           # Cấu hình database, cloudinary
├── controllers/      # Business logic
├── middleware/       # Authentication, validation
├── models/          # Database models
├── routes/          # API routes
├── .env             # Biến môi trường (KHÔNG PUSH LÊN GIT)
├── .env.example     # Template cho .env
├── .gitignore       # Các file/folder không push lên Git
├── server.js        # Entry point
└── package.json     # Dependencies
```

## 🔌 API Endpoints

### User

- `POST /api/user/register` - Đăng ký
- `POST /api/user/login` - Đăng nhập
- `GET /api/user/profile` - Lấy thông tin user

### Song

- `GET /api/song` - Lấy danh sách bài hát
- `POST /api/song` - Thêm bài hát mới
- `PUT /api/song/:id` - Cập nhật bài hát
- `DELETE /api/song/:id` - Xóa bài hát

### Playlist

- `GET /api/playlist` - Lấy danh sách playlist
- `POST /api/playlist` - Tạo playlist mới

### Genre

- `GET /api/genre` - Lấy danh sách thể loại

### Artist

- `GET /api/artist` - Lấy danh sách nghệ sĩ

### Album

- `GET /api/album` - Lấy danh sách album

## 🔒 Bảo mật

> **⚠️ QUAN TRỌNG:** File `.env` chứa thông tin nhạy cảm và **KHÔNG BAO GIỜ** được push lên Git!

File `.gitignore` đã được cấu hình để tự động loại trừ:

- `.env` và các biến thể
- `node_modules/`
- Các file log và temporary

## 🐛 Troubleshooting

### Lỗi kết nối database

- Kiểm tra lại thông tin `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGDATABASE` trong file `.env`
- Đảm bảo Neon Database đang hoạt động

### Lỗi Cloudinary

- Kiểm tra `CLOUD_NAME`, `API_KEY`, `API_SECRET` trong file `.env`
- Đảm bảo tài khoản Cloudinary còn hoạt động

### Port đã được sử dụng

- Thay đổi `PORT` trong file `.env` sang port khác (ví dụ: 5001, 3000)

## 📝 Ghi chú

- Sử dụng `npm run dev` khi phát triển để tự động restart server
- Đảm bảo file `.env` luôn được giữ bí mật
- Cập nhật file `.env.example` khi thêm biến môi trường mới
