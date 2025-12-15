# Tìm kiếm bài hát qua Lời bài hát (Lyrics Search)

## Tổng quan

Tính năng cho phép người dùng tìm kiếm bài hát bằng cách nhập một đoạn lời bài hát. Hệ thống sử dụng **PostgreSQL Full-Text Search** kết hợp với xử lý tiếng Việt để tìm kiếm hiệu quả.

---

## Kiến trúc hệ thống

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Mobile App    │────▶│   Backend API   │────▶│   PostgreSQL    │
│  (React Native) │◀────│   (Express.js)  │◀────│ (Full-Text Search)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Luồng hoạt động chi tiết

### Bước 1: User nhập lời bài hát

- User mở **SearchScreen** → chọn tab **"Lời bài hát"**
- Hoặc sử dụng **Voice Search** nói lời bài hát
- Có thể nhập tiếng Việt **có dấu** hoặc **không dấu**

### Bước 2: App gọi API

```javascript
// services/api.js
POST /api/lyrics/search
Body: { "query": "dung di", "limit": 10 }
```

### Bước 3: Backend xử lý query

```javascript
// lyricsModel.js - searchByLyrics()

1. Chuẩn hóa query
   - Query gốc: "dung di"
   - Query không dấu: removeVietnameseAccents("dung di") → "dung di"

2. Tạo tsquery cho PostgreSQL
   - "dung & di" (tìm bài có CẢ HAI từ)
```

### Bước 4: PostgreSQL Full-Text Search

```sql
-- Tìm trong cả title và lyrics
WHERE
  l.search_vector @@ to_tsquery('simple', 'dung & di')  -- lyrics
  OR s.title_search_vector @@ to_tsquery('simple', 'dung & di')  -- title
```

### Bước 5: Ranking kết quả

```sql
-- Ranking với trọng số
(
  ts_rank_cd(s.title_search_vector, query) * 4 +    -- Title (cao nhất)
  ts_rank_cd(l.search_vector, query_original) * 2 + -- Lyrics gốc
  ts_rank_cd(l.search_vector, query_normalized) * 1 -- Lyrics không dấu
) as relevance_rank

ORDER BY relevance_rank DESC
```

### Bước 6: Trả về kết quả

```json
{
  "success": true,
  "results": [
    {
      "song_id": 1,
      "title": "Em ơi đừng đi",
      "artist_name": "Chi Dân",
      "relevance_rank": 2.5,
      "lyrics_snippet": "...em ơi <mark>đừng đi</mark> anh xin em..."
    }
  ],
  "total": 1,
  "searchMethod": "fulltext"
}
```

---

## Xử lý tiếng Việt

### Function bỏ dấu (PostgreSQL)

```sql
CREATE FUNCTION remove_vietnamese_accents(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN translate(
    input_text,
    'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệ...',
    'aaaaaaaaaaaaaaaaaeeeeeeeeee...'
  );
END;
$$ LANGUAGE plpgsql;
```

### Trigger tự động tạo normalized_content

```sql
-- Khi INSERT/UPDATE lyrics
NEW.normalized_content := lower(remove_vietnamese_accents(NEW.content));
NEW.search_vector :=
  setweight(to_tsvector('simple', content), 'B') ||
  setweight(to_tsvector('simple', normalized_content), 'C');
```

---

## Cấu trúc Database

### Bảng `lyrics`

| Cột                  | Kiểu        | Mô tả                  |
| -------------------- | ----------- | ---------------------- |
| `lyrics_id`          | SERIAL      | Primary key            |
| `song_id`            | INTEGER     | FK → songs             |
| `content`            | TEXT        | Lời gốc (có dấu)       |
| `normalized_content` | TEXT        | Lời không dấu (auto)   |
| `search_vector`      | tsvector    | Vector tìm kiếm (auto) |
| `language`           | VARCHAR(10) | Ngôn ngữ ("vi", "en")  |

### Bảng `songs` (bổ sung)

| Cột                   | Kiểu     | Mô tả                  |
| --------------------- | -------- | ---------------------- |
| `normalized_title`    | TEXT     | Tên không dấu (auto)   |
| `title_search_vector` | tsvector | Vector tìm kiếm (auto) |

---

## Chiến lược tìm kiếm

### 1. Full-Text Search (ưu tiên)

- Sử dụng `to_tsvector` và `to_tsquery`
- Dictionary: `'simple'` (hoạt động với mọi ngôn ngữ)
- Ranking: `ts_rank_cd()` (ưu tiên từ gần nhau)

### 2. Fuzzy Search (fallback)

- Khi Full-Text không có kết quả
- Sử dụng `ILIKE '%query%'`
- Tìm substring gần đúng

---

## Ví dụ tìm kiếm

| Input       | Tìm được           | Giải thích                      |
| ----------- | ------------------ | ------------------------------- |
| `"đừng đi"` | ✅ "Em ơi đừng đi" | Match chính xác                 |
| `"dung di"` | ✅ "Em ơi đừng đi" | Match qua normalized_content    |
| `"đi đừng"` | ✅ "Em ơi đừng đi" | Full-Text không quan tâm thứ tự |
| `"em ơi"`   | ✅ Nhiều bài       | Match 2 từ phổ biến             |
| `"xyz123"`  | ❌ Không có        | Không match                     |

---

## API Endpoints

| Method   | Endpoint                | Mô tả                   |
| -------- | ----------------------- | ----------------------- |
| `POST`   | `/api/lyrics/search`    | Tìm bài hát theo lyrics |
| `GET`    | `/api/lyrics/:songId`   | Lấy lyrics của bài hát  |
| `POST`   | `/api/lyrics`           | Thêm lyrics mới         |
| `PUT`    | `/api/lyrics/:lyricsId` | Cập nhật lyrics         |
| `DELETE` | `/api/lyrics/:lyricsId` | Xóa lyrics              |

---

## Files liên quan

### Backend

- `models/lyricsModel.js` - Database queries
- `controllers/lyricsController.js` - API handlers
- `routes/lyricsRoute.js` - Route definitions
- `migrations/upgrade_lyrics_table.sql` - Database schema

### Mobile App

- `services/api.js` - API calls
- `screens/SearchScreen.js` - UI với tab Lyrics

---

## Tối ưu hiệu suất

1. **GIN Index** trên `search_vector` - tăng tốc Full-Text Search
2. **Triggers** tự động - không cần cập nhật thủ công
3. **Debounce 500ms** trên app - giảm số lượng API calls
4. **Limit results** - mặc định 10-15 kết quả
