const express = require("express");
const router = express.Router();

const lyricsController = require("../controllers/lyricsController");

// Public routes
router.post("/search", lyricsController.searchByLyrics);
router.get("/:songId", lyricsController.getLyrics);

// Admin routes (có thể thêm middleware auth sau)
router.post("/", lyricsController.addLyrics);
router.put("/:lyricsId", lyricsController.updateLyrics);
router.delete("/:lyricsId", lyricsController.deleteLyrics);

module.exports = router;
