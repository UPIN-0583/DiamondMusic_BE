# 💎 DiamondMusic Backend

Backend API cho ứng dụng nghe nhạc DiamondMusic.

## ⚡ Quick Start

```bash
# 1. Cài đặt
npm install

# 2. Tạo file .env (copy từ .env.example)
copy .env.example .env

# 3. Chạy server
npm run dev
```

Server: `http://localhost:5000`

## 🔧 Cấu hình .env

```env
PORT=5000
PGUSER=xxx
PGPASSWORD=xxx
PGHOST=xxx.neon.tech
PGDATABASE=xxx
CLOUD_NAME=xxx
API_KEY=xxx
API_SECRET=xxx
JWT_SECRET=xxx
GEMINI_API_KEY=xxx
```

## 📚 Tài liệu chi tiết

- [🤖 AI ChatBot - Gợi ý nhạc với Gemini AI](./docs/AI_CHATBOT.md)
- [🔍 Lyrics Search - Tìm kiếm theo lời bài hát](./docs/LYRICS_SEARCH.md)

---

**⚠️ Lưu ý:** Không commit file `.env` lên Git!
