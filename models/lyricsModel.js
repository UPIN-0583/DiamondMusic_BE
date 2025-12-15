const { db } = require("../config/db");

/**
 * Hàm chuyển tiếng Việt có dấu → không dấu (phía backend)
 * Đồng bộ với function trong PostgreSQL
 */
const removeVietnameseAccents = (str) => {
  if (!str) return "";
  const accentsMap = {
    á: "a",
    à: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ắ: "a",
    ằ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    â: "a",
    ấ: "a",
    ầ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    é: "e",
    è: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ế: "e",
    ề: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    í: "i",
    ì: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ó: "o",
    ò: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ố: "o",
    ồ: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ớ: "o",
    ờ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ú: "u",
    ù: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ứ: "u",
    ừ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ý: "y",
    ỳ: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
    đ: "d",
    Á: "A",
    À: "A",
    Ả: "A",
    Ã: "A",
    Ạ: "A",
    Ă: "A",
    Ắ: "A",
    Ằ: "A",
    Ẳ: "A",
    Ẵ: "A",
    Ặ: "A",
    Â: "A",
    Ấ: "A",
    Ầ: "A",
    Ẩ: "A",
    Ẫ: "A",
    Ậ: "A",
    É: "E",
    È: "E",
    Ẻ: "E",
    Ẽ: "E",
    Ẹ: "E",
    Ê: "E",
    Ế: "E",
    Ề: "E",
    Ể: "E",
    Ễ: "E",
    Ệ: "E",
    Í: "I",
    Ì: "I",
    Ỉ: "I",
    Ĩ: "I",
    Ị: "I",
    Ó: "O",
    Ò: "O",
    Ỏ: "O",
    Õ: "O",
    Ọ: "O",
    Ô: "O",
    Ố: "O",
    Ồ: "O",
    Ổ: "O",
    Ỗ: "O",
    Ộ: "O",
    Ơ: "O",
    Ớ: "O",
    Ờ: "O",
    Ở: "O",
    Ỡ: "O",
    Ợ: "O",
    Ú: "U",
    Ù: "U",
    Ủ: "U",
    Ũ: "U",
    Ụ: "U",
    Ư: "U",
    Ứ: "U",
    Ừ: "U",
    Ử: "U",
    Ữ: "U",
    Ự: "U",
    Ý: "Y",
    Ỳ: "Y",
    Ỷ: "Y",
    Ỹ: "Y",
    Ỵ: "Y",
    Đ: "D",
  };

  return str
    .split("")
    .map((char) => accentsMap[char] || char)
    .join("");
};

const Lyrics = {
  /**
   * Tìm kiếm bài hát theo lời bài hát (Full-Text Search nâng cao)
   * - Hỗ trợ cả có dấu và không dấu
   * - Ranking theo: title (A) > lyrics gốc (B) > lyrics không dấu (C)
   * - ts_rank_cd: ưu tiên từ gần nhau
   *
   * @param {string} query - Đoạn lời bài hát cần tìm
   * @param {number} limit - Số kết quả tối đa
   */
  searchByLyrics: async (query, limit = 10) => {
    // Chuẩn hóa query
    const trimmedQuery = query.trim();
    const normalizedQuery = removeVietnameseAccents(trimmedQuery).toLowerCase();

    // Tạo tsquery cho cả có dấu và không dấu
    const searchTermsOriginal = trimmedQuery
      .split(/\s+/)
      .filter((term) => term.length > 0)
      .join(" & ");

    const searchTermsNormalized = normalizedQuery
      .split(/\s+/)
      .filter((term) => term.length > 0)
      .join(" & ");

    // Query kết hợp tìm trong title và lyrics
    // ts_rank_cd: cover density - ưu tiên từ gần nhau
    const results = await db`
      SELECT 
        s.song_id,
        s.title,
        s.duration,
        s.audio_url,
        s.image_url,
        s.views,
        a.artist_id,
        a.name as artist_name,
        a.image_url as artist_image_url,
        l.lyrics_id,
        (
          COALESCE(ts_rank_cd(s.title_search_vector, to_tsquery('simple', ${searchTermsOriginal})), 0) * 4 +
          COALESCE(ts_rank_cd(s.title_search_vector, to_tsquery('simple', ${searchTermsNormalized})), 0) * 4 +
          COALESCE(ts_rank_cd(l.search_vector, to_tsquery('simple', ${searchTermsOriginal})), 0) * 2 +
          COALESCE(ts_rank_cd(l.search_vector, to_tsquery('simple', ${searchTermsNormalized})), 0)
        ) as relevance_rank,
        ts_headline('simple', l.content, to_tsquery('simple', ${searchTermsOriginal}), 
          'StartSel=<mark>, StopSel=</mark>, MaxWords=35, MinWords=15') as lyrics_snippet
      FROM songs s
      LEFT JOIN lyrics l ON s.song_id = l.song_id
      LEFT JOIN artists a ON s.artist_id = a.artist_id
      WHERE 
        (l.search_vector @@ to_tsquery('simple', ${searchTermsOriginal}))
        OR (l.search_vector @@ to_tsquery('simple', ${searchTermsNormalized}))
        OR (s.title_search_vector @@ to_tsquery('simple', ${searchTermsOriginal}))
        OR (s.title_search_vector @@ to_tsquery('simple', ${searchTermsNormalized}))
      ORDER BY relevance_rank DESC
      LIMIT ${limit}
    `;

    return results;
  },

  /**
   * Tìm kiếm fuzzy (tìm gần đúng) khi Full-Text không có kết quả
   * Sử dụng ILIKE với cả có dấu và không dấu
   *
   * @param {string} query - Đoạn lời bài hát cần tìm
   * @param {number} limit - Số kết quả tối đa
   */
  fuzzySearch: async (query, limit = 10) => {
    const trimmedQuery = query.trim();
    const normalizedQuery = removeVietnameseAccents(trimmedQuery).toLowerCase();

    const searchPattern = `%${trimmedQuery}%`;
    const normalizedPattern = `%${normalizedQuery}%`;

    const results = await db`
      SELECT 
        s.song_id,
        s.title,
        s.duration,
        s.audio_url,
        s.image_url,
        s.views,
        a.artist_id,
        a.name as artist_name,
        a.image_url as artist_image_url,
        l.lyrics_id,
        CASE 
          WHEN s.title ILIKE ${searchPattern} THEN 1.0
          WHEN s.normalized_title ILIKE ${normalizedPattern} THEN 0.9
          WHEN l.content ILIKE ${searchPattern} THEN 0.7
          WHEN l.normalized_content ILIKE ${normalizedPattern} THEN 0.5
          ELSE 0.1
        END as relevance_rank,
        SUBSTRING(l.content, 1, 200) as lyrics_snippet
      FROM songs s
      LEFT JOIN lyrics l ON s.song_id = l.song_id
      LEFT JOIN artists a ON s.artist_id = a.artist_id
      WHERE 
        s.title ILIKE ${searchPattern}
        OR s.normalized_title ILIKE ${normalizedPattern}
        OR l.content ILIKE ${searchPattern}
        OR l.normalized_content ILIKE ${normalizedPattern}
      ORDER BY relevance_rank DESC
      LIMIT ${limit}
    `;

    return results;
  },

  /**
   * Lấy lyrics của một bài hát
   * @param {number} songId - ID bài hát
   */
  getLyricsBySongId: async (songId) => {
    const result = await db`
      SELECT 
        l.lyrics_id,
        l.song_id,
        l.content,
        l.language,
        l.created_at,
        l.updated_at,
        s.title,
        a.name as artist_name
      FROM lyrics l
      JOIN songs s ON l.song_id = s.song_id
      JOIN artists a ON s.artist_id = a.artist_id
      WHERE l.song_id = ${songId}
    `;

    return result[0] || null;
  },

  /**
   * Thêm lyrics mới cho bài hát
   * normalized_content sẽ được tự động tạo bởi trigger
   *
   * @param {number} songId - ID bài hát
   * @param {string} content - Nội dung lyrics
   * @param {string} language - Ngôn ngữ (mặc định: 'vi')
   */
  addLyrics: async (songId, content, language = "vi") => {
    const result = await db`
      INSERT INTO lyrics (song_id, content, language)
      VALUES (${songId}, ${content}, ${language})
      RETURNING lyrics_id, song_id, content, normalized_content, language, created_at
    `;

    return result[0];
  },

  /**
   * Cập nhật lyrics
   * @param {number} lyricsId - ID lyrics
   * @param {string} content - Nội dung lyrics mới
   */
  updateLyrics: async (lyricsId, content) => {
    const result = await db`
      UPDATE lyrics 
      SET content = ${content}, updated_at = CURRENT_TIMESTAMP
      WHERE lyrics_id = ${lyricsId}
      RETURNING lyrics_id, song_id, content, normalized_content, language, updated_at
    `;

    return result[0];
  },

  /**
   * Xóa lyrics
   * @param {number} lyricsId - ID lyrics
   */
  deleteLyrics: async (lyricsId) => {
    const result = await db`
      DELETE FROM lyrics WHERE lyrics_id = ${lyricsId}
      RETURNING lyrics_id
    `;

    return result[0];
  },

  /**
   * Kiểm tra bài hát đã có lyrics chưa
   * @param {number} songId - ID bài hát
   */
  hasLyrics: async (songId) => {
    const result = await db`
      SELECT EXISTS(SELECT 1 FROM lyrics WHERE song_id = ${songId}) as exists
    `;

    return result[0].exists;
  },
};

module.exports = Lyrics;
