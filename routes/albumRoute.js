const express = require("express");
const router = express.Router();

const albumController = require("../controllers/albumController");

router.get("/all-albums", albumController.getAlbums);

module.exports = router;
