const express = require("express");
const router = express.Router();
const authUser = require("../middleware/authUser");

const userController = require("../controllers/userController");

router.get("/user-info", authUser, userController.getUserInfo);
router.get("/liked-songs", authUser, userController.getUserLikedSongs);
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);
router.post("/add-favourite-song", authUser, userController.addFavouritedSong);
router.delete(
  "/remove-favourite-song",
  authUser,
  userController.removeFavouritedSong
);
router.post(
  "/add-favourite-artist",
  authUser,
  userController.addFavouritedArtist
);
router.delete(
  "/remove-favourite-artist",
  authUser,
  userController.removeFavouritedArtist
);

module.exports = router;
