-- =============================================
-- LYRICS TABLE MIGRATION FOR DIAMOND MUSIC
-- PostgreSQL Full-Text Search with Vietnamese Support
-- =============================================

-- 1. Tạo function chuyển tiếng Việt có dấu → không dấu
CREATE OR REPLACE FUNCTION remove_vietnamese_accents(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN translate(
    input_text,
    'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ',
    'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Tạo bảng lyrics với cả nội dung có dấu và không dấu
CREATE TABLE IF NOT EXISTS lyrics (
  lyrics_id SERIAL PRIMARY KEY,
  song_id INTEGER NOT NULL REFERENCES songs(song_id) ON DELETE CASCADE,
  content TEXT NOT NULL,                     -- Lời bài hát gốc (có dấu)
  normalized_content TEXT,                   -- Lời bài hát không dấu (auto-generated)
  language VARCHAR(10) DEFAULT 'vi',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Thêm trigger tự động tạo normalized_content khi INSERT/UPDATE
CREATE OR REPLACE FUNCTION update_normalized_content()
RETURNS TRIGGER AS $$
BEGIN
  NEW.normalized_content := lower(remove_vietnamese_accents(NEW.content));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_normalize_lyrics
BEFORE INSERT OR UPDATE ON lyrics
FOR EACH ROW
EXECUTE FUNCTION update_normalized_content();

-- 4. Thêm cột tsvector cho Full-Text Search (cả có dấu và không dấu)
ALTER TABLE lyrics 
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 5. Tạo function cập nhật search_vector với trọng số
-- Weight A = cao nhất, D = thấp nhất
CREATE OR REPLACE FUNCTION update_lyrics_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('simple', COALESCE(NEW.content, '')), 'B') ||      -- Lyrics gốc (weight B)
    setweight(to_tsvector('simple', COALESCE(NEW.normalized_content, '')), 'C'); -- Lyrics không dấu (weight C)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_search_vector
BEFORE INSERT OR UPDATE ON lyrics
FOR EACH ROW
EXECUTE FUNCTION update_lyrics_search_vector();

-- 6. Tạo GIN index để tăng tốc Full-Text Search
CREATE INDEX IF NOT EXISTS idx_lyrics_search ON lyrics USING GIN(search_vector);

-- 7. Index cho foreign key
CREATE INDEX IF NOT EXISTS idx_lyrics_song_id ON lyrics(song_id);

-- 8. Unique constraint: mỗi bài hát chỉ có 1 lyrics
CREATE UNIQUE INDEX IF NOT EXISTS idx_lyrics_song_unique ON lyrics(song_id);

-- 9. Thêm cột search_vector cho bảng songs (để tìm theo title)
-- Chạy riêng nếu muốn tìm kiếm kết hợp title + lyrics
ALTER TABLE songs 
ADD COLUMN IF NOT EXISTS title_search_vector tsvector;

ALTER TABLE songs 
ADD COLUMN IF NOT EXISTS normalized_title TEXT;

-- 10. Function cập nhật title search vector
CREATE OR REPLACE FUNCTION update_song_title_search()
RETURNS TRIGGER AS $$
BEGIN
  NEW.normalized_title := lower(remove_vietnamese_accents(COALESCE(NEW.title, '')));
  NEW.title_search_vector := 
    setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||           -- Title gốc (weight A - cao nhất)
    setweight(to_tsvector('simple', COALESCE(NEW.normalized_title, '')), 'A');  -- Title không dấu
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_song_search
BEFORE INSERT OR UPDATE ON songs
FOR EACH ROW
EXECUTE FUNCTION update_song_title_search();

-- 11. Index cho title search
CREATE INDEX IF NOT EXISTS idx_songs_title_search ON songs USING GIN(title_search_vector);

-- 12. Cập nhật tất cả songs hiện có để tạo search vector
UPDATE songs SET title = title WHERE title IS NOT NULL;

-- =============================================
-- HƯỚNG DẪN SỬ DỤNG:
-- =============================================
-- 
-- Tìm kiếm sẽ hoạt động như sau:
-- 
-- Input: "dung di" (không dấu)
-- → Tìm được: "Em ơi đừng đi" ✅
-- 
-- Input: "đừng đi" (có dấu)  
-- → Tìm được: "Em ơi đừng đi" ✅
--
-- Ranking priorities:
-- A (0.1) - Title (cao nhất)
-- B (0.4) - Lyrics gốc
-- C (0.2) - Lyrics không dấu
-- D (0.1) - thấp nhất
--
-- ts_rank_cd(): Ưu tiên từ gần nhau (cover density)
-- =============================================
