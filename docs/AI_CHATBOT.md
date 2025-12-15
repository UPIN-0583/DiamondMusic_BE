# AI Music Chatbot - Gợi ý nhạc theo tâm trạng

## Tổng quan

Tính năng AI Chatbot sử dụng **Google Gemini AI** để phân tích tin nhắn của người dùng và gợi ý bài hát phù hợp với tâm trạng, sở thích hoặc ngữ cảnh.

---

## Kiến trúc hệ thống

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Mobile App    │────▶│   Backend API   │────▶│   Gemini AI     │     │   PostgreSQL    │
│  (React Native) │◀────│   (Express.js)  │◀────│  (gemini-2.5)   │◀────│   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Luồng hoạt động chi tiết

### Bước 1: User nhập tin nhắn

- User mở **AIChatScreen** từ Home
- Nhập tin nhắn mô tả tâm trạng, sở thích
- Ví dụ: "Tôi đang buồn", "Tôi muốn nhạc sôi động"

### Bước 2: App gọi API

```javascript
// services/api.js
POST /api/ai/recommend
Body: { "message": "Tôi đang buồn và muốn nghe nhạc thư giãn" }
```

### Bước 3: Backend tạo prompt cho Gemini AI

```javascript
// aiRecommendationController.js - createGenrePrompt()

const prompt = `Bạn là một AI chuyên gia về âm nhạc...
Các thể loại nhạc có sẵn: Pop, Rock, Electronic, Lo-fi, Indie, Jazz, R&B...
Tin nhắn của người dùng: "${userMessage}"

Hãy phân tích và trả về JSON:
{
  "genres": ["Lo-fi", "Jazz"],
  "reason": "Lý do gợi ý..."
}`;
```

### Bước 4: Gemini AI phân tích và trả về genre

```json
{
  "genres": ["Lo-fi", "Chillhop", "Jazz"],
  "reason": "Vì bạn đang buồn và cần thư giãn, tôi gợi ý Lo-fi và Jazz giúp bạn thư giãn"
}
```

### Bước 5: Backend query bài hát theo genre

```javascript
// aiRecommendationModel.js - getSongsByGenreNames()

SELECT s.*, a.name as artist_name, g.name as genre_name
FROM songs s
JOIN artists a ON s.artist_id = a.artist_id
JOIN genres g ON s.genre_id = g.genre_id
WHERE LOWER(g.name) = ANY(['lo-fi', 'chillhop', 'jazz'])
ORDER BY s.views DESC
```

### Bước 6: Trả về kết quả cho App

```json
{
  "success": true,
  "data": {
    "userMessage": "Tôi đang buồn",
    "suggestedGenres": ["Lo-fi", "Chillhop", "Jazz"],
    "reason": "Vì bạn đang buồn, tôi gợi ý nhạc Lo-fi và Jazz để thư giãn",
    "songs": [
      {
        "song_id": 1,
        "title": "Chill Beats",
        "artist_name": "Lo-fi Artist",
        "audio_url": "...",
        "genre_name": "Lo-fi"
      }
    ],
    "totalSongs": 15
  }
}
```

---

## Các thể loại nhạc hỗ trợ

| Thể loại    | Mô tả            | Tâm trạng phù hợp    |
| ----------- | ---------------- | -------------------- |
| Pop         | Nhạc đại chúng   | Vui vẻ, năng động    |
| Rock        | Nhạc rock        | Mạnh mẽ, phấn khích  |
| Electronic  | Nhạc điện tử     | Sôi động, tiệc tùng  |
| Lo-fi       | Nhạc lo-fi       | Thư giãn, làm việc   |
| Indie       | Nhạc indie       | Tĩnh lặng, suy tư    |
| Jazz        | Nhạc jazz        | Sang trọng, thư giãn |
| R&B         | Rhythm and Blues | Lãng mạn, cảm xúc    |
| Synthwave   | Nhạc synthwave   | Hoài cổ, retro       |
| Alternative | Nhạc alternative | Khác biệt, sáng tạo  |
| Chillhop    | Nhạc chillhop    | Tập trung, học tập   |

---

## Ví dụ mapping tâm trạng → Genre

| Tin nhắn user                   | Genres gợi ý           |
| ------------------------------- | ---------------------- |
| "Tôi đang buồn"                 | Lo-fi, R&B, Jazz       |
| "Tôi muốn nghe nhạc sôi động"   | Pop, Electronic, Rock  |
| "Tôi cần tập trung học bài"     | Lo-fi, Chillhop, Jazz  |
| "Tôi đang đi chơi với bạn bè"   | Pop, Electronic, Indie |
| "Tôi muốn thư giãn sau giờ làm" | Lo-fi, Chillhop, Jazz  |

---

## Tính năng nổi bật

### 1. Chat UI đẹp

- Giao diện chat bubble như Messenger
- Avatar AI robot
- Loading indicator khi AI đang xử lý

### 2. Hiển thị genre pills

- Các genre được gợi ý hiển thị như pills
- Màu sắc phân biệt rõ ràng

### 3. Danh sách bài hát

- Hiển thị tối đa 5 bài hát trong chat bubble
- Có thể phát trực tiếp
- Nút "Xem tất cả" nếu có nhiều bài

### 4. Tạo playlist từ gợi ý

- Nút "Tạo playlist" trong mỗi response
- Tạo playlist mới với tất cả bài hát được gợi ý

---

## API Endpoints

| Method | Endpoint                   | Mô tả                     |
| ------ | -------------------------- | ------------------------- |
| `POST` | `/api/ai/recommend`        | Gợi ý nhạc theo tin nhắn  |
| `GET`  | `/api/ai/genres`           | Lấy danh sách thể loại    |
| `GET`  | `/api/ai/songs/:genreName` | Lấy bài hát theo thể loại |

---

## Cấu hình môi trường

### Backend (.env)

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Lấy API Key

1. Truy cập https://ai.google.dev/
2. Tạo project mới hoặc chọn project có sẵn
3. Enable Generative Language API
4. Tạo API Key và copy vào .env

---

## Files liên quan

### Backend

| File                                        | Mô tả                     |
| ------------------------------------------- | ------------------------- |
| `controllers/aiRecommendationController.js` | Logic xử lý AI + prompt   |
| `models/aiRecommendationModel.js`           | Query database theo genre |
| `routes/aiRecommendationRoute.js`           | Route definitions         |

### Mobile App

| File                      | Mô tả                              |
| ------------------------- | ---------------------------------- |
| `screens/AIChatScreen.js` | UI chat với AI                     |
| `services/api.js`         | API calls (`getAIRecommendations`) |
| `components/SongItem.js`  | Hiển thị bài hát trong chat        |

---

## Xử lý lỗi

### Fallback khi không parse được JSON

```javascript
// Nếu AI trả về format không đúng
aiSuggestion = {
  genres: ["Pop"],
  reason: "Không thể phân tích yêu cầu, gợi ý nhạc Pop phổ biến",
};
```

### Validate genres

```javascript
// Chỉ lấy genre có trong database
const validGenres = aiSuggestion.genres.filter((genre) =>
  AVAILABLE_GENRES.some((g) => g.toLowerCase() === genre.toLowerCase())
);

// Fallback nếu không có genre hợp lệ
if (validGenres.length === 0) {
  validGenres.push("Pop");
}
```

---

## Prompt Engineering

### Cấu trúc prompt

```
1. Role: "Bạn là AI chuyên gia âm nhạc"
2. Context: Danh sách genre có sẵn
3. Input: Tin nhắn user
4. Output format: JSON với genres + reason
5. Rules: Chỉ chọn từ genre có sẵn, 1-3 genres, tiếng Việt
6. Examples: Ví dụ cụ thể
```

### Tại sao dùng JSON output?

- Dễ parse ở backend
- Cấu trúc nhất quán
- Tách biệt genres và reason

---

## Hiệu suất

| Yếu tố                 | Giá trị                              |
| ---------------------- | ------------------------------------ |
| Gemini model           | `gemini-2.5-flash` (nhanh, miễn phí) |
| Thời gian phản hồi AI  | ~1-3 giây                            |
| Query database         | ~50-100ms                            |
| Max songs per response | Không giới hạn (sort by views)       |
