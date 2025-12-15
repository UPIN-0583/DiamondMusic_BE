const express = require("express");
const router = express.Router();
const aiRecommendationController = require("../controllers/aiRecommendationController");

// POST /api/ai/recommend - Get music recommendations based on user message
router.post("/recommend", aiRecommendationController.getRecommendations);

// GET /api/ai/genres - Get all available genres
router.get("/genres", aiRecommendationController.getAvailableGenres);

// GET /api/ai/songs/:genreName - Get songs by specific genre
router.get("/songs/:genreName", aiRecommendationController.getSongsByGenre);

module.exports = router;
