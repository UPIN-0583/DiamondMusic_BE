# 💎 DiamondMusic Backend API

Backend RESTful API cho ứng dụng nghe nhạc DiamondMusic.

## 🚀 Tech Stack

| Công nghệ                | Mục đích                      |
| ------------------------ | ----------------------------- |
| **Node.js + Express 5**  | Web framework                 |
| **PostgreSQL (Neon)**    | Database                      |
| **Cloudinary**           | Media storage (audio, images) |
| **JWT**                  | Authentication                |
| **Google Generative AI** | AI music recommendations      |
| **bcrypt**               | Password hashing              |

## 📁 Cấu trúc Project

```
DiamondMusic_BE/
├── config/           # Database & Cloudinary config
├── controllers/      # Request handlers
├── middleware/       # Auth & validation
├── models/           # Database models
├── routes/           # API endpoints
├── docs/             # API documentation
├── migrations/       # Database migrations
├── server.js         # Entry point
└── .env              # Environment variables
```

## ⚡ Quick Start

```bash
# 1. Cài đặt dependencies
npm install

# 2. Tạo file .env từ template
copy .env.example .env

# 3. Chạy development server
npm run dev
```

Server chạy tại: `http://localhost:5000`

## 🔧 Cấu hình .env

```env
PORT=5000

# PostgreSQL (Neon Database)
PGUSER=your_user
PGPASSWORD=your_password
PGHOST=your_host.neon.tech
PGDATABASE=your_database

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_secret_key

# Google AI (cho music recommendations)
GEMINI_API_KEY=your_gemini_api_key
```

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint             | Mô tả              |
| ------ | -------------------- | ------------------ |
| POST   | `/api/user/register` | Đăng ký tài khoản  |
| POST   | `/api/user/login`    | Đăng nhập          |
| GET    | `/api/user/profile`  | Lấy thông tin user |
| PUT    | `/api/user/password` | Đổi mật khẩu       |
| GET    | `/api/user/stats`    | Thống kê user      |

### 🎵 Songs

| Method | Endpoint        | Mô tả             |
| ------ | --------------- | ----------------- |
| GET    | `/api/song`     | Danh sách bài hát |
| POST   | `/api/song`     | Thêm bài hát      |
| PUT    | `/api/song/:id` | Cập nhật bài hát  |
| DELETE | `/api/song/:id` | Xóa bài hát       |

### 📋 Playlists

| Method | Endpoint                  | Mô tả                     |
| ------ | ------------------------- | ------------------------- |
| GET    | `/api/playlist`           | Danh sách playlist        |
| GET    | `/api/playlist/user`      | Playlist của user         |
| POST   | `/api/playlist`           | Tạo playlist              |
| POST   | `/api/playlist/:id/songs` | Thêm bài hát vào playlist |
| PUT    | `/api/playlist/:id`       | Đổi tên playlist          |
| DELETE | `/api/playlist/:id`       | Xóa playlist              |

### 🎤 Artists

| Method | Endpoint                | Mô tả               |
| ------ | ----------------------- | ------------------- |
| GET    | `/api/artist`           | Danh sách nghệ sĩ   |
| GET    | `/api/artist/:id/songs` | Bài hát của nghệ sĩ |

### ❤️ Favourites

| Method | Endpoint                     | Mô tả                   |
| ------ | ---------------------------- | ----------------------- |
| GET    | `/api/favourite/songs`       | Bài hát yêu thích       |
| POST   | `/api/favourite/songs/:id`   | Like/Unlike bài hát     |
| GET    | `/api/favourite/artists`     | Nghệ sĩ đang follow     |
| POST   | `/api/favourite/artists/:id` | Follow/Unfollow nghệ sĩ |

### 🤖 AI Recommendations

| Method | Endpoint       | Mô tả                          |
| ------ | -------------- | ------------------------------ |
| POST   | `/api/ai/chat` | Chat với AI để nhận gợi ý nhạc |

### 🔍 Search

| Method | Endpoint                | Mô tả                |
| ------ | ----------------------- | -------------------- |
| GET    | `/api/search/lyrics?q=` | Tìm kiếm theo lyrics |

## 🔒 Authentication

API sử dụng JWT Bearer Token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🐛 Troubleshooting

| Lỗi                        | Giải pháp                                      |
| -------------------------- | ---------------------------------------------- |
| Database connection failed | Kiểm tra PGHOST, PGUSER, PGPASSWORD trong .env |
| Cloudinary upload failed   | Kiểm tra CLOUD_NAME, API_KEY, API_SECRET       |
| Port already in use        | Đổi PORT trong .env                            |

## 📝 Scripts

```bash
npm run dev     # Chạy với nodemon (auto-reload)
node server.js  # Chạy production
```

---

**⚠️ Lưu ý:** File `.env` chứa thông tin nhạy cảm - KHÔNG commit lên Git!
