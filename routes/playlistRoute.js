const express = require("express");
const router = express.Router();
const authUser = require("../middleware/authUser");

const playlistController = require("../controllers/playlistController");

router.get("/all-playlists", authUser, playlistController.getPlaylists);
router.post("/add-playlist", authUser, playlistController.addPlaylist);
router.post("/add-song", authUser, playlistController.addSongToPlaylist);
router.post("/remove-song", authUser, playlistController.remveFromPlaylist);

module.exports = router;
