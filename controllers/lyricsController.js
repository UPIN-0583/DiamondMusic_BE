const Lyrics = require("../models/lyricsModel.js");

/**
 * Tìm kiếm bài hát theo lời bài hát
 * POST /api/lyrics/search
 */
exports.searchByLyrics = async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập lời bài hát để tìm kiếm",
      });
    }

    let searchMethod = "fulltext";

    // Thử Full-Text Search trước (có dấu + không dấu)
    let results = await Lyrics.searchByLyrics(query.trim(), limit);

    // Nếu không có kết quả, thử fuzzy search với ILIKE
    if (results.length === 0) {
      results = await Lyrics.fuzzySearch(query.trim(), limit);
      searchMethod = results.length > 0 ? "fuzzy" : "none";
    }

    res.json({
      success: true,
      results,
      total: results.length,
      searchMethod,
      query: query.trim(),
    });
  } catch (error) {
    console.error("Error in searchByLyrics:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm kiếm bài hát",
      error: error.message,
    });
  }
};

/**
 * Lấy lyrics của một bài hát
 * GET /api/lyrics/:songId
 */
exports.getLyrics = async (req, res) => {
  try {
    const { songId } = req.params;

    if (!songId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu songId",
      });
    }

    const lyrics = await Lyrics.getLyricsBySongId(parseInt(songId));

    if (!lyrics) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lời bài hát",
      });
    }

    res.json({
      success: true,
      lyrics,
    });
  } catch (error) {
    console.error("Error in getLyrics:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy lời bài hát",
      error: error.message,
    });
  }
};

/**
 * Thêm lyrics mới
 * POST /api/lyrics
 */
exports.addLyrics = async (req, res) => {
  try {
    const { songId, content, language = "vi" } = req.body;

    if (!songId || !content) {
      return res.status(400).json({
        success: false,
        message: "Thiếu songId hoặc content",
      });
    }

    // Kiểm tra bài hát đã có lyrics chưa
    const hasLyrics = await Lyrics.hasLyrics(parseInt(songId));
    if (hasLyrics) {
      return res.status(409).json({
        success: false,
        message:
          "Bài hát này đã có lời bài hát. Vui lòng sử dụng API cập nhật.",
      });
    }

    const newLyrics = await Lyrics.addLyrics(
      parseInt(songId),
      content.trim(),
      language
    );

    res.status(201).json({
      success: true,
      message: "Thêm lời bài hát thành công",
      lyrics: newLyrics,
    });
  } catch (error) {
    console.error("Error in addLyrics:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm lời bài hát",
      error: error.message,
    });
  }
};

/**
 * Cập nhật lyrics
 * PUT /api/lyrics/:lyricsId
 */
exports.updateLyrics = async (req, res) => {
  try {
    const { lyricsId } = req.params;
    const { content } = req.body;

    if (!lyricsId || !content) {
      return res.status(400).json({
        success: false,
        message: "Thiếu lyricsId hoặc content",
      });
    }

    const updatedLyrics = await Lyrics.updateLyrics(
      parseInt(lyricsId),
      content.trim()
    );

    if (!updatedLyrics) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lyrics để cập nhật",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật lời bài hát thành công",
      lyrics: updatedLyrics,
    });
  } catch (error) {
    console.error("Error in updateLyrics:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật lời bài hát",
      error: error.message,
    });
  }
};

/**
 * Xóa lyrics
 * DELETE /api/lyrics/:lyricsId
 */
exports.deleteLyrics = async (req, res) => {
  try {
    const { lyricsId } = req.params;

    if (!lyricsId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu lyricsId",
      });
    }

    const deletedLyrics = await Lyrics.deleteLyrics(parseInt(lyricsId));

    if (!deletedLyrics) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lyrics để xóa",
      });
    }

    res.json({
      success: true,
      message: "Xóa lời bài hát thành công",
    });
  } catch (error) {
    console.error("Error in deleteLyrics:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa lời bài hát",
      error: error.message,
    });
  }
};
