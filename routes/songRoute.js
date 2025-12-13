const express = require("express");
const router = express.Router();

const songController = require("../controllers/songController");

router.get("/all-songs", songController.getSongs);

module.exports = router;
