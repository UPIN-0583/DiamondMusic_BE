const express = require("express");
const router = express.Router();

const gplaylistController = require("../controllers/gplaylistController");

router.get("/all-gplaylists", gplaylistController.getGPlaylists);
router.get("/:id", gplaylistController.getPlaylistDetail);

module.exports = router;
