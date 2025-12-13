const express = require("express");
const router = express.Router();

const genreController = require("../controllers/genreController");

router.get("/all-genres", genreController.getGenres);

module.exports = router;
