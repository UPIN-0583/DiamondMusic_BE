const express = require("express");
const router = express.Router();

const artistController = require("../controllers/artistController");

router.get("/all-artists", artistController.getArtists);
router.get("/:id", artistController.getArtistDetail);

module.exports = router;
